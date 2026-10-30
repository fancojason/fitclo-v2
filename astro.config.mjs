import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import spanishProductAssets from './scripts/spanish-product-assets.mjs';
import typographyAssets from './scripts/typography-assets.mjs';

export default defineConfig({
  site: 'https://www.fitcloo.com',
  integrations: [tailwind(), spanishProductAssets(), typographyAssets()]
});
