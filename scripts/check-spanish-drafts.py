"""Audit review-only Spanish HTML drafts against the built English originals."""

from collections import Counter
from pathlib import Path
import json
import re

from bs4 import BeautifulSoup


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "dist"
DRAFTS = ROOT / ".spanish-drafts"
STRUCTURE = ("h1", "h2", "h3", "table", "tr", "img", "form", "script", "link[rel=stylesheet]")


def inspect(draft):
    page = draft.relative_to(DRAFTS).parent
    source = SOURCE / page / "index.html"
    if not source.exists():
        return {"page": str(page), "errors": ["English source is missing"]}
    english = BeautifulSoup(source.read_text(encoding="utf-8"), "html.parser")
    spanish = BeautifulSoup(draft.read_text(encoding="utf-8"), "html.parser")
    errors = []
    warnings = []
    if spanish.html.get("lang") != "es":
        errors.append("html lang is not es")
    canonical = spanish.find("link", rel="canonical")
    expected = f"https://www.fitcloo.com/es/{page.as_posix()}/"
    if canonical is None or canonical.get("href") != expected:
        errors.append("canonical does not match Spanish URL")
    for tag in STRUCTURE:
        if len(english.select(tag)) != len(spanish.select(tag)):
            errors.append(f"{tag} count differs")
    image_sources = lambda doc: sorted(image.get("src", "") for image in doc.select("img"))
    if image_sources(english) != image_sources(spanish):
        errors.append("image sources differ")
    body = lambda doc: doc.main or doc.body
    english_numbers = Counter(re.findall(r"\d+", body(english).get_text(" ", strip=True)))
    spanish_numbers = Counter(re.findall(r"\d+", body(spanish).get_text(" ", strip=True)))
    if english_numbers - spanish_numbers:
        errors.append(f"numbers lost: {dict(english_numbers - spanish_numbers)}")
    if spanish_numbers - english_numbers:
        warnings.append(f"new numeric tokens: {dict(spanish_numbers - english_numbers)}")
    if any("https://www.fitcloo.com/" in script.get_text() for script in spanish.select('script[type="application/ld+json"]')):
        warnings.append("structured data still contains English URLs")
    return {"page": str(page).replace("\\", "/"), "errors": errors, "warnings": warnings}


results = [inspect(path) for path in sorted(DRAFTS.glob("**/index.html"))]
summary = {
    "drafts": len(results),
    "with_errors": sum(bool(result["errors"]) for result in results),
    "with_warnings": sum(bool(result["warnings"]) for result in results),
    "issues": [result for result in results if result["errors"] or result["warnings"]],
}
print(json.dumps(summary, ensure_ascii=False, indent=2))
