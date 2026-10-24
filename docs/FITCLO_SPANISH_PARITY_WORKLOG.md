# Spanish site parity — release record

Updated 2026-10-24. The user approved machine translation followed by review of commercial facts and page quality.

## Inventory and implementation

- The English build contains 205 blog detail routes and 61 product detail routes. The product catalog contains 254 entries.
- This change adds 293 Spanish static counterparts from reviewed HTML drafts: 196 blog routes (including `/es/blogs/`), 53 product routes (including `/es/products/`), and 44 other public routes.
- Existing curated Spanish pages remain in place, including the homepage, 8 product details, service/category pages and 5 guides. The `/es/` homepage retains the English homepage's section structure and now sends visitors to available Spanish counterparts.
- The 5 English blog articles that already contain substantial Russian text remain untranslated. They are intentionally absent from Spanish hreflang and sitemap claims. One malformed English URL with a canonical pointing elsewhere and the noindex internal product-selection form are also excluded.
- No homepage or primary-navigation layout was changed. Header/footer destinations and body links were localized where a counterpart exists. Spanish catalog cards retain English SKU search terms and add visible Spanish terms to the search index.

## Quality gates run locally

- All 312 draft files passed heading/table/image/form structure checks and a numeric-token preservation check after corrections: 0 errors. Remaining extra-number warnings are Spanish spellings such as `30.000` or translated numbered steps; they do not indicate lost English quantities.
- Common B2B terms were corrected across drafts, including *ropa deportiva*, *marca privada*, *producción en serie* and *mono*. High-traffic company, manufacturing, blog-directory and TZ2570-4 headings received specific editorial corrections.
- The production build succeeded. The built Spanish mirror checker validated 293 pages for files, indexability, canonical, English/Spanish hreflang, structural parity, sitemap inclusion and Spanish internal link existence: 0 errors.
- A final scan of all 319 built Spanish pages found 0 broken `/es/` destinations, including the existing Astro pages.

## Maintenance

The static mirror pages in `public/es/` are generated from English build output. After an English page materially changes, regenerate and review its Spanish draft before republishing. Run `scripts/prepare-spanish-mirror.py`, `npm run build`, `scripts/check-spanish-drafts.py`, and `scripts/check-spanish-mirror.py` for subsequent changes.

This record describes local implementation and tests. Production deployment and live URL verification must be reported separately.
