#!/bin/bash
set -euo pipefail
curl -s http://127.0.0.1:8787/fleet -o /tmp/fleet.json
python3 - <<'PY'
import json
d=json.load(open("/tmp/fleet.json"))
ctrl=((d.get("hub") or {}).get("values") or {}).get("controls") or {}
twin=(ctrl.get("light") or {}).get("dsc_hub_twin_sf1000") or ctrl.get("light.dsc_hub_twin_sf1000")
# nested path from earlier: hub.values.controls.light.dsc_hub_twin_sf1000
lights=ctrl.get("light") if isinstance(ctrl.get("light"), dict) else {}
# try flat keys
flat={k:v for k,v in ctrl.items() if "twin" in k.lower() or "sf1000" in k.lower()}
print("flat", flat)
print("lights twin", lights.get("dsc_hub_twin_sf1000") or lights.get("dsc_hub_sf1000_dimmer"))
# walk
def find(o,path=""):
  if isinstance(o,dict):
    for k,v in o.items():
      p=f"{path}.{k}" if path else k
      if "twin_sf1000" in p:
        print(p, v)
      find(v,p)
find(d.get("hub"))
PY
