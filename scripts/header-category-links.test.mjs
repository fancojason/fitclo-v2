import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'parse5';
import { repairHeaderCategoryLinks } from './header-category-links.mjs';

function headerLinks(html) {
  const links = [];
  function visit(node, inHeader = false) {
    inHeader ||= node.tagName === 'header';
    if (inHeader && node.tagName === 'a') links.push(node.attrs.find(a => a.name === 'href')?.value);
    for (const child of node.childNodes || []) visit(child, inHeader);
  }
  visit(parse(html));
  return links.filter(Boolean);
}

test('legacy repair changes only known malformed Header hrefs and preserves fragments', () => {
  const paths = new Set(['/products/sports-bras/', '/products/leggings/']);
  const html = `<header class="unchanged"><a href="/productssports-bras/#seamless">Bra</a><a href='/productsleggings/'>Leggings</a><a href="/products/sports-bras/">Correct</a><a href="/es/fabricante-de-tops-deportivos/#womens">ES</a><a href="/productsunknown/">Unknown</a></header><main><a href="/productsleggings/">Untouched body</a></main>`;
  const expected = html.replace('"/productssports-bras/#seamless"', '"/products/sports-bras/#seamless"').replace("'/productsleggings/'", "'/products/leggings/'");
  assert.equal(repairHeaderCategoryLinks(html, paths), expected);
  assert.equal(repairHeaderCategoryLinks(expected, paths), expected);
  assert.equal(repairHeaderCategoryLinks(html, new Set()), html);
});

test('built English and Spanish headers link real categories without duplicate slashes', () => {
  const english = headerLinks(readFileSync('dist/index.html', 'utf8'));
  const categories = [...new Set(english.filter(href => /^\/products\/[a-z-]+\/$/.test(href)))];
  assert.equal(categories.length, 11);
  for (const href of categories) assert(existsSync(`dist${href}index.html`), href);
  for (const key of ['sports-bras', 'leggings', 'matching-sets']) assert(categories.includes(`/products/${key}/`));
  for (const path of ['dist/index.html', 'dist/es/index.html', 'dist/de/products/capri-workout-set/index.html']) {
    for (const href of headerLinks(readFileSync(path, 'utf8'))) {
      assert(!/^\/products[^/]+\//.test(href), `${path}: ${href}`);
      assert(!/^\/[^?#]*\/\//.test(href), `${path}: duplicate slash ${href}`);
    }
  }
  const spanish = headerLinks(readFileSync('dist/es/index.html', 'utf8'));
  assert(spanish.includes('/es/fabricante-de-tops-deportivos/'));
  assert(spanish.includes('/es/products/sports-bras/'));
  assert(!spanish.includes('/es/products//sports-bras/'));
});

test('all generated and copied locale Headers are free of the malformed category paths', () => {
  let checked = 0;
  function visit(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) visit(path);
      else if (entry.name.endsWith('.html')) {
        const header = readFileSync(path, 'utf8').match(/<header\b[\s\S]*?<\/header>/i)?.[0];
        if (!header) continue;
        checked++;
        for (const href of headerLinks(header)) assert(!/^\/products[^/]+\//.test(href), `${path}: ${href}`);
      }
    }
  }
  visit('dist');
  assert(checked > 900, 'Expected generated pages and legacy locale mirrors');
});
