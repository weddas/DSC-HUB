#!/usr/bin/env python3
"""Import VIVOSUN lights + tents from custom storefront category pages.

Vivosun is not Shopify. Category routes:
  /Grow_Light-c3  /Grow_Tent-c2  /Grow_Tent_Kit-c11
Ships AU per shipping-types (AU Post / TOLL; free ≥ $99 AUD).

Usage:
  python scripts/import_lights_tents_vivosun.py
  python scripts/import_lights_tents_vivosun.py --limit 15
"""
from __future__ import annotations

import argparse
import html as html_lib
import json
import re
import time
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "homeassistant" / "data"
BASE = "https://vivosun.com"
UA = "DSC-HUB-vivosun/1.0 (+local research dump; polite crawl)"
CATS = {
    "light": ["/Grow_Light-c3"],
    "tent": ["/Grow_Tent-c2", "/Grow_Tent_Kit-c11"],
}
DIM_CM = re.compile(
    r"(?i)(\d+(?:\.\d+)?)\s*[x×]\s*(\d+(?:\.\d+)?)\s*[x×]\s*(\d+(?:\.\d+)?)\s*cm"
)
WATT = re.compile(r"(?i)(?:^|[^\w])(\d{2,4})\s*w(?:att)?s?\b")
PPFD_IMG = re.compile(r"(?i)(ppfd[\s_-]?map|par[\s_-]?map|ppfd|heatmap|intensity[\s_-]?map)")
SPECTRUM_IMG = re.compile(r"(?i)(spectrum[\s_-]?(?:map|chart|graph)?|spd|spectral)")
BEAM_IMG = re.compile(r"(?i)(beam[\s_-]?map|distribution|polar)")
DATASHEET = re.compile(r"(?i)\.pdf(?:\?|$)")
ASSET_URL = re.compile(
    r"(?i)^https?://.+\.(?:jpg|jpeg|png|webp|gif|svg|pdf)(?:\?.*)?$"
)
NEXT_DATA = re.compile(
    r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', re.I | re.S
)
ATTR_WATT = re.compile(r"(?i)^(\d+(?:\.\d+)?)\s*w")
ATTR_PPE = re.compile(r"(?i)(\d+(?:\.\d+)?)\s*(?:µ|u|μ)?mol/?j")
ATTR_PPFD = re.compile(
    r"(?i)(\d+(?:\.\d+)?)\s*(?:µ|u|μ)?mol.*?/(?:m|m²|m2)"
)


def fetch(url: str) -> str:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": UA,
            "Accept": "text/html,application/json",
            "Accept-Language": "en-AU,en;q=0.9",
        },
    )
    with urllib.request.urlopen(req, timeout=70) as r:
        return r.read().decode("utf-8", errors="replace")


def clean_html(html_frag: str) -> str:
    t = re.sub(r"(?is)<script.*?</script>", " ", html_frag or "")
    t = re.sub(r"(?is)<style.*?</style>", " ", t)
    t = re.sub(r"(?is)<[^>]+>", " ", t)
    return re.sub(r"\s+", " ", html_lib.unescape(t)).strip()


def slug_id(*parts: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "_", "_".join(parts).lower()).strip("_")
    return s[:80] or "unknown"


def product_links_from_category(html: str) -> list[str]:
    # vivosun product paths often look like /something-pNNNN-vNNNN
    links = set()
    for m in re.finditer(r'href="(/[^"#?]+\-p\d+\-v\d+)"', html):
        links.add(m.group(1))
    for m in re.finditer(r'href="(https://vivosun\.com/[^"#?]+\-p\d+\-v\d+)"', html):
        links.add(m.group(1).replace("https://vivosun.com", ""))
    return sorted(links)


def _abs_url(url: str) -> str:
    if not url:
        return ""
    if url.startswith("//"):
        return "https:" + url
    if url.startswith("/"):
        return urljoin(BASE + "/", url.lstrip("/"))
    return url


