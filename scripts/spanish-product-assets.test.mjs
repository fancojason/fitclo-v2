import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { bindSpanishProductAssets, repairedProductSlugs } from './spanish-product-assets.mjs';

test('binds exact equivalent-page build entries, preserves content, is idempotent and fails before partial writes', () => {
  const root = mkdtempSync(join(tmpdir(), 'fitclo-assets-'));
  const oldCss = '/_astro/_page_.previous.css';
  const oldJs = '/_astro/hoisted.previous.js';
  const newCss = '/_astro/_page_.current.css';
  const newJs = '/_astro/hoisted.current.js';
  const page = (css, js) => `<html lang="es"><head><title>Producto original</title><link rel="canonical" href="https://www.fitcloo.com/es/products/example/"><link rel="stylesheet" href="${css}"><script type="module" src="${js}"></script></head><body><h1>Producto</h1><p>50 Sets · 500+ · 78% Nylon / 22% Spandex</p><img src="/original.webp" alt="Foto original"><form><select><option selected>Sample</option></select></form></body></html>`;
  const files = [];
  try {
    mkdirSync(join(root, '_astro'));
    writeFileSync(join(root, newCss), 'body{}');
    writeFileSync(join(root, newJs), 'console.log("entry")');
    for (const slug of repairedProductSlugs) {
      const en = join(root, 'products', slug);
      const es = join(root, 'es', 'products', slug);
      mkdirSync(en, { recursive: true });
      mkdirSync(es, { recursive: true });
      writeFileSync(join(en, 'index.html'), page(newCss, newJs));
      const target = join(es, 'index.html');
      writeFileSync(target, page(oldCss, oldJs));
      files.push(target);
    }
    const untouched = join(root, 'unrelated.html');
    writeFileSync(untouched, page(oldCss, oldJs));
    assert.equal(bindSpanishProductAssets(root).filter(p => p.changed).length, 3);
    for (const file of files) assert.equal(readFileSync(file, 'utf8'), page(newCss, newJs));
    assert.equal(readFileSync(untouched, 'utf8'), page(oldCss, oldJs));
    assert(bindSpanishProductAssets(root).every(p => !p.changed));

    for (const file of files) writeFileSync(file, page(oldCss, oldJs));
    writeFileSync(files.at(-1), page(oldCss, '/_astro/unknown.previous.js'));
    assert.throws(() => bindSpanishProductAssets(root), /No corresponding generated entry/);
    assert.equal(readFileSync(files[0], 'utf8'), page(oldCss, oldJs));
  } finally {
    assert(root.startsWith(join(tmpdir(), 'fitclo-assets-')));
    rmSync(root, { recursive: true, force: true });
  }
});
