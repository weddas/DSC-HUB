#!/usr/bin/env python3
"""Launch Wave 2 bank scrapers with CREATE_NO_WINDOW (no visible CMD popups).

Dumps + staging only — never merges to dsc_brain.sqlite3.
"""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from _win_no_window import hidden_popen_kwargs  # noqa: E402

LOG_DIR = ROOT / "homeassistant" / "data"
BANKS = ("fastbuds", "barneys", "greenhouse", "mephisto", "dna", "dutchpassion")


def main() -> int:
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    py = sys.executable
    script = ROOT / "scripts" / "scrape_bank_sitemaps.py"
    pids: list[tuple[str, int]] = []
    for bank in BANKS:
        log = LOG_DIR / f"_wave2_scrape_{bank}.log"
        err = LOG_DIR / f"_wave2_scrape_{bank}.err"
        cmd = [
            py,
            "-u",
            str(script),
            "--bank",
            bank,
            "--delay",
            "0.55",
            "--checkpoint-every",
            "20",
            "--stage-every",
            "80",
            "--refresh-sitemap",
        ]
        with log.open("w", encoding="utf-8") as out, err.open("w", encoding="utf-8") as errf:
            proc = subprocess.Popen(
                cmd,
                cwd=str(ROOT),
                stdout=out,
                stderr=errf,
                **hidden_popen_kwargs(),
            )
        pids.append((bank, proc.pid))
        print(f"started {bank} pid={proc.pid} log={log.name}", flush=True)
    (LOG_DIR / "_wave2_scrape_pids.json").write_text(
        __import__("json").dumps({"pids": pids}, indent=2),
        encoding="utf-8",
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
