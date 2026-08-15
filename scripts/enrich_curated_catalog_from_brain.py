#!/usr/bin/env python3
"""Enrich curated dsc_strain_catalog.yaml with height_cm / flowering_days from brain.

Exact name_norm match only. Never invents Want climate bands.
Leaves existing curated want blocks untouched.

Usage:
  python scripts/enrich_curated_catalog_from_brain.py
  python scripts/enrich_curated_catalog_from_brain.py --db path/to/dsc_brain.sqlite3
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

try:
    import yaml
except ImportError as exc:
    raise SystemExit("PyYAML required") from exc

ROOT = Path(__file__).resolve().parents[1]
CANNALIB = ROOT.parent / "CannaLib"
sys.path.insert(0, str(CANNALIB))

from brain.dsc_brain.corpus import connect, name_norm  # noqa: E402
from brain.dsc_brain.paths import DEFAULT_DB as CANNALIB_DB  # noqa: E402

SOURCE = ROOT / "homeassistant" / "data" / "dsc_strain_catalog.yaml"


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--db", type=Path, default=CANNALIB_DB)
    ap.add_argument("--catalog", type=Path, default=SOURCE)
    args = ap.parse_args()

    doc = yaml.safe_load(args.catalog.read_text(encoding="utf-8")) or {}
    seeds = doc.get("seeds") or doc.get("strains") or []
    con = connect(args.db)
    stats = {"seeds": 0, "height": 0, "flowering": 0, "band": 0, "chem": 0}

    for row in seeds:
        if not isinstance(row, dict):
            continue
        stats["seeds"] += 1
        name = str(row.get("name") or "").strip()
        key = name_norm(name)
        if not key or key.startswith("generic"):
            continue
        grow = con.execute(
            "SELECT height_cm_min, height_cm_max, flowering_days_min, flowering_days_max, payload_json "
            "FROM grow_trait WHERE name_norm=? ORDER BY "
            "(height_cm_min IS NOT NULL) DESC, (flowering_days_min IS NOT NULL) DESC LIMIT 1",
            (key,),
        ).fetchone()
        if grow:
            h0, h1, f0, f1, blob = grow
            if h0 is not None and row.get("height_cm") in (None, "", [], {}):
                row["height_cm"] = [h0, h1] if h1 is not None and h1 != h0 else h0
                stats["height"] += 1
            if f0 is not None and row.get("flowering_days") in (None, "", [], {}):
                row["flowering_days"] = (
                    [int(f0), int(f1)] if f1 is not None and f1 != f0 else int(f0)
                )
                stats["flowering"] += 1
            try:
                payload = json.loads(blob or "{}")
            except json.JSONDecodeError:
                payload = {}
            if isinstance(payload, dict):
                band = payload.get("height_band")
                if isinstance(band, str) and band.strip() and not row.get("height_band"):
                    row["height_band"] = band.strip()
                    stats["band"] += 1
        chem = con.execute(
            "SELECT thc_min, thc_max, cbd_min, cbd_max, top_terpenes_json "
            "FROM chemistry_profile WHERE name_norm=? AND thc_min IS NOT NULL "
            "ORDER BY (top_terpenes_json IS NOT NULL) DESC LIMIT 1",
            (key,),
        ).fetchone()
        if chem and not row.get("chem_summary") and not row.get("chemistry"):
            th0, th1, cb0, cb1, tops = chem
            summary: dict = {}
            if th0 is not None:
                summary["thc_range"] = [th0, th1 if th1 is not None else th0]
            if cb0 is not None:
                summary["cbd_range"] = [cb0, cb1 if cb1 is not None else cb0]
            if tops:
                try:
                    t = json.loads(tops)
                    if isinstance(t, list) and t:
                        summary["top_terpenes"] = t[:3]
                except json.JSONDecodeError:
                    pass
            if summary:
                row["chem_summary"] = summary
                stats["chem"] += 1

    con.close()
    args.catalog.write_text(
        yaml.safe_dump(doc, sort_keys=False, allow_unicode=True),
        encoding="utf-8",
    )
    print(json.dumps({"catalog": str(args.catalog), **stats}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
