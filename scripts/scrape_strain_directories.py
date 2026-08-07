#!/usr/bin/env python3
"""Scrape public strain directories with checkpoint/resume (research corpus).

Targets: strain-database.com, cannareviews.health, allbud, cannaconnection,
wayofleaf, hytiva (best-effort). Cloudflare/login walls are recorded and skipped.
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
from urllib.error import HTTPError

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from catalog_common import DATA, name_norm, polite_get, write_dump, parse_grow_fields  # noqa: E402
from catalog_fetch import Checkpoint  # noqa: E402

NOTE = "research scrape; redistributable=false until legal review"

DIRECTORIES = {
    "cannareviews": {
        "list_pages": [
            "https://cannareviews.health/strains",
            "https://cannareviews.health/",
        ],
        "link_re": re.compile(r"https?://cannareviews\.health/strains/[a-z0-9\-]+", re.I),
        "rel_re": re.compile(r'href=["\'](/strains/[a-z0-9\-]+)["\']', re.I),
    },
    "allbud": {
        "list_pages": [
            "https://www.allbud.com/marijuana-strains/strain-classification",
            "https://www.allbud.com/marijuana-strains",
        ],
        "link_re": re.compile(
            r"https?://www\.allbud\.com/marijuana-strains/[a-z0-9\-]+/[a-z0-9\-]+",
            re.I,
        ),
        "rel_re": re.compile(
            r'href=["\'](/marijuana-strains/[a-z0-9\-]+/[a-z0-9\-]+)["\']',
            re.I,
        ),
    },
    "cannaconnection": {
        "list_pages": [
            "https://www.cannaconnection.com/strains",
            *[f"https://www.cannaconnection.com/strains?show_char={c}" for c in "abcdefghijklmnopqrstuvwxyz"],
        ],
        "link_re": re.compile(
            r"https?://www\.cannaconnection\.com/strains/[a-z0-9\-]+",
            re.I,
        ),
        "rel_re": re.compile(r'href=["\'](/strains/[a-z0-9\-]+)["\']', re.I),
    },
    "hytiva": {
        "list_pages": [
            "https://www.hytiva.com/strains",
            "https://www.hytiva.com/strains/hybrid",
            "https://www.hytiva.com/strains/indica",
            "https://www.hytiva.com/strains/sativa",
            "https://hytiva.com/strains",
        ],
        "link_re": re.compile(
            r"https?://(?:www\.)?hytiva\.com/strains/(?:hybrid|indica|sativa)/[a-z0-9\-]+",
            re.I,
        ),
        "rel_re": re.compile(
            r'href=["\'](/strains/(?:hybrid|indica|sativa)/[a-z0-9\-]+)["\']',
            re.I,
        ),
    },
    "cropking_dir": {
        "list_pages": [
            "https://www.cropkingseeds.com/feminized-seeds/",
            "https://www.cropkingseeds.com/autoflowering-seeds/",
        ],
        "link_re": re.compile(
            r"https://www\.cropkingseeds\.com/(?:[a-z0-9\-]+/)+[a-z0-9\-]+-seeds?/",
            re.I,
        ),
        "rel_re": re.compile(
            r'href=["\'](/(?:[a-z0-9\-]+/)+[a-z0-9\-]+-seeds?/)["\']',
            re.I,
        ),
    },
    "strain_database": {
        "list_pages": [
            "https://strain-database.com/strains",
            "https://www.strain-database.com/strains",
        ],
        "link_re": re.compile(
            r"https?://(?:www\.)?strain-database\.com/strains/[a-z0-9\-]+",
            re.I,
        ),
        "rel_re": re.compile(r'href=["\'](/strains/[a-z0-9\-]+)["\']', re.I),
    },
    "leafly_index": {
        # Index-only probe; Leafly is heavily bot-walled — expect auth/captcha
        "list_pages": [
            "https://www.leafly.com/strains",
            "https://www.leafly.com/strains?page=2",
        ],
        "link_re": re.compile(r"https?://www\.leafly\.com/strains/[a-z0-9\-]+", re.I),
        "rel_re": re.compile(r'href=["\'](/strains/[a-z0-9\-]+)["\']', re.I),
    },
    "wikileaf_live": {
        "list_pages": [
            "https://www.wikileaf.com/strains/",
            "https://www.wikileaf.com/strains/?page=2",
        ],
        "link_re": re.compile(r"https?://www\.wikileaf\.com/strain/[a-z0-9\-]+/?", re.I),
        "rel_re": re.compile(r'href=["\'](/strain/[a-z0-9\-]+/?)["\']', re.I),
    },
    "weedmaps": {
        "list_pages": ["https://weedmaps.com/strains", "https://weedmaps.com/strains?page=1"],
        "link_re": re.compile(r"https?://weedmaps\.com/strains/[a-z0-9\-]+", re.I),
        "rel_re": re.compile(r'href=["\'](/strains/[a-z0-9\-]+)["\']', re.I),
    },
    "wayofleaf": {
        "list_pages": [
            "https://wayofleaf.com/strain-reviews",
            "https://wayofleaf.com/cannabis/",
        ],
        "link_re": re.compile(
            r"https?://wayofleaf\.com/(?:strain-reviews|cannabis)/[a-z0-9\-]+",
            re.I,
        ),
        "rel_re": re.compile(
            r'href=["\'](/(?:strain-reviews|cannabis)/[a-z0-9\-]+)["\']',
            re.I,
        ),
    },
}


def clean(html: str) -> str:
    t = re.sub(r"(?is)<script.*?</script>", " ", html or "")
    t = re.sub(r"(?is)<style.*?</style>", " ", t)
    t = re.sub(r"(?is)<[^>]+>", " ", t)
    return re.sub(r"\s+", " ", html_lib.unescape(t)).strip()


def is_bot_wall(html: str, status_hint: str = "") -> bool:
    low = (html or "").lower()
    # Strong markers only (avoid false positives on sites that load CF scripts)
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
    # thin challenge pages
    if len(low) < 1500 and ("cloudflare" in low and "challenge" in low):
        return True
    return False


def discover(base_pages: list[str], cfg: dict, *, delay: float) -> tuple[list[str], list[str]]:
    links: set[str] = set()
    blockers: list[str] = []
    for page in base_pages:
        try:
            html = polite_get(page, delay=delay)
            if is_bot_wall(html):
                blockers.append(f"BOT_WALL {page}")
                continue
            for m in cfg["link_re"].finditer(html):
                links.add(m.group(0).split("?")[0].split("#")[0])
            for m in cfg.get("rel_re").finditer(html) if cfg.get("rel_re") else []:
                links.add(urljoin(page, m.group(1)).split("?")[0].split("#")[0])
        except HTTPError as exc:
            blockers.append(f"HTTP {exc.code} {page}")
        except Exception as exc:  # noqa: BLE001
            blockers.append(f"{page}: {exc}")
    return sorted(links), blockers


def scrape_one(name: str, cfg: dict, *, delay: float, limit: int) -> Path:
    out = DATA / f"dsc_strains_{name}.json"
    ck = Checkpoint(DATA / f"dsc_strains_{name}.checkpoint.json")
    links, blockers = discover(cfg["list_pages"], cfg, delay=delay)
    print(f"{name}: discovered {len(links)} links blockers={len(blockers)}")
    for b in blockers[:5]:
        print(f"  blocker: {b}")

    items: list[dict] = []
    if out.exists():
        try:
            items = list(json.loads(out.read_text(encoding="utf-8")).get("items") or [])
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
            if is_bot_wall(html):
                ck.note_error(f"BOT_WALL {url}")
                blockers.append(f"BOT_WALL {url}")
                break
            text = clean(html)
            m = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.I | re.S)
            title = clean(m.group(1)) if m else urlparse(url).path.rstrip("/").split("/")[-1].replace("-", " ")
            props = parse_grow_fields(text)
            row = {
                "name": title[:160],
                "name_norm": name_norm(title),
                "url": url,
                "source": name,
                "page_text_excerpt": text[:1500],
                **props,
            }
            items.append(row)
            seen.add(url)
            ck.mark_done(url)
            if len(items) % 15 == 0:
                write_dump(
                    out,
                    "strains",
                    items,
                    source=name,
                    license=NOTE,
                    redistributable=False,
                    note="partial checkpoint",
                    blockers=blockers[-20:],
                )
                print(f"  {name}: {len(items)}/{limit}")
        except Exception as exc:  # noqa: BLE001
            ck.note_error(f"{url}: {exc}")

    write_dump(
        out,
        "strains",
        items[:limit],
        source=name,
        license=NOTE,
        redistributable=False,
        note="directory scrape",
        blockers=blockers[-50:],
        auth_needed=[b for b in blockers if "BOT_WALL" in b or "HTTP 403" in b or "HTTP 401" in b][:20],
    )
    print(f"wrote {out.name} count={min(len(items), limit)}")
    return out


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dir", choices=list(DIRECTORIES) + ["all"], default="all")
    ap.add_argument("--limit", type=int, default=120)
    ap.add_argument("--delay", type=float, default=0.9)
    args = ap.parse_args()
    names = list(DIRECTORIES) if args.dir == "all" else [args.dir]
    for n in names:
        try:
            scrape_one(n, DIRECTORIES[n], delay=args.delay, limit=args.limit)
        except Exception as exc:  # noqa: BLE001
            print(f"{n} aborted: {exc}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
