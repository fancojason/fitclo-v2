// Real-browser check: every fetch is intercepted; no email or CRM request leaves the tab.
export async function checkCapriInquiry() {
  const assert = (ok, message) => { if (!ok) throw new Error(message); };
  const form = document.querySelector('[data-product-inquiry-form]');
  const select = form.querySelector('[name=inquiry_type]');
  const quote = document.querySelector('[data-product-track=click_quote_cta]');
  const sample = document.querySelector('[data-product-track=click_sample_cta]');
  const originalFetch = window.fetch, originalGtag = window.gtag;
  const events = [], requests = [];
  let succeeds = false;
  window.gtag = (command, name) => { if (command === 'event') events.push(name); };
  window.fetch = async (url, options) => {
    assert(new URL(url, location.href).pathname === '/submit', 'unexpected network request blocked');
    requests.push(JSON.parse(options.body));
    return new Response(JSON.stringify(succeeds ? { success: true, id: 'MOCK-ONLY' } : { error: 'MOCK failure' }), { status: succeeds ? 200 : 502, headers: { 'Content-Type': 'application/json' } });
  };
  const manual = (value) => { select.value = value; select.dispatchEvent(new Event('change', { bubbles: true })); };
  const count = (name) => events.filter(e => e === name).length;
  const wait = async (predicate) => {
    for (let i = 0; i < 100; i++) { if (predicate()) return; await new Promise(r => setTimeout(r, 30)); }
    throw new Error('mock submit did not settle');
  };
  try {
    assert(select.value === '' && !select.required, 'neutral optional default');
    quote.click(); quote.click(); assert(select.value === '', 'quote stays neutral');
    sample.click(); assert(select.value === 'Sample', 'sample preselects');
    quote.click(); assert(select.value === '', 'quote clears automatic sample');
    for (const value of ['Ready Stock', 'Private Label', 'Full OEM', 'Sample', '']) {
      manual(value); sample.click(); quote.click(); assert(select.value === value, `manual ${value} retained`);
    }
    assert(count('click_quote_cta') === 8 && count('click_sample_cta') === 6, 'CTA events exactly once per click');
    assert(count('generate_lead') === 0 && count('quote_form_submit') === 0, 'clicks never mean success');
    form.requestSubmit();
    assert(requests.length === 0, 'existing required fields still block an empty form');
    form.querySelector('[name=name]').value = 'MOCK ONLY';
    form.querySelector('[name=email]').value = 'buyer@example.invalid';
    form.querySelector('[name=message]').value = 'MOCK ONLY - no real delivery';
    form.requestSubmit(); await wait(() => requests.length === 1 && !form.querySelector('[type=submit]').disabled);
    assert(select.value === '' && form.querySelector('[name=name]').value === 'MOCK ONLY', 'failure keeps input');
    sample.click(); assert(select.value === '', 'failure keeps manual choice');
    assert(count('generate_lead') === 0 && count('quote_form_submit') === 0, 'failure never means success');
    succeeds = true;
    form.requestSubmit(); await wait(() => count('submit_product_inquiry') === 1);
    assert(requests.every(r => r.inquiry_type === '' && r.product_code === 'TZ4549-6' && r.message.includes('MOCK ONLY')), 'empty intent and product context preserved');
    assert(select.value === '' && form.querySelector('[name=name]').value === '', 'success resets neutral and fields');
    assert(count('generate_lead') === 1 && count('quote_form_submit') === 1, 'success events exactly once');
    sample.click(); assert(select.value === 'Sample', 'success clears manual marker');
    quote.click(); assert(select.value === '', 'quote neutral after success');
    assert(document.documentElement.scrollWidth <= innerWidth, 'no overflow');
    return { url: location.href, language: document.documentElement.lang, width: innerWidth, mockOnly: true, emptySubmissions: requests.length, successEvents: { generate_lead: count('generate_lead'), quote_form_submit: count('quote_form_submit') }, manualChoices: 5, resetNeutral: true, failurePreserved: true };
  } finally { window.fetch = originalFetch; window.gtag = originalGtag; }
}
