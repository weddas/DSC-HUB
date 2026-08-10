#!/usr/bin/env python3
"""Idempotent projector: structured parents → entity_link parent_of (collation v4).

Scans strain_canonical.summary_json and strain_variant.props_json.
Does NOT treat lineage_mermaid / deep lineage_tree as SoT.
Never deletes existing rows.
Never silently truncates parent lists: within the sanity bound, emit all parents;
oversize fields are logged + written to followup_gap (reason=oversize_parent_list)
and skipped for live insert.

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
    add_gap,
    add_lineage_edge,
    connect,
    name_norm,
)

PARENT_FIELDS = ("parents", "parent_slugs", "lineage_structured")
# Audit (2026-08-10 local): structured list max was 7. Bound is safety for junk
# arrays — oversize → gap, never silent truncate.
DEFAULT_OVERSIZE_BOUND = 32


def _parents_for_field(value) -> list[str]:
    names = _iter_parent_names(value)
    seen: set[str] = set()
    out: list[str] = []
    for n in names:
        k = n.strip().lower()
        if not k or k in seen:
            continue
        seen.add(k)
        out.append(n.strip())
    return out


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--db", type=Path, required=True)
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--commit-every", type=int, default=2000)
    ap.add_argument("--oversize-bound", type=int, default=DEFAULT_OVERSIZE_BOUND)
    args = ap.parse_args(argv)

    con = connect(args.db)
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
        "fields_oversize_skipped": 0,
        "edges_before": len(existing),
        "oversize_bound": args.oversize_bound,
    }

    def emit(child: str, parent: str, source_id: str) -> None:
        stats["edges_attempted"] += 1
        child_key = name_norm(child)
        parent_raw = (parent or "").strip()
        parent_key = name_norm(parent_raw)
        if not child_key or not parent_key or parent_key == child_key:
            return
        # Provisional key uses raw literal shape; add_lineage_edge may resolve alias.
        if args.dry_run:
            # Approximate skip check: canonical key or literal raw
            key_c = ("strain_canonical", parent_key, child_key)
            key_l = ("name_literal", parent_raw, child_key)
            if key_c in existing or key_l in existing:
                stats["edges_skipped_existing"] += 1
                return
            existing.add(key_c)
            stats["edges_inserted"] += 1
            return
        before_id = None
        row = con.execute(
            "SELECT id FROM entity_link WHERE method='parent_of' AND to_kind='strain_canonical' "
            "AND to_id=? AND ("
            "(from_kind='strain_canonical' AND from_id=?) OR "
            "(from_kind='name_literal' AND from_id=?)"
            ") LIMIT 1",
            (child_key, parent_key, parent_raw),
        ).fetchone()
        if row:
            stats["edges_skipped_existing"] += 1
            return
        eid = add_lineage_edge(con, child_norm=child_key, parent=parent_raw, source_id=source_id)
        if eid:
            # May have been created earlier in this run via alias resolution path
            stats["edges_inserted"] += 1
            existing.add(("strain_canonical", parent_key, child_key))
            existing.add(("name_literal", parent_raw, child_key))
        else:
            stats["edges_skipped_existing"] += 1

    def handle_fields(child: str, payload: dict, source_prefix: str) -> None:
        for field in PARENT_FIELDS:
            names = _parents_for_field(payload.get(field))
            if not names:
                continue
            if len(names) > args.oversize_bound:
                stats["fields_oversize_skipped"] += 1
                if not args.dry_run:
                    add_gap(
                        con,
                        "strain_canonical",
                        child,
                        f"parent_list:{field}",
                        "oversize_parent_list",
                    )
                print(
                    f"OVERSIZE skip {source_prefix}:{field} child={child} "
                    f"len={len(names)} bound={args.oversize_bound}"
                )
                continue
            for pname in names:
                emit(child, pname, f"{source_prefix}:{field}")

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
        handle_fields(row["name_norm"], d, "summary")
        if not args.dry_run and stats["canonical_scanned"] % args.commit_every == 0:
            con.commit()
            print(
                f"  checkpoint canonical={stats['canonical_scanned']} "
                f"inserted={stats['edges_inserted']} skipped={stats['edges_skipped_existing']} "
                f"oversize={stats['fields_oversize_skipped']}"
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
        handle_fields(child, d, src)
        if not args.dry_run and stats["variant_scanned"] % args.commit_every == 0:
            con.commit()
            print(
                f"  checkpoint variant={stats['variant_scanned']} "
                f"inserted={stats['edges_inserted']} skipped={stats['edges_skipped_existing']} "
                f"oversize={stats['fields_oversize_skipped']}"
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
