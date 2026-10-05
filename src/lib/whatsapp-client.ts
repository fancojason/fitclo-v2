import { getWhatsAppMessage, getWhatsAppUrl, type WhatsAppContext } from './whatsapp';
import { trackInquiryEvent } from './inquiry-client';

const isWhatsAppLink = (href: string) => {
  try {
    const url = new URL(href);
    return (url.hostname === 'api.whatsapp.com' && url.pathname === '/send') || url.hostname === 'wa.me';
  } catch { return false; }
};

function productOnPage(): Pick<WhatsAppContext, 'productCode' | 'productName'> {
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
  const pageContext: WhatsAppContext = { path: window.location.pathname, language: document.documentElement.lang.startsWith('es') ? 'es' : 'en', ...productOnPage() };
  const contextFor = (link: HTMLElement): WhatsAppContext => {
    const product = link.closest<HTMLElement>('[data-wa-product-code]');
    if (product) return { path: pageContext.path, language: pageContext.language, productCode: product.dataset.waProductCode, productName: product.dataset.waProductName, category: product.dataset.waCategory };
    return pageContext;
  };
  const updateLink = (link: HTMLAnchorElement) => {
    if (!isWhatsAppLink(link.href)) return;
    const context = contextFor(link);
    link.href = getWhatsAppUrl(context);
    const details = getWhatsAppMessage(context);
    link.dataset.waMessageType = details.messageType;
    link.dataset.waCategory = details.category;
    if (context.productCode) link.dataset.waProductCode = context.productCode;
    if (context.productName) link.dataset.waProductName = context.productName;
  };
  document.querySelectorAll<HTMLAnchorElement>('a[href]').forEach(updateLink);
  const trigger = document.querySelector<HTMLElement>('#wa-trigger');
  if (trigger) {
    trigger.dataset.waUrl = getWhatsAppUrl(pageContext);
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
    trackInquiryEvent('whatsapp_click', {
      page_type: details.messageType === 'custom' ? 'article' : details.messageType,
      product_code: context.productCode || '', product_name: context.productName || '',
      category: details.category, message_type: details.messageType,
    });
  }, true);
}
