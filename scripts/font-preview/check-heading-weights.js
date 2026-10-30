// Real-browser comparison against the previous Poppins preview CSS.
async function checkHeadingWeights(previousCss) {
  await document.fonts.ready;
  const links = [...document.querySelectorAll('link[href*="fitclo-typography.css"]')];
  const nodes = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')];
  const snapshot = () => nodes.map(e => {
    const s = getComputedStyle(e);
    return {size:s.fontSize,weight:Number(s.fontWeight),text:e.textContent.trim().replace(/\s+/g,' ').slice(0,75)};
  });
  const after = snapshot();
  const overflowAfter = document.documentElement.scrollWidth > innerWidth;
  const baseline = document.createElement('style'); baseline.textContent = previousCss;
  links.forEach(link => { link.disabled = true; });
  document.head.append(baseline);
  const before = snapshot();
  const overflowBefore = document.documentElement.scrollWidth > innerWidth;
  baseline.remove(); links.forEach(link => { link.disabled = false; });
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  const sizeChanges = after.flatMap((item,i) => item.size === before[i].size ? [] : [{text:item.text,before:before[i].size,after:item.size}]);
  const heavyAfter = nodes.flatMap((e,i) => {
    const descendants = [e,...e.querySelectorAll('a,span,em,strong,b,i,button')];
    return descendants.some(n => Number(getComputedStyle(n).fontWeight)>600) ? [after[i].text] : [];
  });
  if (sizeChanges.length || heavyAfter.length || (overflowAfter && !overflowBefore)) throw new Error(JSON.stringify({sizeChanges,heavyAfter,overflowAfter,overflowBefore}));
  const h1 = document.querySelector('h1');
  const quote = document.querySelector('header .quote-nav-button');
  const quoteStyle = quote && getComputedStyle(quote);
  return {
    path:location.pathname,width:innerWidth,headingCount:nodes.length,
    changedWeights:after.filter((x,i) => x.weight !== before[i].weight).length,
    sizeChanges,heavyAfter,overflowBefore,overflowAfter,
    sample:after.slice(0,8),
    homeHero:h1 && {size:getComputedStyle(h1).fontSize,weight:getComputedStyle(h1).fontWeight,lineHeight:getComputedStyle(h1).lineHeight},
    quote:quoteStyle && {size:quoteStyle.fontSize,height:quote.offsetHeight,weight:quoteStyle.fontWeight,href:quote.getAttribute('href')}
  };
}
