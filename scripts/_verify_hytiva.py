#!/usr/bin/env python3
"""Verify Hytiva dump / staging / master counts."""
from __future__ import annotations

import json
import sqlite3
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from brain.dsc_brain.paths import DEFAULT_DB, staging_db_path  # noqa: E402

DUMP = ROOT / "homeassistant" / "data" / "dsc_strains_hytiva.json"
CK = ROOT / "homeassistant" / "data" / "dsc_strains_hytiva.checkpoint.json"


def main() -> None:
    dump = json.loads(DUMP.read_text(encoding="utf-8"))
    ck = json.loads(CK.read_text(encoding="utf-8")) if CK.exists() else {}
    print(
        "DUMP",
        dump.get("count"),
        "redist=",
        dump.get("redistributable"),
        "target=",
        dump.get("staging_target"),
    )
    print("CKPT", len(ck.get("done") or []), "errs", len(ck.get("errors") or []))
    for e in (ck.get("errors") or [])[-5:]:
        print("  err", e)

    sp = staging_db_path("hytiva")
    print("STAGING", sp, "exists", sp.exists(), "bytes", sp.stat().st_size if sp.exists() else 0)
    s = sqlite3.connect(str(sp), timeout=60)
    s.row_factory = sqlite3.Row
    for t in (
        "source_record",
        "strain_canonical",
        "chemistry_profile",
        "grow_trait",
        "raw_record",
        "attribute_kv",
        "entity_link",
    ):
        print(" staging", t, s.execute(f"SELECT COUNT(*) AS c FROM {t}").fetchone()["c"])
    src = s.execute("SELECT id, redistributable, note FROM source_record WHERE id='hytiva'").fetchone()
    print(" staging source", dict(src) if src else None)
    raw = s.execute("SELECT payload_json FROM raw_record LIMIT 1").fetchone()
    if raw:
        print(" raw keys sample", sorted(json.loads(raw[0]).keys())[:18])
    s.close()

    m = sqlite3.connect(str(DEFAULT_DB), timeout=120)
    m.row_factory = sqlite3.Row
    print("MASTER", DEFAULT_DB)
    print(" master canonical", m.execute("SELECT COUNT(*) AS c FROM strain_canonical").fetchone()["c"])
    for q, label in [
        ("SELECT COUNT(*) AS c FROM chemistry_profile WHERE source_id='hytiva'", "chem_hytiva"),
        ("SELECT COUNT(*) AS c FROM grow_trait WHERE source_id='hytiva'", "grow_hytiva"),
        ("SELECT COUNT(*) AS c FROM attribute_kv WHERE source_id='hytiva'", "attr_hytiva"),
        ("SELECT COUNT(*) AS c FROM source_record WHERE id='hytiva'", "source_row"),
    ]:
        print(" ", label, m.execute(q).fetchone()["c"])
    row = m.execute(
        "SELECT id, redistributable, license FROM source_record WHERE id='hytiva'"
    ).fetchone()
    print(" master source", dict(row) if row else None)
    # raw should stay in staging by default
    try:
        print(
            " master raw_hytiva",
            m.execute("SELECT COUNT(*) AS c FROM raw_record WHERE source_id='hytiva'").fetchone()["c"],
        )
    except sqlite3.Error as exc:
        print(" master raw_hytiva", exc)
    m.close()

    # field coverage on dump
    items = dump.get("items") or []
    n = len(items) or 1
    for field in ("chemistry", "thc_range", "effects", "flavors", "lineage", "faq", "description"):
        hit = sum(1 for i in items if i.get(field) not in (None, "", [], {}))
        print(f" coverage {field}: {hit}/{len(items)} ({100*hit/n:.1f}%)")


if __name__ == "__main__":
    main()
