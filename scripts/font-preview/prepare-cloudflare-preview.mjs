// Preview artifacts only. Run again after build; never use for production.
import { readdir, readFile, writeFile } from 'node:fs/promises';
const root = new URL('../../dist/', import.meta.url);
async function visit(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const url = new URL(entry.name + (entry.isDirectory() ? '/' : ''), dir);
    if (entry.isDirectory()) await visit(url);
    else if (entry.name.endsWith('.html')) {
      let html = await readFile(url, 'utf8');
      html = html.replace(/<link\b(?=[^>]*rel="preload")(?=[^>]*href="\/fonts\/zoho-puvi-[^"]+")[^>]*>/gi, '');
      html = html.replace('</head>', '<meta name="robots" content="noindex, nofollow"><link rel="stylesheet" href="/css/fitclo-typography.css"></head>');
      await writeFile(url, html);
    }
  }
}
await visit(root);
const headers = new URL('_headers', root);
await writeFile(headers, (await readFile(headers, 'utf8')) + '\n/*\n  X-Robots-Tag: noindex, nofollow\n');
console.log('Prepared preview-only artifacts: Poppins overlay + noindex. Source SEO and production configuration unchanged.');
