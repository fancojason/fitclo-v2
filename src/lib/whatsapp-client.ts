import { getWhatsAppMessage, getWhatsAppUrl, type WhatsAppContext } from './whatsapp';
import { trackInquiryEvent } from './inquiry-client';

const isWhatsAppLink = (href: string) => {
  try {
    const url = new URL(href);
    return (url.hostname === 'api.whatsapp.com' && url.pathname === '/send') || url.hostname === 'wa.me';
  } catch { return false; }
};

function productOnPage(): Pick<WhatsAppContext, 'productCode' | 'productName'> {
  if (!/^\/(?:es\/)?products\/[^/]+\/?$/.test(window.location.pathname)) return {};
  for (const script of document.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]')) {
    try {
      const schemas = JSON.parse(script.textContent || 'null');
      const product = (Array.isArray(schemas) ? schemas : [schemas]).find((item) => item?.['@type'] === 'Product' && item.sku);
      if (product) return { productCode: String(product.sku), productName: String(product.name || '') };
    } catch { /* Ignore unrelated schema blocks. */ }
  }
  const code = document.querySelector<HTMLInputElement>('input[name="product_code"]')?.value;
  const name = document.querySelector<HTMLInputElement>('input[name="product_name"]')?.value;
  return code ? { productCode: code, productName: name || '' } : {};
}

export function initWhatsAppLinks() {
  if (document.documentElement.dataset.whatsappLinks === 'ready') return;
  document.documentElement.dataset.whatsappLinks = 'ready';
  const pageContext: WhatsAppContext = { path: window.location.pathname, language: document.documentElement.lang as WhatsAppContext['language'], ...productOnPage() };
  const contextFor = (link: HTMLElement): WhatsAppContext => {
    const product = link.dataset.waProductCode || link.dataset.waProductName ? link : link.closest<HTMLElement>('[data-wa-product-code]');
    if (product) return { path: pageContext.path, language: pageContext.language, productCode: product.dataset.waProductCode, productName: product.dataset.waProductName, category: product.dataset.waCategory };
    return pageContext;
  };
  const updateLink = (link: HTMLAnchorElement) => {
    if (!isWhatsAppLink(link.href)) return;
    const context = contextFor(link);
    // Product links use the canonical template. Preserve route-specific messages elsewhere.
    if (context.productCode || context.productName) link.href = getWhatsAppUrl(context);
    const details = getWhatsAppMessage(context);
    link.dataset.waMessageType = details.messageType;
    link.dataset.waCategory = details.category;
    if (context.productCode) link.dataset.waProductCode = context.productCode;
    if (context.productName) link.dataset.waProductName = context.productName;
  };
  document.querySelectorAll<HTMLAnchorElement>('a[href]').forEach(updateLink);
  const trigger = document.querySelector<HTMLElement>('#wa-trigger');
  if (trigger) {
    if (pageContext.productCode) trigger.dataset.waUrl = getWhatsAppUrl(pageContext);
    const details = getWhatsAppMessage(pageContext);
    trigger.dataset.waMessageType = details.messageType;
    trigger.dataset.waCategory = details.category;
    if (pageContext.productCode) trigger.dataset.waProductCode = pageContext.productCode;
    if (pageContext.productName) trigger.dataset.waProductName = pageContext.productName;
  }
  document.addEventListener('click', (event) => {
    const element = event.target instanceof Element ? event.target.closest<HTMLElement>('a[href], #wa-trigger') : null;
    if (!element || (element instanceof HTMLAnchorElement && !isWhatsAppLink(element.href))) return;
    const context = contextFor(element);
    const details = getWhatsAppMessage(context);
    const sourceComponent = element.dataset.waSourceComponent || (element.closest('.catalog-product') ? 'CatalogProductCard' : element.closest('[data-ready-card]') ? 'ReadyStockCatalog' : element.closest('[data-wa-product-code]') ? 'ProductCard' : element.id === 'wa-trigger' || element.closest('.whatsapp-float') ? 'FloatingButtons' : element.closest('footer') ? 'Footer' : element.closest('header') ? 'Header' : 'PageCTA');
    const ctaLocation = element.dataset.waCtaLocation || (element.closest('.catalog-product, [data-ready-card]') ? 'product_card' : element.closest('.product-detail-page') ? 'product_detail' : element.closest('footer') ? 'footer' : element.closest('header') ? 'header' : element.closest('section[id="hero"]') ? 'hero' : element.id === 'wa-trigger' || element.closest('.whatsapp-float') ? 'floating' : 'page');
    trackInquiryEvent('whatsapp_click', {
      page_type: details.messageType === 'custom' ? 'article' : details.messageType,
      product_name: context.productName || '', style_code: context.productCode || '',
      cta_location: ctaLocation, source_component: sourceComponent,
      category: details.category, message_type: details.messageType,
    });
  }, true);
}
