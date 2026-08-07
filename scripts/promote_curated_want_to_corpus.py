#!/usr/bin/env python3
"""Promote curated Want bands from dsc_strain_catalog.yaml onto corpus canonical rows."""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from brain.dsc_brain.corpus import connect, name_norm, upsert_canonical  # noqa: E402
from brain.dsc_brain.paths import DATA_DIR, DEFAULT_DB  # noqa: E402

try:
    import yaml
except ImportError:
    yaml = None  # type: ignore


def main() -> int:
    if not yaml:
        print("PyYAML required")
        return 1
    path = DATA_DIR / "dsc_strain_catalog.yaml"
    if not path.exists():
        print("missing", path)
        return 1
    doc = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
    conn = connect(DEFAULT_DB)
    n = 0
    for s in doc.get("strains") or doc.get("seeds") or []:
        if not isinstance(s, dict):
            continue
        name = str(s.get("name") or s.get("id") or "").strip()
        if not name:
            continue
        want = s.get("want") if isinstance(s.get("want"), dict) else None
        chem = s.get("chem_summary") or s.get("chemistry")
        summary = {}
        if want:
            summary["want"] = want
        if isinstance(chem, dict):
            summary["chemistry"] = chem
        upsert_canonical(
            conn,
            name,
            type_=str(s.get("type") or s.get("lineage") or "") or None,
            summary=summary,
            curated=True,
        )
        n += 1
    conn.commit()
    conn.close()
    print(json.dumps({"promoted": n}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
