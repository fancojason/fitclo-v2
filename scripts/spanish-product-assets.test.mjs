import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { bindSpanishProductAssets, repairedProductSlugs, localizedFormAssetTargets } from './spanish-product-assets.mjs';

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

test('localized inquiry pages use current equivalent form assets without changing copy or form fields', () => {
  const root = mkdtempSync(join(tmpdir(), 'fitclo-inquiry-assets-'));
  const current = '/_astro/hoisted.current.js';
  const stale = '/_astro/hoisted.removed.js';
  const targets = ['es', 'de'].map(locale => ({ slug: 'inquiry', locale, section: '' }));
  const page = (locale, script) => `<html lang="${locale}"><head><link rel="canonical" href="https://www.fitcloo.com/${locale}/inquiry/"><script type="module" src="${script}"></script></head><body><h1>${locale} original heading</h1><form id="inquiry-form"><input name="email" required><input name="website"><button>Original ${locale} submit</button></form></body></html>`;
  try {
    mkdirSync(join(root, '_astro'));
    mkdirSync(join(root, 'inquiry'));
    writeFileSync(join(root, current), '/* current form handler */');
    writeFileSync(join(root, 'inquiry', 'index.html'), page('en', current));
    for (const { locale } of targets) {
      mkdirSync(join(root, locale, 'inquiry'), { recursive: true });
      writeFileSync(join(root, locale, 'inquiry', 'index.html'), page(locale, stale));
    }
    assert.deepEqual(localizedFormAssetTargets(root), targets);
    assert.deepEqual(bindSpanishProductAssets(root, targets).map(p => p.route), ['/es/inquiry/', '/de/inquiry/']);
    for (const { locale } of targets) {
      assert.equal(readFileSync(join(root, locale, 'inquiry', 'index.html'), 'utf8'), page(locale, current));
    }
    assert(bindSpanishProductAssets(root, targets).every(p => !p.changed));
    assert.deepEqual(localizedFormAssetTargets(root), []);
    writeFileSync(join(root, 'es', 'inquiry', 'index.html'), page('es', stale).replace('name="email"', 'name="unexpected"'));
    assert.throws(() => localizedFormAssetTargets(root), /Inquiry form structure differs/);
  } finally {
    assert(root.startsWith(join(tmpdir(), 'fitclo-inquiry-assets-')));
    rmSync(root, { recursive: true, force: true });
  }
});
