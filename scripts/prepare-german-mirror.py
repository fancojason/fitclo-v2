"""Translate reviewed English routes into German drafts, then publish after QA.

Usage: python scripts/prepare-german-mirror.py cache|draft|publish
"""

import argparse
import json
import re
from concurrent.futures import ThreadPoolExecutor, as_completed
from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path
from urllib.parse import parse_qs, urlencode, urlsplit, urlunsplit

from bs4 import BeautifulSoup, Comment, NavigableString

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "dist"
STAGING = ROOT / ".german-drafts"
CACHE = STAGING / "translation-cache.json"
PATHS = json.loads((ROOT / "src/data/germanMirrorPaths.json").read_text(encoding="utf-8"))
SITE = "https://www.fitcloo.com"
CORE = {
    "/": "/de/",
    "/private-label/": "/de/private-label-activewear/",
    "/oem-activewear-manufacturer/": "/de/oem-activewear-manufacturer/",
    "/ready-to-ship/": "/de/ready-stock-activewear/",
    "/contact/": "/de/contact/",
}
EDITORIAL = {
    "B2B GROWTH": "B2B-WISSEN FÜR",
    "INSIGHTS.": "MARKEN.",
    "50–99 units (specify style and sets or pieces)": "50–99 Stück oder Sets (Modell angeben)",
    "100 - 300 PCS (estimated quantity)": "100–300 Stück oder Sets (geplante Menge)",
    "300 - 1,000 PCS": "300–1.000 Stück oder Sets",
    "1,000 - 5,000 PCS": "1.000–5.000 Stück oder Sets",
    "5,000+ PCS (High Volume)": "Über 5.000 Stück oder Sets",
    "Company Introduction": "Das Unternehmen Fitclo",
    "Why Customers Choose Fitclo": "Warum Kunden Fitclo wählen",
    "Global Certifications": "Internationale Zertifizierungen",
    "B2B GROWTH INSIGHTS.": "B2B-WISSEN FÜR MARKEN",
    "Source private label leggings with fit, fabric and recovery clearly defined.": "Eigenmarken-Leggings mit klarer Passform und Stoffwahl beschaffen.",
    "A legging brief should cover more than a high waist and a color. Define the silhouette, fabric hand feel, coverage expectations, waistband, inseam, pockets or seam details, size range and branding before the sample route is confirmed.": "Ein Beschaffungsbriefing für Leggings umfasst mehr als Bundhöhe und Farbe. Legen Sie Schnitt, Stoffgriff, Blickdichte, Bund, Innenbeinlänge, Taschen und Nahtdetails, Größenbereich sowie Branding fest, bevor Sie das Muster beauftragen.",
    "Source sports bras by support intent, not just by a neckline photo.": "Sport-BHs nach gewünschtem Halt auswählen – nicht nur nach dem Ausschnittbild.",
    "Build a private label yoga-set collection with decisions buyers can approve.": "Eine Eigenmarken-Kollektion aus Yoga-Sets mit prüfbaren Produktentscheidungen entwickeln.",
    "Specify gym shorts for the movement, storage and fit your buyer expects.": "Sportshorts nach Bewegungsfreiheit, Taschen und gewünschter Passform spezifizieren.",
    "Start from relevant product references.": "Mit passenden Produktreferenzen beginnen.",
    "Turn an idea into a workable sourcing brief.": "Aus einer Idee ein umsetzbares Beschaffungsbriefing machen.",
    "Choose the direction, then validate it on the right sample.": "Produktrichtung festlegen und am passenden Muster prüfen.",
    "Approve the reference before you approve the production route.": "Erst die Produktreferenz freigeben, dann die Produktionsroute bestätigen.",
    "Need to assess the current program first?": "Zuerst das aktuelle Lagerprogramm prüfen?",
    "Questions to settle before the order moves forward.": "Diese Fragen vor der Bestellung klären.",
    "Get a practical recommendation for your next collection.": "Eine konkrete Empfehlung für Ihre nächste Kollektion erhalten.",
    "View Product Directions": "Produktoptionen ansehen",
    "Discuss on WhatsApp": "Per WhatsApp anfragen",
    "View product details": "Produktdetails ansehen",
    "Open Ready-Stock Catalog": "Lagerkatalog öffnen",
    "Read the sizing & grading guide": "Leitfaden zu Größen und Gradierung lesen",
    "Use the activewear sample approval checklist": "Checkliste zur Musterfreigabe nutzen",
    "Ask on WhatsApp": "Per WhatsApp anfragen",
    "Open Inquiry Form": "Anfrageformular öffnen",
    "Sample Approved, Bulk Failed? 5 Activewear Quality Problems Buyers Can Trace": "Muster freigegeben, Serienware mangelhaft? Fünf prüfbare Qualitätsprobleme bei Sportbekleidung",
    "Five failures: what to compare first": "Fünf Fehler: Was Käufer zuerst vergleichen sollten",
    "Before diagnosing: build one issue record": "Vor der Ursachenanalyse: Abweichung dokumentieren",
    "1. Bulk colors are inconsistent with the approved shade": "1. Serienfarben weichen vom freigegebenen Farbton ab",
    "2. A logo lifts, cracks or peels after washing": "2. Das Logo löst sich, reißt oder blättert nach dem Waschen ab",
    "3. A leggings waistband rolls during wear": "3. Der Bund der Leggings rollt sich beim Tragen ein",
    "4. Bulk sizes drift from the measurement chart": "4. Seriengrößen weichen von der Maßtabelle ab",
    "5. The production garment is simply not the approved sample": "5. Das Produktionsstück entspricht nicht dem freigegebenen Muster",
    "A practical buyer handoff that prevents repeat disputes": "Eine klare Übergabe zwischen Käufer und Produktion verhindert wiederkehrende Abweichungen",
    "Home": "Startseite",
}

