#!/usr/bin/env python3
"""Project Leafly parent_slugs from chemistry_profile payloads → parent_of edges.

Exact only: slug → spaces → name_norm; resolve via canonical or unique science_alias.
Does not invent parents. Idempotent with existing parent_of rows.

Usage:
  python scripts/project_leafly_parent_slugs.py --db C:\\DSC\\collation\\dsc_brain.sqlite3
"""

from __future__ import annotations

import argparse
import json
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from brain.dsc_brain.corpus import add_lineage_edge, connect, name_norm  # noqa: E402


def _tokens(val) -> list[str]:
    if val in (None, "", [], {}):
        return []
    if isinstance(val, str):
        parts = [p.strip() for p in val.replace(";", ",").split(",")]
        return [p for p in parts if p]
    if isinstance(val, (list, tuple)):
        out: list[str] = []
        for item in val:
            if isinstance(item, str) and item.strip():
                out.append(item.strip())
            elif isinstance(item, dict):
                s = item.get("slug") or item.get("name") or item.get("name_norm")
                if isinstance(s, str) and s.strip():
                    out.append(s.strip())
        return out
    return []


def _slug_to_name(slug: str) -> str:
    return slug.strip().replace("-", " ").replace("_", " ")


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--db", type=Path, required=True)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args(argv)

    con = connect(args.db)
    canonical = {r[0] for r in con.execute("SELECT name_norm FROM strain_canonical")}
    alias_map: dict[str, set[str]] = {}
    for a_norm, n_norm in con.execute(
        "SELECT alias_norm, name_norm FROM science_alias WHERE name_norm IS NOT NULL"
    ):
        if a_norm and n_norm:
            alias_map.setdefault(a_norm, set()).add(n_norm)

    before = con.execute(
        "SELECT COUNT(*) FROM entity_link WHERE method='parent_of'"
    ).fetchone()[0]
    stats = {
        "chem_rows": 0,
        "tokens": 0,
        "resolved_canonical": 0,
        "resolved_alias": 0,
        "unresolved": 0,
        "edges_inserted": 0,
        "edges_skipped_existing": 0,
        "samples_unresolved": [],
    }

    rows = con.execute(
        "SELECT name_norm, payload_json, source_id FROM chemistry_profile "
        "WHERE payload_json LIKE '%parent_slugs%'"
    )
    for child_nn, blob, source_id in rows:
        if not child_nn:
            continue
        stats["chem_rows"] += 1
        try:
            payload = json.loads(blob or "{}")
        except json.JSONDecodeError:
            continue
        if not isinstance(payload, dict):
            continue
        parents = _tokens(payload.get("parent_slugs"))
        if not parents and isinstance(payload.get("summary"), dict):
            parents = _tokens(payload["summary"].get("parent_slugs"))
        for raw in parents:
            stats["tokens"] += 1
            display = _slug_to_name(raw)
            key = name_norm(display)
            target = None
            via = ""
            if key in canonical:
                target = key
                via = "canonical"
                stats["resolved_canonical"] += 1
            else:
                hits = alias_map.get(key) or alias_map.get(name_norm(raw)) or set()
                if len(hits) == 1:
                    target = next(iter(hits))
                    via = "alias"
                    stats["resolved_alias"] += 1
            if not target:
                stats["unresolved"] += 1
                if len(stats["samples_unresolved"]) < 12:
                    stats["samples_unresolved"].append(
                        {"child": child_nn, "slug": raw, "norm": key}
                    )
                # Still record literal edge via add_lineage_edge (may queue literal)
                parent_for_edge = display
            else:
                parent_for_edge = target
            if args.dry_run:
                stats["edges_inserted"] += 1
                continue
            src = f"leafly_parent_slugs:{source_id or 'chem'}"
            before_n = con.execute(
                "SELECT COUNT(*) FROM entity_link WHERE method='parent_of' AND to_id=? AND "
                "((from_kind='strain_canonical' AND from_id=?) OR "
                "(from_kind='name_literal' AND from_id=?))",
                (child_nn, name_norm(parent_for_edge), parent_for_edge),
            ).fetchone()[0]
            if before_n:
                stats["edges_skipped_existing"] += 1
                continue
            eid = add_lineage_edge(
                con,
                child_norm=child_nn,
                parent=parent_for_edge if via != "canonical" else target,
                source_id=src,
            )
            if eid:
                stats["edges_inserted"] += 1
            else:
                stats["edges_skipped_existing"] += 1

    if not args.dry_run:
        con.commit()
    after = con.execute(
        "SELECT COUNT(*) FROM entity_link WHERE method='parent_of'"
    ).fetchone()[0]
    con.close()
    print(
        json.dumps(
            {
                "parent_of_before": before,
                "parent_of_after": after,
                **stats,
                "dry_run": args.dry_run,
                "built_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            },
            indent=2,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
