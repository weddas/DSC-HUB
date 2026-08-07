#!/usr/bin/env python3
"""Scrape Alchimia Grow Shop seed catalog (research corpus).

Discovery [FOLLOWUPS]: list-page regex `slug-\\d+.html` is wrong.
SoT: https://www.alchimiaweb.com/en/sitemap-products.xml
PDP:  https://www.alchimiaweb.com/en/{slug}-product-{N}.php

Full catalog sitemap mixes seeds + growshop/nutrients/headshop.
Keep JSON-LD category == "Cannabis seeds" only.

Checkpoint/resume, polite delay, redistributable=false.
Dump:    homeassistant/data/dsc_strains_alchimia.json
Staging: brain/data/staging/alchimia.sqlite3 (FULL raw_record)
"""

from __future__ import annotations

import argparse
import html as html_lib
import json
import re
import ssl
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(ROOT))

from catalog_common import DATA, name_norm, parse_grow_fields, write_dump  # noqa: E402
from catalog_fetch import Checkpoint  # noqa: E402

SITEMAP_URL = "https://www.alchimiaweb.com/en/sitemap-products.xml"
SOURCE = "alchimia"
SOURCE_URL = "https://www.alchimiaweb.com/en/"
NOTE = (
    "research scrape Alchimia en/sitemap-products.xml → *-product-N.php; "
    "Cannabis seeds only; redistributable=false until legal review"
)
OUT = DATA / "dsc_strains_alchimia.json"
CK_PATH = DATA / "dsc_strains_alchimia.checkpoint.json"
SITEMAP_CACHE = DATA / "dsc_strains_alchimia.sitemap_urls.json"
STAGING_FAMILY = "alchimia"

# Explicitly NOT slug-\d+.html (legacy wrong pattern in scrape_seed_banks.py).
PDP_RE = re.compile(
    r"^https://www\.alchimiaweb\.com/en/([a-z0-9\-]+)-product-(\d+)\.php$",
    re.I,
)
SEED_CATEGORIES = {"cannabis seeds"}

# Prefetch skip: obvious non-seed catalog slugs (token-bounded; avoid bare 'duct'/'hat').
MERCH_SLUG_SKIP = re.compile(
    r"(?:^|-)(?:"
    r"fertiliz|nutrient|hesi|cannazym|cannaboost|biobizz|advanced-nutrients|"
    r"trikologic|bloom-complex|tnt-growth|pro-bloom|bio-bloom|"
    r"tent|growbox|grow-box|growtent|cabinet|chamber|dark-box|grolab|"
    r"muffler|extractor|carbon-filter|inline-fan|ducting|odour|odor|"
    r"lamp|ballast|reflector|hps|cmh|lumatek|quantum|led-panel|led-bar|"
    r"bong|grinder|pipe|vapou?r|atomis|atomiz|ashtray|rolling-paper|"
    r"trichoderma|mycorrhiza|humic|perlite|coco-substrate|rockwool|"
    r"bubbleator|ice-o-lator|graspresso|extraction-bag|zipper-bag|"
    r"truffles|mushroom|mycelium|golden-teacher|spore|"
    r"popcorn|cbd-flower|cbd-oil|cbd-crystal|hash-oil|"
    r"scissors|trimmer|microscope|loupe|ph-meter|ec-meter|thermometer|"
    r"hygrometer|watering|pump|timer|gloves|jar-set|vacuum|"
    r"substrate|soil-mix|potting|net-pot|clay-pebble|"
    r"complete-mix|starter-kit|basic-kit"
    r")(?:-|$)",
    re.I,
)

BROWSER_UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)
CTX = ssl.create_default_context()
_FETCH_LOCK = __import__("threading").Lock()
_LAST_FETCH = 0.0


def clean(html: str) -> str:
    t = re.sub(r"(?is)<script.*?</script>", " ", html or "")
    t = re.sub(r"(?is)<style.*?</style>", " ", t)
    t = re.sub(r"(?is)<[^>]+>", " ", t)
    return re.sub(r"\s+", " ", html_lib.unescape(t)).strip()


