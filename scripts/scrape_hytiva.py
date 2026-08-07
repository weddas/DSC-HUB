#!/usr/bin/env python3
"""Polite Hytiva strain-directory scraper → dump → staging → master.

Open HTML (no CF observed). List pattern:
  https://www.hytiva.com/strains/{indica|sativa|hybrid}/{slug}
Pagination:
  https://www.hytiva.com/strains/{type}?page=N  (and /strains?page=N)

Checkpoint/resume. redistributable=false.
Staging: brain/data/staging/hytiva.sqlite3 (full raw_record; no attribute_kv spam).
"""

from __future__ import annotations

import argparse
import html as html_lib
import json
import re
import sys
from pathlib import Path
from urllib.parse import urljoin, urlparse

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(ROOT))

from catalog_common import DATA, name_norm, polite_get, write_dump, parse_grow_fields  # noqa: E402
from catalog_fetch import Checkpoint  # noqa: E402
from brain.dsc_brain.staging import write_dump_to_staging  # noqa: E402
from brain.dsc_brain.paths import staging_db_path  # noqa: E402
from merge_staging_to_master import main as merge_main  # noqa: E402

SOURCE_ID = "hytiva"
SOURCE_URL = "https://www.hytiva.com/strains"
OUT = DATA / "dsc_strains_hytiva.json"
CK_PATH = DATA / "dsc_strains_hytiva.checkpoint.json"
NOTE = "research scrape of hytiva.com strain pages; redistributable=false until legal review"

STRAIN_RE = re.compile(
    r"https?://(?:www\.)?hytiva\.com/strains/(hybrid|indica|sativa)/([a-z0-9\-]+)",
    re.I,
)
REL_RE = re.compile(r'href=["\'](/strains/(?:hybrid|indica|sativa)/[a-z0-9\-]+)["\']', re.I)
TYPES = ("hybrid", "indica", "sativa")
CANNABINOIDS = {
    "thc",
    "thca",
    "thcv",
    "cbd",
    "cbda",
    "cbdv",
    "cbg",
    "cbga",
    "cbc",
    "cbn",
}


def clean(html: str) -> str:
    t = re.sub(r"(?is)<script.*?</script>", " ", html or "")
    t = re.sub(r"(?is)<style.*?</style>", " ", t)
    t = re.sub(r"(?is)<[^>]+>", " ", t)
    return re.sub(r"\s+", " ", html_lib.unescape(t)).strip()


def camel_to_words(s: str) -> str:
    s = re.sub(r"([a-z])([A-Z])", r"\1 \2", s or "")
    return s.replace("-", " ").strip().title()


def extract_json_ld(html: str) -> list[dict]:
    out: list[dict] = []
    for m in re.finditer(
        r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
        html,
        re.I | re.S,
    ):
        try:
            doc = json.loads(m.group(1))
        except json.JSONDecodeError:
            continue
        if isinstance(doc, list):
            out.extend(d for d in doc if isinstance(d, dict))
        elif isinstance(doc, dict):
            out.append(doc)
    return out


def _graph_nodes(docs: list[dict]) -> list[dict]:
    nodes: list[dict] = []
    for doc in docs:
        graph = doc.get("@graph")
        if isinstance(graph, list):
            nodes.extend(n for n in graph if isinstance(n, dict))
        else:
            nodes.append(doc)
    return nodes


def _product_node(docs: list[dict]) -> dict | None:
    for n in _graph_nodes(docs):
        t = n.get("@type")
        if t == "Product" or (isinstance(t, list) and "Product" in t):
            # Prefer the main strain product (has additionalProperty)
            if n.get("additionalProperty") or n.get("name"):
                if n.get("category") == "Cannabis Strain" or n.get("additionalProperty"):
                    return n
    for n in _graph_nodes(docs):
        t = n.get("@type")
        if t == "Product" or (isinstance(t, list) and "Product" in t):
            return n
    return None


def _faq_node(docs: list[dict]) -> dict | None:
    for n in _graph_nodes(docs):
        t = n.get("@type")
        if t == "FAQPage" or (isinstance(t, list) and "FAQPage" in t):
            return n
    return None


def _fnum(val) -> float | None:
    if val is None:
        return None
    try:
        return float(str(val).replace("%", "").replace(",", "").strip())
    except ValueError:
        return None


