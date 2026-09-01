"""Capture Climate desk screenshots with reliable zone-chip clicks."""
from pathlib import Path

from playwright.sync_api import sync_playwright

OUT = Path(r"C:\Users\cmgwe\Documents\DSC-HUB\docs\qa-screenshots-2026-09-01-live-ux")
CLIMATE = "http://192.168.86.48:8787/#/live/climate"
LIGHT = "http://192.168.86.48:8787/#/live/light"


def click_zone(page, label: str) -> None:
    """Click Zone emphasis chip only (aria-label group), not nav/cockpit links."""
    page.locator('div[role="group"][aria-label="Zone emphasis"] button.dsc-chip', has_text=label).first.click()
    page.wait_for_timeout(1500)


def scroll_to(page, pattern: str) -> None:
    page.evaluate(
        """(pat) => {
          const re = new RegExp(pat, 'i');
          const el = [...document.querySelectorAll('h1,h2,h3,h4,.dsc-card-title,[class*=\"title\"],p,div,span')]
            .find(e => re.test((e.textContent||'').trim()) && (e.textContent||'').trim().length < 80);
          if (el) el.scrollIntoView({block:'center'});
        }""",
        pattern,
    )
    page.wait_for_timeout(700)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    texts: dict[str, str] = {}
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1600, "height": 1400})
        page.goto(CLIMATE, wait_until="networkidle", timeout=90000)
        page.wait_for_timeout(4500)

        click_zone(page, "All")
        page.evaluate("window.scrollTo(0,0)")
        page.wait_for_timeout(400)
        page.screenshot(path=str(OUT / "climate-zone-all-top.png"), full_page=False)
        texts["all"] = page.inner_text("body")

        scroll_to(page, r"Air path|AIR PATH|AIR CFM|Mass chip")
        page.screenshot(path=str(OUT / "climate-sankey-mass-gated.png"), full_page=False)

        scroll_to(page, r"Zigbee by role|Canopy")
        page.screenshot(path=str(OUT / "climate-canopy.png"), full_page=False)

        scroll_to(page, r"Wet/Dry|Safety —|Problem|Clear")
        page.screenshot(path=str(OUT / "climate-safety-wet-problem.png"), full_page=False)

        click_zone(page, "4×8")
        page.evaluate("window.scrollTo(0,0)")
        page.wait_for_timeout(500)
        page.screenshot(path=str(OUT / "climate-zone-4x8.png"), full_page=False)
        texts["4x8"] = page.inner_text("body")

        click_zone(page, "2×4")
        page.evaluate("window.scrollTo(0,0)")
        page.wait_for_timeout(500)
        # scroll to Climate Mode
        scroll_to(page, r"CLIMATE MODE|Climate mode|Follow Plants")
        page.screenshot(path=str(OUT / "climate-zone-2x4-mode.png"), full_page=False)
        texts["2x4"] = page.inner_text("body")

        click_zone(page, "Room")
        page.evaluate("window.scrollTo(0,0)")
        page.wait_for_timeout(500)
        page.screenshot(path=str(OUT / "climate-zone-room-lung.png"), full_page=False)
        texts["room"] = page.inner_text("body")

        page.screenshot(path=str(OUT / "climate-fullpage.png"), full_page=True)

        # Light schedule Follow chips (B6 distinct from Climate Mode)
        page.goto(LIGHT, wait_until="networkidle", timeout=90000)
        page.wait_for_timeout(3500)
        page.evaluate("window.scrollTo(0,0)")
        page.screenshot(path=str(OUT / "climate-light-schedule-follow.png"), full_page=False)
        texts["light"] = page.inner_text("body")

        combined = "\n\n===== ZONE All =====\n" + texts.get("all", "")
        combined += "\n\n===== ZONE 4x8 =====\n" + texts.get("4x8", "")
        combined += "\n\n===== ZONE 2x4 =====\n" + texts.get("2x4", "")
        combined += "\n\n===== ZONE Room =====\n" + texts.get("room", "")
        combined += "\n\n===== LIGHT (schedule chips) =====\n" + texts.get("light", "")
        (OUT / "climate-page-text.txt").write_text(combined, encoding="utf-8")
        browser.close()
    print("saved", sorted(p.name for p in OUT.glob("climate-*")))


if __name__ == "__main__":
    main()
