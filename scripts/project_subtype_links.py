#!/usr/bin/env python3
"""Link genetic subtypes to base strains via entity_link.method=subtype_of.

Keeps full name identity. Parses markers (f2/f3/bx/cut/auto/og/pheno/#N) for
metadata only — never strips them from name_norm for matching.

Usage:
  python scripts/project_subtype_links.py --db C:\\DSC\\collation\\dsc_brain.sqlite3 --dry-run
  python scripts/project_subtype_links.py --db C:\\DSC\\collation\\dsc_brain.sqlite3
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import time
import uuid
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from brain.dsc_brain.corpus import add_link, connect, name_norm  # noqa: E402

# Trailing / token markers that suggest a subtype of a shorter base name.
# Order matters: try longer patterns first.
MARKER_PATTERNS: list[tuple[str, re.Pattern[str]]] = [
    ("automatic", re.compile(r"^(?P<base>.+?)\s+automatic$", re.I)),
    ("auto_prefix", re.compile(r"^auto\s+(?P<base>.+)$", re.I)),
    ("auto_suffix", re.compile(r"^(?P<base>.+?)\s+auto(?:s|flower(?:ing)?)?$", re.I)),
    ("f5", re.compile(r"^(?P<base>.+?)\s+f5\b.*$", re.I)),
    ("f4", re.compile(r"^(?P<base>.+?)\s+f4\b.*$", re.I)),
    ("f3", re.compile(r"^(?P<base>.+?)\s+f3\b.*$", re.I)),
    ("f2", re.compile(r"^(?P<base>.+?)\s+f2\b.*$", re.I)),
    ("bx", re.compile(r"^(?P<base>.+?)\s+bx\d*\b.*$", re.I)),
    ("cut", re.compile(r"^(?P<base>.+?)\s+cut$", re.I)),
    ("pheno", re.compile(r"^(?P<base>.+?)\s+pheno(?:type)?\b.*$", re.I)),
    ("numbered", re.compile(r"^(?P<base>.+?)\s+#?\d{1,3}$", re.I)),
]


def parse_subtype(full_norm: str) -> tuple[str, list[str]] | None:
    """Return (base_norm, markers) if full looks like subtype of a shorter base."""
    text = (full_norm or "").strip()
    if not text or len(text) < 4:
        return None
    for marker, pat in MARKER_PATTERNS:
        m = pat.match(text)
        if not m:
            continue
        base = name_norm(m.group("base") or "")
        if not base or base == text or len(base) < 3:
            continue
        # avoid linking when base is only a marker word
        if base in {"auto", "automatic", "cut", "pheno", "og", "f2", "f3", "bx"}:
            continue
        return base, ["auto" if marker.startswith("auto") else marker]
    return None


def ensure_canonical(con, name_key: str, display: str | None = None) -> None:
    exists = con.execute(
        "SELECT 1 FROM strain_canonical WHERE name_norm=? LIMIT 1", (name_key,)
    ).fetchone()
    if exists:
        return
    con.execute(
        "INSERT OR IGNORE INTO strain_canonical(name_norm, name, type, summary_json, curated, updated_at) "
        "VALUES(?,?,?,?,?,?)",
        (
            name_key,
            display or name_key.title(),
            None,
            "{}",
            0,
            time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        ),
    )


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--db", type=Path, required=True)
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--limit", type=int, default=0)
    args = ap.parse_args(argv)

    con = connect(args.db)
    canonical = {r[0] for r in con.execute("SELECT name_norm FROM strain_canonical")}
    # alias_norm -> unique name_norm
    alias_map: dict[str, set[str]] = {}
    for a, n in con.execute(
        "SELECT alias_norm, name_norm FROM science_alias WHERE name_norm IS NOT NULL"
    ):
        alias_map.setdefault(a, set()).add(n)

    existing = {
        (r[0], r[1])
        for r in con.execute(
            "SELECT from_id, to_id FROM entity_link WHERE method='subtype_of'"
        )
    }

    stats = {
        "scanned": 0,
        "candidates": 0,
        "linked": 0,
        "skipped_existing": 0,
        "base_missing": 0,
        "canonical_created": 0,
        "dry_run": args.dry_run,
        "samples": [],
    }

    # Scan canonical names + distinct name_literal parents that look like subtypes
    names: list[tuple[str, str]] = [
        (r[0], r[1] or r[0])
        for r in con.execute("SELECT name_norm, name FROM strain_canonical")
    ]
    for (raw,) in con.execute(
        "SELECT DISTINCT from_id FROM entity_link WHERE method='parent_of' AND from_kind='name_literal'"
    ):
        names.append((name_norm(raw), raw))

    seen_full: set[str] = set()
    for full_key, display in names:
        if not full_key or full_key in seen_full:
            continue
        seen_full.add(full_key)
        stats["scanned"] += 1
        if args.limit and stats["candidates"] >= args.limit:
            break
        parsed = parse_subtype(full_key)
        if not parsed:
            continue
        base_key, markers = parsed
        stats["candidates"] += 1

        # resolve base
        target = None
        if base_key in canonical:
            target = base_key
        else:
            hits = alias_map.get(base_key) or set()
            if len(hits) == 1:
                target = next(iter(hits))
        if not target:
            stats["base_missing"] += 1
            if not args.dry_run:
                con.execute(
                    "INSERT INTO followup_gap(entity_kind, entity_id, field, reason, created_at) "
                    "VALUES(?,?,?,?,?)",
                    (
                        "strain_canonical",
                        full_key,
                        "subtype_base",
                        "subtype_base_missing",
                        time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                    ),
                )
            continue

        if (full_key, target) in existing:
            stats["skipped_existing"] += 1
            continue

        if len(stats["samples"]) < 25:
            stats["samples"].append(
                {"full": full_key, "base": target, "markers": markers, "display": display}
            )

        if args.dry_run:
            stats["linked"] += 1
            existing.add((full_key, target))
            continue

        if full_key not in canonical:
            ensure_canonical(con, full_key, display)
            canonical.add(full_key)
            stats["canonical_created"] += 1

        add_link(
            con,
            "strain_canonical",
            full_key,
            "strain_canonical",
            target,
            method="subtype_of",
            confidence=1.0,
            source=f"subtype:{','.join(markers)}",
        )
        existing.add((full_key, target))
        stats["linked"] += 1
        if stats["linked"] % 500 == 0:
            con.commit()
            print(f"  checkpoint linked={stats['linked']}")

    if not args.dry_run:
        con.commit()
    stats["subtype_of_after"] = con.execute(
        "SELECT COUNT(*) FROM entity_link WHERE method='subtype_of'"
    ).fetchone()[0]
    stats["built_at"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    con.close()
    print(json.dumps(stats, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
