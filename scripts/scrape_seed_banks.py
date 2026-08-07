#!/usr/bin/env python3
"""Polite seed-bank scrapers (research corpus). Checkpoint/resume; maximize fields.

Banks: Herbies, Royal Queen Seeds, Seedsman, ILGM (Shopify), SeedFinder index.
Redistributable=false — research scrape until legal review.
"""

from __future__ import annotations

import argparse
import html as html_lib
import json
import re
import sys
import time
from pathlib import Path
from urllib.parse import urljoin, urlparse

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from catalog_common import DATA, name_norm, polite_get, write_dump, parse_grow_fields  # noqa: E402
from catalog_fetch import Checkpoint  # noqa: E402

UA_NOTE = "research archival scrape; redistributable=false"

BANKS = {
    "herbies": {
        "list_pages": [
            "https://herbiesheadshop.com/us/feminized-cannabis-seeds",
            "https://herbiesheadshop.com/us/autoflower-cannabis-seeds",
            "https://herbiesheadshop.com/",
        ],
        "product_re": re.compile(
            r"https://herbiesheadshop\.com/(?:[a-z]{2}/)?cannabis-seeds/[a-z0-9\-]+",
            re.I,
        ),
    },
    "rqs": {
        "list_pages": [
            "https://www.royalqueenseeds.com/33-feminized-cannabis-seeds",
            "https://www.royalqueenseeds.com/34-autoflowering-cannabis-seeds",
            "https://www.royalqueenseeds.com/36-cbd-seeds",
        ],
        "product_re": re.compile(
            r"https://www\.royalqueenseeds\.com/(?:feminized|autoflowering|cbd|rqs-tyson)-cannabis-seeds/\d+-[a-z0-9\-]+\.html",
            re.I,
        ),
    },
    "seedsman": {
        "list_pages": [
            "https://www.seedsman.com/",
        ],
        "product_re": re.compile(r"https://www\.seedsman\.com/[a-z]{2}/[a-z0-9\-]+\.html", re.I),
    },
    "ilgm": {
        "list_pages": [
            "https://ilgm.com/collections/feminized-seeds",
            "https://ilgm.com/collections/autoflower-seeds",
        ],
        "product_re": re.compile(r"https://ilgm\.com/products/[a-z0-9\-]+", re.I),
    },
    "seedfinder": {
        "list_pages": [
            "https://seedfinder.eu/sitemap/sitemap-index.xml",
            "https://en.seedfinder.eu/database/strains/alphabetical/a/",
        ],
        "product_re": re.compile(
            r"https://(?:en\.)?seedfinder\.eu/(?:en/)?(?:strain-info|database/strains)/[A-Za-z0-9_\-%\.]+/?",
            re.I,
        ),
    },
}


def clean(html: str) -> str:
    t = re.sub(r"(?is)<script.*?</script>", " ", html or "")
    t = re.sub(r"(?is)<style.*?</style>", " ", t)
    t = re.sub(r"(?is)<[^>]+>", " ", t)
    return re.sub(r"\s+", " ", html_lib.unescape(t)).strip()


def extract_json_ld(html: str) -> list[dict]:
    out = []
    for m in re.finditer(
        r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
        html,
        re.I | re.S,
    ):
        try:
            doc = json.loads(m.group(1))
            if isinstance(doc, list):
                out.extend(d for d in doc if isinstance(d, dict))
            elif isinstance(doc, dict):
                out.append(doc)
        except json.JSONDecodeError:
            continue
    return out


def product_name_from_page(html: str, url: str) -> str:
    for block in extract_json_ld(html):
        if block.get("@type") in ("Product", ["Product"]) or "Product" in str(block.get("@type")):
            name = block.get("name")
            if name:
                return str(name).strip()
    m = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.I | re.S)
    if m:
        return clean(m.group(1))[:120]
    slug = urlparse(url).path.rstrip("/").split("/")[-1]
    return slug.replace("-", " ").replace("_", " ").strip()


def discover_links(bank: str, cfg: dict, *, delay: float, limit: int) -> list[str]:
    links: set[str] = set()
    cre = cfg.get("product_re")
    for page in cfg.get("list_pages") or []:
        try:
            html = polite_get(page, delay=delay)
            for m in cre.finditer(html):
                links.add(m.group(0).split("#")[0].split("?")[0])
            # relative hrefs
            for m in re.finditer(r'href=["\']([^"\']+)["\']', html, re.I):
                abs_u = urljoin(page, m.group(1)).split("#")[0].split("?")[0]
                if cre.match(abs_u):
                    links.add(abs_u)
            if len(links) >= limit * 3:
                break
        except Exception as exc:  # noqa: BLE001
            print(f"  list fail {page}: {exc}")
    return sorted(links)[: max(limit * 5, limit)]


