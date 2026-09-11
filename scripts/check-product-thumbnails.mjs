import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { parse } from 'parse5';
const attrs = n => Object.fromEntries((n.attrs || []).map(a => [a.name, a.value]));
const walk = n => [n, ...(n.childNodes || []).flatMap(walk)];
let galleries = 0, thumbnails = 0;
function check(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) check(file);
    else if (entry.name.endsWith('.html')) {
      const nodes = walk(parse(fs.readFileSync(file, 'utf8')));
      const buttons = nodes.filter(n => n.tagName === 'button' && Object.keys(attrs(n)).some(k => k.startsWith('data-gallery-thumb')));
      if (!buttons.length) continue;
      galleries++;
      buttons.slice(1).forEach(button => {
        const a = attrs(walk(button).find(n => n.tagName === 'img'));
        assert.ok(a.srcset?.includes('/images/products/thumbnails/'), file);
        assert.ok(a.srcset.includes(a.src), 'Keep original for high-density screens');
        for (const candidate of a.srcset.split(', ')) assert.ok(fs.existsSync(path.join('public', candidate.split(' ')[0])), candidate);
        if (attrs(button)['data-src']) assert.equal(attrs(button)['data-src'], a.src, 'Gallery click retains original');
        thumbnails++;
      });
    }
  }
}
check('dist');
assert.ok(galleries > 0);
console.log('PASS ' + galleries + ' galleries, ' + thumbnails + ' responsive thumbnails and original-image targets');
