# Product detail batch — 20 October 2026

## Evidence and limits

- Source: Google Search Console, `https://www.fitcloo.com/`, Web Search export covering 18 July–17 October 2026. Query impressions below are **category-intent signals**, not demand or inquiries for the selected SKUs. Each listed query had zero clicks in this export.
- `sports bra manufacturers`: 90 impressions; `sports bra manufacturer`: 87; `gym shorts manufacturer`: 34; `capri workout set`: 27; `custom stringer tank tops`: 23; `fitness jackets manufacturer`: 13; `jumpsuit manufacturers`: 12; `tennis clothes manufacturer`: 10.
- Existing category URL impressions: `/products/sports-bras/` 431, `/products/training-pants/` 203, `/products/jumpsuits/` 146, `/products/leggings/` 143, `/products/jackets/` 127, `/products/gym-shorts/` 71. These impressions do not establish which particular products buyers prefer.
- The catalog has 236 cards and, before this batch, 29 mapped product-detail links, all in matching sets. The live catalog shows a product-specific WhatsApp button even where a detail page is absent. GA4 visibly records a `whatsapp_click` event, but no verified per-SKU inquiry or catalog-click ranking was available for this batch. No claim about best-selling or most-inquired styles is made.
- All eight selected cards have a local cover image and a unique style code. Each cover was visually checked against its catalog name and description. Existing catalog `readyStock: true` and `moq: 50 pcs` are treated as catalog references, never as a live-stock guarantee.

## Published shortlist and missing supplier data

| Style | Page | Why selected | Still to verify |
| --- | --- | --- | --- |
| Y4100 | `/products/y4100/` | Halter sports bra; sports-bra sourcing queries and a clear front image | Back, support/coverage, cups, fabric, size chart, live colors/stock, sample and price |
| sm2606-bra | `/products/sm2606-bra/` | Distinct contrast-bound V-neck bra, not a duplicate of Y4100 | Back, support, padding, fabric, size chart, live colors/stock, sample and price |
| 4073 | `/products/4073/` | Biker shorts; gym-shorts query intent and clear high-waist image | Inseam/rise, fabric, opacity, size chart, live colors/stock, sample and price |
| A5796 | `/products/a5796/` | Below-knee capri leggings with visible rear V seam; capri query signal | Inseam/rise, coverage, fabric, size chart, live colors/stock, sample and price |
| DWT7755 | `/products/dwt7755/` | Jacket with zip, stand collar and thumbholes; jacket queries | Garment measurements, zipper/seams, fabric, live colors/stock, sample and price |
| EBX7028 | `/products/ebx7028/` | Contrast-piped tank; opens the tank-top category | Garment length, inner bra construction, fabric, sizes, live colors/stock, sample and price |
| YY126 | `/products/yy126/` | One-piece open-back flare jumpsuit; jumpsuit queries and verified front/back image | Torso/inseam, fit/closure, fabric, sizes, live colors/stock, sample and price |
| 4160 | `/products/4160/` | Racerback tennis dress; tennis-wear queries | Inner shorts, length, fabric, sizes, live colors/stock, sample and price |

The catalog cover is a reference image, not proof that every pictured swatch is currently stocked. The pages use style-specific titles, design observations, sourcing questions, self-canonicals, existing category links and style-specific WhatsApp messages. Product schema has no invented price, stock or rating.

## Candidates deferred after image check

- `FWX2551`: catalog says wide-strap scoop-neck bra; cover looks like a narrow halter strap. Confirm the correct image and product name first.
- `TZ5529-26`: catalog calls it a one-piece flare jumpsuit; cover appears to show separate zip jacket and pants. Do not create a jumpsuit detail page from that image.
- `1668`: catalog calls it a short romper; cover appears to show a top and shorts with a visible gap. Confirm whether this is one piece or a set.
- `FBX4549`: catalog description says neckline stripes; cover shows a solid outer neckline with a striped layer behind it. Clarify the garment construction before using it for a detail page.

## Follow-up measurement

After deployment, check 200 status, canonical, indexability, sitemap and incoming catalog/category links for each URL. Submit canonical URLs to GSC and Bing. Recheck indexing later; a submission is not indexing. After sufficient time, compare each URL's GSC queries and landing-page clicks and GA4 product CTA events, without treating WhatsApp clicks as sent messages or qualified inquiries.
