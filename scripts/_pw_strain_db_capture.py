#!/usr/bin/env python3
"""Pass CF via headed Chrome, save storage_state + cookie jar for strain-database.com."""

from __future__ import annotations

import json
import sys
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "homeassistant" / "data"
SHOT = DATA / "_pw_strain_db_cf.png"
STATE = DATA / "dsc_strains_straindatabase.storage_state.json"
JAR = DATA / "dsc_strains_straindatabase.cookies.json"
URL = "https://strain-database.com/strains"
PDP = "https://strain-database.com/strain/blue-dream"


def page_ready(html: str, title: str) -> bool:
    t = (title or "").lower()
    low = (html or "").lower()
    if "just a moment" in t or "attention required" in t:
        return False
    if "browse" in t and "strain" in t:
        return True
    if "strain database" in t and "just a moment" not in t:
        return True
    markers = ("__next_data__", "application/ld+json", 'href="/strain/', "cannabis strains")
    return any(m in low for m in markers) and len(html) > 5000


def main() -> int:
    wait_s = 120
    for a in sys.argv[1:]:
        if a.startswith("--wait="):
            wait_s = int(a.split("=", 1)[1])
    user_data = Path.home() / "AppData" / "Local" / "Temp" / "dsc-chrome-fresh-pw2"
    user_data.mkdir(parents=True, exist_ok=True)
    DATA.mkdir(parents=True, exist_ok=True)
    print(f"user_data={user_data} wait={wait_s}s")

    with sync_playwright() as p:
        ctx = p.chromium.launch_persistent_context(
            user_data_dir=str(user_data),
            channel="chrome",
            headless=False,
            viewport={"width": 1280, "height": 900},
            args=["--disable-blink-features=AutomationControlled"],
            ignore_default_args=["--enable-automation"],
        )
        page = ctx.pages[0] if ctx.pages else ctx.new_page()
        try:
            page.goto(URL, wait_until="domcontentloaded", timeout=90_000)
        except Exception as exc:  # noqa: BLE001
            print(f"goto_err={exc}")
        time.sleep(3)

        deadline = time.time() + wait_s
        ready = False
        while time.time() < deadline:
            try:
                if page.is_closed():
                    print("page_closed")
                    break
                html = page.content()
                title = page.title()
                print(f"tick title={title!r} len={len(html)} url={page.url}")
                if page_ready(html, title):
                    ready = True
                    break
            except Exception as exc:  # noqa: BLE001
                print(f"tick_err={type(exc).__name__}: {exc}")
                time.sleep(2)
                continue
            time.sleep(2)

        if not ready:
            try:
                page.screenshot(path=str(SHOT), full_page=True)
            except Exception:  # noqa: BLE001
                pass
            print(f"CF_NOT_CLEARED screenshot={SHOT}")
            try:
                ctx.close()
            except Exception:  # noqa: BLE001
                pass
            return 2

        # Probe PDP
        try:
            page.goto(PDP, wait_until="domcontentloaded", timeout=90_000)
            time.sleep(2)
            html = page.content()
            title = page.title()
            print(f"pdp title={title!r} len={len(html)}")
            if not page_ready(html, title) and "blue" not in title.lower():
                print("PDP_NOT_READY")
                page.screenshot(path=str(SHOT), full_page=True)
                ctx.close()
                return 3
        except Exception as exc:  # noqa: BLE001
            print(f"pdp_err={exc}")
            ctx.close()
            return 3

        cookies = ctx.cookies("https://strain-database.com")
        names = [c["name"] for c in cookies]
        print(f"cookies={names}")
        ctx.storage_state(path=str(STATE))
        jar = {
            "domain": "strain-database.com",
            "saved_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "source": "playwright_headed_storage_state",
            "cookies": {c["name"]: c["value"] for c in cookies if c.get("value")},
        }
        JAR.write_text(json.dumps(jar, indent=2), encoding="utf-8")
        print(f"OK storage_state={STATE} jar_count={len(jar['cookies'])}")
        ctx.close()
        return 0


if __name__ == "__main__":
    raise SystemExit(main())
