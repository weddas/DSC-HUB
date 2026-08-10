#!/usr/bin/env python3
"""Remove merch/SKU noise from science_alias harvested via bank_slug_alias:*.

Keeps real seed-name slug aliases. Deletes alias rows whose alias_norm or target
looks like cartridges, prerolls, batteries, hashole merch, etc.

Usage:
  python scripts/clean_merch_aliases.py --db C:\\DSC\\collation\\dsc_brain.sqlite3 --dry-run
  python scripts/clean_merch_aliases.py --db C:\\DSC\\collation\\dsc_brain.sqlite3
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

from brain.dsc_brain.corpus import connect  # noqa: E402

MERCH_RE = re.compile(
    r"\b("
    r"cartridge|battery|threaded|preroll|pre roll|pre-roll|hashole|hashhole|"
    r"thcp|gummy|donut flame|care package|510\b|\b\d+g\b|2x2|"
    r"disposable|vape|wax pen|dab|concentrate cart|flame hashole|"
    r"premium thcp|hashole|hashhole|"
    r"page \d+|post \d+"
    r")\b",
    re.I,
)


def is_merch(alias_norm: str, alias: str, name_norm: str) -> bool:
    blob = f"{alias_norm} {alias} {name_norm}"
    if re.match(r"^(page|post)\s+\d+$", alias_norm or "", re.I):
        return True
    return bool(MERCH_RE.search(blob))


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--db", type=Path, required=True)
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument(
        "--source-prefix",
        default="bank_slug_alias:",
        help="Only touch aliases from this source_id prefix",
    )
    args = ap.parse_args(argv)

    con = connect(args.db)
    rows = list(
        con.execute(
            "SELECT alias_norm, alias, name_norm, source_id FROM science_alias "
            "WHERE source_id LIKE ?",
            (args.source_prefix + "%",),
        )
    )
    to_delete: list[str] = []
    samples: list[dict] = []
    for alias_norm, alias, name_norm, source_id in rows:
        if is_merch(alias_norm or "", alias or "", name_norm or ""):
            to_delete.append(alias_norm)
            if len(samples) < 20:
                samples.append(
                    {
                        "alias_norm": alias_norm,
                        "name_norm": name_norm,
                        "source_id": source_id,
                    }
                )

    if not args.dry_run and to_delete:
        con.executemany(
            "DELETE FROM science_alias WHERE alias_norm=?",
            [(a,) for a in to_delete],
        )
        con.commit()

    after = con.execute("SELECT COUNT(*) FROM science_alias").fetchone()[0]
    bank_slug = con.execute(
        "SELECT COUNT(*) FROM science_alias WHERE source_id LIKE ?",
        (args.source_prefix + "%",),
    ).fetchone()[0]
    con.close()
    print(
        json.dumps(
            {
                "scanned_bank_slug": len(rows),
                "deleted_merch": len(to_delete),
                "science_alias_after": after,
                "bank_slug_remaining": bank_slug,
                "samples": samples,
                "dry_run": args.dry_run,
                "built_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            },
            indent=2,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
