import { intelligenceCategories } from '../data/intelligence';
import { productCategories } from '../data/productCategories';

const site = 'https://www.fitcloo.com';

const staticPages = [
  '/',
  '/about/',
  '/activewear-intelligence/',
  '/blogs/',
  '/capabilities/',
  '/contact/',
  '/guides/',
  '/private-label/',
  '/products/',
  '/ready-to-ship/',
];

const guidePages = [
  '/guides/leggings/',
  '/guides/moq/',
  '/guides/pricing/',
  '/guides/private-label-vs-oem/',
  '/guides/sport-bras/',
  '/guides/yoga-sets/',
];

const blogModules = import.meta.glob('./blogs/*.astro', { eager: true });
const blogPages = Object.keys(blogModules)
  .map((path) => path.replace('./blogs/', '').replace(/\.astro$/, ''))
  .filter((slug) => slug !== 'index')
  .filter((slug) => !slug.includes('.'))
  .map((slug) => `/blogs/${slug}/`);

const intelligenceCategoryPages = intelligenceCategories.map(
  (category) => `/activewear-intelligence/${category.slug}/`,
);

const productCategoryPages = productCategories.map(
  (category) => `/products/${category.slug}/`,
);

const productModules = import.meta.glob('./products/*.astro', { eager: true });
const productDetailPages = Object.keys(productModules)
  .map((path) => path.replace('./products/', '').replace(/\.astro$/, ''))
  .filter((slug) => slug !== 'index' && !slug.startsWith('['))
  .map((slug) => `/products/${slug}/`);

const lastModifiedByPath = new Map<string, string>([
  ['/', '2026-07-04'],
  ['/about/', '2026-07-10'],
  ['/activewear-intelligence/', '2026-07-10'],
  ['/blogs/', '2026-07-18'],
  ['/capabilities/', '2026-06-18'],
  ['/contact/', '2026-07-10'],
  ['/guides/', '2026-07-10'],
  ['/private-label/', '2026-07-10'],
  ['/products/', '2026-07-20'],
  ['/products/capri-workout-set/', '2026-07-21'],
  ['/products/matching-sets/', '2026-07-20'],
  ['/products/womens-yoga-set/', '2026-07-16'],
  ['/products/wide-leg-workout-set/', '2026-07-17'],
  ['/ready-to-ship/', '2026-07-10'],
  ['/blogs/activewear-manufacturer-ecuador-import-planning/', '2026-07-15'],
  ['/blogs/activewear-manufacturer-honduras/', '2026-07-15'],
  ['/blogs/capri-leggings-workout-set-trend-2026/', '2026-07-17'],
  ['/blogs/custom-activewear-manufacturing-process/', '2026-07-14'],
  ['/blogs/dfyne-style-activewear-manufacturing/', '2026-07-14'],
  ['/blogs/latin-america-activewear-sourcing-guide/', '2026-07-15'],
  ['/blogs/leggings-pilling-sheer-roll-down-quality-checklist/', '2026-07-18'],
  ['/blogs/private-label-activewear-manufacturer-costa-rica/', '2026-07-15'],
  ['/blogs/private-label-activewear-nicaragua/', '2026-07-15'],
  ['/blogs/starting-activewear-brand-reddit-questions-2026/', '2026-07-18'],
  ['/blogs/why-workout-clothes-smell-polyester-nylon-fabric-guide/', '2026-07-18'],
]);

const getLastModified = (path: string) => {
  const explicitDate = lastModifiedByPath.get(path);
  if (explicitDate) return explicitDate;
  if (path.startsWith('/blogs/')) return '2026-07-11';
  if (path.startsWith('/activewear-intelligence/')) return '2026-07-10';
  if (path.startsWith('/guides/')) return '2026-06-17';
  if (path.startsWith('/products/')) return '2026-07-17';
  return '2026-07-10';
};

const urls = Array.from(
  new Set([
    ...staticPages,
    ...guidePages,
    ...intelligenceCategoryPages,
    ...productCategoryPages,
    ...productDetailPages,
    ...blogPages,
  ]),
).sort();

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
  .map(
    (path) =>
      `  <url>\n    <loc>${escapeXml(`${site}${path}`)}</loc>\n    <lastmod>${getLastModified(path)}</lastmod>\n    <changefreq>${path.startsWith('/blogs/') ? 'weekly' : 'monthly'}</changefreq>\n  </url>`,
  )
  .join('\n')}\n</urlset>\n`;

export const GET = () =>
  new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
