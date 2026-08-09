#!/usr/bin/env python3
"""Resume strain-database scrape via Playwright with auto-relaunch on crash.

Uses a persistent Chrome profile (not curl/urllib). Resumes from checkpoint,
stages dump+raw_record periodically, backs off on 429.
"""

from __future__ import annotations

import json
import random
import os
import sys
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from catalog_fetch import Checkpoint  # noqa: E402
from scrape_strain_database import (  # noqa: E402
    CK_PATH,
    OUT,
    SITEMAP_CACHE,
    is_anubis_wall,
    is_cloudflare_wall,
    parse_strain_page,
    stage_dump,
    write_partial,
)

DATA = ROOT / "homeassistant" / "data"
STATE = DATA / "dsc_strains_straindatabase.storage_state.json"
_UD_ENV = (os.environ.get("DSC_SDB_UD") or "").strip()
USER_DATA = Path(_UD_ENV) if _UD_ENV else (
    Path.home() / "AppData" / "Local" / "Temp" / "dsc-pw-chromium-sdb"
)
# Optional: DSC_SDB_CHANNEL=chrome to force system Chrome (currently hard-fails on this host)
_CHANNEL = (os.environ.get("DSC_SDB_CHANNEL") or "").strip() or None
LOG = DATA / "_pw_strain_db_scrape_run2.log"


def log(msg: str) -> None:
    line = msg if msg.endswith("\n") else msg + "\n"
    print(msg, flush=True)
    try:
        with LOG.open("a", encoding="utf-8") as fh:
            fh.write(line)
    except OSError:
        pass


def is_chrome_error_url(url: str) -> bool:
    u = (url or "").lower()
    return u.startswith("chrome-error://") or u.startswith("chrome://")


def page_ok(html: str, title: str, url: str = "") -> bool:
    if is_chrome_error_url(url):
        return False
    t = (title or "").lower()
    if "just a moment" in t or "attention required" in t:
        return False
    if "429" in t or "too many requests" in t:
        return False
    if t.strip() in {"", "strain-database.com"}:
        return False
    if "browse" in t and "strain" in t:
        return True
    if is_cloudflare_wall(html) or is_anubis_wall(html):
        if len(html) > 20_000 and ("<h1" in html.lower() or "ld+json" in html.lower()):
            return True
        return False
    low = (html or "").lower()
    if len(html) > 8000 and ("<h1" in low or "ld+json" in low or "cannabis" in t):
        return True
    return False