def parse_additional_properties(props: list) -> tuple[dict, dict, list[str]]:
    """Return (cannabinoids_pct, terpenes_mg_g, top_terpene_names)."""
    cann: dict[str, float] = {}
    terps: dict[str, float] = {}
    for p in props or []:
        if not isinstance(p, dict):
            continue
        name = str(p.get("name") or "").strip()
        if not name:
            continue
        val = _fnum(p.get("value"))
        if val is None:
            continue
        unit = str(p.get("unitText") or "").strip().lower()
        key = name_norm(name).replace(" ", "_")
        # Beta Caryophyllene → beta_caryophyllene
        if unit == "%" or key in CANNABINOIDS or key.replace("_", "") in {c.replace("_", "") for c in CANNABINOIDS}:
            cann[key] = val
        elif "mg" in unit or key not in CANNABINOIDS:
            # terpene-like
            if key not in cann or "mg" in unit:
                terps[key] = val
    # Prefer treating known cannabinoid keys as cann even if unit missing
    for k in list(terps):
        base = k.replace("beta_", "").replace("alpha_", "")
        if k in CANNABINOIDS or base in CANNABINOIDS:
            cann[k] = terps.pop(k)
    top = [k.replace("_", " ").title() for k, _ in sorted(terps.items(), key=lambda kv: -kv[1])]
    return cann, terps, top


def parse_lineage(meta_desc: str, product: dict | None, faq: dict | None) -> list[str] | None:
    parents: list[str] = []
    m = re.search(r"(?i)(?:a cross of|cross of|crossed with)\s+([^.]+?)(?:[,.]|\s+with\s+\d)", meta_desc or "")
    if m:
        chunk = m.group(1)
        for part in re.split(r"\s*[x×]\s*|\s+and\s+", chunk):
            part = part.strip(" .")
            if part and len(part) < 60:
                parents.append(part)
    if product:
        for rel in product.get("isRelatedTo") or []:
            if isinstance(rel, dict) and rel.get("name"):
                nm = str(rel["name"]).strip()
                if nm and nm not in parents:
                    parents.append(nm)
    if faq and not parents:
        for ent in faq.get("mainEntity") or []:
            if not isinstance(ent, dict):
                continue
            q = str(ent.get("name") or "")
            if "come from" in q.lower() or "lineage" in q.lower():
                ans = (ent.get("acceptedAnswer") or {}).get("text") or ""
                m2 = re.search(r"(?i)cross of\s+(.+?)(?:\.|$)", str(ans))
                if m2:
                    for part in re.split(r"\s*[x×]\s*|\s+and\s+", m2.group(1)):
                        part = part.strip(" .")
                        if part:
                            parents.append(part)
    # dedupe preserve order
    seen = set()
    out = []
    for p in parents:
        k = name_norm(p)
        if k and k not in seen:
            seen.add(k)
            out.append(p)
    return out or None


def discover_links(*, delay: float, max_pages: int, blockers: list[str]) -> list[str]:
    """Paginate type listings (+ all) until empty pages."""
    found: set[str] = set()
    bases = [f"{SOURCE_URL}/{t}" for t in TYPES] + [SOURCE_URL]
    for base in bases:
        empty_streak = 0
        for page in range(1, max_pages + 1):
            url = base if page == 1 else f"{base}?page={page}"
            try:
                html = polite_get(url, delay=delay)
            except Exception as exc:  # noqa: BLE001
                blockers.append(f"{url}: {exc}")
                empty_streak += 1
                if empty_streak >= 2:
                    break
                continue
            before = len(found)
            for m in STRAIN_RE.finditer(html):
                typ, slug = m.group(1).lower(), m.group(2).lower()
                found.add(f"https://www.hytiva.com/strains/{typ}/{slug}")
            for m in REL_RE.finditer(html):
                found.add(urljoin(SOURCE_URL, m.group(1)))
            new = len(found) - before
            print(f"  discover {url}: +{new} (total {len(found)})")
            if new == 0:
                empty_streak += 1
                if empty_streak >= 2 or page > 1:
                    break
            else:
                empty_streak = 0
    return sorted(found)


