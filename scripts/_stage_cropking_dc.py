#!/usr/bin/env python3
import json
from pathlib import Path

from brain.dsc_brain.staging import write_dump_to_staging

DATA = Path(__file__).resolve().parents[1] / "homeassistant" / "data"
ST = Path(__file__).resolve().parents[1] / "brain" / "data" / "staging"

for bank in ["cropking", "dcseedexchange"]:
    dump = DATA / f"dsc_strains_{bank}.json"
    doc = json.loads(dump.read_text(encoding="utf-8"))
    items = doc.get("items") or []
    with_chem = sum(1 for i in items if i.get("chemistry") or i.get("thc_range") or i.get("thc"))
    with_grow = sum(
        1
        for i in items
        if i.get("flowering_days") or i.get("yield_indoor") or i.get("flowering_time")
    )
    with_gen = sum(1 for i in items if i.get("genetics") or i.get("lineage"))
    print(f"=== {bank} dump ===")
    print(
        f"  count={doc.get('count')} items={len(items)} "
        f"redistributable={doc.get('redistributable')}"
    )
    print(f"  chem={with_chem} grow={with_grow} genetics={with_gen}")
    st = write_dump_to_staging(dump, source_id=bank, reset=True)
    print(f"  staged family={st['family']} count={st['count']}")
    stats = st.get("stats") or {}
    print(
        f"  raw={stats.get('raw_record')} canon={stats.get('strain_canonical')} "
        f"grow={stats.get('grow_trait')} chem={stats.get('chemistry_profile')}"
    )
    p = ST / f"{bank}.sqlite3"
    print(f"  db_bytes={p.stat().st_size if p.exists() else 0}")
