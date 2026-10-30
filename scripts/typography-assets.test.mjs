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
console.log('PASS: typography injection preserves indexability, canonical, schema and localized body; idempotent asset insertion.');
