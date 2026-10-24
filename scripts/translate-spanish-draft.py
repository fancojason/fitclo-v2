"""Create a review-only Spanish HTML draft from a built English page.

Usage: python scripts/translate-spanish-draft.py blogs/example-slug
The output is intentionally outside public/ so an unreviewed translation cannot deploy.
"""

import argparse
import json
import re
import time
from pathlib import Path
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup, NavigableString


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "dist"
OUTPUT = ROOT / ".spanish-drafts"
CACHE = OUTPUT / "translation-cache.json"
SEPARATOR = "<<<FITCLO_TRANSLATION_BREAK>>>"
SKIP_PARENTS = {"script", "style", "noscript", "svg", "code", "pre"}
GLOSSARY = {
    "Activewear": "Ropa deportiva",
    "activewear": "ropa deportiva",
    "ROPA ACTIVA": "ROPA DEPORTIVA",
    "Ropa activa": "Ropa deportiva",
    "ropa activa": "ropa deportiva",
    "ETIQUETA PRIVADA": "MARCA PRIVADA",
    "Etiqueta privada": "Marca privada",
    "etiqueta privada": "marca privada",
    "vellón cepillado": "felpa perchada",
    "tela polar cepillada": "felpa perchada",
    "producción a granel": "producción en serie",
    "antes del bulto": "antes de la producción en serie",
    "muestra versus a granel": "muestra frente a producción en serie",
    "tramo de 4 vías": "elasticidad en 4 direcciones",
    "estiramiento en 4 direcciones": "elasticidad en 4 direcciones",
    "shorts moteros": "shorts ciclistas",
    "pantalones cortos de motociclista": "shorts ciclistas",
    "mameluco": "mono",
    "Mameluco": "Mono",
    "cuello simulado": "cuello alto",
    "pantalones sin mangas en capas": "top sin mangas en capas y pantalones",
    "pantalones sin mangas y pantalones acampanados": "top sin mangas y pantalones acampanados",
}


