import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import spanishProductAssets from './scripts/spanish-product-assets.mjs';
import typographyAssets from './scripts/typography-assets.mjs';
import headerCategoryLinks from './scripts/header-category-links.mjs';
import russianMirrors from './scripts/russian-mirrors.mjs';

export default defineConfig({
  site: 'https://www.fitcloo.com',
  integrations: [tailwind(), spanishProductAssets(), typographyAssets(), headerCategoryLinks(), russianMirrors(),
    russianMirrors({ prefix: 'de', language: 'de', ogLocale: 'de_DE', data: 'de-mirror.json' }),
    russianMirrors({ prefix: 'nl', language: 'nl', ogLocale: 'nl_NL', data: 'nl-mirror.json' }),
    russianMirrors({ prefix: 'pt-br', language: 'pt-BR', ogLocale: 'pt_BR', data: 'pt-br-mirror.json' })]
});