def parse_strain_page(html: str, url: str) -> dict:
    docs = extract_json_ld(html)
    product = _product_node(docs)
    faq = _faq_node(docs)
    text = clean(html)

    path = urlparse(url).path.strip("/").split("/")
    typ = path[1] if len(path) >= 3 else None
    slug = path[2] if len(path) >= 3 else path[-1]

    name = None
    if product and product.get("name"):
        name = str(product["name"]).strip()
    if not name:
        m = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.I | re.S)
        if m:
            name = clean(m.group(1))
    if not name:
        name = slug.replace("-", " ").title()

    meta_desc = ""
    m = re.search(r'<meta name="description" content="([^"]+)"', html, re.I)
    if m:
        meta_desc = html_lib.unescape(m.group(1))
    title = ""
    m = re.search(r"<title>(.*?)</title>", html, re.I | re.S)
    if m:
        title = clean(m.group(1))

    cann, terps, top_terps = {}, {}, []
    description = None
    image = None
    related = []
    if product:
        cann, terps, top_terps = parse_additional_properties(product.get("additionalProperty") or [])
        description = str(product.get("description") or "").strip() or None
        img = product.get("image")
        if isinstance(img, dict):
            image = img.get("url")
        elif isinstance(img, str):
            image = img
        for rel in product.get("isRelatedTo") or []:
            if isinstance(rel, dict) and rel.get("name"):
                related.append(
                    {
                        "name": rel.get("name"),
                        "url": rel.get("url"),
                        "description": (str(rel.get("description") or "")[:400] or None),
                    }
                )

    effects = [camel_to_words(x) for x in sorted(set(re.findall(r"effects=([a-zA-Z]+)", html)))]
    flavors = [camel_to_words(x) for x in sorted(set(re.findall(r"flavors=([a-zA-Z]+)", html)))]
    pairs = [camel_to_words(x) for x in sorted(set(re.findall(r"pairsWellWith=([a-zA-Z]+)", html)))]

    lineage = parse_lineage(meta_desc, product, faq)

    faq_items = []
    if faq:
        for ent in faq.get("mainEntity") or []:
            if not isinstance(ent, dict):
                continue
            ans = (ent.get("acceptedAnswer") or {}).get("text")
            faq_items.append({"q": ent.get("name"), "a": ans})

    grow = parse_grow_fields(description or text)
    # Prefer lab numbers from JSON-LD over free-text title guesses
    thc = cann.get("thc")
    cbd = cann.get("cbd")
    thc_range = [thc, thc] if thc is not None else grow.get("thc_range")
    cbd_range = [cbd, cbd] if cbd is not None else (grow.get("chemistry") or {}).get("cbd_range")

    chemistry: dict = {}
    if thc_range:
        chemistry["thc_range"] = thc_range
    if cbd_range:
        chemistry["cbd_range"] = cbd_range
    if top_terps:
        chemistry["top_terpenes"] = top_terps[:8]
    if cann:
        chemistry["cannabinoids_pct"] = cann
    if terps:
        chemistry["terpene_values_mg_g"] = terps

    row: dict = {
        "name": name,
        "name_norm": name_norm(name),
        "type": typ,
        "url": url,
        "source": SOURCE_ID,
        "slug": slug,
        "title": title or None,
        "meta_description": meta_desc or None,
        "description": description,
        "image_url": image,
        "lineage": lineage,
        "effects": effects or None,
        "top_effects": effects or None,
        "flavors": flavors or None,
        "top_flavors": flavors or None,
        "pairs_well_with": pairs or None,
        "related_strains": related or None,
        "faq": faq_items or None,
        "page_text_excerpt": text[:2000],
        "date_published": (faq or {}).get("datePublished") if faq else None,
        "last_reviewed": (faq or {}).get("lastReviewed") if faq else None,
    }
    if thc_range:
        row["thc_range"] = thc_range
    if cbd_range:
        row["cbd_range"] = cbd_range
    if top_terps:
        row["top_terpenes"] = top_terps[:8]
        row["terpenes"] = top_terps
    if chemistry:
        row["chemistry"] = chemistry
    # grow fields if present
    for k in ("flowering_days", "height_cm", "yield_indoor", "yield_outdoor"):
        if grow.get(k) not in (None, "", [], {}):
            row[k] = grow[k]
    # indoor tip from description
    if description and re.search(r"(?i)indoor", description):
        row.setdefault("climate", "indoor recommended" if re.search(r"(?i)recommend(?:ed)?\s+indoor|indoor cultivation", description) else None)
    # rich bank_props for variant payload (no breeder → stays on canonical)
    row["bank_props"] = {
        k: row[k]
        for k in (
            "slug",
            "type",
            "lineage",
            "effects",
            "flavors",
            "pairs_well_with",
            "image_url",
            "meta_description",
            "faq",
            "related_strains",
            "date_published",
            "last_reviewed",
        )
        if row.get(k) not in (None, "", [], {})
    }
    # drop Nones
    return {k: v for k, v in row.items() if v not in (None, "", [], {})}


