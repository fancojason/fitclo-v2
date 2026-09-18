import { strToU8, zipSync } from 'fflate';

export const SIZE_KEYS = ['XS', 'S', 'M', 'L', 'XL'];
export const json = (data, status = 200, headers = {}) => new Response(JSON.stringify(data), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', ...headers },
});

export const clean = (value, max = 500) => String(value ?? '').trim().slice(0, max);
export const mediaUrl = (key) => `/product-selection-media/${String(key).split('/').map(encodeURIComponent).join('/')}`;

export function parseSizes(value) {
  try {
    const values = Array.isArray(value) ? value : JSON.parse(value);
    return SIZE_KEYS.filter((size) => values.includes(size));
  } catch {
    return [];
  }
}

export function toPublicStyle(row) {
  return {
    id: row.id,
    styleNo: row.style_no,
    mainImage: mediaUrl(row.main_image_key),
    mainImageKey: row.main_image_key,
    availableSizes: parseSizes(row.available_sizes),
    active: Boolean(row.active),
    colorCharts: (row.color_charts || []).map((chart) => ({
      id: chart.id,
      key: chart.object_key,
      url: mediaUrl(chart.object_key),
    })),
  };
}

const bytesToHex = (bytes) => [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
const timingSafeEqual = (left, right) => {
  if (left.length !== right.length) return false;
  let result = 0;
  for (let index = 0; index < left.length; index += 1) result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return result === 0;
};

async function hmac(value, secret) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return bytesToHex(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value)));
}

export async function createAdminCookie(secret) {
  const expires = Date.now() + 12 * 60 * 60 * 1000;
  const payload = String(expires);
  return `fitclo_ps_admin=${payload}.${await hmac(payload, secret)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=43200`;
}

export const clearAdminCookie = () => 'fitclo_ps_admin=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0';

export async function isAdmin(request, env) {
  const secret = clean(env.ADMIN_SESSION_SECRET, 500);
  if (!secret) return false;
  const token = request.headers.get('Cookie')?.match(/(?:^|;\s*)fitclo_ps_admin=([^;]+)/)?.[1] || '';
  const [expires, signature] = token.split('.');
  if (!expires || !signature || Number(expires) < Date.now()) return false;
  return timingSafeEqual(signature, await hmac(expires, secret));
}

export async function passwordsMatch(actual, expected) {
  if (!actual || !expected) return false;
  const [left, right] = await Promise.all([
    crypto.subtle.digest('SHA-256', new TextEncoder().encode(actual)),
    crypto.subtle.digest('SHA-256', new TextEncoder().encode(expected)),
  ]);
  return timingSafeEqual(bytesToHex(left), bytesToHex(right));
}

export async function getStyleWithCharts(db, styleNo, includeDisabled = false) {
  const row = await db.prepare(`SELECT * FROM product_styles WHERE style_no = ? COLLATE NOCASE ${includeDisabled ? '' : 'AND active = 1'}`).bind(styleNo).first();
  if (!row) return null;
  row.color_charts = (await db.prepare('SELECT id, object_key, sort_order FROM product_style_color_charts WHERE style_id = ? ORDER BY sort_order, id').bind(row.id).all()).results;
  return row;
}

export async function listStyles(db) {
  const rows = (await db.prepare('SELECT * FROM product_styles ORDER BY updated_at DESC, style_no').all()).results;
  if (!rows.length) return [];
  const charts = (await db.prepare('SELECT id, style_id, object_key, sort_order FROM product_style_color_charts ORDER BY sort_order, id').all()).results;
  const grouped = new Map();
  charts.forEach((chart) => grouped.set(chart.style_id, [...(grouped.get(chart.style_id) || []), chart]));
  return rows.map((row) => toPublicStyle({ ...row, color_charts: grouped.get(row.id) || [] }));
}

const xml = (value) => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
const safeFilename = (value) => clean(value, 80).replace(/[^\p{L}\p{N}_-]+/gu, '_').replace(/^_+|_+$/g, '') || 'Customer';
const columnName = (index) => {
  let value = index + 1;
  let result = '';
  while (value) {
    value -= 1;
    result = String.fromCharCode(65 + (value % 26)) + result;
    value = Math.floor(value / 26);
  }
  return result;
};

