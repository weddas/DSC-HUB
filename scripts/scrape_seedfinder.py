#!/usr/bin/env python3
"""SeedFinder.eu full variety scrape (research corpus).

JSON API dead since 2024-07-01 — use sitemap (preferred) or alphabetical pages.
~40k English /en/strain-info/{strain}/{breeder} detail pages.

Writes:
  homeassistant/data/dsc_strains_seedfinder.json
  brain/data/staging/seedfinder.sqlite3  (full raw_record; lineage preserved)

Master merge is deferred:
  python scripts/merge_staging_to_master.py --only seedfinder

redistributable=false until legal review. Cloudflare challenge → stop + report URL.
"""

from __future__ import annotations

import argparse
import gzip
import html as html_lib
import io
import json
import random
import re
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(ROOT))

from catalog_common import (  # noqa: E402
    DATA,
    UA,
    name_norm,
    parse_grow_fields,
    write_dump,
)
from catalog_fetch import Checkpoint  # noqa: E402
from lineage_to_mermaid import enrich_lineage_fields  # noqa: E402
from brain.dsc_brain.corpus import (  # noqa: E402
    connect,
    corpus_stats,
    ensure_source,
    ingest_strain_row,
)
from brain.dsc_brain.staging import init_staging  # noqa: E402

SOURCE_ID = "seedfinder"
SOURCE_URL = "https://seedfinder.eu/"
SITEMAP_INDEX = "https://seedfinder.eu/sitemap/sitemap-index.xml"
OUT_DUMP = DATA / "dsc_strains_seedfinder.json"
CK_PATH = DATA / "dsc_strains_seedfinder.checkpoint.json"
URL_CACHE = DATA / "dsc_strains_seedfinder.urls.json"
NOTE = "research scrape; redistributable=false until legal review; JSON API dead 2024-07-01"

STRAIN_RE = re.compile(
    r"^https://seedfinder\.eu/en/strain-info/([^/]+)/([^/]+)/?$",
    re.I,
)
ALPHA_LETTERS = list("abcdefghijklmnopqrstuvwxyz") + ["1234567890"]


class CloudflareBlocked(RuntimeError):
    def __init__(self, url: str, detail: str = ""):
        self.url = url
        self.detail = detail
        super().__init__(f"Cloudflare/bot wall at {url}" + (f" ({detail})" if detail else ""))


def clean_html(html: str) -> str:
    t = re.sub(r"(?is)<script.*?</script>", " ", html or "")
    t = re.sub(r"(?is)<style.*?</style>", " ", t)
    t = re.sub(r"(?is)<[^>]+>", " ", t)
    return re.sub(r"\s+", " ", html_lib.unescape(t)).strip()


def is_bot_wall(html: str, status_hint: str = "") -> bool:
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
    if "403" in status_hint or "401" in status_hint:
        return True
    if len(low) < 1500 and ("cloudflare" in low and "challenge" in low):
        return True
    return False


def fetch_bytes(url: str, *, timeout: int = 120) -> tuple[bytes, int, str]:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": UA,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.read(), int(getattr(resp, "status", 200) or 200), resp.geturl()
    except urllib.error.HTTPError as exc:
        body = exc.read() if hasattr(exc, "read") else b""
        text = body.decode("utf-8", errors="replace") if body else ""
        # 429/401/403/bot-wall → hard stop (caller flushes dump+staging; no spin).
        if exc.code in (401, 403, 429) or is_bot_wall(text, str(exc.code)):
            raise CloudflareBlocked(url, f"HTTP {exc.code}") from exc
        raise RuntimeError(f"HTTP {exc.code} for {url}") from exc


def polite_bytes(url: str, *, delay: float, timeout: int = 90) -> tuple[bytes, int, str]:
    # Base delay plus jitter into ~[delay, min(delay*2, delay+1.5)] (e.g. 1.5 → 1.5–3.0s).
    base = max(0.5, float(delay))
    hi = min(base * 2.0, base + 1.5)
    time.sleep(random.uniform(base, max(base, hi)))
    return fetch_bytes(url, timeout=timeout)


def polite_text(url: str, *, delay: float, timeout: int = 90) -> str:
    data, status, final = polite_bytes(url, delay=delay, timeout=timeout)
    text = data.decode("utf-8", errors="replace")
    if is_bot_wall(text, str(status)):
        raise CloudflareBlocked(final or url, f"status={status}")
    return text


