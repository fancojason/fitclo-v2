# Spanish site parity — work in progress

Updated 2026-10-24. This document records actual work, not a release claim.

## Requested acceptance condition

A Spanish visitor can browse the same public information architecture as an English visitor, including the homepage, catalog, product detail pages, blog directory and corresponding articles. Equivalent pages preserve factual content and page structure while presenting Spanish text. Canonical and reciprocal hreflang must only name published equivalents.

## Current inventory from the local production build

- English blog routes: 205. Spanish `/es/blogs/` routes: 0. Five Spanish guides exist at `/es/guias/`; some correspond to English blog articles.
- English product routes: 61. Spanish `/es/products/` detail routes: 8.
- The English catalog data has 254 entries. Spanish ready-stock browsing exists, but there is no full Spanish counterpart to `/products/`.
- German, Dutch and Brazilian Portuguese currently have five core pages each; they are outside this Spanish-first phase.

Run `node scripts/audit-spanish-parity.mjs` after building to refresh the route inventory.

## Translation experiment and quality gate

The user authorized AI-first translation followed by factual and page review. An isolated draft generator translated 19 blog pages and the 254 catalog names/descriptions into `.spanish-drafts/`. These drafts were **not published** or added to the sitemap. The article draft check found 3 of 19 pages with lost numeric tokens and all 19 still had English URLs in structured data. Manual sampling found B2B terminology errors (for example, “bulk production” was translated as a bulk package) and several unnatural product names. The literal translator is therefore not safe to publish without correction.

The generated drafts and translation cache are local review material only. Before publishing each page: verify all SKUs, compositions, sizes, MOQ, inventory and lead-time language; compare heading/table/image and FAQ structure; review Spanish terminology; rewrite all internal links and structured-data URLs; validate canonical, reciprocal hreflang and sitemap; build and visually inspect desktop/mobile output.

## No production change in this phase yet

The last live deployment remains the five-language core-page release. Do not describe the Spanish content parity task as deployed or complete until the full review and release checks have passed.
