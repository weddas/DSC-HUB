#!/usr/bin/env python3
import sqlite3
import time
from pathlib import Path

out = Path("homeassistant/data/_hytiva_master_check.txt")
lines = []
p = Path("brain/data/dsc_brain.sqlite3")
for i in range(5):
    try:
        c = sqlite3.connect(str(p), timeout=60)
        c.execute("PRAGMA busy_timeout=60000")
        lines.append(f"ok attempt {i}")
        lines.append(f"canonical {c.execute('SELECT COUNT(*) FROM strain_canonical').fetchone()[0]}")
        lines.append(
            f"chem_h {c.execute('SELECT COUNT(*) FROM chemistry_profile WHERE source_id=?', ('hytiva',)).fetchone()[0]}"
        )
        lines.append(
            f"grow_h {c.execute('SELECT COUNT(*) FROM grow_trait WHERE source_id=?', ('hytiva',)).fetchone()[0]}"
        )
        lines.append(
            f"attr_h {c.execute('SELECT COUNT(*) FROM attribute_kv WHERE source_id=?', ('hytiva',)).fetchone()[0]}"
        )
        lines.append(f"src {c.execute('SELECT id, redistributable FROM source_record WHERE id=?', ('hytiva',)).fetchone()}")
        c.close()
        break
    except Exception as exc:  # noqa: BLE001
        lines.append(f"fail {i}: {exc}")
        time.sleep(12)
out.write_text("\n".join(lines) + "\n", encoding="utf-8")
print("wrote", out)