def is_bot_wall(html: str) -> bool:
    low = (html or "").lower()
    markers = (
        "verifying you're human",
        "cf-browser-verification",
        "attention required | cloudflare",
        "just a moment...",
        "enable javascript and cookies to continue",
        "access denied",
        "captcha-delivery.com",
    )
    if any(m in low for m in markers):
        return True
    if len(low) < 1500 and ("cloudflare" in low and "challenge" in low):
        return True
    return False


def http_get(url: str, *, timeout: int = 90) -> str:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": BROWSER_UA,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Referer": SOURCE_URL,
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout, context=CTX) as resp:
            return resp.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as exc:
        raw = exc.read().decode("utf-8", "replace") if exc.fp else ""
        raise RuntimeError(f"HTTP {exc.code} for {url}: {raw[:160]}") from exc


def polite_get(url: str, *, delay: float, timeout: int = 90) -> str:
    """Global rate limit so concurrent workers stay polite."""
    global _LAST_FETCH
    with _FETCH_LOCK:
        now = time.time()
        wait = delay - (now - _LAST_FETCH)
        if wait > 0:
            time.sleep(wait)
        _LAST_FETCH = time.time()
    return http_get(url, timeout=timeout)


def slug_from_url(url: str) -> str:
    m = PDP_RE.match(url.split("?")[0].split("#")[0])
    return m.group(1) if m else ""


def is_obvious_merch_slug(url: str) -> bool:
    return bool(MERCH_SLUG_SKIP.search(slug_from_url(url)))


def extract_json_ld(html: str) -> list[dict]:
    out: list[dict] = []
    for m in re.finditer(
        r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
        html or "",
        re.I | re.S,
    ):
        raw = m.group(1).strip()
        if not raw:
            continue
        try:
            doc = json.loads(raw)
        except json.JSONDecodeError:
            continue
        if isinstance(doc, list):
            out.extend(x for x in doc if isinstance(x, dict))
        elif isinstance(doc, dict):
            if "@graph" in doc and isinstance(doc["@graph"], list):
                out.extend(x for x in doc["@graph"] if isinstance(x, dict))
            out.append(doc)
    return out


def _uniq(seq: list[str]) -> list[str]:
    seen: set[str] = set()
    out: list[str] = []
    for x in seq:
        k = (x or "").strip()
        if not k:
            continue
        lk = k.lower()
        if lk in seen:
            continue
        seen.add(lk)
        out.append(k)
    return out


def _meta(html: str, prop: str) -> str | None:
    m = re.search(
        rf'<meta[^>]+(?:property|name)=["\']{re.escape(prop)}["\'][^>]+content=["\']([^"\']*)["\']',
        html or "",
        re.I,
    )
    if not m:
        m = re.search(
            rf'<meta[^>]+content=["\']([^"\']*)["\'][^>]+(?:property|name)=["\']{re.escape(prop)}["\']',
            html or "",
            re.I,
        )
    return html_lib.unescape(m.group(1)).strip() if m else None


def _pct_pair(s: str) -> list[float] | None:
    m = re.search(r"(\d+(?:\.\d+)?)\s*[-–/to]+\s*(\d+(?:\.\d+)?)\s*%?", s)
    if m:
        return [float(m.group(1)), float(m.group(2))]
    m = re.search(r"(\d+(?:\.\d+)?)\s*%", s)
    if m:
        v = float(m.group(1))
        return [v, v]
    return None


def _weeks_to_days(s: str) -> int | list[int] | None:
    m = re.search(r"(\d+)\s*[-–]\s*(\d+)\s*weeks?", s, re.I)
    if m:
        return [int(m.group(1)) * 7, int(m.group(2)) * 7]
    # "Fast (-9 weeks)" / "Medium (9-10 weeks)"
    m = re.search(r"\((-?\d+)\s*weeks?\)", s, re.I)
    if m:
        w = abs(int(m.group(1)))
        return w * 7
    m = re.search(r"(\d+)\s*weeks?", s, re.I)
    if m:
        return int(m.group(1)) * 7
    m = re.search(r"(\d+)\s*[-–]\s*(\d+)\s*days?", s, re.I)
    if m:
        return [int(m.group(1)), int(m.group(2))]
    m = re.search(r"(\d+)\s*days?", s, re.I)
    if m:
        return int(m.group(1))
    return None


