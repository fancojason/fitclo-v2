"""Compare current build to a fresh pre-04B baseline; allow only approved placeholder copy."""
import sys,json,re,hashlib,runpy
from pathlib import Path
root=Path('dist');old=json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'));changed=[];missing=[]
for p in root.rglob('*.html'):
 k=p.relative_to(root).as_posix();b=p.read_bytes();h=b.decode();before=old.get(k,{})
 if hashlib.sha256(b).hexdigest()!=before.get('hash'):changed.append(k)
 for u in set(re.findall(r'(?:src|href)="(/_astro/[^"?#]+)',h)):
  if not(root/u.lstrip('/')).exists() and u not in before.get('missing',[]):missing.append([k,u])
assert set(changed)=={'products/capri-workout-set/index.html','es/products/capri-workout-set/index.html','de/products/capri-workout-set/index.html'},changed
assert not missing,missing
module=runpy.run_path('scripts/check-priority-product-pages.py');current=module['audit']();baseline=json.loads(Path(sys.argv[2]).read_text(encoding='utf-8'))
for path,data in current.items():
 if path=='/products/capri-workout-set/':data['main_text']=data['main_text'].replace('Not sure? You can skip this ', '',1)
assert current==baseline,'Protected metadata, images, links, schema or copy changed beyond approved placeholder'
print(json.dumps({'html':len(old),'changed':changed,'newMissing':len(missing),'protectedExceptApprovedPlaceholder':True}))
