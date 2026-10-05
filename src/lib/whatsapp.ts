export const WHATSAPP_PHONE = '8617160837538';

export type WhatsAppContext = {
  path?: string;
  productCode?: string;
  productName?: string;
  category?: string;
  customMessage?: string;
  language?: 'en' | 'es';
};

export const whatsappMessages = {
  homepage: "Hello Fitclo, I'm interested in your ready-stock/private label activewear. Could you send me your latest styles, MOQ and pricing?",
  ready_stock: "Hello Fitclo, I'm interested in your ready-stock activewear. Could you send me the latest available styles, colors, sizes and wholesale pricing?",
  private_label: "Hello Fitclo, I'm interested in adding my logo, labels and packaging to your existing activewear styles. Could you show me the available options?",
  oem: 'Hello Fitclo, I have my own activewear design and would like to discuss custom development, sample cost and MOQ.',
  article: 'Hello Fitclo, I found your website while researching activewear sourcing. Could you send me your latest catalog, MOQ and private label options?',
} as const;

const categorySubjects: Record<string, string> = {
  leggings: 'leggings',
  'sports-bras': 'sports bras',
  'matching-sets': 'workout sets',
  'gym-shorts': 'workout shorts',
  jumpsuits: 'activewear jumpsuits',
};

export function getWhatsAppMessage(context: WhatsAppContext = {}): { message: string; messageType: string; category: string } {
  if (context.customMessage) return { message: context.customMessage, messageType: 'custom', category: context.category || '' };
  const spanish = context.language === 'es';
  if (context.productCode) {
    const style = `style ${context.productCode}${context.productName ? ` - ${context.productName}` : ''}`;
    return { message: spanish
      ? `Hola Fitclo, me interesa el modelo ${context.productCode}${context.productName ? ` - ${context.productName}` : ''}. ¿Pueden confirmar los colores, tallas, MOQ y precio disponibles?`
      : `Hello Fitclo, I'm interested in ${style}. Could you check the available colors, sizes, MOQ and price for me?`, messageType: 'product', category: context.category || '' };
  }
  const path = (context.path || '/').replace(/^\/(?:es|ru)\//, '/');
  if (/^\/ready-to-ship\/?$/.test(path)) return { message: spanish ? 'Hola Fitclo, me interesa su ropa deportiva en stock. ¿Pueden enviarme los modelos, colores, tallas y precios mayoristas disponibles?' : whatsappMessages.ready_stock, messageType: 'ready_stock', category: '' };
  if (/^\/(?:private-label|private-label-activewear)\/?$/.test(path)) return { message: spanish ? 'Hola Fitclo, quiero añadir mi logo, etiquetas y embalaje a sus modelos actuales de ropa deportiva. ¿Pueden mostrarme las opciones?' : whatsappMessages.private_label, messageType: 'private_label', category: '' };
  if (/^\/(?:oem-activewear-manufacturer|manufacturing|custom-activewear-manufacturer)\/?$/.test(path)) return { message: spanish ? 'Hola Fitclo, tengo mi propio diseño de ropa deportiva y quiero consultar el desarrollo, coste de muestra y MOQ.' : whatsappMessages.oem, messageType: 'oem', category: '' };
  const category = context.category || path.match(/^\/products\/([^/]+)\/?$/)?.[1] || '';
  if (categorySubjects[category]) return {
    message: spanish
      ? `Hola Fitclo, busco ${categorySubjects[category]} para venta mayorista o marca privada. ¿Pueden enviarme los modelos, MOQ y precios?`
      : `Hello Fitclo, I'm looking for wholesale/private label ${categorySubjects[category]}. Could you send me your latest styles, MOQ and pricing?`,
    messageType: 'category', category,
  };
  if (/^\/(?:blogs|activewear-intelligence|guides|guias)(?:\/|$)/.test(path)) return { message: spanish ? 'Hola Fitclo, estoy investigando proveedores de ropa deportiva. ¿Pueden enviarme su catálogo, MOQ y opciones de marca privada?' : whatsappMessages.article, messageType: 'article', category: '' };
  return { message: spanish ? 'Hola Fitclo, me interesa su ropa deportiva en stock y de marca privada. ¿Pueden enviarme sus últimos modelos, MOQ y precios?' : whatsappMessages.homepage, messageType: 'homepage', category: '' };
}

export function getWhatsAppUrl(context: WhatsAppContext = {}): string {
  const { message } = getWhatsAppMessage(context);
  const encoded = encodeURIComponent(message).replace(/[!'()*]/g, (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`);
  return `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encoded}`;
}
