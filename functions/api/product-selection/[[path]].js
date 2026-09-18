import { clean, getStyleWithCharts, json, parseSizes, SIZE_KEYS, toPublicStyle } from '../../_lib/product-selection.js';

const route = (context) => Array.isArray(context.params.path) ? context.params.path.join('/') : String(context.params.path || '');
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const int = (value) => Number.isInteger(Number(value)) && Number(value) >= 0 ? Number(value) : null;
const html = (value) => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');

async function searchStyle(context) {
  const styleNo = clean(new URL(context.request.url).searchParams.get('style'), 60);
  if (!styleNo) return json({ error: 'Enter a style number.' }, 400);
  const style = await getStyleWithCharts(context.env.PRODUCT_SELECTION_DB, styleNo);
  return style ? json({ style: toPublicStyle(style) }) : json({ error: 'Style not found. Please check the style number and try again.' }, 404);
}

async function sendNotification(env, submission, items) {
  if (!env.RESEND_API_KEY) return;
  const rows = items.map((item) => `<tr><td>${html(item.styleNo)}</td><td>${html(item.color)}</td>${SIZE_KEYS.map((size) => `<td>${item.quantities[size] ?? '—'}</td>`).join('')}<td>${item.total}</td></tr>`).join('');
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.RESEND_API_KEY}` },
    body: JSON.stringify({
      from: 'Fitclo Website <inquiry@fitcloo.com>',
      to: ['sales@fitcloo.com'],
      reply_to: submission.email,
      subject: `New Product Selection ${submission.selectionId} from ${submission.name.replace(/[\r\n]/g, ' ')}`,
      html: `<div style="font-family:Arial,sans-serif;color:#222"><h2>New Fitclo Product Selection</h2><p><strong>Selection ID:</strong> ${html(submission.selectionId)}</p><p><strong>Name:</strong> ${html(submission.name)}</p><p><strong>Company:</strong> ${html(submission.company || 'Not provided')}</p><p><strong>WhatsApp:</strong> ${html(submission.whatsapp)}</p><p><strong>Email:</strong> ${html(submission.email)}</p><p><strong>Country / Region:</strong> ${html(submission.country)}</p><p><strong>Notes:</strong> ${html(submission.notes || 'None')}</p><table style="border-collapse:collapse" border="1" cellpadding="7"><thead><tr><th>Style</th><th>Color</th>${SIZE_KEYS.map((size) => `<th>${size}</th>`).join('')}<th>Total</th></tr></thead><tbody>${rows}</tbody></table><p><a href="https://www.fitcloo.com/admin/product-selection/">Open Product Selection Admin</a></p></div>`,
    }),
    signal: AbortSignal.timeout(15000),
  }).then(async (response) => {
    if (!response.ok) throw new Error(`Resend ${response.status}: ${(await response.text()).slice(0, 300)}`);
  });
}

async function submitSelection(context) {
  const contentLength = Number(context.request.headers.get('content-length') || 0);
  if (contentLength > 150_000) return json({ error: 'Request too large.' }, 413);
  let body;
  try { body = await context.request.json(); } catch { return json({ error: 'Invalid JSON.' }, 400); }
  const customer = body?.customer || {};
  const name = clean(customer.name, 120);
  const company = clean(customer.company, 160);
  const whatsapp = clean(customer.whatsapp, 80);
  const email = clean(customer.email, 254).toLowerCase();
  const country = clean(customer.country, 120);
  const notes = clean(customer.notes, 2000);
  const idempotencyKey = clean(body?.idempotencyKey, 100);
  if (!name || !whatsapp || !emailPattern.test(email) || !country || !idempotencyKey) return json({ error: 'Complete all required customer fields.' }, 400);
  if (!Array.isArray(body?.items) || !body.items.length || body.items.length > 100) return json({ error: 'Add at least one product selection.' }, 400);

  const db = context.env.PRODUCT_SELECTION_DB;
  const existing = await db.prepare('SELECT selection_id FROM product_selection_submissions WHERE idempotency_key = ?').bind(idempotencyKey).first();
  if (existing) return json({ success: true, selectionId: existing.selection_id, duplicate: true });

  const validated = [];
  for (const input of body.items) {
    const styleNo = clean(input?.styleNo, 60);
    const color = clean(input?.color, 120);
    const style = await getStyleWithCharts(db, styleNo);
    if (!style || !color) return json({ error: `Invalid style or color for ${styleNo || 'selection'}.` }, 400);
    const allowedSizes = parseSizes(style.available_sizes);
    const quantities = {};
    let total = 0;
    for (const size of SIZE_KEYS) {
      if (!allowedSizes.includes(size)) {
        quantities[size] = null;
        if (Number(input?.quantities?.[size] || 0) !== 0) return json({ error: `${size} is not available for ${style.style_no}.` }, 400);
        continue;
      }
      const value = int(input?.quantities?.[size] ?? 0);
      if (value === null || value > 1_000_000) return json({ error: `Invalid ${size} quantity for ${style.style_no}.` }, 400);
      quantities[size] = value;
      total += value;
    }
    if (total <= 0) return json({ error: `Enter a quantity for ${style.style_no}.` }, 400);
    validated.push({ styleNo: style.style_no, color, quantities, total });
  }

  const date = new Date().toISOString().slice(0, 10).replaceAll('-', '');
  await db.prepare('INSERT OR IGNORE INTO product_selection_counters (selection_date, last_value) VALUES (?, 0)').bind(date).run();
  const counter = await db.prepare('UPDATE product_selection_counters SET last_value = last_value + 1 WHERE selection_date = ? RETURNING last_value').bind(date).first();
  const selectionId = `FS-${date}-${String(counter.last_value).padStart(4, '0')}`;
  const submission = await db.prepare('INSERT INTO product_selection_submissions (selection_id, idempotency_key, customer_name, company, whatsapp, email, country, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING id, submitted_at')
    .bind(selectionId, idempotencyKey, name, company, whatsapp, email, country, notes).first();
  await db.batch(validated.map((item) => db.prepare('INSERT INTO product_selection_items (submission_id, style_no_snapshot, color_snapshot, xxs, xs, s, m, l, xl, xxl, total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(submission.id, item.styleNo, item.color, ...SIZE_KEYS.map((size) => item.quantities[size]), item.total)));

  const notification = sendNotification(context.env, { selectionId, name, company, whatsapp, email, country, notes }, validated).catch((error) => console.error('Product selection email failed:', error));
  context.waitUntil?.(notification);
  return json({ success: true, selectionId, submittedAt: submission.submitted_at });
}

export async function onRequest(context) {
  if (!context.env.PRODUCT_SELECTION_DB) return json({ error: 'Product Selection database is not configured.' }, 503);
  const path = route(context);
  if (context.request.method === 'GET' && path === 'styles') return searchStyle(context);
  if (context.request.method === 'POST' && path === 'submissions') return submitSelection(context);
  return json({ error: 'Not found.' }, 404);
}
