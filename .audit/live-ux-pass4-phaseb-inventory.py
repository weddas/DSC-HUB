"""Pass 4 Phase B inventory — Light / Climate / Overview via Playwright."""
from __future__ import annotations

import json
import re
from pathlib import Path

from playwright.sync_api import sync_playwright

OUT = Path(r"C:\Users\cmgwe\Documents\DSC-HUB\docs\qa-screenshots-2026-09-01-live-ux")
EVID = Path(r"C:\Users\cmgwe\Documents\DSC-HUB\.audit\live-ux-pass4-phaseb-inventory.json")
BASE = "http://192.168.86.48:8787"


def click_zone(page, label: str) -> None:
    page.locator(
        'div[role="group"][aria-label="Zone emphasis"] button.dsc-chip',
        has_text=label,
    ).first.click()
    page.wait_for_timeout(1500)


def scroll_to(page, pattern: str) -> None:
    page.evaluate(
        """(pat) => {
          const re = new RegExp(pat, 'i');
          const el = [...document.querySelectorAll('h1,h2,h3,h4,.dsc-card-title,[class*="title"],p,div,span,button,label')]
            .find(e => re.test((e.textContent||'').trim()) && (e.textContent||'').trim().length < 140);
          if (el) el.scrollIntoView({block:'center'});
        }""",
        pattern,
    )
    page.wait_for_timeout(700)