def translate(texts, cache):
    missing = [text for text in texts if text not in cache]
    answer = []
    batch = []
    protected = []
    number_maps = []
    for text in missing:
        number_map = {}
        def save_number(match):
            token = f"__FITCLO_NUM_{len(number_map)}__"
            number_map[token] = match.group(0)
            return token
        protected.append(re.sub(r"(?<!\w)\d+(?:[.,\u2013-]\d+)*(?!\w)", save_number, text))
        number_maps.append(number_map)

    def flush():
        if not batch:
            return
        query = f"\n{SEPARATOR}\n".join(batch)
        for attempt in range(3):
            try:
                response = requests.get(
                    "https://translate.googleapis.com/translate_a/single",
                    params={"client": "gtx", "sl": "en", "tl": "es", "dt": "t", "q": query},
                    timeout=45,
                )
                response.raise_for_status()
                translated = "".join(part[0] for part in response.json()[0]).split(SEPARATOR)
                if len(translated) != len(batch):
                    raise ValueError("Translation segment count changed")
                answer.extend(part.strip() for part in translated)
                batch.clear()
                return
            except (requests.RequestException, ValueError):
                if attempt == 2:
                    raise
                time.sleep(2 ** attempt)

    for text in protected:
        if sum(map(len, batch)) + len(text) + len(SEPARATOR) * len(batch) > 2600:
            flush()
        batch.append(text)
    flush()
    restored = []
    for value, number_map in zip(answer, number_maps, strict=True):
        for token, number in number_map.items():
            if token not in value:
                raise ValueError(f"Translation changed protected number token: {token}")
            value = value.replace(token, number)
        restored.append(value)
    cache.update(zip(missing, restored, strict=True))
    return {text: cache[text] for text in texts}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("page", help="English path relative to dist, without index.html")
    args = parser.parse_args()
    page = args.page.strip("/")
    source = SOURCE / page / "index.html"
    if not source.is_file():
        parser.error(f"Built page not found: {source}")
    soup = BeautifulSoup(source.read_text(encoding="utf-8"), "html.parser")
    nodes = [node for node in soup.find_all(string=True)
             if isinstance(node, NavigableString)
             and node.strip()
             and not any(parent.name in SKIP_PARENTS for parent in node.parents)]
    attributes = [(tag, attr) for tag in soup.find_all(True)
                  for attr in ("alt", "aria-label", "placeholder", "title", "content")
                  if tag.has_attr(attr)
                  and (attr != "content" or tag.name == "meta" and (
                      tag.get("name") == "description"
                      or tag.get("property") in {"og:title", "og:description", "twitter:title", "twitter:description"}
                  ))
                  and isinstance(tag[attr], str) and tag[attr].strip()]
    candidates = [str(node).strip() for node in nodes] + [tag[attr].strip() for tag, attr in attributes]
    unique = list(dict.fromkeys(candidates))
    OUTPUT.mkdir(parents=True, exist_ok=True)
    cache = json.loads(CACHE.read_text(encoding="utf-8")) if CACHE.exists() else {}
    translations = translate(unique, cache)
    CACHE.write_text(json.dumps(cache, ensure_ascii=False), encoding="utf-8")
    for key in translations:
        for english, spanish in GLOSSARY.items():
            translations[key] = translations[key].replace(english, spanish)
    for node in nodes:
        original = str(node)
        node.replace_with(re.sub(r"\S(?:.*\S)?", lambda _: translations[original.strip()], original, count=1, flags=re.S))
    for tag, attr in attributes:
        tag[attr] = translations[tag[attr].strip()]

    target_path = f"/es/{page}/"
    canonical = f"https://www.fitcloo.com{target_path}"
    source_url = f"https://www.fitcloo.com/{page}/"
    soup.html["lang"] = "es"
    if soup.title:
        soup.title.string = translations.get(soup.title.get_text(strip=True), soup.title.get_text(strip=True))
    for link in soup.find_all("link", rel="canonical"):
        link["href"] = canonical
    for tag in soup.find_all("meta"):
        if tag.get("property") == "og:url":
            tag["content"] = canonical
        if tag.get("property") == "og:locale":
            tag["content"] = "es_ES"
    schema_text_keys = {"name", "headline", "description", "text", "articleBody", "alternativeHeadline"}
    def localize_schema(value, key=""):
        if isinstance(value, dict):
            return {name: localize_schema(item, name) for name, item in value.items()}
        if isinstance(value, list):
            return [localize_schema(item, key) for item in value]
        if isinstance(value, str):
            if key == "inLanguage" and value.startswith("en"):
                return "es"
            if value.startswith(source_url):
                return value.replace(source_url, canonical, 1)
            if key in schema_text_keys:
                return translations.get(value, value)
        return value
    for script in soup.select('script[type="application/ld+json"]'):
        try:
            script.string = json.dumps(localize_schema(json.loads(script.string or "")), ensure_ascii=False)
        except json.JSONDecodeError:
            continue
    for link in soup.find_all("link", hreflang=True):
        link.decompose()
    for link in soup.find_all("a", href=True):
        href = link["href"]
        parsed = urlparse(href)
        if href.startswith("/") and not href.startswith("//") and not href.startswith("/es/"):
            candidate = SOURCE / "es" / parsed.path.strip("/") / "index.html"
            if candidate.is_file() or (OUTPUT / parsed.path.strip("/") / "index.html").is_file():
                link["href"] = "/es" + href
    destination = OUTPUT / page / "index.html"
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(str(soup), encoding="utf-8")
    (destination.parent / "translation-audit.json").write_text(json.dumps({
        "source": f"/{page}/", "target": target_path, "unique_strings": len(unique),
        "source_characters": sum(map(len, unique)),
    }, indent=2), encoding="utf-8")
    print(f"Draft: {destination}; {len(unique)} unique strings")


if __name__ == "__main__":
    main()
