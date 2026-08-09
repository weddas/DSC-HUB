#!/usr/bin/env python3
"""Resume SeedFinder scrape via Playwright (CF-safe; urllib stays blocked).

Uses a persistent Chromium profile, resumes checkpoint/done set, stages every N pages.
Off-screen headed window by default (CF friendlier than headless).
"""

from __future__ import annotations

import json
import os
import random
import sys
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(ROOT))

from catalog_fetch import Checkpoint  # noqa: E402
from scrape_seedfinder import (  # noqa: E402
    CK_PATH,
    OUT_DUMP,
    URL_CACHE,
    flush_dump,
    ingest_strain_row,
    is_bot_wall,
    load_existing_items,
    load_or_discover_urls,
    normalize_strain_url,
    open_staging,
    parse_detail,
    row_for_dump,
)
from brain.dsc_brain.corpus import corpus_stats  # noqa: E402

DATA = ROOT / "homeassistant" / "data"
STATE = DATA / "dsc_strains_seedfinder.storage_state.json"
_UD_ENV = (os.environ.get("DSC_SF_UD") or "").strip()
USER_DATA = Path(_UD_ENV) if _UD_ENV else (
    Path.home() / "AppData" / "Local" / "Temp" / "dsc-pw-chromium-seedfinder"
)
LOG = ROOT / "brain" / "data" / "staging" / "seedfinder_pw_scrape.log"
HB = ROOT / "brain" / "data" / "staging" / "seedfinder_scrape.heartbeat"
PID = ROOT / "brain" / "data" / "staging" / "seedfinder_scrape.pid"


def log(msg: str) -> None:
    line = msg if msg.endswith("\n") else msg + "\n"
    print(msg, flush=True)
    try:
        LOG.parent.mkdir(parents=True, exist_ok=True)
        with LOG.open("a", encoding="utf-8") as fh:
            fh.write(line)
    except OSError:
        pass


def beat() -> None:
    try:
        HB.write_text(time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), encoding="utf-8")
    except OSError:
        pass


def page_ok(html: str, title: str, url: str = "") -> bool:
    u = (url or "").lower()
    if u.startswith("chrome-error://") or u.startswith("chrome://"):
        return False
    t = (title or "").lower()
    if "just a moment" in t or "attention required" in t:
        return False
    if is_bot_wall(html, ""):
        if len(html) > 25_000 and ("strain-info" in u or "seedfinder" in t):
            return True
        return False
    low = (html or "").lower()
    if "seedfinder" in t and "just a moment" not in t:
        return True
    if len(html) > 6000 and ("strain" in low or "breeder" in low or "flowering" in low):
        return True
    return False


def try_pass_cf_widgets(page) -> None:
    try:
        for frame in page.frames:
            try:
                loc = frame.locator("input[type=checkbox], .cf-turnstile, #challenge-stage")
                if loc.count() > 0:
                    loc.first.click(timeout=1200)
            except Exception:  # noqa: BLE001
                continue
    except Exception:  # noqa: BLE001
        pass


class BrowserSession:
    def __init__(self, *, headed: bool) -> None:
        self.headed = headed
        self._pw = None
        self.ctx = None
        self.page = None

    def _goto(self, url: str, *, timeout: int = 90_000) -> None:
        assert self.page is not None
        try:
            self.page.goto(url, wait_until="domcontentloaded", timeout=timeout)
        except Exception as exc:  # noqa: BLE001
            msg = str(exc)
            if "ERR_HTTP_RESPONSE_CODE_FAILURE" not in msg and "net::ERR_" not in msg:
                raise
            log(f"  goto_caught {msg[:120]}")

    def open(self) -> None:
        self.close()
        USER_DATA.mkdir(parents=True, exist_ok=True)
        self._pw = sync_playwright().start()
        launch_kwargs: dict = {
            "user_data_dir": str(USER_DATA),
            "headless": not self.headed,
            "viewport": {"width": 1280, "height": 900},
            "args": [
                "--disable-blink-features=AutomationControlled",
                "--disable-quic",
                "--window-position=-2400,-200",
                "--window-size=1100,800",
            ],
            "ignore_default_args": ["--enable-automation"],
        }
        channel = (os.environ.get("DSC_SF_CHANNEL") or "").strip() or None
        if channel:
            launch_kwargs["channel"] = channel
        log(f"launch headed={self.headed} channel={channel!r} ud={USER_DATA}")
        self.ctx = self._pw.chromium.launch_persistent_context(**launch_kwargs)
        self.page = self.ctx.pages[0] if self.ctx.pages else self.ctx.new_page()
        html = title = url = ""
        for attempt in range(1, 10):
            self._goto("https://seedfinder.eu/en", timeout=90_000)
            time.sleep(2)
            html, title, url = self.page.content(), self.page.title(), self.page.url
            log(f"warm attempt={attempt} title={title!r} len={len(html)} url={url[:90]}")
            deadline = time.time() + (150 if self.headed else 90)
            while time.time() < deadline:
                try_pass_cf_widgets(self.page)
                time.sleep(2)
                html, title, url = self.page.content(), self.page.title(), self.page.url
                log(f"  cf_wait title={title!r} len={len(html)}")
                if page_ok(html, title, url):
                    break
            if page_ok(html, title, url):
                break
            time.sleep(min(60, 10 * attempt))
        else:
            raise RuntimeError(f"CF_ON_WARM title={title!r} url={url!r}")
        try:
            self.ctx.storage_state(path=str(STATE))
        except Exception:  # noqa: BLE001
            pass
        log(f"warm_ok title={title!r}")

    def close(self) -> None:
        try:
            if self.ctx:
                self.ctx.close()
        except Exception:  # noqa: BLE001
            pass
        try:
            if self._pw:
                self._pw.stop()
        except Exception:  # noqa: BLE001
            pass
        self.ctx = None
        self._pw = None
        self.page = None

    def fetch(self, url: str) -> str:
        assert self.page is not None
        self._goto(url, timeout=60_000)
        time.sleep(0.4)
        html, title, cur = self.page.content(), self.page.title(), self.page.url
        if not page_ok(html, title, cur):
            # One CF settle retry
            deadline = time.time() + 45
            while time.time() < deadline:
                try_pass_cf_widgets(self.page)
                time.sleep(2)
                html, title, cur = self.page.content(), self.page.title(), self.page.url
                if page_ok(html, title, cur):
                    break
            if not page_ok(html, title, cur):
                raise RuntimeError(f"CF_OR_EMPTY title={title!r} url={cur}")
        return html


