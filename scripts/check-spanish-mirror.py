"""Validate built Spanish mirror pages before deployment."""

import json
from pathlib import Path
from urllib.parse import urlsplit

from bs4 import BeautifulSoup


ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
manifest = json.loads((ROOT / "src/data/spanishMirrorPaths.json").read_text(encoding="utf-8"))
errors = []
sitemap = (DIST / "sitemap-0.xml").read_text(encoding="utf-8")
valid_pages = {"/" + path.parent.relative_to(DIST).as_posix().strip("/") + "/" for path in DIST.glob("**/index.html")}

for english in manifest:
    spanish = "/es" + english
    page = DIST / spanish.strip("/") / "index.html"
    source = DIST / english.strip("/") / "index.html"
    if not page.is_file() or not source.is_file():
        errors.append(f"{spanish}: source or translated page missing")
        continue
    doc = BeautifulSoup(page.read_text(encoding="utf-8"), "html.parser")
    original = BeautifulSoup(source.read_text(encoding="utf-8"), "html.parser")
    if doc.html.get("lang") != "es":
        errors.append(f"{spanish}: lang is not es")
    canonical = doc.find("link", rel="canonical")
    if canonical is None or canonical.get("href") != "https://www.fitcloo.com" + spanish:
        errors.append(f"{spanish}: canonical mismatch")
    alternates = {link.get("hreflang"): link.get("href") for link in doc.select("link[hreflang]")}
    if alternates.get("en") != "https://www.fitcloo.com" + english:
        errors.append(f"{spanish}: English alternate mismatch")
    if alternates.get("es") != "https://www.fitcloo.com" + spanish:
        errors.append(f"{spanish}: Spanish alternate mismatch")
    for selector in ("h1", "h2", "img", "table", "form"):
        if len(doc.select(selector)) != len(original.select(selector)):
            errors.append(f"{spanish}: {selector} count changed")
    if "https://www.fitcloo.com" + spanish not in sitemap:
        errors.append(f"{spanish}: missing from sitemap")
    for link in doc.select('a[href^="/es/"]'):
        path = urlsplit(link.get("href", "")).path
        normalized = path if path.endswith("/") else path + "/"
        if path and normalized not in valid_pages:
            errors.append(f"{spanish}: broken link {path}")

report = {"pages": len(manifest), "errors": len(errors), "examples": list(dict.fromkeys(errors))[:50]}
print(json.dumps(report, ensure_ascii=False, indent=2))
raise SystemExit(bool(errors))
