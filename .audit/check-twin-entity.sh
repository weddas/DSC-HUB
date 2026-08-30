#!/bin/bash
set -euo pipefail
curl -s http://127.0.0.1:8787/fleet -o /tmp/fleet.json
python3 - <<'PY'
import json
d=json.load(open("/tmp/fleet.json"))
s=json.dumps(d)
print("twin_sf1000 count", s.count("twin_sf1000"))
# search nested
found=[]
def walk(o,p=""):
  if isinstance(o,dict):
    for k,v in o.items():
      path=f"{p}.{k}" if p else k
      if "twin" in k.lower() or "sf1000" in k.lower():
        found.append((path,v if not isinstance(v,(dict,list)) else type(v).__name__))
      walk(v,path)
  elif isinstance(o,list) and len(o)<30:
    for i,v in enumerate(o): walk(v,f"{p}[{i}]")
walk(d)
print("found", found[:20])
# entities-like
for key in ("lights","entities","ha_states","synthetic"):
  if key in d: print(key, list(d[key])[:10] if isinstance(d[key],dict) else type(d[key]))
PY
