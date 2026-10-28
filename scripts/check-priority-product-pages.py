"""Audit the three approved product URLs; optionally compare protected build content."""

import argparse
import json
import re
from pathlib import Path
from urllib.parse import unquote, urlsplit
from xml.etree import ElementTree

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
SITE = "https://www.fitcloo.com"
PATHS = ["/products/matching-sets/", "/products/capri-workout-set/", "/products/sports-bras/"]


def document(path):
    return BeautifulSoup((DIST / path.strip("/") / "index.html").read_text(encoding="utf-8"), "html.parser")


def local_target(url):
    parsed = urlsplit(url)
    if parsed.netloc and parsed.netloc != "www.fitcloo.com":
        return None
    if parsed.scheme and parsed.scheme not in {"https", "http"}:
        return None
    path = unquote(parsed.path)
    if not path.startswith("/"):
        return None
    target = DIST / path.lstrip("/")
    return target / "index.html" if not target.suffix else target


def audit():
    locations = {e.text for e in ElementTree.parse(DIST / "sitemap-0.xml").iter() if e.tag.endswith("}loc")}
    snapshot = {}
    for path in PATHS:
        soup = document(path)
        assert soup.html.get("lang") == "en", path
        assert len(soup.select("h1")) == 1, path
        assert soup.select_one('link[rel="canonical"]')["href"] == SITE + path, path
        assert "noindex" not in soup.select_one('meta[name="robots"]')["content"], path
        assert SITE + path in locations, path
        for resource in soup.select('script[src^="/_astro/"], link[href^="/_astro/"]'):
            url = resource.get("src", resource.get("href"))
            assert local_target(url).exists(), (path, "missing build resource", url)
        schemas = [json.loads(tag.string) for tag in soup.select('script[type="application/ld+json"]')]
        nodes = [node for item in schemas for node in (item.get("@graph", [item]) if isinstance(item, dict) else item)]
        crumbs = [node for node in nodes if node.get("@type") == "BreadcrumbList"]
        assert len(crumbs) == 1, (path, "breadcrumb count")
        for item in crumbs[0]["itemListElement"]:
            assert local_target(item["item"]).exists(), (path, item)
        main = soup.find("main")
        for link in main.select('a[href^="#"]'):
            assert soup.find(id=link["href"][1:]), (path, link["href"])
        for tag in main.select("a[href], img[src]"):
            url = tag.get("href", tag.get("src"))
            target = local_target(url)
            if target:
                assert target.exists(), (path, url)
            if tag.name == "img":
                assert tag.has_attr("alt"), (path, "missing alt")
        for alternate in soup.select("link[hreflang]"):
            target = local_target(alternate["href"])
            assert target.exists(), (path, alternate)
            if alternate["hreflang"] != "x-default":
                translated = BeautifulSoup(target.read_text(encoding="utf-8"), "html.parser")
                assert translated.find("link", hreflang="en", href=SITE + path), (path, "hreflang reciprocity")
        text = re.sub(r"\s+", " ", main.get_text(" ", strip=True))
        for schema in nodes:
            if schema.get("@type") == "FAQPage":
                for question in schema["mainEntity"]:
                    assert question["name"] in text, (path, "invisible FAQ question")
                    assert re.sub(r"\s+", " ", question["acceptedAnswer"]["text"]) in text, (path, "invisible FAQ answer")
        snapshot[path] = {
            "title": soup.title.get_text(),
            "description": soup.select_one('meta[name="description"]')["content"],
            "h1": soup.h1.get_text(" ", strip=True),
            "main_text": text,
            "schemas": schemas,
            "images": [dict(image.attrs) for image in main.select("img")],
            "links": [link["href"] for link in soup.select("a[href]")],
            "alternates": [dict(link.attrs) for link in soup.select("link[hreflang]")],
        }
        print(f"PASS {path}: metadata, schema/FAQ, links, images, sitemap and hreflang")
    for prefix in ("es", "de"):
        for path in PATHS:
            translated = document(f"/{prefix}{path}")
            missing = [url for tag in translated.select('script[src^="/_astro/"], link[href^="/_astro/"]')
                       if not local_target(url := tag.get("src", tag.get("href"))).exists()]
            if missing:
                print(f"WARNING /{prefix}{path}: existing missing static resources: {missing}")
    return snapshot


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--snapshot", type=Path)
    parser.add_argument("--compare", type=Path)
    args = parser.parse_args()
    result = audit()
    if args.compare:
        baseline = json.loads(args.compare.read_text(encoding="utf-8"))
        assert result == baseline, "Protected visible copy, metadata, schema, images or links changed"
        print("PASS protected content equals the pre-change build")
    if args.snapshot:
        args.snapshot.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
