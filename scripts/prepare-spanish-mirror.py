"""Prepare reviewed Spanish drafts for publication; does not run automatically.

Only call after the draft QA report and editorial review are complete.
"""

import json
import re
from pathlib import Path
from urllib.parse import parse_qs, urlencode, urlsplit, urlunsplit

from bs4 import BeautifulSoup


ROOT = Path(__file__).resolve().parents[1]
DRAFTS = ROOT / ".spanish-drafts"
BUILT = ROOT / "dist"
PUBLIC = ROOT / "public"
MANIFEST = ROOT / "src" / "data" / "spanishMirrorPaths.json"
SITE = "https://www.fitcloo.com"
SPECIAL = {
    "/": "/es/",
    "/private-label/": "/es/private-label-activewear/",
    "/oem-activewear-manufacturer/": "/es/oem-activewear-manufacturer/",
    "/ready-to-ship/": "/es/ready-stock-activewear/",
    "/contact/": "/es/contact/",
    "/wholesale-to/spain/": "/es/fabricante-ropa-deportiva-espana/",
    "/private-label-leggings/": "/es/fabricante-de-leggings/",
    "/private-label-sports-bras/": "/es/fabricante-de-sujetadores-deportivos/",
    "/private-label-yoga-sets/": "/es/fabricante-de-conjuntos-de-yoga/",
    "/gym-shorts-manufacturer/": "/es/fabricante-de-shorts-deportivos/",
    "/products/tank-tops/": "/es/fabricante-de-tops-deportivos/",
    "/blogs/oem-vs-odm-vs-private-label-activewear/": "/es/guias/marca-privada-vs-oem-odm/",
    "/blogs/activewear-manufacturing-cost-guide/": "/es/guias/precio-fabricar-ropa-deportiva-personalizada/",
    "/blogs/custom-activewear-manufacturing-process/": "/es/guias/desarrollar-coleccion-ropa-deportiva/",
    "/blogs/activewear-sample-to-bulk-quality-failures/": "/es/guias/problemas-calidad-ropa-deportiva-muestra-produccion/",
}
EDITORIAL_HEADINGS = {
    "/about/": {
        "Empresa Introducción": "Presentación de la empresa",
        "Por qué los clientes Elige Fitclo": "Por qué los clientes eligen Fitclo",
        "Mundial Certificaciones": "Certificaciones internacionales",
    },
    "/capabilities/": {
        "Fabricación Excelencia": "Excelencia en fabricación",
        "I+D de tejidos & Innovación": "I+D de tejidos e innovación",
        "Producción Tecnología": "Tecnología de producción",
        "estricto Control de Calidad": "Control de calidad riguroso",
    },
    "/blogs/": {"CRECIMIENTO B2B INFORMACIONES.": "INFORMACIÓN PARA EL CRECIMIENTO B2B"},
    "/products/tz2570-4/": {
        "Conjunto de entrenamiento con bloques de color: camiseta corta con tirantes dobles y pantalones acampanados plegables": "Conjunto deportivo de bloques de color con top corto de doble tirante y pantalones acampanados de cintura doblada",
    },
}
BLOG_LIST_RUSSIAN_COPY = {
    "ГИД ДЛЯ РОССИЙСКОГО РЫНКА": "GUÍA DEL MERCADO RUSO",
    "Производитель спортивной одежды для России: как брендам закупать ropa deportiva в China": "Fabricante de ropa deportiva para Rusia: cómo comprar en China",
    "ГИД ПО SETS DE YOGA": "GUÍA DE CONJUNTOS DE YOGA",
    "Как российским фитнес-брендам выбирать комплекты для йоги, conjuntos de entrenamiento capri y conjuntos de ropa deportiva de marca propia en una selección de kitesurf.": "Cómo elegir conjuntos de yoga, conjuntos capri y ropa deportiva de marca privada para marcas de fitness rusas.",
    "STOCK LISTO ДЛЯ РОССИИ": "STOCK DISPONIBLE PARA RUSIA",
    "Ropa deportiva en stock lista para botas rusas: запуск с меньшим MOQ": "Ropa deportiva en stock para tiendas rusas: lanzamiento con MOQ más bajo",
    "Как российским бутикам and онлайн-магазинам быстрее тестировать спрос через готовые модели, Small MOQ and Private Label упаковку.": "Cómo pueden las boutiques y tiendas online rusas probar la demanda con modelos existentes, MOQ bajo y embalaje de marca privada.",
    "ГИД ПО LEGGINGS": "GUÍA DE LEGGINGS",
    "Leggings de marca propia para las revistas rusas: posadka, ткань и брендинг": "Leggings de marca privada para tiendas rusas: ajuste, tejido e identidad de marca",
    "ГИД ПО SUJETADOR DEPORTIVO": "GUÍA DE SUJETADORES DEPORTIVOS",
}
for sku in ("0636", "3708", "tz4510-14", "tz2557-6", "tz5560-2", "tz5555-4", "tz4506-4", "tz4535-12"):
    SPECIAL[f"/products/{sku}/"] = f"/es/products/{sku}/"