def parse_caracteristiques(html: str) -> dict[str, str]:
    specs: dict[str, str] = {}
    m = re.search(
        r'<table[^>]*class=["\'][^"\']*caracteristiques[^"\']*["\'][^>]*>(.*?)</table>',
        html or "",
        re.I | re.S,
    )
    block = m.group(1) if m else (html or "")
    for row in re.findall(r"<tr[^>]*>(.*?)</tr>", block, re.I | re.S):
        cells = [clean(c) for c in re.findall(r"<t[hd][^>]*>(.*?)</t[hd]>", row, re.I | re.S)]
        if len(cells) < 2:
            continue
        key, val = cells[0], cells[1]
        if not key or not val or len(key) > 80:
            continue
        if val.lower() in {"check", "yes", "✓", "✔"}:
            val = "yes"
        specs[key] = val
    return specs


def strain_name_from_product(name: str) -> str:
    n = (name or "").strip()
    n = re.sub(
        r"\s+(?:Feminized|Feminised|Regular|Autoflower(?:ing)?|Auto|CBD|"
        r"Fast\s*Version|Photoperiod)\s*$",
        "",
        n,
        flags=re.I,
    )
    n = re.sub(r"\s+Seeds?\s*$", "", n, flags=re.I)
    n = re.sub(r"\s+by\s+.+$", "", n, flags=re.I)
    return n.strip() or (name or "").strip()


def apply_specs(row: dict, specs: dict[str, str]) -> None:
    if not specs:
        return
    row["bank_specs"] = specs
    low = {k.lower(): v for k, v in specs.items()}

    def pick(*names: str) -> str | None:
        for n in names:
            if n in low and low[n].strip():
                return low[n].strip()
        return None

    bank = pick("seed bank", "breeder", "bank")
    if bank and bank.lower() not in {"yes", "check"}:
        row["breeder"] = bank
        row["seed_bank_label"] = bank

    genetics = pick("genetics", "genetic", "parents", "cross")
    if genetics:
        row["genetics"] = genetics
        row["lineage"] = genetics

    thc = pick("thc content", "thc", "thc %", "thc level")
    if thc:
        pair = _pct_pair(thc)
        if pair:
            row["thc_range"] = pair
            row.setdefault("chemistry", {})["thc_range"] = pair
            if pair[0] == pair[1]:
                row["thc"] = pair[0]
                row["chemistry"]["thc"] = pair[0]
        row["thc_label"] = thc

    cbd = pick("cbd content", "cbd", "cbd %", "cbd level")
    if cbd:
        pair = _pct_pair(cbd)
        if pair:
            row["cbd_range"] = pair
            row.setdefault("chemistry", {})["cbd_range"] = pair
            if pair[0] == pair[1]:
                row["cbd"] = pair[0]
                row["chemistry"]["cbd"] = pair[0]
        row["cbd_label"] = cbd

    geno = pick("indica/sativa genotype", "genotype", "type", "strain type")
    if geno:
        row["type"] = geno
        row["type_label"] = geno
        m = re.search(r"(\d+)\s*%?\s*indica", geno, re.I)
        if m:
            row["indica_pct"] = int(m.group(1))
        m = re.search(r"(\d+)\s*%?\s*sativa", geno, re.I)
        if m:
            row["sativa_pct"] = int(m.group(1))
        if re.search(r"indica\s*\+\s*60", geno, re.I):
            row["type_hint"] = "indica"
        elif re.search(r"sativa\s*\+\s*60", geno, re.I):
            row["type_hint"] = "sativa"

    flavor = pick("flavor", "flavour", "taste", "aroma")
    if flavor:
        parts = _uniq([p.strip() for p in re.split(r"[,;/]", flavor) if p.strip()])
        if parts:
            row["flavors"] = parts
            row["aromas"] = parts
            row["top_flavors"] = parts[:8]

    effect = pick("effect", "effects")
    if effect:
        parts = _uniq([p.strip() for p in re.split(r"[,;/]", effect) if p.strip()])
        if parts:
            row["effects"] = parts
            row["top_effects"] = parts[:8]

    flower = pick("indoor flowering", "flowering", "flowering time", "flower time")
    if flower:
        row["flowering_time"] = flower
        days = _weeks_to_days(flower)
        if days is not None:
            row["flowering_days"] = days

    harvest = pick("outdoor harvest", "harvest", "harvest time")
    if harvest:
        row["harvest_time"] = harvest

    yi = pick("indoor yield", "yield indoor")
    if yi:
        row["yield_indoor"] = yi
    yo = pick("outdoor yield", "yield outdoor")
    if yo:
        row["yield_outdoor"] = yo

    # seed sex / photoperiod from checkbox-style rows
    for k, v in low.items():
        if v.lower() not in {"yes", "check"}:
            continue
        if "feminiz" in k or "feminis" in k:
            row["seed_type"] = "feminized"
            row["sex"] = "feminized"
        elif "autoflower" in k or k.startswith("auto "):
            row["seed_type"] = "autoflower"
            row["photoperiod"] = False
        elif "regular" in k:
            row["seed_type"] = "regular"
            row["sex"] = "regular"


