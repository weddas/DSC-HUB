#!/usr/bin/env python3
"""Idempotent projector: structured parents → entity_link parent_of (collation v4).

Scans strain_canonical.summary_json and strain_variant.props_json.
Does NOT treat lineage_mermaid / deep lineage_tree as SoT.
Never deletes existing rows. Caps parents per field to avoid explosions.

Usage:
  python scripts/project_lineage_edges.py --db C:\\DSC\\collation\\dsc_brain.sqlite3
  python scripts/project_lineage_edges.py --db ... --dry-run --limit 1000
"""

from __future__ import annotations

import argparse
import json
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from brain.dsc_brain.corpus import (  # noqa: E402
    _iter_parent_names,
    add_lineage_edge,
    connect,
    name_norm,
)

PARENT_FIELDS = ("parents", "parent_slugs", "lineage_structured")
MAX_PARENTS_PER_FIELD = 16


def _parents_capped(value) -> list[str]:
    names = _iter_parent_names(value)
    seen: set[str] = set()
    out: list[str] = []
    for n in names:
        k = n.strip().lower()
        if not k or k in seen:
            continue
        seen.add(k)
        out.append(n.strip())
        if len(out) >= MAX_PARENTS_PER_FIELD:
            break
    return out


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--db", type=Path, required=True)
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--commit-every", type=int, default=2000)
    args = ap.parse_args(argv)

    con = connect(args.db)
    canonical = {r[0] for r in con.execute("SELECT name_norm FROM strain_canonical")}
    existing = {
        (r[0], r[1], r[2])
        for r in con.execute(
            "SELECT from_kind, from_id, to_id FROM entity_link WHERE method='parent_of'"
        )
    }
    stats = {
        "canonical_scanned": 0,
        "variant_scanned": 0,
        "edges_attempted": 0,
        "edges_inserted": 0,
        "edges_skipped_existing": 0,
        "edges_before": len(existing),
    }

    def emit(child: str, parent: str, source_id: str) -> None:
        stats["edges_attempted"] += 1
        child_key = name_norm(child)
        parent_raw = (parent or "").strip()
        parent_key = name_norm(parent_raw)
        if not child_key or not parent_key or parent_key == child_key:
            return
        if parent_key in canonical:
            from_kind, from_id = "strain_canonical", parent_key
        else:
            from_kind, from_id = "name_literal", parent_raw
        key = (from_kind, from_id, child_key)
        if key in existing:
            stats["edges_skipped_existing"] += 1
            return
        if args.dry_run:
            existing.add(key)
            stats["edges_inserted"] += 1
            return
        add_lineage_edge(con, child_norm=child_key, parent=parent_raw, source_id=source_id)
        existing.add(key)
        stats["edges_inserted"] += 1

    n = 0
    for row in con.execute("SELECT name_norm, summary_json FROM strain_canonical"):
        stats["canonical_scanned"] += 1
        n += 1
        if args.limit and n > args.limit:
            break
        try:
            d = json.loads(row["summary_json"] or "{}")
        except json.JSONDecodeError:
            continue
        if not isinstance(d, dict):
            continue
        child = row["name_norm"]
        for field in PARENT_FIELDS:
            for pname in _parents_capped(d.get(field)):
                emit(child, pname, f"summary:{field}")
        if not args.dry_run and stats["canonical_scanned"] % args.commit_every == 0:
            con.commit()
            print(
                f"  checkpoint canonical={stats['canonical_scanned']} "
                f"inserted={stats['edges_inserted']} skipped={stats['edges_skipped_existing']}"
            )

    n = 0
    for row in con.execute("SELECT id, name_norm, source_id, props_json FROM strain_variant"):
        stats["variant_scanned"] += 1
        n += 1
        if args.limit and n > args.limit:
            break
        try:
            d = json.loads(row["props_json"] or "{}")
        except json.JSONDecodeError:
            continue
        if not isinstance(d, dict):
            continue
        child = row["name_norm"] or name_norm(str(d.get("name") or ""))
        if not child:
            continue
        src = row["source_id"] or "variant_props"
        for field in PARENT_FIELDS:
            for pname in _parents_capped(d.get(field)):
                emit(child, pname, f"{src}:{field}")
        if not args.dry_run and stats["variant_scanned"] % args.commit_every == 0:
            con.commit()
            print(
                f"  checkpoint variant={stats['variant_scanned']} "
                f"inserted={stats['edges_inserted']} skipped={stats['edges_skipped_existing']}"
            )

    if not args.dry_run:
        con.commit()
    stats["edges_after"] = con.execute(
        "SELECT COUNT(*) FROM entity_link WHERE method='parent_of'"
    ).fetchone()[0]
    stats["unresolved_literals"] = con.execute(
        "SELECT COUNT(*) FROM entity_link WHERE method='parent_of' AND from_kind='name_literal'"
    ).fetchone()[0]
    stats["built_at"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    stats["dry_run"] = args.dry_run
    con.close()
    print(json.dumps(stats, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
