#!/usr/bin/env python3
"""Copy fresher/missing NAS staging DBs to local SSD collation staging.

Never overwrite a larger local DB with a smaller NAS copy (protects richer local).
Skips families with live -journal on either side.

Usage:
  python scripts/_copy_staging_nas_to_local.py
  python scripts/_copy_staging_nas_to_local.py --dry-run
"""

from __future__ import annotations

import argparse
import json
import shutil
import time
from pathlib import Path

NAS = Path(r"y:\Digital Stealth Care\Projects\DSC-HUB\brain\data\staging")
LOC = Path(r"C:\DSC\collation\staging")

# Already typed-merged earlier but missing locally — still copy for completeness.
# Mass merge is insert-or-ignore style so re-merge is safe.


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()
    LOC.mkdir(parents=True, exist_ok=True)

    live_journals = {p.name.replace(".sqlite3-journal", ".sqlite3") for p in NAS.glob("*-journal")}
    live_journals |= {p.name.replace(".sqlite3-journal", ".sqlite3") for p in LOC.glob("*-journal")}

    copied = []
    skipped = []
    for np in sorted(NAS.glob("*.sqlite3"), key=lambda p: -p.stat().st_size):
        if np.name.endswith("-journal"):
            continue
        if np.name in live_journals:
            skipped.append({"file": np.name, "reason": "live_journal"})
            continue
        lp = LOC / np.name
        ns = np.stat().st_size
        if not lp.exists():
            action = "copy_missing"
        else:
            ls = lp.stat().st_size
            # Only replace if NAS is clearly newer AND not smaller (avoid clobber).
            if ns >= ls and np.stat().st_mtime > lp.stat().st_mtime + 2:
                action = "copy_newer_ge"
            elif ns > ls * 1.05:
                action = "copy_larger"
            else:
                skipped.append(
                    {
                        "file": np.name,
                        "reason": "local_ok_or_richer",
                        "nas": ns,
                        "local": ls,
                    }
                )
                continue
        if args.dry_run:
            copied.append({"file": np.name, "action": action, "bytes": ns, "dry_run": True})
            continue
        t0 = time.time()
        shutil.copy2(np, lp)
        # side files
        for suf in ("-wal", "-shm"):
            side = Path(str(np) + suf)
            if side.exists():
                shutil.copy2(side, Path(str(lp) + suf))
        copied.append(
            {
                "file": np.name,
                "action": action,
                "bytes": ns,
                "sec": round(time.time() - t0, 2),
            }
        )
        print(f"  {action} {np.name} ({ns} bytes)", flush=True)

    print(
        json.dumps(
            {
                "copied": len(copied),
                "skipped": len(skipped),
                "live_journals": sorted(live_journals),
                "items": copied,
                "skip_sample": skipped[:20],
            },
            indent=2,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
