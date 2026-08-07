#!/usr/bin/env python3
"""Scrape CannaConnection strain catalog (research corpus).

Index:   https://www.cannaconnection.com/strains?show_char={a-z|0-9}
Detail:  https://www.cannaconnection.com/strains/{slug}
Sitemap: https://www.cannaconnection.com/6_en_0_sitemap.xml (~1969 EN strains)

Checkpoint/resume, polite delay, rich grow/chem text capture.
redistributable=false until legal review.

If urllib hits Cloudflare / HTTP 403, falls back to a browser session
(browser-use CDP) for that request.
"""

from __future__ import annotations

import argparse
import gzip
import html as html_lib
import json
import re
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(ROOT))

from catalog_common import DATA, UA, name_norm, polite_get, write_dump, parse_grow_fields  # noqa: E402
from catalog_fetch import Checkpoint  # noqa: E402

SOURCE = "cannaconnection"
SOURCE_URL = "https://www.cannaconnection.com/strains"
SITEMAP_URL = "https://www.cannaconnection.com/6_en_0_sitemap.xml"
NOTE = "research scrape of public CannaConnection HTML; redistributable=false until legal review"
OUT = DATA / "dsc_strains_cannaconnection.json"
CK_PATH = DATA / "dsc_strains_cannaconnection.checkpoint.json"
URL_CACHE = DATA / "dsc_strains_cannaconnection.urls.json"

PRODUCT_RE = re.compile(
    r"^https://www\.cannaconnection\.com/strains/([a-z0-9\-]+)/?$",
    re.I,
)
SKIP_SLUGS = {
    "breeders",
    "breeders-list",
    "top-10-lists",
}
LETTERS = list("abcdefghijklmnopqrstuvwxyz") + ["0-9"]

BROWSER_UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)


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


def _uniq(seq: list[str]) -> list[str]:
    seen: set[str] = set()
    out: list[str] = []
    for x in seq:
        k = " ".join(str(x).split()).strip()
        if not k:
            continue
        lk = k.lower()
        if lk in seen or lk in {"unknown", "n/a", "-", "—"}:
            continue
        seen.add(lk)
        out.append(k)
    return out


def fetch_bytes_gzip_ok(url: str, *, timeout: int = 120, user_agent: str | None = None) -> bytes:
    """GET bytes; decompress gzip when server sends it (sitemap)."""
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": user_agent or UA,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Encoding": "gzip, deflate",
            "Accept-Language": "en-US,en;q=0.9",
        },
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        raw = resp.read()
        enc = (resp.headers.get("Content-Encoding") or "").lower()
        if enc == "gzip" or raw[:2] == b"\x1f\x8b":
            try:
                return gzip.decompress(raw)
            except OSError:
                return raw
        return raw


def browser_get(url: str, *, timeout: int = 90) -> str:
    """Fetch via browser-use CDP session (Cloudflare / 403 fallback)."""
    script = f"""
import json
new_tab({url!r})
wait_for_load()
html = js("return document.documentElement.outerHTML") or ""
print(json.dumps({{"ok": True, "len": len(html), "html": html}}))
"""
    try:
        proc = subprocess.run(
            ["browser-use"],
            input=script,
            text=True,
            capture_output=True,
            timeout=timeout,
            check=False,
        )
    except FileNotFoundError as exc:
        raise RuntimeError("browser-use CLI not available for CF fallback") from exc
    except subprocess.TimeoutExpired as exc:
        raise RuntimeError(f"browser-use timeout for {url}") from exc
    out = (proc.stdout or "").strip()
    if not out:
        err = (proc.stderr or "").strip()[:400]
        raise RuntimeError(f"browser-use empty stdout for {url}: {err}")
    # last JSON line
    last = out.splitlines()[-1]
    try:
        doc = json.loads(last)
    except json.JSONDecodeError as exc:
        raise RuntimeError(f"browser-use non-JSON for {url}: {last[:200]}") from exc
    html = str(doc.get("html") or "")
    if not html:
        raise RuntimeError(f"browser-use empty html for {url}")
    return html


