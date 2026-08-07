#!/usr/bin/env python3
"""Launch thin-field dump/staging jobs with CREATE_NO_WINDOW (no console flash)."""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from _win_no_window import hidden_popen_kwargs  # noqa: E402

PY = sys.executable
LOG = ROOT / "homeassistant" / "data"
LOG.mkdir(parents=True, exist_ok=True)


def spawn(name: str, args: list[str]) -> subprocess.Popen:
    out = open(LOG / f"_thin_{name}.log", "w", encoding="utf-8", errors="replace")
    err = open(LOG / f"_thin_{name}.err", "w", encoding="utf-8", errors="replace")
    kw = hidden_popen_kwargs(
        cwd=str(ROOT),
        stdout=out,
        stderr=err,
        stdin=subprocess.DEVNULL,
    )
    proc = subprocess.Popen([PY, *args], **kw)
    (LOG / f"_thin_{name}.pid").write_text(str(proc.pid), encoding="utf-8")
    print(f"spawned {name} pid={proc.pid} log=_thin_{name}.log")
    return proc


def main() -> int:
    # Clear greenhouse checkpoint so PDPs are re-fetched with richer grow parsing.
    ck = LOG / "dsc_strains_greenhouse.checkpoint.json"
    if ck.exists():
        ck.write_text(
            '{"done":[],"done_count":0,"skipped":[],"skipped_count":0,"errors":[]}\n',
            encoding="utf-8",
        )
        print("reset greenhouse checkpoint")

    jobs = [
        (
            "greenhouse",
            [
                "scripts/scrape_bank_sitemaps.py",
                "--bank",
                "greenhouse",
                "--refresh-sitemap",
                "--delay",
                "0.55",
                "--checkpoint-every",
                "20",
                "--stage-every",
                "80",
            ],
        ),
        (
            "rollitup",
            [
                "scripts/scrape_xenforo_forums.py",
                "--site",
                "rollitup",
                "--delay",
                "0.55",
                "--checkpoint-every",
                "25",
            ],
        ),
        (
            "ozstoners",
            [
                "scripts/scrape_ozstoners_forum.py",
                "--delay",
                "0.6",
                "--limit",
                "200",
                "--checkpoint-every",
                "20",
            ],
        ),
        (
            "ma_ccc",
            [
                "scripts/import_lab_ma_ccc.py",
                "--sample-rows",
                "80000",
                "--skip-stage",
            ],
        ),
    ]
    procs = [spawn(name, args) for name, args in jobs]
    print("launched", len(procs), "jobs (CREATE_NO_WINDOW); poll logs under homeassistant/data/_thin_*.log")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