def load_existing_items() -> list[dict]:
    if not OUT.exists():
        return []
    try:
        doc = json.loads(OUT.read_text(encoding="utf-8"))
        return list(doc.get("items") or [])
    except (OSError, json.JSONDecodeError):
        return []


def scrape(*, delay: float, limit: int | None, max_pages: int, resume: bool) -> tuple[list[dict], list[str]]:
    blockers: list[str] = []
    ck = Checkpoint(CK_PATH)
    items = load_existing_items() if resume else []
    by_url = {i.get("url"): i for i in items if isinstance(i, dict) and i.get("url")}

    print("Discovering Hytiva strain URLs…")
    links = discover_links(delay=delay, max_pages=max_pages, blockers=blockers)
    print(f"discovered {len(links)} unique strain URLs")
    if limit is not None:
        links = links[:limit]

    done = 0
    for url in links:
        if resume and ck.is_done(url) and url in by_url:
            continue
        try:
            html = polite_get(url, delay=delay)
            if len(html) < 2000 and "just a moment" in html.lower():
                blockers.append(f"BOT_WALL {url}")
                ck.note_error(f"BOT_WALL {url}")
                continue
            row = parse_strain_page(html, url)
            by_url[url] = row
            ck.mark_done(url)
            done += 1
            if done % 25 == 0:
                items = list(by_url.values())
                write_dump(
                    OUT,
                    "strains",
                    items,
                    source=SOURCE_ID,
                    source_url=SOURCE_URL,
                    license=NOTE,
                    redistributable=False,
                    note="partial checkpoint dump",
                    blockers=blockers[-20:],
                )
                print(f"  scraped {done} new / {len(items)} total (of {len(links)} queued)")
        except Exception as exc:  # noqa: BLE001
            msg = f"{url}: {exc}"
            blockers.append(msg)
            ck.note_error(msg)
            print(f"  fail {msg}")

    items = list(by_url.values())
    write_dump(
        OUT,
        "strains",
        items,
        source=SOURCE_ID,
        source_url=SOURCE_URL,
        license=NOTE,
        redistributable=False,
        note=NOTE,
        blockers=blockers[-50:],
        discovered=len(links),
        staging_target=str(staging_db_path("hytiva")),
    )
    print(f"dump: {OUT} count={len(items)}")
    return items, blockers


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--delay", type=float, default=0.65)
    ap.add_argument("--limit", type=int, default=None, help="max strain pages (default: full catalog)")
    ap.add_argument("--max-pages", type=int, default=120, help="max list pages per type")
    ap.add_argument("--no-resume", action="store_true")
    ap.add_argument("--skip-staging", action="store_true")
    ap.add_argument("--skip-merge", action="store_true")
    ap.add_argument("--discover-only", action="store_true")
    args = ap.parse_args(argv)

    DATA.mkdir(parents=True, exist_ok=True)
    staging_target = staging_db_path("hytiva")
    print(f"staging target: {staging_target}")

    if args.discover_only:
        blockers: list[str] = []
        links = discover_links(delay=args.delay, max_pages=args.max_pages, blockers=blockers)
        print(json.dumps({"discovered": len(links), "sample": links[:10], "blockers": blockers[:10]}, indent=2))
        return 0

    items, blockers = scrape(
        delay=args.delay,
        limit=args.limit,
        max_pages=args.max_pages,
        resume=not args.no_resume,
    )

    staging_result = None
    if not args.skip_staging:
        # reset staging DB for this source so counts match dump
        staging_result = write_dump_to_staging(OUT, source_id=SOURCE_ID, reset=True)
        print(
            f"staging: {staging_result.get('staging_db')} "
            f"family={staging_result.get('family')} n={staging_result.get('count')}"
        )
        print(f"staging_stats: {json.dumps(staging_result.get('stats') or {}, default=str)}")
        assert "hytiva.sqlite3" in str(staging_result.get("staging_db") or ""), (
            f"expected staging/hytiva.sqlite3, got {staging_result.get('staging_db')}"
        )

    if not args.skip_merge:
        rc = merge_main(["--only", "hytiva", "--no-link", "--no-search"])
        if rc != 0:
            return rc

    print(
        json.dumps(
            {
                "dump": str(OUT),
                "dump_count": len(items),
                "blockers": len(blockers),
                "blocker_sample": blockers[:8],
                "staging": staging_result,
                "staging_db": str(staging_target),
                "redistributable": False,
            },
            indent=2,
            default=str,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
