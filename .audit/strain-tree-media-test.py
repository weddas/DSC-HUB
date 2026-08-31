#!/usr/bin/env python3
import json
import sqlite3
import sys

sys.path.insert(0, "/app")
import strain_tree as st

c = sqlite3.connect("file:/data/dsc_brain.sqlite3?mode=ro", uri=True)
c.row_factory = sqlite3.Row
for sid in ("strain_fritz_the_cat", "cannabis_sativa"):
    t = st.build_strain_tree(c, sid)
    if not t:
        print(sid, "NOT FOUND")
        continue
    media = (t.get("evidence") or {}).get("media") or {}
    print(sid, "media_n", media.get("n"), "filled_from", media.get("filled_from"))
    for s in (media.get("sample") or [])[:2]:
        print(" ", json.dumps(s)[:200])
