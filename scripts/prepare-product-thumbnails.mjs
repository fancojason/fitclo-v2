import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { parse } from 'parse5';
import sharp from 'sharp';

// Run against the current build to collect the actual published gallery images.
const sources = new Set();
const walk = node => [node, ...(node.childNodes || []).flatMap(walk)];
const attrs = node => Object.fromEntries((node.attrs || []).map(a => [a.name, a.value]));
async function collect(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) await collect(file);
    else if (entry.name.endsWith('.html')) {
      const nodes = walk(parse(await fs.readFile(file, 'utf8')));
      for (const button of nodes.filter(n => n.tagName === 'button' && Object.keys(attrs(n)).some(k => k.startsWith('data-gallery-thumb')))) {
        const image = walk(button).find(n => n.tagName === 'img');
        if (image && attrs(image).src?.startsWith('/images/')) sources.add(attrs(image).src);
      }
    }
  }
}
await collect('dist');
await fs.mkdir('public/images/products/thumbnails', { recursive: true });
const manifest = {};
for (const src of [...sources].sort()) {
  const input = path.join('public', src);
  const bytes = await fs.readFile(input);
  const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 16);
  const { width } = await sharp(bytes).metadata();
  const candidates = [];
  for (const size of [160, 320]) {
    if (size >= width) continue;
    const output = '/images/products/thumbnails/' + hash + '-' + size + '.webp';
    await sharp(bytes).resize({ width: size }).webp({ quality: 84, effort: 5 }).toFile(path.join('public', output));
    candidates.push(output + ' ' + size + 'w');
  }
  candidates.push(src + ' ' + width + 'w');
  manifest[src] = candidates.join(', ');
}
await fs.writeFile('src/lib/product-thumbnails.json', JSON.stringify(manifest, null, 2) + '\n');
console.log('Prepared thumbnails for ' + sources.size + ' gallery images');
