#!/usr/bin/env python3
"""Launch Tier C second-half scrape with CREATE_NO_WINDOW (no CMD popup).

Dump + staging only — never merges master. No Task Scheduler. No StrainDB.
"""
from __future__ import annotations

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
    log = LOG_DIR / "_tier_c_second_half_stdout.txt"
    err = LOG_DIR / "_tier_c_second_half_stderr.txt"
    pid_path = LOG_DIR / "_tier_c_second_half.pid"
    cmd = [
        sys.executable,
        "-u",
        str(SCRIPT),
        "--half",
        "second",
        "--owner",
        "tier_c_second_half",
        "--delay",
        "0.5",
        "--max-html",
        "200",
        "--checkpoint-every",
        "20",
        "--passes",
        "1",
    ]
    with log.open("w", encoding="utf-8") as out, err.open("w", encoding="utf-8") as errf:
        proc = subprocess.Popen(
            cmd,
            cwd=str(ROOT),
            stdout=out,
            stderr=errf,
            **hidden_popen_kwargs(),
        )
    pid_path.write_text(str(proc.pid), encoding="utf-8")
    print(f"started tier_c_second_half pid={proc.pid} log={log.name}", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