def fetch_page(url: str, *, delay: float, timeout: int = 60, allow_browser: bool = True) -> tuple[str, str]:
    """Return (html, fetch_mode) where fetch_mode is urllib|browser."""
    time.sleep(max(0.0, delay))
    try:
        html = polite_get(url, delay=0.0, timeout=timeout)
        if is_bot_wall(html):
            raise RuntimeError("BOT_WALL")
        return html, "urllib"
    except Exception as exc:  # noqa: BLE001
        msg = str(exc)
        need_browser = allow_browser and (
            "BOT_WALL" in msg
            or "HTTP 403" in msg
            or "HTTP 429" in msg
            or "HTTP 503" in msg
        )
        if not need_browser:
            raise
        print(f"  browser fallback: {url} ({msg})", flush=True)
        html = browser_get(url, timeout=max(60, timeout))
        if is_bot_wall(html):
            raise RuntimeError(f"BOT_WALL (browser) {url}")
        return html, "browser"


def parse_pct_range(value: str) -> list[float] | None:
    m = re.search(
        r"(\d+(?:\.\d+)?)\s*[-–—]\s*(\d+(?:\.\d+)?)\s*%?",
        value or "",
    )
    if m:
        return [float(m.group(1)), float(m.group(2))]
    m = re.search(r"(\d+(?:\.\d+)?)\s*%", value or "")
    if m:
        v = float(m.group(1))
        return [v, v]
    m = re.search(r"(\d+(?:\.\d+)?)", value or "")
    if m and "%" in (value or ""):
        v = float(m.group(1))
        return [v, v]
    return None


def parse_weeks(value: str) -> list[int] | int | None:
    m = re.search(r"(\d+)\s*[-–—]\s*(\d+)\s*weeks?", value or "", re.I)
    if m:
        return [int(m.group(1)), int(m.group(2))]
    m = re.search(r"(\d+)\s*weeks?", value or "", re.I)
    if m:
        return int(m.group(1))
    # days
    m = re.search(r"(\d+)\s*[-–—]\s*(\d+)\s*days?", value or "", re.I)
    if m:
        return [int(m.group(1)), int(m.group(2))]
    return None


def extract_feature_map(html: str) -> dict[str, str | list[str]]:
    """Parse .feature-wrapper / .multifeature-wrapper data-sheet blocks."""
    out: dict[str, str | list[str]] = {}
    for m in re.finditer(
        r'<div class="feature-wrapper">\s*'
        r'<div class="feature-title">(.*?)</div>\s*'
        r'<div class="feature-value">(.*?)</div>\s*</div>',
        html or "",
        re.I | re.S,
    ):
        title = clean(m.group(1))
        value = clean(m.group(2))
        if title and value:
            out[title] = value
    for m in re.finditer(
        r'<div class="multifeature-wrapper">(.*?)</div>\s*(?=<div class="(?:multi)?feature|</div>\s*</div>\s*</div>)',
        html or "",
        re.I | re.S,
    ):
        block = m.group(1)
        tm = re.search(
            r'class="[^"]*feature-title[^"]*"[^>]*>(.*?)</div>',
            block,
            re.I | re.S,
        )
        if not tm:
            continue
        title = clean(tm.group(1))
        vals = [
            clean(x)
            for x in re.findall(
                r'class="[^"]*feature-value[^"]*"[^>]*>(.*?)</div>',
                block,
                re.I | re.S,
            )
        ]
        vals = _uniq(vals)
        if title and vals:
            out[title] = vals
    return out


