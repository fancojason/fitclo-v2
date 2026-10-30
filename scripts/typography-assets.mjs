import { readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export function injectTypography(html, stylesheet) {
  // Only replace our own asset; preserve robots, canonical, JSON-LD and body.
  return html
    .replace(/<link\b(?=[^>]*rel="preload")(?=[^>]*href="\/fonts\/zoho-puvi-[^"]+")[^>]*>/gi, '')
    .replace(/<link\b(?=[^>]*rel="stylesheet")(?=[^>]*href="\/css\/fitclo-typography\.css(?:\?[^"]*)?")[^>]*>/gi, '')
    .replace('</head>', `<link rel="stylesheet" href="${stylesheet}"></head>`);
}

export default function typographyAssets() {
  return {
    name: 'fitclo-approved-typography',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const css = await readFile(new URL('../public/css/fitclo-typography.css', import.meta.url));
        const version = createHash('sha256').update(css).digest('hex').slice(0, 12);
        const stylesheet = `/css/fitclo-typography.css?v=${version}`;
        let count = 0;
        async function visit(directory) {
          for (const entry of await readdir(directory, { withFileTypes: true })) {
            const path = join(directory, entry.name);
            if (entry.isDirectory()) await visit(path);
            else if (entry.name.endsWith('.html')) {
              const html = await readFile(path, 'utf8');
              // Google's verification endpoint is a plain-text .html asset.
              if (!html.includes('</head>')) {
                if (/^google-site-verification:\s/.test(html.trim())) continue;
                throw new Error(`Missing HTML head: ${path}`);
              }
              await writeFile(path, injectTypography(html, stylesheet));
              count++;
            }
          }
        }
        await visit(fileURLToPath(dir));
        logger.info(`Applied approved Poppins typography to ${count} HTML pages, including locale mirrors.`);
      },
    },
  };
}