def is_seed_product(product: dict, specs: dict[str, str], html: str) -> bool:
    cat = str(product.get("category") or "").strip().lower()
    if cat in SEED_CATEGORIES:
        return True
    if any(k.lower() in {"seed bank", "feminized seeds", "regular seeds", "autoflowering seeds", "autoflower seeds"} for k in specs):
        return True
    # breadcrumb fallback
    if re.search(r'itemprop=["\']name["\'][^>]*>\s*Cannabis seeds\s*<', html or "", re.I):
        return True
    return False


def parse_pdp(html: str, url: str) -> dict | None:
    """Return strain row for Cannabis seeds PDPs; None for non-seed catalog items."""
    blocks = extract_json_ld(html)
    product = next((b for b in blocks if "Product" in str(b.get("@type"))), {})
    specs = parse_caracteristiques(html)
    if not is_seed_product(product, specs, html):
        return None

    name = str(product.get("name") or "").strip()
    if not name:
        alt = str(product.get("alternateName") or "").strip()
        name = re.sub(r"\s+by\s+.+$", "", alt, flags=re.I).strip() if alt else ""
    if not name:
        m = re.search(r"<h1[^>]*>(.*?)</h1>", html or "", re.I | re.S)
        name = clean(m.group(1)) if m else ""
        name = re.sub(r"\s+by\s+.+$", "", name, flags=re.I).strip()
    if not name:
        name = _meta(html, "og:title") or ""
        name = re.sub(r"\s*\|\s*.*$", "", name).strip()
        name = re.sub(r"^(?:Online sale of|Sale of)\s+", "", name, flags=re.I)
        name = re.sub(r"\s+seeds?\s+from\s+.+$", "", name, flags=re.I).strip()

    m = PDP_RE.match(url.split("?")[0].split("#")[0])
    slug = m.group(1) if m else unquote(urlparse(url).path.rsplit("/", 1)[-1])
    product_id = m.group(2) if m else None

    brand = product.get("brand")
    breeder = None
    if isinstance(brand, dict):
        breeder = str(brand.get("name") or "").strip() or None
    elif isinstance(brand, str):
        breeder = brand.strip() or None
    if not breeder:
        alt = str(product.get("alternateName") or "")
        bm = re.search(r"\s+by\s+(.+)$", alt, re.I)
        if bm:
            breeder = bm.group(1).strip()

    desc = str(product.get("description") or "").strip()
    desc = html_lib.unescape(desc)
    if not desc:
        m = re.search(
            r'itemprop=["\']description["\'][^>]*>(.*?)</div>',
            html or "",
            re.I | re.S,
        )
        if m:
            desc = clean(m.group(1))
    if not desc:
        desc = _meta(html, "og:description") or ""

    image = product.get("image")
    if isinstance(image, list):
        image = image[0] if image else None
    if isinstance(image, dict):
        image = image.get("url")
    if not image:
        image = _meta(html, "og:image")

    offers = product.get("offers") or []
    if isinstance(offers, dict):
        offers = [offers]
    pack_offers = []
    for off in offers:
        if not isinstance(off, dict):
            continue
        pack_offers.append(
            {
                "sku": off.get("sku"),
                "name": off.get("name"),
                "price": off.get("price"),
                "currency": off.get("priceCurrency"),
                "availability": off.get("availability"),
            }
        )

    strain = strain_name_from_product(name)
    text = clean(html)
    row: dict = {
        "name": strain[:200],
        "name_norm": name_norm(strain),
        "product_name": name[:240],
        "breeder": breeder,
        "seed_bank": "Alchimia Grow Shop",
        "url": url.split("?")[0].split("#")[0],
        "source": SOURCE,
        "slug": slug,
        "product_id": product_id,
        "category": str(product.get("category") or "Cannabis seeds"),
        "description": (desc or "")[:5000] or None,
        "image_url": image,
        "offers": pack_offers or None,
    }

    # seed type from name/slug
    blob = f"{name} {slug}".lower()
    if "autoflower" in blob or re.search(r"(?:^|-)auto(?:-|$)", slug, re.I):
        row.setdefault("seed_type", "autoflower")
        row["photoperiod"] = False
    elif "feminis" in blob:
        row.setdefault("seed_type", "feminized")
        row["sex"] = "feminized"
    elif "regular" in blob:
        row.setdefault("seed_type", "regular")
        row["sex"] = "regular"

    apply_specs(row, specs)

    # tags (seed-related only)
    tags = []
    for href, label in re.findall(
        r'href=["\'](https://www\.alchimiaweb\.com/en/[^"\']+-tag-\d+/?)["\'][^>]*>([^<]+)',
        html or "",
        re.I,
    ):
        lab = clean(label)
        if not lab:
            continue
        low = lab.lower()
        if any(
            x in low
            for x in (
                "fertilis",
                "fertiliz",
                "mushroom",
                "growth",
                "mineral",
                "organic fertil",
            )
        ):
            continue
        tags.append(lab)
    tags = _uniq(tags)
    if tags:
        row["tags"] = tags[:40]

    grow = parse_grow_fields(f"{desc or ''} {text[:4000]}")
    for k, v in grow.items():
        if k == "chemistry" and isinstance(v, dict):
            chem = dict(row.get("chemistry") or {})
            chem.update({kk: vv for kk, vv in v.items() if kk not in chem})
            row["chemistry"] = chem
        elif k not in row or row.get(k) in (None, "", [], {}):
            row[k] = v

    row["page_text_excerpt"] = text[:2000]
    # Drop empties
    return {k: v for k, v in row.items() if v not in (None, "", [], {})}


