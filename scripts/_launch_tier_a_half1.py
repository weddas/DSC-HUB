#!/usr/bin/env python3
"""Launch Tier A half-1 scrape with CREATE_NO_WINDOW (no console popup)."""

from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "scrape_tier_a_storefronts.py"
LOG = ROOT / "homeassistant" / "data" / "_tier_a_half1_run.log"
ERR = ROOT / "homeassistant" / "data" / "_tier_a_half1_run.err"
PID = ROOT / "homeassistant" / "data" / "_tier_a_half1_run.pid"

CREATE_NO_WINDOW = 0x08000000


def main() -> int:
    LOG.parent.mkdir(parents=True, exist_ok=True)
    # Do NOT pass --refresh-claim here — claim is owned by _fix_tier_a_half1_claim.py
    args = [sys.executable, "-u", str(SCRIPT), "--delay", "0.55"]
    args.extend(sys.argv[1:])
    out_f = open(LOG, "a", encoding="utf-8")
    err_f = open(ERR, "a", encoding="utf-8")
    out_f.write(f"\n--- launch {' '.join(args)} ---\n")
    out_f.flush()
    env = dict(os.environ)
    env["PYTHONIOENCODING"] = "utf-8"
    env["PYTHONUTF8"] = "1"
    kw: dict = {
        "cwd": str(ROOT),
        "stdout": out_f,
        "stderr": err_f,
        "stdin": subprocess.DEVNULL,
        "env": env,
    }
    if sys.platform == "win32":
        kw["creationflags"] = CREATE_NO_WINDOW
    proc = subprocess.Popen(args, **kw)
    PID.write_text(str(proc.pid), encoding="utf-8")
    print(f"launched pid={proc.pid} log={LOG}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
