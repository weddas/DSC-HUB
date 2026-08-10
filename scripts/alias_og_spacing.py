#!/usr/bin/env python3
"""Exact hygiene: alias o g <-> og spaced-token variants into science_alias.

Does NOT strip subtype markers. Does NOT delete duplicate canonicals.
Prefer denser canonical (more chem+grow+variant+obs) as alias target.

Usage:
  python scripts/alias_og_spacing.py --db C:\\DSC\\collation\\dsc_brain.sqlite3 --dry-run
  python scripts/alias_og_spacing.py --db C:\\DSC\\collation\\dsc_brain.sqlite3
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

OG_SPACED = re.compile(r"\bo g\b")


def og_compact(norm: str) -> str:
    return " ".join(OG_SPACED.sub("og", norm).split())


def density(con, name: str) -> int:
    return (
        con.execute("SELECT COUNT(*) FROM chemistry_profile WHERE name_norm=?", (name,)).fetchone()[0]
        + con.execute("SELECT COUNT(*) FROM grow_trait WHERE name_norm=?", (name,)).fetchone()[0]
        + con.execute("SELECT COUNT(*) FROM strain_variant WHERE name_norm=?", (name,)).fetchone()[0]
        + con.execute("SELECT COUNT(*) FROM observation WHERE name_norm=?", (name,)).fetchone()[0]
    )


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--db", type=Path, required=True)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args(argv)

    con = connect(args.db)
    canonical = {r[0] for r in con.execute("SELECT name_norm FROM strain_canonical")}
    pairs: list[tuple[str, str]] = []
    seen: set[tuple[str, str]] = set()
    for n in canonical:
        c = og_compact(n)
        if c != n and c in canonical:
            a, b = sorted([n, c])
            if (a, b) not in seen:
                seen.add((a, b))
                pairs.append((n, c))

    stats = {
        "pairs": len(pairs),
        "aliases_promoted": 0,
        "dry_run": args.dry_run,
        "samples": [],
    }
    for n, c in pairs:
        # denser wins as target
        dn, dc = density(con, n), density(con, c)
        if dc > dn:
            target, alias = c, n
        else:
            target, alias = n, c
        if len(stats["samples"]) < 15:
            stats["samples"].append({"alias": alias, "target": target, "d_alias": density(con, alias), "d_target": density(con, target)})
        if args.dry_run:
            stats["aliases_promoted"] += 1
            continue
        # display form from canonical.name
        row = con.execute("SELECT name FROM strain_canonical WHERE name_norm=?", (alias,)).fetchone()
        display = row[0] if row else alias
        con.execute(
            "INSERT OR IGNORE INTO science_alias(alias_norm, alias, name_norm, source_id) VALUES(?,?,?,?)",
            (alias, display, target, "og_spacing_alias"),
        )
        if con.execute("SELECT changes()").fetchone()[0]:
            stats["aliases_promoted"] += 1
        # also alias the compact form of the alias string if needed
        compact_alias = og_compact(alias)
        if compact_alias != alias and compact_alias not in canonical:
            con.execute(
                "INSERT OR IGNORE INTO science_alias(alias_norm, alias, name_norm, source_id) VALUES(?,?,?,?)",
                (compact_alias, display, target, "og_spacing_alias"),
            )

    if not args.dry_run:
        con.commit()
    stats["science_alias_after"] = con.execute("SELECT COUNT(*) FROM science_alias").fetchone()[0]
    stats["built_at"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    con.close()
    print(json.dumps(stats, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
