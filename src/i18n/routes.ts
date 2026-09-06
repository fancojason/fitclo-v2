export type SiteLanguage = 'en' | 'es';

const siteUrl = 'https://www.fitcloo.com';

export const localizedRoutePairs = [
  { en: '/', es: '/es/' },
  { en: '/private-label/', es: '/es/private-label-activewear/' },
  { en: '/oem-activewear-manufacturer/', es: '/es/oem-activewear-manufacturer/' },
  { en: '/ready-to-ship/', es: '/es/ready-stock-activewear/' },
  { en: '/contact/', es: '/es/contact/' },
  { en: '/private-label-leggings/', es: '/es/fabricante-de-leggings/' },
  { en: '/private-label-sports-bras/', es: '/es/fabricante-de-sujetadores-deportivos/' },
  { en: '/private-label-yoga-sets/', es: '/es/fabricante-de-conjuntos-de-yoga/' },
  { en: '/gym-shorts-manufacturer/', es: '/es/fabricante-de-shorts-deportivos/' },
  { en: '/products/tank-tops/', es: '/es/fabricante-de-tops-deportivos/' },
] as const;

const normalizePath = (path: string) => {
  if (path === '/') return '/';
  return `/${path.split('/').filter(Boolean).join('/')}/`;
};

export const getLanguageFromPath = (path: string): SiteLanguage =>
  normalizePath(path).startsWith('/es/') ? 'es' : 'en';

export const getLocalizedRoute = (path: string, language: SiteLanguage) => {
  const normalizedPath = normalizePath(path);
  const pair = localizedRoutePairs.find((item) => item.en === normalizedPath || item.es === normalizedPath);
  return pair?.[language] ?? (language === 'es' ? '/es/' : '/');
};

export const getAlternateLinks = (englishPath: string, spanishPath: string) => [
  { hreflang: 'en', href: new URL(normalizePath(englishPath), siteUrl).href },
  { hreflang: 'es', href: new URL(normalizePath(spanishPath), siteUrl).href },
  { hreflang: 'x-default', href: new URL(normalizePath(englishPath), siteUrl).href },
];