def slug_to_title(slug: str) -> str:
    s = unquote(slug or "").replace("_", " ").replace("-", " ")
    s = re.sub(r"\s+", " ", s).strip()
    if not s:
        return ""
    # Keep short tokens uppercase-ish; otherwise title-case.
    parts = []
    for tok in s.split(" "):
        if tok.isupper() or re.fullmatch(r"[A-Za-z]\d+", tok):
            parts.append(tok.upper() if len(tok) <= 3 else tok.capitalize())
        else:
            parts.append(tok.capitalize() if tok.islower() else tok)
    return " ".join(parts)


def normalize_strain_url(url: str) -> str | None:
    m = STRAIN_RE.match((url or "").split("?")[0].split("#")[0].rstrip("/"))
    if not m:
        return None
    strain, breeder = m.group(1), m.group(2)
    return f"https://seedfinder.eu/en/strain-info/{strain}/{breeder}".lower()


def discover_sitemap(*, delay: float) -> list[str]:
    print(f"sitemap index: {SITEMAP_INDEX}")
    idx = polite_text(SITEMAP_INDEX, delay=delay)
    smaps = re.findall(r"<loc>([^<]+)</loc>", idx)
    print(f"  child sitemaps: {len(smaps)}")
    urls: set[str] = set()
    for sm in smaps:
        print(f"  fetching {sm}")
        data, status, final = polite_bytes(sm, delay=delay)
        if is_bot_wall(data.decode("utf-8", errors="replace")[:4000], str(status)):
            raise CloudflareBlocked(final or sm, "sitemap gzip/body challenge")
        if sm.endswith(".gz") or data[:2] == b"\x1f\x8b":
            xml = gzip.GzipFile(fileobj=io.BytesIO(data)).read().decode("utf-8", errors="replace")
        else:
            xml = data.decode("utf-8", errors="replace")
        locs = re.findall(r"<loc>([^<]+)</loc>", xml)
        n_before = len(urls)
        for loc in locs:
            nu = normalize_strain_url(loc)
            if nu:
                urls.add(nu)
        print(f"    locs={len(locs)} new_strain={len(urls) - n_before} total={len(urls)}")
    return sorted(urls)


def discover_alpha(*, delay: float) -> list[str]:
    urls: set[str] = set()
    for letter in ALPHA_LETTERS:
        page = f"https://seedfinder.eu/en/database/strains/alphabetical/{letter}/"
        print(f"alpha: {page}")
        try:
            html = polite_text(page, delay=delay)
        except CloudflareBlocked:
            raise
        except Exception as exc:  # noqa: BLE001
            print(f"  skip {letter}: {exc}")
            continue
        for m in re.finditer(
            r"https://seedfinder\.eu/(?:en/)?strain-info/[A-Za-z0-9_\-%\.]+/[A-Za-z0-9_\-%\.]+",
            html,
            re.I,
        ):
            nu = normalize_strain_url(m.group(0))
            if nu:
                urls.add(nu)
        for m in re.finditer(
            r'href=["\'](/en/strain-info/[A-Za-z0-9_\-%\.]+/[A-Za-z0-9_\-%\.]+/?)["\']',
            html,
            re.I,
        ):
            nu = normalize_strain_url("https://seedfinder.eu" + m.group(1))
            if nu:
                urls.add(nu)
        print(f"  letter={letter} total={len(urls)}")
    return sorted(urls)


def load_or_discover_urls(*, mode: str, delay: float, refresh: bool) -> list[str]:
    if URL_CACHE.exists() and not refresh:
        try:
            doc = json.loads(URL_CACHE.read_text(encoding="utf-8"))
            urls = [u for u in (doc.get("urls") or []) if normalize_strain_url(u)]
            if urls:
                print(f"url cache: {URL_CACHE.name} count={len(urls)}")
                return sorted(set(normalize_strain_url(u) for u in urls if normalize_strain_url(u)))
        except (OSError, json.JSONDecodeError):
            pass
    if mode == "alpha":
        urls = discover_alpha(delay=delay)
    elif mode == "both":
        urls = sorted(set(discover_sitemap(delay=delay)) | set(discover_alpha(delay=delay)))
    else:
        urls = discover_sitemap(delay=delay)
        if len(urls) < 1000:
            print("sitemap thin — falling back to alphabetical crawl")
            urls = sorted(set(urls) | set(discover_alpha(delay=delay)))
    URL_CACHE.write_text(
        json.dumps(
            {
                "built_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                "count": len(urls),
                "mode": mode,
                "urls": urls,
            },
            ensure_ascii=False,
            separators=(",", ":"),
        ),
        encoding="utf-8",
    )
    print(f"wrote url cache {URL_CACHE.name} count={len(urls)}")
    return urls