def extract_grow_sheet(html: str) -> dict[str, str]:
    """Parse below-content <dl class="data-sheet"> grow facts."""
    out: dict[str, str] = {}
    # Prefer the below-content block (grow sheet) when present.
    scope = html or ""
    m = re.search(
        r'<div class="below-content">(.*?)</div>\s*<div class="clearfix"',
        scope,
        re.I | re.S,
    )
    if m:
        scope = m.group(1)
    for m in re.finditer(r"<dt[^>]*>(.*?)</dt>\s*<dd[^>]*>(.*?)</dd>", scope, re.I | re.S):
        k = clean(m.group(1))
        v = clean(m.group(2))
        if k and v:
            out[k] = v
    return out


def extract_sections(about_html: str) -> dict[str, str]:
    """Split about tab into heading → body text (maximize grow/chem narrative)."""
    sections: dict[str, str] = {}
    parts = re.split(r"(?i)(<h[23][^>]*>.*?</h[23]>)", about_html or "")
    current = "intro"
    buf: list[str] = []
    for part in parts:
        if re.match(r"(?i)<h[23]", part or ""):
            text = clean(" ".join(buf))
            if text:
                sections[current] = text
            current = clean(part)[:160] or current
            buf = []
        else:
            buf.append(part or "")
    text = clean(" ".join(buf))
    if text:
        sections[current] = text
    return sections


def pick_section(sections: dict[str, str], *needles: str) -> str | None:
    for key, val in sections.items():
        low = key.lower()
        if any(n in low for n in needles):
            return val
    return None


def extract_breeders(html: str) -> list[dict]:
    out: list[dict] = []
    block = re.search(
        r'<div class="product-breeders">(.*?)</div>\s*</div>\s*</div>\s*<div class="tab-pane',
        html or "",
        re.I | re.S,
    )
    scope = block.group(1) if block else (html or "")
    for m in re.finditer(
        r'href=["\'](https?://[^"\']+/breeders/[^"\']+)["\'][^>]*title=["\']([^"\']+)["\']',
        scope,
        re.I,
    ):
        out.append({"name": html_lib.unescape(m.group(2)).strip(), "url": m.group(1)})
    # fallback: breeder-name divs
    if not out:
        for m in re.finditer(
            r'<div class="breeder-name">\s*([^<]+)\s*</div>',
            scope,
            re.I,
        ):
            name = clean(m.group(1))
            if name:
                out.append({"name": name})
    # dedupe
    seen: set[str] = set()
    uniq: list[dict] = []
    for b in out:
        k = name_norm(b.get("name") or "")
        if not k or k in seen:
            continue
        seen.add(k)
        uniq.append(b)
    return uniq


