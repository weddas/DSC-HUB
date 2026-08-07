#!/usr/bin/env python3
"""Write expand report from staging + dumps (no commit)."""
from __future__ import annotations

import json
import sqlite3
import time
from pathlib import Path

ROOT = Path(r"y:\Digital Stealth Care\Projects\DSC-HUB")
DATA = ROOT / "homeassistant" / "data"
STG = ROOT / "brain" / "data" / "staging" / "cannlytics_expand.sqlite3"
MASTER = ROOT / "brain" / "data" / "dsc_brain.sqlite3"

DUMP_META = {
    "ny": {"note": "named COAs"},
    "ri": {"note": "no strain_name/product_name columns (METRC labels only)"},
    "ut": {"note": "named COAs"},
    "mi": {"note": "named COAs"},
    "hi": {"note": "named COAs"},
    "ma": {"note": "named COAs"},
    "or": {"note": "no strain/product name columns"},
    "nv": {"note": "product_name heavy; terpene profiles"},
    "fl": {"note": "sparse names vs CSV size"},
    "ca": {"note": "CSV cached; JSON dump skipped (SMB); staging partial if interrupted"},
}


def dump_stats() -> dict:
    out = {}
    for p in sorted(DATA.glob("dsc_lab_terpenes_cannlytics_*.json")):
        st = p.name.replace("dsc_lab_terpenes_cannlytics_", "").replace(".json", "")
        if st in {"expand", "expand_report"}:
            continue
        meta = {"bytes": p.stat().st_size, "path": str(p)}
        try:
            with p.open("rb") as fh:
                fh.seek(max(0, p.stat().st_size - 200))
                end = fh.read().decode("utf-8", errors="replace")
            import re

            m = re.search(r'"count"\s*:\s*(\d+)', end)
            if m:
                meta["count"] = int(m.group(1))
        except OSError:
            pass
        meta.update(DUMP_META.get(st, {}))
        out[st] = meta
    return out


def main() -> None:
    s = sqlite3.connect(str(STG), timeout=120)
    staging = {
        "chem": s.execute("SELECT COUNT(*) FROM chemistry_profile").fetchone()[0],
        "unique": s.execute(
            "SELECT COUNT(DISTINCT name_norm) FROM chemistry_profile "
            "WHERE name_norm IS NOT NULL AND name_norm!=''"
        ).fetchone()[0],
        "canon": s.execute("SELECT COUNT(*) FROM strain_canonical").fetchone()[0],
        "links": s.execute("SELECT COUNT(*) FROM entity_link").fetchone()[0],
        "attr_kv": s.execute("SELECT COUNT(*) FROM attribute_kv").fetchone()[0],
    }
    s.close()

    master = {}
    try:
        m = sqlite3.connect(f"file:{MASTER.as_posix()}?mode=ro", uri=True, timeout=30)
        master = {
            "chem_total": m.execute("SELECT COUNT(*) FROM chemistry_profile").fetchone()[0],
            "cannlytics": m.execute(
                "SELECT COUNT(*) FROM chemistry_profile WHERE source_id='cannlytics'"
            ).fetchone()[0],
            "cannlytics_expand": m.execute(
                "SELECT COUNT(*) FROM chemistry_profile WHERE source_id='cannlytics_expand'"
            ).fetchone()[0],
            "expand_unique": m.execute(
                "SELECT COUNT(DISTINCT name_norm) FROM chemistry_profile "
                "WHERE source_id='cannlytics_expand'"
            ).fetchone()[0],
            "expand_attr_kv": m.execute(
                "SELECT COUNT(*) FROM attribute_kv WHERE source_id='cannlytics_expand'"
            ).fetchone()[0],
        }
        m.close()
    except Exception as exc:  # noqa: BLE001
        master = {"error": str(exc)}

    report = {
        "built_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "source_id": "cannlytics_expand",
        "license": "CC-BY-4.0",
        "redistributable": True,
        "states_csv_ok": ["ny", "ri", "ut", "mi", "hi", "ma", "or", "nv", "fl", "ca"],
        "states_skip_404_xlsx_only": ["wa", "ct", "co"],
        "states_no_strain_names": ["ri", "or"],
        "dumps": dump_stats(),
        "staging": staging,
        "master": master,
        "notes": [
            "Dumps keep full COA columns where written.",
            "Staging/master payload keeps chem+meta; pesticide panels stay in dumps/CSV (no attribute_kv).",
            "Unique-first staging maximizes strain_name coverage under NAS SQLite pressure.",
            "CA: 1.5GB CSV cached; full JSON dump skipped (SMB Errno 22); staging may be partial if interrupted.",
            "MD sample (source cannlytics, 30k) left as prior corpus; expand is separate source_id.",
        ],
    }
    out = DATA / "dsc_lab_terpenes_cannlytics_expand_report.json"
    out.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
