"""Patch ONLY scripts/_pw_scrape_strain_database.py for randomized slow delays."""
from pathlib import Path

p = Path("scripts/_pw_scrape_strain_database.py")
src = p.read_text(encoding="utf-8")

# Ensure random import
if "import random" not in src:
    src = src.replace("import json\n", "import json\nimport random\n", 1)

# Replace arg parsing + delay setup block through log line
old_setup = '''def main() -> int:
    limit: int | None = None
    delay = 1.2
    ck_every = 25
    stage_every = 50
    headed = True
    for a in sys.argv[1:]:
        if a == "--headless":
            headed = False
        elif a == "--headed":
            headed = True
        elif a.startswith("--limit="):
            v = int(a.split("=", 1)[1])
            limit = None if v <= 0 else v
        elif a.startswith("--delay="):
            delay = float(a.split("=", 1)[1])
        elif a.startswith("--checkpoint-every="):
            ck_every = max(5, int(a.split("=", 1)[1]))
        elif a.startswith("--stage-every="):
            stage_every = max(ck_every, int(a.split("=", 1)[1]))

    base_delay = max(4.0, float(delay))
    delay = base_delay
'''

new_setup = '''def main() -> int:
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
'''

if old_setup not in src:
    # Try without base_delay lines (if prior patch differed)
    old_setup_alt = '''def main() -> int:
    limit: int | None = None
    delay = 1.2
    ck_every = 25
    stage_every = 50
    headed = True
    for a in sys.argv[1:]:
        if a == "--headless":
            headed = False
        elif a == "--headed":
            headed = True
        elif a.startswith("--limit="):
            v = int(a.split("=", 1)[1])
            limit = None if v <= 0 else v
        elif a.startswith("--delay="):
            delay = float(a.split("=", 1)[1])
        elif a.startswith("--checkpoint-every="):
            ck_every = max(5, int(a.split("=", 1)[1]))
        elif a.startswith("--stage-every="):
            stage_every = max(ck_every, int(a.split("=", 1)[1]))
'''
    if old_setup_alt in src:
        # strip any base_delay lines that follow
        src2 = src.replace(old_setup_alt, new_setup, 1)
        # remove leftover base_delay if present right after
        src2 = src2.replace(
            "    base_delay = max(4.0, float(delay))\n    delay = base_delay\n",
            "",
            1,
        )
        src = src2
        print("replaced setup (alt)")
    else:
        raise SystemExit("setup block not found")
else:
    src = src.replace(old_setup, new_setup, 1)
    print("replaced setup")

# Log line: show delay band
src = src.replace(
    'f"already_done={len(done)} sitemap={len(urls)} delay={delay} headed={headed} ud={USER_DATA}"',
    'f"already_done={len(done)} sitemap={len(urls)} delay_s={pace_lo:.1f}-{pace_hi:.1f} '
    'headed={headed} ud={USER_DATA}"',
    1,
)

# Per-page sleep: randomized
src = src.replace(
    "            time.sleep(delay)\n",
    "            d = next_delay()\n"
    "            log(f\"  pace sleep {d:.1f}s (band {pace_lo:.1f}-{pace_hi:.1f})\")\n"
    "            time.sleep(d)\n",
    1,
)

# HTTP fail backoff: minutes-scale
old_http = '''                    if "ERR_HTTP_RESPONSE_CODE_FAILURE" in msg or "429" in msg:
                        rate_hits += 1
                        wait = min(180, 30 * rate_hits)
                        log(f"  HTTP_FAIL backoff {wait}s (hits={rate_hits})")
                        time.sleep(wait)
                        delay = max(base_delay, min(60.0, delay + 0.5))
'''
new_http = '''                    if "ERR_HTTP_RESPONSE_CODE_FAILURE" in msg or "429" in msg:
                        rate_hits += 1
                        wait = min(900, 120 * rate_hits)  # 2–15 min hard backoff
                        harden_pace(rate_hits)
                        log(
                            f"  HTTP_FAIL backoff {wait}s (hits={rate_hits}) "
                            f"pace->{pace_lo:.1f}-{pace_hi:.1f}"
                        )
                        time.sleep(wait)
'''
if old_http in src:
    src = src.replace(old_http, new_http, 1)
    print("patched http backoff")
else:
    print("WARN: http backoff block missing")

# Rate limit soft path
old_rl = '''            if is_rate_limited(html, title):
                rate_hits += 1
                wait = min(120, 20 * rate_hits)
                log(f"  RATE_LIMIT {url}'''

# Find and replace rate limit section more carefully
import re
rl_pat = re.compile(
    r"            if is_rate_limited\(html, title\):\n"
    r"                rate_hits \+= 1\n"
    r"                wait = min\(120, 20 \* rate_hits\)\n"
    r"                log\(f\"  RATE_LIMIT \{url\}.*?\"\)\n"
    r"                time\.sleep\(wait\)\n",
    re.S,
)
rl_new = (
    "            if is_rate_limited(html, title):\n"
    "                rate_hits += 1\n"
    "                wait = min(900, 180 * rate_hits)  # 3–15 min\n"
    "                harden_pace(rate_hits)\n"
    "                log(\n"
    "                    f\"  RATE_LIMIT {url} sleep {wait}s (hits={rate_hits}) \"\n"
    "                    f\"pace->{pace_lo:.1f}-{pace_hi:.1f}\"\n"
    "                )\n"
    "                time.sleep(wait)\n"
)
m = rl_pat.search(src)
if m:
    src = rl_pat.sub(rl_new, src, count=1)
    print("patched rate_limit wait")
else:
    print("WARN: rate_limit wait pattern missing")

# Remove post-rate-limit delay bump that uses base_delay
src = src.replace(
    "                delay = max(base_delay, min(60.0, delay + 0.25))\n"
    "                rate_hits = max(0, rate_hits - 1)\n",
    "                harden_pace(rate_hits)\n"
    "                rate_hits = max(0, rate_hits - 1)\n",
    1,
)

# CF stop path: hard backoff then continue slower instead of immediate return 3?
# Keep soft-stop for persistent CF wall after retries; user asked resume even slower on 429.
# For page_ok CF stop - change to hard sleep + continue once before stop
old_cf = '''            if not page_ok(html, title, page_url):
                log(f"  STOP CF {url} title={title!r} page_url={page_url!r}")
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
                return 3
'''
new_cf = '''            if not page_ok(html, title, page_url):
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
                try:
                    session.open()
                    html, title = session.fetch(url)
                    page_url = session.page.url if session.page else ""
                except Exception as cf_exc:  # noqa: BLE001
                    log(f"  CF_retry_err {cf_exc}")
                    return 3
                if not page_ok(html, title, page_url):
                    log(f"  STOP CF {url} title={title!r} page_url={page_url!r}")
                    return 3
'''
if old_cf in src:
    src = src.replace(old_cf, new_cf, 1)
    print("patched CF challenge backoff")
else:
    print("WARN: CF stop block missing")

p.write_text(src, encoding="utf-8")
print("wrote", p)
# sanity compile
compile(src, str(p), "exec")
print("compile ok")