def load_sitemap_urls(*, delay: float, refresh: bool = False) -> list[str]:
    if SITEMAP_CACHE.exists() and not refresh:
        try:
            cached = json.loads(SITEMAP_CACHE.read_text(encoding="utf-8"))
            urls = [u for u in (cached.get("urls") or []) if PDP_RE.match(u)]
            if urls:
                print(f"sitemap cache: {len(urls)} PDP URLs from {SITEMAP_CACHE.name}")
                return urls
        except (OSError, json.JSONDecodeError):
            pass

    print(f"fetching sitemap {SITEMAP_URL}")
    time.sleep(max(0.0, delay))
    xml = http_get(SITEMAP_URL, timeout=180)
    locs = re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", xml, re.I)
    urls: list[str] = []
    seen: set[str] = set()
    skipped_html = 0
    for loc in locs:
        u = html_lib.unescape(loc.strip()).split("?")[0].split("#")[0]
        if re.search(r"-\d+\.html$", u, re.I):
            skipped_html += 1
            continue
        if not PDP_RE.match(u):
            continue
        if u in seen:
            continue
        seen.add(u)
        urls.append(u)

    SITEMAP_CACHE.write_text(
        json.dumps(
            {
                "built_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                "source_url": SITEMAP_URL,
                "count": len(urls),
                "skipped_html_pattern": skipped_html,
                "urls": urls,
            },
            ensure_ascii=False,
            indent=1,
        ),
        encoding="utf-8",
    )
    print(f"sitemap: {len(locs)} locs -> {len(urls)} *-product-N.php (skipped html={skipped_html})")
    return urls


