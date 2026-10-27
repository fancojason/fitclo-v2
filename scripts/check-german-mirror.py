"""Check German drafts against their English sources before publication."""

from pathlib import Path
import json
import re

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
PATHS = json.loads((ROOT / "src/data/germanMirrorPaths.json").read_text(encoding="utf-8"))
SITE = "https://www.fitcloo.com"
STRUCTURE = ("h1", "h2", "h3", "table", "tr", "img", "form")


def inspect(path):
    source = ROOT / "dist" / path.strip("/") / "index.html"
    draft = ROOT / ".german-drafts/pages" / path.strip("/") / "index.html"
    errors = []
    if not draft.exists():
        return path, ["missing German draft"]
    en = BeautifulSoup(source.read_text(encoding="utf-8"), "html.parser")
    de = BeautifulSoup(draft.read_text(encoding="utf-8"), "html.parser")
    target = f"/de{path}"
    if de.html.get("lang") != "de":
        errors.append("wrong html lang")
    canonical = de.find("link", rel="canonical")
    if not canonical or canonical.get("href") != SITE + target:
        errors.append("wrong canonical")
    if "noindex" in (de.find("meta", attrs={"name": "robots"}) or {}).get("content", ""):
        errors.append("noindex")
    for selector in STRUCTURE:
        if len(en.select(selector)) != len(de.select(selector)):
            errors.append(f"changed {selector} count")
    if sorted(img.get("src", "") for img in en.select("img")) != sorted(img.get("src", "") for img in de.select("img")):
        errors.append("changed images")
    if "Passt clo" in de.get_text(" ", strip=True) or "PASST CLO" in de.get_text(" ", strip=True):
        errors.append("translated FITCLO brand")
    if not de.find("link", href="/css/german-mirror.css"):
        errors.append("missing German mobile wrapping")
    for form in de.select("form#inquiry-form"):
        if form.get("data-language") != "de" or form.get("data-page-path") != target or form.get("data-sending", "").startswith("SENDING"):
            errors.append("English inquiry form state")
        if any(option.get("value", "").startswith("20-49") for option in form.select('select[name="quantity"] option')):
            errors.append("German form advertises under-50 order")
    if path.startswith("/products/"):
        if re.search(r"\b\d+\s+Sätz", de.get_text(" ", strip=True)):
            errors.append("quantity mistranslated as sentences")
        important = lambda doc: set(re.findall(
            r"\b[A-Z]{1,6}\d{3,}(?:-\d+)?\b|\b\d+\s*%",
            (doc.main or doc.body).get_text(" ", strip=True), re.I,
        ))
        if important(en) - important(de):
            errors.append("missing product code or fabric percentage")
        for english_row, german_row in zip(en.select("table tr"), de.select("table tr")):
            english_cells, german_cells = english_row.select("th,td"), german_row.select("th,td")
            for index in range(0, min(len(english_cells), len(german_cells)) - 1, 2):
                if english_cells[index].get_text(" ", strip=True) in {"Fabric", "Main Fabric", "Outer Layer", "Material", "Colors", "Colors Shown"} and english_cells[index + 1].get_text(" ", strip=True) != german_cells[index + 1].get_text(" ", strip=True):
                    errors.append("changed original fabric or supplier color name")
                    break
    if not de.find("link", hreflang="de", href=SITE + target):
        errors.append("missing German hreflang")
    if not de.find("link", hreflang="en", href=SITE + path):
        errors.append("missing English hreflang")
    for link in de.select('a[href^="/de/"]'):
        route = link["href"].split("#")[0].split("?")[0]
        if not (ROOT / ".german-drafts/pages" / route.removeprefix("/de/") / "index.html").exists() and not (ROOT / "dist" / route.strip("/") / "index.html").exists():
            errors.append(f"broken German link {route}")
            break
    return path, errors


results = [inspect(path) for path in PATHS]
failures = [(path, errors) for path, errors in results if errors]
print(json.dumps({"pages": len(results), "failed": len(failures), "examples": failures[:20]}, ensure_ascii=False, indent=2))
raise SystemExit(bool(failures))