def _first_h1(html: str) -> str:
    m = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.I | re.S)
    return clean_html(m.group(1)) if m else ""


def _breed_by(html: str) -> str:
    m = re.search(r"(?is)<small[^>]*>\s*breed\s+by\s+([^<]+)</small>", html)
    if m:
        return clean_html(m.group(1))
    m = re.search(
        r'href="https://seedfinder\.eu/en/database/breeder/[^"]+"[^>]*>\s*([^<]+)\s*<',
        html,
        re.I,
    )
    if m:
        return clean_html(m.group(1))
    return ""


def _basic_infos(html: str) -> str:
    m = re.search(
        r"(?is)<h2[^>]*>\s*Basic infos\s*</h2>\s*<p>(.*?)</p>",
        html,
    )
    return clean_html(m.group(1)) if m else ""


def _description(html: str) -> str:
    m = re.search(
        r'(?is)<h2[^>]*id="basic-info"[^>]*>.*?</h2>\s*<p>(.*?)</p>',
        html,
    )
    return clean_html(m.group(1)) if m else ""


def _parse_type(basic: str, text: str) -> str | None:
    hay = f"{basic} {text}".lower()
    if "indica / sativa" in hay or "indica/sativa" in hay:
        return "hybrid"
    if re.search(r"\bhybrid\b", hay):
        return "hybrid"
    if re.search(r"\bindica\b", hay) and not re.search(r"\bsativa\b", hay):
        return "indica"
    if re.search(r"\bsativa\b", hay) and not re.search(r"\bindica\b", hay):
        return "sativa"
    return None


def _parse_seed_gender(basic: str) -> str | None:
    low = (basic or "").lower()
    if "feminized" in low:
        return "feminized"
    if "regular" in low and "seed" in low:
        return "regular"
    if "auto" in low:
        return "autoflower"
    return None


def _parse_flowering(basic: str, text: str) -> int | list[int] | None:
    for src in (basic, text):
        m = re.search(
            r"(?i)flowering time of\s*[±~]?\s*(\d+)\s*[-–]\s*(\d+)\s*days?",
            src,
        )
        if m:
            return [int(m.group(1)), int(m.group(2))]
        m = re.search(r"(?i)flowering time of\s*[±~]?\s*(\d+)\s*days?", src)
        if m:
            return int(m.group(1))
        m = re.search(
            r"(?i)average flowering time of about\s*(\d+)\s*days?",
            src,
        )
        if m:
            return int(m.group(1))
    return None


def _parse_cultivation(basic: str) -> list[str]:
    low = (basic or "").lower()
    out = []
    if "indoors" in low or "indoor" in low:
        out.append("indoor")
    if "outdoors" in low or "outdoor" in low:
        out.append("outdoor")
    if "greenhouse" in low:
        out.append("greenhouse")
    return out


def _parse_parents(html: str, self_url: str) -> list[dict[str, str]]:
    """Direct parents from the top of the lineage tree (A x B)."""
    m = re.search(r'(?is)id="lineage"(.*?)(?:id="hybrids"|id="comments"|id="uploads")', html)
    if not m:
        return []
    chunk = m.group(1)
    # First <li> under lineage usually has self »»» ParentA x ParentB
    first_li = re.search(r"(?is)<li[^>]*>(.*?)</li>", chunk)
    block = first_li.group(1) if first_li else chunk[:2500]
    self_norm = normalize_strain_url(self_url) or self_url.rstrip("/").lower()
    parents: list[dict[str, str]] = []
    seen: set[str] = set()
    for hm in re.finditer(
        r'href=["\'](https://seedfinder\.eu/en/strain-info/[^"\']+)["\'][^>]*>([^<]+)',
        block,
        re.I,
    ):
        href = normalize_strain_url(hm.group(1))
        name = clean_html(hm.group(2))
        if not href or not name or "»" in name:
            continue
        if href == self_norm:
            continue
        if href in seen:
            continue
        seen.add(href)
        path = urlparse(href).path.strip("/").split("/")
        breeder_slug = path[-1] if len(path) >= 2 else ""
        parents.append(
            {
                "name": name,
                "name_norm": name_norm(name),
                "breeder": slug_to_title(breeder_slug),
                "url": href,
            }
        )
        if len(parents) >= 2:
            break
    return parents