spec = spec_from_file_location("translate_spanish_draft", ROOT / "scripts/translate-spanish-draft.py")
translator = module_from_spec(spec)
spec.loader.exec_module(translator)


def source_file(path):
    return SOURCE / path.strip("/") / "index.html"


def target_path(path):
    return CORE.get(path, f"/de{path}") if path in PATHS or path in CORE else None


def candidates(soup):
    texts = [str(node).strip() for node in soup.find_all(string=True)
             if isinstance(node, NavigableString) and not isinstance(node, Comment) and node.strip()
             and not any(parent.name in translator.SKIP_PARENTS for parent in node.parents)]
    for tag in soup.find_all(True):
        for attr in ("alt", "aria-label", "placeholder", "title", "content"):
            if not isinstance(tag.get(attr), str) or not tag[attr].strip():
                continue
            if attr == "content" and not (tag.name == "meta" and (
                tag.get("name") == "description" or tag.get("property") in
                {"og:title", "og:description", "twitter:title", "twitter:description"}
            )):
                continue
            texts.append(tag[attr].strip())
    schema_keys = {"name", "headline", "description", "text", "articleBody", "alternativeHeadline"}

    def schema_text(value, key=""):
        if isinstance(value, dict):
            for name, item in value.items():
                yield from schema_text(item, name)
        elif isinstance(value, list):
            for item in value:
                yield from schema_text(item, key)
        elif isinstance(value, str) and key in schema_keys and value.strip():
            yield value.strip()

    for script in soup.select('script[type="application/ld+json"]'):
        try:
            texts.extend(schema_text(json.loads(script.string or "")))
        except json.JSONDecodeError:
            pass
    return list(dict.fromkeys(texts))


def translate_cache():
    STAGING.mkdir(exist_ok=True)
    cache = json.loads(CACHE.read_text(encoding="utf-8")) if CACHE.exists() else {}
    texts = set()
    for path in PATHS:
        if source_file(path).is_file():
            texts.update(candidates(BeautifulSoup(source_file(path).read_text(encoding="utf-8"), "html.parser")))
    missing = sorted(texts - cache.keys())
    chunks, chunk, length = [], [], 0
    for text in missing:
        if chunk and length + len(text) > 2200:
            chunks.append(chunk)
            chunk, length = [], 0
        chunk.append(text)
        length += len(text)
    if chunk:
        chunks.append(chunk)
    print(f"German translation: {len(PATHS)} routes, {len(texts)} strings, {len(missing)} missing, {len(chunks)} batches", flush=True)
    errors = []
    with ThreadPoolExecutor(max_workers=4) as pool:
        futures = {pool.submit(translator.translate, part, {}, "de"): part for part in chunks}
        for index, future in enumerate(as_completed(futures), 1):
            try:
                cache.update(future.result())
            except Exception as error:
                errors.append((futures[future], str(error)))
            if index % 20 == 0 or index == len(chunks):
                CACHE.write_text(json.dumps(cache, ensure_ascii=False), encoding="utf-8")
                print(f"Batches {index}/{len(chunks)}; failed {len(errors)}", flush=True)
    if errors:
        print(f"Retry required for {len(errors)} batches: {[error for _, error in errors[:3]]}", flush=True)
        raise SystemExit(1)
    print(f"German cache ready: {len(cache)} strings", flush=True)


