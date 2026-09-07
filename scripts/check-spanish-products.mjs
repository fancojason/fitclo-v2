// Run after npm run build. Uses only Node's standard library.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const site = 'https://www.fitcloo.com';
const skus = ['0636', '3708', 'TZ4510-14', 'TZ2557-6', 'TZ5560-2', 'TZ5555-4', 'TZ4506-4', 'TZ4535-12'];
const titles = new Set();
const read = route => readFile(new URL(`../dist${route}index.html`, import.meta.url), 'utf8');
const sitemap = await readFile(new URL('../dist/sitemap-0.xml', import.meta.url), 'utf8');
for (const sku of skus) {
  const slug = sku.toLowerCase();
  const en = `/products/${slug}/`;
  const es = `/es/products/${slug}/`;
  const html = await read(es);
  assert.match(html, /<html[^>]*lang="es"/);
  assert.match(html, /name="robots" content="index, follow"/);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  titles.add(html.match(/<title>(.*?)<\/title>/s)?.[1]);
  assert.ok(html.includes(`rel="canonical" href="${site}${es}"`));
  for (const page of [html, await read(en)]) {
    for (const [language, route] of [['en', en], ['es', es], ['x-default', en]]) {
      assert.ok(page.includes(`hreflang="${language}" href="${site}${route}"`), `${sku}: ${language}`);
    }
  }
  const schemas = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    .flatMap(match => JSON.parse(match[1]));
  const product = schemas.find(schema => schema['@type'] === 'Product');
  assert.equal(product?.sku, sku);
  assert.equal(product.url, site + es);
  for (const field of ['offers', 'availability', 'price', 'review', 'aggregateRating']) assert.equal(product[field], undefined);
  assert.ok(html.includes(`name="product_code" value="${sku}"`));
  assert.ok(html.includes(`name="page_path" value="${es}"`));
  assert.ok(html.includes(`name="page_url" value="${site}${es}"`));
  assert.ok(html.includes('name="language" value="es"'));
  assert.equal(sitemap.split(`<loc>${site}${es}</loc>`).length - 1, 1);
}
assert.equal(titles.size, 8);
console.log('Spanish product checks passed: 8 routes, metadata, reciprocal hreflang, SKU context and sitemap.');