def route_for(path):
    return "/" + path.parent.relative_to(DRAFTS).as_posix().strip("/") + "/"


drafts = sorted(DRAFTS.glob("**/index.html"))
routes = {}
for draft in drafts:
    english = route_for(draft)
    if english != "/blogs/" and re.search(r"[А-Яа-я]", draft.read_text(encoding="utf-8")):
        continue
    source = BUILT / english.strip("/") / "index.html"
    if not source.is_file():
        continue
    source_doc = BeautifulSoup(source.read_text(encoding="utf-8"), "html.parser")
    robots = source_doc.find("meta", attrs={"name": "robots"})
    if robots and "noindex" in (robots.get("content") or "").lower():
        continue
    canonical = source_doc.find("link", rel="canonical")
    if canonical and canonical.get("href") != SITE + english:
        continue
    spanish = SPECIAL.get(english, "/es" + english)
    if english in SPECIAL:
        continue
    if (BUILT / spanish.strip("/") / "index.html").exists() and not (PUBLIC / spanish.strip("/") / "index.html").exists():
        continue
    routes[english] = spanish

for english, spanish in SPECIAL.items():
    if (BUILT / spanish.strip("/") / "index.html").exists():
        routes[english] = spanish


def localize_url(value):
    parts = urlsplit(value)
    if not parts.path:
        return value
    if parts.scheme and parts.netloc not in {"www.fitcloo.com", "fitcloo.com"}:
        return value
    path = parts.path if parts.path.endswith("/") else parts.path + "/"
    if path.startswith("/es/"):
        english = path[3:]
        target = routes.get(english)
        if not target and (BUILT / english.strip("/") / "index.html").is_file():
            target = english
    else:
        target = routes.get(path)
    if not target:
        return value
    if parts.scheme:
        return urlunsplit((parts.scheme, parts.netloc, target, parts.query, parts.fragment))
    return urlunsplit(("", "", target, parts.query, parts.fragment))


def localize_schema(value):
    if isinstance(value, dict):
        return {key: localize_schema(item) for key, item in value.items()}
    if isinstance(value, list):
        return [localize_schema(item) for item in value]
    if isinstance(value, str) and (value.startswith(SITE) or value.startswith("/")):
        return localize_url(value)
    return value


def spanish_whatsapp(value, sku=""):
    parts = urlsplit(value)
    if parts.netloc not in {"api.whatsapp.com", "wa.me"}:
        return value
    parameters = parse_qs(parts.query)
    if "text" not in parameters:
        return value
    message = (f"Hola Fitclo, me interesa el modelo {sku}. ¿Podrían confirmar colores, tallas, "
               "disponibilidad, MOQ y opciones de marca privada?" if sku else
               "Hola Fitclo, estoy interesado en sus prendas deportivas. ¿Podrían enviarme "
               "el catálogo, MOQ y opciones de marca privada?")
    parameters["text"] = [message]
    return urlunsplit((parts.scheme, parts.netloc, parts.path, urlencode(parameters, doseq=True), parts.fragment))


