import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const origin = 'https://www.fitcloo.com';
const keyLocation = `${origin}/indexnow-key.txt`;
const [oldDir, newDir] = process.argv.slice(2);
if (!oldDir || !newDir) throw new Error('Usage: node submit-indexnow.mjs OLD_DIST NEW_DIST');
const key = process.env.INDEXNOW_KEY;
const keyValid = typeof key === 'string' && /^[A-Za-z0-9-]{8,128}$/.test(key);

const urls = async (dir) => {
  const xml = await readFile(join(dir, 'sitemap-0.xml'), 'utf8');
  return new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].replaceAll('&amp;', '&')));
};
const htmlPath = (dir, url) => join(dir, new URL(url).pathname.slice(1), 'index.html');
const meaningful = (html) => {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? '';
  return main.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/\s+/g, ' ').trim();
};
const current = await urls(newDir);
const previous = await urls(oldDir);
const changes = [];
for (const url of new Set([...current, ...previous])) {
  if (!url.startsWith(`${origin}/`) && url !== `${origin}/`) throw new Error('Non-canonical sitemap host');
  if (!current.has(url)) { changes.push({ url, kind: 'removed' }); continue; }
  const html = await readFile(htmlPath(newDir, url), 'utf8');
  if (!html.includes(`rel="canonical" href="${url}"`) || /<meta\s+name="robots"\s+content="[^"]*noindex/i.test(html)) {
    throw new Error(`Non-indexable sitemap entry: ${url}`);
  }
  if (!previous.has(url)) { changes.push({ url, kind: 'added' }); continue; }
  const oldHtml = await readFile(htmlPath(oldDir, url), 'utf8');
  if (meaningful(html) !== meaningful(oldHtml)) changes.push({ url, kind: 'updated' });
}
console.log(`IndexNow candidates: ${changes.length} (${changes.filter(x => x.kind === 'added').length} added, ${changes.filter(x => x.kind === 'updated').length} updated, ${changes.filter(x => x.kind === 'removed').length} removed).`);
if (changes.length > 50) throw new Error('More than 50 changed pages; review manually before notification.');
if (!changes.length) process.exit(0);
if (!keyValid) { console.log('INDEXNOW_KEY not configured; notification skipped.'); process.exit(0); }
const keyResponse = await fetch(keyLocation, { redirect: 'error' });
if (!keyResponse.ok || (await keyResponse.text()).trim() !== key) throw new Error(`Live IndexNow key verification failed: HTTP ${keyResponse.status}`);
for (const {url, kind} of changes) {
  const response = await fetch(url, { method: 'GET', redirect: 'manual' });
  if (kind === 'removed' ? ![404,410].includes(response.status) : response.status !== 200) {
    throw new Error(`Live URL state differs from build: ${url} HTTP ${response.status}`);
  }
  if (kind !== 'removed') {
    const built = await readFile(htmlPath(newDir, url), 'utf8');
    if (meaningful(await response.text()) !== meaningful(built)) {
      throw new Error(`Production content does not match this build: ${url}`);
    }
  }
}
const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: 'www.fitcloo.com', key, keyLocation, urlList: changes.map(x => x.url) }),
});
console.log(`IndexNow response: HTTP ${response.status}; URLs: ${changes.map(x => `${x.kind} ${x.url}`).join(', ')}`);
if (![200, 202].includes(response.status)) throw new Error('IndexNow notification was not accepted.');

