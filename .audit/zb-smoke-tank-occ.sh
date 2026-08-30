#!/bin/bash
# Smoke: inject occupancy wet/dry on live tank friendly name
set -euo pipefail
BASE=http://127.0.0.1:8787
IEEE=0xa4c138b9e2b9b690

# resolve friendly
FNAME=$(curl -s "$BASE/settings/zigbee/bindings" | python3 -c "
import sys,json
b=json.load(sys.stdin).get('bindings',{})
print((b.get('$IEEE') or {}).get('friendly_name') or '$IEEE')
")
echo "friendly=$FNAME ieee=$IEEE"

echo "=== dry baseline inject ==="
echo Digital | sudo -S docker exec dsc-hub-mosquitto mosquitto_pub -t "zigbee2mqtt/$FNAME" -m '{"occupancy":false}'
sleep 2
curl -s "$BASE/fleet" | python3 -c "
import sys,json
d=json.load(sys.stdin)
inv={r['seat_id']:r for r in (d.get('inventory') or [])} if isinstance(d.get('inventory'),list) else {}
# inventory may be elsewhere
sys_inv=d.get('system',{})
print('policy_state', (sys_inv.get('zigbee_policy_state') or {}).get('$IEEE'))
print('banners', sys_inv.get('critical_banners'))
print('by_role leak_tank', (sys_inv.get('zigbee_by_role') or {}).get('leak_tank'))
"
# dehumidifier in_service via settings inventory endpoint if any
curl -s "$BASE/settings/inventory" 2>/dev/null | python3 -c "
import sys,json
try:
  d=json.load(sys.stdin)
except Exception:
  print('no inventory ep'); raise SystemExit
rows=d if isinstance(d,list) else d.get('inventory') or d.get('seats') or []
for r in rows:
  if r.get('seat_id')=='dehumidifier':
    print('dehumidifier in_service', r.get('in_service')); break
" || true

echo "=== WET inject occupancy true ==="
echo Digital | sudo -S docker exec dsc-hub-mosquitto mosquitto_pub -t "zigbee2mqtt/$FNAME" -m '{"occupancy":true}'
sleep 2
curl -s "$BASE/fleet" | python3 -c "
import sys,json
d=json.load(sys.stdin)
sys_inv=d.get('system',{})
print('policy_state', (sys_inv.get('zigbee_policy_state') or {}).get('$IEEE'))
print('banners', sys_inv.get('critical_banners'))
print('by_role leak_tank', (sys_inv.get('zigbee_by_role') or {}).get('leak_tank'))
"
# find dehumidifier status
python3 <<'PY'
import json,urllib.request
# try common paths
for path in ["/settings/inventory","/inventory","/fleet"]:
  try:
    d=json.load(urllib.request.urlopen("http://127.0.0.1:8787"+path))
  except Exception as e:
    continue
  rows=[]
  if isinstance(d,list): rows=d
  elif isinstance(d,dict):
    rows=d.get("inventory") or []
    if not rows and "appliances" in d: rows=d["appliances"]
    # fleet seats
    for k in ("seats","sonoffs","appliances"):
      pass
    son=d.get("sonoffs") or d.get("appliances") or {}
    if isinstance(son,dict) and "dehumidifier" in son:
      print("fleet dehum", son["dehumidifier"])
  for r in rows if isinstance(rows,list) else []:
    if isinstance(r,dict) and r.get("seat_id")=="dehumidifier":
      print("dehumidifier in_service", r.get("in_service"))
PY

echo "=== DRY restore ==="
echo Digital | sudo -S docker exec dsc-hub-mosquitto mosquitto_pub -t "zigbee2mqtt/$FNAME" -m '{"occupancy":false}'
sleep 2
curl -s "$BASE/fleet" | python3 -c "
import sys,json
d=json.load(sys.stdin)
sys_inv=d.get('system',{})
print('policy_state', (sys_inv.get('zigbee_policy_state') or {}).get('$IEEE'))
print('banners', sys_inv.get('critical_banners'))
"
echo "=== done ==="
