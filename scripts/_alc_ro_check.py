import sqlite3
p = r"brain/data/dsc_brain.sqlite3"
c = sqlite3.connect(f"file:{p}?mode=ro", uri=True, timeout=30)
checks = [
    ("source_record", "SELECT COUNT(*) FROM source_record WHERE lower(COALESCE(source_id,'')) LIKE '%alchimia%'"),
    ("chem", "SELECT COUNT(*) FROM chemistry_profile WHERE lower(COALESCE(source_id,'')) LIKE '%alchimia%'"),
    ("variant", "SELECT COUNT(*) FROM strain_variant WHERE lower(COALESCE(source_id,'')) LIKE '%alchimia%'"),
    ("links", "SELECT COUNT(*) FROM entity_link WHERE lower(COALESCE(source_id,'')) LIKE '%alchimia%'"),
    ("grow", "SELECT COUNT(*) FROM grow_trait WHERE lower(COALESCE(source_id,'')) LIKE '%alchimia%'"),
]
for name, sql in checks:
    try:
        print(name, c.execute(sql).fetchone()[0])
    except Exception as e:
        print(name, "ERR", e)
c.close()
