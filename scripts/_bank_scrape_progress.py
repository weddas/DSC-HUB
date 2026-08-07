#!/usr/bin/env python3
import json
from pathlib import Path

DATA = Path(__file__).resolve().parents[1] / "homeassistant" / "data"
for name in ["cropking", "dcseedexchange"]:
    ck = json.loads((DATA / f"dsc_strains_{name}.checkpoint.json").read_text(encoding="utf-8"))
    d = json.loads((DATA / f"dsc_strains_{name}.json").read_text(encoding="utf-8"))
    sm = json.loads((DATA / f"dsc_strains_{name}.sitemap_urls.json").read_text(encoding="utf-8"))
    done = len(ck.get("done") or [])
    dump = int(d.get("count") or 0)
    n = int(sm.get("count") or 0)
    print(f"{name}: done={done} dump={dump} sitemap={n} rem={n - dump} pct={100 * dump / n if n else 0:.1f}%")