def _section_html(html: str, section_id: str) -> str | None:
    """Raw HTML for a js-target / card section by id (as published)."""
    m = re.search(
        rf'(?is)(<div[^>]*\bid=["\']{re.escape(section_id)}["\'][^>]*>)(.*?)(?=<div[^>]*\bid=["\'](?:reviews|degustation|gallery|comparisons|lineage|hybrids|comments|uploads|awards)["\']|$)',
        html,
    )
    if not m:
        return None
    return (m.group(1) + m.group(2)).strip() or None


def _strain_links_in(html_chunk: str, self_url: str | None = None) -> list[dict[str, str]]:
    self_norm = normalize_strain_url(self_url or "") if self_url else None
    out: list[dict[str, str]] = []
    seen: set[str] = set()
    for hm in re.finditer(
        r'href=["\'](https://seedfinder\.eu/en/strain-info/[^"\']+)["\'][^>]*>([^<]+)',
        html_chunk or "",
        re.I,
    ):
        href = normalize_strain_url(hm.group(1))
        name = clean_html(hm.group(2))
        if not href or not name or "»" in name:
            continue
        if self_norm and href == self_norm:
            continue
        if href in seen:
            continue
        seen.add(href)
        path = urlparse(href).path.strip("/").split("/")
        breeder_slug = path[-1] if len(path) >= 2 else ""
        out.append(
            {
                "name": name,
                "name_norm": name_norm(name),
                "breeder": slug_to_title(breeder_slug),
                "breeder_slug": breeder_slug,
                "url": href,
            }
        )
    return out


def _lineage_links(html: str, self_url: str) -> list[dict[str, str]]:
    """Full unique strain graph from lineage section — no artificial cap."""
    chunk = _section_html(html, "lineage") or ""
    if not chunk:
        m = re.search(
            r'(?is)id="lineage"(.*?)(?:id="hybrids"|id="comments"|id="uploads")',
            html,
        )
        chunk = m.group(1) if m else ""
    return _strain_links_in(chunk, self_url)


def _meta_props(html: str) -> dict[str, str]:
    out: dict[str, str] = {}
    for m in re.finditer(
        r'(?is)<meta\s+(?:[^>]*?)(?:name|property)=["\']([^"\']+)["\'][^>]*?content=["\']([^"\']*)["\']',
        html,
    ):
        out[m.group(1)] = html_lib.unescape(m.group(2))
    for m in re.finditer(
        r'(?is)<meta\s+(?:[^>]*?)content=["\']([^"\']*)["\'][^>]*?(?:name|property)=["\']([^"\']+)["\']',
        html,
    ):
        out.setdefault(m.group(2), html_lib.unescape(m.group(1)))
    canon = re.search(r'(?is)<link[^>]+rel=["\']canonical["\'][^>]+href=["\']([^"\']+)["\']', html)
    if canon:
        out["canonical"] = canon.group(1)
    title = re.search(r"(?is)<title[^>]*>(.*?)</title>", html)
    if title:
        out["title"] = clean_html(title.group(1))
    return out


def _json_ld_blocks(html: str) -> list[Any]:
    blocks: list[Any] = []
    for m in re.finditer(
        r'(?is)<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
        html,
    ):
        raw = m.group(1).strip()
        if not raw:
            continue
        try:
            blocks.append(json.loads(raw))
        except json.JSONDecodeError:
            blocks.append({"_raw": raw})
    return blocks


