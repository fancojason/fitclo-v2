async function checkReadyStockSticky() {
  const root = document.querySelector('[data-ready-enhanced]');
  const toolbar = root.querySelector('.ready-toolbar');
  const toggle = root.querySelector('[data-ready-filters-toggle]');
  const search = root.querySelector('[data-ready-search]');
  const grid = root.querySelector('[data-ready-grid]');
  const header = document.querySelector('header');
  const results = [];
  const verify = (name, pass, measurements = {}) => {
    results.push({name,pass,...measurements});
    if (!pass) throw new Error(name + ': ' + JSON.stringify(measurements));
  };
  const wait = () => new Promise(resolve => setTimeout(resolve, 100));
  const scroll = async top => { window.scrollTo({top,behavior:'instant'}); await wait(); };
  root.querySelector('[data-ready-clear]').click();
  if (root.classList.contains('filters-open')) toggle.click();
  await scroll(0);
  verify('Toolbar starts in document flow', toolbar.getBoundingClientRect().top > header.getBoundingClientRect().bottom);
  const origin = toolbar.getBoundingClientRect().top + scrollY;
  await scroll(origin + 1600);
  verify('Sticky below actual header', Math.abs(toolbar.getBoundingClientRect().top - header.getBoundingClientRect().bottom) < 2, {toolbarTop:toolbar.getBoundingClientRect().top,headerBottom:header.getBoundingClientRect().bottom});
  if (innerWidth < 768) {
    verify('Mobile collapsed bar stays compact', toolbar.offsetHeight < 90 && getComputedStyle(root.querySelector('.ready-filter-panel')).display === 'none', {height:toolbar.offsetHeight});
    toggle.click();
    verify('Mobile options expand with correct ARIA', toggle.getAttribute('aria-expanded') === 'true' && getComputedStyle(root.querySelector('.ready-filter-panel')).display === 'grid');
    toolbar.dispatchEvent(new KeyboardEvent('keydown', {key:'Escape',bubbles:true}));
    verify('Escape closes options and restores toggle focus', toggle.getAttribute('aria-expanded') === 'false' && document.activeElement === toggle);
  }
  search.value = 'BX6147'; search.dispatchEvent(new Event('input', {bubbles:true})); await wait();
  const resultTop = grid.getBoundingClientRect().top;
  verify('Deep search returns visible first result', Number(root.querySelector('[data-ready-count]').textContent) === 1 && resultTop >= header.getBoundingClientRect().bottom + toolbar.offsetHeight - 2 && resultTop < innerHeight, {resultTop,toolbarHeight:toolbar.offsetHeight,scrollY});
  if (innerWidth < 768) {
    toggle.click(); await wait();
    verify('Opening mobile filters does not obscure first result', grid.getBoundingClientRect().top >= toolbar.getBoundingClientRect().bottom - 2, {resultTop:grid.getBoundingClientRect().top,toolbarBottom:toolbar.getBoundingClientRect().bottom});
    toggle.click(); await wait();
  }
  search.value = 'NO-MATCH-FITCLO-QA'; search.dispatchEvent(new Event('input', {bubbles:true})); await wait();
  const empty = root.querySelector('[data-ready-empty]');
  verify('No-results message is visible after deep filtering', getComputedStyle(empty).display !== 'none' && empty.getBoundingClientRect().top >= header.getBoundingClientRect().bottom - 2 && empty.getBoundingClientRect().top < innerHeight, {emptyTop:empty.getBoundingClientRect().top});
  empty.querySelector('[data-ready-clear]').click(); await wait();
  verify('Clear restores 249 actual products', Number(root.querySelector('[data-ready-count]').textContent) === root.querySelectorAll('[data-ready-card]').length);
  await scroll(root.getBoundingClientRect().bottom + scrollY + 300);
  verify('Toolbar leaves viewport after catalog ends', toolbar.getBoundingClientRect().bottom <= header.getBoundingClientRect().bottom, {toolbarBottom:toolbar.getBoundingClientRect().bottom});
  verify('No horizontal overflow', document.documentElement.scrollWidth <= innerWidth);
  await scroll(0);
  const h1 = document.querySelector('h1');
  verify('Only intended H1 uses lighter sizing', getComputedStyle(h1).fontWeight === '600' && h1.textContent === 'A practical ready-stock catalog for your next activewear drop.', {fontSize:getComputedStyle(h1).fontSize,lineHeight:getComputedStyle(h1).lineHeight});
  return {url:location.href,width:innerWidth,results};
}
