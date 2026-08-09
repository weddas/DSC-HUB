#!/usr/bin/env python3
"""Launch SeedFinder scrape with CREATE_NO_WINDOW (no visible console)."""
from __future__ import annotations

import os
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
LOG_DIR = ROOT / "brain" / "data" / "staging"
OUT = LOG_DIR / "seedfinder_scrape_stdout.log"
ERR = LOG_DIR / "seedfinder_scrape_stderr.log"
PID = LOG_DIR / "seedfinder_scrape.pid"
HB = LOG_DIR / "seedfinder_scrape.heartbeat"

CREATE_NO_WINDOW = 0x08000000
DETACHED_PROCESS = 0x00000008


def already_running() -> int | None:
    if not PID.exists():
        return None
    try:
        pid = int(PID.read_text(encoding="utf-8").strip())
    except ValueError:
        return None
    # Windows: OpenProcess / tasklist
    try:
        import ctypes

        PROCESS_QUERY_LIMITED_INFORMATION = 0x1000
        handle = ctypes.windll.kernel32.OpenProcess(
            PROCESS_QUERY_LIMITED_INFORMATION, False, pid
        )
        if handle:
            ctypes.windll.kernel32.CloseHandle(handle)
            return pid
    except Exception:
        pass
    return None


def main() -> int:
    existing = already_running()
    if existing:
        print(f"already_running pid={existing}")
        return 0

    # Polite delay: CF hit ~9.4k at 1.25s; resume with 1.5–3s (+jitter in scraper).
    # Dump every 500: NAS rewrite of growing JSON every 25 pages is too expensive.
    delay = "1.5"
    ck_every = "25"
    dump_every = "500"
    cmd = [
        sys.executable,
        "-u",
        str(ROOT / "scripts" / "scrape_seedfinder.py"),
        "--mode",
        "sitemap",
        "--delay",
        delay,
        "--checkpoint-every",
        ck_every,
        "--dump-every",
        dump_every,
    ]
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    out_f = open(OUT, "a", encoding="utf-8", buffering=1)
    err_f = open(ERR, "a", encoding="utf-8", buffering=1)
    stamp = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    out_f.write(f"\n===== launch {stamp} delay={delay} =====\n")
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
        # Avoid STARTUPINFO console flash
        si = subprocess.STARTUPINFO()
        si.dwFlags |= subprocess.STARTF_USESHOWWINDOW
        si.wShowWindow = 0  # SW_HIDE
        kwargs["startupinfo"] = si

    proc = subprocess.Popen(cmd, **kwargs)
    PID.write_text(str(proc.pid), encoding="utf-8")
    HB.write_text(
        f"started={stamp}\npid={proc.pid}\ndelay={delay}\ncmd={' '.join(cmd)}\n",
        encoding="utf-8",
    )
    print(f"started pid={proc.pid} delay={delay} out={OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
