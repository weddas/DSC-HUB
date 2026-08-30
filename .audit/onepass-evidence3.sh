#!/bin/bash
set -euo pipefail
BASE=http://127.0.0.1:8787

echo "=== irrigact shot (OOS expected) ==="
curl -s -X POST "$BASE/control/irrigation/shot" \
  -H 'Content-Type: application/json' \
  -d '{"pot_id":"pot1","duration_s":1}' ; echo

echo "=== fleet snapshot ==="
curl -s "$BASE/fleet" -o /tmp/fleet.json -w "http=%{http_code} bytes=%{size_download}\n"
python3 - <<'PY'
import json
d=json.load(open("/tmp/fleet.json"))
found=[]
def walk(o, path=""):
  if isinstance(o, dict):
    for k,v in o.items():
      p=f"{path}.{k}" if path else k
      if isinstance(v,str) and v.startswith("plant:"):
        found.append((p,v))
      elif k in ("plant_id","plant_uuid","uuid") and isinstance(v,str) and v:
        found.append((p,v))
      walk(v,p)
  elif isinstance(o, list):
    for i,v in enumerate(o[:80]):
      walk(v, f"{path}[{i}]")
walk(d)
print("plant_id hits", len(found))
for p,v in found[:30]:
  print(p, v)
print("canopy", d.get("canopy"))
sysm=d.get("system") or {}
print("zigbee_by_role", sysm.get("zigbee_by_role"))
s=json.dumps(d)
for needle in ["twin_sf1000","dsc_hub_twin","sensor_fault","modbus_probe","plant:"]:
  print(needle, s.count(needle))
# pot honesty
pots=d.get("pots") or {}
for pid in ("pot1","pot2","pot3","pot4"):
  p=pots.get(pid) or {}
  print(pid, {k:p.get(k) for k in ("online","in_service","sensor_fault","modbus_probe_online","plant_uuid","plant_id","name") if k in p or True})
PY

echo "=== refresh permit join ==="
curl -s -X POST "$BASE/settings/zigbee/permit-join" \
  -H 'Content-Type: application/json' \
  -d '{"permit":true,"time_s":254}' ; echo

echo "=== z2m bridge devices raw ==="
echo Digital | sudo -S docker exec dsc-hub-mosquitto mosquitto_sub -h 127.0.0.1 -t zigbee2mqtt/bridge/devices -C 1 -W 3 2>/dev/null | python3 -c 'import sys,json; d=json.load(sys.stdin); print("count",len(d));
[print(x.get("type"), x.get("friendly_name"), x.get("ieee_address"), x.get("definition",{}).get("model") if isinstance(x.get("definition"),dict) else None) for x in d]' || echo "no bridge devices msg"