def _image_urls(html: str) -> list[str]:
    urls: list[str] = []
    seen: set[str] = set()
    for m in re.finditer(
        r'(?:src|data-src|:src)=["\'](https://seedfinder\.eu/[^"\']+\.(?:webp|jpg|jpeg|png|gif)[^"\']*)["\']',
        html,
        re.I,
    ):
        u = m.group(1)
        if u not in seen:
            seen.add(u)
            urls.append(u)
    return urls


def _breeder_urls(html: str) -> list[str]:
    return sorted(
        set(
            re.findall(
                r'https://seedfinder\.eu/en/database/breeder/[A-Za-z0-9_\-%\.]+',
                html,
                re.I,
            )
        )
    )


def parse_detail(html: str, url: str) -> dict[str, Any]:
    """Extract all available props; keep full HTML for staging raw_record.

    Does not invent values — only fields present on the page (or URL slugs).
    """
    nu = normalize_strain_url(url) or url.rstrip("/")
    path = urlparse(nu).path.strip("/").split("/")
    strain_slug = path[-2] if len(path) >= 2 else ""
    breeder_slug = path[-1] if path else ""

    name = _first_h1(html) or slug_to_title(strain_slug)
    breeder = _breed_by(html) or slug_to_title(breeder_slug)
    basic = _basic_infos(html)
    desc = _description(html)
    text = clean_html(html)
    grow = parse_grow_fields(f"{basic} {desc} {text}")
    flowering = _parse_flowering(basic, desc) or grow.get("flowering_days")
    parents = _parse_parents(html, nu)
    lineage_html = _section_html(html, "lineage")
    hybrids_html = _section_html(html, "hybrids")
    lineage_tree = _lineage_links(html, nu)
    hybrids = _strain_links_in(hybrids_html or "", nu)
    lineage_str = " x ".join(p["name"] for p in parents) if parents else None

    type_ = _parse_type(basic, desc) or grow.get("type")
    chem: dict[str, Any] = {}
    if isinstance(grow.get("chemistry"), dict):
        chem.update(grow["chemistry"])
    if grow.get("thc_range"):
        chem["thc_range"] = grow["thc_range"]
    if grow.get("cbd_range"):
        chem["cbd_range"] = grow["cbd_range"]

    sections_html = {
        sid: _section_html(html, sid)
        for sid in (
            "reviews",
            "degustation",
            "gallery",
            "comparisons",
            "lineage",
            "hybrids",
            "comments",
            "uploads",
            "awards",
        )
    }
    sections_html = {k: v for k, v in sections_html.items() if v}

    meta = _meta_props(html)
    images = _image_urls(html)
    ld_json = _json_ld_blocks(html)

    # Mermaid from verified parents only (never invent).
    lin = enrich_lineage_fields(
        child_name=name,
        lineage_text=lineage_str,
        source=SOURCE_ID,
        existing_parents=parents or None,
    )

    bank_props: dict[str, Any] = {
        "breeder_slug": breeder_slug,
        "strain_slug": strain_slug,
        "seed_gender": _parse_seed_gender(basic),
        "cultivation": _parse_cultivation(basic),
        "parents": parents,
        "lineage": lineage_str,
        "lineage_tree": lineage_tree,
        "lineage_structured": lin.get("lineage_structured"),
        "lineage_mermaid": lin.get("lineage_mermaid"),
        "hybrids": hybrids,
        "meta": meta,
        "images": images,
        "breeder_urls": _breeder_urls(html),
        "json_ld": ld_json,
        "html_bytes": len(html.encode("utf-8", errors="replace")),
        "page_text_chars": len(text),
    }
    # Fold every grow parse hit into bank_props (no invention — only matches).
    for k, v in grow.items():
        if v not in (None, "", [], {}):
            bank_props[k] = v

    row: dict[str, Any] = {
        "name": name[:200],
        "name_norm": name_norm(name),
        "breeder": (breeder[:200] if breeder else None),
        "url": nu,
        "source": SOURCE_ID,
        "type": type_,
        "seed_gender": _parse_seed_gender(basic),
        "cultivation": _parse_cultivation(basic) or None,
        "flowering_days": flowering,
        "height_cm": grow.get("height_cm"),
        "yield_indoor": grow.get("yield_indoor"),
        "yield_outdoor": grow.get("yield_outdoor"),
        "thc_range": grow.get("thc_range"),
        "cbd_range": grow.get("cbd_range"),
        "chemistry": chem or None,
        "lineage": lineage_str or lin.get("lineage"),
        "parents": parents or None,
        "lineage_tree": lineage_tree or None,
        "lineage_structured": lin.get("lineage_structured"),
        "lineage_mermaid": lin.get("lineage_mermaid"),
        "hybrids": hybrids or None,
        "genetic_background": lineage_str,
        "description": desc or None,
        "basic_infos": basic or None,
        "page_text": text,
        "page_text_excerpt": text[:2000],
        "lineage_html": lineage_html,
        "hybrids_html": hybrids_html,
        "sections_html": sections_html or None,
        "meta": meta or None,
        "images": images or None,
        "json_ld": ld_json or None,
        "html_raw": html,
        "bank_props": bank_props,
    }
    if lin.get("followup_gap"):
        row["followup_gaps"] = [lin["followup_gap"]]
    # Keep all non-empty props; always retain lineage/html/raw keys even if empty-ish.
    keep_always = {
        "name",
        "name_norm",
        "breeder",
        "url",
        "source",
        "lineage",
        "parents",
        "lineage_tree",
        "lineage_structured",
        "lineage_mermaid",
        "lineage_html",
        "hybrids",
        "hybrids_html",
        "sections_html",
        "page_text",
        "html_raw",
        "bank_props",
        "meta",
        "images",
        "json_ld",
    }
    return {
        k: v
        for k, v in row.items()
        if k in keep_always or v not in (None, "", [], {})
    }