def scrape_bank(bank: str, *, delay: float, limit: int) -> Path:
    cfg = BANKS[bank]
    out = DATA / f"dsc_strains_{bank}.json"
    ck = Checkpoint(DATA / f"dsc_strains_{bank}.checkpoint.json")
    links = discover_links(bank, cfg, delay=delay, limit=limit)
    print(f"{bank}: discovered {len(links)} product URLs")
    items = []
    # reload previous items if any
    if out.exists():
        try:
            prev = json.loads(out.read_text(encoding="utf-8"))
            items = list(prev.get("items") or [])
        except Exception:
            items = []
    seen = {i.get("url") for i in items if isinstance(i, dict)}

    for url in links:
        if len(items) >= limit:
            break
        if url in seen or ck.is_done(url):
            continue
        try:
            html = polite_get(url, delay=delay)
            name = product_name_from_page(html, url)
            text = clean(html)
            props = parse_grow_fields(text)
            # breeder guess from title "X by Y" or JSON-LD brand
            breeder = None
            for block in extract_json_ld(html):
                brand = block.get("brand")
                if isinstance(brand, dict):
                    brand = brand.get("name")
                if brand:
                    breeder = str(brand)
            m = re.search(r"(?i)breeder[:\s]+([A-Za-z0-9][A-Za-z0-9 &\-\.]{1,40})", text)
            if m and not breeder:
                breeder = m.group(1).strip()
            row = {
                "name": name,
                "name_norm": name_norm(name),
                "breeder": breeder or bank.title(),
                "url": url,
                "source": bank,
                "bank_props": props,
                **props,
            }
            # stash a short description snippet for overflow
            row["page_text_excerpt"] = text[:1500]
            items.append(row)
            seen.add(url)
            ck.mark_done(url)
            if len(items) % 10 == 0:
                write_dump(
                    out,
                    "strains",
                    items,
                    source=bank,
                    license=UA_NOTE,
                    redistributable=False,
                    note="partial checkpoint dump",
                )
                print(f"  {bank}: {len(items)}/{limit}")
        except Exception as exc:  # noqa: BLE001
            ck.note_error(f"{url}: {exc}")
            print(f"  fail {url}: {exc}")

    write_dump(
        out,
        "strains",
        items[:limit],
        source=bank,
        license=UA_NOTE,
        redistributable=False,
        note="research scrape; not for open export until legal review",
    )
    print(f"wrote {out} count={min(len(items), limit)}")
    return out


def discover_more_banks() -> Path:
    """Write a discovery list of additional bank domains for future waves."""
    candidates = [
        {"name": "Crop King Seeds", "url": "https://www.cropkingseeds.com/", "region": "CA"},
        {"name": "Seed Supreme", "url": "https://seedsupreme.com/", "region": "US"},
        {"name": "MSNL", "url": "https://www.msnlsseeds.com/", "region": "UK"},
        {"name": "Fast Buds", "url": "https://fastbuds.com/", "region": "ES"},
        {"name": "Barney's Farm", "url": "https://www.barneysfarm.com/", "region": "NL"},
        {"name": "Dutch Passion", "url": "https://dutch-passion.com/", "region": "NL"},
        {"name": "Greenhouse Seeds", "url": "https://www.greenhouseseeds.nl/", "region": "NL"},
        {"name": "DNA Genetics", "url": "https://dnagenetics.com/", "region": "NL"},
        {"name": "Mephisto Genetics", "url": "https://mephistogenetics.com/", "region": "ES"},
        {"name": "Night Owl Seeds", "url": "https://nightowleseeds.com/", "region": "US"},
        {"name": "Australian Seed Banks portal", "url": "https://www.theseedbank.com.au/", "region": "AU"},
        {"name": "Dr Chronic", "url": "https://www.drchronic.com/", "region": "AU"},
    ]
    out = DATA / "dsc_bank_discovery.json"
    write_dump(
        out,
        "bank_discovery",
        candidates,
        source="n087_discovery",
        note="candidates for Wave B+ scrapers",
        redistributable=True,
    )
    print(f"wrote discovery {out} count={len(candidates)}")
    return out


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--bank", choices=list(BANKS) + ["all", "discover"], default="all")
    ap.add_argument("--limit", type=int, default=80, help="max products per bank")
    ap.add_argument("--delay", type=float, default=0.8)
    args = ap.parse_args()
    DATA.mkdir(parents=True, exist_ok=True)
    if args.bank == "discover":
        discover_more_banks()
        return 0
    banks = list(BANKS) if args.bank == "all" else [args.bank]
    discover_more_banks()
    for b in banks:
        try:
            scrape_bank(b, delay=args.delay, limit=args.limit)
        except Exception as exc:  # noqa: BLE001
            print(f"bank {b} aborted: {exc}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