def german_text(text, cache):
    if text.strip() in {"FIT", "Fit", "fit", "CLO", "Clo", "clo", "FITCLO", "Fitclo"}:
        return text.strip()
    if text.strip() in EDITORIAL:
        return EDITORIAL[text.strip()]
    result = cache.get(text.strip(), text)
    replacements = {
        "Aktivbekleidung": "Sportbekleidung",
        "aktivbekleidung": "Sportbekleidung",
        "Aktivkleidung": "Sportbekleidung",
        "Activewear": "Sportbekleidung",
        "activewear": "Sportbekleidung",
        "Private Label": "Eigenmarke",
        "Private-Label-": "Eigenmarken-",
        "Private-Label": "Eigenmarke",
        "Eigenmarken--": "Eigenmarken-",
        "Privatmarken": "Eigenmarken",
        "Turnhosen": "Sportshorts",
        "Turnshorts": "Sportshorts",
        "Geldwäschemethoden": "Waschprüfmethoden",
        "Geldwäscheverfahren": "Waschprüfverfahren",
        "Geldwäsche": "Waschprüfung",
        "Massenfarben": "Farben der Serienproduktion",
        "Probenahme": "Bemusterung",
        "Unternehmen Einführung": "Das Unternehmen Fitclo",
        "Warum Kunden Wählen Sie Fitclo": "Warum Kunden Fitclo wählen",
        "Global Zertifizierungen": "Internationale Zertifizierungen",
        "B2B-WACHSTUM EINBLICKE.": "B2B-WISSEN FÜR MARKEN",
        "Sportbekleidung-Styles": "Sportbekleidungsmodelle",
        "Sportbekleidung-Stile": "Sportbekleidungsmodelle",
        "Sportbekleidung-Blog": "Blog für Sportbekleidung",
        "Sportbekleidung-Marken": "Sportbekleidungsmarken",
        "Sportbekleidung-Kollektionen": "Sportbekleidungskollektionen",
        "Sportbekleidung-Set": "Sportbekleidungsset",
        "Eigenmarke-Sportbekleidung": "Sportbekleidung für Eigenmarken",
        "Eigenmarke-Pilates": "Eigenmarken-Pilates",
        "Fragen Sie nach ": "Modell anfragen: ",
        "Fragen Sie auf WhatsApp nach": "Per WhatsApp anfragen: ",
        "Lesen Sie die Größen- und Sortieranleitung": "Leitfaden zu Größen und Gradierung lesen",
        "Nutzen Sie die Prüfliste für die Freigabe von Sportbekleidung-Mustern": "Checkliste zur Musterfreigabe nutzen",
        "Machen Sie dieses Farbblock-Set zu einem unverwechselbaren Accessoire.": "Geben Sie diesem Farbblock-Set einen unverwechselbaren Markenauftritt.",
        "Bestätigen Sie den Bau vor der Zusage.": "Konstruktion vor der Bestellung bestätigen.",
        "Treffen Sie Entscheidungen gegen das zugelassene Produkt.": "Entscheidungen am freigegebenen Muster prüfen.",
        "Sportbekleidung Sourcing": "Beschaffung von Sportbekleidung",
        "Sportbekleidung-Sourcing": "Beschaffung von Sportbekleidung",
        "Versandauftrag auf Verantwortlichkeiten": "Beschaffungsplan auf klare Zuständigkeiten",
        "Ein Leggings-Slip": "Ein Beschaffungsbriefing für Leggings",
        "Beispielbewertung": "Musterprüfung",
        "Bildhauersets": "Sculpt-Sets",
        "Ausgehöhlter Sport-BH": "Sport-BH mit Cut-out-Details",
        "Support, Muster": "Halt, Muster",
        "Stil 0636 für Käufer von Yoga-Sets, Fitnessstudio und Sportbekleidung.": "Modell 0636 für Käufer von Yoga-Sets und Sportbekleidung.",
    }
    for old, new in replacements.items():
        result = result.replace(old, new)
    result = re.sub(r"\b(\d+)\s+Sätz(?:e|en)\b", r"\1 Sets", result)
    return result


