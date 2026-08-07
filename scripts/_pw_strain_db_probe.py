#!/usr/bin/env python3
"""Probe strain-database.com via Playwright + Chrome profile copy."""

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
USER_DATA = Path.home() / "AppData" / "Local" / "Temp" / "dsc-chrome-profile-copy"
URL = "https://strain-database.com/strains"
PDP = "https://strain-database.com/strain/blue-dream"


def looks_cf(html: str, title: str) -> bool:
    low = (html or "").lower()
    t = (title or "").lower()
    markers = (
        "just a moment",
        "cf-browser-verification",
        "challenge-platform",
        "attention required",
        "enable javascript and cookies",
    )
    if any(m in low for m in markers) or any(m in t for m in ("just a moment", "attention required")):
        return True
    return False


def main() -> int:
    headed = "--headed" in sys.argv
    wait_manual = "--wait-manual" in sys.argv
    print(f"user_data_dir={USER_DATA} exists={USER_DATA.exists()} headed={headed}")
    DATA.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as p:
        context = p.chromium.launch_persistent_context(
            user_data_dir=str(USER_DATA),
            channel="chrome",
            headless=not headed,
            viewport={"width": 1280, "height": 900},
            args=["--disable-blink-features=AutomationControlled"],
        )
        page = context.pages[0] if context.pages else context.new_page()
        page.goto(URL, wait_until="domcontentloaded", timeout=90_000)
        time.sleep(3)
        html = page.content()
        title = page.title()
        print(f"list_url={page.url} title={title!r} html_len={len(html)}")

        if looks_cf(html, title):
            SHOT.parent.mkdir(parents=True, exist_ok=True)
            page.screenshot(path=str(SHOT), full_page=True)
            print(f"CF_CHALLENGE screenshot={SHOT}")
            if wait_manual and headed:
                print("Waiting up to 60s for manual CF clear...")
                deadline = time.time() + 60
                while time.time() < deadline:
                    time.sleep(2)
                    html = page.content()
                    title = page.title()
                    if not looks_cf(html, title):
                        print("CF cleared by user")
                        break
                else:
                    print("CF still present after 60s")
                    context.close()
                    return 2
            else:
                context.close()
                return 2

        # Probe a PDP
        page.goto(PDP, wait_until="domcontentloaded", timeout=90_000)
        time.sleep(2)
        html = page.content()
        title = page.title()
        print(f"pdp_url={page.url} title={title!r} html_len={len(html)}")
        if looks_cf(html, title) or len(html) < 800:
            page.screenshot(path=str(SHOT), full_page=True)
            print(f"PDP_BLOCKED screenshot={SHOT}")
            context.close()
            return 3

        cookies = context.cookies("https://strain-database.com")
        print(f"cookie_count={len(cookies)} names={[c['name'] for c in cookies]}")
        context.storage_state(path=str(STATE))
        print(f"storage_state={STATE}")

        # Also write scraper jar JSON for curl_cffi path
        jar = {
            "domain": "strain-database.com",
            "saved_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "source": "playwright_storage_state",
            "cookies": {c["name"]: c["value"] for c in cookies if c.get("value")},
        }
        jar_path = DATA / "dsc_strains_straindatabase.cookies.json"
        jar_path.write_text(json.dumps(jar, indent=2), encoding="utf-8")
        print(f"cookie_jar={jar_path} jar_count={len(jar['cookies'])}")
        context.close()
        return 0


if __name__ == "__main__":
    raise SystemExit(main())
