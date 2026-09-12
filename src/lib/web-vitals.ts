import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from 'web-vitals';

type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

const categoryPaths = new Set([
  '/products/',
  '/products/sports-bras/',
  '/products/gym-shorts/',
  '/products/training-pants/',
  '/products/leggings/',
  '/products/t-shirts/',
  '/products/tank-tops/',
  '/products/matching-sets/',
  '/products/jumpsuits/',
  '/products/jackets/',
  '/es/fabricante-de-leggings/',
  '/es/fabricante-de-sujetadores-deportivos/',
  '/es/fabricante-de-conjuntos-de-yoga/',
  '/es/fabricante-de-shorts-deportivos/',
  '/es/ropa-deportiva-al-por-mayor/',
  '/es/fabricante-de-tops-deportivos/',
]);

const commercialPaths = new Set([
  '/es/fabricante-ropa-deportiva-espana/',
  '/private-label/',
  '/oem-activewear-manufacturer/',
  '/ready-to-ship/',
  '/custom-activewear-labels-packaging/',
  '/capabilities/',
  '/private-label-leggings/',
  '/private-label-sports-bras/',
  '/private-label-yoga-sets/',
  '/gym-shorts-manufacturer/',
  '/seamless-activewear-manufacturer/',
  '/tennis-wear-manufacturer/',
  '/premium-womens-activewear-manufacturer-china/',
  '/es/private-label-activewear/',
  '/es/oem-activewear-manufacturer/',
  '/es/ready-stock-activewear/',
]);

export function classifyAnalyticsPageType(pathname: string) {
  if (pathname === '/' || pathname === '/es/') return 'homepage';
  if (categoryPaths.has(pathname)) return 'category';
  if (/^\/(?:es\/)?products\/[^/]+\/$/.test(pathname)) return 'product';
  if (
    pathname.startsWith('/blogs/') ||
    pathname.startsWith('/guides/') ||
    pathname.startsWith('/es/guias/') ||
    pathname.startsWith('/activewear-intelligence/')
  ) return 'buyer_guide';
  if (
    commercialPaths.has(pathname) ||
    pathname.startsWith('/wholesale-to/')
  ) return 'commercial';
  if (pathname === '/contact/' || pathname === '/es/contact/' || pathname === '/inquiry/') return 'contact';
  return 'other';
}

export function initWebVitals() {
  if (!['www.fitcloo.com', 'fitcloo.com'].includes(window.location.hostname)) return;

  const analytics = window as AnalyticsWindow;
  const sendToAnalytics = ({ name, delta, value, id, rating, navigationType }: Metric) => {
    const productCode = document.querySelector<HTMLInputElement>('input[name="product_code"]')?.value.trim();
    const parameters: Record<string, string | number> = {
      value: delta,
      metric_id: id,
      metric_value: value,
      metric_delta: delta,
      metric_rating: rating,
      navigation_type: navigationType,
      page_location: `${window.location.origin}${window.location.pathname}`,
      page_path: window.location.pathname,
      page_type: classifyAnalyticsPageType(window.location.pathname),
      site_language: document.documentElement.lang.split('-')[0] || 'en',
    };
    if (productCode) parameters.product_code = productCode;

    if (typeof analytics.gtag === 'function') analytics.gtag('event', name, parameters);
    else (analytics.dataLayer ||= []).push({ event: name, ...parameters });
  };

  onCLS(sendToAnalytics);
  onFCP(sendToAnalytics);
  onINP(sendToAnalytics);
  onLCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
}