def save_checkpoint(
    ck: Checkpoint,
    done: set[str],
    skipped: set[str],
    cursor: str | None = None,
) -> None:
    ck.data["done"] = sorted(done)
    ck.data["skipped_non_seed"] = sorted(skipped)
    ck.data["done_count"] = len(done)
    ck.data["skipped_count"] = len(skipped)
    if cursor is not None:
        ck.data["cursor"] = cursor
    ck.save()


def _fetch_one(url: str, delay: float) -> tuple[str, str | None, str | None]:
    """Return (url, html|None, error|None)."""
    try:
        html = polite_get(url, delay=delay, timeout=90)
        return url, html, None
    except Exception as exc:  # noqa: BLE001
        return url, None, str(exc)


def scrape(
    *,
    delay: float,
    limit: int | None,
    refresh_sitemap: bool,
    checkpoint_every: int,
    workers: int = 4,
) -> Path:
    urls = load_sitemap_urls(delay=delay, refresh=refresh_sitemap)
    if limit is not None:
        urls = urls[: max(0, limit)]

    ck = Checkpoint(CK_PATH)
    done = set(ck.data.get("done") or [])
    skipped = set(ck.data.get("skipped_non_seed") or [])
    items: list[dict] = []
    if OUT.exists():
        try:
            prev = json.loads(OUT.read_text(encoding="utf-8"))
            items = [i for i in (prev.get("items") or []) if isinstance(i, dict)]
        except (OSError, json.JSONDecodeError):
            items = []
    by_url = {i.get("url"): i for i in items if i.get("url")}

    # Prefetch merch slug skip (no HTTP).
    merch_skip = 0
    pending: list[str] = []
    for url in urls:
        if url in skipped:
            continue
        if url in done and url in by_url:
            continue
        if url in done and url not in by_url:
            done.discard(url)
        if is_obvious_merch_slug(url):
            skipped.add(url)
            done.add(url)
            merch_skip += 1
            continue
        pending.append(url)

    blockers: list[str] = []
    consecutive_walls = 0
    scraped_this_run = 0
    seeds_this_run = 0
    skip_this_run = merch_skip
    t0 = time.time()
    workers = max(1, min(8, workers))

    print(
        f"{SOURCE}: {len(urls)} sitemap; pending={len(pending)} "
        f"merch_slug_skip={merch_skip}; resume done={len(done)} "
        f"skipped={len(skipped)} dump_items={len(items)} workers={workers}"
    )
    if merch_skip:
        save_checkpoint(ck, done, skipped)

    abort = False
    with ThreadPoolExecutor(max_workers=workers) as pool:
        # Submit in waves so checkpoints stay timely and we can abort on bot walls.
        wave = max(workers * 5, checkpoint_every)
        for start in range(0, len(pending), wave):
            if abort:
                break
            batch = pending[start : start + wave]
            futs = {pool.submit(_fetch_one, url, delay): url for url in batch}
            for fut in as_completed(futs):
                url, html, err = fut.result()
                if err:
                    msg = f"{url}: {err}"
                    blockers.append(msg)
                    ck.note_error(msg)
                    continue
                assert html is not None
                if is_bot_wall(html):
                    msg = f"BOT_WALL {url}"
                    blockers.append(msg)
                    ck.note_error(msg)
                    consecutive_walls += 1
                    print(f"  blocker: {msg}")
                    if consecutive_walls >= 5:
                        print("aborting: repeated bot walls")
                        abort = True
                        break
                    continue
                consecutive_walls = 0
                try:
                    row = parse_pdp(html, url)
                except Exception as exc:  # noqa: BLE001
                    msg = f"parse {url}: {exc}"
                    blockers.append(msg)
                    ck.note_error(msg)
                    print(f"  fail {msg}")
                    continue
                scraped_this_run += 1
                if row is None:
                    skipped.add(url)
                    done.add(url)
                    skip_this_run += 1
                else:
                    by_url[url] = row
                    done.add(url)
                    seeds_this_run += 1

            items = list(by_url.values())
            cursor = batch[-1] if batch else None
            save_checkpoint(ck, done, skipped, cursor=cursor)
            write_dump(
                OUT,
                "strains",
                items,
                source=SOURCE,
                source_url=SOURCE_URL,
                license=NOTE,
                redistributable=False,
                note=(
                    f"partial checkpoint seeds={len(items)} "
                    f"skipped_non_seed={len(skipped)} queued={len(urls)}"
                ),
                blockers=(blockers or [])[-30:],
            )
            rate = scraped_this_run / max(1.0, time.time() - t0)
            print(
                f"  checkpoint seeds={len(items)} skipped={len(skipped)} "
                f"this_run_fetch={scraped_this_run} seeds_run={seeds_this_run} "
                f"skip_run={skip_this_run} rate={rate:.2f}/s "
                f"wave={start // wave + 1}/{(len(pending) + wave - 1) // wave}"
            )

    items = list(by_url.values())
    items.sort(key=lambda r: (r.get("name_norm") or "", r.get("url") or ""))
    save_checkpoint(ck, done, skipped)
    write_dump(
        OUT,
        "strains",
        items,
        source=SOURCE,
        source_url=SOURCE_URL,
        license=NOTE,
        redistributable=False,
        note=(
            f"Alchimia sitemap scrape complete; Cannabis seeds only; "
            f"skipped_non_seed={len(skipped)}"
        ),
        blockers=(blockers or [])[-30:],
        skipped_non_seed=len(skipped),
        sitemap_urls=len(urls),
    )
    print(
        f"wrote {OUT.name} seeds={len(items)} skipped_non_seed={len(skipped)} "
        f"errors={len(ck.data.get('errors') or [])}"
    )
    return OUT


