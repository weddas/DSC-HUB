#!/usr/bin/env python3
"""First-pass scrape of OZ Stoners Invision Community grow topics → dump + staging.

community.ozstoners.com uses IPS (/topic/{id}-{slug}/), not XenForo.
Public pages only. Extract strain-ish titles + grow notes; never invent chem.
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
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any
from urllib.parse import unquote, urljoin, urlsplit, urlunsplit

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(ROOT))

from catalog_common import DATA, name_norm, write_dump  # noqa: E402
from catalog_fetch import Checkpoint  # noqa: E402
from scrape_xenforo_forums import (  # noqa: E402
    extract_grow_facts,
    guess_strain_name,
    is_bot_wall,
    strain_score,
    SKIP_TITLE_RE,
)

UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)
CTX = ssl.create_default_context()

SOURCE = "forum_ozstoners"
OUT = DATA / "dsc_forum_ozstoners.json"
CK_PATH = DATA / "dsc_forum_ozstoners.checkpoint.json"
BASE = "https://community.ozstoners.com/"

# Grow-heavy forums from marketing nav (forumId=8 = Grow Rooms) are JS shells.
# Use IPS search + home sorts for public topic discovery.
SEARCH_QUERIES = [
    "grow journal",
    "grow diary",
    "grow log",
    "strain",
    "seeds",
    "flowering",
    "autoflower",
    "indoor grow",
    "outdoor grow",
]
SORT_PAGES = [
    "?sortby=last_post&sortdirection=desc",
    "?sortby=posts&sortdirection=desc",
    "",
]

TOPIC_HREF_RE = re.compile(
    r'href=["\']([^"\']*?/topic/(\d+)-([^"\'?#/]+)/?)["\']',
    re.I,
)
TITLE_RE = re.compile(r"<title[^>]*>(.*?)</title>", re.I | re.S)
# IPS rich text / post wrappers
BODY_RE = re.compile(
    r'class=["\'][^"\']*(?:ipsType_richText|cPost_contentWrap|ipsContained)[^"\']*["\'][^>]*>(.*?)</div>',
    re.I | re.S,
)
H1_RE = re.compile(r"<h1[^>]*>(.*?)</h1>", re.I | re.S)


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


def fetch_html(url: str, *, delay: float, timeout: int = 60) -> tuple[int | None, str, str]:
    time.sleep(max(0.0, delay))
    parts = urlsplit(url)
    safe = urlunsplit((parts.scheme, parts.netloc, parts.path, parts.query, parts.fragment))
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


def normalize_topic_url(href: str) -> str | None:
    if not href or "/topic/" not in href:
        return None
    full = urljoin(BASE, href.split("#")[0].split("?")[0])
    full = re.sub(r"/page/\d+/?$", "/", full)
    if not full.endswith("/"):
        full += "/"
    if not re.search(r"/topic/\d+-[a-z0-9\-]+/", full, re.I):
        return None
    return full


def slug_to_name(slug: str) -> str:
    s = unquote(slug or "").replace("-", " ").strip()
    return s.title() if s else ""


def collect_queue(*, delay: float, max_topics: int, blockers: list[str]) -> list[dict[str, Any]]:
    queued: list[dict[str, Any]] = []
    seen: set[str] = set()

    def ingest(html: str, board: str) -> int:
        added = 0
        for href, tid, slug in TOPIC_HREF_RE.findall(html or ""):
            tu = normalize_topic_url(href)
            if not tu or tu in seen:
                continue
            title = slug_to_name(slug)
            score = strain_score(title, tu)
            if score < 0:
                continue
            seen.add(tu)
            queued.append(
                {
                    "title": title,
                    "url": tu,
                    "score": score,
                    "board": board,
                    "topic_id": tid,
                }
            )
            added += 1
        return added

    for sort_q in SORT_PAGES:
        url = urljoin(BASE, sort_q) if sort_q else BASE
        try:
            status, final, html = fetch_html(url, delay=delay)
        except Exception as exc:  # noqa: BLE001
            blockers.append(f"home {url}: {exc}")
            continue
        if status in (403, 401) or is_bot_wall(html, status):
            blockers.append(f"BOT_OR_403 {url} status={status}")
            print(f"  blocker home: status={status}")
            continue
        if status != 200:
            blockers.append(f"HTTP {status} {url}")
            continue
        n = ingest(html, board=f"home:{sort_q or 'default'}")
        print(f"  oz home {sort_q or '/'} +{n} queue={len(queued)} final={final}")

    for q in SEARCH_QUERIES:
        for page in range(1, 4):
            url = f"{BASE}search/?q={urllib.parse.quote(q)}&type=forums_topic"
            if page > 1:
                url += f"&page={page}"
            try:
                status, final, html = fetch_html(url, delay=delay)
            except Exception as exc:  # noqa: BLE001
                blockers.append(f"search {q} p{page}: {exc}")
                break
            if status in (403, 401) or is_bot_wall(html, status):
                blockers.append(f"BOT_OR_403 {url} status={status}")
                print(f"  blocker search {q}: status={status}")
                break
            if status != 200:
                blockers.append(f"HTTP {status} {url}")
                break
            n = ingest(html, board=f"search:{q}")
            print(f"  oz search q={q!r} page={page} +{n} queue={len(queued)}")
            if n == 0 and page > 1:
                break
        if len(queued) >= max_topics:
            break

    queued.sort(key=lambda x: (-int(x.get("score") or 0), x.get("title") or ""))
    return queued[:max_topics]


def parse_topic(html: str, url: str, *, board: str) -> dict[str, Any] | None:
    title = ""
    h1 = H1_RE.search(html or "")
    if h1:
        title = clean_text(h1.group(1))
    if not title:
        tm = TITLE_RE.search(html or "")
        if tm:
            title = clean_text(tm.group(1))
            title = re.sub(r"\s*[-|].*OZ Stoners.*$", "", title, flags=re.I).strip()
    if not title:
        m = re.search(r"/topic/\d+-([^/]+)/", url)
        title = slug_to_name(m.group(1) if m else "")
    if not title or SKIP_TITLE_RE.search(title):
        return None

    bodies = BODY_RE.findall(html or "")
    first = clean_text(bodies[0]) if bodies else ""
    if not first:
        # fallback: strip page
        first = clean_text(html)[:4000]
    facts = extract_grow_facts(first)
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
        "source": SOURCE,
        "kind": "forum_thread",
        "grow_notes": (first[:1200] or None),
        "excerpt": (first[:4000] or None),
        "redistributable": False,
    }
    row.update(facts)
    row.pop("chemistry", None)
    row.pop("thc_range", None)
    row.pop("cbd_range", None)
    return row


def load_existing(path: Path) -> list[dict]:
    if not path.exists():
        return []
    try:
        doc = json.loads(path.read_text(encoding="utf-8"))
        return [i for i in (doc.get("items") or []) if isinstance(i, dict)]
    except (OSError, json.JSONDecodeError):
        return []


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description="Scrape OZ Stoners IPS grow topics")
    ap.add_argument("--delay", type=float, default=0.6)
    ap.add_argument("--limit", type=int, default=250)
    ap.add_argument("--checkpoint-every", type=int, default=20)
    ap.add_argument("--skip-stage", action="store_true")
    args = ap.parse_args(argv)

    ck = Checkpoint(CK_PATH)
    done = set(ck.data.get("done") or [])
    blockers: list[str] = list(ck.data.get("blockers") or [])
    items = load_existing(OUT)
    by_url = {i.get("url"): i for i in items if i.get("url")}

    print(f"=== OZ Stoners resume done={len(done)} dump={len(items)}")
    queue = collect_queue(delay=args.delay, max_topics=args.limit, blockers=blockers)
    print(f"  queued topics={len(queue)}")

    scraped = 0
    consecutive_walls = 0
    t0 = time.time()
    for idx, th in enumerate(queue, 1):
        url = th["url"]
        if url in done and url in by_url:
            continue
        if url in done and url not in by_url:
            done.discard(url)
        try:
            status, final, html = fetch_html(url, delay=args.delay)
            if status in (403, 401) or is_bot_wall(html, status):
                msg = f"BOT_OR_403 {url} status={status}"
                blockers.append(msg)
                consecutive_walls += 1
                print(f"  blocker: {msg}")
                if consecutive_walls >= 4:
                    print("  aborting: repeated walls")
                    break
                continue
            consecutive_walls = 0
            if status != 200:
                blockers.append(f"HTTP {status} {url}")
                continue
            row = parse_topic(html, final or url, board=th.get("board") or "")
            if not row:
                done.add(url)
                continue
            by_url[url] = row
            done.add(url)
            scraped += 1
        except Exception as exc:  # noqa: BLE001
            blockers.append(f"{url}: {exc}")
            continue

        if scraped and (scraped % args.checkpoint_every == 0 or idx == len(queue)):
            items = list(by_url.values())
            ck.data["done"] = sorted(done)
            ck.data["blockers"] = blockers[-50:]
            ck.data["done_count"] = len(done)
            ck.save()
            write_dump(
                OUT,
                "forum_threads",
                items,
                source=SOURCE,
                source_url=BASE,
                license="research scrape of public forum HTML; redistributable=false",
                redistributable=False,
                note="OZ Stoners IPS first-pass; no invented chem",
                forum="OZ Stoners",
                blockers=blockers[-30:],
            )
            rate = scraped / max(1.0, time.time() - t0)
            print(
                f"  checkpoint items={len(items)} this_run={scraped} "
                f"rate={rate:.2f}/s idx={idx}/{len(queue)}"
            )

    items = list(by_url.values())
    items.sort(key=lambda r: (r.get("name_norm") or "", r.get("url") or ""))
    ck.data["done"] = sorted(done)
    ck.data["blockers"] = blockers[-50:]
    ck.data["done_count"] = len(done)
    ck.save()
    write_dump(
        OUT,
        "forum_threads",
        items,
        source=SOURCE,
        source_url=BASE,
        license="research scrape of public forum HTML; redistributable=false",
        redistributable=False,
        note="OZ Stoners IPS first-pass grow topics; no invented chem",
        forum="OZ Stoners",
        blockers=blockers[-30:],
    )
    print(f"wrote {OUT.name} count={len(items)} blockers={len(blockers)}")

    if not args.skip_stage and items:
        from brain.dsc_brain.staging import write_dump_to_staging  # noqa: WPS433

        st = write_dump_to_staging(OUT, source_id=SOURCE, reset=True)
        print(
            "staging:",
            json.dumps(
                {k: st[k] for k in ("family", "staging_db", "count", "stats") if k in st},
                indent=2,
                default=str,
            ),
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
