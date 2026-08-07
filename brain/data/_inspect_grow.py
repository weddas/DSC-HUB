import sqlite3
from pathlib import Path

p = Path(r"y:\Digital Stealth Care\Projects\DSC-HUB\brain\data\staging\seedcity.sqlite3")
c = sqlite3.connect(f"file:{p}?mode=ro", uri=True)
print("tables", [r[0] for r in c.execute("SELECT name FROM sqlite_master WHERE type='table'")])
print("grow_trait cols", list(c.execute("PRAGMA table_info(grow_trait)")))
print("sample", c.execute("SELECT * FROM grow_trait LIMIT 5").fetchall())
c.close()

p2 = Path(r"y:\Digital Stealth Care\Projects\DSC-HUB\brain\data\staging\leafly_flat_enrich.sqlite3")
c2 = sqlite3.connect(f"file:{p2}?mode=ro", uri=True)
import json
row = c2.execute("SELECT payload_json FROM raw_record LIMIT 1").fetchone()
if not row:
    cols = [r[1] for r in c2.execute("PRAGMA table_info(raw_record)")]
    print("raw cols", cols)
    # try alternate
    for col in cols:
        if "json" in col or "payload" in col or "raw" in col:
            row = c2.execute(f"SELECT [{col}] FROM raw_record LIMIT 1").fetchone()
            print("using", col)
            break
obj = json.loads(row[0]) if row else {}
print("leafly keys sample", sorted(obj.keys())[:80] if isinstance(obj, dict) else type(obj))
# show height/flower/parentish
if isinstance(obj, dict):
    for k, v in obj.items():
        kl = k.lower()
        if any(x in kl for x in ("height", "flower", "parent", "lineage", "effect", "terp", "grow")):
            print(f"  {k}={str(v)[:120]}")
c2.close()
