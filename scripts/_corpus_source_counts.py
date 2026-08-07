#!/usr/bin/env python3
import sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DB = ROOT / "brain" / "data" / "dsc_brain.sqlite3"
c = sqlite3.connect(f"file:{DB.as_posix()}?mode=ro", uri=True, timeout=30)
print("canonical", c.execute("SELECT COUNT(*) FROM strain_canonical").fetchone()[0])
print("chem", c.execute("SELECT COUNT(*) FROM chemistry_profile").fetchone()[0])
print("links", c.execute("SELECT COUNT(*) FROM entity_link").fetchone()[0])
for sid in ("cannaconnection", "hytiva", "cropking", "zamnesia", "seedsupreme", "cropking_dir"):
    n = c.execute("SELECT COUNT(*) FROM strain_variant WHERE source_id=?", (sid,)).fetchone()[0]
    a = c.execute("SELECT COUNT(*) FROM attribute_kv WHERE source_id=?", (sid,)).fetchone()[0]
    print(f"{sid}: variants={n} attrs={a}")
c.close()
