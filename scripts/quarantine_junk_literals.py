#!/usr/bin/env python3
"""Quarantine true-junk parent_of name_literal edges (not OG/F/bx/cut names).

Reasons:
  junk_literal_null — bare null
  junk_unknown_parent — Unknown *
  junk_geo_or_marketing — country / marketing fragments

Usage:
  python scripts/quarantine_junk_literals.py --db C:\\DSC\\collation\\dsc_brain.sqlite3 --dry-run
  python scripts/quarantine_junk_literals.py --db C:\\DSC\\collation\\dsc_brain.sqlite3
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from brain.dsc_brain.corpus import connect, name_norm  # noqa: E402

GEO = {
    "afghanistan",
    "colombia",
    "mexico",
    "thailand",
    "india",
    "usa",
    "canada",
    "jamaica",
    "hawaii",
    "brazil",
    "africa",
    "congo africa",
    "colombia africa",
}

MARKETING_RE = re.compile(
    r"^(the many breeders|at affordable prices|and not to throw shade|but we have seen|"
    r"particularly in their ability|lineage|mostly indica|mostly sativa|f photoperiod|"
    r"of bubba kush|me|usa unknown hybrid)$",
    re.I,
)
UNKNOWN_RE = re.compile(r"^unknown\b", re.I)
# Phrase fragments that are never parents (match anywhere / as whole after norm)
MARKETING_PHRASE_RE = re.compile(
    r"("
    r"breeders we work with|affordable prices|not to throw shade|did not cut the mustard|"
    r"supposed .auto|in the market that|nuances of|particularly in their|"
    r"and not to |at affordable|many breeders"
    r")",
    re.I,
)


def classify(raw: str) -> str | None:
    s = (raw or "").strip()
    if not s or s.lower() == "null":
        return "junk_literal_null"
    if UNKNOWN_RE.match(s):
        return "junk_unknown_parent"
    key = name_norm(s)
    if key in GEO:
        return "junk_geo_or_marketing"
    if MARKETING_RE.match(s) or MARKETING_RE.match(key):
        return "junk_geo_or_marketing"
    if MARKETING_PHRASE_RE.search(s) or MARKETING_PHRASE_RE.search(key):
        return "junk_geo_or_marketing"
    # long marketing sentences / prose parents
    if len(s) > 60 and (" " in s):
        if re.search(
            r"\b(we|the market|supposed|nuances|affordable|breeders we|throw shade|"
            r"cut the mustard|particularly)\b",
            s,
            re.I,
        ):
            return "junk_geo_or_marketing"
        # many words, no strain-like markers
        words = s.split()
        if len(words) >= 8 and not re.search(
            r"\b(f2|f3|f4|bx\d*|og|auto|kush|haze|dream|gelato|cookies)\b", s, re.I
        ):
            if re.search(r"\b(the|and|with|that|their|have|from)\b", s, re.I):
                return "junk_geo_or_marketing"
    return None


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--db", type=Path, required=True)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args(argv)

    con = connect(args.db)
    now = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    rows = list(
        con.execute(
            "SELECT id, from_id, to_id, method, confidence, source, from_kind, to_kind "
            "FROM entity_link WHERE method='parent_of' AND from_kind='name_literal'"
        )
    )
    by_reason: dict[str, list] = {}
    for r in rows:
        reason = classify(r[1])
        if not reason:
            continue
        by_reason.setdefault(reason, []).append(r)

    stats = {
        "scanned_literals": len(rows),
        "matched_by_reason": {k: len(v) for k, v in by_reason.items()},
        "matched_total": sum(len(v) for v in by_reason.values()),
        "dry_run": args.dry_run,
    }
    if args.dry_run:
        print(json.dumps(stats, indent=2))
        con.close()
        return 0

    if con.in_transaction:
        con.commit()
    con.execute("BEGIN IMMEDIATE")
    moved = 0
    for reason, items in by_reason.items():
        for r in items:
            lid, from_id, to_id, method, conf, source, from_kind, to_kind = (
                r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7]
            )
            con.execute(
                """
                INSERT OR IGNORE INTO entity_link_quarantine(
                  id, from_kind, from_id, to_kind, to_id, method, confidence, source,
                  reason, quarantined_at
                ) VALUES(?,?,?,?,?,?,?,?,?,?)
                """,
                (lid, from_kind, from_id, to_kind, to_id, method, conf, source, reason, now),
            )
            con.execute("DELETE FROM entity_link WHERE id=?", (lid,))
            moved += 1
    con.commit()

    # rebuild lineage_unresolved from remaining literals
    remaining = list(
        con.execute(
            "SELECT from_id, to_id FROM entity_link WHERE method='parent_of' AND from_kind='name_literal'"
        )
    )
    unresolved: dict[str, dict] = {}
    for raw, child in remaining:
        reason = classify(raw) or "no_exact_canonical_or_alias"
        # if still classifiable junk somehow left, mark it
        u = unresolved.setdefault(
            raw,
            {
                "literal": raw,
                "literal_norm": name_norm(raw),
                "edge_count": 0,
                "reason": reason if reason.startswith("junk_") else "no_exact_canonical_or_alias",
                "sample_child_norm": child,
            },
        )
        u["edge_count"] += 1
    con.execute("DELETE FROM lineage_unresolved")
    for u in unresolved.values():
        con.execute(
            "INSERT INTO lineage_unresolved(literal, literal_norm, edge_count, reason, "
            "sample_child_norm, updated_at) VALUES(?,?,?,?,?,?)",
            (u["literal"], u["literal_norm"], u["edge_count"], u["reason"], u["sample_child_norm"], now),
        )
    con.commit()
    stats.update(
        {
            "moved": moved,
            "parent_of_after": con.execute(
                "SELECT COUNT(*) FROM entity_link WHERE method='parent_of'"
            ).fetchone()[0],
            "literals_after": con.execute(
                "SELECT COUNT(*) FROM entity_link WHERE method='parent_of' AND from_kind='name_literal'"
            ).fetchone()[0],
            "lineage_unresolved_after": con.execute("SELECT COUNT(*) FROM lineage_unresolved").fetchone()[0],
            "built_at": now,
        }
    )
    con.close()
    print(json.dumps(stats, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
