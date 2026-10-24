import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const publicPages = (root) => existsSync(root)
  ? readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(join(root, entry.name, 'index.html')))
    .map((entry) => entry.name)
  : [];

const englishBlogs = publicPages(join(dist, 'blogs'));
const spanishBlogs = publicPages(join(dist, 'es', 'blogs'));
const englishProducts = publicPages(join(dist, 'products'));
const spanishProducts = publicPages(join(dist, 'es', 'products'));
const spanishGuides = publicPages(join(dist, 'es', 'guias'));

console.log(JSON.stringify({
  englishBlogPaths: englishBlogs.length,
  spanishBlogPaths: spanishBlogs.length,
  spanishGuidePaths: spanishGuides.length,
  englishProductPaths: englishProducts.length,
  spanishProductPaths: spanishProducts.length,
  missingSameSlugBlogPaths: englishBlogs.filter((slug) => !spanishBlogs.includes(slug)).map((slug) => `/blogs/${slug}/`),
  missingSameSlugProductPaths: englishProducts.filter((slug) => !spanishProducts.includes(slug)).map((slug) => `/products/${slug}/`),
}, null, 2));
