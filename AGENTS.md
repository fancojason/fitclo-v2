# Homepage ready-stock cards

- When adding a ready-stock product to the homepage card grid, give it a style-specific badge and three distinct customization options selected from logo, hang tag, care label, packaging bag, color box, color, size, and design. Vary the combinations across cards so the grid covers all options; do not use the same badge or customization trio for every style.
- Display `2–7 days*` as the estimated preparation timeline for ready-stock cards, subject to stock confirmation. Keep the existing caveat that this is not delivery time and customization needs its own quoted schedule. Do not apply this timeline to OEM/custom-production cards.

# Product detail pages

- When a product's fabric is given as Nylon / Spandex or Polyamide / Elastane, show the same percentages with both English naming pairs in visible Fabric fields and structured-data material. For example, `70% Nylon / 30% Spandex (70% Polyamide / 30% Elastane)`. Do this even when the source provides only one naming pair; these are alternate names for the same fibers, not additional ingredients. Preserve other layers, GSM and branded fiber names. Never infer missing percentages.
- Follow [the product detail image layout](docs/product-detail-image-layout.md) for gallery and detail image order.

# Search submission after publishing

- After publishing a new indexable page or materially updating an existing page, verify the live canonical URL returns 200 and shows the new content, has a self-canonical, is not `noindex`, appears in the sitemap when appropriate, and has a relevant internal link.
- Submit new and materially updated canonical URLs to Bing through the site's existing IndexNow setup when available. If it is unavailable, establish a verified submission route or report the exact blocker rather than silently skip Bing. Confirm the submission result; do not submit redirects, test URLs, query-string variants, or the sitemap itself. Do not create a second IndexNow integration if one already exists.
- In Google Search Console, request indexing for each new page and important content/SEO update after the live deployment is verified. Prioritize new pages if the interface limits requests. Do not repeatedly request the same unchanged URL; a request is not proof of indexing.
- Record the date, URL, submission method, and confirmed result. Report separately whether the page was submitted, crawled, and indexed. Recheck indexing later instead of promising a fixed timeline.
