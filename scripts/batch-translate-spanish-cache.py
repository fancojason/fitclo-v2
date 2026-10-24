"""Fill the review-only translation cache for public English pages."""

from concurrent.futures import ThreadPoolExecutor, as_completed
from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path
import json

from bs4 import BeautifulSoup, NavigableString


ROOT = Path(__file__).resolve().parents[1]
spec = spec_from_file_location("spanish_draft", ROOT / "scripts" / "translate-spanish-draft.py")
translator = module_from_spec(spec)
spec.loader.exec_module(translator)
cache = json.loads(translator.CACHE.read_text(encoding="utf-8")) if translator.CACHE.exists() else {}

pages = []
for path in (ROOT / "dist").glob("**/index.html"):
    relative = path.relative_to(ROOT / "dist")
    if relative.parts and relative.parts[0] in {"es", "de", "nl", "pt-br", "ru", "admin"}:
        continue
    pages.append(path)

texts = set()
for path in pages:
    soup = BeautifulSoup(path.read_text(encoding="utf-8"), "html.parser")
    for node in soup.find_all(string=True):
        if isinstance(node, NavigableString) and node.strip() and not any(
            parent.name in translator.SKIP_PARENTS for parent in node.parents
        ):
            texts.add(str(node).strip())
    for tag in soup.find_all(True):
        for attr in ("alt", "aria-label", "placeholder", "title", "content"):
            if not tag.has_attr(attr) or not isinstance(tag[attr], str) or not tag[attr].strip():
                continue
            if attr == "content" and not (tag.name == "meta" and (
                tag.get("name") == "description"
                or tag.get("property") in {"og:title", "og:description", "twitter:title", "twitter:description"}
            )):
                continue
            texts.add(tag[attr].strip())

missing = sorted(texts - cache.keys())
chunks = []
chunk = []
characters = 0
for value in missing:
    if chunk and characters + len(value) > 2200:
        chunks.append(chunk)
        chunk = []
        characters = 0
    chunk.append(value)
    characters += len(value)
if chunk:
    chunks.append(chunk)
print(f"Pages: {len(pages)}; unique strings: {len(texts)}; missing: {len(missing)}; batches: {len(chunks)}", flush=True)

failures = []
with ThreadPoolExecutor(max_workers=4) as pool:
    futures = {pool.submit(translator.translate, part, {}): part for part in chunks}
    for number, future in enumerate(as_completed(futures), 1):
        try:
            cache.update(future.result())
        except Exception as error:
            failures.append((futures[future], str(error)))
        if number % 25 == 0 or number == len(chunks):
            translator.CACHE.parent.mkdir(parents=True, exist_ok=True)
            translator.CACHE.write_text(json.dumps(cache, ensure_ascii=False), encoding="utf-8")
            print(f"Translated batches: {number}/{len(chunks)}; failures: {len(failures)}", flush=True)

for part, error in failures:
    print(f"Retrying failed batch ({error}): {len(part)} strings", flush=True)
    cache.update(translator.translate(part, {}))
translator.CACHE.write_text(json.dumps(cache, ensure_ascii=False), encoding="utf-8")
print(f"Cache complete: {len(cache)} strings", flush=True)
