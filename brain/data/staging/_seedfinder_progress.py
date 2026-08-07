#!/usr/bin/env python3
"""Readonly SeedFinder progress (short sqlite busy timeout)."""
from __future__ import annotations

import json
import sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
CK = ROOT / "homeassistant" / "data" / "dsc_strains_seedfinder.checkpoint.json"
URLS = ROOT / "homeassistant" / "data" / "dsc_strains_seedfinder.urls.json"
DB = ROOT / "brain" / "data" / "staging" / "seedfinder.sqlite3"
PID = ROOT / "brain" / "data" / "staging" / "seedfinder_scrape.pid"
WPID = ROOT / "brain" / "data" / "staging" / "seedfinder_watchdog.pid"


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


def main() -> None:
    ck = json.loads(CK.read_text(encoding="utf-8")) if CK.exists() else {}
    done = len(ck.get("done") or [])
    errs = len(ck.get("errors") or [])
    total = 40638
    if URLS.exists():
        total = int(json.loads(URLS.read_text(encoding="utf-8")).get("count") or total)
    staging = {}
    if DB.exists():
        try:
            con = sqlite3.connect(f"file:{DB.as_posix()}?mode=ro", uri=True, timeout=2.0)
            con.execute("PRAGMA busy_timeout=2000")
            for t in ("raw_record", "strain_variant", "strain_canonical", "grow_trait"):
                try:
                    staging[t] = con.execute(f"SELECT COUNT(*) FROM [{t}]").fetchone()[0]
                except sqlite3.Error as e:
                    staging[t] = f"err:{e}"
            con.close()
        except sqlite3.Error as e:
            staging["error"] = str(e)
    sp = int(PID.read_text().strip()) if PID.exists() else 0
    wp = int(WPID.read_text().strip()) if WPID.exists() else 0
    left = max(0, total - done)
    out = {
        "checkpoint_done": done,
        "urls_total": total,
        "left": left,
        "pct": round(100.0 * done / total, 2) if total else 0,
        "errors": errs,
        "eta_hours_at_2.3s": round(left * 2.3 / 3600, 1),
        "scrape_pid": sp,
        "scrape_alive": alive(sp) if sp else False,
        "watchdog_pid": wp,
        "watchdog_alive": alive(wp) if wp else False,
        "staging": staging,
        "db_mb": round(DB.stat().st_size / 1e6, 1) if DB.exists() else 0,
    }
    print(json.dumps(out, indent=2))


if __name__ == "__main__":
    main()
