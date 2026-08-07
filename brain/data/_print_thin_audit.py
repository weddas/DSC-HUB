"""Print grow keys from thin audit."""
import json
from pathlib import Path

r = json.loads(Path(__file__).with_name("_thin_field_audit.json").read_text())
print("GROW KEYS GLOBAL:")
for k, v in sorted(r["grow_key_global"].items(), key=lambda x: -x[1]):
    print(f"  {k}: {v} families")
print()
print("FAMILIES WITH GROW:")
for e in r["families"]:
    if e.get("grow"):
        print(f"{e['file']:40} grow={e['grow']:6} keys={e.get('grow_keys')}")
print()
print("ALL FAMILIES CHEM/GROW:")
for e in sorted(r["families"], key=lambda x: x.get("raw") or 0, reverse=True):
    print(
        f"{e['file']:40} raw={e.get('raw',0):6} chem={e.get('chem',0):6} "
        f"grow={e.get('grow',0):6} hits={e.get('raw_field_hits')}"
    )
