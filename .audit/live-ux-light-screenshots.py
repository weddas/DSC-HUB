"""Capture Light desk screenshots for Pass 1 walk."""
from pathlib import Path

from playwright.sync_api import sync_playwright

OUT = Path(r"C:\Users\cmgwe\Documents\DSC-HUB\docs\qa-screenshots-2026-09-01-live-ux")
URL = "http://192.168.86.48:8787/#/live/light"


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1600, "height": 1200})
        page.goto(URL, wait_until="networkidle", timeout=60000)
        page.wait_for_timeout(3500)
        page.screenshot(path=str(OUT / "light-both-tents-top.png"), full_page=False)

        page.evaluate(
            """() => {
          const el = [...document.querySelectorAll('*')].find(e => /ENERGY \\(ESTIMATE\\)/i.test(e.textContent||''));
          if (el) el.scrollIntoView({block:'start'});
        }"""
        )
        page.wait_for_timeout(800)
        page.screenshot(path=str(OUT / "light-energy-both.png"), full_page=False)

        page.evaluate(
            """() => {
          const el = [...document.querySelectorAll('*')].find(e => /OCCUPANCY JOURNAL/i.test(e.textContent||''));
          if (el) el.scrollIntoView({block:'start'});
        }"""
        )
        page.wait_for_timeout(800)
        page.screenshot(path=str(OUT / "light-journals-both.png"), full_page=False)

        page.evaluate(
            """() => {
          const el = [...document.querySelectorAll('*')].find(e => /CROP SCHEDULER/i.test(e.textContent||''));
          if (el) el.scrollIntoView({block:'start'});
        }"""
        )
        page.wait_for_timeout(800)
        page.screenshot(path=str(OUT / "light-crop-scheduler-expected.png"), full_page=False)
        page.screenshot(path=str(OUT / "light-fullpage.png"), full_page=True)
        (OUT / "light-page-text.txt").write_text(page.inner_text("body"), encoding="utf-8")
        browser.close()
    print("saved", sorted(p.name for p in OUT.glob("light-*")))


if __name__ == "__main__":
    main()
