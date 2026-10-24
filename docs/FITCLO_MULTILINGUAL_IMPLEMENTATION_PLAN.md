# Fitclo core-page localization implementation

## Architecture and actual routes

The site is an Astro static build on Cloudflare Pages. The existing `/es/` implementation uses `BaseLayout`, a shared EN/ES route table, `Header`, `Footer`, `FloatingButtons`, `InquiryForm`, and `/submit`. This change extends that route table instead of adding an unrelated translation framework. The three new languages render from one `CoreLocalePage` component and independently maintained DE, NL, and PT-BR editorial content. Existing EN and ES page bodies and URLs remain unchanged.

| Intent | English canonical | Spanish canonical | New paths |
|---|---|---|---|
| Home | `/` | `/es/` | `/de/`, `/nl/`, `/pt-br/` |
| Private label | `/private-label/` | `/es/private-label-activewear/` | `/{locale}/private-label-activewear/` |
| OEM/ODM | `/oem-activewear-manufacturer/` | `/es/oem-activewear-manufacturer/` | `/{locale}/oem-activewear-manufacturer/` |
| Existing styles | `/ready-to-ship/` | `/es/ready-stock-activewear/` | `/{locale}/ready-stock-activewear/` |
| Contact | `/contact/` | `/es/contact/` | `/{locale}/contact/` |

`{locale}` means `de`, `nl`, or `pt-br`. The task document's expected English private-label and ready-stock paths do not match the existing production URLs; this implementation preserves the actual canonicals.

## Touched areas

- `src/content/core-locales.ts`: self-contained editorial and UI copy for fifteen pages.
- `src/pages/[locale]/`: static route generation, no runtime locale redirect.
- `src/components/CoreLocalePage.astro`, `CoreLocaleHeader.astro`, `CoreLocaleFooter.astro`: existing palette and shared layout, locale-specific core-page navigation and contact form.
- `src/i18n/routes.ts`, `Header.astro`: equivalent-page language switching, with homepage fallback where a translation does not exist.
- `BaseLayout.astro`, `FloatingButtons.astro`, `src/lib/whatsapp.ts`, `whatsapp-client.ts`: locale metadata and inquiry CTAs.
- `src/pages/sitemap-0.xml.ts`: fifteen new canonical locations.

## Release method and risks

The primary checkout contained extensive pre-existing uncommitted changes. All work is in an isolated managed worktree based on the remote default branch. Production is published by pushing a tested commit to `main`, which triggers the existing Cloudflare Pages deployment and Google sitemap / IndexNow workflows. Verify the deployed page before reporting it live. Roll back via a revert commit on `main` if production QA finds a regression.

Facts requiring quotation rather than fixed promises: current stock, MOQ per model, customization feasibility, sample cost, lead time, shipping options, customs and taxes. New content makes no universal claims for these.
