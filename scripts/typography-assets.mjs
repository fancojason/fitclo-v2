import { readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export function injectTypography(html, stylesheet, homepageStyles) {
  // Only replace our own asset; preserve robots, canonical, JSON-LD and body.
  const page = html
    .replace(/<link\b(?=[^>]*rel="preload")(?=[^>]*href="\/fonts\/zoho-puvi-[^"]+")[^>]*>/gi, '')
    .replace(/<link\b(?=[^>]*rel="stylesheet")(?=[^>]*href="\/css\/fitclo-typography\.css(?:\?[^"]*)?")[^>]*>/gi, '')
    .replace(/<style id="fitclo-home-typography">[\s\S]*?<\/style>/gi, '');
  if (!homepageStyles) return page.replace('</head>', `<link rel="stylesheet" href="${stylesheet}"></head>`);

  // Preserve each stylesheet's position in the cascade while removing two
  // render-blocking requests from the initial homepage navigation.
  return page
    .replace(/<link rel="stylesheet" href="\/css\/language-menu\.css\?v=\d+">/i,
      () => `<style id="fitclo-home-language-menu">${homepageStyles.languageMenu}</style>`)
    .replace('</head>', () => `<style id="fitclo-home-typography">${homepageStyles.typography}</style></head>`);
}

export default function typographyAssets() {
  return {
    name: 'fitclo-approved-typography',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const css = await readFile(new URL('../public/css/fitclo-typography.css', import.meta.url));
        const version = createHash('sha256').update(css).digest('hex').slice(0, 12);
        const stylesheet = `/css/fitclo-typography.css?v=${version}`;
        const root = fileURLToPath(dir);
        const homepageStyles = {
          typography: css.toString('utf8'),
          languageMenu: await readFile(new URL('../public/css/language-menu.css', import.meta.url), 'utf8'),
        };
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
              const styles = path === join(root, 'index.html') ? homepageStyles : undefined;
              await writeFile(path, injectTypography(html, stylesheet, styles));
              count++;
            }
          }
        }
        await visit(root);
        logger.info(`Applied approved Poppins typography to ${count} HTML pages, including locale mirrors.`);
      },
    },
  };
}
