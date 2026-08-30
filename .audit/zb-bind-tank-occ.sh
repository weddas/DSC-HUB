#!/bin/bash
# Bind live dehum tank IEEE; desk sensors stay unbound / no recipe
set -euo pipefail
BASE=http://127.0.0.1:8787
IEEE=0xa4c138b9e2b9b690
DESK1=0xa4c1385a686af7df
DESK2=0xa4c1380d734f2033

echo "=== current bindings ==="
curl -s "$BASE/settings/zigbee/bindings" | python3 -m json.tool | head -80

# Merge: set tank role+alias; ensure desk unbound
python3 <<PY
import json, urllib.request
base="$BASE"
ieee="$IEEE"
desk=["$DESK1","$DESK2"]
req=urllib.request.Request(base+"/settings/zigbee/bindings")
cur=json.load(urllib.request.urlopen(req))
bindings=dict(cur.get("bindings") or {})
# friendly from devices list if available
fname="dehum_tank"
try:
  devs=json.load(urllib.request.urlopen(base+"/settings/zigbee/devices"))
  for d in (devs.get("devices") or []):
    if str(d.get("ieee_address") or "").lower()==ieee:
      fname=str(d.get("friendly_name") or fname)
      break
except Exception:
  pass
bindings[ieee]={
  "role":"leak_tank",
  "zone":"4x8",
  "enabled":True,
  "friendly_name":fname,
  "alias":"Dehumidifier tank",
}
for d in desk:
  row=dict(bindings.get(d) or {})
  row.update({"role":"unbound","enabled":False,"zone":"shared","alias":row.get("alias") or "desk liquid test"})
  bindings[d]=row
body=json.dumps({"bindings":bindings}).encode()
r=urllib.request.Request(base+"/settings/zigbee/bindings", data=body, method="PUT",
  headers={"Content-Type":"application/json"})
print("bindings PUT", urllib.request.urlopen(r).status)
policies={
  ieee:{"recipe_id":"tank_full_appliance","enabled":True,"params":{"seat_id":"dehumidifier"}},
}
# clear recipes on desk if any
for d in desk:
  policies[d]={"recipe_id":"none","enabled":False,"params":{}}
# keep any other existing policies?
try:
  old=json.load(urllib.request.urlopen(base+"/settings/zigbee/policies")).get("policies") or {}
  for k,v in old.items():
    if k not in policies:
      policies[k]=v
except Exception:
  pass
body=json.dumps({"policies":policies}).encode()
r=urllib.request.Request(base+"/settings/zigbee/policies", data=body, method="PUT",
  headers={"Content-Type":"application/json"})
print("policies PUT", urllib.request.urlopen(r).status)
print(json.dumps(json.load(urllib.request.urlopen(base+"/settings/zigbee/bindings")), indent=2)[:1200])
print("--- policies ---")
print(json.dumps(json.load(urllib.request.urlopen(base+"/settings/zigbee/policies")), indent=2)[:800])
PY
