#!/usr/bin/env python3
"""Summarize forum scrape dumps + staging."""

from __future__ import annotations

import json
import sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main() -> None:
    for key in ("420mag", "phenohunter", "mjpassion"):
        p = ROOT / "homeassistant" / "data" / f"dsc_forum_{key}.json"
        d = json.loads(p.read_text(encoding="utf-8"))
        items = d.get("items") or []
        with_flower = sum(1 for i in items if i.get("flowering_days") is not None)
        with_height = sum(1 for i in items if i.get("height_cm") is not None)
        with_notes = sum(1 for i in items if i.get("grow_notes"))
        chemish = sum(
            1
            for i in items
            if i.get("chemistry") or i.get("thc_range") or i.get("cbd_range")
        )
        norms = len({i.get("name_norm") for i in items if i.get("name_norm")})
        print(
            f"{key}: count={d.get('count')} unique_name_norm={norms} "
            f"notes={with_notes} flower={with_flower} height={with_height} "
            f"chem_fields={chemish} blockers={len(d.get('blockers') or [])}"
        )
        for i in items[:3]:
            print(f"  sample: {i.get('name')!r}")
            print(f"    {i.get('url')}")
        db = ROOT / "brain" / "data" / "staging" / f"forum_{key}.sqlite3"
        if not db.exists():
            print("  staging MISSING")
            continue
        con = sqlite3.connect(db)
        counts = {}
        for t in ("strain_canonical", "grow_trait", "raw_record", "chemistry_profile"):
            try:
                counts[t] = con.execute(f"SELECT COUNT(*) FROM {t}").fetchone()[0]
            except sqlite3.Error:
                counts[t] = "missing"
        con.close()
        print(f"  staging {counts} size_mb={db.stat().st_size / 1e6:.2f}")


if __name__ == "__main__":
    main()
