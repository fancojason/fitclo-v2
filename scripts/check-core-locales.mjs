import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const site = 'https://www.fitcloo.com';
const locales = { de: 'de', nl: 'nl', 'pt-br': 'pt-BR' };
const pages = ['', 'private-label-activewear/', 'oem-activewear-manufacturer/', 'ready-stock-activewear/', 'contact/'];
const english = ['/', '/private-label/', '/oem-activewear-manufacturer/', '/ready-to-ship/', '/contact/'];
const spanish = ['es/', 'es/private-label-activewear/', 'es/oem-activewear-manufacturer/', 'es/ready-stock-activewear/', 'es/contact/'];
const sitemap = readFileSync('dist/sitemap-0.xml', 'utf8');

for (const [prefix, language] of Object.entries(locales)) {
  for (const [index, page] of pages.entries()) {
    const path = `/${prefix}/${page}`;
    const file = join('dist', prefix, page, 'index.html');
    assert(existsSync(file), `Missing ${path}`);
    const html = readFileSync(file, 'utf8');
    assert(html.includes(`<html lang="${language}">`), `Wrong lang: ${path}`);
    assert(html.includes(`<link rel="canonical" href="${site}${path}"`), `Wrong canonical: ${path}`);
    assert(html.includes('<meta name="robots" content="index, follow"'), `Not indexable: ${path}`);
    assert(/<title>[^<]{20,}<\/title>/.test(html), `Missing title: ${path}`);
    assert(/<meta name="description" content="[^\"]{50,}"/.test(html), `Missing description: ${path}`);
    assert(sitemap.includes(`<loc>${site}${path}</loc>`), `Missing sitemap entry: ${path}`);
    for (const [tag, equivalent] of Object.entries({ en: english[index], es: `/${spanish[index]}`, de: `/de/${page}`, nl: `/nl/${page}`, 'pt-BR': `/pt-br/${page}`, 'x-default': english[index] })) {
      assert(html.includes(`<link rel="alternate" hreflang="${tag}" href="${site}${equivalent}"`), `Missing ${tag} alternate: ${path}`);
    }
    assert(html.includes('name="language"') && html.includes(`value="${language}"`) || page !== 'contact/', `Missing form language: ${path}`);
    for (const href of html.matchAll(/href="(\/(?:de|nl|pt-br)\/[^\"]*)"/g)) {
      const linked = href[1].split('#')[0].split('?')[0];
      if (linked.startsWith('/images/')) continue;
      assert(existsSync(join('dist', linked, 'index.html')), `Broken localized link ${linked} from ${path}`);
    }
    assert(!html.includes('Get a Quote') && !html.includes('Ready to Ship'), `English UI leaked: ${path}`);
  }
}

for (let i = 0; i < pages.length; i++) {
  for (const path of [english[i], `/${spanish[i]}`]) {
    const html = readFileSync(join('dist', path, 'index.html'), 'utf8');
    for (const [prefix, language] of Object.entries(locales)) {
      assert(html.includes(`hreflang="${language}" href="${site}/${prefix}/${pages[i]}"`), `Missing reciprocal ${language} on ${path}`);
    }
  }
}
console.log('PASS: 15 localized pages; canonical, lang, metadata, sitemap, equivalent hreflang, core links, EN/ES reciprocity.');
