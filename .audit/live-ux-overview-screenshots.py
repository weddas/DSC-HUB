"""Capture Overview desk screenshots + Light photoperiod cross-check."""
from pathlib import Path

from playwright.sync_api import sync_playwright

OUT = Path(r"C:\Users\cmgwe\Documents\DSC-HUB\docs\qa-screenshots-2026-09-01-live-ux")
OVERVIEW = "http://192.168.86.48:8787/#/live/overview"
LIGHT = "http://192.168.86.48:8787/#/live/light"


def scroll_to(page, pattern: str) -> None:
    page.evaluate(
        """(pat) => {
          const re = new RegExp(pat, 'i');
          const el = [...document.querySelectorAll('h1,h2,h3,h4,.dsc-card-title,[class*="title"],p,div,span,button,label')]
            .find(e => re.test((e.textContent||'').trim()) && (e.textContent||'').trim().length < 120);
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

        page.goto(OVERVIEW, wait_until="networkidle", timeout=90000)
        page.wait_for_timeout(5000)

        page.evaluate("window.scrollTo(0,0)")
        page.wait_for_timeout(400)
        page.screenshot(path=str(OUT / "overview-top-kit-hub-canopy.png"), full_page=False)
        texts["top"] = page.inner_text("body")

        scroll_to(page, r"Photoperiod|Light glance|Follows 4|Tent light|WINDOW|DARK")
        page.screenshot(path=str(OUT / "overview-photoperiod-glance.png"), full_page=False)
        texts["photoperiod"] = page.inner_text("body")

        scroll_to(page, r"Room journal|grow_room|DSC-Core|Core journal")
        page.screenshot(path=str(OUT / "overview-journals.png"), full_page=False)
        texts["journals"] = page.inner_text("body")

        scroll_to(page, r"Root|Fan dut|Bands|Grow log|critical|KIT HONEST|HUB ONLINE")
        page.screenshot(path=str(OUT / "overview-root-fans-bands.png"), full_page=False)
        texts["vitals"] = page.inner_text("body")

        scroll_to(page, r"Grow log|past notable|history")
        page.screenshot(path=str(OUT / "overview-grow-log.png"), full_page=False)

        page.screenshot(path=str(OUT / "overview-fullpage.png"), full_page=True)

        # Cross-desk: Light SoT for both tents
        page.goto(LIGHT, wait_until="networkidle", timeout=90000)
        page.wait_for_timeout(4000)
        page.evaluate("window.scrollTo(0,0)")
        page.screenshot(path=str(OUT / "overview-light-sot-top.png"), full_page=False)
        texts["light"] = page.inner_text("body")

        scroll_to(page, r"SCHEDULE|FOLLOW|Independent|Got|Want|WINDOW|DARK")
        page.screenshot(path=str(OUT / "overview-light-sot-schedule.png"), full_page=False)

        combined = "\n\n===== OVERVIEW TOP =====\n" + texts.get("top", "")
        combined += "\n\n===== OVERVIEW PHOTOPERIOD =====\n" + texts.get("photoperiod", "")
        combined += "\n\n===== OVERVIEW JOURNALS =====\n" + texts.get("journals", "")
        combined += "\n\n===== OVERVIEW VITALS =====\n" + texts.get("vitals", "")
        combined += "\n\n===== LIGHT SOT =====\n" + texts.get("light", "")
        (OUT / "overview-page-text.txt").write_text(combined, encoding="utf-8")
        browser.close()
    print("saved", sorted(p.name for p in OUT.glob("overview-*")))


if __name__ == "__main__":
    main()