published = []
for draft in drafts:
    english = route_for(draft)
    if english not in routes or english in SPECIAL:
        continue
    spanish = routes[english]
    soup = BeautifulSoup(draft.read_text(encoding="utf-8"), "html.parser")
    if english == "/blogs/":
        for node in soup.find_all(string=True):
            correction = BLOG_LIST_RUSSIAN_COPY.get(str(node).strip())
            if correction:
                node.replace_with(correction)
    for heading in soup.select("h1,h2,h3"):
        correction = EDITORIAL_HEADINGS.get(english, {}).get(heading.get_text(" ", strip=True))
        if correction:
            heading.string = correction
    if english == "/products/tz2570-4/":
        for node in soup.find_all(string=True):
            updated = str(node).replace("pantalones acampanados plegables", "pantalones acampanados de cintura doblada")
            if updated != str(node):
                node.replace_with(updated)
    if english == "/products/":
        for card in soup.select("[data-catalog-search]"):
            card["data-catalog-search"] += " " + card.get_text(" ", strip=True).lower()
    for link in soup.find_all("a", href=True):
        link["href"] = localize_url(link["href"])
        product = link.find_parent(attrs={"data-wa-product-code": True})
        sku = link.get("data-wa-product-code") or (product.get("data-wa-product-code") if product else "")
        link["href"] = spanish_whatsapp(link["href"], sku)
    for button in soup.select("[data-wa-url]"):
        button["data-wa-url"] = spanish_whatsapp(button["data-wa-url"], button.get("data-wa-product-code", ""))
    for script in soup.select('script[type="application/ld+json"]'):
        try:
            script.string = json.dumps(localize_schema(json.loads(script.string or "")), ensure_ascii=False)
        except json.JSONDecodeError:
            pass
    for selector in soup.select("select[data-language-selector]"):
        if selector.parent.name == "label":
            selector.parent.name = "div"
        for ancestor in selector.parents:
            if ancestor.name == "nav" and "md:flex" in ancestor.get("class", []):
                ancestor["class"] = ["lg:flex" if item == "md:flex" else item for item in ancestor["class"]]
            if ancestor.name == "nav" and "gap-7" in ancestor.get("class", []):
                ancestor["class"] = ["gap-4" if item == "gap-7" else "xl:gap-9" if item == "lg:gap-9" else item for item in ancestor["class"]]
            if ancestor.name == "header":
                break
        if "md:hidden" in selector.parent.get("class", []):
            selector.parent["class"] = ["lg:hidden" if item == "md:hidden" else item for item in selector.parent["class"]]
        for index, option in enumerate(selector.select("option")):
            if index == 0:
                option.string = "EN"
                option["value"] = english
                option.attrs.pop("selected", None)
            elif index == 1:
                option.string = "ES"
                option["value"] = spanish
                option["selected"] = ""
    if not soup.select_one('link[href="/css/language-menu.css"]'):
        soup.head.append(soup.new_tag("link", rel="stylesheet", href="/css/language-menu.css"))
    if not soup.select_one('script[src="/js/language-menu.js"]'):
        soup.head.append(soup.new_tag("script", src="/js/language-menu.js", defer=""))
    for tag in soup.select("[data-language]"):
        if tag["data-language"] == "en":
            tag["data-language"] = "es"
    for link in soup.select("link[hreflang]"):
        link.decompose()
    for language, url in (("en", SITE + english), ("es", SITE + spanish), ("x-default", SITE + english)):
        link = soup.new_tag("link", rel="alternate", hreflang=language, href=url)
        soup.head.append(link)
    target = PUBLIC / spanish.strip("/") / "index.html"
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(str(soup), encoding="utf-8")
    published.append(english)

MANIFEST.write_text(json.dumps(sorted(published), ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"Prepared {len(published)} Spanish static pages. Verify the build before deployment.")