function worksheet(rows, widths, mergeCells = []) {
  const sheetRows = rows.map((row, rowIndex) => {
    const cells = row.map((cell, colIndex) => {
      const ref = `${columnName(colIndex)}${rowIndex + 1}`;
      const style = rowIndex === 0 ? 1 : rowIndex === 2 ? 2 : 3;
      return typeof cell === 'number'
        ? `<c r="${ref}" s="${style}" t="n"><v>${cell}</v></c>`
        : `<c r="${ref}" s="${style}" t="inlineStr"><is><t xml:space="preserve">${xml(cell)}</t></is></c>`;
    }).join('');
    const height = rowIndex === 0 ? 28 : rowIndex === 1 ? 22 : 20;
    return `<row r="${rowIndex + 1}" ht="${height}" customHeight="1">${cells}</row>`;
  }).join('');
  const cols = widths.map((width, index) => `<col min="${index + 1}" max="${index + 1}" width="${width}" customWidth="1"/>`).join('');
  const merges = mergeCells.length ? `<mergeCells count="${mergeCells.length}">${mergeCells.map((ref) => `<mergeCell ref="${ref}"/>`).join('')}</mergeCells>` : '';
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><cols>${cols}</cols><sheetData>${sheetRows}</sheetData>${merges}</worksheet>`;
}

export function createSelectionWorkbook(submission, items) {
  const headers = ['Style No.', 'Selected Color', 'XS', 'S', 'M', 'L', 'XL', 'Total'];
  const selectionRows = [
    ['Fitclo Activewear - Ready Stock Selection Sheet', '', '', '', '', '', '', ''],
    ['Please select your required quantity:', '', '', '', '', '', '', ''],
    headers,
    ...items.map((item) => [item.style_no_snapshot, item.color_snapshot, ...['xs', 's', 'm', 'l', 'xl'].map((size) => item[size] === null ? '—' : item[size]), item.total]),
  ];
  const customerRows = [
    ['Fitclo Customer Information', ''],
    ['', ''],
    ['Field', 'Value'],
    ['Selection ID', submission.selection_id],
    ['Name', submission.customer_name],
    ['Company / Brand', submission.company],
    ['WhatsApp', submission.whatsapp],
    ['Email', submission.email],
    ['Country / Region', submission.country],
    ['Notes', submission.notes],
    ['Submitted At', submission.submitted_at],
  ];
  const files = {
    '[Content_Types].xml': strToU8('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>'),
    '_rels/.rels': strToU8('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>'),
    'docProps/core.xml': strToU8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:creator>Fitclo</dc:creator><dc:title>${xml(submission.selection_id)}</dc:title><dcterms:created xsi:type="dcterms:W3CDTF">${new Date(submission.submitted_at).toISOString()}</dcterms:created></cp:coreProperties>`),
    'docProps/app.xml': strToU8('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>Fitclo Product Selection</Application></Properties>'),
    'xl/workbook.xml': strToU8('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Ready Stock Selection" sheetId="1" r:id="rId1"/><sheet name="Customer Info" sheetId="2" r:id="rId2"/></sheets></workbook>'),
    'xl/_rels/workbook.xml.rels': strToU8('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>'),
    'xl/styles.xml': strToU8('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="3"><font><sz val="11"/><name val="Arial"/></font><font><b/><color rgb="FFFFFFFF"/><sz val="16"/><name val="Arial"/></font><font><b/><color rgb="FFFFFFFF"/><name val="Arial"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF17365D"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="2"><border/><border><left style="thin"><color rgb="FFB7C9E2"/></left><right style="thin"><color rgb="FFB7C9E2"/></right><top style="thin"><color rgb="FFB7C9E2"/></top><bottom style="thin"><color rgb="FFB7C9E2"/></bottom></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="4"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="2" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>'),
    'xl/worksheets/sheet1.xml': strToU8(worksheet(selectionRows, [18, 24, 10, 10, 10, 10, 10, 12], ['A1:H1', 'A2:H2'])),
    'xl/worksheets/sheet2.xml': strToU8(worksheet(customerRows, [24, 70], ['A1:B1'])),
  };
  return {
    bytes: zipSync(files, { level: 6 }),
    filename: `Fitclo_Selection_${submission.selection_id}_${safeFilename(submission.customer_name)}.xlsx`,
  };
}
