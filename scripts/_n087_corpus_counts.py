#!/usr/bin/env python3
"""Corpus table counts with busy timeout."""
from __future__ import annotations

import sqlite3
import time
from pathlib import Path

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from brain.dsc_brain.paths import DEFAULT_DB  # noqa: E402


def main() -> None:
    print("DB", DEFAULT_DB)
    for i in range(8):
        try:
            conn = sqlite3.connect(str(DEFAULT_DB), timeout=60)
            conn.execute("PRAGMA busy_timeout=60000")
            tables = [
                r[0]
                for r in conn.execute(
                    "SELECT name FROM sqlite_master WHERE type='table' ORDER BY 1"
                )
            ]
            print("tables", tables)
            for t in tables:
                try:
                    n = conn.execute(f'SELECT COUNT(*) FROM "{t}"').fetchone()[0]
                    print(f"  {t}: {n}")
                except Exception as exc:  # noqa: BLE001
                    print(f"  {t}: ERR {exc}")
            conn.close()
            return
        except Exception as exc:  # noqa: BLE001
            print(f"attempt {i}: {exc}")
            time.sleep(2)
    raise SystemExit(1)


if __name__ == "__main__":
    main()
