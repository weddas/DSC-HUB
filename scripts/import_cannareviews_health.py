#!/usr/bin/env python3
"""Import CannaReviews AU medical products/brands/reviews.

Source: https://cannareviews.health/ — AU medical cannabis patient community.

Primary path (--from-list, default): parse the public legal product list HTML
(~6MB table with brand/pack/spectrum/AUD price/THC%/CBD%/cultivar/rating).

Optional PDP enrich (--scrape-pdps): sitemap product pages for review counts /
JSON-LD (rate-limited; resume with --resume). Export API endpoints
(/api/v5.2.1/products/export|bulk|data/download) are honeypots that never finish.

Full review text + some gated fields need medauth session (--cookie).
redistributable=false until license clear.
"""

from __future__ import annotations

import argparse
import html as htmlmod
import json
import re
import ssl
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "scripts"))

from catalog_common import DATA, UA, name_norm, write_dump  # noqa: E402
from brain.dsc_brain.corpus import (  # noqa: E402
    add_chemistry,
    add_link,
    connect,
    corpus_stats,
    ensure_source,
    init_corpus,
    link_science_to_seed,
    rebuild_search_docs,
    store_raw_record,
    upsert_canonical,
)
from brain.dsc_brain.paths import DEFAULT_DB, staging_db_path  # noqa: E402
from brain.dsc_brain.staging import (  # noqa: E402
    connect_staging,
    init_staging,
    resolve_source_family,
)

SOURCE_ID = "cannareviews"
LICENSE = "AU medical / site ToS — license unclear; research corpus only"
BASE = "https://cannareviews.health"
CACHE = DATA / "_cache_cannareviews"
CTX = ssl.create_default_context()

THC_RE = re.compile(
    r"(?i)(?:< ?|\b)THC\b[^0-9%]{0,40}(\d+(?:\.\d+)?)\s*%?"
    r"|(?:<\s*)?(\d+(?:\.\d+)?)\s*%?\s*(?:w/w\s*)?THC"
)
CBD_RE = re.compile(
    r"(?i)(?:< ?|\b)CBD\b[^0-9%]{0,40}(\d+(?:\.\d+)?)\s*%?"
    r"|(?:<\s*)?(\d+(?:\.\d+)?)\s*%?\s*(?:w/w\s*)?CBD"
)
CULTIVAR_RE = re.compile(r"(?i)Cultivar:\s*([^.<\n|]{2,80})")
PRICE_RE = re.compile(r"\$\s*(\d+(?:\.\d{1,2})?)")


class Session:
    def __init__(self, cookie: str | None = None) -> None:
        self.cookie = cookie or ""
        self._jar: dict[str, str] = {}
        if cookie:
            for part in cookie.split(";"):
                part = part.strip()
                if "=" in part:
                    k, v = part.split("=", 1)
                    self._jar[k.strip()] = v.strip()

    def _cookie_header(self) -> str:
        if self.cookie and not self._jar:
            return self.cookie
        return "; ".join(f"{k}={v}" for k, v in self._jar.items())

    def fetch(self, url: str, *, timeout: int = 60, maxb: int | None = None) -> tuple[int, dict, bytes]:
        headers = {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            ),
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-AU,en;q=0.9",
            "Referer": f"{BASE}/",
        }
        ch = self._cookie_header()
        if ch:
            headers["Cookie"] = ch
        req = urllib.request.Request(url, headers=headers)
        try:
            with urllib.request.urlopen(req, timeout=timeout, context=CTX) as resp:
                body = resp.read() if maxb is None else resp.read(maxb)
                # capture Set-Cookie
                sc = resp.headers.get_all("Set-Cookie") if hasattr(resp.headers, "get_all") else None
                if not sc:
                    one = resp.headers.get("Set-Cookie")
                    sc = [one] if one else []
                for c in sc:
                    m = re.match(r"([^=]+)=([^;]*)", c)
                    if m:
                        self._jar[m.group(1)] = m.group(2)
                return getattr(resp, "status", 200), {k.lower(): v for k, v in resp.headers.items()}, body
        except urllib.error.HTTPError as exc:
            body = exc.read() if maxb is None else exc.read(maxb)
            return exc.code, {k.lower(): v for k, v in (exc.headers.items() if exc.headers else [])}, body


