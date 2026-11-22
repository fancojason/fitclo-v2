import assert from 'node:assert/strict';
import { injectTypography } from './typography-assets.mjs';

const body = '<main><h1>Guía de compra</h1><a href="/inquiry/">Quote</a></main>';
assert.equal(injectTypography('google-site-verification: google-example.html', '/style.css'), 'google-site-verification: google-example.html');
for (const robots of ['index, follow', 'noindex, nofollow']) {
  const seo = `<meta name="robots" content="${robots}"><link rel="canonical" href="https://www.fitcloo.com/es/guias/"><script type="application/ld+json">{"@type":"Article"}</script>`;
  const html = `<html><head>${seo}<link rel="preload" href="/fonts/zoho-puvi-regular.woff2" as="font"></head><body>${body}</body></html>`;
  const result = injectTypography(html, '/css/fitclo-typography.css?v=test');
  assert(result.includes(seo), 'preserve existing indexability and SEO');
  assert(result.includes(body), 'preserve localized visible copy and links');
  assert(!result.includes('zoho-puvi-regular.woff2'), 'remove unused preload only');
  assert.equal(result, injectTypography(result, '/css/fitclo-typography.css?v=test'), 'no duplicate stylesheet');
}
const stylesheet = '/css/fitclo-typography.css?v=test';
const homepage = '<html><head><link rel="stylesheet" href="/css/language-menu.css?v=4"><style>body{color:white}</style></head><body>' + body + '</body></html>';
const homepageStyles = { languageMenu: '.language-menu{display:flex}', typography: 'body{font-family:Poppins}' };
const optimized = injectTypography(homepage, stylesheet, homepageStyles);
assert(!optimized.includes('/css/'), 'homepage styles require no additional requests');
assert(optimized.indexOf('fitclo-home-language-menu') < optimized.indexOf('body{color:white}'), 'retain original language CSS cascade');
assert(optimized.indexOf('fitclo-home-typography') > optimized.indexOf('body{color:white}'), 'retain original typography CSS cascade');
assert.equal(optimized, injectTypography(optimized, stylesheet, homepageStyles), 'no duplicate inline styles');

console.log('PASS: typography injection preserves indexability, canonical, schema and localized body; idempotent asset insertion.');