def main() -> int:
    delay_lo = 1.5
    delay_hi = 3.0
    ck_every = 25
    dump_every = 500
    limit = 0
    headed = True
    for a in sys.argv[1:]:
        if a == "--headless":
            headed = False
        elif a == "--headed":
            headed = True
        elif a.startswith("--delay-min="):
            delay_lo = max(0.5, float(a.split("=", 1)[1]))
        elif a.startswith("--delay-max="):
            delay_hi = max(0.5, float(a.split("=", 1)[1]))
        elif a.startswith("--delay="):
            d = float(a.split("=", 1)[1])
            delay_lo = max(0.5, d)
            delay_hi = max(delay_lo, d * 2.0)
        elif a.startswith("--checkpoint-every="):
            ck_every = max(5, int(a.split("=", 1)[1]))
        elif a.startswith("--dump-every="):
            dump_every = max(0, int(a.split("=", 1)[1]))
        elif a.startswith("--limit="):
            limit = max(0, int(a.split("=", 1)[1]))

    if delay_hi < delay_lo:
        delay_lo, delay_hi = delay_hi, delay_lo

    PID.parent.mkdir(parents=True, exist_ok=True)
    PID.write_text(str(os.getpid()), encoding="utf-8")
    beat()

    # Prefer URL cache (no network). Fall back only if missing.
    if URL_CACHE.exists():
        urls = load_or_discover_urls(mode="sitemap", delay=delay_lo, refresh=False)
    else:
        log("URL cache missing — warm browser first, then discover via PW homepage only fails; abort")
        return 3

    ck = Checkpoint(CK_PATH)
    done_set = set(ck.data.get("done") or [])
    items = load_existing_items()
    seen = {normalize_strain_url(str(i.get("url") or "")) for i in items}
    seen.discard(None)
    seen |= done_set
    todo = [u for u in urls if u not in seen]
    if limit:
        todo = todo[:limit]
    log(
        f"resume urls={len(urls)} have={len(items)} done={len(done_set)} "
        f"todo={len(todo)} delay={delay_lo:.1f}-{delay_hi:.1f}s headed={headed}"
    )

    staging_conn, staging_path = open_staging(reset=False)
    log(f"staging {staging_path}")
    session = BrowserSession(headed=headed)
    blockers: list[str] = []
    try:
        session.open()
    except Exception as exc:  # noqa: BLE001
        log(f"OPEN_FAIL {exc}")
        staging_conn.close()
        return 2

    scraped = 0
    try:
        for i, url in enumerate(todo, 1):
            d = random.uniform(delay_lo, delay_hi)
            time.sleep(d)
            try:
                html = session.fetch(url)
            except Exception as exc:  # noqa: BLE001
                msg = f"{url}: {exc}"
                log(f"  FAIL {msg[:200]}")
                blockers.append(msg)
                ck.note_error(msg)
                # Hard stop on repeated CF
                if "CF_" in str(exc) or "just a moment" in str(exc).lower():
                    log(f"CF_BLOCKED {url}")
                    break
                continue

            row = parse_detail(html, url)
            ingest_strain_row(
                staging_conn,
                row,
                source_id="seedfinder",
                store_attrs=False,
                store_raw=True,
            )
            items.append(row_for_dump(row))
            done_set.add(url)
            scraped += 1
            beat()

            if i % ck_every == 0:
                ck.data["done"] = sorted(done_set)
                ck.save()
                staging_conn.commit()
                do_dump = dump_every > 0 and (i % dump_every == 0)
                if do_dump:
                    flush_dump(
                        items,
                        blockers=blockers,
                        note="pw partial; html_raw in staging",
                    )
                log(
                    f"  checkpoint {len(done_set)}/{len(urls)} (+{i}/{len(todo)}) "
                    f"scraped={scraped}" + (" dump=flushed" if do_dump else "")
                )
                try:
                    session.ctx.storage_state(path=str(STATE))
                except Exception:  # noqa: BLE001
                    pass
    finally:
        ck.data["done"] = sorted(done_set)
        ck.save()
        try:
            staging_conn.commit()
        except Exception:  # noqa: BLE001
            pass
        flush_dump(
            items,
            blockers=blockers,
            note="pw scrape checkpoint; html_raw in staging",
        )
        stats = corpus_stats(staging_conn)
        staging_conn.close()
        session.close()
        log(f"staging_stats {json.dumps(stats)}")
        log(f"DONE scraped={scraped} done_total={len(done_set)} blockers={len(blockers)}")
        try:
            PID.unlink(missing_ok=True)
        except OSError:
            pass
    return 0 if scraped or not blockers else 1


if __name__ == "__main__":
    raise SystemExit(main())
