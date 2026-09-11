import fs from 'node:fs';
import assert from 'node:assert/strict';
for (const page of ['dist/index.html','dist/es/index.html']) {
 const html=fs.readFileSync(page,'utf8');
 const videos=[...html.matchAll(/<video\b[^>]*data-lazy-factory[^>]*>[\s\S]*?<\/video>/g)].map(m=>m[0]);
 assert.equal(videos.length,5,page);
 for(const video of videos){
  assert.match(video,/<source\b[^>]*data-src="\/videos\//);
  assert.doesNotMatch(video,/<source\b[^>]*\ssrc=/);
 }
 assert.ok(html.includes('srcset='));
}
console.log('Home media markup checks passed');