def is_rate_limited(html: str, title: str) -> bool:
    t = (title or "").lower()
    low = (html or "").lower()
    return "429" in t or "too many requests" in t or "too many requests" in low


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
        """Navigate; swallow Chromium ERR_HTTP_RESPONSE_CODE_FAILURE so CF HTML can stay."""
        assert self.page is not None
        try:
            self.page.goto(url, wait_until="domcontentloaded", timeout=timeout)
        except Exception as exc:  # noqa: BLE001
            msg = str(exc)
            if "ERR_HTTP_RESPONSE_CODE_FAILURE" not in msg and "net::ERR_" not in msg:
                raise
            log(f"  goto_caught {msg[:120]}")
            # Do NOT soft-navigate — that collapses CF challenge into chrome-error://

    def _snapshot(self) -> tuple[str, str, str]:
        assert self.page is not None
        return self.page.content(), self.page.title(), self.page.url

    def open(self, *, max_attempts: int = 12) -> None:
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
                # Keep any headed window off-screen so we don't steal focus/fullscreen.
                "--window-position=-2400,-200",
                "--window-size=1100,800",
            ],
            "ignore_default_args": ["--enable-automation"],
        }
        if _CHANNEL:
            launch_kwargs["channel"] = _CHANNEL
        log(f"launch channel={_CHANNEL!r} ud={USER_DATA}")
        self.ctx = self._pw.chromium.launch_persistent_context(**launch_kwargs)
        self.page = self.ctx.pages[0] if self.ctx.pages else self.ctx.new_page()
        html = title = url = ""
        last_err: Exception | None = None
        max_attempts = max(1, int(max_attempts))
        for attempt in range(1, max_attempts + 1):
            try:
                self._goto("https://strain-database.com/strains", timeout=90_000)
                last_err = None
                time.sleep(2)
                html, title, url = self._snapshot()
                log(f"warm attempt={attempt} title={title!r} len={len(html)} url={url[:90]}")
                if page_ok(html, title, url):
                    break
                # Settle CF in headed or headless (headed window is off-screen).
                deadline = time.time() + (180 if self.headed else 120)
                chrome_err_hits = 0
                while time.time() < deadline:
                    if is_chrome_error_url(self.page.url):
                        chrome_err_hits += 1
                        log(f"  chrome-error — re-nav /strains ({chrome_err_hits})")
                        if chrome_err_hits >= 3:
                            log("  chrome-error wall — abort settle loop")
                            break
                        self._goto("https://strain-database.com/strains", timeout=60_000)
                        time.sleep(5)
                    try_pass_cf_widgets(self.page)
                    time.sleep(3)
                    try:
                        html, title, url = self._snapshot()
                    except Exception as exc:  # noqa: BLE001
                        log(f"  cf_wait_err {exc}")
                        continue
                    log(f"  cf_wait title={title!r} len={len(html)} url={url[:70]}")
                    if page_ok(html, title, url):
                        break
                    if is_rate_limited(html, title):
                        time.sleep(25)
                if page_ok(html, title, url):
                    break
                wait = min(90, 12 * attempt)
                log(f"  warm_not_ready sleep={wait}s")
                time.sleep(wait)
            except Exception as exc:  # noqa: BLE001
                last_err = exc
                wait = min(120, 15 * attempt)
                log(f"  warm_nav_err attempt={attempt} wait={wait}s: {str(exc)[:160]}")
                time.sleep(wait)
                try:
                    if self.page is None or self.page.is_closed():
                        self.page = self.ctx.new_page() if self.ctx else None
                except Exception:  # noqa: BLE001
                    pass
        else:
            raise RuntimeError(f"CF_ON_WARM last={last_err!r} title={title!r} url={url!r}")
        if not page_ok(html, title, url):
            raise RuntimeError(f"CF_ON_WARM title={title!r} url={url!r}")
        try:
            self.ctx.storage_state(path=str(STATE))
        except Exception:  # noqa: BLE001
            pass
        log(f"warm_ok title={title!r} profile={USER_DATA}")

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

    def fetch(self, url: str) -> tuple[str, str]:
        assert self.page is not None
        last_exc: Exception | None = None
        for attempt in range(4):
            try:
                self._goto(url, timeout=60_000)
                time.sleep(0.45)
                if is_chrome_error_url(self.page.url):
                    time.sleep(2)
                    self._goto(url, timeout=60_000)
                    time.sleep(0.5)
                return self.page.content(), self.page.title()
            except Exception as exc:  # noqa: BLE001
                last_exc = exc
                msg = str(exc)
                if "ERR_HTTP_RESPONSE_CODE_FAILURE" in msg or "429" in msg or "net::ERR_" in msg:
                    wait = min(120, 20 * (attempt + 1))
                    log(f"  fetch_http_fail attempt={attempt+1} sleep={wait}s")
                    time.sleep(wait)
                    continue
                raise
        assert last_exc is not None
        raise last_exc


def checkpoint(
    *,
    ck: Checkpoint,
    done: set[str],
    by_url: dict,
    blockers: list[str],
    url: str,
    scraped: int,
    stage: bool,
) -> None:
    items = list(by_url.values())
    ck.data["done"] = sorted(done)
    ck.data["done_count"] = len(done)
    ck.data["cursor"] = url
    ck.data.pop("blocked_url", None)
    ck.save()
    write_partial(items, note=f"pw checkpoint {len(items)}", blockers=blockers)
    if stage:
        try:
            st = stage_dump(reset=True)
            log(f"  staged count={st.get('count')} after scraped={scraped} done={len(done)}")
        except Exception as st_exc:  # noqa: BLE001
            log(f"  stage_err {st_exc}")