def apply_lineage_mermaid(row: dict[str, Any]) -> dict[str, Any]:
    """Attach lineage_mermaid / lineage_structured from existing parents only.

    Never invents parents — reuses scrape-extracted parents / lineage string.
    """
    if row.get("lineage_mermaid") and row.get("lineage_structured"):
        return row
    parents = row.get("parents")
    # Prefer direct parents; do not treat flat lineage_tree as parent edges
    # (that list is a unique-link graph, not a verified pedigree).
    lin = enrich_lineage_fields(
        child_name=str(row.get("name") or "") or None,
        lineage_text=str(row.get("lineage") or "") or None,
        source=SOURCE_ID,
        existing_parents=parents if isinstance(parents, list) else None,
    )
    if lin.get("lineage") and not row.get("lineage"):
        row["lineage"] = lin["lineage"]
    if lin.get("lineage_structured") is not None:
        row["lineage_structured"] = lin["lineage_structured"]
    if lin.get("lineage_mermaid"):
        row["lineage_mermaid"] = lin["lineage_mermaid"]
    gap = lin.get("followup_gap")
    if gap:
        row.setdefault("followup_gaps", [])
        if isinstance(row["followup_gaps"], list):
            row["followup_gaps"].append(gap)
    bp = row.get("bank_props")
    if isinstance(bp, dict) and lin.get("lineage_mermaid"):
        bp["lineage_mermaid"] = lin["lineage_mermaid"]
        bp["lineage_structured"] = lin.get("lineage_structured")
    return row


def backfill_mermaid_items(items: list[dict]) -> int:
    n = 0
    for row in items:
        if not isinstance(row, dict):
            continue
        before = row.get("lineage_mermaid")
        apply_lineage_mermaid(row)
        if row.get("lineage_mermaid") and not before:
            n += 1
    return n


def backfill_mermaid_staging(conn: Any) -> int:
    """Cheap: add lineage_mermaid into existing raw_record payloads (no re-fetch)."""
    n = 0
    rows = conn.execute("SELECT id, payload_json FROM raw_record").fetchall()
    for row in rows:
        try:
            payload = json.loads(row["payload_json"] if hasattr(row, "keys") else row[1])
        except (TypeError, json.JSONDecodeError):
            continue
        if not isinstance(payload, dict) or payload.get("lineage_mermaid"):
            continue
        apply_lineage_mermaid(payload)
        if not payload.get("lineage_mermaid"):
            continue
        rid = row["id"] if hasattr(row, "keys") else row[0]
        conn.execute(
            "UPDATE raw_record SET payload_json=? WHERE id=?",
            (json.dumps(payload, ensure_ascii=False, separators=(",", ":")), rid),
        )
        n += 1
    if n:
        conn.commit()
    return n


