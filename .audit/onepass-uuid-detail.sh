#!/bin/bash
curl -s http://127.0.0.1:8787/roster | python3 -c 'import json,sys; d=json.load(sys.stdin); 
for r in d.get("roster") or []:
  print({k:r.get(k) for k in ("seat_id","plant_id","plant_uuid","uuid","assigned_plant_id","strain_id","stage")})
  # print any plant: keys
  for k,v in r.items():
    if "plant" in k.lower() or "uuid" in k.lower():
      print(" ",k,v)
'
# helpers
curl -s http://127.0.0.1:8787/fleet | python3 -c 'import json,sys; d=json.load(sys.stdin)
h=d.get("helpers") or (d.get("system") or {}).get("helpers") or {}
print("helpers_type", type(h), str(h)[:500] if h else None)
# probe helpers
probes=d.get("probes") or d.get("kit_probes") or []
print("probes", str(probes)[:400])
for k in ("probe_helpers","assignments","plant_assignments"):
  v=d.get(k) or (d.get("system") or {}).get(k)
  if v: print(k, str(v)[:400])
'
