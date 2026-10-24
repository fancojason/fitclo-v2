export const WHATSAPP_PHONE = '8617160837538';

export type WhatsAppContext = {
  path?: string;
  productCode?: string;
  productName?: string;
  category?: string;
  customMessage?: string;
  language?: 'en' | 'es' | 'de' | 'nl' | 'pt-BR';
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

const coreMessages = {
  de: {
    homepage: 'Hallo Fitclo-Team! Ich interessiere mich für Sportbekleidung im Großhandel und Private Label. Können Sie mir Informationen zu Modellen, MOQ und Preisen schicken?',
    ready_stock: 'Hallo Fitclo-Team! Welche Sportbekleidung ist aktuell in den gewünschten Farben und Größen verfügbar? Bitte teilen Sie MOQ und Großhandelspreise mit.',
    private_label: 'Hallo Fitclo-Team! Ich möchte ein bestehendes Sportbekleidungsmodell mit Logo, Etiketten und Verpackung versehen. Welche Optionen sind für mein Modell möglich?',
    oem: 'Hallo Fitclo-Team! Ich habe einen eigenen Sportbekleidungsentwurf und möchte Entwicklung, Muster und Mindestmenge besprechen.',
  },
  nl: {
    homepage: 'Hallo Fitclo! Ik ben geïnteresseerd in sportkleding voor de groothandel en private label. Kunnen jullie informatie over modellen, minimumafname en prijzen sturen?',
    ready_stock: 'Hallo Fitclo! Welke sportkledingmodellen zijn momenteel beschikbaar in de gewenste kleuren en maten? Graag ontvang ik minimumafname en groothandelsprijzen.',
    private_label: 'Hallo Fitclo! Ik wil een bestaand sportkledingmodel aanpassen met logo, labels en verpakking. Welke opties zijn mogelijk?',
    oem: 'Hallo Fitclo! Ik heb een eigen ontwerp en wil productontwikkeling, monsters en minimumafname bespreken.',
  },
  'pt-BR': {
    homepage: 'Olá, equipe Fitclo! Tenho interesse em roupas fitness no atacado e em opções de marca própria. Podem compartilhar modelos, pedido mínimo e preços?',
    ready_stock: 'Olá, equipe Fitclo! Quais modelos de roupas fitness estão disponíveis nas cores e tamanhos desejados? Gostaria de confirmar pedido mínimo e preços.',
    private_label: 'Olá, equipe Fitclo! Quero personalizar um modelo existente com logo, etiquetas e embalagem. Quais opções são possíveis?',
    oem: 'Olá, equipe Fitclo! Tenho um design próprio de roupa fitness e gostaria de conversar sobre desenvolvimento, amostras e pedido mínimo.',
  },
} as const;

export function getWhatsAppMessage(context: WhatsAppContext = {}): { message: string; messageType: string; category: string } {
  if (context.customMessage) return { message: context.customMessage, messageType: 'custom', category: context.category || '' };
  const spanish = context.language === 'es';
  const core = context.language === 'de' || context.language === 'nl' || context.language === 'pt-BR' ? coreMessages[context.language] : null;
  if (context.productCode) {
    const name = context.productName?.trim() || 'this activewear style';
    return { message: core
      ? context.language === 'de' ? `Hallo Fitclo-Team! Ich interessiere mich für ${name} (Modell: ${context.productCode}). Können Sie Farben, Größen, MOQ und Preis bestätigen?`
        : context.language === 'nl' ? `Hallo Fitclo! Ik ben geïnteresseerd in ${name} (model: ${context.productCode}). Kunnen jullie kleuren, maten, minimumafname en prijs bevestigen?`
        : `Olá, equipe Fitclo! Tenho interesse em ${name} (modelo: ${context.productCode}). Podem confirmar cores, tamanhos, pedido mínimo e preço?`
      : spanish
      ? `Hola Fitclo, me interesa ${name} (Modelo: ${context.productCode}). ¿Pueden compartir la disponibilidad actual de colores y tallas, MOQ, precio y opciones de muestras y envío?`
      : `Hello Fitclo, I'm interested in ${name} (Style: ${context.productCode}). Could you share the current colour and size availability, MOQ, pricing, and sample and shipping options?`, messageType: 'product', category: context.category || '' };
  }
  if (context.productName) return {
    message: spanish
      ? `Hola Fitclo, me interesa ${context.productName}. ¿Pueden confirmar el código de modelo, colores, tallas, MOQ, precio y opciones de muestras y envío?`
      : `Hello Fitclo, I'm interested in ${context.productName} shown on your website. Could you confirm its style code, current colour and size availability, MOQ, pricing, and sample and shipping options?`,
    messageType: 'product_unverified_code', category: context.category || '',
  };
  const path = (context.path || '/').replace(/^\/(?:es|de|nl|pt-br|ru)\//, '/');
  if (core && /^\/(?:ready-stock-activewear|ready-to-ship)\/?$/.test(path)) return { message: core.ready_stock, messageType: 'ready_stock', category: '' };
  if (core && /^\/(?:private-label-activewear|private-label)\/?$/.test(path)) return { message: core.private_label, messageType: 'private_label', category: '' };
  if (core && /^\/oem-activewear-manufacturer\/?$/.test(path)) return { message: core.oem, messageType: 'oem', category: '' };
  if (core) return { message: core.homepage, messageType: 'homepage', category: '' };
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