def row_for_dump(row: dict[str, Any]) -> dict[str, Any]:
    """JSON dump: all structured props + full lineage; bulky HTML only in staging."""
    apply_lineage_mermaid(row)
    skip = {"html_raw", "page_text", "sections_html", "lineage_html", "hybrids_html"}
    out = {k: v for k, v in row.items() if k not in skip}
    html = row.get("html_raw")
    if html is not None:
        out["html_bytes"] = len(html.encode("utf-8", errors="replace"))
        out["has_html_raw_in_staging"] = True
    if row.get("page_text") and not out.get("page_text_excerpt"):
        out["page_text_excerpt"] = str(row["page_text"])[:2000]
    out["has_lineage_html_in_staging"] = bool(row.get("lineage_html"))
    out["has_sections_html_in_staging"] = bool(row.get("sections_html"))
    return out


def load_existing_items() -> list[dict]:
    if not OUT_DUMP.exists():
        return []
    try:
        doc = json.loads(OUT_DUMP.read_text(encoding="utf-8"))
        return [i for i in (doc.get("items") or []) if isinstance(i, dict)]
    except (OSError, json.JSONDecodeError):
        return []


def flush_dump(items: list[dict], *, blockers: list[str], note: str) -> None:
    # Backfill mermaid on every rewrite (cheap; no network).
    backfill_mermaid_items(items)
    write_dump(
        OUT_DUMP,
        "strains",
        items,
        source=SOURCE_ID,
        source_url=SOURCE_URL,
        license=NOTE,
        redistributable=False,
        note=note,
        blockers=blockers[-50:],
        auth_needed=[b for b in blockers if "BOT_WALL" in b or "Cloudflare" in b][:20],
        html_in_staging_raw_record=True,
    )


