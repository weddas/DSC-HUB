#!/bin/bash
set -euo pipefail
BASE=http://127.0.0.1:8787
ROOM=0xa4c1385a686af7df
FOUR=0xa4c1380d734f2033
TANK=0xa4c138b9e2b9b690
dcp() { echo Digital | sudo -S docker cp "$@"; }
dexec() { echo Digital | sudo -S docker exec "$@"; }
restart_brain() { echo Digital | sudo -S timeout 25 docker restart dsc-hub-brain; }
wait_health() {
  for i in $(seq 1 35); do
    if curl -sf -m 3 "$BASE/health" >/tmp/t5h.json 2>/dev/null; then
      python3 -c 'import json; d=json.load(open("/tmp/t5h.json")); print("health_ok", d.get("version"))'
      return 0
    fi
    sleep 2
  done
  echo "health FAIL"; return 1
}
pub() {
  local fn="$1"; local msg="$2"
  dexec dsc-hub-mosquitto mosquitto_pub -t "zigbee2mqtt/$fn" -m "$msg"
}
fleet_slice() {
  curl -sf "$BASE/fleet" | python3 -c "
import json,sys
d=json.load(sys.stdin).get('system') or {}
ps=d.get('zigbee_policy_state') or {}
for ieee in ['$ROOM','$FOUR','$TANK']:
  row=ps.get(ieee) or {}
  print('policy', ieee, 'problem', row.get('problem'), 'active', row.get('active'), 'recipe', row.get('recipe_id'))
b=d.get('critical_banners') or []
print('banners', json.dumps(b))
"
}
in_service() {
  curl -sf "$BASE/settings/inventory" | python3 -c "
import json,sys
d=json.load(sys.stdin)
rows=d if isinstance(d,list) else d.get('inventory') or []
for sid in ['dehumidifier','humidifier']:
  for r in rows:
    if r.get('seat_id')==sid:
      print(sid, 'in_service', r.get('in_service')); break
" 2>/dev/null || true
}

echo "=== HOTPATCH ==="
mkdir -p /tmp/task5-spa /tmp/task5-brain
tar -xzf /tmp/task5-spa.tgz -C /tmp/task5-spa
tar -xzf /tmp/task5-brain.tgz -C /tmp/task5-brain
dcp /tmp/task5-spa/. dsc-hub-brain:/app/static/
dcp /tmp/task5-brain/dsc_brain/zigbee_policies.py dsc-hub-brain:/app/dsc_brain/zigbee_policies.py
dcp /tmp/task5-brain/dsc_brain/zigbee_mqtt.py dsc-hub-brain:/app/dsc_brain/zigbee_mqtt.py
restart_brain
wait_health
curl -sf "$BASE/" | grep -oE 'assets/index-[^"]+\.js' | head -1

echo "=== recipes ==="
curl -sf "$BASE/settings/zigbee/recipes" | python3 -c "
import json,sys
for r in json.load(sys.stdin).get('recipes') or []:
  if r.get('id') in ('floor_flood_alert','tank_full_appliance'):
    print(r.get('id'), 'cap', r.get('capability_class'), 'defaults', r.get('defaults'))
"

echo "=== roles ==="
curl -sf "$BASE/settings/zigbee/roles" 2>/dev/null | python3 -c "
import json,sys
d=json.load(sys.stdin)
roles=d.get('roles') or []
for r in roles:
  if r.get('id') in ('leak_floor_room','leak_floor_4x8','leak_tank'):
    print(r.get('id'), r.get('suggested_recipes'))
" || echo roles_endpoint_skip

echo "=== BIND ==="
python3 <<PY
import json, urllib.request
base="$BASE"
room="$ROOM"
four="$FOUR"
tank="$TANK"
with urllib.request.urlopen(base+"/settings/zigbee/bindings") as r:
    bindings=json.load(r).get("bindings") or {}
bindings[room]={"role":"leak_floor_room","zone":"room","enabled":True,"friendly_name":room,"alias":"Desk flood room"}
bindings[four]={"role":"leak_floor_4x8","zone":"4x8","enabled":True,"friendly_name":four,"alias":"Desk flood 4x8"}
trow=dict(bindings.get(tank) or {})
trow.update({"role":"leak_tank","zone":"4x8","enabled":True,"friendly_name":tank,"alias":"Dehumidifier tank"})
bindings[tank]=trow
req=urllib.request.Request(base+"/settings/zigbee/bindings", data=json.dumps({"bindings":bindings}).encode(), headers={"Content-Type":"application/json"}, method="PUT")
print("bind_room", json.load(urllib.request.urlopen(req))["bindings"][room]["role"])
with urllib.request.urlopen(base+"/settings/zigbee/policies") as r:
    policies=json.load(r).get("policies") or {}
policies[room]={"recipe_id":"floor_flood_alert","enabled":True,"params":{"problem_when":"active","banner":"Floor water detected (room desk)"}}
policies[four]={"recipe_id":"floor_flood_alert","enabled":True,"params":{"problem_when":"active","banner":"Floor water detected (4x8 desk)"}}
if tank not in policies or not policies[tank].get("recipe_id") or policies[tank].get("recipe_id")=="none":
    policies[tank]={"recipe_id":"tank_full_appliance","enabled":True,"params":{"seat_id":"dehumidifier","problem_when":"active"}}
req=urllib.request.Request(base+"/settings/zigbee/policies", data=json.dumps({"policies":policies}).encode(), headers={"Content-Type":"application/json"}, method="PUT")
out=json.load(urllib.request.urlopen(req))
print("policy_tank", out["policies"][tank])
PY

echo "=== baseline dry ==="
pub "$ROOM" '{"occupancy":false}'
pub "$FOUR" '{"occupancy":false}'
sleep 2
fleet_slice
in_service

echo "=== WET room ==="
pub "$ROOM" '{"occupancy":true}'
sleep 2
fleet_slice
in_service
curl -sf "$BASE/fleet" | python3 -c "import json,sys; d=json.load(sys.stdin).get('system') or {}; ids=[x.get('id') for x in (d.get('critical_banners') or []) if isinstance(x,dict)]; print('room_banner', 'zb-policy-$ROOM' in ids); print('four_banner', 'zb-policy-$FOUR' in ids)"

echo "=== DRY room ==="
pub "$ROOM" '{"occupancy":false}'
sleep 2
fleet_slice

echo "=== WET 4x8 ==="
pub "$FOUR" '{"occupancy":true}'
sleep 2
fleet_slice
in_service
curl -sf "$BASE/fleet" | python3 -c "import json,sys; d=json.load(sys.stdin).get('system') or {}; ids=[x.get('id') for x in (d.get('critical_banners') or []) if isinstance(x,dict)]; print('room_banner', 'zb-policy-$ROOM' in ids); print('four_banner', 'zb-policy-$FOUR' in ids); ps=(d.get('zigbee_policy_state') or {}).get('$ROOM') or {}; print('room_problem', ps.get('problem'))"

echo "=== DRY 4x8 ==="
pub "$FOUR" '{"occupancy":false}'
sleep 2
fleet_slice
echo "=== TASK5 DESK FLOOD DONE ==="