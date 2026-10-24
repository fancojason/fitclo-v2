export type SiteLanguage = 'en' | 'es' | 'de' | 'nl' | 'pt-BR';

export const newLanguages = ['de', 'nl', 'pt-BR'] as const;
export const languagePrefix: Record<SiteLanguage, string> = { en: '/', es: '/es/', de: '/de/', nl: '/nl/', 'pt-BR': '/pt-br/' };
type LocalizedRoutePair = { en: string; es: string; de?: string; nl?: string; 'pt-BR'?: string };

const siteUrl = 'https://www.fitcloo.com';

export const localizedRoutePairs: LocalizedRoutePair[] = [
  { en: '/wholesale-to/spain/', es: '/es/fabricante-ropa-deportiva-espana/' },
  { en: '/', es: '/es/', de: '/de/', nl: '/nl/', 'pt-BR': '/pt-br/' },
  { en: '/private-label/', es: '/es/private-label-activewear/', de: '/de/private-label-activewear/', nl: '/nl/private-label-activewear/', 'pt-BR': '/pt-br/private-label-activewear/' },
  { en: '/oem-activewear-manufacturer/', es: '/es/oem-activewear-manufacturer/', de: '/de/oem-activewear-manufacturer/', nl: '/nl/oem-activewear-manufacturer/', 'pt-BR': '/pt-br/oem-activewear-manufacturer/' },
  { en: '/ready-to-ship/', es: '/es/ready-stock-activewear/', de: '/de/ready-stock-activewear/', nl: '/nl/ready-stock-activewear/', 'pt-BR': '/pt-br/ready-stock-activewear/' },
  { en: '/contact/', es: '/es/contact/', de: '/de/contact/', nl: '/nl/contact/', 'pt-BR': '/pt-br/contact/' },
  { en: '/private-label-leggings/', es: '/es/fabricante-de-leggings/' },
  { en: '/private-label-sports-bras/', es: '/es/fabricante-de-sujetadores-deportivos/' },
  { en: '/private-label-yoga-sets/', es: '/es/fabricante-de-conjuntos-de-yoga/' },
  { en: '/gym-shorts-manufacturer/', es: '/es/fabricante-de-shorts-deportivos/' },
  { en: '/products/tank-tops/', es: '/es/fabricante-de-tops-deportivos/' },
  ...['0636', '3708', 'tz4510-14', 'tz2557-6', 'tz5560-2', 'tz5555-4', 'tz4506-4', 'tz4535-12'].map((sku) => ({ en: `/products/${sku}/`, es: `/es/products/${sku}/` })),
  { en: '/blogs/oem-vs-odm-vs-private-label-activewear/', es: '/es/guias/marca-privada-vs-oem-odm/' },
  { en: '/blogs/activewear-manufacturing-cost-guide/', es: '/es/guias/precio-fabricar-ropa-deportiva-personalizada/' },
  { en: '/blogs/custom-activewear-manufacturing-process/', es: '/es/guias/desarrollar-coleccion-ropa-deportiva/' },
  { en: '/blogs/activewear-sample-to-bulk-quality-failures/', es: '/es/guias/problemas-calidad-ropa-deportiva-muestra-produccion/' },
];

const normalizePath = (path: string) => {
  if (path === '/') return '/';
  return `/${path.split('/').filter(Boolean).join('/')}/`;
};

export const getLanguageFromPath = (path: string): SiteLanguage =>
  (Object.entries(languagePrefix).find(([language, prefix]) => language !== 'en' && normalizePath(path).startsWith(prefix))?.[0] as SiteLanguage) || 'en';

export const getLocalizedRoute = (path: string, language: SiteLanguage) => {
  const normalizedPath = normalizePath(path);
  const pair = localizedRoutePairs.find((item) => Object.values(item).includes(normalizedPath));
  return pair?.[language] ?? languagePrefix[language];
};

export const getAlternateLinks = (englishPath: string, spanishPath: string) => {
  const pair = localizedRoutePairs.find((item) => item.en === normalizePath(englishPath) && item.es === normalizePath(spanishPath));
  const languages: SiteLanguage[] = ['en', 'es', ...newLanguages];
  const links = languages.flatMap((language) => {
    const path = language === 'en' ? englishPath : language === 'es' ? spanishPath : pair?.[language];
    return path ? [{ hreflang: language, href: new URL(normalizePath(path), siteUrl).href }] : [];
  });
  return [...links, { hreflang: 'x-default', href: new URL(normalizePath(englishPath), siteUrl).href }];
};

