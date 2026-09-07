import test from 'node:test';
import assert from 'node:assert/strict';
import { onRequestPost } from './submit.js';

test('attachments reach email intact, source reaches email and CRM, invalid files never send', async () => {
  const originalFetch = globalThis.fetch;
  const calls = [], tasks = [];
  const data = { name: 'Local test', email: 'test@example.com', product_type: 'Yoga set', language: 'es', page_path: '/es/contact/', page_url: 'https://www.fitcloo.com/es/contact/?utm_source=qa', landing_page: 'https://www.fitcloo.com/?utm_source=qa', utm_source: 'qa', referrer: 'https://example.com/', product_code: 'TZ4535-12' };
  const env = { RESEND_API_KEY: 'mock', CRM_WEBHOOK_URL: 'https://crm.example.com', CRM_API_SECRET: 'mock' };
  let providerFails = false;
  globalThis.fetch = async (url, options) => {
    calls.push({ url: String(url), data: JSON.parse(options.body) });
    return new Response(JSON.stringify(providerFails ? { error: 'mock failure' } : { id: 'mock-email' }), { status: providerFails ? 503 : 200 });
  };
  const send = body => onRequestPost({ request: new Request('https://www.fitcloo.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }), env, waitUntil: task => tasks.push(task) });
  try {
    for (const [filename, bytes] of [['logo.png', '\x89PNG\r\n\x1a\nfixture'], ['brief.pdf', '%PDF-1.7\nfixture'], ['design.ai', '%!PS-Adobe-3.0\nfixture']]) {
      const attachment = { filename, content: btoa(bytes) };
      const response = await send({ ...data, attachment });
      assert.equal(response.status, 200); await Promise.all(tasks);
      const email = calls.at(-2).data, crm = calls.at(-1).data;
      assert.deepEqual(email.attachments, [attachment]);
      assert.ok(email.html.includes('utm_source') && email.html.includes('qa'));
      assert.equal(crm.attribution.utm_source, 'qa'); assert.equal(crm.productCode, data.product_code);
      assert.equal(crm.attachmentFilename, filename); assert.equal(crm.attachment, undefined);
    }
    const count = calls.length;
    for (const attachment of [null, { filename: '../evil.pdf', content: btoa('%PDF-1.7') }, { filename: 'x.exe', content: btoa('MZ') }, { filename: 'x.png', content: btoa('not a PNG') }, { filename: 'x.pdf', content: '%%%%' }, { filename: 'x.pdf', content: btoa('%PDF-' + 'x'.repeat(10 * 1024 * 1024)) }]) {
      assert.equal((await send({ ...data, attachment })).status, 400);
    }
    assert.equal(calls.length, count);
    assert.equal((await send({ ...data, website: 'spam' })).status, 200);
    assert.equal(calls.length, count);
    assert.equal((await send({ ...data, name: ' ' })).status, 400);
    assert.equal((await send({ ...data, email: [] })).status, 400);
    providerFails = true;
    const failed = await send(data);
    assert.equal(failed.status, 502); assert.equal((await failed.json()).success, undefined);
    assert.equal(calls.length, count + 1);
  } finally { globalThis.fetch = originalFetch; }
});
