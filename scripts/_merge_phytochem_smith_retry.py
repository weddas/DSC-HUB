#!/usr/bin/env python3
"""Retry merge of phytochem_smith staging into master until lock clears."""

from __future__ import annotations

import sqlite3
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "scripts"))

from brain.dsc_brain.paths import DEFAULT_DB  # noqa: E402
from merge_staging_to_master import main as merge_main  # noqa: E402


def main() -> int:
    for i in range(120):
        m = None
        try:
            m = sqlite3.connect(str(DEFAULT_DB), timeout=2)
            m.execute("PRAGMA busy_timeout=2000")
            m.execute("BEGIN IMMEDIATE")
            before = m.execute("SELECT COUNT(*) FROM chemistry_profile").fetchone()[0]
            m.execute("ROLLBACK")
            m.close()
            m = None
            print(f"GOT_LOCK attempt={i} chem_before={before}", flush=True)
            rc = merge_main(["--only", "phytochem_smith", "--no-search", "--no-link"])
            m2 = sqlite3.connect(str(DEFAULT_DB), timeout=120)
            m2.execute("PRAGMA busy_timeout=180000")
            after = m2.execute("SELECT COUNT(*) FROM chemistry_profile").fetchone()[0]
            phy = m2.execute(
                "SELECT COUNT(*) FROM chemistry_profile WHERE source_id=?",
                ("phytochem_smith",),
            ).fetchone()[0]
            m2.close()
            print(
                f"MERGE_DONE rc={rc} chem_before={before} chem_after={after} "
                f"delta={after - before} phytochem_smith={phy}",
                flush=True,
            )
            return int(rc)
        except sqlite3.OperationalError as exc:
            print(f"busy {i}: {exc}", flush=True)
            if m is not None:
                try:
                    m.close()
                except Exception:
                    pass
            time.sleep(15)
    print("GIVE_UP", flush=True)
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