def parse_product(html: str, url: str) -> dict:
    slug = urlparse(url).path.rstrip("/").split("/")[-1]

    h1 = re.search(r"<h1[^>]*>(.*?)</h1>", html or "", re.I | re.S)
    name = clean(h1.group(1)) if h1 else ""
    if not name:
        # og:title or <title>
        m = re.search(
            r'<meta[^>]+property=["\']og:title["\'][^>]+content=["\']([^"\']+)["\']',
            html or "",
            re.I,
        )
        name = html_lib.unescape(m.group(1)).strip() if m else ""
        name = re.sub(r"\s*[|\-–].*$", "", name).strip()
    if not name:
        name = slug.replace("-", " ")

    meta_desc = None
    m = re.search(
        r'<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']+)["\']',
        html or "",
        re.I,
    )
    if m:
        meta_desc = html_lib.unescape(m.group(1)).strip()

    about_m = re.search(
        r'<div class="tab-pane active"[^>]*id="tab_about"[^>]*>(.*?)</div>\s*'
        r'(?:<div class="tab-pane|</div>\s*</div>\s*<div class="clearfix")',
        html or "",
        re.I | re.S,
    )
    # Simpler: grab rte inside tab_about
    if not about_m:
        about_m = re.search(
            r'id="tab_about"[^>]*>.*?<div class="rte">(.*?)</div>',
            html or "",
            re.I | re.S,
        )
        about_html = about_m.group(1) if about_m else ""
    else:
        rte = re.search(r'<div class="rte">(.*?)</div>', about_m.group(1), re.I | re.S)
        about_html = rte.group(1) if rte else about_m.group(1)

    sections = extract_sections(about_html)
    about_text = clean(about_html)
    grow_text = pick_section(sections, "growing", "grow your", "cultivat", "harvest")
    chem_text = pick_section(sections, "potency", "effect", "thc", "cbd", "cannabin")
    aroma_text = pick_section(sections, "aroma", "flavour", "flavor", "smell", "terpene")
    genetics_text = pick_section(sections, "genetic", "parent", "origin", "background")

    features = extract_feature_map(html)
    grow_sheet = extract_grow_sheet(html)
    breeders = extract_breeders(html)

    genetics = features.get("Genetics")
    parents = features.get("Parents")
    thc_raw = features.get("THC")
    cbd_raw = features.get("CBD")
    smells = features.get("Smell & flavour") or features.get("Smell & flavor")
    effects = features.get("Effect") or features.get("Effects")

    if isinstance(smells, str):
        smells = _uniq(re.split(r"[,;/]", smells))
    if isinstance(effects, str):
        effects = _uniq(re.split(r"[,;/]", effects))

    type_ = None
    sativa_pct = indica_pct = None
    if isinstance(genetics, str):
        type_ = genetics
        m = re.search(r"sativa[^\d]*(\d+)\s*%", genetics, re.I)
        if m:
            sativa_pct = int(m.group(1))
        m = re.search(r"indica[^\d]*(\d+)\s*%", genetics, re.I)
        if m:
            indica_pct = int(m.group(1))
        low = genetics.lower()
        if "auto" in low:
            pass
        elif "sativa" in low and "indica" not in low:
            type_ = "sativa"
        elif "indica" in low and "sativa" not in low:
            type_ = "indica"
        elif "hybrid" in low or ("indica" in low and "sativa" in low):
            type_ = "hybrid"
        # keep original label too
        type_label = genetics
    else:
        type_label = None

    chemistry: dict = {}
    thc_range = parse_pct_range(str(thc_raw or ""))
    cbd_range = parse_pct_range(str(cbd_raw or ""))
    if thc_range:
        chemistry["thc_range"] = thc_range
        chemistry["thc"] = thc_range[1]
    elif thc_raw and str(thc_raw).strip().lower() not in {"unknown", "n/a"}:
        chemistry["thc_label"] = str(thc_raw).strip()
    if cbd_range:
        chemistry["cbd_range"] = cbd_range
        chemistry["cbd"] = cbd_range[1]
    elif cbd_raw and str(cbd_raw).strip().lower() not in {"unknown", "n/a"}:
        chemistry["cbd_label"] = str(cbd_raw).strip()

    # Terpenes from narrative
    terp_hits = _uniq(
        re.findall(
            r"\b(myrcene|limonene|caryophyllene|pinene|linalool|humulene|terpinolene|"
            r"ocimene|bisabolol|terpineol|valencene|eucalyptol|camphene|nerolidol|"
            r"guaiol|isopulegol|cymene|phellandrene)\b",
            about_text,
            re.I,
        )
    )
    if terp_hits:
        chemistry["top_terpenes"] = [t.lower() for t in terp_hits]

    grow: dict = {}
    for k, v in grow_sheet.items():
        lk = k.lower()
        if "difficulty" in lk:
            grow["grow_difficulty"] = v
        elif "flowering type" in lk:
            grow["flowering_type"] = v
        elif "flowering time" in lk:
            grow["flowering_time"] = v
            weeks = parse_weeks(v)
            if weeks is not None:
                grow["flowering_weeks"] = weeks
                if isinstance(weeks, list):
                    grow["flowering_days"] = [weeks[0] * 7, weeks[1] * 7]
                else:
                    grow["flowering_days"] = weeks * 7
        elif "harvest" in lk:
            grow["harvest_outdoor"] = v
        elif "yield" in lk and "indoor" in lk:
            grow["yield_indoor"] = v
        elif "yield" in lk and "outdoor" in lk:
            grow["yield_outdoor"] = v
        elif "height" in lk and "indoor" in lk:
            grow["height_indoor"] = v
        elif "height" in lk and "outdoor" in lk:
            grow["height_outdoor"] = v
        else:
            grow[re.sub(r"[^a-z0-9]+", "_", lk).strip("_")] = v

    # Image
    image = None
    m = re.search(
        r'<img class="img-fluid"[^>]+src=["\']([^"\']+)["\']',
        html or "",
        re.I,
    )
    if m:
        image = m.group(1)
        if image.startswith("/"):
            image = "https://www.cannaconnection.com" + image

    row: dict = {
        "name": name[:200],
        "name_norm": name_norm(name),
        "url": url.split("?")[0].split("#")[0].rstrip("/"),
        "source": SOURCE,
        "slug": slug,
        "meta_description": meta_desc,
        "description": about_text[:12000] if about_text else meta_desc,
        "image_url": image,
        "type": type_,
        "type_label": type_label,
        "genetics": genetics if isinstance(genetics, str) else None,
        "parents": parents if isinstance(parents, str) else None,
        "sativa_pct": sativa_pct,
        "indica_pct": indica_pct,
        "breeders": [b.get("name") for b in breeders if b.get("name")],
        "breeder_links": breeders or None,
        "flavors": smells if isinstance(smells, list) else None,
        "effects": effects if isinstance(effects, list) else None,
        "top_effects": (effects[:8] if isinstance(effects, list) else None),
        "top_flavors": (smells[:8] if isinstance(smells, list) else None),
        "features": features or None,
        "grow_sheet": grow_sheet or None,
        "grow_text": grow_text[:8000] if grow_text else None,
        "chem_text": chem_text[:6000] if chem_text else None,
        "aroma_text": aroma_text[:4000] if aroma_text else None,
        "genetics_text": genetics_text[:4000] if genetics_text else None,
        "sections": {k: v[:4000] for k, v in sections.items()} if sections else None,
    }
    row.update(grow)
    if chemistry:
        row["chemistry"] = chemistry
        if "thc_range" in chemistry:
            row["thc_range"] = chemistry["thc_range"]
        if "cbd_range" in chemistry:
            row["cbd_range"] = chemistry["cbd_range"]
        if "thc" in chemistry:
            row["thc"] = chemistry["thc"]
        if "cbd" in chemistry:
            row["cbd"] = chemistry["cbd"]
        if "top_terpenes" in chemistry:
            row["top_terpenes"] = chemistry["top_terpenes"]

    # Text-fallback grow/chem parse on combined narrative
    combined = " ".join(
        x
        for x in (
            about_text,
            grow_text,
            chem_text,
            " ".join(f"{k}: {v}" for k, v in grow_sheet.items()),
            str(thc_raw or ""),
            str(cbd_raw or ""),
        )
        if x
    )
    fallback = parse_grow_fields(combined)
    for k, v in fallback.items():
        if k == "chemistry" and isinstance(v, dict):
            chem = dict(row.get("chemistry") or {})
            for ck, cv in v.items():
                chem.setdefault(ck, cv)
            row["chemistry"] = chem
        elif k not in row or row.get(k) in (None, "", [], {}):
            row[k] = v

    # Long excerpts prioritized for grow + chem (staging stores full row as raw)
    row["page_text_excerpt"] = combined[:5000]
    return {k: v for k, v in row.items() if v not in (None, "", [], {})}


