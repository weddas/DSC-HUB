"""Resume thin expand: grow backfill + discovery only (dumps already staged)."""
import importlib.util
from pathlib import Path

p = Path(r"y:\Digital Stealth Care\Projects\DSC-HUB\brain\data\_thin_expand_pass.py")
spec = importlib.util.spec_from_file_location("thin_expand", p)
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)
grow = m.backfill_leafly_grow()
discovered = m.try_fetch_new_datasets()
import json
out = Path(r"y:\Digital Stealth Care\Projects\DSC-HUB\brain\data\_thin_expand_result.json")
prev = {}
if out.exists():
    try:
        prev = json.loads(out.read_text(encoding="utf-8"))
    except Exception:
        prev = {}
prev["leafly_grow_backfill"] = grow
prev["discovered"] = discovered
out.write_text(json.dumps(prev, indent=2, default=str), encoding="utf-8")
print("done", grow)
