import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { parse } from 'parse5';

export const repairedProductSlugs = ['capri-workout-set', 'matching-sets', 'sports-bras'];

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

// Static translations retain their approved HTML; only the build's entry URLs vary.
export function bindSpanishProductAssets(directory) {
  const plans = repairedProductSlugs.map(slug => {
    const source = readFileSync(join(directory, 'products', slug, 'index.html'), 'utf8');
    const target = join(directory, 'es', 'products', slug, 'index.html');
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
    return { target, original, html, route: `/es/products/${slug}/` };
  });
  // Validate all three plans before writing any output.
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
        for (const result of bindSpanishProductAssets(fileURLToPath(dir))) {
          logger.info(`Bound ${result.route} to ${result.assets.length} generated CSS/JS entries`);
        }
      },
    },
  };
}
