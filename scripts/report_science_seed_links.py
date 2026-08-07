#!/usr/bin/env python3
"""Write science↔seed link coverage report from corpus SQLite."""

from __future__ import annotations

import argparse
import sqlite3
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DB = ROOT / "brain" / "data" / "dsc_brain.sqlite3"
OUT = ROOT / "docs" / "qa" / "CATALOG-SCIENCE-SEED-LINKS.md"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--db", type=Path, default=DEFAULT_DB)
    ap.add_argument("--out", type=Path, default=OUT)
    args = ap.parse_args()
    if not args.db.exists():
        print("missing db")
        return 1
    conn = sqlite3.connect(str(args.db), timeout=120)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA busy_timeout=120000")

    chem_n = conn.execute("SELECT COUNT(*) c FROM chemistry_profile").fetchone()["c"]
    canon_n = conn.execute("SELECT COUNT(*) c FROM strain_canonical").fetchone()["c"]
    var_n = conn.execute("SELECT COUNT(*) c FROM strain_variant").fetchone()["c"]
    link_n = conn.execute(
        "SELECT COUNT(*) c FROM entity_link WHERE from_kind='chemistry_profile'"
    ).fetchone()["c"]
    linked_chem = conn.execute(
        "SELECT COUNT(*) c FROM ("
        "  SELECT from_id FROM entity_link WHERE from_kind='chemistry_profile' GROUP BY from_id"
        ")"
    ).fetchone()["c"]
    # Avoid full-table gap scan when table is large — approximate via chem without any link.
    gaps = conn.execute(
        "SELECT COUNT(*) c FROM chemistry_profile cp "
        "WHERE NOT EXISTS ("
        "  SELECT 1 FROM entity_link el "
        "  WHERE el.from_kind='chemistry_profile' AND el.from_id=cp.id"
        ")"
    ).fetchone()["c"]

    by_method = list(
        conn.execute(
            "SELECT method, COUNT(*) c FROM entity_link "
            "WHERE from_kind='chemistry_profile' GROUP BY method ORDER BY c DESC"
        )
    )
    samples = list(
        conn.execute(
            "SELECT el.method, el.confidence, el.to_kind, el.to_id, cp.name "
            "FROM entity_link el "
            "JOIN chemistry_profile cp ON cp.id = el.from_id "
            "WHERE el.from_kind='chemistry_profile' "
            "LIMIT 25"
        )
    )

    lines = [
        "# Catalog science ↔ seed links",
        "",
        f"Generated: {time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())}",
        "",
        "Matching policy: exact `name_norm` → canonical parent; also link matching variants. "
        "Fuzzy matches are not applied unless logged with confidence < 1.0.",
        "",
        "## Coverage",
        "",
        "| Metric | Count |",
        "|---|---|",
        f"| Chemistry profiles | {chem_n} |",
        f"| Seed canonical | {canon_n} |",
        f"| Seed variants | {var_n} |",
        f"| Chem→seed edges | {link_n} |",
        f"| Distinct chem with ≥1 link | {linked_chem} |",
        f"| Chem with no seed match (gaps) | {gaps} |",
        "",
        "## By method",
        "",
        "| Method | Edges |",
        "|---|---|",
    ]
    for r in by_method:
        lines.append(f"| `{r['method']}` | {r['c']} |")
    if not by_method:
        lines.append("| _(none)_ | 0 |")

    lines += [
        "",
        "## Sample links",
        "",
        "| Chem name | → kind | → id | method | conf |",
        "|---|---|---|---|---|",
    ]
    for r in samples:
        lines.append(
            f"| {r['name'][:40]} | `{r['to_kind']}` | `{r['to_id'][:48]}` | `{r['method']}` | {r['confidence']} |"
        )
    if not samples:
        lines.append("| _(none)_ | | | | |")

    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"wrote {args.out}")
    conn.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
