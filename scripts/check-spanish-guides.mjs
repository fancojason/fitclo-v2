// Run after npm run build. Uses only Node's standard library.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const site = 'https://www.fitcloo.com';
const routes = [
  ['moq-ropa-deportiva', null],
  ['marca-privada-vs-oem-odm', '/blogs/oem-vs-odm-vs-private-label-activewear/'],
  ['precio-fabricar-ropa-deportiva-personalizada', '/blogs/activewear-manufacturing-cost-guide/'],
  ['desarrollar-coleccion-ropa-deportiva', '/blogs/custom-activewear-manufacturing-process/'],
];
const sitemap = await fs.readFile('dist/sitemap-0.xml', 'utf8');
const titles = new Set();
for (const [slug, en] of routes) {
  const es = '/es/guias/' + slug + '/';
  const html = await fs.readFile('dist' + es + 'index.html', 'utf8');
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  assert.ok(title, es + ': missing title');
  titles.add(title);
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, es + ': H1 count');
  assert.match(html, /<html[^>]+lang="es"/);
  assert.ok(html.includes('name="robots" content="index, follow"'));
  assert.ok(html.includes('rel="canonical" href="' + site + es + '"'));
  const alternates = [...html.matchAll(/hreflang="([^"]+)" href="([^"]+)"/g)].map(m => [m[1], m[2]]);
  const expected = en ? [['en', site + en], ['es', site + es], ['x-default', site + en]] : [];
  assert.deepEqual(alternates, expected, es + ': alternate links');
  if (en) {
    const english = await fs.readFile('dist' + en + 'index.html', 'utf8');
    for (const [lang, href] of expected) assert.ok(english.includes('hreflang="' + lang + '" href="' + href + '"'));
  }
  const schemas = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].flatMap(m => JSON.parse(m[1]));
  for (const type of ['Article', 'BreadcrumbList', 'FAQPage']) assert.equal(schemas.filter(s => s['@type'] === type).length, 1, es + ': ' + type);
  const article = schemas.find(s => s['@type'] === 'Article');
  assert.equal(article.mainEntityOfPage, site + es);
  assert.equal(article.inLanguage, 'es');
  for (const field of ['offers', 'price', 'availability', 'review', 'aggregateRating']) assert.equal(article[field], undefined);
  for (const [key, value] of Object.entries({language:'es', page_path:es, page_url:site+es})) assert.ok(html.includes('name="' + key + '" value="' + value + '"'));
  assert.equal(sitemap.split('<loc>' + site + es + '</loc>').length - 1, 1);
}
assert.equal(titles.size, 4);
console.log('Spanish guide checks passed: 4 static routes, unique titles, metadata, 3 reciprocal language pairs, standalone MOQ guide, structured data, inquiry context and sitemap.');
