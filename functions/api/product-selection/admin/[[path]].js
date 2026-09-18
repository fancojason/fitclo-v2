import {
  clean,
  clearAdminCookie,
  createAdminCookie,
  createSelectionWorkbook,
  isAdmin,
  json,
  listStyles,
  parseSizes,
  passwordsMatch,
  SIZE_KEYS,
} from '../../../_lib/product-selection.js';

const route = (context) => Array.isArray(context.params.path) ? context.params.path.join('/') : String(context.params.path || '');
const imageTypes = new Map([['image/jpeg', 'jpg'], ['image/png', 'png'], ['image/webp', 'webp']]);

function hasValidImageSignature(bytes, type) {
  const startsWith = (...signature) => signature.every((value, index) => bytes[index] === value);
  if (type === 'image/jpeg') return startsWith(0xff, 0xd8, 0xff);
  if (type === 'image/png') return startsWith(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a);
  if (type === 'image/webp') {
    return startsWith(0x52, 0x49, 0x46, 0x46)
      && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;
  }
  return false;
}

async function ipHash(request) {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip));
  return [...new Uint8Array(digest)].map((value) => value.toString(16).padStart(2, '0')).join('');
}

async function login(context) {
  if (!context.env.ADMIN_PASSWORD || !context.env.ADMIN_SESSION_SECRET) return json({ error: 'Admin authentication is not configured.' }, 503);
  const db = context.env.PRODUCT_SELECTION_DB;
  const key = await ipHash(context.request);
  const now = Date.now();
  const attempt = await db.prepare('SELECT attempts, window_started_at FROM product_selection_login_attempts WHERE ip_hash = ?').bind(key).first();
  if (attempt && now - attempt.window_started_at < 15 * 60 * 1000 && attempt.attempts >= 5) return json({ error: 'Too many login attempts. Try again later.' }, 429);
  let body;
  try { body = await context.request.json(); } catch { return json({ error: 'Invalid request.' }, 400); }
  if (!await passwordsMatch(clean(body?.password, 500), context.env.ADMIN_PASSWORD)) {
    if (!attempt || now - attempt.window_started_at >= 15 * 60 * 1000) {
      await db.prepare('INSERT INTO product_selection_login_attempts (ip_hash, attempts, window_started_at) VALUES (?, 1, ?) ON CONFLICT(ip_hash) DO UPDATE SET attempts = 1, window_started_at = excluded.window_started_at').bind(key, now).run();
    } else {
      await db.prepare('UPDATE product_selection_login_attempts SET attempts = attempts + 1 WHERE ip_hash = ?').bind(key).run();
    }
    return json({ error: 'Invalid password.' }, 401);
  }
  await db.prepare('DELETE FROM product_selection_login_attempts WHERE ip_hash = ?').bind(key).run();
  return json({ success: true }, 200, { 'Set-Cookie': await createAdminCookie(context.env.ADMIN_SESSION_SECRET), 'Cache-Control': 'no-store' });
}

async function saveImage(file, env, styleNo, kind, index = 0) {
  if (!(file instanceof File) || !file.size || file.size > 8 * 1024 * 1024 || !imageTypes.has(file.type)) throw new Error('Upload JPG, PNG or WebP images up to 8 MB.');
  const buffer = await file.arrayBuffer();
  if (!hasValidImageSignature(new Uint8Array(buffer, 0, Math.min(buffer.byteLength, 16)), file.type)) throw new Error('The uploaded file content does not match its image type.');
  const styleKey = styleNo.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, 'style');
  const key = `product-selection/${styleKey}/${Date.now()}-${crypto.randomUUID()}-${kind}${index ? `-${index}` : ''}.${imageTypes.get(file.type)}`;
  const metadata = { contentType: file.type, cacheControl: 'public, max-age=31536000, immutable' };
  if (typeof env.PRODUCT_SELECTION_MEDIA.getWithMetadata === 'function') {
    await env.PRODUCT_SELECTION_MEDIA.put(key, buffer, { metadata });
  } else {
    await env.PRODUCT_SELECTION_MEDIA.put(key, buffer, { httpMetadata: metadata });
  }
  return key;
}

