# FITCLO Website

FITCLO independent-site source project built with Astro and Tailwind CSS.

## Environment Requirements

- Node.js 20 LTS (the required version is also recorded in `.nvmrc`)
- npm 10 or later (installed with Node.js 20)
- Git (recommended for future GitHub updates)

## Install Dependencies

Open a terminal in the project root, then run:

```bash
npm ci
```

`npm ci` installs the exact dependency versions recorded in `package-lock.json`.

## Start Local Development

```bash
npm run dev
```

Open the local address printed by Astro, normally `http://localhost:4321`.

## Common Commands

```bash
# Start the development server
npm run dev

# Build a production version
npm run build

# Preview the completed production build locally
npm run preview

# Prepare one product image for the local product-media workflow
npm run media:product

# Convert referenced product images to WebP
npm run media:convert-products

# Move referenced external static images into local project assets
npm run media:migrate-external
```

## Restore on a New Computer

1. Copy `Fitcloo-project-backup.zip` to the new computer and extract it.
2. Open the extracted `fitclo-v2-git` folder in VS Code or another editor.
3. Install Node.js 20 LTS. Confirm it with `node --version`.
4. In the project root, run `npm ci`.
5. Run `npm run dev` and open the local URL shown in the terminal.
6. To publish future changes, configure GitHub access on the new computer, check `git status`, then commit and push to the `main` branch. Cloudflare Pages will deploy the pushed version automatically.

## Important Project Notes

- Product images are stored locally under `public/images/products/<style-code>/` and should remain in WebP when possible.
- Product videos belong under `public/videos/`.
- Do not commit `.env` files, API keys, or the Google Search Console service-account JSON key.
- The included GitHub workflow can submit the sitemap after a production content push. Its required secret is documented in `.github/SEARCH_CONSOLE_AUTOMATION.md`.
