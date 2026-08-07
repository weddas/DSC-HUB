#!/usr/bin/env python3
"""Scrape Seedsman USA catalog via sitemap → GraphQL PDP (research corpus).

List/category routes are 404/SPA shells. Product HTML is ScandiPWA (empty #root).
Working path:
  1) USA sitemap https://www.seedsman.com/sitemaps/seedsman_usa_site_map_live.xml
  2) Keep depth-2 PDP URLs: /us-en/{slug}
  3) GraphQL urlResolver(slug) → sku → products(filter: {sku})
  4) Maximize grow fields from s_attributes, categories, description text

Checkpoint/resume, polite delay, redistributable=false.
Staging: brain/data/staging/seedsman.sqlite3 (full raw_record).
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
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(ROOT))

from catalog_common import DATA, name_norm, parse_grow_fields, write_dump  # noqa: E402
from catalog_fetch import Checkpoint  # noqa: E402
from brain.dsc_brain.staging import write_dump_to_staging  # noqa: E402

SITEMAP_URL = "https://www.seedsman.com/sitemaps/seedsman_usa_site_map_live.xml"
GRAPHQL_URL = "https://www.seedsman.com/graphql"
SOURCE = "seedsman"
SOURCE_URL = "https://www.seedsman.com/us-en/"
NOTE = "research scrape Seedsman USA sitemap→GraphQL PDP; ScandiPWA SPA; redistributable=false"
OUT = DATA / "dsc_strains_seedsman.json"
CK_PATH = DATA / "dsc_strains_seedsman.checkpoint.json"
SITEMAP_CACHE = DATA / "dsc_strains_seedsman.sitemap_urls.json"
STAGING_FAMILY = "seedsman"

PDP_RE = re.compile(r"^https://www\.seedsman\.com/us-en/([a-z0-9\-]+)/?$", re.I)
CTX = ssl.create_default_context()

BROWSER_UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)

# Merch / non-seed PDP slug markers (sitemap also lists accessories).
MERCH_RE = re.compile(
    r"(?:grinder|grinders|t-?shirt|hoodie|hat|cap|mug|sticker|poster|vapou?r|"
    r"pipe|bong|tray|puck|chamber|storage|clips?|huggers?|cups?|pots?|"
    r"reshipping|fee|additive|cloning-gel|organiplugs|bundle|goods-|"
    r"accessory|accessories|merch|canister|germination-canister|"
    r"propagation|nutrient|fertilizer|soil-mix|grow-tent|"
    r"partition-chart|wet-erase|marker)",
    re.I,
)
# Category / CMS / promo shells that share /us-en/{slug} with PDPs.
CATEGORY_SLUG_RE = re.compile(
    r"^(?:top-picks|sale|clones|coming-soon|flowring-type|flowering-type|"
    r"all-new-products|seedsman|cheesecake-strains|"
    r"ltd-edition-and-discontinued-strains|seedsman-high-thc-strains|"
    r"\d+-off-select-seedsman-strains|"
    r".*-strains)$",
    re.I,
)
# Match seed pack cues; strip brand token "seedsman" first so it does not
# false-positive via the embedded "seeds" substring.
SEEDISH_RE = re.compile(
    r"(?:seeds?|feminis|regular|autoflower|auto-|photoperiod|cbd-seeds|"
    r"-fem(?:-|$)|-reg(?:-|$)|-auto(?:-|$))",
    re.I,
)

PRODUCT_QUERY = """
query ProductBySku($sku: String!) {
  products(filter: { sku: { eq: $sku } }) {
    items {
      id
      sku
      name
      url_key
      type_id
      stock_status
      brand
      meta_title
      meta_description
      genetic_description
      seeds_climate
      seeds_auto_harvest_time
      seeds_cbd_filter
      seeds_effect_filter
      seeds_feminised
      seeds_flowering_time
      seeds_flowering_type
      seeds_plant_height
      seeds_taste_filter
      seeds_thc_filter
      seeds_yield_filter
      seeds_yield_indoor_filter
      seeds_thc
      description { html }
      short_description { html }
      categories { id name url_path }
      media_gallery { url label }
      image { url label }
      price_range {
        minimum_price {
          regular_price { value currency }
          final_price { value currency }
        }
      }
      s_attributes {
        attribute_code
        attribute_label
        attribute_value
        attribute_type
        attribute_options { label value }
      }
      ... on ConfigurableProduct {
        configurable_options {
          attribute_code
          label
          values { label value_index }
        }
        variants {
          product { sku name stock_status }
          attributes { code label value_index }
        }
      }
    }
  }
}
"""

URL_RESOLVER_QUERY = """
query Resolve($url: String!) {
  urlResolver(url: $url) { id type sku relative_url }
}
"""


def clean_html(html: str) -> str:
    t = re.sub(r"(?is)<script.*?</script>", " ", html or "")
    t = re.sub(r"(?is)<style.*?</style>", " ", t)
    t = re.sub(r"(?is)<[^>]+>", " ", t)
    return re.sub(r"\s+", " ", html_lib.unescape(t)).strip()


def strip_html_links(label: str) -> str:
    t = re.sub(r"(?is)<[^>]+>", " ", label or "")
    return re.sub(r"\s+", " ", html_lib.unescape(t)).strip()


def gql(query: str, variables: dict | None = None, *, timeout: int = 60) -> dict:
    body = json.dumps({"query": query, "variables": variables or {}}).encode("utf-8")
    req = urllib.request.Request(
        GRAPHQL_URL,
        data=body,
        headers={
            "User-Agent": BROWSER_UA,
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Origin": "https://www.seedsman.com",
            "Referer": SOURCE_URL,
            "Store": "us",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout, context=CTX) as resp:
            return json.loads(resp.read().decode("utf-8", "replace"))
    except urllib.error.HTTPError as exc:
        raw = exc.read().decode("utf-8", "replace") if exc.fp else ""
        raise RuntimeError(f"GraphQL HTTP {exc.code}: {raw[:240]}") from exc


def polite_gql(query: str, variables: dict | None = None, *, delay: float) -> dict:
    time.sleep(max(0.0, delay))
    return gql(query, variables)


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
    req = urllib.request.Request(
        SITEMAP_URL,
        headers={"User-Agent": BROWSER_UA, "Accept": "application/xml,text/xml,*/*"},
    )
    with urllib.request.urlopen(req, timeout=180, context=CTX) as resp:
        xml = resp.read().decode("utf-8", "replace")
    locs = re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", xml, re.I)
    urls: list[str] = []
    seen: set[str] = set()
    for loc in locs:
        u = html_lib.unescape(loc.strip()).split("?")[0].split("#")[0].rstrip("/")
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
                "urls": urls,
            },
            ensure_ascii=False,
            indent=1,
        ),
        encoding="utf-8",
    )
    print(f"sitemap: {len(locs)} locs -> {len(urls)} PDP URLs")
    return urls


def is_likely_seed_pdp(url: str) -> bool | None:
    """True=keep, False=skip merch, None=ambiguous (resolve via GraphQL)."""
    slug = urlparse(url).path.rstrip("/").split("/")[-1]
    if MERCH_RE.search(slug) or CATEGORY_SLUG_RE.match(slug):
        return False
    # Brand token contains "seeds"; strip before seedish match.
    slug_probe = re.sub(r"seedsman", "", slug, flags=re.I)
    if SEEDISH_RE.search(slug_probe):
        return True
    return None


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


def attr_labels(attr: dict) -> list[str]:
    opts = attr.get("attribute_options") or []
    labels = [strip_html_links(str(o.get("label") or "")) for o in opts if isinstance(o, dict)]
    labels = [x for x in labels if x]
    if labels:
        return _uniq(labels)
    raw = attr.get("attribute_value")
    if raw in (None, "", [], {}):
        return []
    return [strip_html_links(str(raw))]


def attrs_map(s_attributes: list) -> dict[str, dict]:
    out: dict[str, dict] = {}
    for a in s_attributes or []:
        if not isinstance(a, dict):
            continue
        code = str(a.get("attribute_code") or "").strip()
        if code:
            out[code] = a
    return out


def category_signals(categories: list) -> dict:
    paths = []
    names = []
    for c in categories or []:
        if not isinstance(c, dict):
            continue
        n = str(c.get("name") or "").strip()
        p = str(c.get("url_path") or "").strip()
        if n:
            names.append(n)
        if p:
            paths.append(p)
    breeder = None
    for p, n in zip(paths, names):
        if p.startswith("cannabis-seed-breeders/") and p.count("/") == 1:
            breeder = n
            break
    sex = None
    flowering_type = None
    genetics = None
    cultivation = []
    medical = []
    variety = []
    for p, n in zip(paths, names):
        pl = p.lower()
        if "/sex/" in pl or pl.endswith("/sex"):
            if "feminis" in pl or "regular" in pl or "auto" in pl:
                sex = n
        if "flowering-type/" in pl:
            flowering_type = n
        if "/genetics/" in pl:
            genetics = n
        if "cultivation-type/" in pl or pl.startswith("cultivation/"):
            cultivation.append(n)
        if "medical-seeds/" in pl:
            medical.append(n)
        if "/variety/" in pl:
            variety.append(n)
    return {
        "breeder": breeder,
        "sex": sex,
        "flowering_type": flowering_type,
        "genetics_label": genetics,
        "cultivation": _uniq(cultivation),
        "medical": _uniq(medical),
        "variety_traits": _uniq(variety),
        "category_names": _uniq(names),
        "category_paths": paths,
    }


def looks_like_seed_product(item: dict, cats: dict) -> bool:
    paths = " ".join(cats.get("category_paths") or []).lower()
    if "cannabis-seed" in paths or "cannabis-seeds" in paths:
        return True
    amap = attrs_map(item.get("s_attributes") or [])
    seed_keys = (
        "seeds_feminised",
        "seeds_flowering_type",
        "seeds_flowering_time",
        "genetic_description",
        "seeds_thc_filter",
        "seeds_number",
    )
    if any(k in amap and amap[k].get("attribute_value") not in (None, "", []) for k in seed_keys):
        return True
    name = str(item.get("name") or "").lower()
    return "seed" in name


def parse_flowering_days(label: str) -> list[int] | int | None:
    m = re.search(r"(\d+)\s*(?:to|[-–])\s*(\d+)\s*weeks?", label, re.I)
    if m:
        return [int(m.group(1)) * 7, int(m.group(2)) * 7]
    m = re.search(r"(\d+)\s*weeks?", label, re.I)
    if m:
        return int(m.group(1)) * 7
    m = re.search(r"(\d+)\s*(?:to|[-–])\s*(\d+)\s*days?", label, re.I)
    if m:
        return [int(m.group(1)), int(m.group(2))]
    return None


def parse_product(item: dict, url: str, *, resolver: dict | None = None) -> dict:
    amap = attrs_map(item.get("s_attributes") or [])
    cats = category_signals(item.get("categories") or [])

    name = str(item.get("name") or "").strip()
    if not name:
        name = urlparse(url).path.rstrip("/").split("/")[-1].replace("-", " ")

    # Prefer clean strain name without pack/sex suffix
    name_clean = re.sub(
        r"\s+(?:Regular|Feminis(?:ed|ed)|Auto(?:flower(?:ing)?)?)\s+Seeds?\b.*$",
        "",
        name,
        flags=re.I,
    ).strip()
    name_clean = re.sub(r"\s+Seeds?\s*$", "", name_clean, flags=re.I).strip() or name

    desc_html = ((item.get("description") or {}) or {}).get("html") or ""
    short_html = ((item.get("short_description") or {}) or {}).get("html") or ""
    description = clean_html(desc_html)
    short_description = clean_html(short_html)
    text_blob = " ".join(x for x in (description, short_description, name) if x)

    # Attribute-derived fields
    breeder_labels = attr_labels(amap["brand"]) if "brand" in amap else []
    breeder = cats.get("breeder") or (breeder_labels[0] if breeder_labels else None)
    sex_labels = attr_labels(amap["seeds_feminised"]) if "seeds_feminised" in amap else []
    sex = (sex_labels[0] if sex_labels else None) or cats.get("sex")
    flowering_type_labels = (
        attr_labels(amap["seeds_flowering_type"]) if "seeds_flowering_type" in amap else []
    )
    flowering_type = (flowering_type_labels[0] if flowering_type_labels else None) or cats.get(
        "flowering_type"
    )
    flowering_time_labels = (
        attr_labels(amap["seeds_flowering_time"]) if "seeds_flowering_time" in amap else []
    )
    climate = attr_labels(amap["seeds_climate"]) if "seeds_climate" in amap else []
    aromas = attr_labels(amap["seeds_taste_filter"]) if "seeds_taste_filter" in amap else []
    effects = attr_labels(amap["seeds_effect_filter"]) if "seeds_effect_filter" in amap else []
    colours = attr_labels(amap["seeds_colour"]) if "seeds_colour" in amap else []
    height_labels = attr_labels(amap["seeds_plant_height"]) if "seeds_plant_height" in amap else []
    thc_labels = attr_labels(amap["seeds_thc_filter"]) if "seeds_thc_filter" in amap else []
    cbd_labels = attr_labels(amap["seeds_cbd_filter"]) if "seeds_cbd_filter" in amap else []
    yield_labels = attr_labels(amap["seeds_yield_filter"]) if "seeds_yield_filter" in amap else []
    yield_indoor_labels = (
        attr_labels(amap["seeds_yield_indoor_filter"]) if "seeds_yield_indoor_filter" in amap else []
    )
    harvest_auto = (
        attr_labels(amap["seeds_auto_harvest_time"]) if "seeds_auto_harvest_time" in amap else []
    )
    pack_size = attr_labels(amap["seeds_number"]) if "seeds_number" in amap else []
    tile_cats = (
        attr_labels(amap["product_tile_categories"]) if "product_tile_categories" in amap else []
    )
    genetics = str(item.get("genetic_description") or "").strip() or None
    if not genetics and "genetic_description" in amap:
        labs = attr_labels(amap["genetic_description"])
        genetics = labs[0] if labs else None

    # Type heuristic from genetics / categories / tiles
    type_ = None
    for candidate in (
        cats.get("genetics_label"),
        *(tile_cats or []),
        *(cats.get("variety_traits") or []),
    ):
        cl = (candidate or "").lower()
        if "indica" in cl and "sativa" in cl:
            type_ = "Hybrid"
            break
        if "indica" in cl:
            type_ = "Indica"
            break
        if "sativa" in cl:
            type_ = "Sativa"
            break
        if "hybrid" in cl or "ruderalis" in cl:
            type_ = candidate
            break
    if not type_ and flowering_type and "auto" in flowering_type.lower():
        type_ = "Autoflower"

    chemistry: dict = {}
    if thc_labels:
        chemistry["thc_level"] = thc_labels[0]
        chemistry["thc_labels"] = thc_labels
    if cbd_labels:
        chemistry["cbd_level"] = cbd_labels[0]
        chemistry["cbd_labels"] = cbd_labels

    grow = parse_grow_fields(text_blob)
    if grow.get("chemistry") and isinstance(grow["chemistry"], dict):
        chemistry = {**grow["chemistry"], **chemistry}
    flowering_days = None
    if flowering_time_labels:
        flowering_days = parse_flowering_days(flowering_time_labels[0])
    if flowering_days is None:
        flowering_days = grow.get("flowering_days")

    images = []
    for g in item.get("media_gallery") or []:
        if isinstance(g, dict) and g.get("url"):
            images.append(g["url"])
    img = item.get("image") if isinstance(item.get("image"), dict) else {}
    if img.get("url"):
        images.insert(0, img["url"])
    images = _uniq(images)

    price = None
    currency = None
    pr = (((item.get("price_range") or {}) or {}).get("minimum_price") or {})
    final = pr.get("final_price") if isinstance(pr, dict) else None
    if isinstance(final, dict):
        try:
            price = float(final.get("value"))
        except (TypeError, ValueError):
            price = None
        currency = final.get("currency")

    # Structured attributes payload for raw staging fidelity
    attributes: dict[str, object] = {}
    for code, a in amap.items():
        labels = attr_labels(a)
        raw_val = a.get("attribute_value")
        if labels or raw_val not in (None, "", []):
            attributes[code] = {
                "label": a.get("attribute_label"),
                "value": raw_val,
                "labels": labels,
            }

    row: dict = {
        "name": name[:200],
        "name_clean": name_clean[:200],
        "name_norm": name_norm(name_clean or name),
        "url": url.split("?")[0].split("#")[0],
        "source": SOURCE,
        "sku": item.get("sku"),
        "product_id": item.get("id"),
        "url_key": item.get("url_key"),
        "type_id": item.get("type_id"),
        "stock_status": item.get("stock_status"),
        "breeder": breeder,
        "bank": "Seedsman",
        "type": type_ or grow.get("type"),
        "sex": sex,
        "flowering_type": flowering_type,
        "flowering_time_label": flowering_time_labels[0] if flowering_time_labels else None,
        "flowering_days": flowering_days,
        "genetics": genetics,
        "crosses": genetics,
        "climate": climate or None,
        "aromas": aromas or None,
        "flavors": aromas or None,
        "top_flavors": (aromas or [])[:8] or None,
        "effects": effects or None,
        "top_effects": (effects or [])[:8] or None,
        "colours": colours or None,
        "plant_height_label": height_labels[0] if height_labels else None,
        "height_cm": grow.get("height_cm"),
        "yield_label": yield_labels[0] if yield_labels else None,
        "yield_indoor": (yield_indoor_labels[0] if yield_indoor_labels else None)
        or grow.get("yield_indoor"),
        "auto_harvest_label": harvest_auto[0] if harvest_auto else None,
        "pack_size": pack_size[0] if pack_size else None,
        "variety_traits": _uniq((cats.get("variety_traits") or []) + (tile_cats or [])) or None,
        "cultivation": cats.get("cultivation") or None,
        "medical": cats.get("medical") or None,
        "may_relieve": cats.get("medical") or None,
        "description": description[:5000] if description else None,
        "short_description": short_description[:1000] if short_description else None,
        "meta_title": item.get("meta_title"),
        "meta_description": item.get("meta_description"),
        "image_url": images[0] if images else None,
        "images": images or None,
        "price": price,
        "currency": currency,
        "chemistry": chemistry or None,
        "thc_range": grow.get("thc_range"),
        "cbd_range": grow.get("cbd_range"),
        "attributes": attributes or None,
        "categories": item.get("categories"),
        "s_attributes": item.get("s_attributes"),
        "configurable_options": item.get("configurable_options"),
        "variants": item.get("variants"),
        "resolver": resolver,
        "page_text_excerpt": text_blob[:2000] if text_blob else None,
    }
    # Drop empties but keep structured None-less
    return {k: v for k, v in row.items() if v not in (None, "", [], {})}


def save_checkpoint(ck: Checkpoint, done: set[str], cursor: str | None = None) -> None:
    ck.data["done"] = sorted(done)
    if cursor is not None:
        ck.data["cursor"] = cursor
    ck.data["done_count"] = len(done)
    ck.save()


def write_partial(items: list[dict], *, note: str, blockers: list[str] | None = None) -> None:
    write_dump(
        OUT,
        "strains",
        items,
        source=SOURCE,
        source_url=SOURCE_URL,
        license=NOTE,
        redistributable=False,
        note=note,
        sitemap=SITEMAP_URL,
        graphql=GRAPHQL_URL,
        blockers=(blockers or [])[-40:],
        compact=True,
    )


def fetch_product_for_url(url: str, *, delay: float) -> tuple[dict | None, str | None]:
    """Return (row, skip_or_error_reason)."""
    m = PDP_RE.match(url)
    if not m:
        return None, "not_pdp"
    slug = m.group(1)

    likely = is_likely_seed_pdp(url)
    if likely is False:
        return None, "merch_slug"

    doc = polite_gql(URL_RESOLVER_QUERY, {"url": slug}, delay=delay)
    if doc.get("errors"):
        return None, f"resolver_errors:{doc['errors'][0].get('message')}"
    resolver = (doc.get("data") or {}).get("urlResolver")
    if not resolver or not resolver.get("sku"):
        return None, "resolver_miss"
    if str(resolver.get("type") or "").upper() != "PRODUCT":
        return None, f"resolver_type:{resolver.get('type')}"

    sku = str(resolver["sku"])
    doc2 = polite_gql(PRODUCT_QUERY, {"sku": sku}, delay=delay)
    if doc2.get("errors"):
        return None, f"product_errors:{doc2['errors'][0].get('message')}"
    items = ((doc2.get("data") or {}).get("products") or {}).get("items") or []
    if not items:
        return None, "product_empty"
    item = items[0]
    cats = category_signals(item.get("categories") or [])
    if likely is None and not looks_like_seed_product(item, cats):
        return None, "not_seed_product"
    if not looks_like_seed_product(item, cats) and likely is not True:
        return None, "not_seed_product"
    row = parse_product(item, url, resolver=resolver)
    return row, None


def scrape(
    *,
    delay: float,
    limit: int | None,
    refresh_sitemap: bool,
    checkpoint_every: int,
    stage_every: int = 400,
) -> Path:
    urls = load_sitemap_urls(delay=delay, refresh=refresh_sitemap)
    # Pre-filter obvious merch/category; keep seedish + ambiguous
    filtered: list[str] = []
    skipped_merch = 0
    for u in urls:
        flag = is_likely_seed_pdp(u)
        if flag is False:
            skipped_merch += 1
            continue
        filtered.append(u)
    if limit is not None:
        filtered = filtered[: max(0, limit)]

    ck = Checkpoint(CK_PATH)
    done = set(ck.data.get("done") or [])
    items: list[dict] = []
    if OUT.exists():
        try:
            prev = json.loads(OUT.read_text(encoding="utf-8"))
            items = [i for i in (prev.get("items") or []) if isinstance(i, dict)]
        except (OSError, json.JSONDecodeError):
            items = []
    by_url = {i.get("url"): i for i in items if i.get("url")}
    blockers: list[str] = []
    skipped: dict[str, int] = {}
    scraped_this_run = 0
    consecutive_failures = 0
    last_staged_at = 0
    t0 = time.time()

    print(
        f"seedsman: sitemap_pdps={len(urls)} queued={len(filtered)} "
        f"prefilter_merch={skipped_merch} resume_done={len(done)} dump_items={len(items)}",
        flush=True,
    )

    for idx, url in enumerate(filtered, 1):
        if url in done and url in by_url:
            continue
        if url in done and url not in by_url:
            done.discard(url)

        try:
            row, reason = fetch_product_for_url(url, delay=delay)
            if reason:
                skipped[reason] = skipped.get(reason, 0) + 1
                done.add(url)  # don't retry merch/miss forever
                if reason.startswith("resolver_errors") or reason.startswith("product_errors"):
                    blockers.append(f"{reason} {url}")
                    consecutive_failures += 1
                    if consecutive_failures >= 8:
                        print("aborting: repeated GraphQL failures", flush=True)
                        break
                else:
                    consecutive_failures = 0
                # Still checkpoint skip progress so resume doesn't re-hit shells.
                if (len(done) % checkpoint_every == 0) or idx == len(filtered):
                    save_checkpoint(ck, done, cursor=url)
                continue
            assert row is not None
            by_url[url] = row
            done.add(url)
            scraped_this_run += 1
            consecutive_failures = 0
        except Exception as exc:  # noqa: BLE001
            msg = f"{url}: {exc}"
            blockers.append(msg)
            ck.note_error(msg)
            consecutive_failures += 1
            print(f"  fail {msg}", flush=True)
            if consecutive_failures >= 8:
                print("aborting: repeated exceptions", flush=True)
                break
            continue

        if scraped_this_run % checkpoint_every == 0 or idx == len(filtered):
            items = list(by_url.values())
            save_checkpoint(ck, done, cursor=url)
            write_partial(
                items,
                note=(
                    f"partial checkpoint items={len(items)} "
                    f"queued={len(filtered)} skipped={skipped}"
                ),
                blockers=blockers,
            )
            rate = scraped_this_run / max(1.0, time.time() - t0)
            print(
                f"  checkpoint items={len(items)} done={len(done)} "
                f"this_run={scraped_this_run} rate={rate:.2f}/s "
                f"idx={idx}/{len(filtered)} skipped={skipped}",
                flush=True,
            )
            if stage_every > 0 and (len(items) - last_staged_at) >= stage_every:
                try:
                    stage_dump(reset=True)
                    last_staged_at = len(items)
                except Exception as exc:  # noqa: BLE001
                    print(f"  staging warn: {exc}", flush=True)

    items = list(by_url.values())
    items.sort(key=lambda r: (r.get("name_norm") or "", r.get("url") or ""))
    save_checkpoint(ck, done)
    write_partial(
        items,
        note=f"seedsman USA sitemap→GraphQL scrape; skipped={skipped}",
        blockers=blockers,
    )
    print(
        f"wrote {OUT.name} count={len(items)} errors={len(ck.data.get('errors') or [])} "
        f"skipped={skipped}",
        flush=True,
    )
    return OUT


def stage_dump(*, reset: bool = True) -> dict:
    """Write dump into brain/data/staging/seedsman.sqlite3 (full raw_record)."""
    if not OUT.exists():
        raise FileNotFoundError(OUT)
    st = write_dump_to_staging(OUT, source_id=SOURCE, reset=reset)
    print(
        "staging:",
        json.dumps(
            {
                k: st[k]
                for k in ("family", "staging_db", "count", "bulk", "store_raw", "stats")
                if k in st
            },
            indent=2,
            default=str,
        ),
        flush=True,
    )
    return st


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description="Scrape Seedsman USA via sitemap→GraphQL")
    ap.add_argument("--delay", type=float, default=0.45, help="polite delay between GraphQL calls")
    ap.add_argument("--limit", type=int, default=None, help="cap PDP URLs (default: full)")
    ap.add_argument("--refresh-sitemap", action="store_true")
    ap.add_argument("--checkpoint-every", type=int, default=20)
    ap.add_argument(
        "--stage-every",
        type=int,
        default=400,
        help="rewrite staging sqlite every N dump items (0=disable mid-run)",
    )
    ap.add_argument("--sitemap-only", action="store_true")
    ap.add_argument("--stage", action="store_true", help="write staging sqlite after scrape (redundant; always stages)")
    ap.add_argument("--stage-only", action="store_true", help="skip scrape; stage existing dump")
    ap.add_argument("--smoke", type=int, default=0, help="scrape N URLs then stage (test)")
    args = ap.parse_args(argv)

    if args.stage_only:
        stage_dump(reset=True)
        return 0

    if args.sitemap_only:
        urls = load_sitemap_urls(delay=args.delay, refresh=True)
        seedish = sum(1 for u in urls if is_likely_seed_pdp(u) is True)
        merch = sum(1 for u in urls if is_likely_seed_pdp(u) is False)
        amb = sum(1 for u in urls if is_likely_seed_pdp(u) is None)
        print(
            json.dumps(
                {
                    "sitemap_pdps": len(urls),
                    "seedish": seedish,
                    "merch": merch,
                    "ambiguous": amb,
                    "sample": urls[:5],
                },
                indent=2,
            )
        )
        return 0

    limit = args.limit
    if args.smoke and not limit:
        limit = args.smoke

    scrape(
        delay=args.delay,
        limit=limit,
        refresh_sitemap=args.refresh_sitemap,
        checkpoint_every=max(5, args.checkpoint_every),
        stage_every=max(0, args.stage_every),
    )

    # Always leave staging current after a scrape pass (no master merge).
    stage_dump(reset=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
