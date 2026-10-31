import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

// Copied locale HTML does not rerender Header. Repair only its known category hrefs.
export function repairHeaderCategoryLinks(html, categoryPaths) {
  return html.replace(/<header\b[\s\S]*?<\/header>/gi, header =>
    header.replace(/\bhref=(["'])(\/products[^"'?#]*\/)(#[^"']*)?\1/g,
      (attribute, quote, path, hash = '') => {
        const corrected = path.replace(/^\/products(?=[^/])/, '/products/');
        return corrected !== path && categoryPaths.has(corrected)
          ? `href=${quote}${corrected}${hash}${quote}` : attribute;
      }));
}

export default function headerCategoryLinks() {
  return {
    name: 'fitclo-header-category-links',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const english = await readFile(join(root, 'index.html'), 'utf8');
        const header = english.match(/<header\b[\s\S]*?<\/header>/i)?.[0];
        assert(header, 'Missing generated English Header');
        const paths = new Set([...header.matchAll(/href="(\/products\/[a-z-]+\/)(?:#[^"]*)?"/g)].map(match => match[1]));
        assert(paths.size, 'No generated category links: refuse an unbounded legacy repair');
        let count = 0;
        async function visit(directory) {
          for (const entry of await readdir(directory, { withFileTypes: true })) {
            const path = join(directory, entry.name);
            if (entry.isDirectory()) await visit(path);
            else if (entry.name.endsWith('.html')) {
              const html = await readFile(path, 'utf8');
              const repaired = repairHeaderCategoryLinks(html, paths);
              if (repaired !== html) { await writeFile(path, repaired); count++; }
            }
          }
        }
        await visit(root);
        logger.info(`Repaired only legacy Header category hrefs in ${count} copied HTML pages`);
      },
    },
  };
}