def discover_urls(*, delay: float, refresh: bool = False) -> list[str]:
    if URL_CACHE.exists() and not refresh:
        try:
            cached = json.loads(URL_CACHE.read_text(encoding="utf-8"))
            urls = [u for u in (cached.get("urls") or []) if PRODUCT_RE.match(u)]
            if urls:
                print(f"url cache: {len(urls)} from {URL_CACHE.name}", flush=True)
                return urls
        except (OSError, json.JSONDecodeError):
            pass

    found: set[str] = set()

    # A–Z letter pages (canonical listing)
    for c in LETTERS:
        page = f"https://www.cannaconnection.com/strains?show_char={c}"
        try:
            html, mode = fetch_page(page, delay=delay)
        except Exception as exc:  # noqa: BLE001
            print(f"  list fail {c}: {exc}", flush=True)
            continue
        n0 = len(found)
        for m in PRODUCT_RE.finditer(html):
            slug = m.group(1).lower()
            if slug in SKIP_SLUGS:
                continue
            found.add(f"https://www.cannaconnection.com/strains/{slug}")
        # also absolute links without regex fullmatch edge cases
        for href in re.findall(
            r'href=["\'](https://www\.cannaconnection\.com/strains/[a-z0-9\-]+)/?["\']',
            html,
            re.I,
        ):
            slug = href.rstrip("/").rsplit("/", 1)[-1].lower()
            if slug in SKIP_SLUGS:
                continue
            found.add(f"https://www.cannaconnection.com/strains/{slug}")
        print(f"  letter {c}: +{len(found) - n0} total={len(found)} via={mode}", flush=True)

    # Sitemap union (gzip)
    try:
        time.sleep(max(0.0, delay))
        xml = fetch_bytes_gzip_ok(SITEMAP_URL, timeout=120).decode("utf-8", "replace")
        if is_bot_wall(xml):
            print("  sitemap: BOT_WALL", flush=True)
        else:
            locs = re.findall(r"<loc>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?</loc>", xml, re.I | re.S)
            n0 = len(found)
            for loc in locs:
                u = re.sub(r"<!\[CDATA\[|\]\]>", "", loc).strip().split("?")[0].split("#")[0].rstrip("/")
                m = PRODUCT_RE.match(u)
                if not m:
                    continue
                if m.group(1).lower() in SKIP_SLUGS:
                    continue
                found.add(u)
            print(f"  sitemap: +{len(found) - n0} total={len(found)}", flush=True)
    except Exception as exc:  # noqa: BLE001
        print(f"  sitemap fail: {exc}", flush=True)

    urls = sorted(found)
    URL_CACHE.write_text(
        json.dumps(
            {
                "built_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                "source_url": SOURCE_URL,
                "sitemap": SITEMAP_URL,
                "count": len(urls),
                "urls": urls,
            },
            ensure_ascii=False,
            indent=1,
        ),
        encoding="utf-8",
    )
    print(f"discovered {len(urls)} strain URLs", flush=True)
    return urls