async function saveStyle(context, id = null) {
  let form;
  try { form = await context.request.formData(); } catch { return json({ error: 'Invalid form data.' }, 400); }
  const styleNo = clean(form.get('styleNo'), 60).toUpperCase();
  const sizes = parseSizes(form.getAll('sizes'));
  const mainFile = form.get('mainImage');
  const chartFiles = form.getAll('colorCharts').filter((value) => value instanceof File && value.size);
  if (!/^[A-Z0-9][A-Z0-9+._-]{0,59}$/.test(styleNo) || !sizes.length || chartFiles.length > 3) return json({ error: 'Enter a valid style number, select sizes and upload 1–3 color charts.' }, 400);
  const db = context.env.PRODUCT_SELECTION_DB;
  const existing = id ? await db.prepare('SELECT * FROM product_styles WHERE id = ?').bind(id).first() : null;
  if (id && !existing) return json({ error: 'Style not found.' }, 404);
  if (!id && (!(mainFile instanceof File) || !mainFile.size || !chartFiles.length)) return json({ error: 'Main image and at least one color chart are required.' }, 400);
  const oldCharts = existing ? (await db.prepare('SELECT object_key FROM product_style_color_charts WHERE style_id = ?').bind(id).all()).results : [];
  const uploaded = [];
  try {
    const mainKey = mainFile instanceof File && mainFile.size ? await saveImage(mainFile, context.env, styleNo, 'main') : existing.main_image_key;
    if (mainKey !== existing?.main_image_key) uploaded.push(mainKey);
    const chartKeys = [];
    for (let index = 0; index < chartFiles.length; index += 1) {
      const key = await saveImage(chartFiles[index], context.env, styleNo, 'chart', index + 1);
      chartKeys.push(key);
      uploaded.push(key);
    }
    let styleId = id;
    if (id) {
      await db.prepare('UPDATE product_styles SET style_no = ?, main_image_key = ?, available_sizes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(styleNo, mainKey, JSON.stringify(sizes), id).run();
    } else {
      const inserted = await db.prepare('INSERT INTO product_styles (style_no, main_image_key, available_sizes) VALUES (?, ?, ?) RETURNING id').bind(styleNo, mainKey, JSON.stringify(sizes)).first();
      styleId = inserted.id;
    }
    if (chartKeys.length) {
      await db.prepare('DELETE FROM product_style_color_charts WHERE style_id = ?').bind(styleId).run();
      await db.batch(chartKeys.map((key, index) => db.prepare('INSERT INTO product_style_color_charts (style_id, object_key, sort_order) VALUES (?, ?, ?)').bind(styleId, key, index)));
      await Promise.all(oldCharts.map((chart) => context.env.PRODUCT_SELECTION_MEDIA.delete(chart.object_key)));
    }
    if (existing && mainKey !== existing.main_image_key) await context.env.PRODUCT_SELECTION_MEDIA.delete(existing.main_image_key);
    return json({ success: true, styleId });
  } catch (error) {
    await Promise.all(uploaded.map((key) => context.env.PRODUCT_SELECTION_MEDIA.delete(key)));
    if (String(error).includes('UNIQUE')) return json({ error: 'That style number already exists.' }, 409);
    return json({ error: error instanceof Error ? error.message : 'Unable to save style.' }, 400);
  }
}

async function toggleStyle(context, id) {
  const row = await context.env.PRODUCT_SELECTION_DB.prepare('UPDATE product_styles SET active = CASE active WHEN 1 THEN 0 ELSE 1 END, updated_at = CURRENT_TIMESTAMP WHERE id = ? RETURNING active').bind(id).first();
  return row ? json({ success: true, active: Boolean(row.active) }) : json({ error: 'Style not found.' }, 404);
}

async function deleteStyle(context, id) {
  const db = context.env.PRODUCT_SELECTION_DB;
  const style = await db.prepare('SELECT main_image_key FROM product_styles WHERE id = ?').bind(id).first();
  if (!style) return json({ error: 'Style not found.' }, 404);
  const charts = (await db.prepare('SELECT object_key FROM product_style_color_charts WHERE style_id = ?').bind(id).all()).results;
  await db.prepare('DELETE FROM product_styles WHERE id = ?').bind(id).run();
  await Promise.all([style.main_image_key, ...charts.map((chart) => chart.object_key)].map((key) => context.env.PRODUCT_SELECTION_MEDIA.delete(key)));
  return json({ success: true });
}

async function listSubmissions(context) {
  const rows = (await context.env.PRODUCT_SELECTION_DB.prepare(`SELECT s.*, COUNT(i.id) AS styles, COALESCE(SUM(i.total), 0) AS total_qty FROM product_selection_submissions s LEFT JOIN product_selection_items i ON i.submission_id = s.id GROUP BY s.id ORDER BY s.submitted_at DESC LIMIT 500`).all()).results;
  return json({ submissions: rows });
}

async function submissionDetail(context, selectionId) {
  const db = context.env.PRODUCT_SELECTION_DB;
  const submission = await db.prepare('SELECT * FROM product_selection_submissions WHERE selection_id = ?').bind(selectionId).first();
  if (!submission) return null;
  const items = (await db.prepare('SELECT * FROM product_selection_items WHERE submission_id = ? ORDER BY id').bind(submission.id).all()).results;
  return { submission, items };
}

export async function onRequest(context) {
  if (!context.env.PRODUCT_SELECTION_DB) return json({ error: 'Product Selection database is not configured.' }, 503);
  const path = route(context);
  const method = context.request.method;
  if (method === 'POST' && path === 'login') return login(context);
  if (method === 'POST' && path === 'logout') return json({ success: true }, 200, { 'Set-Cookie': clearAdminCookie(), 'Cache-Control': 'no-store' });
  if (!await isAdmin(context.request, context.env)) return json({ error: 'Unauthorized.' }, 401, { 'Cache-Control': 'no-store' });
  if (!context.env.PRODUCT_SELECTION_MEDIA) return json({ error: 'Product Selection media storage is not configured.' }, 503);

  if (method === 'GET' && path === 'session') return json({ authenticated: true }, 200, { 'Cache-Control': 'no-store' });
  if (method === 'GET' && path === 'styles') return json({ styles: await listStyles(context.env.PRODUCT_SELECTION_DB) });
  if (method === 'POST' && path === 'styles') return saveStyle(context);
  const styleMatch = path.match(/^styles\/(\d+)(?:\/(toggle))?$/);
  if (styleMatch && method === 'POST' && styleMatch[2] === 'toggle') return toggleStyle(context, Number(styleMatch[1]));
  if (styleMatch && method === 'POST') return saveStyle(context, Number(styleMatch[1]));
  if (styleMatch && method === 'DELETE') return deleteStyle(context, Number(styleMatch[1]));

  if (method === 'GET' && path === 'submissions') return listSubmissions(context);
  const submissionMatch = path.match(/^submissions\/(FS-\d{8}-\d{4,})(?:\/(export))?$/);
  if (submissionMatch) {
    const detail = await submissionDetail(context, submissionMatch[1]);
    if (!detail) return json({ error: 'Submission not found.' }, 404);
    if (submissionMatch[2] === 'export') {
      const workbook = createSelectionWorkbook(detail.submission, detail.items);
      return new Response(workbook.bytes, { headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${workbook.filename}"`,
        'Cache-Control': 'no-store',
      } });
    }
    return json(detail, 200, { 'Cache-Control': 'no-store' });
  }
  return json({ error: 'Not found.' }, 404);
}
