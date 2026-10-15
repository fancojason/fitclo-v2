import test from 'node:test';
import assert from 'node:assert/strict';
import { mergeSelectionItems } from './_lib/product-selection.js';

test('same style and color combine size quantities without changing other colors', () => {
  const items = [
    { style_no_snapshot: '8612', color_snapshot: 'Olive green', xxs: null, xs: 0, s: 0, m: 1, l: 1, xl: null, xxl: null, total: 2, supplier_name: 'Supplier', product_url: 'https://example.com/item' },
    { style_no_snapshot: '8612', color_snapshot: ' olive  GREEN ', xxs: null, xs: 0, s: 1, m: 1, l: 0, xl: null, xxl: null, total: 2 },
    { style_no_snapshot: '8612', color_snapshot: 'Blue', xxs: null, xs: 0, s: 1, m: 0, l: 0, xl: null, xxl: null, total: 1 },
  ];
  const merged = mergeSelectionItems(items, true);
  assert.equal(merged.length, 2);
  assert.deepEqual([merged[0].s, merged[0].m, merged[0].l, merged[0].total], [1, 2, 1, 4]);
  assert.equal(merged[0].product_url, 'https://example.com/item');
  assert.equal(items[0].s, 0);
});

test('new submissions combine duplicate entries and reject combined size overflow', () => {
  const item = (quantity) => ({ styleNo: '8612', color: 'Olive green', quantities: { XXS: null, XS: 0, S: quantity, M: 0, L: 0, XL: null, XXL: null }, total: quantity });
  assert.equal(mergeSelectionItems([item(1), item(2)])[0].quantities.S, 3);
  assert.throws(() => mergeSelectionItems([item(1_000_000), item(1)]), RangeError);
});
