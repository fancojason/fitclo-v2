import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const files = ['WholesaleSolutions', 'LiveProduction', 'ProductGrid'];
const sources = new Set();
for (const name of files) {
  const text = await fs.readFile(`src/components/${name}.astro`, 'utf8');
  for (const match of text.matchAll(/['"](\/images\/[^'"\s]+\.webp)['"]/g)) sources.add(match[1]);
}
await fs.mkdir('public/images/home/responsive', { recursive: true });
const manifest = {};
for (const src of sources) {
  const input = path.join('public', src);
  const { width, height } = await sharp(input).metadata();
  const candidates = [];
  for (const size of [480, 960]) {
    if (size >= width) continue;
    const output = `/images/home/responsive/${path.basename(src, '.webp')}-${size}.webp`;
    await sharp(input).resize({ width: size }).webp({ quality: 84, effort: 5 }).toFile(path.join('public', output));
    candidates.push(`${output} ${size}w`);
  }
  candidates.push(`${src} ${width}w`);
  manifest[src] = { width, height, srcset: candidates.join(', ') };
}
await fs.writeFile('src/lib/home-images.json', JSON.stringify(manifest, null, 2) + '\n');
console.log(`Prepared responsive images for ${sources.size} originals`);
