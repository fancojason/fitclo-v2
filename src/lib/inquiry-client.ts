const attributionKey = 'fitclo-inquiry-attribution';
const campaignKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
let visit: Record<string, string>;

export function initInquiryAttribution() {
  if (visit) return visit;
  const url = new URL(window.location.href);
  let stored: Record<string, string> = {};
  try { stored = JSON.parse(sessionStorage.getItem(attributionKey) || '{}') || {}; } catch {}
  const campaign = Object.fromEntries(campaignKeys.map(key => [key, url.searchParams.get(key) || '']));
  const newCampaign = campaignKeys.some(key => campaign[key]);
  visit = {
    landing_page: stored.landing_page || url.href,
    referrer: stored.landing_page ? stored.referrer || '' : document.referrer,
    ...Object.fromEntries(campaignKeys.map(key => [key, newCampaign ? campaign[key] : stored[key] || ''])),
  };
  try { sessionStorage.setItem(attributionKey, JSON.stringify(visit)); } catch {}
  return visit;
}

export async function submitInquiry(fields: Record<string, FormDataEntryValue>) {
  const language = document.documentElement.lang || 'en';
  const spanish = language.startsWith('es');
  const data: Record<string, unknown> = {
    ...fields, ...initInquiryAttribution(), language,
    page_path: window.location.pathname, page_url: window.location.href,
  };
  delete data.file;
  const file = fields.file;
  if (file instanceof File && file.name) {
    if (!file.size || file.size > 10 * 1024 * 1024 || !/\.(png|ai|pdf)$/i.test(file.name)) {
      throw new Error(spanish ? 'Selecciona un archivo PNG, AI o PDF de hasta 10 MB.' : 'Choose a PNG, AI or PDF file up to 10 MB.');
    }
    const content = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(',')[1]);
      reader.onerror = () => reject(new Error(spanish ? 'No se pudo leer el archivo.' : 'The file could not be read.'));
      reader.readAsDataURL(file);
    });
    data.attachment = { filename: file.name, content };
  }
  const response = await fetch('/submit', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(data), signal: AbortSignal.timeout(30000),
  });
  // A confirmed provider acceptance is a lead event, not proof of inbox delivery.
  const result = await response.clone().json().catch(() => null);
  if (response.ok && result?.success && result.id) {
    const analytics = window as Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };
    const parameters = { language, page_path: window.location.pathname, product_code: String(fields.product_code || ''), inquiry_id: result.id };
    try {
      if (typeof analytics.gtag === 'function') analytics.gtag('event', 'generate_lead', parameters);
      else (analytics.dataLayer ||= []).push({ event: 'generate_lead', ...parameters });
    } catch { /* Analytics must never change the outcome of a successful inquiry. */ }
  }
  return response;
}
