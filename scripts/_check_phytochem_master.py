#!/usr/bin/env python3
import sqlite3
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DB = ROOT / "brain" / "data" / "dsc_brain.sqlite3"
STAGING = ROOT / "brain" / "data" / "staging" / "phytochem_smith.sqlite3"

print("staging_exists", STAGING.exists(), "size", STAGING.stat().st_size if STAGING.exists() else 0, flush=True)
if STAGING.exists():
    s = sqlite3.connect(str(STAGING), timeout=30)
    print(
        "staging_chem",
        s.execute("SELECT COUNT(*) FROM chemistry_profile").fetchone()[0],
        "raw",
        s.execute("SELECT COUNT(*) FROM raw_record").fetchone()[0],
        flush=True,
    )
    s.close()

for i in range(90):
    try:
        c = sqlite3.connect(str(DB), timeout=3)
        c.execute("PRAGMA busy_timeout=3000")
        chem = c.execute("SELECT COUNT(*) FROM chemistry_profile").fetchone()[0]
        phy = c.execute(
            "SELECT COUNT(*) FROM chemistry_profile WHERE source_id=?",
            ("phytochem_smith",),
        ).fetchone()[0]
        c.close()
        print(f"MASTER_OK attempt={i} chem={chem} phytochem_smith={phy}", flush=True)
        raise SystemExit(0)
    except sqlite3.OperationalError as e:
        print(f"busy {i}: {e}", flush=True)
        time.sleep(20)
print("GIVE_UP", flush=True)
raise SystemExit(2)
