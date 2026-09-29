import test from 'node:test';
import assert from 'node:assert/strict';
import { strFromU8, unzipSync } from 'fflate';
import { createSelectionWorkbook, isShopUrl, toPublicStyle } from './_lib/product-selection.js';

test('public style response never contains supplier data', () => {
  const style = toPublicStyle({ id: 1, style_no: 'TEST-1', main_image_key: 'main.png', available_sizes: '["S"]', active: 1, color_charts: [], supplier_id: 7, supplier_name: 'Factory', supplier_url: 'https://example.com/shop' });
  assert.equal(style.styleNo, 'TEST-1');
  assert.equal(JSON.stringify(style).includes('Factory'), false);
  assert.equal(JSON.stringify(style).includes('example.com'), false);
  assert.equal('supplierId' in style, false);
});

test('Excel export adds supplier after Total with an external hyperlink', () => {
  const submission = { selection_id: 'FS-20260929-0001', customer_name: 'Buyer', company: '', whatsapp: '123', email: 'buyer@example.com', country: 'US', notes: '', submitted_at: '2026-09-29 09:00:00' };
  const items = [
    { style_no_snapshot: 'TEST-1', color_snapshot: 'Blue', xxs: null, xs: 0, s: 2, m: 3, l: 0, xl: null, xxl: null, total: 5, supplier_name: 'Factory & Co', supplier_url: 'https://example.com/shop?a=1&b=2' },
    { style_no_snapshot: 'TEST-2', color_snapshot: 'Black', xxs: null, xs: 0, s: 1, m: 1, l: 0, xl: null, xxl: null, total: 2, supplier_name: '', supplier_url: '' },
  ];
  const files = unzipSync(createSelectionWorkbook(submission, items).bytes);
  const sheet = strFromU8(files['xl/worksheets/sheet1.xml']);
  const relationships = strFromU8(files['xl/worksheets/_rels/sheet1.xml.rels']);
  assert.match(sheet, /<c r="J3"[^>]*>.*?<t xml:space="preserve">Total<\/t>/);
  assert.match(sheet, /<c r="K3"[^>]*>.*?<t xml:space="preserve">Supplier<\/t>/);
  assert.match(sheet, /<c r="K4" s="4"[^>]*>.*?Factory &amp; Co/);
  assert.match(sheet, /<hyperlink ref="K4" r:id="rId1"\/>/);
  assert.doesNotMatch(sheet, /<hyperlink ref="K5"/);
  assert.match(relationships, /Target="https:\/\/example.com\/shop\?a=1&amp;b=2" TargetMode="External"/);
});

test('shop links only accept ordinary web URLs', () => {
  assert.equal(isShopUrl('https://example.com/shop'), true);
  assert.equal(isShopUrl('javascript:alert(1)'), false);
  assert.equal(isShopUrl('https://user:pass@example.com'), false);
  assert.equal(isShopUrl('https://example.com\nother'), false);
});
