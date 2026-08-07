#!/usr/bin/env python3
"""Launch classifier with CREATE_NO_WINDOW (no console popup)."""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "_classify_breeder_storefronts_1482.py"
LOG = ROOT / "homeassistant" / "data" / "_breeder_scrape_queue_1482.run.log"
ERR = ROOT / "homeassistant" / "data" / "_breeder_scrape_queue_1482.run.err"
PID = ROOT / "homeassistant" / "data" / "_breeder_scrape_queue_1482.run.pid"

CREATE_NO_WINDOW = 0x08000000

def main() -> int:
    LOG.parent.mkdir(parents=True, exist_ok=True)
    out = open(LOG, "w", encoding="utf-8")
    err = open(ERR, "w", encoding="utf-8")
    proc = subprocess.Popen(
        [sys.executable, "-u", str(SCRIPT)],
        cwd=str(ROOT),
        stdout=out,
        stderr=err,
        creationflags=CREATE_NO_WINDOW,
    )
    PID.write_text(str(proc.pid), encoding="utf-8")
    print(f"started pid={proc.pid} log={LOG}")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
