import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { parse } from 'parse5';

export const repairedProductSlugs = ['capri-workout-set', 'matching-sets', 'sports-bras'];
const capriAltTranslations = {
  es: {
    'Capri Workout Set matching series with wide-leg pants, capri leggings, tank and sports bra options': 'Serie Capri Workout Set a juego con opciones de pantalones de pierna ancha, leggings capri, camiseta sin mangas y sujetador deportivo',
    'Ivory Capri Workout Set with layered halter neckline and fold-over dotted waistband': 'Conjunto de entrenamiento Capri marfil con escote halter en capas y cinturilla doblada de lunares',
    'Private label logo, tag and packaging customization options': 'Opciones de personalización de logotipo, etiquetas y embalaje para marca privada',
    'Fitclo ready-stock activewear storage and packing area': 'Área de almacenamiento y embalaje de ropa deportiva en stock de Fitclo',
  },
  de: {
    'Capri Workout Set matching series with wide-leg pants, capri leggings, tank and sports bra options': 'Passende Capri-Workout-Set-Serie mit Optionen für weite Hosen, Capri-Leggings, Tanktops und Sport-BHs',
    'Ivory Capri Workout Set with layered halter neckline and fold-over dotted waistband': 'Elfenbeinfarbenes Capri-Workout-Set mit mehrlagigem Neckholder-Ausschnitt und umgeschlagenem Bund mit Punktmuster',
    'Private label logo, tag and packaging customization options': 'Eigenmarken-Optionen für Logo, Hangtags und Verpackung',
    'Fitclo ready-stock activewear storage and packing area': 'Lager- und Verpackungsbereich für sofort verfügbare Sportbekleidung von Fitclo',
  },
};

function gallery(html) {
  const result = { buttons: [], mainAlt: '' };
  function visit(node) {
    const attrs = Object.fromEntries((node.attrs || []).map(a => [a.name, a.value]));
    if (node.tagName === 'img' && 'data-gallery-main' in attrs) result.mainAlt = attrs.alt;
    if (node.tagName === 'button' && 'data-gallery-thumbnail' in attrs) {
      const image = node.childNodes.find(n => n.tagName === 'img');
      result.buttons.push({ attrs, src: image?.attrs.find(a => a.name === 'src')?.value,
        offset: node.sourceCodeLocation.startTag.endOffset - 1 });
    }
    for (const child of node.childNodes || []) visit(child);
  }
  visit(parse(html, { sourceCodeLocationInfo: true }));
  return result;
}

function bindCapriAlt(html, source, locale) {
  const targetGallery = gallery(html);
  if (!targetGallery.buttons.length) return html;
  const sourceGallery = gallery(source);
  assert(targetGallery.mainAlt && targetGallery.buttons.length === sourceGallery.buttons.length, 'Capri gallery structure changed');
  const edits = targetGallery.buttons.map((button, index) => {
    const original = sourceGallery.buttons[index];
    assert(button.src === original.src, 'Capri image order or source changed');
    const alt = index === 0 ? targetGallery.mainAlt : capriAltTranslations[locale]?.[original.attrs['data-gallery-alt']];
    assert(alt, `Missing approved Capri ALT translation: ${locale}, image ${index}`);
    if (button.attrs['data-gallery-alt']) {
      assert(button.attrs['data-gallery-alt'] === alt, 'Conflicting Capri ALT metadata');
      return null;
    }
    const escaped = alt.replace(/[&"<>]/g, c => ({ '&': '&amp;', '"': '&quot;', '<': '&lt;', '>': '&gt;' })[c]);
    return { offset: button.offset, value: ` data-gallery-alt="${escaped}"` };
  }).filter(Boolean);
  for (const edit of edits.reverse()) html = html.slice(0, edit.offset) + edit.value + html.slice(edit.offset);
  return html;
}

function assets(html) {
  const found = [];
  function visit(node) {
    const attrs = Object.fromEntries((node.attrs || []).map(a => [a.name, a.value]));
    const url = node.tagName === 'script' ? attrs.src
      : node.tagName === 'link' && attrs.rel === 'stylesheet' ? attrs.href : null;
    if (url?.startsWith('/_astro/')) found.push(url);
    for (const child of node.childNodes || []) visit(child);
  }
  visit(parse(html));
  return [...new Set(found)];
}

function assetRole(url) {
  const match = url.match(/^\/_astro\/(.+)\.[A-Za-z0-9_-]+\.(css|js)$/);
  assert(match, `Unexpected Astro entry URL: ${url}`);
  return `${match[1]}.${match[2]}`;
}

// Preserve approved translated copy; bind current assets and existing Capri image descriptions.
export function bindSpanishProductAssets(directory, targets = repairedProductSlugs.map(slug => ({ slug, locale: 'es' }))) {
  const plans = targets.map(({ slug, locale }) => {
    const source = readFileSync(join(directory, 'products', slug, 'index.html'), 'utf8');
    const target = join(directory, locale, 'products', slug, 'index.html');
    const original = readFileSync(target, 'utf8');
    const current = new Map();
    for (const url of assets(source)) {
      const role = assetRole(url);
      assert(!current.has(role), `Ambiguous entry role ${role}: ${slug}`);
      assert(existsSync(join(directory, url.slice(1))), `Missing generated entry: ${url}`);
      current.set(role, url);
    }
    const previous = assets(original);
    assert(previous.length && previous.length === current.size, `Entry count changed: ${slug}`);
    let html = original;
    for (const oldUrl of previous) {
      const newUrl = current.get(assetRole(oldUrl));
      assert(newUrl, `No corresponding generated entry for ${oldUrl}: ${slug}`);
      html = html.split(oldUrl).join(newUrl);
    }
    for (const url of assets(html)) {
      assert(existsSync(join(directory, url.slice(1))), `Unresolved translated entry: ${url}`);
    }
    if (slug === 'capri-workout-set') html = bindCapriAlt(html, source, locale);
    return { target, original, html, route: `/${locale}/products/${slug}/` };
  });
  // Validate all plans before writing any output.
  for (const plan of plans) {
    if (plan.html !== plan.original) writeFileSync(plan.target, plan.html);
  }
  return plans.map(p => ({ route: p.route, changed: p.html !== p.original, assets: assets(p.html) }));
}

export default function spanishProductAssets() {
  return {
    name: 'fitclo-spanish-product-assets',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        const targets = [...repairedProductSlugs.map(slug => ({ slug, locale: 'es' })),
          { slug: 'capri-workout-set', locale: 'de' }];
        for (const result of bindSpanishProductAssets(fileURLToPath(dir), targets)) {
          logger.info(`Bound ${result.route} to ${result.assets.length} generated CSS/JS entries`);
        }
      },
    },
  };
}
