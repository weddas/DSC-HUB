import sqlite3
c=sqlite3.connect(r"brain/data/dsc_brain.sqlite3", timeout=30)
c.execute("PRAGMA busy_timeout=30000")
for sid in ["cannabis_intelligence","alchimia","allbud","bank_weedseedsexpress","seedcity","phytochem_smith","leafly_flat","replication_labs"]:
    n=c.execute("SELECT COUNT(*) FROM chemistry_profile WHERE source_id=?", (sid,)).fetchone()[0]
    v=c.execute("SELECT COUNT(*) FROM strain_variant WHERE source_id=?", (sid,)).fetchone()[0]
    print(f"{sid}: chem={n} var={v}")
for t in ["strain_canonical","strain_variant","chemistry_profile","grow_trait","entity_link","source_record"]:
    print(f"TOTAL {t}:", c.execute(f"SELECT COUNT(*) FROM {t}").fetchone()[0])
c.close()
