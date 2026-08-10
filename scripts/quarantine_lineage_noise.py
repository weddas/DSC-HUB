#!/usr/bin/env python3
"""Quarantine noisy parent_of edges (copy-out then delete from entity_link).

Default rule: source contains 'lineage_tree' (pre-kill SeedFinder tree walk).
Never invent deletes without INSERT INTO quarantine first.

Usage:
  python scripts/quarantine_lineage_noise.py --db C:\\DSC\\collation\\dsc_brain.sqlite3 --dry-run
  python scripts/quarantine_lineage_noise.py --db C:\\DSC\\collation\\dsc_brain.sqlite3
"""

from __future__ import annotations

import argparse
import json
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from brain.dsc_brain.corpus import connect  # noqa: E402

DEFAULT_REASON = "lineage_tree_not_sot"


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--db", type=Path, required=True)
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument(
        "--source-like",
        default="%lineage_tree%",
        help="SQL LIKE pattern on entity_link.source (default %%lineage_tree%%)",
    )
    ap.add_argument("--reason", default=DEFAULT_REASON)
    args = ap.parse_args(argv)

    con = connect(args.db)
    now = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    match_count = con.execute(
        "SELECT COUNT(*) FROM entity_link WHERE method='parent_of' AND source LIKE ?",
        (args.source_like,),
    ).fetchone()[0]
    before = con.execute(
        "SELECT COUNT(*) FROM entity_link WHERE method='parent_of'"
    ).fetchone()[0]
    q_before = con.execute("SELECT COUNT(*) FROM entity_link_quarantine").fetchone()[0]

    stats = {
        "matched": match_count,
        "parent_of_before": before,
        "quarantine_before": q_before,
        "source_like": args.source_like,
        "reason": args.reason,
        "dry_run": args.dry_run,
    }
    if args.dry_run:
        print(json.dumps(stats, indent=2))
        con.close()
        return 0

    # connect() may already be in a transaction; commit so BEGIN IMMEDIATE can run.
    if con.in_transaction:
        con.commit()
    con.execute("BEGIN IMMEDIATE")
    con.execute(
        """
        INSERT OR IGNORE INTO entity_link_quarantine(
          id, from_kind, from_id, to_kind, to_id, method, confidence, source,
          reason, quarantined_at
        )
        SELECT id, from_kind, from_id, to_kind, to_id, method, confidence, source,
               ?, ?
        FROM entity_link
        WHERE method='parent_of' AND source LIKE ?
        """,
        (args.reason, now, args.source_like),
    )
    inserted = con.execute("SELECT changes()").fetchone()[0]
    con.execute(
        "DELETE FROM entity_link WHERE method='parent_of' AND source LIKE ?",
        (args.source_like,),
    )
    deleted = con.execute("SELECT changes()").fetchone()[0]
    con.commit()

    after = con.execute(
        "SELECT COUNT(*) FROM entity_link WHERE method='parent_of'"
    ).fetchone()[0]
    q_after = con.execute("SELECT COUNT(*) FROM entity_link_quarantine").fetchone()[0]
    remaining_tree = con.execute(
        "SELECT COUNT(*) FROM entity_link WHERE method='parent_of' AND source LIKE ?",
        (args.source_like,),
    ).fetchone()[0]
    stats.update(
        {
            "quarantine_inserted": inserted,
            "entity_link_deleted": deleted,
            "parent_of_after": after,
            "quarantine_after": q_after,
            "remaining_matching": remaining_tree,
            "built_at": now,
        }
    )
    con.close()
    print(json.dumps(stats, indent=2))
    if remaining_tree != 0 or deleted != match_count:
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
