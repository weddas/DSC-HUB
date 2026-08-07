#!/usr/bin/env python3
import sqlite3
from pathlib import Path

p = Path(__file__).resolve().parents[1] / "brain" / "data" / "staging" / "allbud.sqlite3"
c = sqlite3.connect(str(p))
print("path", p)
print("size", p.stat().st_size)
print("raw", c.execute("select count(*) from raw_record").fetchone()[0])
print("canonical", c.execute("select count(*) from strain_canonical").fetchone()[0])
print("sources", c.execute("select id, redistributable, license from source_record").fetchall())
print("meta", c.execute("select key, value from meta where key like 'staging%'").fetchall())
print("attr_kv", c.execute("select count(*) from attribute_kv").fetchone()[0])
