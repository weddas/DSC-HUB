#!/usr/bin/env python3
"""Launch Tier A N–Z breeder scrape with CREATE_NO_WINDOW (unique log per run)."""
from __future__ import annotations

import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from _win_no_window import hidden_popen_kwargs  # noqa: E402

DATA = ROOT / "homeassistant" / "data"


def main() -> int:
    DATA.mkdir(parents=True, exist_ok=True)
    stamp = time.strftime("%H%M%S")
    log = DATA / f"_tier_a_nz_scrape_{stamp}.log"
    err = DATA / f"_tier_a_nz_scrape_{stamp}.err"
    pid_path = DATA / f"_tier_a_nz_scrape_{stamp}.pid"
    # Also update pointer files for the latest run
    (DATA / "_tier_a_nz_scrape.latest").write_text(stamp, encoding="utf-8")
    script = ROOT / "scripts" / "_scrape_tier_a_nz_breeders.py"
    cmd = [
        sys.executable,
        "-u",
        str(script),
        "--delay",
        "0.45",
        "--checkpoint-every",
        "20",
        "--stage-every",
        "60",
        *sys.argv[1:],
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
    (DATA / "_tier_a_nz_scrape.pid").write_text(str(proc.pid), encoding="utf-8")
    print(f"started pid={proc.pid} log={log.name}", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