def stage_dump(*, reset: bool = True) -> dict:
    from brain.dsc_brain.staging import write_dump_to_staging  # noqa: WPS433

    if not OUT.exists():
        raise FileNotFoundError(OUT)
    st = write_dump_to_staging(OUT, source_id=SOURCE, reset=reset)
    print(
        "staging:",
        json.dumps(
            {k: st[k] for k in ("family", "staging_db", "count", "stats") if k in st},
            indent=2,
            default=str,
        ),
    )
    return st


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description="Scrape Alchimia seed PDPs via products sitemap")
    ap.add_argument("--delay", type=float, default=0.25, help="min seconds between HTTP starts")
    ap.add_argument("--limit", type=int, default=None)
    ap.add_argument("--workers", type=int, default=4)
    ap.add_argument("--refresh-sitemap", action="store_true")
    ap.add_argument("--checkpoint-every", type=int, default=40)
    ap.add_argument("--sitemap-only", action="store_true")
    ap.add_argument("--stage", action="store_true", help="write staging sqlite after scrape")
    ap.add_argument("--stage-only", action="store_true", help="skip scrape; stage existing dump")
    args = ap.parse_args(argv)

    DATA.mkdir(parents=True, exist_ok=True)

    if args.stage_only:
        stage_dump()
        return 0

    if args.sitemap_only:
        urls = load_sitemap_urls(delay=args.delay, refresh=True)
        print(json.dumps({"sitemap_urls": len(urls), "sample": urls[:8]}, indent=2))
        return 0

    scrape(
        delay=args.delay,
        limit=args.limit,
        refresh_sitemap=args.refresh_sitemap,
        checkpoint_every=max(5, args.checkpoint_every),
        workers=args.workers,
    )
    if args.stage:
        stage_dump()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