def assets_from(html: str, next_doc: dict | None = None) -> dict:
    """Collect map/PDF assets. Keyword-gated only — never invent map labels."""
    buckets = {"ppfd_maps": [], "spectrum_maps": [], "beam_maps": [], "datasheets": []}
    seen: set[str] = set()

    def add(url: str, key: str, kind: str, title: str | None = None, source: str = "pdp") -> None:
        url = _abs_url(url)
        if not url or url in seen or url.startswith("data:"):
            return
        # Reject marketing copy / non-asset strings sucked from content= attrs
        if not ASSET_URL.match(url.split()[0] if url else ""):
            # Allow CDN paths without clear extension when they look like image CDN
            if "image.next.vivosun.com" in url and "/picture/" in url:
                pass
            elif "file-asset" in url and (".pdf" in url.lower() or DATASHEET.search(url)):
                pass
            else:
                return
        # Still require a single token URL (no spaces / prose)
        if " " in url or "\n" in url or len(url) > 500:
            return
        seen.add(url)
        buckets[key].append(
            {
                "url": url,
                "kind": kind,
                "title": title,
                "mime_hint": "application/pdf" if DATASHEET.search(url) else None,
                "source": source,
            }
        )

    def classify(blob: str, url: str, title: str | None = None, source: str = "pdp") -> None:
        url = (url or "").strip()
        if not url.startswith("http") and not url.startswith("//") and not url.startswith("/"):
            return
        hay = f"{title or ''} {blob} {url}"
        if DATASHEET.search(url) or (DATASHEET.search(hay) and ASSET_URL.match(_abs_url(url))):
            add(url, "datasheets", "datasheet", title, source)
        elif PPFD_IMG.search(hay) and (
            ASSET_URL.match(_abs_url(url))
            or ("image.next.vivosun.com" in _abs_url(url) and "/picture/" in url)
        ):
            # Require keyword on title/filename — not only product marketing prose
            if PPFD_IMG.search(f"{title or ''} {url}"):
                add(url, "ppfd_maps", "ppfd_map", title, source)
        elif SPECTRUM_IMG.search(f"{title or ''} {url}") and (
            ASSET_URL.match(_abs_url(url))
            or ("image.next.vivosun.com" in _abs_url(url) and "/picture/" in url)
        ):
            add(url, "spectrum_maps", "spectrum_map", title, source)
        elif BEAM_IMG.search(f"{title or ''} {url}") and (
            ASSET_URL.match(_abs_url(url))
            or ("image.next.vivosun.com" in _abs_url(url) and "/picture/" in url)
        ):
            add(url, "beam_maps", "beam_map", title, source)

    for m in re.finditer(r"(?:src|href)=[\"']([^\"']+)[\"']", html, flags=re.I):
        href = m.group(1)
        classify(href, href, source="html_attr")

    # Markdown gallery images: ![alt](url)
    for alt, href in re.findall(r"!\[([^\]]*)\]\(([^)]+)\)", html):
        classify(alt, href, title=alt or None, source="markdown")

    if next_doc:
        try:
            variants = (
                ((next_doc.get("props") or {}).get("pageProps") or {})
                .get("spu", {})
                .get("productVariants")
                or []
            )
        except Exception:
            variants = []
        for var in variants:
            for pic in var.get("pics") or []:
                if not isinstance(pic, dict):
                    continue
                title = (pic.get("altText") or "").strip() or None
                for key in ("picLink", "cover", "url", "src"):
                    u = pic.get(key)
                    if isinstance(u, str) and u.startswith("http"):
                        classify(title or "", u, title=title, source="next_pics")
            for pdf in (var.get("productPdfVoList") or []) + (var.get("productManualList") or []):
                if not isinstance(pdf, dict):
                    continue
                link = pdf.get("link") or pdf.get("webLink") or ""
                name = pdf.get("name") or pdf.get("fileName") or "manual"
                if isinstance(link, str) and link:
                    if link.startswith("/"):
                        link = BASE + link
                    if DATASHEET.search(link) or link.endswith(".pdf"):
                        add(link, "datasheets", "datasheet", name, source="next_pdf")
            md = var.get("descMarkdown") or var.get("descMarkdownHtml") or ""
            for alt, href in re.findall(r"!\[([^\]]*)\]\(([^)]+)\)", md):
                classify(alt, href, title=alt or None, source="next_markdown")
    return buckets


