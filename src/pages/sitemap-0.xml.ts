import { intelligenceCategories } from '../data/intelligence';

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
  .map((path) => path.replace('./blogs/', '').replace('.astro', ''))
  .filter((slug) => slug !== 'index')
  .map((slug) => `/blogs/${slug}/`);

const intelligenceCategoryPages = intelligenceCategories.map(
  (category) => `/activewear-intelligence/${category.slug}/`,
);

const urls = Array.from(
  new Set([...staticPages, ...guidePages, ...intelligenceCategoryPages, ...blogPages]),
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
      `  <url>\n    <loc>${escapeXml(`${site}${path}`)}</loc>\n    <changefreq>${path.startsWith('/blogs/') ? 'weekly' : 'monthly'}</changefreq>\n  </url>`,
  )
  .join('\n')}\n</urlset>\n`;

export const GET = () =>
  new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
