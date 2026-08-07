from pathlib import Path
p = Path("scripts/_pw_scrape_strain_database.py")
src = p.read_text(encoding="utf-8")

old_args = '''            "args": [
                "--disable-blink-features=AutomationControlled",
                "--disable-quic",
            ],
'''
new_args = '''            "args": [
                "--disable-blink-features=AutomationControlled",
                "--disable-quic",
                # Keep any headed window off-screen so we don't steal focus/fullscreen.
                "--window-position=-2400,-200",
                "--window-size=1100,800",
            ],
'''
if old_args not in src:
    raise SystemExit("args block missing")
src = src.replace(old_args, new_args, 1)

# Run CF wait loop for both headed and headless (headless often needs the settle time)
old_cf = '''                if self.headed:
                    deadline = time.time() + 150
                    while time.time() < deadline:
                        if is_chrome_error_url(self.page.url):
                            log("  chrome-error — re-nav /strains")
                            self._goto("https://strain-database.com/strains", timeout=60_000)
                            time.sleep(2)
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
'''
# encoding of em-dash may differ - find by unique markers
idx = src.find("                if self.headed:")
if idx < 0:
    raise SystemExit("headed cf block start missing")
# find end: "                    if page_ok(html, title, url):\n                        break\n                wait = min(90"
end = src.find("                wait = min(90, 12 * attempt)", idx)
if end < 0:
    raise SystemExit("headed cf block end missing")
new_cf = '''                # Settle CF in headed or headless (headed window is off-screen).
                deadline = time.time() + (180 if self.headed else 120)
                while time.time() < deadline:
                    if is_chrome_error_url(self.page.url):
                        log("  chrome-error — re-nav /strains")
                        self._goto("https://strain-database.com/strains", timeout=60_000)
                        time.sleep(2)
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
'''
src = src[:idx] + new_cf + src[end:]
p.write_text(src, encoding="utf-8")
compile(src, str(p), "exec")
print("patched CF settle + off-screen window; compile ok")
