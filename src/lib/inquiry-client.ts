const attributionKey = 'fitclo-inquiry-attribution';
const campaignKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
let visit: Record<string, string>;

type AnalyticsWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };

export function trackInquiryEvent(eventName: string, parameters: Record<string, string> = {}) {
  const language = document.documentElement.lang || 'en';
  const analytics = window as AnalyticsWindow;
  const eventParameters = {
    language,
    site_language: language,
    page_path: window.location.pathname,
    ...parameters,
  };
  try {
    if (typeof analytics.gtag === 'function') analytics.gtag('event', eventName, eventParameters);
    else (analytics.dataLayer ||= []).push({ event: eventName, ...eventParameters });
  } catch { /* Analytics must never interrupt an inquiry. */ }
}

export function initInquiryTracking() {
  if (document.documentElement.dataset.inquiryTracking === 'ready') return;
  document.documentElement.dataset.inquiryTracking = 'ready';
  const startedForms = new WeakSet<HTMLFormElement>();
  const invalidForms = new WeakSet<HTMLFormElement>();
  const findForm = (target: EventTarget | null) =>
    target instanceof Element ? target.closest<HTMLFormElement>('form#inquiry-form, form[data-product-inquiry-form]') : null;
  const formParameters = (form: HTMLFormElement) => ({
    form_type: form.matches('[data-product-inquiry-form]') ? 'product_inquiry' : 'inquiry',
    product_code: String(new FormData(form).get('product_code') || ''),
  });
  const trackStart = (event: Event) => {
    const form = findForm(event.target);
    if (!form || startedForms.has(form)) return;
    startedForms.add(form);
    trackInquiryEvent('form_start', formParameters(form));
  };
  document.addEventListener('focusin', trackStart, true);
  document.addEventListener('input', trackStart, true);
  document.addEventListener('submit', (event) => {
    const form = findForm(event.target);
    if (form) trackInquiryEvent('form_submit_attempt', formParameters(form));
  }, true);
  document.addEventListener('invalid', (event) => {
    const form = findForm(event.target);
    if (!form || invalidForms.has(form)) return;
    invalidForms.add(form);
    trackInquiryEvent('form_validation_error', {
      ...formParameters(form),
      field_name: event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement || event.target instanceof HTMLTextAreaElement
        ? event.target.name
        : '',
    });
    queueMicrotask(() => invalidForms.delete(form));
  }, true);
  document.addEventListener('click', (event) => {
    const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="mailto:"]') : null;
    if (!link) return;
    trackInquiryEvent('email_click', {
      cta_location: window.location.pathname === '/inquiry/' ? 'inquiry_page' : link.closest('footer') ? 'footer' : 'page',
    });
  }, true);
}

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
      trackInquiryEvent('form_submit_error', { error_type: 'attachment_validation', product_code: String(fields.product_code || '') });
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
  let response: Response;
  try {
    response = await fetch('/submit', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data), signal: AbortSignal.timeout(30000),
    });
  } catch (error) {
    trackInquiryEvent('form_submit_error', { error_type: error instanceof DOMException && error.name === 'TimeoutError' ? 'timeout' : 'network', product_code: String(fields.product_code || '') });
    throw error;
  }
  // A confirmed provider acceptance is a lead event, not proof of inbox delivery.
  const result = await response.clone().json().catch(() => null);
  if (response.ok && result?.success && result.id) {
    trackInquiryEvent('generate_lead', { product_code: String(fields.product_code || ''), inquiry_id: result.id });
  } else {
    trackInquiryEvent('form_submit_error', {
      error_type: response.ok ? 'provider_response' : `http_${response.status}`,
      product_code: String(fields.product_code || ''),
    });
  }
  return response;
}
