#!/usr/bin/env python3
"""One-shot: verify leafly_height_bands staging + merge --no-link."""
from __future__ import annotations

import json
import sqlite3
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STAGING = ROOT / "brain" / "data" / "staging" / "leafly_height_bands.sqlite3"


def main() -> int:
    if not STAGING.exists():
        print(f"missing {STAGING}")
        return 2
    # UNC/NAS paths break sqlite URI authority — use plain connect.
    con = sqlite3.connect(str(STAGING))
    grow = con.execute("SELECT COUNT(*) FROM grow_trait").fetchone()[0]
    raw = con.execute("SELECT COUNT(*) FROM raw_record").fetchone()[0]
    fam = con.execute(
        "SELECT value FROM meta WHERE key='staging_source_family'"
    ).fetchone()
    sample = con.execute("SELECT payload_json FROM grow_trait LIMIT 1").fetchone()
    con.close()
    print(
        json.dumps(
            {
                "path": str(STAGING),
                "grow": grow,
                "raw": raw,
                "family": fam[0] if fam else None,
                "sample": (sample[0][:180] if sample else None),
            },
            indent=2,
        )
    )
    if grow < 1:
        print("no grow rows — skip merge")
        return 1
    cmd = [
        sys.executable,
        "-u",
        str(ROOT / "scripts" / "merge_staging_to_master.py"),
        "--only",
        "leafly_height_bands",
        "--no-link",
        "--no-search",
    ]
    print("MERGE:", " ".join(cmd))
    return subprocess.call(cmd, cwd=str(ROOT))


if __name__ == "__main__":
    raise SystemExit(main())