def open_staging(reset: bool) -> Any:
    family_path = init_staging(
        SOURCE_ID,
        note="SeedFinder full scrape; html_raw+lineage in raw_record; redistributable=false",
    )
    conn = connect(family_path)
    ensure_source(
        conn,
        SOURCE_ID,
        "SeedFinder.eu",
        url=SOURCE_URL,
        license=NOTE,
        redistributable=False,
        note="sitemap + detail scrape; full html_raw in raw_record",
    )
    conn.commit()
    return conn, family_path


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--mode", choices=("sitemap", "alpha", "both"), default="sitemap")
    ap.add_argument("--delay", type=float, default=0.55, help="seconds between requests (≥0.5)")
    ap.add_argument("--limit", type=int, default=0, help="max detail pages (0=all)")
    ap.add_argument("--refresh-urls", action="store_true")
    ap.add_argument("--reset-staging", action="store_true")
    ap.add_argument(
        "--reset-progress",
        action="store_true",
        help="wipe dump + checkpoint (keep url cache) and re-scrape",
    )
    ap.add_argument("--skip-staging", action="store_true")
    ap.add_argument("--checkpoint-every", type=int, default=25)
    ap.add_argument(
        "--dump-every",
        type=int,
        default=500,
        help="rewrite JSON dump every N scraped pages (0=only on stop/complete); "
        "staging+checkpoint still flush every --checkpoint-every",
    )
    args = ap.parse_args(argv)

    delay = max(0.5, float(args.delay))
    dump_every = max(0, int(args.dump_every))

    if args.reset_progress:
        for p in (OUT_DUMP, CK_PATH):
            if p.exists():
                p.unlink()
                print(f"reset {p.name}")
        args.reset_staging = True

    ck = Checkpoint(CK_PATH)
    done_set = set(ck.data.get("done") or [])
    blockers: list[str] = []

    def persist_checkpoint() -> None:
        ck.data["done"] = sorted(done_set)
        ck.save()

    try:
        urls = load_or_discover_urls(mode=args.mode, delay=delay, refresh=args.refresh_urls)
    except CloudflareBlocked as exc:
        print(f"CF_BLOCKED {exc.url}")
        print(f"Open this URL in a browser and complete any challenge, then re-run:\n  {exc.url}")
        return 2

    items = load_existing_items()
    n_bf = backfill_mermaid_items(items)
    if n_bf:
        print(f"backfill dump lineage_mermaid: {n_bf}/{len(items)}")
        flush_dump(
            items,
            blockers=[],
            note="lineage_mermaid backfill; html_raw in staging",
        )
    # Rehydrate: dump rows lack html_raw; staging holds it. Resume skips done URLs.
    seen = {normalize_strain_url(str(i.get("url") or "")) for i in items}
    seen.discard(None)
    seen |= done_set

    staging_conn = None
    staging_path = None
    if not args.skip_staging:
        if args.reset_staging:
            from brain.dsc_brain.paths import staging_db_path

            p = staging_db_path("seedfinder")
            if p.exists():
                p.unlink()
                print(f"reset staging {p}")
        staging_conn, staging_path = open_staging(reset=args.reset_staging)
        print(f"staging: {staging_path}")
        n_st = backfill_mermaid_staging(staging_conn)
        if n_st:
            print(f"backfill staging lineage_mermaid: {n_st}")

    todo = [u for u in urls if u not in seen]
    if args.limit and args.limit > 0:
        remaining = max(0, args.limit - len(items))
        todo = todo[:remaining]
    print(f"urls={len(urls)} have={len(items)} todo={len(todo)} delay={delay}")

    stopped_url: str | None = None
    try:
        for i, url in enumerate(todo, 1):
            try:
                html = polite_text(url, delay=delay)
            except CloudflareBlocked as exc:
                stopped_url = exc.url
                blockers.append(f"BOT_WALL {exc.url}")
                ck.note_error(f"BOT_WALL {exc.url}")
                raise
            except Exception as exc:  # noqa: BLE001
                ck.note_error(f"{url}: {exc}")
                blockers.append(f"{url}: {exc}")
                continue

            row = parse_detail(html, url)
            if staging_conn is not None:
                # Full row including html_raw / section HTML → raw_record
                ingest_strain_row(
                    staging_conn,
                    row,
                    source_id=SOURCE_ID,
                    store_attrs=False,
                    store_raw=True,
                )
            # Keep dump-shaped rows in memory (no multi-GB html_raw list)
            items.append(row_for_dump(row))
            seen.add(url)
            done_set.add(url)

            if i % args.checkpoint_every == 0:
                persist_checkpoint()
                if staging_conn is not None:
                    staging_conn.commit()
                do_dump = dump_every > 0 and (i % dump_every == 0)
                if do_dump:
                    flush_dump(
                        items,
                        blockers=blockers,
                        note="partial checkpoint; html_raw in staging",
                    )
                print(
                    f"  checkpoint {len(done_set)}/{len(urls)} (+{i}/{len(todo)})"
                    + (" dump=flushed" if do_dump else " dump=skipped")
                )

    except CloudflareBlocked as exc:
        persist_checkpoint()
        flush_dump(items, blockers=blockers, note="stopped on Cloudflare; html_raw in staging")
        if staging_conn is not None:
            staging_conn.commit()
            stats = corpus_stats(staging_conn)
            staging_conn.close()
            staging_conn = None
            print(f"staging_stats: {json.dumps(stats)}")
        print(f"CF_BLOCKED {exc.url}")
        print(
            "Open this URL in a browser, complete the Cloudflare challenge if shown, "
            f"then re-run this script (checkpoint resumes):\n  {exc.url}"
        )
        return 2
    finally:
        persist_checkpoint()
        if staging_conn is not None:
            try:
                staging_conn.commit()
            except Exception:
                pass

    flush_dump(items, blockers=blockers, note="SeedFinder full scrape; html_raw in staging raw_record")
    stats = None
    if staging_conn is not None:
        stats = corpus_stats(staging_conn)
        staging_conn.close()
        print(f"staging: {staging_path}")
        print(f"staging_stats: {json.dumps(stats)}")

    print(
        json.dumps(
            {
                "dump": str(OUT_DUMP),
                "dump_count": len(items),
                "urls_discovered": len(urls),
                "blockers": len(blockers),
                "cf_status": "ok" if not stopped_url else f"blocked:{stopped_url}",
                "staging": str(staging_path) if staging_path else None,
                "staging_stats": stats,
                "capture": "html_raw+lineage_html+full lineage_tree+all props in staging raw_record",
                "merge_later": "python scripts/merge_staging_to_master.py --only seedfinder",
            },
            indent=2,
            default=str,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
