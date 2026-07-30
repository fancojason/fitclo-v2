import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const sourceRoot = path.resolve('src');
const outputDirectory = path.resolve('public', 'images', 'migrated', 'third-party');
const supportedHosts = new Set([
  'sc01.alicdn.com',
  'sc02.alicdn.com',
  'sc04.alicdn.com',
  'ae01.alicdn.com',
  'randomuser.me',
]);
const sourceExtensions = new Set(['.astro', '.ts', '.tsx', '.js', '.mjs']);
const imageUrlPattern = /https:\/\/[^\s'"`()<>]+?\.(?:avif|gif|jpe?g|png|webp)(?:\?[^\s'"`()<>]*)?/gi;

async function collectSourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectSourceFiles(entryPath));
    if (entry.isFile() && sourceExtensions.has(path.extname(entry.name))) files.push(entryPath);
  }
  return files;
}

function fileNameFor(url) {
  const parsed = new URL(url);
  const baseName = path.basename(parsed.pathname, path.extname(parsed.pathname))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'image';
  const hash = createHash('sha1').update(url).digest('hex').slice(0, 10);
  return `${baseName}-${hash}.webp`;
}

const sourceFiles = await collectSourceFiles(sourceRoot);
const fileContents = new Map();
const imageUrls = new Set();

for (const sourceFile of sourceFiles) {
  const content = await readFile(sourceFile, 'utf8');
  fileContents.set(sourceFile, content);
  for (const match of content.matchAll(imageUrlPattern)) {
    const url = match[0];
    if (supportedHosts.has(new URL(url).hostname)) imageUrls.add(url);
  }
}

await mkdir(outputDirectory, { recursive: true });
const replacements = new Map();
const failures = [];

for (const url of imageUrls) {
  const outputName = fileNameFor(url);
  const outputPath = path.join(outputDirectory, outputName);
  const localPath = `/images/migrated/third-party/${outputName}`;
  try {
    if (!existsSync(outputPath)) {
      const response = await fetch(url, {
        headers: { 'user-agent': 'Mozilla/5.0 (compatible; FitcloMediaMigration/1.0)' },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const buffer = Buffer.from(await response.arrayBuffer());
      await sharp(buffer)
        .rotate()
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality: 82, effort: 5 })
        .toFile(outputPath);
    }
    replacements.set(url, localPath);
  } catch (error) {
    failures.push({ url, error: error instanceof Error ? error.message : String(error) });
  }
}

for (const [sourceFile, originalContent] of fileContents) {
  let content = originalContent;
  for (const [remoteUrl, localPath] of replacements) {
    content = content.split(remoteUrl).join(localPath);
  }
  if (content !== originalContent) await writeFile(sourceFile, content);
}

console.log(JSON.stringify({ discovered: imageUrls.size, migrated: replacements.size, failures }, null, 2));
if (failures.length > 0) process.exitCode = 1;
