import sqlite3
con = sqlite3.connect("brain/data/dsc_brain.sqlite3", timeout=90)
con.execute("PRAGMA busy_timeout=90000")
print("variant cols", [c[1] for c in con.execute("PRAGMA table_info(strain_variant)").fetchall()])
queries = [
    "SELECT COUNT(*) FROM strain_variant WHERE source_id='northatlantic'",
    "SELECT COUNT(*) FROM grow_trait WHERE source_id='northatlantic'",
    "SELECT COUNT(*) FROM chemistry_profile WHERE source_id='northatlantic'",
    "SELECT source_id, COUNT(*) c FROM strain_variant WHERE source_id LIKE '%atlantic%' GROUP BY source_id",
    "SELECT source_id, COUNT(*) c FROM grow_trait WHERE source_id LIKE '%atlantic%' GROUP BY source_id",
]
for q in queries:
    try:
        print(q, "=>", con.execute(q).fetchone() if "GROUP BY" not in q else con.execute(q).fetchall())
    except Exception as e:
        print(q, "ERR", e)
# staging expected
s = sqlite3.connect("brain/data/staging/north_atlantic.sqlite3")
print("staging NA canonical", s.execute("SELECT COUNT(*) FROM strain_canonical").fetchone()[0])
print("staging NA source", s.execute("SELECT * FROM source_record").fetchall())
s.close()
con.close()