def _parse_next_light_fields(next_doc: dict | None) -> dict:
    """Stated wattage / PPE / point-PPFD from NEXT_DATA attributes (not map grids)."""
    out: dict = {
        "wattage_w": None,
        "efficacy_umol_j": None,
        "ppf_umol_s": None,
        "stated_ppfd": None,
        "coverage_ft": None,
        "ip_rating": None,
        "spectrum": None,
        "name": None,
        "sku": None,
    }
    if not next_doc:
        return out
    try:
        variants = (
            ((next_doc.get("props") or {}).get("pageProps") or {})
            .get("spu", {})
            .get("productVariants")
            or []
        )
    except Exception:
        return out
    if not variants:
        return out
    var = variants[0]
    out["name"] = var.get("name") or var.get("productName")
    out["sku"] = var.get("sku")
    attrs = {}
    for a in var.get("productAttributeList") or []:
        if not isinstance(a, dict):
            continue
        key = (a.get("attributeName") or "").strip().lower()
        vals = [
            (x.get("name") or "").strip()
            for x in (a.get("attributeValues") or [])
            if isinstance(x, dict)
        ]
        if key and vals:
            attrs[key] = vals[0]
    if "wattage" in attrs:
        m = ATTR_WATT.search(attrs["wattage"])
        if m:
            out["wattage_w"] = float(m.group(1))
    if "efficiency" in attrs:
        m = ATTR_PPE.search(attrs["efficiency"])
        if m:
            out["efficacy_umol_j"] = float(m.group(1))
    if "ppfd" in attrs:
        out["stated_ppfd"] = attrs["ppfd"]
        m = ATTR_PPFD.search(attrs["ppfd"])
        # Point reading only — stored in raw_props; never as a map grid.
        if m:
            out["raw_ppfd_point_umol"] = float(m.group(1))
    if "light coverage" in attrs:
        out["coverage_ft"] = attrs["light coverage"]
    if "waterproof rating" in attrs:
        out["ip_rating"] = attrs["waterproof rating"]
    if "spectrum" in attrs:
        out["spectrum"] = attrs["spectrum"]
    return out


def parse_light(url: str, html: str) -> dict:
    title_m = re.search(r"<h1[^>]*>(.*?)</h1>", html, flags=re.I | re.S)
    title = clean_html(title_m.group(1)) if title_m else url.rstrip("/").split("/")[-1]
    text = clean_html(html)
    handle = url.rstrip("/").split("/")[-1]
    next_doc = None
    nm = NEXT_DATA.search(html)
    if nm:
        try:
            next_doc = json.loads(nm.group(1))
        except json.JSONDecodeError:
            next_doc = None
    fields = _parse_next_light_fields(next_doc)
    if fields.get("name"):
        title = fields["name"]
    watt = fields.get("wattage_w")
    if watt is None:
        watt = float(WATT.search(f"{title} {text}").group(1)) if WATT.search(f"{title} {text}") else None
    assets = assets_from(html, next_doc)
    raw_props = {}
    if fields.get("stated_ppfd"):
        raw_props["stated_ppfd"] = fields["stated_ppfd"]
    if fields.get("raw_ppfd_point_umol") is not None:
        raw_props["stated_ppfd_point_umol"] = fields["raw_ppfd_point_umol"]
        raw_props["stated_ppfd_note"] = (
            "Single point reading from PDP attributes — not a PPFD map grid."
        )
    return {
        "id": slug_id("vivosun", "light", handle),
        "name": title,
        "brand": "VIVOSUN",
        "kind": "light",
        "product_line": None,
        "url": url if url.startswith("http") else BASE + url,
        "handle": handle,
        "shopify_id": None,
        "sku": fields.get("sku"),
        "tags": [],
        "product_type": None,
        "wattage_w": watt,
        "ppf_umol_s": fields.get("ppf_umol_s"),
        "efficacy_umol_j": fields.get("efficacy_umol_j"),
        "spectrum": fields.get("spectrum")
        or ("full spectrum" if re.search(r"(?i)full\s*spectrum", text) else None),
        "cct_k": None,
        "coverage_m": None,
        "coverage_ft": fields.get("coverage_ft"),
        "dimmable": True if re.search(r"(?i)dimmable", text) else None,
        "voltage": None,
        "ip_rating": fields.get("ip_rating"),
        "ppfd_maps": assets["ppfd_maps"],
        "spectrum_maps": assets["spectrum_maps"],
        "beam_maps": assets["beam_maps"],
        "datasheets": assets["datasheets"],
        "price": None,
        "available": None,
        "raw_props": raw_props,
        "notes": (
            "NEXT_DATA attribute enrich; map URLs only when keyword-labeled. "
            "CDN gallery hashes without labels are not treated as PPFD maps."
        ),
        "source_urls": [url if url.startswith("http") else BASE + url],
    }


