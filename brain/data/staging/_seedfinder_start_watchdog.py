#!/usr/bin/env python3
"""Start SeedFinder watchdog with CREATE_NO_WINDOW if not already running."""
from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
STAGING = ROOT / "brain" / "data" / "staging"
WATCH_PID = STAGING / "seedfinder_watchdog.pid"
WATCH_OUT = STAGING / "seedfinder_watchdog_stdout.log"
CREATE_NO_WINDOW = 0x08000000


def alive(pid: int) -> bool:
    try:
        import ctypes

        h = ctypes.windll.kernel32.OpenProcess(0x1000, False, pid)
        if h:
            ctypes.windll.kernel32.CloseHandle(h)
            return True
    except Exception:
        return False
    return False


def main() -> int:
    if WATCH_PID.exists():
        try:
            pid = int(WATCH_PID.read_text(encoding="utf-8").strip())
        except ValueError:
            pid = 0
        if pid and alive(pid):
            print(f"watchdog_already_running pid={pid}")
            return 0

    out_f = open(WATCH_OUT, "a", encoding="utf-8", buffering=1)
    env = os.environ.copy()
    env["PYTHONUNBUFFERED"] = "1"
    kwargs: dict = {
        "cwd": str(ROOT),
        "stdout": out_f,
        "stderr": subprocess.STDOUT,
        "env": env,
        "close_fds": False,
    }
    if sys.platform == "win32":
        kwargs["creationflags"] = CREATE_NO_WINDOW
        si = subprocess.STARTUPINFO()
        si.dwFlags |= subprocess.STARTF_USESHOWWINDOW
        si.wShowWindow = 0
        kwargs["startupinfo"] = si
    proc = subprocess.Popen(
        [sys.executable, "-u", str(STAGING / "_seedfinder_watchdog.py")],
        **kwargs,
    )
    print(f"watchdog_started pid={proc.pid}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
