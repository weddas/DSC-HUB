#!/usr/bin/env python3
"""One-shot densify baseline: counts + SF journal + height-text sample."""

from __future__ import annotations

import json
import re
import sqlite3
import time
from pathlib import Path

NUM = re.compile(r"(\d+(?:\.\d+)?)")
HEIGHT_KEYS = (
    "grow_height",
    "height",
    "height_cm",
    "plant_height",
    "plant_height_cm",
    "grow_height_cm",
)


def _looks_numeric_height(val) -> bool:
    if val in (None, "", [], {}):
        return False
    if isinstance(val, (int, float)):
        return True
    s = str(val).lower().strip()
    if s in ("short", "medium", "tall", "med", "average"):
        return False
    if not NUM.search(s):
        return False
    return any(t in s for t in ("cm", "in", "inch", "ft", "'", '"')) or bool(NUM.search(s))


def main() -> int:
    local = Path(r"C:\DSC\collation\dsc_brain.sqlite3")
    staging = Path(r"C:\DSC\collation\staging")
    nas_sf = Path(r"Y:\Digital Stealth Care\Projects\DSC-HUB\brain\data\staging\seedfinder.sqlite3")
    out = Path(r"C:\DSC\collation\_catalog_densify_baseline.json")

    con = sqlite3.connect(str(local), timeout=120)
    grow_n = con.execute("SELECT COUNT(*) FROM grow_trait").fetchone()[0]
    height_n = con.execute(
        "SELECT COUNT(*) FROM grow_trait WHERE height_cm_min IS NOT NULL"
    ).fetchone()[0]
    band_n = con.execute(
        "SELECT COUNT(*) FROM grow_trait WHERE payload_json LIKE '%height_band%'"
    ).fetchone()[0]
    obs = dict(con.execute("SELECT kind, COUNT(*) FROM observation GROUP BY 1"))
    report = {
        "built_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "master": str(local),
        "canonical": con.execute("SELECT COUNT(*) FROM strain_canonical").fetchone()[0],
        "science_alias": con.execute("SELECT COUNT(*) FROM science_alias").fetchone()[0],
        "grow_trait": grow_n,
        "height_cm_filled": height_n,
        "height_cm_pct": round(100.0 * height_n / grow_n, 2) if grow_n else 0,
        "height_band_payload_rows": band_n,
        "observation_by_kind": obs,
        "observation_total": sum(obs.values()),
        "review": con.execute("SELECT COUNT(*) FROM review").fetchone()[0],
        "subtype_of": con.execute(
            "SELECT COUNT(*) FROM entity_link WHERE method='subtype_of'"
        ).fetchone()[0],
        "parent_of": con.execute(
            "SELECT COUNT(*) FROM entity_link WHERE method='parent_of'"
        ).fetchone()[0],
        "unresolved": con.execute("SELECT COUNT(*) FROM lineage_unresolved").fetchone()[0],
    }
    con.close()

    # SF gate
    journal = Path(str(nas_sf) + "-journal")
    wal = Path(str(nas_sf) + "-wal")
    sf = {
        "staging_db": str(nas_sf),
        "exists": nas_sf.exists(),
        "size": nas_sf.stat().st_size if nas_sf.exists() else 0,
        "mtime": time.strftime("%Y-%m-%dT%H:%M:%S", time.localtime(nas_sf.stat().st_mtime))
        if nas_sf.exists()
        else None,
        "journal_exists": journal.exists(),
        "wal_exists": wal.exists(),
        "quiet": False,
        "reason": "",
    }
    if not nas_sf.exists():
        sf["reason"] = "missing_seedfinder_staging"
    elif journal.exists() or wal.exists():
        age_m = None
        marker = journal if journal.exists() else wal
        age_m = (time.time() - marker.stat().st_mtime) / 60.0
        sf["journal_or_wal_age_min"] = round(age_m, 1)
        sf["quiet"] = False
        sf["reason"] = "journal_or_wal_present"
    else:
        age_m = (time.time() - nas_sf.stat().st_mtime) / 60.0
        sf["db_age_min"] = round(age_m, 1)
        sf["quiet"] = age_m >= 15
        sf["reason"] = "idle_ok" if sf["quiet"] else "recently_written"
    report["seedfinder"] = sf

    # Staging height-text sample (local staging only; cap files)
    families = []
    if staging.exists():
        for path in sorted(staging.glob("*.sqlite3"))[:80]:
            try:
                s = sqlite3.connect(f"file:{path}?mode=ro", uri=True)
            except sqlite3.Error:
                continue
            try:
                n_raw = s.execute("SELECT COUNT(*) FROM raw_record").fetchone()[0]
            except sqlite3.Error:
                s.close()
                continue
            numeric_hits = 0
            sampled = 0
            for (blob,) in s.execute(
                "SELECT payload_json FROM raw_record LIMIT 400"
            ):
                sampled += 1
                try:
                    p = json.loads(blob or "{}")
                except json.JSONDecodeError:
                    continue
                if not isinstance(p, dict):
                    continue
                for k in HEIGHT_KEYS:
                    if _looks_numeric_height(p.get(k)):
                        numeric_hits += 1
                        break
                    nested = p.get("grow")
                    if isinstance(nested, dict) and _looks_numeric_height(nested.get(k)):
                        numeric_hits += 1
                        break
            s.close()
            if numeric_hits:
                families.append(
                    {
                        "file": path.name,
                        "raw": n_raw,
                        "sample": sampled,
                        "numeric_height_hits": numeric_hits,
                    }
                )
    report["staging_numeric_height_families"] = families
    report["local_staging_files"] = (
        len(list(staging.glob("*.sqlite3"))) if staging.exists() else 0
    )

    out.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(json.dumps(report, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