def localize_url(url):
    parsed = urlsplit(url)
    absolute = parsed.netloc == "www.fitcloo.com"
    if parsed.netloc and not absolute:
        return url
    target = target_path(parsed.path)
    if not target:
        return url
    return urlunsplit((parsed.scheme, parsed.netloc, target, parsed.query, parsed.fragment))


def german_whatsapp(url, sku=""):
    parsed = urlsplit(url)
    if parsed.netloc not in {"api.whatsapp.com", "wa.me"}:
        return url
    params = parse_qs(parsed.query)
    if "text" not in params:
        return url
    params["text"] = [
        f"Hallo Fitclo, ich interessiere mich für Modell {sku}. Bitte bestätigen Sie Farben, Größen, Verfügbarkeit, Mindestbestellmenge und Eigenmarkenoptionen."
        if sku else
        "Hallo Fitclo, ich interessiere mich für Ihre Sportbekleidung. Bitte senden Sie mir Ihren Katalog sowie Informationen zu Mindestbestellmengen und Eigenmarkenoptionen."
    ]
    return urlunsplit((parsed.scheme, parsed.netloc, parsed.path, urlencode(params, doseq=True), parsed.fragment))


def build_drafts():
    cache = json.loads(CACHE.read_text(encoding="utf-8"))
    missing = set()
    for path in PATHS:
        source = source_file(path)
        if not source.is_file():
            raise FileNotFoundError(source)
        soup = BeautifulSoup(source.read_text(encoding="utf-8"), "html.parser")
        missing.update(set(candidates(soup)) - cache.keys())
    if missing:
        raise SystemExit(f"Translation cache misses {len(missing)} strings; run cache mode")

    for path in PATHS:
        source_html = source_file(path).read_text(encoding="utf-8")
        original_soup = BeautifulSoup(source_html, "html.parser")
        soup = BeautifulSoup(source_html, "html.parser")
        for node in list(soup.find_all(string=True)):
            if not isinstance(node, NavigableString) or isinstance(node, Comment) or not node.strip() or any(
                parent.name in translator.SKIP_PARENTS for parent in node.parents
            ):
                continue
            original = str(node)
            node.replace_with(re.sub(r"\S(?:.*\S)?", lambda match: german_text(match.group(), cache), original, count=1, flags=re.S))
        for tag in soup.find_all(True):
            for attr in ("alt", "aria-label", "placeholder", "title", "content"):
                if not isinstance(tag.get(attr), str) or not tag[attr].strip():
                    continue
                if attr == "content" and not (tag.name == "meta" and (
                    tag.get("name") == "description" or tag.get("property") in
                    {"og:title", "og:description", "twitter:title", "twitter:description"}
                )):
                    continue
                tag[attr] = german_text(tag[attr], cache)
        if path.startswith("/products/"):
            preserve = {"Fabric", "Main Fabric", "Outer Layer", "Material", "Colors", "Colors Shown"}
            for english_row, german_row in zip(original_soup.select("table tr"), soup.select("table tr")):
                english_cells = english_row.select("th, td")
                german_cells = german_row.select("th, td")
                for index in range(0, min(len(english_cells), len(german_cells)) - 1, 2):
                    label = english_cells[index].get_text(" ", strip=True)
                    if label in preserve:
                        german_cells[index + 1].string = english_cells[index + 1].get_text(" ", strip=True)
                    elif label == "Sample":
                        german_cells[index].string = "Muster"
        target = f"/de{path}"
        canonical = SITE + target
        soup.html["lang"] = "de"
        soup.head.append(soup.new_tag("link", rel="stylesheet", href="/css/german-mirror.css"))
        for link in soup.find_all("link", rel="canonical"):
            link["href"] = canonical
        for meta in soup.find_all("meta"):
            if meta.get("property") == "og:url":
                meta["content"] = canonical
            elif meta.get("property") == "og:locale":
                meta["content"] = "de_DE"

        def schema(value, key=""):
            if isinstance(value, dict):
                return {name: schema(item, name) for name, item in value.items()}
            if isinstance(value, list):
                return [schema(item, key) for item in value]
            if isinstance(value, str):
                if key == "inLanguage" and value.startswith("en"):
                    return "de"
                if value.startswith(SITE):
                    return localize_url(value)
                if key in {"name", "headline", "description", "text", "articleBody", "alternativeHeadline"}:
                    return german_text(value, cache)
            return value

        for script in soup.select('script[type="application/ld+json"]'):
            try:
                script.string = json.dumps(schema(json.loads(script.string or "")), ensure_ascii=False)
            except json.JSONDecodeError:
                pass
        for link in soup.find_all("a", href=True):
            link["href"] = localize_url(link["href"])
            card = link.find_parent(attrs={"data-wa-product-code": True})
            sku = link.get("data-wa-product-code") or (card.get("data-wa-product-code") if card else "")
            link["href"] = german_whatsapp(link["href"], sku)
        for button in soup.select("[data-wa-url]"):
            button["data-wa-url"] = german_whatsapp(button["data-wa-url"], button.get("data-wa-product-code", ""))
            button["data-language"] = "de"
        for quote in soup.select("[data-wa-quote]"):
            quote["data-language"] = "de"
        for form in soup.select("form#inquiry-form"):
            form.attrs.update({
                "data-language": "de", "data-page-path": target,
                "data-sending": "Anfrage wird gesendet …",
                "data-success": "Anfrage gesendet. Wir melden uns nach Prüfung Ihrer Angaben.",
                "data-error": "Die Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut oder kontaktieren Sie uns per WhatsApp.",
                "data-no-file": "Keine Datei ausgewählt",
            })
            for option in form.select('select[name="quantity"] option'):
                if option.get("value", "").startswith("20-49"):
                    option.decompose()
        spanish_link = soup.find("link", hreflang="es")
        spanish_path = urlsplit(spanish_link["href"]).path if spanish_link else "/es/"
        for selector in soup.select("select[data-language-selector]"):
            for index, option in enumerate(selector.select("option")):
                option.attrs.pop("selected", None)
                if index == 0:
                    option.string, option["value"] = "EN", path
                elif index == 1:
                    option.string, option["value"] = "ES", spanish_path
                elif option.get("data-language") == "de":
                    option.string, option["value"], option["selected"] = "DE", target, ""
        for field in soup.select("input[name=language]"):
            field["value"] = "de"
        for card in soup.select("[data-catalog-search]"):
            card["data-catalog-search"] += " " + card.get_text(" ", strip=True).lower()
        for link in soup.select("link[hreflang]"):
            link.decompose()
        original_es = original_soup.find("link", hreflang="es")
        for language, url in (("en", SITE + path), ("es", original_es.get("href") if original_es else ""), ("de", canonical), ("x-default", SITE + path)):
            if url:
                soup.head.append(soup.new_tag("link", rel="alternate", hreflang=language, href=url))
        destination = STAGING / "pages" / path.strip("/") / "index.html"
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(str(soup).strip() + "\n", encoding="utf-8")
    print(f"German drafts ready: {len(PATHS)} pages", flush=True)


def publish():
    for path in PATHS:
        draft = STAGING / "pages" / path.strip("/") / "index.html"
        if not draft.exists():
            raise FileNotFoundError(draft)
        destination = ROOT / "public/de" / path.strip("/") / "index.html"
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_bytes(draft.read_bytes())
    (ROOT / "src/data/germanMirrorPaths.json").write_text(json.dumps(PATHS, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Published {len(PATHS)} German static pages", flush=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("mode", choices=["cache", "draft", "publish"])
    mode = parser.parse_args().mode
    {"cache": translate_cache, "draft": build_drafts, "publish": publish}[mode]()
