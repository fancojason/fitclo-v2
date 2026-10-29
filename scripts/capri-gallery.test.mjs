import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readGalleryItem } from '../src/lib/product-gallery.mjs';
import { bindSpanishProductAssets } from './spanish-product-assets.mjs';

const ivoryAlt = 'Ivory Capri Workout Set with layered halter neckline and fold-over dotted waistband';
const thumbnail = (dataset, aria) => ({ dataset, getAttribute: () => aria,
  querySelector: () => ({ getAttribute: () => '/ivory.webp' }) });

test('caption lookup is scoped to figcaption, never the thumbnail metadata attribute', () => {
  const source = readFileSync(new URL('../src/pages/products/capri-workout-set.astro', import.meta.url), 'utf8');
  assert(source.includes("querySelector<HTMLElement>('figcaption [data-gallery-label]')"));
  assert(!source.includes("querySelector<HTMLElement>('[data-gallery-label]')"));
});

test('selected ivory image keeps the full original ALT and the short caption', () => {
  assert.deepEqual(readGalleryItem(thumbnail({ galleryAlt: ivoryAlt, galleryLabel: 'Ivory colorway' }, 'View Ivory colorway')),
    { src: '/ivory.webp', alt: ivoryAlt, label: 'Ivory colorway' });
});

test('localized caption behavior stays unchanged when only descriptive ALT is supplied', () => {
  const item = readGalleryItem(thumbnail({ galleryAlt: 'Descripción completa' }, 'Ver combinación de colores Marfil'));
  assert.equal(item.alt, 'Descripción completa');
  assert.equal(item.label, 'Ver combinación de colores Marfil');
  assert.equal(readGalleryItem(thumbnail({}, 'View Ivory colorway')).label, 'Ivory colorway');
});

test('existing asset mechanism binds ES/DE Capri, preserves initial ALT/captions, and rejects image drift', () => {
  const root = mkdtempSync(join(tmpdir(), 'fitclo-capri-'));
  const page = (lang, css, js, metadata = '') => `<html lang="${lang}"><head><link rel="stylesheet" href="${css}"><script type="module" src="${js}"></script></head><body><img data-gallery-main src="/main.webp" alt="${lang} original main"><button data-gallery-thumbnail="0" aria-label="${lang} short main" ${metadata ? 'data-gallery-alt="original source main" data-gallery-label="Matching series"' : ''}><img src="/main.webp" alt=""></button><button data-gallery-thumbnail="1" aria-label="${lang} short ivory" ${metadata ? `data-gallery-alt="${ivoryAlt}" data-gallery-label="Ivory colorway"` : ''}><img src="/ivory.webp" alt=""></button><span data-gallery-label>Original caption</span><form><option selected>Sample</option></form></body></html>`;
  const targets = ['es', 'de'].map(locale => ({ locale, slug: 'capri-workout-set' }));
  try {
    mkdirSync(join(root, '_astro'));
    writeFileSync(join(root, '_astro/page.current.css'), 'body{}');
    writeFileSync(join(root, '_astro/hoisted.current.js'), 'console.log("entry")');
    const en = join(root, 'products/capri-workout-set');
    mkdirSync(en, { recursive: true });
    writeFileSync(join(en, 'index.html'), page('en', '/_astro/page.current.css', '/_astro/hoisted.current.js', 'source'));
    for (const locale of ['es', 'de']) {
      const directory = join(root, locale, 'products/capri-workout-set');
      mkdirSync(directory, { recursive: true });
      writeFileSync(join(directory, 'index.html'), page(locale, '/_astro/page.old.css', '/_astro/hoisted.old.js'));
    }
    const results = bindSpanishProductAssets(root, targets);
    assert.equal(results.length, 2);
    const es = readFileSync(join(root, 'es/products/capri-workout-set/index.html'), 'utf8');
    const de = readFileSync(join(root, 'de/products/capri-workout-set/index.html'), 'utf8');
    assert(es.includes('data-gallery-alt="es original main"'));
    assert(de.includes('data-gallery-alt="de original main"'));
    assert(es.includes('Conjunto de entrenamiento Capri marfil con escote halter en capas'));
    assert(de.includes('Elfenbeinfarbenes Capri-Workout-Set mit mehrlagigem Neckholder-Ausschnitt'));
    for (const html of [es, de]) {
      assert(html.includes('<span data-gallery-label>Original caption</span>'));
      assert(html.includes('<option selected>Sample</option>'));
    }
    assert(bindSpanishProductAssets(root, targets).every(p => !p.changed));
    writeFileSync(join(root, 'de/products/capri-workout-set/index.html'), de.replace('src="/ivory.webp"', 'src="/wrong.webp"'));
    assert.throws(() => bindSpanishProductAssets(root, targets), /image order or source changed/);
  } finally {
    assert(root.startsWith(join(tmpdir(), 'fitclo-capri-')));
    rmSync(root, { recursive: true, force: true });
  }
});