def load_sitemap(sess: Session) -> tuple[list[str], list[str]]:
    CACHE.mkdir(parents=True, exist_ok=True)
    path = CACHE / "sitemap_full.xml"
    if not path.exists() or path.stat().st_size < 10000:
        st, _, body = sess.fetch(f"{BASE}/sitemap.xml")
        if st != 200:
            raise RuntimeError(f"sitemap HTTP {st}")
        path.write_bytes(body)
    text = path.read_text(encoding="utf-8", errors="replace")
    locs = re.findall(r"<loc>([^<]+)</loc>", text)
    products = [u for u in locs if "/product/" in u]
    brands = [u for u in locs if "/cannabis-brands-australia/" in u]
    return products, brands


def _json_ld_blocks(text: str) -> list[Any]:
    out = []
    for m in re.finditer(r"<script[^>]*ld\+json[^>]*>(.*?)</script>", text, re.I | re.S):
        raw = htmlmod.unescape(m.group(1).strip())
        raw = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f]", " ", raw)
        try:
            out.append(json.loads(raw))
        except json.JSONDecodeError:
            # try truncate at last brace
            try:
                out.append(json.loads(raw[: raw.rfind("}") + 1]))
            except Exception:
                continue
    return out


def _wire_data(text: str) -> dict[str, Any] | None:
    m = re.search(r'wire:initial-data="([^"]+)"', text)
    if not m:
        return None
    try:
        return json.loads(htmlmod.unescape(m.group(1)))
    except Exception:
        return None


def _float_pair(vals: list[float]) -> list[float] | None:
    if not vals:
        return None
    return [min(vals), max(vals)]


def extract_chem(text: str) -> dict[str, Any]:
    thcs = []
    cbds = []
    for m in THC_RE.finditer(text):
        for g in m.groups():
            if g:
                try:
                    thcs.append(float(g))
                except ValueError:
                    pass
    for m in CBD_RE.finditer(text):
        for g in m.groups():
            if g:
                try:
                    cbds.append(float(g))
                except ValueError:
                    pass
    chem: dict[str, Any] = {}
    if thcs:
        chem["thc_range"] = _float_pair(thcs)
        chem["thc_mentions"] = thcs[:10]
    if cbds:
        chem["cbd_range"] = _float_pair(cbds)
        chem["cbd_mentions"] = cbds[:10]
    cult = CULTIVAR_RE.search(text)
    if cult:
        chem["cultivar"] = htmlmod.unescape(cult.group(1)).strip()
    return chem


