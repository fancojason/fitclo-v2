import { intelligenceCategories } from '../data/intelligence';
import { productCategories } from '../data/productCategories';
import { marketLandingPaths } from '../data/marketLandingPages';

const site = 'https://www.fitcloo.com';

const staticPages = [
  '/',
  '/about/',
  '/activewear-intelligence/',
  '/activewear-sampling-product-development/',
  '/activewear-quality-control-inspection/',
  '/activewear-tech-pack-pattern-development/',
  '/blogs/',
  '/capabilities/',
  '/contact/',
  '/custom-activewear-labels-packaging/',
  '/guides/',
  '/private-label/',
  '/private-label-yoga-sets/',
  '/private-label-sports-bras/',
  '/premium-womens-activewear-manufacturer-china/',
  '/private-label-leggings/',
  '/products/',
  '/oem-activewear-manufacturer/',
  '/ready-to-ship/',
  '/ru/china-activewear-manufacturer-russia/',
  '/seamless-activewear-manufacturer/',
  '/tennis-wear-manufacturer/',
  '/gym-shorts-manufacturer/',
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
  ['/blogs/', '2026-07-24'],
  ['/capabilities/', '2026-06-18'],
  ['/contact/', '2026-07-10'],
  ['/guides/', '2026-07-10'],
  ['/private-label/', '2026-07-10'],
  ['/premium-womens-activewear-manufacturer-china/', '2026-07-27'],
  ['/products/', '2026-07-23'],
  ['/products/capri-workout-set/', '2026-07-23'],
  ['/products/matching-sets/', '2026-07-23'],
  ['/products/racerback-tennis-skirt-set/', '2026-07-23'],
  ['/products/three-quarter-sleeve-capri-workout-set/', '2026-07-23'],
  ['/products/premium-3-piece-yoga-set/', '2026-07-28'],
  ['/products/womens-yoga-set/', '2026-07-16'],
  ['/products/wide-leg-workout-set/', '2026-07-17'],
  ['/ready-to-ship/', '2026-07-10'],
  ['/ru/china-activewear-manufacturer-russia/', '2026-07-28'],
  ['/blogs/russia-activewear-sourcing-from-china/', '2026-07-28'],
  ['/blogs/wholesale-yoga-sets-russia-fitness-brands/', '2026-07-28'],
  ['/blogs/ready-stock-activewear-russian-boutiques/', '2026-07-28'],
  ['/blogs/private-label-leggings-russia-online-stores/', '2026-07-28'],
  ['/blogs/sports-bras-gym-sets-russia-wholesale/', '2026-07-28'],
  ['/blogs/activewear-manufacturer-ecuador-import-planning/', '2026-07-15'],
  ['/blogs/activewear-manufacturer-honduras/', '2026-07-15'],
  ['/blogs/activewear-pockets-skorts-utility-design/', '2026-07-23'],
  ['/blogs/best-activewear-manufacturers-in-china-2026/', '2026-07-27'],
  ['/blogs/capri-leggings-workout-set-trend-2026/', '2026-07-17'],
  ['/blogs/china-activewear-manufacturer-faq/', '2026-07-24'],
  ['/blogs/custom-activewear-manufacturing-process/', '2026-07-14'],
  ['/blogs/dfyne-style-activewear-manufacturing/', '2026-07-14'],
  ['/blogs/latin-america-activewear-sourcing-guide/', '2026-07-15'],
  ['/blogs/leggings-pilling-sheer-roll-down-quality-checklist/', '2026-07-18'],
  ['/blogs/no-front-seam-leggings-camel-toe-free-activewear/', '2026-07-23'],
  ['/blogs/private-label-activewear-manufacturer-costa-rica/', '2026-07-15'],
  ['/blogs/private-label-activewear-nicaragua/', '2026-07-15'],
  ['/blogs/starting-activewear-brand-reddit-questions-2026/', '2026-07-18'],
  ['/blogs/supportive-sports-bras-large-bust-design-guide/', '2026-07-23'],
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
    ...marketLandingPaths,
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
