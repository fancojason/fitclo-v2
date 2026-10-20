# Fitclo technical SEO repair — 2026-10-20

Scope: the Astro repository at `fancojason/fitclo-v2`, its static production build, and read-only HTTP checks of `www.fitcloo.com`. This report distinguishes build verification from search-engine indexing. Search Console indexing status was not accessed in this audit.

## Before and after

| Check | Before | After local build | Change |
| --- | --- | --- | --- |
| Built HTML files | 328 (including verification, admin, noindex and 404 files) | 328 | No page removed or URL changed |
| Canonical indexable URLs in sitemap | 323 | 323 | No new duplicate or noindex URL |
| Sitemap URLs with missing built page / duplicate entry | 0 / 0 | 0 / 0 | Already sound |
| Indexable pages missing title, description or single H1 | 0 | 0 | Already sound; admin and verification files are excluded |
| Duplicate title/description on indexable pages | 0 | 0 | The only duplicate was a previously redirected, noindex legacy article |
| Country pages using a generic country-swapped title and H1 | 15 | 0 | Titles, descriptions and H1 now reflect each page's actual buyer focus |
| Breadcrumb targets without a built page | 18 | 0 | Default breadcrumbs now use valid Home → current page; authored breadcrumbs are preserved |
| Pages with multiple BreadcrumbList objects | Present on pages with authored breadcrumbs | 0 | Default schema is omitted when a page supplies its own |
| FAQ questions in JSON-LD but absent from visible copy | 21 | 0 | Removed unmatched FAQ markup or aligned it with visible questions and answers |
| Unparseable JSON-LD | 0 | 0 | No regression |
| Missing image alt attributes in built HTML | 0 | 0 | No regression |
| Internal links to missing HTML routes / orphaned sitemap URLs | 0 / 0 | 0 / 0 | No regression |

The comparison scans generated HTML, sitemap XML, internal anchor targets and JSON-LD. It is a deterministic code/build check, not a claim that Google has crawled or indexed each page.

## Repairs

- `src/data/marketLandingPages.ts`: wrote distinct, factual titles, descriptions and H1 lines for the 15 market pages that used a country-name template. UK and Australia already had distinct metadata and were left intact. No unsupported local manufacturing or shipping claims were added.
- `src/layouts/BaseLayout.astro`: removed generic text automatically appended to short blog descriptions (some were clipped to an unnatural ending); default BreadcrumbList now contains only real URLs and is not duplicated when a page has a more specific authored breadcrumb.
- FAQ schema: `/es/` no longer emits untranslated English FAQ JSON-LD from the translated home component; `/ready-to-ship/` and the Russian market page now describe their visible questions and answers; two older blog posts no longer emit FAQ questions that the article does not display. Their article content remains.
- Two older article schema blocks now use their canonical trailing-slash URL and an absolute Fitclo logo URL.
- `public/_redirects` gives the conventional `/sitemap.xml` path a permanent redirect to the existing `/sitemap-index.xml`; `robots.txt` advertises the sitemap index once. The actual sitemap index and child sitemap remain unchanged.

## Live checks before deployment

- `https://fitcloo.com/` and `https://fitcloo.com/products/` returned **301** to the `www` host.
- `/products` returned **308** to `/products/`; an old `.html` blog URL and `/blogs/oem-odm/` returned **301** to their canonical article URLs.
- `/products/?category=yoga` returned 200; its canonical is the parameter-free product catalog path. Filters therefore do not create separate sitemap entries.
- An unknown path returned **404**. Important pages were not blocked by `robots.txt`.
- Before this repair, `/sitemap.xml` returned 404 while `/sitemap-index.xml` was the advertised valid sitemap. The new alias must be verified on the deployed site.

The non-www plus no-trailing-slash combination can traverse two permanent redirects (host, then slash). Internal links and sitemap URLs use canonical `www` trailing-slash URLs, so ordinary crawl paths avoid this chain. Edge-rule consolidation is optional and should be assessed in Cloudflare if redirect-chain telemetry shows meaningful crawl volume.

## Validation and follow-up

- Production build: `npm run build` passed, 327 Astro pages generated.
- Existing function tests: four `functions/*.test.mjs` suites passed.
- After deployment, check the changed market and FAQ URLs return 200, self-canonical, indexable HTML, correct visible content and relevant internal links. Confirm `/sitemap.xml` redirects to the index and the sitemap index/child XML return 200.
- The existing repository workflow may submit sitemap updates, but a submission is not proof of crawl or indexing. In Google Search Console, inspect priority updated canonical URLs with URL Inspection and request indexing once after live verification; check Page indexing and search performance later. No GSC indexing request or indexed-status verification is claimed here.
- `sitemap-0.xml.ts` contains manually maintained lastmod dates. This repair does not rewrite historical dates without a reliable per-page publication source. For affected market pages, update lastmod from release metadata in a future dedicated change if it is important for operations; inaccurate dates should not be manufactured.
