#!/usr/bin/env python3
"""Launch Pacific WC scrape with CREATE_NO_WINDOW (append logs). Dump+stage only."""

from __future__ import annotations

import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LOG_DIR = ROOT / "homeassistant" / "data" / "_bank_scrape_logs"
CREATE_NO_WINDOW = 0x08000000


def main() -> int:
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    out = LOG_DIR / "pacific.out.log"
    err = LOG_DIR / "pacific.err.log"
    stamp = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    with out.open("a", encoding="utf-8") as fo:
        fo.write(f"\n===== POLITE RESUME {stamp} delay=2.75 stage-every=100 =====\n")

    cmd = [
        sys.executable,
        "-u",
        str(ROOT / "scripts" / "scrape_wc_seed_banks.py"),
        "--bank",
        "pacific",
        "--delay",
        "2.75",
        "--checkpoint-every",
        "20",
        "--stage-every",
        "100",
    ]
    fo = open(out, "a", encoding="utf-8")  # noqa: SIM115
    fe = open(err, "a", encoding="utf-8")  # noqa: SIM115
    p = subprocess.Popen(
        cmd,
        cwd=str(ROOT),
        stdout=fo,
        stderr=fe,
        stdin=subprocess.DEVNULL,
        creationflags=CREATE_NO_WINDOW,
    )
    (LOG_DIR / "pacific.pid").write_text(str(p.pid), encoding="utf-8")
    print(f"started pacific pid={p.pid}", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
