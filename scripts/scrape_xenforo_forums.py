#!/usr/bin/env python3
"""Scrape public XenForo grow forums for structured strain/grow facts.

First-pass sites (discovery a9819597 / _probe_discovery_2026-08-08.json):
  - 420 Magazine  → dsc_forum_420mag.json      / staging forum_420mag.sqlite3
  - Phenohunter   → dsc_forum_phenohunter.json / staging forum_phenohunter.sqlite3
  - Marijuana Passion → dsc_forum_mjpassion.json / staging forum_mjpassion.sqlite3

Public pages only. Extract strain names + grow notes + flowering/height when
stated. Do NOT invent chemistry. Checkpoint/resume. redistributable=false.
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
from typing import Any
from urllib.parse import unquote, urljoin, urlparse, urlsplit, urlunsplit

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(ROOT))

from catalog_common import DATA, name_norm, write_dump  # noqa: E402
from catalog_fetch import Checkpoint  # noqa: E402

UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)
CTX = ssl.create_default_context()

# Priority boards: strain / grow / breeder density first.
SITES: dict[str, dict[str, Any]] = {
    "420mag": {
        "source": "forum_420mag",
        "name": "420 Magazine",
        "base": "https://www.420magazine.com/community/",
        "out": DATA / "dsc_forum_420mag.json",
        "checkpoint": DATA / "dsc_forum_420mag.checkpoint.json",
        "staging_family": "forum_420mag",
        "boards": [
            "forums/strain-reviews/",
            "forums/grow-journals.56/",
            "forums/journals-in-progress.311/",
            "forums/completed-journals.213/",
            "forums/cannabis-seeds-clones-strains.26/",
            "forums/sweet-seeds.887/",
            "forums/barneys-farm.939/",
            "forums/royal-queen-seeds.930/",
            "forums/rocket-seeds.932/",
            "forums/organic-cannabis-growing.336/",
        ],
        "board_pages": 8,
        "max_threads": 400,
    },
    "phenohunter": {
        "source": "forum_phenohunter",
        "name": "Phenohunter",
        "base": "https://phenohunter.org/",
        "out": DATA / "dsc_forum_phenohunter.json",
        "checkpoint": DATA / "dsc_forum_phenohunter.checkpoint.json",
        "staging_family": "forum_phenohunter",
        "boards": [
            "forums/breeder-threads.15/",
            "forums/breeders.83/",
            "forums/autoflowers.45/",
            "forums/3thirteen-seeds.86/",
            "forums/bad-dawg-genetics.90/",
            "forums/briscos-bargain-beans.88/",
        ],
        # Extra boards discovered from home page matching keywords:
        "board_keywords": (
            "breeder",
            "strain",
            "pheno",
            "genetics",
            "seeds",
            "autoflower",
            "landrace",
            "cross",
            "hunt",
            "cultivar",
        ),
        "board_pages": 6,
        "max_threads": 400,
    },
    "mjpassion": {
        "source": "forum_mjpassion",
        "name": "Marijuana Passion",
        "base": "https://www.marijuanapassion.com/",
        "out": DATA / "dsc_forum_mjpassion.json",
        "checkpoint": DATA / "dsc_forum_mjpassion.checkpoint.json",
        "staging_family": "forum_mjpassion",
        "boards": [
            "forums/grow-journals.25/",
            "forums/general-indoor-growing.6/",
            "forums/general-outdoor-growing.7/",
            "forums/auto-flowering.52/",
            "forums/advanced-growing-techniques.44/",
            "forums/beginners-growing-forum.60/",
            "forums/marijuana-hydroponics.5/",
            "forums/harvesting-drying-curing.18/",
        ],
        "board_pages": 6,
        "max_threads": 300,
    },
    # Rollitup uses short routes /f/{slug.id}/ and /t/{slug.id}/ (not /forums|/threads).
    "rollitup": {
        "source": "forum_rollitup",
        "name": "Rollitup",
        "base": "https://www.rollitup.org/",
        "out": DATA / "dsc_forum_rollitup.json",
        "checkpoint": DATA / "dsc_forum_rollitup.checkpoint.json",
        "staging_family": "forum_rollitup",
        "forum_prefix": "f",
        "thread_prefix": "t",
        "boards": [
            "f/grow-journals.54/",
            "f/grow-journal-discussion.93/",
            "f/seed-and-strain-reviews.43/",
            "f/auto-flowering-strains.127/",
            "f/general-marijuana-growing.39/",
            "f/indoor-growing.49/",
            "f/outdoor-growing.48/",
        ],
        "board_keywords": (
            "grow",
            "strain",
            "seed",
            "journal",
            "auto",
            "genetics",
            "breeder",
        ),
        "board_pages": 6,
        "max_threads": 350,
    },
}

SKIP_TITLE_RE = re.compile(
    r"(?i)^(how\s+to|forum\s+guidelines|guidelines|sitemap|member\s+of\s+the\s+month|"
    r"please\s+tell\s+us|media\s+guide|photo\s+gallery|welcome|introduce\s+yourself|"
    r"help\s+support|sticky|read\s+before|announcement|rules\b)"
)
STRAINISH_RE = re.compile(
    r"(?i)\b(strain|pheno|phenotype|grow\s*log|journal|review|seeds?|genetics|"
    r"kush|haze|diesel|skunk|widow|og\b|gelato|runtz|cookies|auto\b|f1|bx|"
    r"cross|x\s|feminiz|indica|sativa|hybrid|breeder)\b"
)
META_SLUG_RE = re.compile(
    r"(?i)(guidelines|sitemap|how-to|member-of-the-month|please-tell|"
    r"photo-gallery|media-gallery|introduce-yourself|help-support)"
)

TITLE_BLOCK_RE = re.compile(
    r'<div class="structItem-title">(.*?)</div>',
    re.I | re.S,
)
THREAD_HREF_TITLE_RE = re.compile(
    r'<a[^>]+href=["\']([^"\']*?/(?:threads|t)/[^"\'?#]+)["\'][^>]*>\s*([^<]+?)\s*</a>',
    re.I | re.S,
)
STICKY_GROUP_RE = re.compile(
    r'structItemContainer-group--sticky.*?(?=structItemContainer-group(?!--sticky)|$)',
    re.I | re.S,
)
P_TITLE_RE = re.compile(
    r'<h1[^>]*class="[^"]*p-title-value[^"]*"[^>]*>(.*?)</h1>',
    re.I | re.S,
)
BB_WRAPPER_RE = re.compile(
    r'class="[^"]*bbWrapper[^"]*"[^>]*>(.*?)</div>',
    re.I | re.S,
)
FORUM_LINK_RE = re.compile(
    r'<a[^>]+href=["\']([^"\']*?/(?:forums|f)/[^"\'?#]+)["\'][^>]*>\s*([^<]+?)\s*</a>',
    re.I | re.S,
)
PAGE_NUM_RE = re.compile(r"/page-(\d+)", re.I)
FLOWER_RANGE_RE = re.compile(
    r"(?i)flower(?:ing)?(?:\s*time|\s*period|\s*cycle)?[:\s]+"
    r"(\d+)\s*[-–to]+\s*(\d+)\s*(?:days?|w(?:ee)?ks?)",
)
FLOWER_SINGLE_RE = re.compile(
    r"(?i)flower(?:ing)?(?:\s*time|\s*period|\s*cycle)?[:\s]+"
    r"(\d+)\s*(days?|w(?:ee)?ks?)",
)
HEIGHT_CM_RE = re.compile(
    r"(?i)(?:height|tall(?:ness)?|final\s+height)[:\s]+"
    r"(\d+)\s*[-–to]+\s*(\d+)\s*cm",
)
HEIGHT_CM_SINGLE_RE = re.compile(
    r"(?i)(?:height|tall(?:ness)?|final\s+height)[:\s]+(\d+)\s*cm",
)
HEIGHT_IN_RE = re.compile(
    r"(?i)(?:height|tall(?:ness)?|final\s+height)[:\s]+"
    r"(\d+)\s*[-–to]+\s*(\d+)\s*(?:\"|in(?:ch(?:es)?)?)\b",
)
HEIGHT_IN_SINGLE_RE = re.compile(
    r"(?i)(?:height|tall(?:ness)?|final\s+height)[:\s]+"
    r"(\d+)\s*(?:\"|in(?:ch(?:es)?)?)\b",
)
HEIGHT_FT_RE = re.compile(
    r"(?i)(?:height|tall(?:ness)?|to)\s*(\d+)\s*[-–to]+\s*(\d+)\s*(?:'|ft|feet)\b",
)
HEIGHT_FT_SINGLE_RE = re.compile(
    r"(?i)(?:height|tall(?:ness)?)\s*(?:of\s+)?(\d+)\s*(?:'|ft|feet)\b",
)
WEEKS_TO_DAYS = {"week": 7, "weeks": 7, "wk": 7, "wks": 7, "day": 1, "days": 1}


def clean_text(html: str) -> str:
    t = re.sub(r"(?is)<script.*?</script>", " ", html or "")
    t = re.sub(r"(?is)<style.*?</style>", " ", t)
    t = re.sub(r"(?is)<br\s*/?>", "\n", t)
    t = re.sub(r"(?is)</p>", "\n", t)
    t = re.sub(r"(?is)<[^>]+>", " ", t)
    t = html_lib.unescape(t)
    t = re.sub(r"[ \t]+", " ", t)
    t = re.sub(r"\n{3,}", "\n\n", t)
    return t.strip()


def is_bot_wall(html: str, status: int | None = None) -> bool:
    low = (html or "").lower()
    markers = (
        "verifying you're human",
        "cf-browser-verification",
        "attention required | cloudflare",
        "just a moment...",
        "enable javascript and cookies to continue",
        "captcha-delivery.com",
        "access denied",
    )
    if status in (403, 503, 429) and any(m in low for m in markers):
        return True
    if any(m in low for m in markers[:5]):
        return True
    if len(low) < 1500 and ("cloudflare" in low and "challenge" in low):
        return True
    return False


def fetch_html(url: str, *, delay: float, timeout: int = 60) -> tuple[int | None, str, str]:
    time.sleep(max(0.0, delay))
    parts = urlsplit(url)
    safe = urlunsplit(
        (parts.scheme, parts.netloc, parts.path, parts.query, parts.fragment)
    )
    req = urllib.request.Request(
        safe,
        headers={
            "User-Agent": UA,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout, context=CTX) as resp:
            body = resp.read().decode("utf-8", "replace")
            return resp.status, resp.geturl(), body
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", "replace") if exc.fp else ""
        return exc.code, url, body
    except Exception as exc:  # noqa: BLE001
        raise RuntimeError(f"fetch failed for {url}: {exc}") from exc


def normalize_thread_url(base: str, href: str, *, thread_prefix: str = "threads") -> str | None:
    if not href:
        return None
    tp = (thread_prefix or "threads").strip("/")
    # Accept both canonical /threads/ and short /t/ forms when present.
    if f"/{tp}/" not in href and "/threads/" not in href and "/t/" not in href:
        return None
    if any(x in href for x in ("/preview", "/latest", "/unread", "/watch", "/reply")):
        if re.search(r"/post-\d+", href) or href.rstrip("/").endswith(
            ("/latest", "/preview", "/unread", "/watch", "/reply")
        ):
            return None
    # Drop deep /post-N anchors (keep thread root).
    href = re.sub(r"/post-\d+/?$", "/", href)
    full = urljoin(base, href.split("#")[0].split("?")[0])
    full = re.sub(r"/page-\d+/?$", "/", full)
    if not full.endswith("/"):
        full += "/"
    # .../threads|t/slug.id/ or .../threads|t/id/
    if not re.search(r"/(?:threads|t)/[^/]+\.\d+/", full) and not re.search(
        r"/(?:threads|t)/\d+/", full
    ):
        if not re.search(r"/(?:threads|t)/[a-z0-9%\-]+/?$", full, re.I):
            return None
    return full


def thread_id_from_url(url: str) -> str:
    m = re.search(r"/(?:threads|t)/([^/]+?)/?$", url.rstrip("/") + "/")
    return unquote(m.group(1)) if m else url


def slug_to_name(slug_id: str) -> str:
    slug = re.sub(r"\.\d+$", "", slug_id)
    slug = unquote(slug).replace("-", " ").replace("_", " ")
    slug = re.sub(r"\s+", " ", slug).strip()
    return slug.title() if slug else ""


def strain_score(title: str, url: str) -> int:
    t = (title or "").strip()
    if not t or SKIP_TITLE_RE.search(t):
        return -100
    if META_SLUG_RE.search(url):
        return -100
    score = 0
    if STRAINISH_RE.search(t) or STRAINISH_RE.search(url):
        score += 30
    # short titles often are strain names (OG Kush, Alien Juice)
    words = t.split()
    if 1 <= len(words) <= 8:
        score += 15
    if re.search(r"(?i)\b(x|cross|pheno|#\d+)\b", t):
        score += 10
    if re.search(r"(?i)\b(journal|grow\s*log|diary)\b", t):
        score += 20
    if re.search(r"(?i)\b(review)\b", t):
        score += 10
    # gear / light reviews without strain cues
    if re.search(r"(?i)\b(led|light\s+review|sponsored\s+light|tent\s+review)\b", t):
        if not STRAINISH_RE.search(t):
            score -= 25
    # penalize long rambling titles without strain cues
    if len(words) > 14 and score < 20:
        score -= 10
    return score


def guess_strain_name(title: str, url: str) -> str:
    t = clean_text(title)
    t = re.sub(
        r"(?i)^(grow\s*(journal|log|diary|report)\s*[-–:]\s*|"
        r"strain\s*review\s*[-–:]\s*|review\s*[-–:]\s*)",
        "",
        t,
    ).strip()
    t = re.sub(
        r"(?i)\s*[-–:]\s*(grow\s*(journal|log|diary|report)|strain\s*review).*$",
        "",
        t,
    ).strip()
    # "Breeder — Strain" / "Strain by Breeder"
    m = re.match(r"^(.+?)\s+by\s+.+$", t, re.I)
    if m and len(m.group(1).split()) <= 10:
        t = m.group(1).strip()
    if not t or SKIP_TITLE_RE.search(t) or len(t) < 2:
        return slug_to_name(thread_id_from_url(url))
    # keep first clause if very long
    if len(t) > 90:
        t = re.split(r"\s[-–|]\s", t)[0].strip()
    return t[:120]


def extract_grow_facts(text: str) -> dict[str, Any]:
    """Flowering / height only when explicitly stated. No chemistry."""
    props: dict[str, Any] = {}
    m = FLOWER_RANGE_RE.search(text or "")
    if m:
        a, b = int(m.group(1)), int(m.group(2))
        # unit is in the full match — detect weeks vs days
        unit = "days"
        um = re.search(r"(days?|w(?:ee)?ks?)\s*$", m.group(0), re.I)
        if um:
            unit = um.group(1).lower()
        mul = 7 if unit.startswith("w") else 1
        props["flowering_days"] = [a * mul, b * mul]
        props["flowering_raw"] = m.group(0).strip()
    else:
        m = FLOWER_SINGLE_RE.search(text or "")
        if m:
            n = int(m.group(1))
            unit = m.group(2).lower()
            mul = 7 if unit.startswith("w") else 1
            props["flowering_days"] = n * mul
            props["flowering_raw"] = m.group(0).strip()

    m = HEIGHT_CM_RE.search(text or "")
    if m:
        props["height_cm"] = [int(m.group(1)), int(m.group(2))]
        props["height_raw"] = m.group(0).strip()
    else:
        m = HEIGHT_CM_SINGLE_RE.search(text or "")
        if m:
            props["height_cm"] = int(m.group(1))
            props["height_raw"] = m.group(0).strip()
        else:
            m = HEIGHT_IN_RE.search(text or "")
            if m:
                a, b = int(m.group(1)), int(m.group(2))
                props["height_cm"] = [round(a * 2.54), round(b * 2.54)]
                props["height_raw"] = m.group(0).strip()
            else:
                m = HEIGHT_IN_SINGLE_RE.search(text or "")
                if m:
                    inches = int(m.group(1))
                    props["height_cm"] = round(inches * 2.54)
                    props["height_raw"] = m.group(0).strip()
                else:
                    m = HEIGHT_FT_RE.search(text or "")
                    if m:
                        a, b = int(m.group(1)), int(m.group(2))
                        props["height_cm"] = [round(a * 30.48), round(b * 30.48)]
                        props["height_raw"] = m.group(0).strip()
                    else:
                        m = HEIGHT_FT_SINGLE_RE.search(text or "")
                        if m:
                            ft = int(m.group(1))
                            props["height_cm"] = round(ft * 30.48)
                            props["height_raw"] = m.group(0).strip()
    return props


def parse_board_threads(
    html: str, base: str, *, thread_prefix: str = "threads"
) -> list[dict[str, Any]]:
    # Drop sticky block when present (meta stickies dominate page-1).
    body = STICKY_GROUP_RE.sub(" ", html or "")
    out: list[dict[str, Any]] = []
    seen: set[str] = set()
    # Prefer structItem title blocks when present; else fall back to any thread links.
    blocks = TITLE_BLOCK_RE.findall(body)
    candidates: list[tuple[str, str]] = []
    if blocks:
        for block in blocks:
            m = THREAD_HREF_TITLE_RE.search(block)
            if m:
                candidates.append((m.group(1), m.group(2)))
    else:
        # Rollitup / some skins omit structItem-title wrappers.
        for m in THREAD_HREF_TITLE_RE.finditer(body):
            candidates.append((m.group(1), m.group(2)))
        # Also bare /t/ hrefs with nearby text
        for m in re.finditer(
            r'<a[^>]+href=["\']([^"\']*?/(?:threads|t)/[^"\'?#]+)["\'][^>]*>(.*?)</a>',
            body,
            re.I | re.S,
        ):
            candidates.append((m.group(1), m.group(2)))

    for href, title_html in candidates:
        url = normalize_thread_url(base, href, thread_prefix=thread_prefix)
        if not url or url in seen:
            continue
        title = clean_text(title_html)
        if not title:
            continue
        seen.add(url)
        score = strain_score(title, url)
        out.append({"title": title, "url": url, "score": score})
    return out


def max_page(html: str) -> int:
    nums = [int(x) for x in PAGE_NUM_RE.findall(html or "")]
    return max(nums) if nums else 1


def discover_extra_boards(
    html: str,
    base: str,
    keywords: tuple[str, ...],
    *,
    forum_prefix: str = "forums",
) -> list[str]:
    found: list[str] = []
    seen: set[str] = set()
    fp = (forum_prefix or "forums").strip("/")
    # Prefer titled links; also fall back to bare /forums|/f/ hrefs.
    candidates: list[tuple[str, str]] = list(FORUM_LINK_RE.findall(html or ""))
    for href in re.findall(
        rf'href=["\']([^"\']*?/(?:forums|f)/[^"\'?#]+)["\']',
        html or "",
        re.I,
    ):
        candidates.append((href, href))
    for href, label in candidates:
        full = urljoin(base, href.split("?")[0])
        if f"/{fp}/-/" in full or full.rstrip("/").endswith(f"/{fp}"):
            continue
        path = urlparse(full).path
        if not path.endswith("/"):
            path += "/"
        key = path.lower()
        lab = clean_text(label).lower()
        hay = f"{key} {lab}"
        if not any(k in hay for k in keywords):
            continue
        # Normalize to relative f/... or forums/...
        m = re.search(r"/(?:forums|f)/(.+)$", path, re.I)
        if not m:
            continue
        rel = f"{fp}/{m.group(1)}"
        if not rel.endswith("/"):
            rel += "/"
        if rel in seen:
            continue
        seen.add(rel)
        found.append(rel)
    return found


def parse_thread(html: str, url: str, *, board: str, source: str) -> dict[str, Any] | None:
    title_m = P_TITLE_RE.search(html or "")
    title = clean_text(title_m.group(1)) if title_m else ""
    if not title:
        title = slug_to_name(thread_id_from_url(url))
    if SKIP_TITLE_RE.search(title) or META_SLUG_RE.search(url):
        return None

    bodies = BB_WRAPPER_RE.findall(html or "")
    first_html = bodies[0] if bodies else ""
    first_text = clean_text(first_html)
    # Keep a usable excerpt for staging (NAS has room); dump gets shorter note.
    excerpt = first_text[:4000]
    grow_note = first_text[:1200]
    facts = extract_grow_facts(first_text)

    name = guess_strain_name(title, url)
    nn = name_norm(name)
    if not nn or len(nn) < 2:
        return None

    row: dict[str, Any] = {
        "name": name,
        "name_norm": nn,
        "thread_title": title,
        "url": url,
        "provenance_url": url,
        "board": board,
        "source": source,
        "kind": "forum_thread",
        "grow_notes": grow_note or None,
        "excerpt": excerpt or None,
        "redistributable": False,
    }
    for k, v in facts.items():
        row[k] = v
    # Never attach chemistry from forum hearsay.
    row.pop("chemistry", None)
    row.pop("thc_range", None)
    row.pop("cbd_range", None)
    return row


def collect_thread_queue(
    site_key: str,
    cfg: dict[str, Any],
    *,
    delay: float,
    blockers: list[str],
) -> list[dict[str, Any]]:
    base = cfg["base"]
    boards = list(cfg["boards"])
    forum_prefix = str(cfg.get("forum_prefix") or "forums")
    thread_prefix = str(cfg.get("thread_prefix") or "threads")
    # Discover keyword boards from home for phenohunter-style dense sites.
    if cfg.get("board_keywords"):
        try:
            status, final, home = fetch_html(base, delay=delay)
            if status == 403 or is_bot_wall(home, status):
                blockers.append(f"BOT_OR_403 {base} status={status}")
                return []
            # Rollitup board index is /forums/ even though leaf boards use /f/
            discover_url = final or base
            if site_key == "rollitup":
                status2, final2, home2 = fetch_html(urljoin(base, "forums/"), delay=delay)
                if status2 == 200 and not is_bot_wall(home2, status2):
                    home = home2
                    discover_url = final2 or discover_url
            extra = discover_extra_boards(
                home,
                discover_url,
                tuple(cfg["board_keywords"]),
                forum_prefix=forum_prefix,
            )
            for rel in extra:
                if rel not in boards:
                    boards.append(rel)
            # Cap extra board fan-out
            boards = boards[:18]
            print(f"  {site_key}: boards after discovery n={len(boards)}")
        except Exception as exc:  # noqa: BLE001
            blockers.append(f"home {base}: {exc}")

    queued: list[dict[str, Any]] = []
    seen: set[str] = set()
    pages_cap = int(cfg.get("board_pages") or 5)

    for rel in boards:
        board_url = urljoin(base, rel)
        try:
            status, final, html = fetch_html(board_url, delay=delay)
        except Exception as exc:  # noqa: BLE001
            blockers.append(f"board {board_url}: {exc}")
            continue
        if status in (403, 401) or is_bot_wall(html, status):
            msg = f"BOT_OR_403 {board_url} status={status}"
            blockers.append(msg)
            print(f"  blocker: {msg}")
            continue
        if status != 200:
            blockers.append(f"HTTP {status} {board_url}")
            continue

        pages = min(pages_cap, max_page(html))
        page_htmls = [(1, final or board_url, html)]
        for p in range(2, pages + 1):
            page_url = board_url.rstrip("/") + f"/page-{p}"
            try:
                st, fin, body = fetch_html(page_url, delay=delay)
            except Exception as exc:  # noqa: BLE001
                blockers.append(f"page {page_url}: {exc}")
                break
            if st in (403, 401) or is_bot_wall(body, st):
                blockers.append(f"BOT_OR_403 {page_url} status={st}")
                break
            if st != 200:
                break
            page_htmls.append((p, fin or page_url, body))

        for _p, _u, body in page_htmls:
            for th in parse_board_threads(body, base, thread_prefix=thread_prefix):
                if th["url"] in seen:
                    continue
                if th["score"] < 0:
                    continue
                seen.add(th["url"])
                th["board"] = rel
                queued.append(th)

        print(
            f"  {site_key}: board {rel} pages={len(page_htmls)} "
            f"queue_now={len(queued)}"
        )

    queued.sort(key=lambda x: (-int(x.get("score") or 0), x.get("title") or ""))
    max_threads = int(cfg.get("max_threads") or 400)
    return queued[:max_threads]


def load_existing_items(path: Path) -> list[dict]:
    if not path.exists():
        return []
    try:
        doc = json.loads(path.read_text(encoding="utf-8"))
        return [i for i in (doc.get("items") or []) if isinstance(i, dict)]
    except (OSError, json.JSONDecodeError):
        return []


def scrape_site(
    site_key: str,
    *,
    delay: float,
    limit: int | None,
    checkpoint_every: int,
    skip_stage: bool,
) -> dict[str, Any]:
    cfg = SITES[site_key]
    out_path: Path = cfg["out"]
    ck = Checkpoint(cfg["checkpoint"])
    done = set(ck.data.get("done") or [])
    blockers: list[str] = list(ck.data.get("blockers") or [])
    items = load_existing_items(out_path)
    by_url = {i.get("url"): i for i in items if i.get("url")}

    print(f"\n=== {cfg['name']} ({site_key}) resume done={len(done)} dump={len(items)}")
    queue = collect_thread_queue(site_key, cfg, delay=delay, blockers=blockers)
    if limit is not None:
        queue = queue[: max(0, limit)]
    print(f"  queued threads={len(queue)}")

    scraped = 0
    t0 = time.time()
    consecutive_walls = 0

    for idx, th in enumerate(queue, 1):
        url = th["url"]
        if url in done and url in by_url:
            continue
        if url in done and url not in by_url:
            done.discard(url)

        try:
            status, final, html = fetch_html(url, delay=delay)
            if status in (403, 401) or is_bot_wall(html, status):
                msg = f"BOT_OR_403 {url} status={status}"
                blockers.append(msg)
                ck.note_error(msg)
                consecutive_walls += 1
                print(f"  blocker: {msg}")
                if consecutive_walls >= 4:
                    print("  aborting site: repeated bot/403 walls")
                    break
                continue
            consecutive_walls = 0
            if status != 200:
                msg = f"HTTP {status} {url}"
                blockers.append(msg)
                ck.note_error(msg)
                continue
            row = parse_thread(html, final or url, board=th.get("board") or "", source=cfg["source"])
            if not row:
                done.add(url)
                continue
            by_url[url] = row
            done.add(url)
            scraped += 1
        except Exception as exc:  # noqa: BLE001
            msg = f"{url}: {exc}"
            blockers.append(msg)
            ck.note_error(msg)
            continue

        if scraped and (scraped % checkpoint_every == 0 or idx == len(queue)):
            items = list(by_url.values())
            ck.data["done"] = sorted(done)
            ck.data["cursor"] = url
            ck.data["blockers"] = blockers[-50:]
            ck.data["done_count"] = len(done)
            ck.save()
            write_dump(
                out_path,
                "forum_threads",
                items,
                source=cfg["source"],
                source_url=cfg["base"],
                license="research scrape of public forum HTML; redistributable=false",
                redistributable=False,
                note=(
                    f"partial checkpoint {len(items)} threads; "
                    "no invented chem; match via name_norm later"
                ),
                forum=cfg["name"],
                blockers=blockers[-30:],
            )
            rate = scraped / max(1.0, time.time() - t0)
            print(
                f"  checkpoint items={len(items)} done={len(done)} "
                f"this_run={scraped} rate={rate:.2f}/s idx={idx}/{len(queue)}"
            )

    items = list(by_url.values())
    items.sort(key=lambda r: (r.get("name_norm") or "", r.get("url") or ""))
    ck.data["done"] = sorted(done)
    ck.data["blockers"] = blockers[-50:]
    ck.data["done_count"] = len(done)
    ck.save()
    write_dump(
        out_path,
        "forum_threads",
        items,
        source=cfg["source"],
        source_url=cfg["base"],
        license="research scrape of public forum HTML; redistributable=false",
        redistributable=False,
        note=(
            "first-pass XenForo public threads; grow facts with provenance; "
            "no invented chem; name_norm for later master match"
        ),
        forum=cfg["name"],
        blockers=blockers[-30:],
    )
    print(f"wrote {out_path.name} count={len(items)} blockers={len(blockers)}")

    staging_info: dict[str, Any] | None = None
    if not skip_stage and items:
        from brain.dsc_brain.staging import write_dump_to_staging  # noqa: WPS433

        staging_info = write_dump_to_staging(
            out_path, source_id=cfg["source"], reset=True
        )
        print(
            "staging:",
            json.dumps(
                {
                    k: staging_info[k]
                    for k in ("family", "staging_db", "count", "stats")
                    if k in staging_info
                },
                indent=2,
            ),
        )

    return {
        "site": site_key,
        "count": len(items),
        "scraped_this_run": scraped,
        "queued": len(queue),
        "blockers": blockers[-20:],
        "out": str(out_path),
        "staging": staging_info,
    }


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description="Scrape public XenForo grow forums")
    ap.add_argument(
        "--site",
        action="append",
        choices=sorted(SITES.keys()),
        help="Site key (repeatable). Default: all three.",
    )
    ap.add_argument("--delay", type=float, default=0.55)
    ap.add_argument("--limit", type=int, default=None, help="Cap threads per site")
    ap.add_argument("--checkpoint-every", type=int, default=25)
    ap.add_argument("--skip-stage", action="store_true")
    args = ap.parse_args(argv)

    sites = args.site or list(SITES.keys())
    results = []
    for key in sites:
        results.append(
            scrape_site(
                key,
                delay=args.delay,
                limit=args.limit,
                checkpoint_every=args.checkpoint_every,
                skip_stage=args.skip_stage,
            )
        )
    print("\n=== SUMMARY ===")
    for r in results:
        print(
            f"{r['site']}: items={r['count']} scraped={r['scraped_this_run']} "
            f"queued={r['queued']} blockers={len(r['blockers'])}"
        )
        for b in r["blockers"][:5]:
            if "BOT_OR_403" in b or "HTTP 403" in b:
                print(f"  AUTH_NEEDED: {b}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