def save_checkpoint(ck: Checkpoint, done: set[str], cursor: str | None = None) -> None:
    ck.data["done"] = sorted(done)
    if cursor is not None:
        ck.data["cursor"] = cursor
    ck.data["done_count"] = len(done)
    ck.save()


def write_partial(items: list[dict], *, note: str, blockers: list[str] | None = None, **extra) -> None:
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
        blockers=(blockers or [])[-40:],
        **extra,
    )


def stage_dump(*, reset: bool = True) -> dict:
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


def scrape(
    *,
    delay: float,
    limit: int | None,
    refresh_urls: bool,
    checkpoint_every: int,
    stage_every: int = 400,
    allow_browser: bool = True,
) -> Path:
    urls = discover_urls(delay=delay, refresh=refresh_urls)
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
    browser_fetches = 0
    last_staged_at = 0
    t0 = time.time()
    cf_status = "clear"

    print(
        f"cannaconnection: {len(urls)} urls; resume done={len(done)} dump_items={len(items)}",
        flush=True,
    )

    for idx, url in enumerate(urls, 1):
        if url in done and url in by_url:
            continue
        if url in done and url not in by_url:
            done.discard(url)

        try:
            html, mode = fetch_page(url, delay=delay, allow_browser=allow_browser)
            if mode == "browser":
                browser_fetches += 1
            consecutive_walls = 0
            row = parse_product(html, url)
            row["fetch_mode"] = mode
            by_url[url] = row
            done.add(url)
            scraped_this_run += 1
        except Exception as exc:  # noqa: BLE001
            msg = f"{url}: {exc}"
            blockers.append(msg)
            ck.note_error(msg)
            if "BOT_WALL" in str(exc) or "HTTP 403" in str(exc):
                consecutive_walls += 1
                cf_status = "blocked"
                print(f"  blocker: {msg}", flush=True)
                if consecutive_walls >= 5:
                    print("aborting: repeated Cloudflare / bot walls", flush=True)
                    break
            continue

        if scraped_this_run % checkpoint_every == 0 or idx == len(urls):
            items = list(by_url.values())
            save_checkpoint(ck, done, cursor=url)
            write_partial(
                items,
                note=f"partial checkpoint {len(items)}/{len(urls)}",
                blockers=blockers,
                cf_status=cf_status,
                browser_fetches=browser_fetches,
            )
            rate = scraped_this_run / max(1.0, time.time() - t0)
            print(
                f"  checkpoint items={len(items)} done={len(done)} "
                f"this_run={scraped_this_run} rate={rate:.2f}/s "
                f"idx={idx}/{len(urls)} browser={browser_fetches} cf={cf_status}",
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
        note="cannaconnection A-Z + sitemap scrape complete"
        if consecutive_walls < 5
        else "cannaconnection scrape aborted (CF/bot wall)",
        blockers=blockers,
        cf_status=cf_status,
        browser_fetches=browser_fetches,
        auth_needed=[b for b in blockers if "BOT_WALL" in b or "HTTP 403" in b][:20],
    )
    print(
        f"wrote {OUT.name} count={len(items)} errors={len(ck.data.get('errors') or [])} "
        f"cf={cf_status} browser_fetches={browser_fetches}",
        flush=True,
    )
    return OUT


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description="Scrape CannaConnection strains A-Z")
    ap.add_argument("--delay", type=float, default=0.45)
    ap.add_argument("--limit", type=int, default=None, help="cap detail pages (default: full catalog)")
    ap.add_argument("--refresh-urls", action="store_true")
    ap.add_argument("--checkpoint-every", type=int, default=25)
    ap.add_argument(
        "--stage-every",
        type=int,
        default=400,
        help="rewrite staging sqlite every N dump items (0=disable mid-run)",
    )
    ap.add_argument("--discover-only", action="store_true")
    ap.add_argument("--stage", action="store_true", help="write staging sqlite after scrape")
    ap.add_argument("--stage-only", action="store_true")
    ap.add_argument("--no-browser", action="store_true", help="disable browser CF fallback")
    ap.add_argument("--smoke", type=int, default=0, help="scrape N pages then stage (quick test)")
    args = ap.parse_args(argv)

    if args.stage_only:
        stage_dump(reset=True)
        return 0
    if args.discover_only:
        urls = discover_urls(delay=args.delay, refresh=True)
        print(json.dumps({"count": len(urls), "sample": urls[:8]}, indent=2))
        return 0

    limit = args.limit
    if args.smoke and args.smoke > 0:
        limit = args.smoke

    scrape(
        delay=max(0.05, args.delay),
        limit=limit,
        refresh_urls=args.refresh_urls,
        checkpoint_every=max(5, args.checkpoint_every),
        stage_every=args.stage_every,
        allow_browser=not args.no_browser,
    )
    if args.stage or args.smoke:
        stage_dump(reset=True)
    elif OUT.exists():
        # Always stage full raw at end (deliverable)
        stage_dump(reset=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
