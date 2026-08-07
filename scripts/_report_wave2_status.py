#!/usr/bin/env python3
"""Wave 2 dump/staging status report."""
from __future__ import annotations

import json
import sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "homeassistant" / "data"
ST = ROOT / "brain" / "data" / "staging"

NEW = [
    ("fastbuds", "bank_fastbuds"),
    ("barneys", "bank_barneys"),
    ("greenhouse", "bank_greenhouse"),
    ("mephisto", "bank_mephisto"),
    ("dna", "bank_dna"),
    ("dutchpassion", "bank_dutchpassion"),
]

SIBLING = [
    "herbies",
    "ilgm",
    "rqs",
    "zamnesia",
    "seedsupreme",
    "cropking",
    "dcseedexchange",
    "pacific",
    "truenorth",
    "seedfinder",
    "allbud",
    "cannaconnection",
    "alchimia",
    "seedsman",
    "multiverse",
    "weedseedsexpress",
    "hytiva",
]


def dump_n(bank: str) -> int | None:
    p = DATA / f"dsc_strains_{bank}.json"
    if not p.exists():
        return None
    d = json.loads(p.read_text(encoding="utf-8"))
    items = d.get("items")
    if items is None:
        items = d.get("rows") or []
    return len(items) if isinstance(items, list) else None


def staging_stats(fam: str) -> dict:
    sp = ST / f"{fam}.sqlite3"
    if not sp.exists():
        return {"exists": False}
    con = sqlite3.connect(str(sp), timeout=30)
    out: dict = {"exists": True, "mb": round(sp.stat().st_size / 1e6, 1)}
    for table, key in (
        ("raw_record", "raw"),
        ("strain_canonical", "canon"),
        ("grow_trait", "grow"),
        ("chemistry_profile", "chem"),
        ("attribute_kv", "kv"),
    ):
        try:
            out[key] = con.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]
        except sqlite3.Error:
            out[key] = None
    con.close()
    return out


def main() -> None:
    print("=== WAVE 2 NEW BANKS (this agent; dump+staging only) ===")
    total = 0
    for bank, fam in NEW:
        n = dump_n(bank)
        st = staging_stats(fam)
        total += n or 0
        print(
            f"{bank}: dump={n} staging={fam}.sqlite3 "
            f"raw={st.get('raw')} canon={st.get('canon')} grow={st.get('grow')} "
            f"chem={st.get('chem')} kv={st.get('kv')} mb={st.get('mb')}"
        )
    print(f"TOTAL new dump items: {total}")
    print()
    print("=== WAVE B sibling / prior dumps (progress snapshot) ===")
    for bank in SIBLING:
        n = dump_n(bank)
        print(f"{bank}: n={n}")


if __name__ == "__main__":
    main()