def parse_product(url: str, html: str) -> dict[str, Any]:
    slug = url.rstrip("/").split("/")[-1]
    title_m = re.search(r"<title>([^<]+)</title>", html, re.I)
    title = htmlmod.unescape(re.sub(r"\s+", " ", title_m.group(1) if title_m else "")).strip()
    title = re.sub(r"\s*\|\s*Canna Reviews.*$", "", title, flags=re.I).strip()

    item: dict[str, Any] = {
        "source": SOURCE_ID,
        "url": url,
        "slug": slug,
        "country": "AU",
        "market": "AU medical",
    }

    # JSON-LD Product
    name = None
    brand = None
    description = None
    for block in _json_ld_blocks(html):
        nodes = block if isinstance(block, list) else [block]
        if isinstance(block, dict) and "@graph" in block:
            nodes = block["@graph"]
        for node in nodes:
            if not isinstance(node, dict):
                continue
            if node.get("@type") == "Product" or (
                isinstance(node.get("@type"), list) and "Product" in node.get("@type")
            ):
                name = node.get("name") or name
                b = node.get("brand")
                if isinstance(b, dict):
                    brand = b.get("name") or brand
                elif isinstance(b, str):
                    brand = b
                description = node.get("description") or description
                if node.get("offers"):
                    item["offers"] = node["offers"]
                if node.get("aggregateRating"):
                    item["aggregate_rating"] = node["aggregateRating"]
                if node.get("review"):
                    item["jsonld_reviews"] = node["review"]
                item["jsonld"] = node

    # Livewire
    wire = _wire_data(html)
    if wire:
        memo = (wire.get("serverMemo") or {}).get("data") or {}
        meta = (wire.get("serverMemo") or {}).get("dataMeta") or {}
        models = meta.get("models") or {}
        if "product" in models:
            item["product_id"] = models["product"].get("id")
            item["product_relations"] = models["product"].get("relations")
        item["review_count"] = memo.get("reviewCount")
        item["star_rate"] = memo.get("starRate")
        item["prescribed_count"] = memo.get("prescribedCount")
        # star histogram
        hist = {
            k: memo.get(k)
            for k in ("starRate1", "starRate2", "starRate3", "starRate4", "starRate5")
            if memo.get(k) not in (None, 0, "0")
        }
        if hist:
            item["star_histogram"] = hist
        if memo.get("product"):
            item["product_payload"] = memo["product"]
        if memo.get("terpeneReports"):
            item["terpene_reports"] = memo["terpeneReports"]
        if memo.get("distributorInfo"):
            item["distributor_info"] = memo["distributorInfo"]
        if memo.get("mslInfoDetail"):
            item["msl_info"] = memo["mslInfoDetail"]
        # top reported
        for key in (
            "topReportedConditionArray",
            "topReportedEffectArray",
            "topReportedFlavourArray",
        ):
            if memo.get(key):
                item[key] = memo[key]
        item["wire_user_logged_in"] = memo.get("user") is not None

    # HTML chem / prices
    chem = extract_chem(html)
    if chem:
        item["chemistry"] = chem
    prices = [float(x) for x in PRICE_RE.findall(html)]
    # filter noise like lone $
    prices = [p for p in prices if p > 0]
    if prices:
        item["prices_aud"] = prices
        item["price_aud_min"] = min(prices)
        item["price_aud_max"] = max(prices)

    # name / brand fallbacks from title "ANTG Eve CBD16 | 10g Medical Cannabis Flower"
    if not name:
        name = title.split("|")[0].strip() if title else slug
    if not brand and title:
        # often "Brand Name Product" — use first token group before known product words
        m = re.match(r"^([A-Za-z0-9][A-Za-z0-9 &./'\-]{1,40}?)\s+", title)
        # better: slug starts with brand
        parts = slug.split("-")
        if parts:
            brand = parts[0].replace("_", " ")
    item["name"] = str(name or slug).strip()
    item["name_norm"] = name_norm(item["name"])
    if brand:
        item["brand"] = str(brand).strip()
        item["brand_norm"] = name_norm(item["brand"])
    if description:
        item["description"] = htmlmod.unescape(
            re.sub(r"<[^>]+>", " ", str(description))
        )
        item["description"] = re.sub(r"\s+", " ", item["description"]).strip()[:4000]

    # strain/cultivar link target
    cultivar = (item.get("chemistry") or {}).get("cultivar")
    if cultivar:
        item["strain_name"] = cultivar
        item["strain_name_norm"] = name_norm(cultivar)
    else:
        # heuristic: strip brand + pack size from product name
        sn = item["name"]
        if brand and sn.lower().startswith(str(brand).lower()):
            sn = sn[len(brand) :].strip(" -|")
        sn = re.sub(r"\b\d+\s*g\b", "", sn, flags=re.I)
        sn = re.sub(r"\b\d+\s*ml\b", "", sn, flags=re.I)
        sn = re.sub(r"\b(flower|oil|hash|vape|capsule|spray|topical)\b", "", sn, flags=re.I)
        sn = re.sub(r"\s+", " ", sn).strip(" -|")
        if sn and len(sn) > 2:
            item["strain_name"] = sn
            item["strain_name_norm"] = name_norm(sn)

    # login wall?
    item["login_gated"] = bool(
        re.search(r"sign in with medauth|Patients, sign in|login to (?:view|continue)", html, re.I)
    )
    item["fetched_at"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    return item


def parse_brand(url: str, html: str) -> dict[str, Any]:
    slug = url.rstrip("/").split("/")[-1]
    title_m = re.search(r"<title>([^<]+)</title>", html, re.I)
    title = htmlmod.unescape(re.sub(r"\s+", " ", title_m.group(1) if title_m else "")).strip()
    title = re.sub(r"\s*[-|].*Canna Reviews.*$", "", title, flags=re.I).strip()
    name = re.sub(r"\s*Product List and Brand Profile.*$", "", title, flags=re.I).strip()
    name = re.sub(r"\s*-?\s*Supplier of Medical Cannabis.*$", "", name, flags=re.I).strip() or slug
    desc_m = re.search(r'name="description"\s+content="([^"]+)"', html, re.I)
    product_hrefs = sorted(set(re.findall(r"/product/[a-z0-9\-]+", html)))
    item = {
        "source": SOURCE_ID,
        "url": url,
        "slug": slug,
        "name": name,
        "name_norm": name_norm(name),
        "description": htmlmod.unescape(desc_m.group(1)) if desc_m else None,
        "product_hrefs": product_hrefs,
        "product_href_count": len(product_hrefs),
        "country": "AU",
        "fetched_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }
    wire = _wire_data(html)
    if wire:
        memo = (wire.get("serverMemo") or {}).get("data") or {}
        if memo:
            item["wire_data_keys"] = list(memo.keys())
            # keep non-empty interesting fields
            for k, v in memo.items():
                if v not in (None, "", [], {}, 0) and k not in ("user",):
                    if isinstance(v, (dict, list)) and len(json.dumps(v)) > 50000:
                        continue
                    item[f"wire_{k}"] = v
    return item


def parse_pharmacies(html: str) -> list[dict[str, Any]]:
    items: list[dict[str, Any]] = []
    # pharmacy cards / links
    for m in re.finditer(
        r'href="(https://cannareviews\.health/[^"]*pharmac[^"]*)"|'
        r'href="(/[^"]*dispensar[^"]*)"',
        html,
        re.I,
    ):
        pass
    # text blocks with state abbreviations
    # Fall back: extract visible pharmacy-like headings
    names = re.findall(
        r"<h[23][^>]*>([^<]{3,120})</h[23]>",
        html,
        re.I,
    )
    for n in names:
        n = htmlmod.unescape(re.sub(r"\s+", " ", n)).strip()
        if not n or "dispensar" in n.lower() and len(n) < 40 and "Australia" in n:
            continue
        if any(x in n.lower() for x in ("sign in", "canna review", "faq", "about")):
            continue
        items.append(
            {
                "source": SOURCE_ID,
                "name": n,
                "name_norm": name_norm(n),
                "entity": "pharmacy",
            }
        )
    # also li items
    for m in re.finditer(r"<li[^>]*>\s*<[^>]+>([^<]{3,100})</", html):
        n = htmlmod.unescape(m.group(1)).strip()
        if re.search(r"pharmacy|dispensar|chemist", n, re.I):
            items.append(
                {
                    "source": SOURCE_ID,
                    "name": n,
                    "name_norm": name_norm(n),
                    "entity": "pharmacy",
                }
            )
    # dedupe
    seen = set()
    out = []
    for it in items:
        k = it["name_norm"]
        if not k or k in seen:
            continue
        seen.add(k)
        out.append(it)
    return out


def fetch_one(
    sess: Session,
    url: str,
    kind: str,
    *,
    retries: int = 4,
) -> dict[str, Any] | None:
    last_err = None
    for attempt in range(retries):
        try:
            st, _, body = sess.fetch(url, timeout=90)
        except Exception as exc:  # noqa: BLE001
            last_err = f"{type(exc).__name__}: {exc}"
            time.sleep(1.5 * (attempt + 1))
            continue
        if st in (429, 503, 502, 500):
            last_err = f"HTTP {st}"
            time.sleep(2.0 * (attempt + 1))
            continue
        if st != 200:
            return {"_error": f"HTTP {st}", "url": url, "kind": kind}
        html = body.decode("utf-8", "replace")
        # soft block / challenge pages
        if re.search(r"(?i)just a moment|cf-browser-verification|attention required", html):
            last_err = "challenge_page"
            time.sleep(3.0 * (attempt + 1))
            continue
        if kind == "product":
            return parse_product(url, html)
        if kind == "brand":
            return parse_brand(url, html)
        return None
    return {"_error": last_err or "retries_exhausted", "url": url, "kind": kind}

def try_export(sess: Session) -> dict[str, Any]:
    """Attempt export; record if honeypot or real file."""
    report: dict[str, Any] = {"attempts": []}
    for url in (
        f"{BASE}/api/v5.2.1/products/export",
        f"{BASE}/api/v5.2.1/products/bulk",
        f"{BASE}/api/v5.2.1/data/download",
        f"{BASE}/download/product-catalog.csv",
    ):
        st, _, body = sess.fetch(url, maxb=8000)
        entry: dict[str, Any] = {"url": url, "status": st}
        try:
            j = json.loads(body)
            entry["json"] = j
            job = j.get("job_id")
            if job:
                # poll a few times
                for i in range(8):
                    time.sleep(4)
                    st2, _, body2 = sess.fetch(f"{BASE}/api/v5.2.1/downloads/{job}", maxb=None)
                    if st2 == 200 and body2[:1] in (b"{", b"[") and len(body2) < 500:
                        try:
                            jj = json.loads(body2)
                            if jj.get("status") in ("processing", "queued"):
                                entry.setdefault("progress", []).append(jj)
                                continue
                        except Exception:
                            pass
                    if st2 == 200 and not body2.lstrip().startswith(b"<!DOCTYPE") and len(body2) > 500:
                        path = CACHE / f"export_{job[:8]}.bin"
                        path.write_bytes(body2)
                        entry["saved"] = str(path)
                        entry["bytes"] = len(body2)
                        break
                    entry.setdefault("progress", []).append({"status": st2, "len": len(body2)})
        except Exception as exc:  # noqa: BLE001
            entry["error"] = str(exc)
            entry["head"] = body[:200].decode("utf-8", "replace")
        report["attempts"].append(entry)
    return report


def ingest_product(conn, item: dict[str, Any]) -> str | None:
    if item.get("_error"):
        return None
    name = item.get("strain_name") or item.get("name") or ""
    if not name:
        return None
    chem = dict(item.get("chemistry") or {})
    payload = {
        **item,
        "thc_range": chem.get("thc_range"),
        "cbd_range": chem.get("cbd_range"),
        "top_terpenes": item.get("terpene_reports") or chem.get("top_terpenes"),
        "product": {
            "name": item.get("name"),
            "brand": item.get("brand"),
            "slug": item.get("slug"),
            "url": item.get("url"),
            "prices_aud": item.get("prices_aud"),
            "price_aud_min": item.get("price_aud_min"),
            "price_aud_max": item.get("price_aud_max"),
            "review_count": item.get("review_count"),
            "star_rate": item.get("star_rate"),
            "product_id": item.get("product_id"),
            "market": "AU medical",
        },
    }
    # flatten chem into payload for add_chemistry
    if chem.get("thc_range"):
        payload["thc_range"] = chem["thc_range"]
    if chem.get("cbd_range"):
        payload["cbd_range"] = chem["cbd_range"]
    cid = add_chemistry(conn, name, payload, source_id=SOURCE_ID)
    key = name_norm(name)
    if key:
        upsert_canonical(conn, name)
        add_link(conn, "chemistry_profile", cid, "strain_canonical", key, source=SOURCE_ID)
    store_raw_record(
        conn,
        source_id=SOURCE_ID,
        entity_kind="product",
        entity_id=cid,
        name=item.get("name") or name,
        payload=item,
    )
    return cid


def merge_to_master() -> dict[str, Any]:
    sys.path.insert(0, str(ROOT / "scripts"))
    import merge_staging_to_master as msm  # noqa: E402

    family = resolve_source_family(SOURCE_ID)
    stg_path = staging_db_path(family)
    init_corpus(DEFAULT_DB)
    master = connect(DEFAULT_DB)
    master.execute("PRAGMA busy_timeout=180000")
    before = corpus_stats(master)
    st = msm.merge_one(master, stg_path, include_raw=False)
    master.commit()
    links = link_science_to_seed(master)
    docs = rebuild_search_docs(master)
    master.commit()
    after = corpus_stats(master)
    delta = {k: after.get(k, 0) - before.get(k, 0) for k in sorted(set(before) | set(after))}
    master.close()
    return {"merge": st, "links": links, "search_docs": docs, "delta": delta}


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument(
        "--from-list",
        action="store_true",
        default=True,
        help="Parse legal product list HTML (default; best AUD price coverage)",
    )
    ap.add_argument("--no-from-list", action="store_true")
    ap.add_argument("--scrape-pdps", action="store_true", help="Also scrape /product/* pages")
    ap.add_argument("--refresh-list", action="store_true", help="Re-download product list HTML")
    ap.add_argument("--cookie", type=str, default=None, help="Cookie header from logged-in browser")
    ap.add_argument("--cookie-file", type=Path, default=None)
    ap.add_argument("--max-products", type=int, default=None)
    ap.add_argument("--max-brands", type=int, default=None)
    ap.add_argument("--workers", type=int, default=2)
    ap.add_argument("--delay", type=float, default=0.6)
    ap.add_argument("--resume", action="store_true", help="Keep existing staging/dumps and skip URLs already fetched")
    ap.add_argument("--cooldown", type=float, default=0.0, help="Sleep before starting (rate-limit recovery)")
    ap.add_argument("--skip-export-probe", action="store_true")
    ap.add_argument("--merge", action="store_true")
    ap.add_argument("--reset-staging", action="store_true", default=True)
    ap.add_argument("--no-reset-staging", action="store_true")
    args = ap.parse_args()

    # Default high-value path: legal product list table
    if not args.no_from_list:
        if args.refresh_list or not (CACHE / "product_list_full.html").exists():
            print("Refreshing product list HTML...")
            import subprocess

            subprocess.check_call([sys.executable, "-u", str(ROOT / "scripts" / "_scrape_cannareviews_lists.py")])
        import subprocess

        rc = subprocess.call([sys.executable, "-u", str(ROOT / "scripts" / "_parse_cannareviews_list.py")])
        if rc != 0:
            return rc
        if not args.scrape_pdps and not args.merge:
            return 0
        # continue into PDP scrape / merge below if requested
        args.resume = True
        args.no_reset_staging = True
        args.skip_export_probe = True

    if not args.scrape_pdps and args.merge:
        import subprocess

        return subprocess.call(
            [
                sys.executable,
                "-u",
                str(ROOT / "scripts" / "merge_staging_to_master.py"),
                "--only",
                "cannareviews",
            ]
        )

    if not args.scrape_pdps:
        return 0

    cookie = args.cookie
    if args.cookie_file and args.cookie_file.exists():
        cookie = args.cookie_file.read_text(encoding="utf-8").strip()

    sess = Session(cookie)
    CACHE.mkdir(parents=True, exist_ok=True)

    export_report = {}
    if not args.skip_export_probe:
        print("Probing export endpoints (often honeypot)...")
        export_report = try_export(sess)
        (CACHE / "export_probe.json").write_text(json.dumps(export_report, indent=2), encoding="utf-8")

    products_urls, brand_urls = load_sitemap(sess)
    print(f"sitemap products={len(products_urls)} brands={len(brand_urls)}")
    if args.max_products:
        products_urls = products_urls[: args.max_products]
    if args.max_brands:
        brand_urls = brand_urls[: args.max_brands]

    family = resolve_source_family(SOURCE_ID)
    stg_path = staging_db_path(family)
    reset = args.reset_staging and not args.no_reset_staging and not args.resume
    if reset and stg_path.exists():
        print(f"Reset staging {stg_path}")
        stg_path.unlink()
    init_staging(
        SOURCE_ID,
        note="AU medical CannaReviews scrape; full raw_record; redistributable=false",
    )
    conn = connect_staging(SOURCE_ID)
    ensure_source(
        conn,
        SOURCE_ID,
        "CannaReviews AU medical (cannareviews.health)",
        url=BASE,
        license=LICENSE,
        redistributable=False,
        note="AU medical patient community; products/brands/reviews/prices; license unclear",
    )
    conn.commit()

    # Resume: skip already-fetched product URLs from dump or staging
    already: set[str] = set()
    products: list[dict[str, Any]] = []
    reviews_agg: list[dict[str, Any]] = []
    brands: list[dict[str, Any]] = []
    if args.resume:
        dump_p = DATA / "dsc_products_cannareviews.json"
        if dump_p.exists():
            try:
                prev = json.loads(dump_p.read_text(encoding="utf-8"))
                for it in prev.get("items") or []:
                    if it.get("url") and not it.get("_error"):
                        already.add(it["url"])
                        products.append(it)
                print(f"resume loaded products={len(products)}")
            except Exception as exc:  # noqa: BLE001
                print("resume product dump load failed", exc)
        dump_b = DATA / "dsc_brands_cannareviews.json"
        if dump_b.exists():
            try:
                prev = json.loads(dump_b.read_text(encoding="utf-8"))
                for it in prev.get("items") or []:
                    if it.get("url") and not it.get("_error"):
                        already.add(it["url"])
                        brands.append(it)
                print(f"resume loaded brands={len(brands)}")
            except Exception as exc:  # noqa: BLE001
                print("resume brand dump load failed", exc)
        dump_r = DATA / "dsc_reviews_cannareviews.json"
        if dump_r.exists():
            try:
                prev = json.loads(dump_r.read_text(encoding="utf-8"))
                reviews_agg = list(prev.get("items") or [])
            except Exception:
                pass

    if args.cooldown > 0:
        print(f"cooldown {args.cooldown}s for rate-limit recovery...")
        time.sleep(args.cooldown)

    products_urls = [u for u in products_urls if u not in already]
    brand_urls = [u for u in brand_urls if u not in already]
    print(f"remaining products={len(products_urls)} brands={len(brand_urls)} already={len(already)}")

    errors = 0
    error_samples: list[dict[str, Any]] = []

    def do_product(url: str) -> dict[str, Any] | None:
        time.sleep(args.delay)
        return fetch_one(Session(cookie), url, "product")

    print(f"Fetching {len(products_urls)} products with {args.workers} workers...")
    with ThreadPoolExecutor(max_workers=max(1, args.workers)) as ex:
        futs = {ex.submit(do_product, u): u for u in products_urls}
        done = 0
        for fut in as_completed(futs):
            done += 1
            try:
                item = fut.result()
            except Exception as exc:  # noqa: BLE001
                errors += 1
                if len(error_samples) < 20:
                    error_samples.append({"url": futs[fut], "error": repr(exc)})
                continue
            if not item or item.get("_error"):
                errors += 1
                if len(error_samples) < 20:
                    error_samples.append(item or {"url": futs[fut], "_error": "empty"})
                # back off harder on rate limits
                if item and "429" in str(item.get("_error")):
                    time.sleep(5)
                if done % 50 == 0:
                    print(f"  products {done}/{len(products_urls)} ok={len(products)} errors={errors}")
                continue
            products.append(item)
            try:
                ingest_product(conn, item)
            except Exception as exc:  # noqa: BLE001
                errors += 1
                if len(error_samples) < 20:
                    error_samples.append({"url": item.get("url"), "ingest_error": repr(exc)})
                continue
            if item.get("review_count") or item.get("star_rate"):
                rev = {
                    "source": SOURCE_ID,
                    "entity": "review_aggregate",
                    "product_url": item.get("url"),
                    "product_name": item.get("name"),
                    "product_id": item.get("product_id"),
                    "review_count": item.get("review_count"),
                    "star_rate": item.get("star_rate"),
                    "star_histogram": item.get("star_histogram"),
                    "jsonld_reviews": item.get("jsonld_reviews"),
                    "login_gated": item.get("login_gated"),
                }
                reviews_agg.append(rev)
                store_raw_record(
                    conn,
                    source_id=SOURCE_ID,
                    entity_kind="review_aggregate",
                    name=item.get("name"),
                    payload=rev,
                )
            if done % 50 == 0:
                conn.commit()
                # checkpoint dumps periodically
                write_dump(
                    DATA / "dsc_products_cannareviews.json",
                    "products",
                    products,
                    source=SOURCE_ID,
                    source_url=BASE,
                    license=LICENSE,
                    redistributable=False,
                    note="checkpoint",
                    truncated=True,
                )
                print(f"  products {done}/{len(products_urls)} ok={len(products)} errors={errors}")
    conn.commit()
    print(f"product phase done ok={len(products)} errors={errors}")
    if error_samples:
        (CACHE / "fetch_errors_sample.json").write_text(
            json.dumps(error_samples, indent=2, default=str), encoding="utf-8"
        )
        print("error samples:", error_samples[:3])
    print(f"Fetching {len(brand_urls)} brands...")
    with ThreadPoolExecutor(max_workers=max(1, args.workers)) as ex:
        futs = {
            ex.submit(lambda u: (time.sleep(args.delay), fetch_one(Session(cookie), u, "brand"))[1], u): u
            for u in brand_urls
        }
        for i, fut in enumerate(as_completed(futs), 1):
            item = fut.result()
            if not item or item.get("_error"):
                errors += 1
                continue
            brands.append(item)
            store_raw_record(
                conn,
                source_id=SOURCE_ID,
                entity_kind="brand",
                name=item.get("name"),
                payload=item,
            )
            if i % 25 == 0:
                conn.commit()
                print(f"  brands {i}/{len(brand_urls)} ok={len(brands)}")
    conn.commit()
    print(f"brand phase done ok={len(brands)}")
    # pharmacies
    pharmacies: list[dict[str, Any]] = []
    st, _, body = sess.fetch(f"{BASE}/cannabis-dispensary-pharmacies")
    if st == 200:
        pharmacies = parse_pharmacies(body.decode("utf-8", "replace"))
        for ph in pharmacies:
            store_raw_record(
                conn,
                source_id=SOURCE_ID,
                entity_kind="pharmacy",
                name=ph.get("name"),
                payload=ph,
            )
        print(f"pharmacies parsed={len(pharmacies)}")
    conn.commit()

    # dumps
    write_dump(
        DATA / "dsc_products_cannareviews.json",
        "products",
        products,
        source=SOURCE_ID,
        source_url=BASE,
        license=LICENSE,
        redistributable=False,
        note="AU medical products from cannareviews.health sitemap scrape",
        errors=errors,
        export_probe=export_report,
    )
    write_dump(
        DATA / "dsc_reviews_cannareviews.json",
        "reviews",
        reviews_agg,
        source=SOURCE_ID,
        source_url=BASE,
        license=LICENSE,
        redistributable=False,
        note="Review aggregates from product pages; full review text needs medauth session",
    )
    write_dump(
        DATA / "dsc_brands_cannareviews.json",
        "brands",
        brands,
        source=SOURCE_ID,
        source_url=BASE,
        license=LICENSE,
        redistributable=False,
        note="AU brand pages from sitemap",
    )
    if pharmacies:
        write_dump(
            DATA / "dsc_pharmacies_cannareviews.json",
            "pharmacies",
            pharmacies,
            source=SOURCE_ID,
            source_url=f"{BASE}/cannabis-dispensary-pharmacies",
            license=LICENSE,
            redistributable=False,
        )

    price_n = sum(1 for p in products if p.get("prices_aud"))
    chem_n = sum(1 for p in products if p.get("chemistry"))
    review_n = sum(1 for p in products if (p.get("review_count") or 0))
    logged_in_n = sum(1 for p in products if p.get("wire_user_logged_in"))

    summary = {
        "products": len(products),
        "brands": len(brands),
        "review_aggregates": len(reviews_agg),
        "pharmacies": len(pharmacies),
        "products_with_prices_aud": price_n,
        "products_with_chemistry": chem_n,
        "products_with_review_count": review_n,
        "products_logged_in_wire": logged_in_n,
        "errors": errors,
        "staging": str(stg_path),
        "staging_stats": corpus_stats(conn),
        "export_probe": export_report,
    }
    conn.close()

    if args.merge:
        summary["master"] = merge_to_master()

    (DATA / "dsc_cannareviews_report.json").write_text(
        json.dumps(summary, indent=2, default=str), encoding="utf-8"
    )
    print(json.dumps(summary, indent=2, default=str))
    if not cookie and price_n == 0:
        print(
            "\nNOTE: No AUD prices captured — product payloads are login-gated (medauth). "
            "Re-run with --cookie '...' from a logged-in browser session for full prices/reviews."
        )
        print(f"Login URL: {BASE}/login  (or {BASE}/auth/medauth/redirect)")
    return 0 if products else 1


if __name__ == "__main__":
    raise SystemExit(main())
