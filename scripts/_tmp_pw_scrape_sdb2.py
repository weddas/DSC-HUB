"""Browser scrape for strain-database using Playwright Chrome (CF-bound cookies)."""
from __future__ import annotations

import json
import os
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(ROOT))

from playwright.sync_api import sync_playwright

import scrape_strain_database as sdb

PROFILE = Path(os.environ["LOCALAPPDATA"]) / "Temp" / "dsc-chrome-fresh-pw"
LIMIT = 25
DELAY = 0.55


def main() -> int:
    if not PROFILE.is_dir():
        print(f"missing profile {PROFILE}")
        return 2

    urls: list[str] = []
    if sdb.SITEMAP_CACHE.exists():
        raw = json.loads(sdb.SITEMAP_CACHE.read_text(encoding="utf-8"))
        urls = [u for u in (raw.get("urls") or []) if isinstance(u, str)]
    if not urls:
        print("no sitemap cache")
        return 3
    urls = urls[:LIMIT]

    ck = sdb.Checkpoint(sdb.CK_PATH)
    done = set(ck.data.get("done") or [])
    items: list[dict] = []
    if sdb.OUT.exists():
        try:
            prev = json.loads(sdb.OUT.read_text(encoding="utf-8"))
            items = [i for i in (prev.get("items") or []) if isinstance(i, dict)]
        except Exception:
            items = []
    by_url = {i.get("url"): i for i in items if i.get("url")}
    scraped = 0
    t0 = time.time()
    blocked = False
    jar: dict = {}

    with sync_playwright() as p:
        ctx = p.chromium.launch_persistent_context(
            user_data_dir=str(PROFILE),
            channel="chrome",
            headless=False,
            viewport={"width": 1280, "height": 900},
        )
        page = ctx.pages[0] if ctx.pages else ctx.new_page()
        page.goto("https://strain-database.com/strains", wait_until="domcontentloaded", timeout=90000)
        time.sleep(2)
        title = page.title()
        print("warm_title", title, "url", page.url)
        if "just a moment" in title.lower():
            print("CF wall on warm; waiting up to 90s for pass...")
            for _ in range(90):
                time.sleep(1)
                title = page.title()
                if "just a moment" not in title.lower():
                    break
            print("after_wait", page.title(), page.url)

        cookies = ctx.cookies(["https://strain-database.com"])
        jar = {c["name"]: c["value"] for c in cookies if c.get("name") and c.get("value")}
        sdb.COOKIE_JAR.write_text(
            json.dumps(
                {
                    "domain": "strain-database.com",
                    "saved_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                    "source": "playwright_dsc-chrome-fresh-pw",
                    "cookies": jar,
                },
                indent=2,
            ),
            encoding="utf-8",
        )
        print("cookie_count", len(jar), "names", sorted(jar))

        for idx, url in enumerate(urls, 1):
            if url in done and url in by_url:
                continue
            try:
                time.sleep(DELAY)
                page.goto(url, wait_until="domcontentloaded", timeout=60000)
                html = page.content()
                low = html[:4000].lower()
                if "just a moment" in low or "just a moment" in page.title().lower():
                    print(f"STOP CLOUDFLARE {url}")
                    blocked = True
                    break
                if "anubis_challenge" in low or (
                    "anubis" in low and "challenge" in low and len(html) < 20000
                ):
                    print(f"STOP ANUBIS {url}")
                    blocked = True
                    break
                row = sdb.parse_strain_page(html, url)
                by_url[url] = row
                done.add(url)
                scraped += 1
                if scraped % 5 == 0 or scraped == 1:
                    rate = scraped / max(1.0, time.time() - t0)
                    print(
                        f"  n={scraped} idx={idx}/{len(urls)} name={row.get('name')!r} "
                        f"mermaid={bool(row.get('lineage_mermaid'))} rate={rate:.2f}/s"
                    )
            except Exception as exc:
                print(f"  err {url}: {exc}")
                continue

        items = list(by_url.values())
        ck.data["done"] = sorted(done)
        ck.data["done_count"] = len(done)
        ck.save()
        sdb.write_partial(
            items,
            note=f"playwright scrape this_run={scraped}",
            blockers=["CLOUDFLARE"] if blocked else [],
        )
        ctx.close()

    mermaid_n = sum(1 for i in items if i.get("lineage_mermaid"))
    print(
        f"DONE scraped_n={scraped} dump_items={len(items)} mermaid={mermaid_n} cookie_count={len(jar)}"
    )
    if scraped:
        st = sdb.stage_dump(reset=True)
        print("staging_count", st.get("count"))
    return 0 if scraped else 1


if __name__ == "__main__":
    raise SystemExit(main())