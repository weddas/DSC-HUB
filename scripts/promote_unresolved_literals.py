#!/usr/bin/env python3
"""Promote high-frequency unresolved lineage literals to canonical + resolve.

Exact only. Skips junk/geo/marketing via quarantine_junk_literals.classify.
Creates strain_canonical when missing, then rewrites name_literal → strain_canonical.

Usage:
  python scripts/promote_unresolved_literals.py --db C:\\DSC\\collation\\dsc_brain.sqlite3 --min-edges 5
"""

from __future__ import annotations

import argparse
import importlib.util
import json
import re
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from brain.dsc_brain.corpus import connect, name_norm, upsert_canonical  # noqa: E402

_spec = importlib.util.spec_from_file_location(
    "quarantine_junk_literals",
    ROOT / "scripts" / "quarantine_junk_literals.py",
)
_mod = importlib.util.module_from_spec(_spec)
assert _spec.loader is not None
_spec.loader.exec_module(_mod)
classify = _mod.classify

# Extra skip: place-ish tokens that aren't strains
SKIP_NORMS = frozenset(
    {
        "la",
        "l a",
        "me",
        "f",
        "x",
        "kalifornien",
        "california",
        "holland",
        "amsterdam",
        "spain",
        "france",
        "italy",
        "germany",
    }
)
UI_GARBAGE_RE = re.compile(
    r"(show all|show less|no reviews yet|strain reviews|family tree map|"
    r"dynamic family|click here|add to cart|javascript)",
    re.I,
)


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--db", type=Path, required=True)
    ap.add_argument("--min-edges", type=int, default=5)
    ap.add_argument("--limit", type=int, default=200)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args(argv)

    con = connect(args.db)
    rows = list(
        con.execute(
            "SELECT literal, edge_count FROM lineage_unresolved "
            "WHERE edge_count >= ? ORDER BY edge_count DESC LIMIT ?",
            (args.min_edges, args.limit),
        )
    )
    promoted = 0
    resolved = 0
    skipped_junk = 0
    samples: list[dict] = []
    now = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

    for literal, edges in rows:
        if classify(literal):
            skipped_junk += 1
            continue
        key = name_norm(literal)
        if not key or len(key) < 2:
            skipped_junk += 1
            continue
        if key in SKIP_NORMS:
            skipped_junk += 1
            continue
        if len(literal) > 60 or len(key.split()) > 8:
            skipped_junk += 1
            continue
        if UI_GARBAGE_RE.search(literal) or UI_GARBAGE_RE.search(key):
            skipped_junk += 1
            continue
        if "\n" in literal or literal.startswith(">") or literal.startswith("("):
            skipped_junk += 1
            continue
        if key.isdigit() or re.search(r"feminized photoperiod|landrace influence", literal, re.I):
            skipped_junk += 1
            continue
        if not args.dry_run:
            upsert_canonical(con, literal)
            # rewrite literal edges
            kids = list(
                con.execute(
                    "SELECT id, to_id FROM entity_link WHERE method='parent_of' "
                    "AND from_kind='name_literal' AND from_id=?",
                    (literal,),
                )
            )
            for lid, child in kids:
                # avoid duplicate parent_of to same child
                exists = con.execute(
                    "SELECT 1 FROM entity_link WHERE method='parent_of' "
                    "AND from_kind='strain_canonical' AND from_id=? "
                    "AND to_kind='strain_canonical' AND to_id=? LIMIT 1",
                    (key, child),
                ).fetchone()
                if exists:
                    con.execute("DELETE FROM entity_link WHERE id=?", (lid,))
                else:
                    con.execute(
                        "UPDATE entity_link SET from_kind='strain_canonical', from_id=? WHERE id=?",
                        (key, lid),
                    )
                resolved += 1
            con.execute("DELETE FROM lineage_unresolved WHERE literal=?", (literal,))
            con.execute(
                "INSERT OR IGNORE INTO science_alias(alias_norm, alias, name_norm, source_id) "
                "VALUES(?,?,?,?)",
                (key, literal, key, "promote_unresolved_literal"),
            )
        promoted += 1
        if len(samples) < 25:
            samples.append({"literal": literal, "edges": edges, "name_norm": key})

    if not args.dry_run:
        con.commit()
    stats = {
        "candidates": len(rows),
        "promoted": promoted,
        "edges_resolved": resolved,
        "skipped_junk": skipped_junk,
        "samples": samples,
        "unresolved_after": con.execute("SELECT COUNT(*) FROM lineage_unresolved").fetchone()[0],
        "parent_of_after": con.execute(
            "SELECT COUNT(*) FROM entity_link WHERE method='parent_of'"
        ).fetchone()[0],
        "dry_run": args.dry_run,
        "built_at": now,
    }
    con.close()
    print(json.dumps(stats, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
