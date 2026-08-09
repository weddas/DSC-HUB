#!/usr/bin/env python3
"""Durable SeedFinder scrape watchdog (CREATE_NO_WINDOW). Restarts on crash; stops on CF."""
from __future__ import annotations

import json
import os
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
STAGING = ROOT / "brain" / "data" / "staging"
CK = ROOT / "homeassistant" / "data" / "dsc_strains_seedfinder.checkpoint.json"
URLS = ROOT / "homeassistant" / "data" / "dsc_strains_seedfinder.urls.json"
OUT = STAGING / "seedfinder_scrape_stdout.log"
ERR = STAGING / "seedfinder_scrape_stderr.log"
PID = STAGING / "seedfinder_scrape.pid"
WATCH_PID = STAGING / "seedfinder_watchdog.pid"
WATCH_LOG = STAGING / "seedfinder_watchdog.log"
HB = STAGING / "seedfinder_scrape.heartbeat"

CREATE_NO_WINDOW = 0x08000000
DELAY = "1.5"  # scraper adds jitter → ~1.5–3.0s; CF/429 stops (no spin)
CK_EVERY = "25"
DUMP_EVERY = "500"


def log(msg: str) -> None:
    line = f"{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} {msg}"
    print(line, flush=True)
    with WATCH_LOG.open("a", encoding="utf-8") as f:
        f.write(line + "\n")


def alive(pid: int) -> bool:
    if pid <= 0:
        return False
    try:
        import ctypes

        handle = ctypes.windll.kernel32.OpenProcess(0x1000, False, pid)
        if handle:
            ctypes.windll.kernel32.CloseHandle(handle)
            return True
    except Exception:
        return False
    return False


def read_pid(path: Path) -> int | None:
    if not path.exists():
        return None
    try:
        return int(path.read_text(encoding="utf-8").strip())
    except ValueError:
        return None


def counts() -> tuple[int, int, int]:
    done = 0
    errs = 0
    total = 40638
    if CK.exists():
        try:
            doc = json.loads(CK.read_text(encoding="utf-8"))
            done = len(doc.get("done") or [])
            errs = len(doc.get("errors") or [])
        except json.JSONDecodeError:
            pass
    if URLS.exists():
        try:
            total = int(json.loads(URLS.read_text(encoding="utf-8")).get("count") or total)
        except json.JSONDecodeError:
            pass
    return done, total, errs


def cf_blocked_recent() -> str | None:
    if not OUT.exists():
        return None
    try:
        text = OUT.read_text(encoding="utf-8", errors="replace")[-8000:]
    except OSError:
        return None
    # Only treat as hard stop if CF is the latest terminal outcome (no later launch).
    lines = text.splitlines()
    last_cf = None
    last_launch = -1
    for i, line in enumerate(lines):
        if "===== " in line and "launch" in line:
            last_launch = i
        if line.startswith("CF_BLOCKED"):
            last_cf = (i, line)
    if last_cf and last_cf[0] > last_launch:
        return last_cf[1]
    return None


def probe_clear(url: str) -> bool:
    """Return True if URL fetches without bot wall (cool-down check)."""
    try:
        import urllib.request

        sys.path.insert(0, str(ROOT / "scripts"))
        from catalog_common import UA  # noqa: WPS433

        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": UA,
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9",
            },
        )
        with urllib.request.urlopen(req, timeout=45) as resp:
            body = resp.read(4000).decode("utf-8", errors="replace").lower()
        markers = (
            "verifying you're human",
            "just a moment...",
            "cf-browser-verification",
            "attention required | cloudflare",
            "captcha-delivery.com",
        )
        return not any(m in body for m in markers)
    except Exception as exc:  # noqa: BLE001
        log(f"probe_fail {exc}")
        return False


def start_scrape() -> int:
    cmd = [
        sys.executable,
        "-u",
        str(ROOT / "scripts" / "scrape_seedfinder.py"),
        "--mode",
        "sitemap",
        "--delay",
        DELAY,
        "--checkpoint-every",
        CK_EVERY,
        "--dump-every",
        DUMP_EVERY,
    ]
    out_f = open(OUT, "a", encoding="utf-8", buffering=1)
    err_f = open(ERR, "a", encoding="utf-8", buffering=1)
    stamp = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    out_f.write(f"\n===== watchdog launch {stamp} delay={DELAY} =====\n")
    out_f.flush()
    env = os.environ.copy()
    env["PYTHONUNBUFFERED"] = "1"
    env["PYTHONIOENCODING"] = "utf-8"
    kwargs: dict = {
        "cwd": str(ROOT),
        "stdout": out_f,
        "stderr": err_f,
        "env": env,
        "close_fds": False,
    }
    if sys.platform == "win32":
        kwargs["creationflags"] = CREATE_NO_WINDOW
        si = subprocess.STARTUPINFO()
        si.dwFlags |= subprocess.STARTF_USESHOWWINDOW
        si.wShowWindow = 0
        kwargs["startupinfo"] = si
    proc = subprocess.Popen(cmd, **kwargs)
    PID.write_text(str(proc.pid), encoding="utf-8")
    HB.write_text(f"started={stamp}\npid={proc.pid}\ndelay={DELAY}\n", encoding="utf-8")
    return proc.pid


def main() -> int:
    STAGING.mkdir(parents=True, exist_ok=True)
    WATCH_PID.write_text(str(os.getpid()), encoding="utf-8")
    log(f"watchdog start pid={os.getpid()}")
    consecutive_crash = 0
    cf_rounds = 0
    last_done = -1
    stall_ticks = 0

    while True:
        done, total, errs = counts()
        if done >= total and total > 0:
            log(f"COMPLETE done={done}/{total} errs={errs}")
            return 0

        pid = read_pid(PID)
        if pid and alive(pid):
            if done == last_done:
                stall_ticks += 1
            else:
                stall_ticks = 0
                last_done = done
                consecutive_crash = 0
                cf_rounds = 0
            if stall_ticks % 6 == 0:  # ~every 3 min at 30s poll
                log(f"ok pid={pid} done={done}/{total} errs={errs} stall_ticks={stall_ticks}")
            time.sleep(30)
            continue

        # Process dead — CF cool-down + resume, or crash restart
        cf = cf_blocked_recent()
        if cf:
            cf_rounds += 1
            if cf_rounds > 12:
                log(f"CF_GIVE_UP after {cf_rounds} rounds: {cf}")
                return 2
            url = cf.split(" ", 1)[-1].strip()
            cool = min(900, 120 * cf_rounds)
            log(f"CF_COOLDOWN round={cf_rounds} sleep={cool}s url={url}")
            time.sleep(cool)
            if url and not probe_clear(url):
                log("CF_STILL_BLOCKED; extending cool-down")
                time.sleep(180)
                if not probe_clear(url):
                    continue
            log("CF_CLEARED; resuming scrape")
            new_pid = start_scrape()
            log(f"started scrape pid={new_pid}")
            stall_ticks = 0
            consecutive_crash = 0
            time.sleep(45)
            continue

        consecutive_crash += 1
        if consecutive_crash > 8:
            log(f"TOO_MANY_CRASHES n={consecutive_crash} done={done}/{total}")
            return 3
        sleep_s = min(120, 10 * consecutive_crash)
        log(f"restart scrape crash#{consecutive_crash} sleep={sleep_s}s done={done}/{total}")
        time.sleep(sleep_s)
        new_pid = start_scrape()
        log(f"started scrape pid={new_pid}")
        stall_ticks = 0
        time.sleep(45)


if __name__ == "__main__":
    raise SystemExit(main())
