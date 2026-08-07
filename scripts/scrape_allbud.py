#!/usr/bin/env python3
"""Scrape AllBud strain catalog via sitemap (research corpus).

Sitemap: https://www.allbud.com/sitemap-strains.xml (~16k product URLs)
Pattern: https://www.allbud.com/marijuana-strains/{type}/{slug}
Index:   /marijuana-strains/search

Checkpoint/resume, polite delay, rich field capture.
redistributable=false until legal review.
"""

from __future__ import annotations

import argparse
import html as html_lib
import json
import re
import sys
import time
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(ROOT))

from catalog_common import DATA, name_norm, polite_get, write_dump, parse_grow_fields  # noqa: E402
from catalog_fetch import Checkpoint  # noqa: E402

SITEMAP_URL = "https://www.allbud.com/sitemap-strains.xml"
SOURCE = "allbud"
SOURCE_URL = "https://www.allbud.com/marijuana-strains/search"
NOTE = "research scrape of public AllBud HTML; redistributable=false until legal review"
OUT = DATA / "dsc_strains_allbud.json"
CK_PATH = DATA / "dsc_strains_allbud.checkpoint.json"
SITEMAP_CACHE = DATA / "dsc_strains_allbud.sitemap_urls.json"

PRODUCT_RE = re.compile(
    r"^https://www\.allbud\.com/marijuana-strains/"
    r"(?!variety/|search/?$|effect/|symptom/|aroma/|taste/|strain-classification)"
    r"([a-z0-9\-]+)/([a-z0-9\-]+)/?$",
    re.I,
)
SKIP_TYPES = {"variety", "effect", "symptom", "aroma", "taste", "search"}


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
            out.append(doc)
    return out


def _uniq(seq: list[str]) -> list[str]:
    seen: set[str] = set()
    out: list[str] = []
    for x in seq:
        k = x.strip()
        if not k:
            continue
        lk = k.lower()
        if lk in seen:
            continue
        seen.add(lk)
        out.append(k)
    return out


def tax_links(html: str, kind: str) -> list[str]:
    """Collect /marijuana-strains/{kind}/... link labels."""
    labels: list[str] = []
    for m in re.finditer(
        rf'href=["\']/marijuana-strains/{kind}/[^"\']+["\'][^>]*>([^<]+)<',
        html or "",
        re.I,
    ):
        labels.append(html_lib.unescape(m.group(1)).strip())
    return _uniq(labels)


def parse_faq(blocks: list[dict]) -> dict:
    """Pull effects / symptoms / aromas / flavors / type hints from FAQPage."""
    out: dict = {}
    for block in blocks:
        if block.get("@type") != "FAQPage":
            continue
        for ent in block.get("mainEntity") or []:
            if not isinstance(ent, dict):
                continue
            q = str(ent.get("name") or "")
            ans = ent.get("acceptedAnswer") or {}
            text = str(ans.get("text") if isinstance(ans, dict) else ans or "")
            ql = q.lower()
            if "make you feel" in ql or "effects" in ql:
                m = re.search(r"effects?:\s*(.+)$", text, re.I)
                if m:
                    out["effects"] = _uniq([x.strip() for x in re.split(r"[,;]", m.group(1))])
            elif "help with" in ql or "may help" in ql:
                m = re.search(r"(?:help with|may help with)\s*(.+)$", text, re.I)
                if m:
                    out["symptoms"] = _uniq([x.strip() for x in re.split(r"[,;]", m.group(1))])
            elif "smell" in ql:
                m = re.search(r"smells?\s+(.+?)(?:\.|$)", text, re.I)
                if m:
                    out["aromas"] = _uniq([x.strip() for x in re.split(r"[,;]", m.group(1))])
            elif "taste" in ql:
                m = re.search(r"tastes?\s+(?:like\s+)?(.+?)(?:\.|$)", text, re.I)
                if m:
                    out["flavors"] = _uniq([x.strip() for x in re.split(r"[,;]", m.group(1))])
            elif "indica" in ql or "sativa" in ql or "hybrid" in ql or "type" in ql:
                out.setdefault("type_faq", text.strip()[:240])
    return out


