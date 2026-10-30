// Run in the real Ready to Ship preview DOM after the page's module scripts load.
async function checkReadyStock() {
  const root = document.querySelector('[data-ready-enhanced]');
  const cards = [...root.querySelectorAll('[data-ready-card]')];
  const search = root.querySelector('[data-ready-search]');
  const category = root.querySelector('[data-ready-category]');
  const clear = root.querySelector('[data-ready-clear]');
  const compact = root.querySelector('[data-ready-compact]');
  const results = [];
  const normalize = s => s.trim().toLowerCase().replace(/\s+/g, ' ');
  const verify = (name, pass, extra = {}) => {
    results.push({ name, pass, ...extra });
    if (!pass) throw new Error(name);
  };
  const check = name => {
    const expected = cards.filter(c => (category.value === 'all' || c.dataset.category === category.value) && normalize(c.dataset.search).includes(normalize(search.value)));
    const actual = cards.filter(c => getComputedStyle(c).display !== 'none');
    verify(name, expected.length === actual.length && expected.every((c,i) => c === actual[i]) && Number(root.querySelector('[data-ready-count]').textContent) === actual.length, { count: actual.length });
  };
  const input = value => { search.value = value; search.dispatchEvent(new Event('input', { bubbles:true })); };
  clear.click();
  if (compact.getAttribute('aria-pressed') === 'true') compact.click();
  for (const q of ['24321+24322', '24321', '  bX6147  ', 'leggings']) { input(q); check('Search: ' + q); }
  clear.click(); category.value = 'matching-sets'; category.dispatchEvent(new Event('change', { bubbles:true })); check('Matching Sets dropdown');
  input('leggings'); check('Keyword AND category');
  const sample = cards.find(c => !c.hidden);
  const detailedHeight = sample.getBoundingClientRect().height;
  compact.click(); check('Mode retains filters');
  verify('Compact hides details and shortens card', [...sample.querySelectorAll('[data-ready-detail]')].every(e => getComputedStyle(e).display === 'none') && sample.getBoundingClientRect().height < detailedHeight);
  clear.click(); check('Clear restores full original order');
  verify('Clear retains mode', compact.getAttribute('aria-pressed') === 'true');
  compact.click(); verify('Detailed content restored', getComputedStyle(sample.querySelector('[data-ready-detail]')).display !== 'none');
  for (const b of root.querySelectorAll('[data-ready-quick]')) {
    b.click(); check('Quick category: ' + b.dataset.readyQuick);
    verify('Quick category sync: ' + b.dataset.readyQuick, category.value === b.dataset.readyQuick && b.getAttribute('aria-pressed') === 'true');
  }
  input('FITCLO-NONEXISTENT-QA'); check('No matches');
  verify('Empty state visible', getComputedStyle(root.querySelector('[data-ready-empty]')).display !== 'none');
  root.querySelector('[data-ready-empty] [data-ready-clear]').click(); check('Empty state clear action');
  verify('No MOQ control', !root.querySelector('[data-ready-moq]'));
  verify('Product-specific WhatsApp links retained', cards.every(c => {
    const a = c.querySelector('a[href*="api.whatsapp.com"]');
    const message = new URL(a.href).searchParams.get('text');
    return message.includes(c.dataset.waProductCode) && message.includes(c.dataset.waProductName);
  }));
  const urls = [...new Set(cards.flatMap(c => [...c.querySelectorAll('h3 a')].map(a => a.getAttribute('href'))))];
  const statuses = await Promise.all(urls.map(async url => ({url,status:(await fetch(url)).status})));
  verify('Existing detail destinations accessible', statuses.every(x => x.status === 200), { destinations: statuses.length });
  verify('No horizontal viewport overflow', document.documentElement.scrollWidth <= innerWidth);
  return { url:location.href, viewport:innerWidth, total:cards.length, results };
}
