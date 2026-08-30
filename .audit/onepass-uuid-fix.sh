#!/bin/bash
set -euo pipefail
echo Digital | sudo -S docker cp /tmp/uuid_fix_inner.py dsc-hub-brain:/tmp/uuid_fix_inner.py
echo Digital | sudo -S docker exec -e PYTHONPATH=/app -w /app dsc-hub-brain python3 /tmp/uuid_fix_inner.py
curl -s -X POST http://127.0.0.1:8787/settings/zigbee/permit-join \
  -H 'Content-Type: application/json' \
  -d '{"enabled":true,"duration_s":254}'; echo
curl -s http://127.0.0.1:8787/settings/zigbee/health; echo
# verify helpers via fleet/helpers if any
curl -s http://127.0.0.1:8787/compose 2>/dev/null | python3 -c 'import sys,json
try:
 d=json.load(sys.stdin)
except Exception as e:
 print("compose err",e); raise SystemExit
found=[]
def walk(o,p=""):
  if isinstance(o,dict):
    for k,v in o.items():
      np=f"{p}.{k}" if p else k
      if isinstance(v,str) and v.startswith("plant:"): found.append((np,v))
      elif k in ("plant_uuid","assigned_plant_id") and v: found.append((np,v))
      walk(v,np)
  elif isinstance(o,list):
    for i,v in enumerate(o[:100]): walk(v,f"{p}[{i}]")
walk(d)
print("plant_hits",len(found))
for a,b in found[:40]: print(a,"=",b)
' || true