def parse_percentages(html: str, text: str) -> dict:
    props: dict = {}
    # e.g. "50% Sativa /50% Indica THC: 24%"
    m = re.search(
        r"(\d+)\s*%\s*Sativa\s*/?\s*(\d+)\s*%\s*Indica",
        text,
        re.I,
    )
    if m:
        props["sativa_pct"] = int(m.group(1))
        props["indica_pct"] = int(m.group(2))
    else:
        m = re.search(r"(\d+)\s*%\s*Indica\s*/?\s*(\d+)\s*%\s*Sativa", text, re.I)
        if m:
            props["indica_pct"] = int(m.group(1))
            props["sativa_pct"] = int(m.group(2))
    m = re.search(r"THC\s*:\s*([\d.]+)\s*%", text, re.I)
    if m:
        thc = float(m.group(1))
        props["thc"] = thc
        props["thc_range"] = [thc, thc]
        props["chemistry"] = {"thc": thc, "thc_range": [thc, thc]}
    m = re.search(r"CBD\s*:\s*([\d.]+)\s*%", text, re.I)
    if m:
        cbd = float(m.group(1))
        props["cbd"] = cbd
        props.setdefault("chemistry", {})
        props["chemistry"]["cbd"] = cbd
        props["chemistry"]["cbd_range"] = [cbd, cbd]
        props["cbd_range"] = [cbd, cbd]
    # qualitative THC when numeric missing
    if "thc" not in props:
        m = re.search(r"\b(High|Medium|Low)\s+THC\b", text, re.I)
        if m:
            props["thc_level"] = m.group(1).title()
            props.setdefault("chemistry", {})["thc_level"] = props["thc_level"]
    # strain-percentages class snippet
    m = re.search(r'class="[^"]*strain-percentages[^"]*"[^>]*>(.*?)</', html or "", re.I | re.S)
    if m and "strain_percent_label" not in props:
        label = clean(m.group(1))
        if label:
            props["strain_percent_label"] = label[:120]
    return props


def parse_product(html: str, url: str) -> dict:
    blocks = extract_json_ld(html)
    product = next((b for b in blocks if b.get("@type") == "Product"), {})
    breadcrumb = next((b for b in blocks if b.get("@type") == "BreadcrumbList"), {})

    name = str(product.get("name") or "").strip()
    if not name:
        m = re.search(r"<h1[^>]*>(.*?)</h1>", html or "", re.I | re.S)
        name = clean(m.group(1)) if m else ""
    if not name:
        # breadcrumb last item
        for el in reversed(breadcrumb.get("itemListElement") or []):
            item = el.get("item") if isinstance(el, dict) else None
            if isinstance(item, dict) and item.get("name"):
                name = str(item["name"]).strip()
                break
    if not name:
        name = urlparse(url).path.rstrip("/").split("/")[-1].replace("-", " ")

    # strip trailing " Marijuana Strain" from h1 if present
    name = re.sub(r"\s+Marijuana Strain\s*$", "", name, flags=re.I).strip()

    parts = [p for p in urlparse(url).path.strip("/").split("/") if p]
    type_slug = parts[-2] if len(parts) >= 2 else ""
    slug = parts[-1] if parts else ""
    type_ = type_slug.replace("-", " ") if type_slug and type_slug not in SKIP_TYPES else None

    description = html_lib.unescape(str(product.get("description") or "")).strip()
    if not description:
        m = re.search(
            r'class="[^"]*panel-body[^"]*well[^"]*description[^"]*"[^>]*>(.*?)</div>',
            html or "",
            re.I | re.S,
        )
        if m:
            description = clean(m.group(1))
    description = html_lib.unescape(description) if description else None

    images = product.get("image") or []
    if isinstance(images, str):
        images = [images]
    image = images[0] if images else None

    rating = None
    review_count = None
    agg = product.get("aggregateRating")
    if isinstance(agg, dict):
        try:
            rating = float(agg.get("ratingValue"))
        except (TypeError, ValueError):
            rating = None
        try:
            review_count = int(agg.get("reviewCount"))
        except (TypeError, ValueError):
            review_count = None

    text = clean(html)
    row: dict = {
        "name": name[:200],
        "name_norm": name_norm(name),
        "url": url.split("?")[0].split("#")[0],
        "source": SOURCE,
        "type": type_,
        "type_slug": type_slug or None,
        "slug": slug or None,
        "description": description[:4000] if description else None,
        "image_url": image,
        "rating": rating,
        "review_count": review_count,
    }

    effects = tax_links(html, "effect")
    flavors = tax_links(html, "taste")
    aromas = tax_links(html, "aroma")
    symptoms = tax_links(html, "symptom")
    faq = parse_faq(blocks)
    if not effects:
        effects = list(faq.get("effects") or [])
    if not flavors:
        flavors = list(faq.get("flavors") or [])
    if not aromas:
        aromas = list(faq.get("aromas") or [])
    if not symptoms:
        symptoms = list(faq.get("symptoms") or [])

    if effects:
        row["effects"] = effects
        row["top_effects"] = effects[:8]
    if flavors:
        row["flavors"] = flavors
        row["top_flavors"] = flavors[:8]
    if aromas:
        row["aromas"] = aromas
    if symptoms:
        row["symptoms"] = symptoms
        row["may_relieve"] = symptoms

    pct = parse_percentages(html, text)
    row.update({k: v for k, v in pct.items() if k != "chemistry"})
    if pct.get("chemistry"):
        row["chemistry"] = pct["chemistry"]

    grow = parse_grow_fields(text)
    for k, v in grow.items():
        if k == "chemistry" and isinstance(v, dict):
            chem = dict(row.get("chemistry") or {})
            chem.update(v)
            row["chemistry"] = chem
        elif k not in row or row.get(k) in (None, "", [], {}):
            row[k] = v

    # Keep a short excerpt for overflow / debugging (not full HTML)
    row["page_text_excerpt"] = text[:1800]
    # Drop empties
    return {k: v for k, v in row.items() if v not in (None, "", [], {})}