def markers(text: str, pats: list[str]) -> dict[str, bool]:
    return {p: bool(re.search(p, text, re.I)) for p in pats}


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    result: dict = {"light": {}, "climate": {}, "overview": {}}
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1600, "height": 1400})

        page.goto(f"{BASE}/#/live/light", wait_until="domcontentloaded", timeout=60000)
        page.wait_for_timeout(5000)
        light = page.inner_text("body")
        (OUT / "pass4-b-light-page-text.txt").write_text(light, encoding="utf-8")
        page.screenshot(path=str(OUT / "pass4-b-light-top.png"), full_page=False)
        result["light"]["markers"] = markers(
            light,
            [
                r"Got · Twin",
                r"TWIN SF1000",
                r"GPIO5",
                r"not physically wired",
                r"ENERGY \(ESTIMATE\)",
                r"OCCUPANCY JOURNAL",
                r"SCHEDULE · FOLLOW",
                r"0\.0H ON",
                r"DARK",
                r"MANUAL LIGHT HOLD",
                r"TWIN SF1000 24H",
            ],
        )
        result["light"]["duty_lines"] = [
            ln.strip()[:200]
            for ln in light.splitlines()
            if any(x in ln for x in ("24H", "0.0H", "ACTUAL", "Got ·", "MANUAL"))
        ]

        page.goto(f"{BASE}/#/live/climate", wait_until="domcontentloaded", timeout=60000)
        page.wait_for_timeout(6000)
        try:
            click_zone(page, "All")
        except Exception as exc:  # noqa: BLE001
            result["climate"]["zone_all_err"] = str(exc)
        climate_all = page.inner_text("body")
        page.screenshot(path=str(OUT / "pass4-b-climate-all.png"), full_page=False)
        scroll_to(page, r"Air path|AIR CFM|Mass chip|cascade")
        page.screenshot(path=str(OUT / "pass4-b-climate-sankey.png"), full_page=False)
        scroll_to(page, r"Wet/Dry|Safety|Problem|Clear|leak")
        page.screenshot(path=str(OUT / "pass4-b-climate-safety.png"), full_page=False)
        scroll_to(page, r"Canopy|Zigbee")
        page.screenshot(path=str(OUT / "pass4-b-climate-canopy.png"), full_page=False)
        try:
            click_zone(page, "2×4")
        except Exception as exc:  # noqa: BLE001
            result["climate"]["zone_2x4_err"] = str(exc)
        climate_2 = page.inner_text("body")
        page.screenshot(path=str(OUT / "pass4-b-climate-2x4.png"), full_page=False)
        try:
            click_zone(page, "4×8")
        except Exception as exc:  # noqa: BLE001
            result["climate"]["zone_4x8_err"] = str(exc)
        climate_4 = page.inner_text("body")
        page.screenshot(path=str(OUT / "pass4-b-climate-4x8.png"), full_page=False)
        combined_c = (
            "===== ALL =====\n"
            + climate_all
            + "\n\n===== 4x8 =====\n"
            + climate_4
            + "\n\n===== 2x4 =====\n"
            + climate_2
        )
        (OUT / "pass4-b-climate-page-text.txt").write_text(combined_c, encoding="utf-8")
        blob_c = climate_all + climate_2 + climate_4
        result["climate"]["markers"] = markers(
            blob_c,
            [
                r"KIT HONEST",
                r"FULL AUTO",
                r"AIR CFM",
                r"MASS CHIP GATED",
                r"Canopy",
                r"Wet",
                r"Dry",
                r"Problem",
                r"Clear",
                r"CLIMATE MODE",
                r"Follow 4x8",
                r"cascade",
            ],
        )
        result["climate"]["key_lines"] = [
            ln.strip()[:200]
            for ln in blob_c.splitlines()
            if any(
                k in ln
                for k in (
                    "KIT",
                    "FULL AUTO",
                    "AIR CFM",
                    "MASS",
                    "Wet",
                    "Dry",
                    "Problem",
                    "Clear",
                    "Canopy",
                    "CLIMATE MODE",
                    "CFM",
                    "cascade",
                    "Cascade",
                    "Honesty",
                    "leak",
                )
            )
            and len(ln.strip()) < 200
        ][:100]

        page.goto(f"{BASE}/#/live/overview", wait_until="domcontentloaded", timeout=60000)
        page.wait_for_timeout(6000)
        overview = page.inner_text("body")
        (OUT / "pass4-b-overview-page-text.txt").write_text(overview, encoding="utf-8")
        page.screenshot(path=str(OUT / "pass4-b-overview-top.png"), full_page=False)
        scroll_to(page, r"Photoperiod|Follows|DARK|ON IN")
        page.screenshot(path=str(OUT / "pass4-b-overview-photoperiod.png"), full_page=False)
        scroll_to(page, r"Room journal|DSC-Core|Core journal")
        page.screenshot(path=str(OUT / "pass4-b-overview-journals.png"), full_page=False)
        scroll_to(page, r"Root|Bands|Fan|moisture")
        page.screenshot(path=str(OUT / "pass4-b-overview-bands.png"), full_page=False)
        scroll_to(page, r"Grow log|past notable")
        page.screenshot(path=str(OUT / "pass4-b-overview-growlog.png"), full_page=False)
        result["overview"]["markers"] = markers(
            overview,
            [
                r"KIT HONEST",
                r"HUB ONLINE",
                r"Canopy",
                r"DARK",
                r"FOLLOWS 4",
                r"Room journal",
                r"DSC-Core",
                r"CORE",
                r"past notables",
                r"Root",
                r"Bands",
                r"30",
                r"70",
                r"Fan",
                r"moisture",
            ],
        )
        result["overview"]["key_lines"] = [
            ln.strip()[:200]
            for ln in overview.splitlines()
            if any(
                k in ln
                for k in (
                    "KIT",
                    "HUB",
                    "Canopy",
                    "DARK",
                    "FOLLOW",
                    "ON IN",
                    "journal",
                    "CORE",
                    "ROOM",
                    "Root",
                    "Band",
                    "Fan",
                    "notable",
                    "critical",
                    "30",
                    "70",
                    "moisture",
                    "grey",
                    "OOS",
                )
            )
            and len(ln.strip()) < 200
        ][:120]
        browser.close()

    EVID.write_text(json.dumps(result, indent=2), encoding="utf-8")
    print("OK", EVID)
    print(json.dumps({k: v.get("markers") for k, v in result.items()}, indent=2))


if __name__ == "__main__":
    main()
