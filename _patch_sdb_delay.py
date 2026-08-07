from pathlib import Path
p = Path("scripts/_pw_scrape_strain_database.py")
src = p.read_text(encoding="utf-8")
changed = False
old1 = "                        delay = min(2.5, delay + 0.2)"
new1 = "                        delay = max(base_delay, min(60.0, delay + 0.5))"
old2 = "                delay = min(2.0, delay + 0.15)"
new2 = "                delay = max(base_delay, min(60.0, delay + 0.25))"
if old1 in src:
    src = src.replace(old1, new1)
    changed = True
    print("patched http backoff")
elif new1 in src:
    print("http backoff already patched")
else:
    print("WARN: http backoff marker missing")
if old2 in src:
    src = src.replace(old2, new2)
    changed = True
    print("patched rate-limit backoff")
elif new2 in src:
    print("rate-limit backoff already patched")
else:
    print("WARN: rate-limit backoff marker missing")
needle = "    raw = json.loads(SITEMAP_CACHE.read_text(encoding=\"utf-8\"))"
insert = "    base_delay = max(4.0, float(delay))\n    delay = base_delay\n" + needle
if "base_delay = max(4.0" not in src:
    if needle not in src:
        raise SystemExit("needle missing for base_delay")
    src = src.replace(needle, insert, 1)
    changed = True
    print("inserted base_delay floor")
else:
    print("base_delay already present")
if changed:
    p.write_text(src, encoding="utf-8")
    print("wrote script")
else:
    print("no write needed")