def main() -> int:
    limit: int | None = None
    # StrainDB-only slow randomized pacing (seconds between page loads).
    delay_lo = 8.0
    delay_hi = 20.0
    ck_every = 25
    stage_every = 50
    headed = False  # prefer headless; use --headed only if CF needs eyes
    for a in sys.argv[1:]:
        if a == "--headless":
            headed = False
        elif a == "--headed":
            headed = True
        elif a.startswith("--limit="):
            v = int(a.split("=", 1)[1])
            limit = None if v <= 0 else v
        elif a.startswith("--delay="):
            # Compat: fixed value becomes center of a +/-40% jitter band, floored at 5s.
            d = float(a.split("=", 1)[1])
            delay_lo = max(5.0, d * 0.6)
            delay_hi = max(delay_lo + 1.0, d * 1.4)
        elif a.startswith("--delay-min="):
            delay_lo = max(5.0, float(a.split("=", 1)[1]))
        elif a.startswith("--delay-max="):
            delay_hi = max(5.0, float(a.split("=", 1)[1]))
        elif a.startswith("--checkpoint-every="):
            ck_every = max(5, int(a.split("=", 1)[1]))
        elif a.startswith("--stage-every="):
            stage_every = max(ck_every, int(a.split("=", 1)[1]))

    if delay_hi < delay_lo:
        delay_lo, delay_hi = delay_hi, delay_lo
    # After 429/CF, widen the band but never go faster than delay_lo.
    pace_lo = delay_lo
    pace_hi = delay_hi

    def next_delay() -> float:
        return random.uniform(pace_lo, pace_hi)

    def harden_pace(hits: int) -> None:
        """After rate-limit hits: slow way down (minutes-scale waits done separately)."""
        nonlocal pace_lo, pace_hi
        pace_lo = max(delay_lo, min(45.0, delay_lo + 2.0 * hits))
        pace_hi = max(pace_lo + 2.0, min(90.0, delay_hi + 5.0 * hits))
    raw = json.loads(SITEMAP_CACHE.read_text(encoding="utf-8"))
    urls = [u for u in (raw.get("urls") or []) if isinstance(u, str)]
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
    done = {u for u in done if u in by_url}
    remaining = [u for u in urls if u not in done or u not in by_url]
    blockers: list[str] = []
    scraped = 0
    rate_hits = 0
    t0 = time.time()
    target = len(remaining) if limit is None else min(limit, len(remaining))
    log(
        f"resume target_new={target} remaining={len(remaining)} "
        f"already_done={len(done)} sitemap={len(urls)} delay_s={pace_lo:.1f}-{pace_hi:.1f} headed={headed} ud={USER_DATA}"
    )

    session = BrowserSession(headed=headed)
    try:
        session.open()
    except Exception as exc:  # noqa: BLE001
        log(f"OPEN_FAIL {exc}")
        return 2

    try:
        for url in remaining:
            if limit is not None and scraped >= limit:
                break
            d = next_delay()
            log(f"  pace sleep {d:.1f}s (band {pace_lo:.1f}-{pace_hi:.1f})")
            time.sleep(d)
            html = title = ""
            for attempt in range(3):
                try:
                    html, title = session.fetch(url)
                    break
                except Exception as exc:  # noqa: BLE001
                    msg = f"{type(exc).__name__}: {exc}"
                    log(f"  nav_err attempt={attempt+1} {url}: {msg[:180]}")
                    blockers.append(f"{url}: {msg[:200]}")
                    if "ERR_HTTP_RESPONSE_CODE_FAILURE" in msg or "429" in msg:
                        rate_hits += 1
                        wait = min(900, 120 * rate_hits)  # 2–15 min hard backoff
                        harden_pace(rate_hits)
                        log(
                            f"  HTTP_FAIL backoff {wait}s (hits={rate_hits}) "
                            f"pace->{pace_lo:.1f}-{pace_hi:.1f}"
                        )
                        time.sleep(wait)
                    try:
                        session.open()
                    except Exception as open_exc:  # noqa: BLE001
                        log(f"  relaunch_fail {open_exc}")
                        time.sleep(5)
                    continue
            else:
                continue

            page_url = ""
            try:
                page_url = session.page.url if session.page else ""
            except Exception:  # noqa: BLE001
                page_url = ""

            if is_rate_limited(html, title):
                rate_hits += 1
                wait = min(900, 180 * rate_hits)  # 3–15 min
                harden_pace(rate_hits)
                log(
                    f"  RATE_LIMIT {url} sleep {wait}s (hits={rate_hits}) "
                    f"pace->{pace_lo:.1f}-{pace_hi:.1f}"
                )
                time.sleep(wait)
                try:
                    html, title = session.fetch(url)
                except Exception as exc:  # noqa: BLE001
                    log(f"  rate_retry_err {exc}")
                    time.sleep(15)
                    continue
                if is_rate_limited(html, title):
                    log(f"  SOFT_STOP RATE_LIMIT {url} scraped={scraped} done={len(done)}")
                    ck.data["blocked_url"] = url
                    checkpoint(
                        ck=ck,
                        done=done,
                        by_url=by_url,
                        blockers=blockers,
                        url=url,
                        scraped=scraped,
                        stage=True,
                    )
                    try:
                        if session.ctx:
                            session.ctx.storage_state(path=str(STATE))
                    except Exception:  # noqa: BLE001
                        pass
                    return 4
                harden_pace(rate_hits)
                rate_hits = max(0, rate_hits - 1)

            if not page_ok(html, title, page_url):
                rate_hits += 1
                wait = min(1200, 300 * rate_hits)  # 5–20 min CF pause
                harden_pace(rate_hits)
                log(
                    f"  CF_CHALLENGE {url} title={title!r} "
                    f"sleep {wait}s pace->{pace_lo:.1f}-{pace_hi:.1f}"
                )
                ck.data["blocked_url"] = url
                checkpoint(
                    ck=ck,
                    done=done,
                    by_url=by_url,
                    blockers=blockers,
                    url=url,
                    scraped=scraped,
                    stage=True,
                )
                time.sleep(wait)
                # Limited re-warm only — never hammer CF with a full 12-attempt open.
                try:
                    session.open(max_attempts=2)
                    html, title = session.fetch(url)
                    page_url = session.page.url if session.page else ""
                except Exception as cf_exc:  # noqa: BLE001
                    log(f"  CF_retry_err {cf_exc}")
                    return 3
                if not page_ok(html, title, page_url):
                    log(f"  STOP CF {url} title={title!r} page_url={page_url!r}")
                    return 3

            try:
                row = parse_strain_page(html, url)
            except Exception as exc:  # noqa: BLE001
                blockers.append(f"parse {url}: {exc}")
                log(f"  parse_err {url}: {exc}")
                continue

            by_url[url] = row
            done.add(url)
            scraped += 1
            rate_hits = max(0, rate_hits - 1)

            if scraped % 10 == 0 or scraped == 1:
                rate = scraped / max(1.0, time.time() - t0)
                log(
                    f"  {scraped}(+{len(done)}) name={row.get('name')!r} "
                    f"mermaid={bool(row.get('lineage_mermaid'))} rate={rate:.2f}/s"
                )

            if scraped % ck_every == 0:
                do_stage = scraped % stage_every == 0
                checkpoint(
                    ck=ck,
                    done=done,
                    by_url=by_url,
                    blockers=blockers,
                    url=url,
                    scraped=scraped,
                    stage=do_stage,
                )
                try:
                    if session.ctx:
                        session.ctx.storage_state(path=str(STATE))
                except Exception:  # noqa: BLE001
                    pass

    except Exception as exc:  # noqa: BLE001
        log(f"FATAL {type(exc).__name__}: {exc}")
        checkpoint(
            ck=ck,
            done=done,
            by_url=by_url,
            blockers=blockers,
            url=ck.data.get("cursor") or "",
            scraped=scraped,
            stage=True,
        )
        session.close()
        return 1
    finally:
        try:
            session.close()
        except Exception:  # noqa: BLE001
            pass

    items = list(by_url.values())
    items.sort(key=lambda r: (r.get("name_norm") or "", r.get("url") or ""))
    ck.data["done"] = sorted(done)
    ck.data["done_count"] = len(done)
    ck.data.pop("blocked_url", None)
    ck.save()
    write_partial(items, note="pw scrape complete", blockers=blockers)
    mermaid_n = sum(1 for i in items if i.get("lineage_mermaid"))
    log(f"wrote {OUT.name} count={len(items)} this_run={scraped} mermaid={mermaid_n}")
    st = stage_dump(reset=True)
    log(f"staging_count={st.get('count')} db={st.get('staging_db')}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
