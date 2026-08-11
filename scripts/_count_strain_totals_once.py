#!/usr/bin/env python3
"""One-shot strain totals: master + live staging (best-effort if locked)."""
from __future__ import annotations

import json
import sqlite3
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MASTER = ROOT / "brain" / "data" / "dsc_brain.sqlite3"
STAGING = ROOT / "brain" / "data" / "staging"


def counts(path: Path, *, timeout: float = 30.0) -> dict[str, int | str]:
    try:
        con = sqlite3.connect(str(path), timeout=timeout)
        con.execute("PRAGMA query_only=ON")
        out: dict[str, int | str] = {}
        for table in (
            "strain_canonical",
            "strain_variant",
            "chemistry_profile",
            "grow_trait",
            "raw_record",
            "source_record",
        ):
            try:
                out[table] = int(con.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0])
            except sqlite3.Error as exc:
                out[table] = f"err:{exc}"
        con.close()
        return out
    except sqlite3.Error as exc:
        return {"error": str(exc)}


def main() -> int:
    report: dict = {"master_path": str(MASTER), "master": counts(MASTER, timeout=120.0)}
    live = {}
    for fam in ("seedfinder", "strain_database", "leafly_height_bands"):
        p = STAGING / f"{fam}.sqlite3"
        if not p.exists():
            live[fam] = "missing"
            continue
        live[fam] = counts(p, timeout=5.0)
    report["staging_live"] = live
    # Rough headline: unique names on master = strain_canonical
    m = report["master"]
    if isinstance(m.get("strain_canonical"), int):
        report["headline"] = {
            "unique_strain_names_master": m["strain_canonical"],
            "breeder_variants_master": m.get("strain_variant"),
            "chemistry_rows_master": m.get("chemistry_profile"),
            "grow_rows_master": m.get("grow_trait"),
            "note": (
                "Canonical ≈ deduped strain names. Variants are bank/breeder editions. "
                "SeedFinder/StrainDB staging may still be ahead of master until merge."
            ),
        }
    print(json.dumps(report, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
