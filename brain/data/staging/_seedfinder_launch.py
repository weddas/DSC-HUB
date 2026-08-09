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

    # Playwright path — urllib stays CF-403 even after browser unlock.
    # Delay 1.5–3s; dump every 500 (NAS JSON rewrite is expensive).
    cmd = [
        sys.executable,
        "-u",
        str(ROOT / "scripts" / "_pw_scrape_seedfinder.py"),
        "--headed",
        "--delay-min=1.5",
        "--delay-max=3.0",
        "--checkpoint-every=25",
        "--dump-every=500",
    ]
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    out_f = open(OUT, "a", encoding="utf-8", buffering=1)
    err_f = open(ERR, "a", encoding="utf-8", buffering=1)
    stamp = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    out_f.write(f"\n===== launch {stamp} pw_seedfinder delay=1.5-3.0 =====\n")
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
        f"started={stamp}\npid={proc.pid}\ndelay=1.5-3.0\ncmd={' '.join(cmd)}\n",
        encoding="utf-8",
    )
    print(f"started pid={proc.pid} pw_seedfinder out={OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
