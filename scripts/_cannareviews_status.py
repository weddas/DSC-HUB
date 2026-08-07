#!/usr/bin/env python3
import json
import sqlite3
from pathlib import Path

DATA = Path("homeassistant/data")
for n in [
    "dsc_products_cannareviews.json",
    "dsc_reviews_cannareviews.json",
    "dsc_brands_cannareviews.json",
    "dsc_pharmacies_cannareviews.json",
    "dsc_cannareviews_report.json",
]:
    p = DATA / n
    if not p.exists():
        print("missing", n)
        continue
    d = json.loads(p.read_text(encoding="utf-8"))
    print(n, "count", d.get("count"), "bytes", p.stat().st_size)

db = Path("brain/data/staging/cannareviews.sqlite3")
print("staging exists", db.exists(), "size", db.stat().st_size if db.exists() else 0)
if db.exists():
    c = sqlite3.connect(str(db))
    for t in ("chemistry_profile", "raw_record", "source_record"):
        try:
            print(t, c.execute(f"select count(*) from {t}").fetchone()[0])
        except Exception as e:
            print(t, e)
    c.close()