def load_sitemap_urls(*, delay: float, refresh: bool = False) -> list[str]:
    if SITEMAP_CACHE.exists() and not refresh:
        try:
            cached = json.loads(SITEMAP_CACHE.read_text(encoding="utf-8"))
            urls = [u for u in (cached.get("urls") or []) if PRODUCT_RE.match(u)]
            if urls:
                print(f"sitemap cache: {len(urls)} product URLs from {SITEMAP_CACHE.name}")
                return urls
        except (OSError, json.JSONDecodeError):
            pass

    print(f"fetching sitemap {SITEMAP_URL}")
    xml = polite_get(SITEMAP_URL, delay=delay, timeout=180)
    locs = re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", xml, re.I)
    urls: list[str] = []
    seen: set[str] = set()
    for loc in locs:
        u = html_lib.unescape(loc.strip()).split("?")[0].split("#")[0]
        if not PRODUCT_RE.match(u):
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
    print(f"sitemap: {len(locs)} locs -> {len(urls)} product URLs")
    return urls


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
        blockers=(blockers or [])[-30:],
    )


def stage_dump(*, reset: bool = True) -> dict:
    """Write dump → brain/data/staging/allbud.sqlite3 (typed + full raw_record)."""
    from brain.dsc_brain.staging import write_dump_to_staging  # noqa: WPS433

    if not OUT.exists():
        raise FileNotFoundError(OUT)
    st = write_dump_to_staging(OUT, source_id=SOURCE, reset=reset)
    print(
        "staging:",
        json.dumps(
            {k: st[k] for k in ("family", "staging_db", "count", "bulk", "store_raw", "stats") if k in st},
            indent=2,
            default=str,
        ),
        flush=True,
    )
    return st


def merge_staging() -> int:
    """Later step: merge staging into master (no attribute_kv / raw by default)."""
    from merge_staging_to_master import main as merge_main  # noqa: WPS433

    return merge_main(["--only", "allbud"])


