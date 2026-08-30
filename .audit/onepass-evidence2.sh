#!/bin/bash
set -euo pipefail
BASE=http://127.0.0.1:8787

echo "=== zigbee health ==="
curl -s "$BASE/settings/zigbee/health"; echo

echo "=== zigbee devices ==="
curl -s "$BASE/settings/zigbee/devices"; echo

echo "=== bindings ==="
curl -s "$BASE/settings/zigbee/bindings"; echo

echo "=== waiter ==="
pgrep -af 'zb-waiter' || true
tail -5 /tmp/zb-waiter.log 2>/dev/null || true

echo "=== soft-cal ==="
curl -s -m 45 -X POST "$BASE/ai/soft-cal-advice" \
  -H 'Content-Type: application/json' \
  -d '{"plant_name":"Amnesia Blue","stage":"flower","probe_index":1}' | head -c 900
echo

echo "=== root-steering ==="
curl -s "$BASE/control/root-steering" | head -c 900
echo

echo "=== irrigact routes ==="
curl -s "$BASE/openapi.json" 2>/dev/null | python3 -c '
import sys,json
try:
  d=json.load(sys.stdin)
except Exception as e:
  print("no openapi", e); sys.exit(0)
for p in sorted(d.get("paths",{})):
  if "irrig" in p or "root" in p or "zigbee" in p or "soft-cal" in p:
    print(p, list(d["paths"][p].keys()))
' || true

echo "=== irrigact status try ==="
for path in /control/irrigact /control/irrigact/status /irrigact /control/irrigation/act; do
  code=$(curl -s -o /tmp/irrig.out -w '%{http_code}' "$BASE$path" || true)
  echo "GET $path -> $code $(head -c 200 /tmp/irrig.out)"
done
for path in /control/irrigact /control/irrigact/pulse /control/irrigact/run; do
  code=$(curl -s -o /tmp/irrig.out -w '%{http_code}' -X POST "$BASE$path" \
    -H 'Content-Type: application/json' -d '{}' || true)
  echo "POST $path -> $code $(head -c 240 /tmp/irrig.out)"
done

echo "=== plant uuids ==="
curl -s "$BASE/fleet" | python3 - <<'PY'
import sys,json
d=json.load(sys.stdin)
found=[]
def walk(o, path=""):
  if isinstance(o, dict):
    for k,v in o.items():
      p=f"{path}.{k}" if path else k
      if isinstance(v,str) and v.startswith("plant:"):
        found.append((p,v))
      elif k in ("plant_id","plant_uuid","uuid") and v:
        found.append((p,v))
      walk(v,p)
  elif isinstance(o, list):
    for i,v in enumerate(o[:50]):
      walk(v, f"{path}[{i}]")
walk(d)
for p,v in found[:40]:
  print(p, v)
print("count", len(found))
# canopy
c=d.get("canopy") or (d.get("fleet") or {}).get("canopy")
print("canopy", c)
sysm=d.get("system") or {}
print("zigbee_by_role keys", list((sysm.get("zigbee_by_role") or {}).keys())[:12])
PY

echo "=== twin / honesty fleet bits ==="
curl -s "$BASE/fleet" | python3 - <<'PY'
import sys,json
d=json.load(sys.stdin)
hub=(d.get("hub") or {})
vals=hub.get("values") or {}
for k in sorted(vals):
  if "twin" in k.lower() or "sf1000" in k.lower() or "ir" in k.lower() or "honesty" in k.lower():
    print("hub.values", k, vals[k])
# search entities-ish
s=json.dumps(d)
for needle in ["twin_sf1000","dsc_hub_twin","plant:","sensor_fault","modbus_probe"]:
  print(needle, "present" if needle in s else "absent", "count", s.count(needle))
PY
