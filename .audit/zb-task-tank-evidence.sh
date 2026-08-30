#!/bin/bash
set -euo pipefail
BASE="${1:-http://127.0.0.1:8787}"
IEEE="0xqa_tank_leak"
FN="qa_tank_leak"

echo "=== recipes ==="
curl -sf "$BASE/settings/zigbee/recipes" | python3 -c "import json,sys; r=json.load(sys.stdin)['recipes']; print([x['id'] for x in r])"

echo "=== put policy ==="
curl -sf -X PUT "$BASE/settings/zigbee/policies" -H 'Content-Type: application/json' \
  -d "{\"policies\":{\"$IEEE\":{\"recipe_id\":\"tank_full_appliance\",\"enabled\":true,\"params\":{\"seat_id\":\"dehumidifier\"}}}}" \
  | python3 -c "import json,sys; print(json.load(sys.stdin)['policies'].get('$IEEE'))"

echo "=== bind role leak_tank (merge) ==="
python3 <<PY
import json, urllib.request
base = "$BASE"
ieee = "$IEEE"
fn = "$FN"
with urllib.request.urlopen(base + "/settings/zigbee/bindings") as r:
    bindings = json.load(r).get("bindings") or {}
bindings[ieee] = {
    "role": "leak_tank",
    "zone": "4x8",
    "enabled": True,
    "friendly_name": fn,
    "alias": "",
}
req = urllib.request.Request(
    base + "/settings/zigbee/bindings",
    data=json.dumps({"bindings": bindings}).encode(),
    headers={"Content-Type": "application/json"},
    method="PUT",
)
with urllib.request.urlopen(req) as r:
    print("bound", ieee, json.load(r)["bindings"].get(ieee))
PY

MQ=$(docker ps --format '{{.Names}}' | grep -i mosquito | head -1 || true)
echo "mosquitto container: ${MQ:-none}"
pub() {
  local payload="$1"
  if [ -n "$MQ" ]; then
    docker exec "$MQ" mosquitto_pub -t "zigbee2mqtt/$FN" -m "$payload"
  else
    mosquitto_pub -h 127.0.0.1 -t "zigbee2mqtt/$FN" -m "$payload"
  fi
}

echo "=== WET ==="
pub '{"water_leak":true}'
sleep 2

curl -sf "$BASE/settings" | python3 -c "
import json,sys
d=json.load(sys.stdin)
inv={r['seat_id']:r for r in d.get('inventory',[])}
print('dehumidifier in_service', inv.get('dehumidifier',{}).get('in_service'))
"
curl -sf "$BASE/fleet" | python3 -c "
import json,sys
s=json.load(sys.stdin).get('system') or {}
print('banners', s.get('critical_banners'))
print('policy_state', (s.get('zigbee_policy_state') or {}).get('$IEEE'))
print('by_role leak_tank', (s.get('zigbee_by_role') or {}).get('leak_tank'))
"

echo "=== DRY ==="
pub '{"water_leak":false}'
sleep 2

curl -sf "$BASE/settings" | python3 -c "
import json,sys
d=json.load(sys.stdin)
inv={r['seat_id']:r for r in d.get('inventory',[])}
print('dehumidifier in_service', inv.get('dehumidifier',{}).get('in_service'))
"
curl -sf "$BASE/fleet" | python3 -c "
import json,sys
s=json.load(sys.stdin).get('system') or {}
print('banners', s.get('critical_banners'))
print('policy_state', (s.get('zigbee_policy_state') or {}).get('$IEEE'))
"
echo "=== DONE ==="