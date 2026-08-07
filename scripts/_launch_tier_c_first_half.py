#!/usr/bin/env python3
"""Launch Tier C first-half scrape with CREATE_NO_WINDOW (no CMD popup).

Dump + staging only — never merges master. No Task Scheduler. No StrainDB.
"""
from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from _win_no_window import hidden_popen_kwargs  # noqa: E402

LOG_DIR = ROOT / "homeassistant" / "data"
SCRIPT = ROOT / "scripts" / "scrape_breeder_tier_c.py"


def main() -> int:
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    log = LOG_DIR / "_tier_c_first_half_stdout.txt"
    err = LOG_DIR / "_tier_c_first_half_stderr.txt"
    pid_path = LOG_DIR / "_tier_c_first_half.pid"
    cmd = [
        sys.executable,
        "-u",
        str(SCRIPT),
        "--half",
        "first",
        "--owner",
        "tier_c_first_half",
        "--delay",
        "0.55",
        "--max-html",
        "250",
        "--checkpoint-every",
        "20",
        "--passes",
        "1",
    ]
    env = os.environ.copy()
    env["PYTHONIOENCODING"] = "utf-8"
    env["PYTHONUTF8"] = "1"
    # Keep handles open for child lifetime (do not close on with-exit).
    out = log.open("a", encoding="utf-8")
    errf = err.open("a", encoding="utf-8")
    out.write("\n--- relaunch ---\n")
    errf.write("\n--- relaunch ---\n")
    out.flush()
    errf.flush()
    proc = subprocess.Popen(
        cmd,
        cwd=str(ROOT),
        stdout=out,
        stderr=errf,
        env=env,
        **hidden_popen_kwargs(),
    )
    pid_path.write_text(str(proc.pid), encoding="utf-8")
    print(f"started tier_c_first_half pid={proc.pid} log={log.name}", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
