# Search submission record — five-language core pages

Status at implementation: local build generated all URLs; live submission must be verified after production deployment. The repository already has a Google sitemap-submission workflow and an IndexNow workflow on pushes to `main`. Neither proves crawling or indexing.

Sitemap: `https://www.fitcloo.com/sitemap-index.xml` (the core URLs are in `https://www.fitcloo.com/sitemap-0.xml`).

| DE | NL | PT-BR |
|---|---|---|
| `https://www.fitcloo.com/de/` | `https://www.fitcloo.com/nl/` | `https://www.fitcloo.com/pt-br/` |
| `https://www.fitcloo.com/de/private-label-activewear/` | `https://www.fitcloo.com/nl/private-label-activewear/` | `https://www.fitcloo.com/pt-br/private-label-activewear/` |
| `https://www.fitcloo.com/de/oem-activewear-manufacturer/` | `https://www.fitcloo.com/nl/oem-activewear-manufacturer/` | `https://www.fitcloo.com/pt-br/oem-activewear-manufacturer/` |
| `https://www.fitcloo.com/de/ready-stock-activewear/` | `https://www.fitcloo.com/nl/ready-stock-activewear/` | `https://www.fitcloo.com/pt-br/ready-stock-activewear/` |
| `https://www.fitcloo.com/de/contact/` | `https://www.fitcloo.com/nl/contact/` | `https://www.fitcloo.com/pt-br/contact/` |

After deployment: verify the fifteen live URLs, inspect the two existing GitHub Actions runs and record actual GSC / IndexNow acceptance or an exact permission error. For Google, sitemap acceptance is separate from URL Inspection requests, crawling and indexing. For Bing, IndexNow acceptance is only a notification, not proof of indexing. Manually request indexing of the three new language homepages in GSC only if authorized and the automated sitemap route has succeeded; do not flood the interface with repeated requests.
