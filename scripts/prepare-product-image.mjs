import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const args = new Map();
for (let index = 2; index < process.argv.length; index += 2) {
  const key = process.argv[index];
  const value = process.argv[index + 1];
  if (key?.startsWith('--') && value) args.set(key.slice(2), value);
}

const model = args.get('model');
const input = args.get('input');
const filename = args.get('filename');

if (!model || !input || !filename) {
  throw new Error('Usage: node scripts/prepare-product-image.mjs --model TZ0000-0 --input "C:\\source.png" --filename clear-english-image-name');
}

const safeModel = model.replace(/[^a-z0-9+_-]/gi, '');
const safeFilename = filename
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');
const outputDirectory = path.resolve('public', 'images', 'products', safeModel);
const outputPath = path.join(outputDirectory, `${safeFilename}.webp`);

await mkdir(outputDirectory, { recursive: true });
await sharp(input)
  .rotate()
  .resize({ width: 1600, withoutEnlargement: true })
  .webp({ quality: 84, effort: 5 })
  .toFile(outputPath);

console.log(outputPath);
