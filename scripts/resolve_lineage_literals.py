#!/usr/bin/env python3
"""Exact-resolve name_literal parent_of edges; seat leftovers in lineage_unresolved.

Never invents fuzzy links. Promotes unique exact alias_norm → science_alias when
the literal already matches a unique canonical under name_norm.

Usage:
  python scripts/resolve_lineage_literals.py --db C:\\DSC\\collation\\dsc_brain.sqlite3 --dry-run
  python scripts/resolve_lineage_literals.py --db C:\\DSC\\collation\\dsc_brain.sqlite3
"""

from __future__ import annotations

import argparse
import json
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from brain.dsc_brain.corpus import connect, name_norm  # noqa: E402


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--db", type=Path, required=True)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args(argv)

    con = connect(args.db)
    now = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    canonical = {r[0] for r in con.execute("SELECT name_norm FROM strain_canonical")}
    # alias_norm -> set of name_norm
    alias_map: dict[str, set[str]] = {}
    for a_norm, n_norm in con.execute(
        "SELECT alias_norm, name_norm FROM science_alias WHERE name_norm IS NOT NULL"
    ):
        if not a_norm or not n_norm:
            continue
        alias_map.setdefault(a_norm, set()).add(n_norm)

    literals = list(
        con.execute(
            "SELECT id, from_id, to_id, confidence, source FROM entity_link "
            "WHERE method='parent_of' AND from_kind='name_literal'"
        )
    )
    stats = {
        "literals_before": len(literals),
        "resolved_via_canonical": 0,
        "resolved_via_alias": 0,
        "aliases_promoted": 0,
        "rewritten": 0,
        "unresolved_queued": 0,
        "skipped_collision": 0,
        "dry_run": args.dry_run,
    }

    # Pass 1: promote missing unique alias when name_norm(literal) == unique canonical
    # and literal string differs from canonical display — actually: if name_norm(literal)
    # is in canonical, resolve to that. If not, check alias_map.
    # Also: if name_norm(literal) not in canonical but there is exactly one alias hit, resolve.
    # Promote: when name_norm(literal) matches a canonical AND science_alias lacks alias_norm,
    # insert science_alias so future ingest resolves.

    to_rewrite: list[tuple[str, str, str, float, str | None]] = []  # id, new_from_id, to_id, conf, source
    unresolved: dict[str, dict] = {}

    for row in literals:
        lid, raw, child, conf, source = row[0], row[1], row[2], row[3], row[4]
        key = name_norm(raw)
        target: str | None = None
        via = ""
        # Bugfix: some scrapers concatenate a literal "null" onto parent names.
        if key.endswith("null") and len(key) > 4:
            stripped = name_norm(raw[: -len("null")] if raw.lower().endswith("null") else raw)
            # Prefer stripping the raw suffix then re-norm
            if raw.lower().endswith("null"):
                stripped = name_norm(raw[:-4])
            if stripped and stripped in canonical:
                key = stripped
                target = stripped
                via = "canonical_null_suffix"
            elif stripped and len(alias_map.get(stripped) or []) == 1:
                key = stripped
                target = next(iter(alias_map[stripped]))
                via = "alias_null_suffix"
        if target is None and key in canonical:
            target = key
            via = "canonical"
        elif target is None:
            hits = alias_map.get(key) or set()
            if len(hits) == 1:
                target = next(iter(hits))
                via = "alias"
        if target:
            to_rewrite.append((lid, target, child, conf, source))
            if via.startswith("canonical"):
                stats["resolved_via_canonical"] += 1
                # Promote alias if missing and raw display differs
                promo_key = name_norm(raw[:-4] if raw.lower().endswith("null") else raw)
                if promo_key not in alias_map and not args.dry_run:
                    con.execute(
                        "INSERT OR IGNORE INTO science_alias(alias_norm, alias, name_norm, source_id) "
                        "VALUES(?,?,?,?)",
                        (promo_key, (raw[:-4] if raw.lower().endswith("null") else raw).strip(), target, "lineage_literal_resolve"),
                    )
                    if con.execute("SELECT changes()").fetchone()[0]:
                        stats["aliases_promoted"] += 1
                        alias_map.setdefault(promo_key, set()).add(target)
                elif promo_key not in alias_map and args.dry_run:
                    stats["aliases_promoted"] += 1
            else:
                stats["resolved_via_alias"] += 1
        else:
            reason = "no_exact_canonical_or_alias"
            if key in alias_map and len(alias_map[key]) > 1:
                reason = "ambiguous_alias"
            if key in ("null", "") or raw.strip().lower() == "null":
                reason = "junk_literal_null"
            u = unresolved.setdefault(
                raw,
                {
                    "literal": raw,
                    "literal_norm": key,
                    "edge_count": 0,
                    "reason": reason,
                    "sample_child_norm": child,
                },
            )
            u["edge_count"] += 1

    if not args.dry_run:
        if con.in_transaction:
            con.commit()
        con.execute("BEGIN IMMEDIATE")
        for lid, parent_key, child, conf, source in to_rewrite:
            # If canonical edge already exists, drop the literal edge
            exists = con.execute(
                "SELECT id FROM entity_link WHERE method='parent_of' "
                "AND from_kind='strain_canonical' AND from_id=? "
                "AND to_kind='strain_canonical' AND to_id=? LIMIT 1",
                (parent_key, child),
            ).fetchone()
            if exists:
                con.execute("DELETE FROM entity_link WHERE id=?", (lid,))
                stats["skipped_collision"] += 1
                continue
            con.execute(
                "UPDATE entity_link SET from_kind='strain_canonical', from_id=? WHERE id=?",
                (parent_key, lid),
            )
            stats["rewritten"] += 1

        # Rebuild lineage_unresolved from current leftovers
        con.execute("DELETE FROM lineage_unresolved")
        for u in unresolved.values():
            con.execute(
                "INSERT INTO lineage_unresolved(literal, literal_norm, edge_count, reason, "
                "sample_child_norm, updated_at) VALUES(?,?,?,?,?,?)",
                (
                    u["literal"],
                    u["literal_norm"],
                    u["edge_count"],
                    u["reason"],
                    u["sample_child_norm"],
                    now,
                ),
            )
            stats["unresolved_queued"] += 1
        con.commit()
    else:
        stats["rewritten"] = len(to_rewrite)
        stats["unresolved_queued"] = len(unresolved)

    stats["literals_after"] = con.execute(
        "SELECT COUNT(*) FROM entity_link WHERE method='parent_of' AND from_kind='name_literal'"
    ).fetchone()[0]
    stats["parent_of_after"] = con.execute(
        "SELECT COUNT(*) FROM entity_link WHERE method='parent_of'"
    ).fetchone()[0]
    stats["lineage_unresolved_rows"] = con.execute(
        "SELECT COUNT(*) FROM lineage_unresolved"
    ).fetchone()[0]
    # Verify: leftover literals should equal sum of edge_counts in queue when not dry-run
    if not args.dry_run:
        sum_edges = con.execute(
            "SELECT COALESCE(SUM(edge_count),0) FROM lineage_unresolved"
        ).fetchone()[0]
        stats["unresolved_edge_sum"] = sum_edges
        stats["verify_literal_eq_queue"] = stats["literals_after"] == sum_edges
    stats["top_unresolved"] = [
        dict(r)
        for r in con.execute(
            "SELECT literal, edge_count, reason FROM lineage_unresolved "
            "ORDER BY edge_count DESC LIMIT 20"
        )
    ] if not args.dry_run else sorted(
        ({"literal": u["literal"], "edge_count": u["edge_count"], "reason": u["reason"]}
         for u in unresolved.values()),
        key=lambda x: -x["edge_count"],
    )[:20]
    stats["built_at"] = now
    con.close()
    print(json.dumps(stats, indent=2))
    if not args.dry_run and not stats.get("verify_literal_eq_queue", True):
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
