#!/usr/bin/env python3
import sqlite3

c = sqlite3.connect("file:/data/dsc_brain.sqlite3?mode=ro", uri=True)
c.row_factory = sqlite3.Row
for sid in ("strain_fritz_the_cat", "amnesia_haze_auto", "fritz_the_cat"):
    rows = c.execute(
        "SELECT license_type, kind, local_path FROM media_asset WHERE entity_id=? LIMIT 5",
        (sid,),
    ).fetchall()
    print(sid, "linked", len(rows))
    for r in rows[:2]:
        print(" ", dict(r))
# any strain with CC license
rows = c.execute(
    """SELECT entity_id, license_type, kind, local_path FROM media_asset
       WHERE entity_kind='strain' AND license_type LIKE 'CC%' LIMIT 5"""
).fetchall()
print("cc_sample", len(rows))
for r in rows:
    print(" ", dict(r))
