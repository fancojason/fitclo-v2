# Fitclo DE/NL/PT-BR release report

Updated 2026-10-24. This record distinguishes local checks from production verification.

| Step | Status | Evidence |
|---|---|---|
| 1 Audit and isolation | PASS | Source audited; isolated managed worktree; primary checkout's uncommitted changes untouched. Actual EN core paths documented. |
| 2 Route and switcher extension | PASS locally | Three languages added to shared route table and EN/ES selector; non-equivalent pages fall back to target-language homepage. |
| 3 German core pages | PASS locally | Five static routes generated with German body, FAQ, metadata, CTAs and form. |
| 4 Dutch core pages | PASS locally | Five static routes generated with Dutch body, FAQ, metadata, CTAs and form. |
| 5 Brazilian Portuguese core pages | PASS locally | Five static routes generated; logistics copy does not assert universal DDP, fixed taxes or customs time. |
| 6 International SEO | PASS locally | `check-core-locales.mjs` validates 15 routes, canonicals, hreflang reciprocity, sitemap, links and EN/ES equivalents. |
| 7 Inquiries and analytics | PASS locally | Shared `/submit` route, localized form and WhatsApp copy; existing submit tests pass; no real customer message sent. |
| 8 Production and search platforms | PASS for deployment and submission | Cloudflare preview and production checks succeeded for commit `f6cce2166f0afea23b2a21e6af6d8bf33978a782`; all 15 production URLs returned 200 with their expected language and canonical. Google sitemap and IndexNow workflows both completed successfully. Indexing is not yet established. |

## Tests run

- `npm run build`: PASS (367 pages).
- `node scripts/check-core-locales.mjs`: PASS.
- `node --test functions/submit.test.mjs functions/submit-attachments.test.mjs functions/product-selection-merge.test.mjs functions/product-selection-suppliers.test.mjs`: PASS (8 tests).
- Browser preview: desktop DE page and mobile contact pages in DE/NL/PT-BR, equivalent-page selector, German required-field validation. No horizontal overflow at 390px. No real form or WhatsApp message sent.
- No `lint`, `typecheck` or `test` npm scripts are defined in `package.json`; they are not claimed as passed.

## Release and rollback

Cloudflare Pages published the feature preview at `https://34b833ab.fitclo-v2.pages.dev` and the production deployment from `main` at commit `f6cce2166f0afea23b2a21e6af6d8bf33978a782`. Production verification on 2026-10-24 checked all 15 URLs for HTTP 200, language tag, canonical and hreflang. English and Spanish home/private-label pages and the sitemap also returned 200. If a serious regression appears, revert the feature commit on `main`, then verify the former English and Spanish URLs and removed new routes.

Google Actions run `40058506290` logged `Submitted https://www.fitcloo.com/sitemap-index.xml for https://www.fitcloo.com/.` IndexNow run `40058506240` reported 15 added URL candidates and HTTP 200 acceptance. This is submission evidence, not evidence of crawl, indexation, rankings or leads. No additional account permission was needed for these automated submissions. GSC URL Inspection and Bing Webmaster Tools indexing status were not independently verified.

## Data not confirmed

Current inventory, model-specific MOQ, branding feasibility, sample cost, production schedule and Brazil shipping/customs. These were intentionally described as subject to confirmation. Search indexing and actual sales-lead delivery require external platform evidence.
