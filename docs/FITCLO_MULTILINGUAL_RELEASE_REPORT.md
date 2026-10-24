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
| 8 Production and search platforms | PENDING | Local build and preview passed. Update after feature-branch preview and production verification. |

## Tests run

- `npm run build`: PASS (367 pages).
- `node scripts/check-core-locales.mjs`: PASS.
- `node --test functions/submit.test.mjs functions/submit-attachments.test.mjs functions/product-selection-merge.test.mjs functions/product-selection-suppliers.test.mjs`: PASS (8 tests).
- Browser preview: desktop DE page and mobile contact pages in DE/NL/PT-BR, equivalent-page selector, German required-field validation. No horizontal overflow at 390px. No real form or WhatsApp message sent.
- No `lint`, `typecheck` or `test` npm scripts are defined in `package.json`; they are not claimed as passed.

## Release and rollback

Cloudflare Pages publishes from `main`. Push to the feature branch for a preview if Cloudflare Pages provides one; after preview verification and passing tests, publish by fast-forwarding or merging the reviewed feature commit into `main`. Revert that commit on `main` if production reveals a serious regression, then verify the old EN/ES URLs and new-route removal.

## Data not confirmed

Current inventory, model-specific MOQ, branding feasibility, sample cost, production schedule and Brazil shipping/customs. These were intentionally described as subject to confirmation. Search indexing and actual sales-lead delivery require external platform evidence.
