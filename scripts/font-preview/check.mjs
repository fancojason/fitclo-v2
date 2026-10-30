import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const base='http://127.0.0.1:4331';
const paths=['/','/products/','/products/matching-sets/','/products/3366/','/oem-activewear-manufacturer/','/blogs/','/blogs/activewear-quality-inspection-checklist/','/activewear-intelligence/','/guides/moq/','/inquiry/','/es/','/de/','/nl/','/pt-br/','/de/about/'];
for(const path of paths){
  const response=await fetch(base+path);
  assert.equal(response.status,200,path);
  assert.equal(response.headers.get('x-robots-tag'),'noindex, nofollow',path);
  const html=await response.text();
  assert.ok(/<h1\b/i.test(html),path+' has a heading');
  assert.equal((html.match(/src="\/__font-review.js"/g)||[]).length,0,path+' has no rejected DM comparison control');
}
for(const file of ['poppins-400-latin.woff2','poppins-500-latin.woff2','poppins-600-latin.woff2','poppins-700-latin.woff2']){
  const response=await fetch(base+'/fonts/'+file);
  assert.equal(response.status,200,file);
  assert.equal(response.headers.get('content-type'),'font/woff2');
}
const built=await readFile(new URL('../../dist/index.html',import.meta.url),'utf8');
assert.ok(!built.includes('__font-review.js'),'review controls are absent from normal build output');
const source=await readFile(new URL('../../src/layouts/BaseLayout.astro',import.meta.url),'utf8');
assert.ok(!source.includes('__font-review'),'review controls are absent from production layout');
const css=await readFile(new URL('../../public/css/fitclo-typography.css',import.meta.url),'utf8');
assert.equal(await readFile(new URL('../../dist/css/fitclo-typography.css',import.meta.url),'utf8'),css,'built typography asset matches source');
assert.ok(!css.includes('DM Sans'),'current preview is Poppins only');
const genericH2=css.match(/(?:^|\n)main h2\s*\{([^}]+)\}/)?.[1]||'';
assert.ok(!genericH2.includes('font-size'),'generic H2 must not override card title sizes');
assert.equal((css.match(/font-size\s*:/g)||[]).length,2,'only navigation and its quote CTA may override font size');
const audit=JSON.parse(await readFile(new URL('../../docs/typography-original-size-comparison.json',import.meta.url),'utf8'));
assert.equal(audit.checks.length,55);
for(const check of audit.checks){
  assert.equal(check.newOverflow,false,check.path+' '+check.width);
  assert.deepEqual(check.sizeChangesOutsideNav,[],check.path+' preserves original font sizes');
  assert.deepEqual(check.newFontIssues,[],check.path+' has no additional font-induced containment issues');
}
console.log('PASS: 15 HTTP routes, 4 Poppins resources, local noindex, and 55 original-size comparisons; only navigation and its quote CTA have font-size overrides.');
