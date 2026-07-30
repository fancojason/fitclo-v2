import { existsSync } from 'node:fs';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const productsDirectory = path.resolve('public', 'images', 'products');
const sourceDirectory = path.resolve('src');
const sourceExtensions = new Set(['.astro', '.ts', '.tsx', '.js', '.mjs']);
const rasterExtensions = new Set(['.jpg', '.jpeg', '.png']);

async function collectFiles(directory, predicate) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectFiles(entryPath, predicate));
    if (entry.isFile() && predicate(entryPath)) files.push(entryPath);
  }
  return files;
}

const productImages = await collectFiles(productsDirectory, (filePath) => rasterExtensions.has(path.extname(filePath).toLowerCase()));
const replacements = new Map();

for (const imagePath of productImages) {
  const webpPath = imagePath.replace(/\.(?:jpe?g|png)$/i, '.webp');
  if (!existsSync(webpPath)) {
    await sharp(imagePath)
      .rotate()
      .resize({ width: 1800, withoutEnlargement: true })
      .webp({ quality: 84, effort: 5 })
      .toFile(webpPath);
  }
  const localPath = `/${path.relative(path.resolve('public'), imagePath).replaceAll('\\', '/')}`;
  replacements.set(localPath, localPath.replace(/\.(?:jpe?g|png)$/i, '.webp'));
}

const sourceFiles = await collectFiles(sourceDirectory, (filePath) => sourceExtensions.has(path.extname(filePath)));
let updatedFiles = 0;
for (const sourceFile of sourceFiles) {
  const originalContent = await readFile(sourceFile, 'utf8');
  let content = originalContent;
  for (const [from, to] of replacements) {
    content = content.split(from).join(to);
    content = content.split(`https://www.fitcloo.com${from}`).join(`https://www.fitcloo.com${to}`);
  }
  if (content !== originalContent) {
    await writeFile(sourceFile, content);
    updatedFiles += 1;
  }
}

console.log(JSON.stringify({ converted: productImages.length, updatedFiles }, null, 2));
