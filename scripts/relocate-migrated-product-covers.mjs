import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const catalogPath = path.resolve('src', 'data', 'productCatalog.ts');
const fromGit = process.argv.includes('--from-git');
const gitArgumentIndex = process.argv.indexOf('--git');
const gitExecutable = gitArgumentIndex >= 0 ? process.argv[gitArgumentIndex + 1] : 'git';
const supportedHosts = new Set(['sc01.alicdn.com', 'ae01.alicdn.com', 'randomuser.me']);

function catalogEntry(line) {
  const id = line.match(/id: '([^']+)'/)?.[1];
  const styleCode = line.match(/styleCode: '([^']+)'/)?.[1];
  const image = line.match(/image: '([^']+)'/)?.[1];
  return id && styleCode && image ? { id, styleCode, image } : null;
}

function migratedFileName(url) {
  const parsed = new URL(url);
  const baseName = path.basename(parsed.pathname, path.extname(parsed.pathname))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'image';
  const hash = createHash('sha1').update(url).digest('hex').slice(0, 10);
  return `${baseName}-${hash}.webp`;
}

const catalog = await readFile(catalogPath, 'utf8');
const currentLines = catalog.split(/\r?\n/);
const sourcesById = new Map();

if (fromGit) {
  const baseline = execFileSync(gitExecutable, ['show', 'HEAD:src/data/productCatalog.ts'], { encoding: 'utf8' });
  for (const line of baseline.split(/\r?\n/)) {
    const entry = catalogEntry(line);
    if (!entry || !entry.image.startsWith('https://')) continue;
    if (!supportedHosts.has(new URL(entry.image).hostname)) continue;
    sourcesById.set(entry.id, `/images/migrated/third-party/${migratedFileName(entry.image)}`);
  }
} else {
  for (const line of currentLines) {
    const entry = catalogEntry(line);
    if (entry?.image.startsWith('/images/migrated/third-party/')) sourcesById.set(entry.id, entry.image);
  }
}

let relocated = 0;
const updatedLines = [];
for (const line of currentLines) {
  const entry = catalogEntry(line);
  const sourceImage = entry ? sourcesById.get(entry.id) : undefined;
  if (!entry || !sourceImage) {
    updatedLines.push(line);
    continue;
  }

  const safeModel = entry.styleCode.replace(/[^a-z0-9+_-]/gi, '');
  const safeFilename = entry.id.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const destinationUrl = `/images/products/${safeModel}/${safeFilename}.webp`;
  const sourcePath = path.resolve('public', `.${sourceImage}`);
  const destinationPath = path.resolve('public', `.${destinationUrl}`);
  if (!existsSync(sourcePath)) throw new Error(`Missing migrated image for ${entry.styleCode}: ${sourceImage}`);

  await mkdir(path.dirname(destinationPath), { recursive: true });
  await copyFile(sourcePath, destinationPath);
  updatedLines.push(line.replace(/image: '[^']+'/, `image: '${destinationUrl}'`));
  relocated += 1;
}

await writeFile(catalogPath, updatedLines.join('\n'));
console.log(`Relocated ${relocated} product covers into model directories.`);