def scrape(
    *,
    delay: float,
    limit: int | None,
    refresh_sitemap: bool,
    checkpoint_every: int,
    stage_every: int = 500,
) -> Path:
    urls = load_sitemap_urls(delay=delay, refresh=refresh_sitemap)
    if limit is not None:
        urls = urls[: max(0, limit)]

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
    consecutive_walls = 0
    scraped_this_run = 0
    last_staged_at = 0
    t0 = time.time()

    print(
        f"allbud: {len(urls)} urls queued; resume done={len(done)} dump_items={len(items)}",
        flush=True,
    )

    for idx, url in enumerate(urls, 1):
        if url in done and url in by_url:
            continue
        if url in done and url not in by_url:
            # checkpoint said done but dump missing — re-fetch
            done.discard(url)

        try:
            html = polite_get(url, delay=delay, timeout=60)
            if is_bot_wall(html):
                msg = f"BOT_WALL {url}"
                blockers.append(msg)
                ck.note_error(msg)
                consecutive_walls += 1
                print(f"  blocker: {msg}", flush=True)
                if consecutive_walls >= 5:
                    print("aborting: repeated bot walls", flush=True)
                    break
                continue
            consecutive_walls = 0
            row = parse_product(html, url)
            by_url[url] = row
            done.add(url)
            scraped_this_run += 1
        except Exception as exc:  # noqa: BLE001
            msg = f"{url}: {exc}"
            blockers.append(msg)
            ck.note_error(msg)
            if scraped_this_run and scraped_this_run % 50 == 0:
                print(f"  fail {msg}", flush=True)
            continue

        if scraped_this_run % checkpoint_every == 0 or idx == len(urls):
            items = list(by_url.values())
            save_checkpoint(ck, done, cursor=url)
            write_partial(
                items,
                note=f"partial checkpoint {len(items)}/{len(urls)}",
                blockers=blockers,
            )
            rate = scraped_this_run / max(1.0, time.time() - t0)
            print(
                f"  checkpoint items={len(items)} done={len(done)} "
                f"this_run={scraped_this_run} rate={rate:.2f}/s idx={idx}/{len(urls)}",
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
    write_partial(items, note="allbud sitemap scrape complete", blockers=blockers)
    print(
        f"wrote {OUT.name} count={len(items)} errors={len(ck.data.get('errors') or [])}",
        flush=True,
    )
    return OUT


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description="Scrape AllBud strains via sitemap")
    ap.add_argument("--delay", type=float, default=0.55, help="polite delay between requests")
    ap.add_argument("--limit", type=int, default=None, help="cap product pages (default: full sitemap)")
    ap.add_argument("--refresh-sitemap", action="store_true")
    ap.add_argument("--checkpoint-every", type=int, default=25)
    ap.add_argument(
        "--stage-every",
        type=int,
        default=500,
        help="rewrite staging sqlite every N dump items (0=disable mid-run)",
    )
    ap.add_argument("--sitemap-only", action="store_true", help="fetch/cache sitemap and exit")
    ap.add_argument("--stage", action="store_true", help="write staging sqlite after scrape (no merge)")
    ap.add_argument("--merge", action="store_true", help="merge staging into master (after stage)")
    ap.add_argument("--stage-only", action="store_true", help="skip scrape; stage existing dump")
    ap.add_argument("--merge-only", action="store_true", help="skip scrape; merge existing staging")
    ap.add_argument(
        "--stage-merge-only",
        action="store_true",
        help="skip scrape; stage existing dump then merge",
    )
    args = ap.parse_args(argv)

    if args.merge_only:
        return merge_staging()

    if args.stage_only:
        stage_dump(reset=True)
        return 0

    if args.stage_merge_only:
        stage_dump(reset=True)
        return merge_staging()

    if args.sitemap_only:
        urls = load_sitemap_urls(delay=args.delay, refresh=True)
        print(json.dumps({"sitemap_urls": len(urls), "sample": urls[:5]}, indent=2), flush=True)
        return 0

    scrape(
        delay=args.delay,
        limit=args.limit,
        refresh_sitemap=args.refresh_sitemap,
        checkpoint_every=max(5, args.checkpoint_every),
        stage_every=max(0, args.stage_every),
    )

    # Always leave staging current after a scrape pass; merge is explicit/later.
    stage_dump(reset=True)
    if args.merge:
        return merge_staging()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