def parse_tent(url: str, html: str) -> dict:
    title_m = re.search(r"<h1[^>]*>(.*?)</h1>", html, flags=re.I | re.S)
    title = clean_html(title_m.group(1)) if title_m else url.rstrip("/").split("/")[-1]
    text = clean_html(html)
    handle = url.rstrip("/").split("/")[-1]
    dims = None
    m = DIM_CM.search(f"{title} {text}")
    if m:
        w, d, h = float(m.group(1)), float(m.group(2)), float(m.group(3))
        dims = {
            "label": f"{w:g}x{d:g}x{h:g}cm",
            "width_cm": w,
            "depth_cm": d,
            "height_cm": h,
            "footprint_m2": round((w * d) / 10000.0, 4),
            "volume_m3": round((w * d * h) / 1_000_000.0, 4),
        }
    fabric = None
    fm = re.search(r"(?i)(\d{3,4}\s*D)", text)
    if fm:
        fabric = fm.group(1)
    return {
        "id": slug_id("vivosun", "tent", handle),
        "name": title,
        "brand": "VIVOSUN",
        "kind": "tent",
        "product_line": None,
        "url": url if url.startswith("http") else BASE + url,
        "handle": handle,
        "shopify_id": None,
        "sku": None,
        "tags": [],
        "product_type": None,
        "dimensions": dims,
        "footprint_m2": (dims or {}).get("footprint_m2"),
        "volume_m3": (dims or {}).get("volume_m3"),
        "fabric": fabric,
        "frame": None,
        "ports": None,
        "viewing_window": None,
        "price": None,
        "available": None,
        "kit": bool(re.search(r"(?i)kit", title)),
        "raw_props": {},
        "notes": None,
        "source_urls": [url if url.startswith("http") else BASE + url],
    }


def write_dump(kind: str, rows: list[dict]) -> Path:
    prefix = "lights" if kind == "light" else "tents"
    path = DATA / f"dsc_{prefix}_vivosun.json"
    if kind == "light":
        cov = {
            "wattage_w": sum(1 for r in rows if r.get("wattage_w") is not None),
            "efficacy_umol_j": sum(1 for r in rows if r.get("efficacy_umol_j") is not None),
            "stated_ppfd": sum(
                1 for r in rows if (r.get("raw_props") or {}).get("stated_ppfd")
            ),
            "ppfd_maps": sum(1 for r in rows if r.get("ppfd_maps")),
            "spectrum_maps": sum(1 for r in rows if r.get("spectrum_maps")),
            "beam_maps": sum(1 for r in rows if r.get("beam_maps")),
            "datasheets": sum(1 for r in rows if r.get("datasheets")),
        }
    else:
        cov = {
            "dimensions": sum(1 for r in rows if r.get("dimensions")),
            "fabric": sum(1 for r in rows if r.get("fabric")),
        }
    payload = {
        "schema_version": 1,
        "source": "vivosun",
        "kind": kind,
        "imported_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "count": len(rows),
        "listing_count": len(rows),
        "ships_to_au": True,
        "ships_to_au_notes": "vivosun.com shipping-types lists Australia (AU Post/TOLL); free ≥ $99 AUD",
        "products": rows,
        "coverage": cov,
        "note": "Custom SPA category crawl (/Grow_Light-c3, /Grow_Tent-c2). Not Shopify.",
    }
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
    return path


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=None)
    args = ap.parse_args()

    light_links: set[str] = set()
    tent_links: set[str] = set()
    for kind, paths in CATS.items():
        for p in paths:
            try:
                html = fetch(BASE + p)
            except Exception as e:
                print("CAT FAIL", p, e)
                continue
            links = product_links_from_category(html)
            print(f"cat {p}: {len(links)} links bytes={len(html)}")
            (DATA / f"_vivosun_{p.strip('/').replace('/', '_')}.html").write_text(
                html[:150000], encoding="utf-8"
            )
            if kind == "light":
                light_links |= set(links)
            else:
                tent_links |= set(links)
            time.sleep(0.5)

    lights, tents = [], []
    for i, link in enumerate(sorted(light_links)):
        if args.limit is not None and i >= args.limit:
            break
        url = link if link.startswith("http") else BASE + link
        try:
            html = fetch(url)
        except Exception as e:
            print("FAIL", url, e)
            continue
        lights.append(parse_light(url, html))
        print("light", lights[-1]["name"][:55])
        time.sleep(0.45)
    for i, link in enumerate(sorted(tent_links)):
        if args.limit is not None and i >= args.limit:
            break
        url = link if link.startswith("http") else BASE + link
        try:
            html = fetch(url)
        except Exception as e:
            print("FAIL", url, e)
            continue
        tents.append(parse_tent(url, html))
        print("tent", tents[-1]["name"][:55])
        time.sleep(0.45)

    print(write_dump("light", lights))
    print(write_dump("tent", tents))
    print(f"DONE lights={len(lights)} tents={len(tents)}")


if __name__ == "__main__":
    main()
