# Core-language SEO QA

Checked on 2026-10-24 against a local Astro production build. Production status is tracked separately in `FITCLO_MULTILINGUAL_RELEASE_REPORT.md`.

| Intent | EN | ES | DE | NL | PT-BR |
|---|---|---|---|---|---|
| Home | `/` | `/es/` | `/de/` | `/nl/` | `/pt-br/` |
| Private label | `/private-label/` | `/es/private-label-activewear/` | `/de/private-label-activewear/` | `/nl/private-label-activewear/` | `/pt-br/private-label-activewear/` |
| OEM/ODM | `/oem-activewear-manufacturer/` | `/es/oem-activewear-manufacturer/` | `/de/oem-activewear-manufacturer/` | `/nl/oem-activewear-manufacturer/` | `/pt-br/oem-activewear-manufacturer/` |
| Ready stock | `/ready-to-ship/` | `/es/ready-stock-activewear/` | `/de/ready-stock-activewear/` | `/nl/ready-stock-activewear/` | `/pt-br/ready-stock-activewear/` |
| Contact | `/contact/` | `/es/contact/` | `/de/contact/` | `/nl/contact/` | `/pt-br/contact/` |

All paths are relative to `https://www.fitcloo.com`. The new pages self-canonicalize. Only these five equivalent intent groups receive five-language reciprocal hreflang; unrelated EN/ES pages keep their actual EN/ES pair. `x-default` points to English. Locale-tag mapping: `de`, `nl`, `pt-BR` (`pt-br` path). No IP redirection is used.

## Local verification

- `npm run build`: PASS, 367 pages built.
- `node scripts/check-core-locales.mjs`: PASS; all 15 pages exist with matching `html lang`, title, description, robots, self-canonical, six alternate entries, sitemap entry and valid localized core links. Five EN and five ES equivalents contain reciprocal new-language entries.
- Existing `public/robots.txt` allows these paths and points to the sitemap; the existing sitemap generator now includes all fifteen canonical URLs.
- Browser preview: German homepage at desktop size; German and Dutch/Brazilian contact pages at 390px viewport. No horizontal overflow; new-language selector navigated between equivalent contact pages. The German required-field message appeared in German after an empty submit attempt; no real inquiry was sent.
- WhatsApp uses the existing business number and URL encoder; visible messages and form fields are localized. Backend submissions retain language, page path, landing page, referrer and the optional same-site source page. GA4 event helper attaches language and page path without personal data.
- Organization and breadcrumb schemas use existing facts; the new pages do not add prices, ratings, stock quantities or certificates.

## Limits

- Search-engine crawl and index status cannot be inferred from a local build or a sitemap submission. Production and search-platform results must be recorded after deployment.
- Stock, per-style MOQ, branding feasibility, samples, production duration, Brazil shipping/taxes and destination customs require quotation or independent confirmation. The published editorial copy avoids universal claims.
