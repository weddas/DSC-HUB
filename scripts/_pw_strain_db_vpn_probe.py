#!/usr/bin/env python3
"""Quick CF probe for strain-database.com (HTTP + Playwright)."""
from __future__ import annotations

import re
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from scrape_strain_database import Session, is_anubis_wall, is_cloudflare_wall  # noqa: E402

URLS = [
    "https://strain-database.com/strains",
    "https://strain-database.com/strain/blue-dream",
]


def title_of(html: str) -> str:
    m = re.search(r"<title[^>]*>([^<]+)", html or "", re.I)
    return (m.group(1).strip() if m else "")[:100]


def probe_http() -> None:
    s = Session()
    for u in URLS:
        try:
            st, body = s.get(u, timeout=45)
            print(
                "HTTP",
                st,
                "cf=",
                is_cloudflare_wall(body, st),
                "anubis=",
                is_anubis_wall(body),
                "len=",
                len(body or ""),
                "title=",
                repr(title_of(body)),
                "url=",
                u,
            )
        except Exception as exc:  # noqa: BLE001
            print("HTTP_ERR", u, exc)


def probe_pw(*, headed: bool = True) -> int:
    from playwright.sync_api import sync_playwright

    user_data = Path.home() / "AppData" / "Local" / "Temp" / "dsc-chrome-fresh-pw"
    print("PW user_data=", user_data, "exists=", user_data.exists(), "headed=", headed)
    with sync_playwright() as p:
        ctx = p.chromium.launch_persistent_context(
            user_data_dir=str(user_data if user_data.exists() else Path.home() / "AppData" / "Local" / "Temp" / "dsc-chrome-vpn-pw"),
            channel="chrome",
            headless=not headed,
            viewport={"width": 1280, "height": 900},
            args=["--disable-blink-features=AutomationControlled"],
            ignore_default_args=["--enable-automation"],
        )
        page = ctx.pages[0] if ctx.pages else ctx.new_page()
        page.goto(URLS[0], wait_until="domcontentloaded", timeout=90_000)
        time.sleep(3)
        html, title = page.content(), page.title()
        print("PW list title=", repr(title), "len=", len(html), "url=", page.url)
        ok = "browse" in title.lower() or ("strain" in title.lower() and "moment" not in title.lower() and "attention" not in title.lower())
        if not ok and headed:
            print("PW waiting 60s for manual/CF clear...")
            deadline = time.time() + 60
            while time.time() < deadline:
                time.sleep(3)
                title = page.title()
                print("  tick", repr(title))
                if "browse" in title.lower() or ("just a moment" not in title.lower() and "attention" not in title.lower() and len(title) > 10):
                    html = page.content()
                    ok = True
                    break
        if not ok:
            shot = ROOT / "homeassistant" / "data" / "_pw_strain_db_cf.png"
            page.screenshot(path=str(shot), full_page=True)
            print("PW_CF_BLOCKED screenshot=", shot)
            ctx.close()
            return 2
        page.goto(URLS[1], wait_until="domcontentloaded", timeout=60_000)
        time.sleep(2)
        html, title = page.content(), page.title()
        print("PW pdp title=", repr(title), "len=", len(html))
        cookies = ctx.cookies("https://strain-database.com")
        print("PW cookies=", [c["name"] for c in cookies])
        state = ROOT / "homeassistant" / "data" / "dsc_strains_straindatabase.storage_state.json"
        ctx.storage_state(path=str(state))
        jar = {
            "domain": "strain-database.com",
            "source": "pw_vpn_probe",
            "cookies": {c["name"]: c["value"] for c in cookies if c.get("value")},
        }
        import json

        (ROOT / "homeassistant" / "data" / "dsc_strains_straindatabase.cookies.json").write_text(
            json.dumps(jar, indent=2), encoding="utf-8"
        )
        ctx.close()
        return 0 if len(html) > 5000 else 3


if __name__ == "__main__":
    probe_http()
    mode = sys.argv[1] if len(sys.argv) > 1 else "headed"
    raise SystemExit(probe_pw(headed=mode != "headless"))
