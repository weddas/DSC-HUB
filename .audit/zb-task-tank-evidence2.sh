#!/bin/bash
set -euo pipefail
BASE="${1:-http://127.0.0.1:8787}"
IEEE="0xqa_tank_leak"
FN="qa_tank_leak"

# Policy + bind already set; re-assert
curl -sf -X PUT "$BASE/settings/zigbee/policies" -H 'Content-Type: application/json' \
  -d "{\"policies\":{\"$IEEE\":{\"recipe_id\":\"tank_full_appliance\",\"enabled\":true,\"params\":{\"seat_id\":\"dehumidifier\"}}}}" >/dev/null

python3 <<PY
import json, urllib.request
base = "$BASE"
ieee = "$IEEE"
fn = "$FN"
with urllib.request.urlopen(base + "/settings/zigbee/bindings") as r:
    bindings = json.load(r).get("bindings") or {}
bindings[ieee] = {"role": "leak_tank", "zone": "4x8", "enabled": True, "friendly_name": fn, "alias": ""}
req = urllib.request.Request(base + "/settings/zigbee/bindings", data=json.dumps({"bindings": bindings}).encode(), headers={"Content-Type": "application/json"}, method="PUT")
urllib.request.urlopen(req).read()
print("bound ok")
PY

MQ=$(echo Digital | sudo -S docker ps --format '{{.Names}}' 2>/dev/null | grep -i mosquito | head -1 || true)
echo "mosquitto: ${MQ:-none}"
pub() {
  local payload="$1"
  if [ -n "$MQ" ]; then
    echo Digital | sudo -S docker exec "$MQ" mosquitto_pub -t "zigbee2mqtt/$FN" -m "$payload"
  else
    # Fallback: evaluate inside brain container
    echo Digital | sudo -S docker exec dsc-hub-brain python3 - <<PY
from dsc_brain.zigbee_mqtt import _ingest
from dsc_brain.zigbee_policies import evaluate_device_policies
_ingest._devices = [{"ieee_address": "$IEEE", "friendly_name": "$FN", "type": "EndDevice"}]
class M:
    topic = "zigbee2mqtt/$FN"
    payload = b'$payload'
_ingest._on_message(None, None, M())
print("injected", '$payload')
PY
  fi
}

echo "=== WET ==="
pub '{"water_leak":true}'
sleep 2
curl -sf "$BASE/settings" | python3 -c "import json,sys; inv={r['seat_id']:r for r in json.load(sys.stdin).get('inventory',[])}; print('dehumidifier in_service', inv.get('dehumidifier',{}).get('in_service'))"
curl -sf "$BASE/fleet" | python3 -c "import json,sys; s=json.load(sys.stdin).get('system') or {}; print('banners', s.get('critical_banners')); print('policy_state', (s.get('zigbee_policy_state') or {}).get('$IEEE')); print('by_role leak_tank', (s.get('zigbee_by_role') or {}).get('leak_tank'))"

echo "=== DRY ==="
pub '{"water_leak":false}'
sleep 2
curl -sf "$BASE/settings" | python3 -c "import json,sys; inv={r['seat_id']:r for r in json.load(sys.stdin).get('inventory',[])}; print('dehumidifier in_service', inv.get('dehumidifier',{}).get('in_service'))"
curl -sf "$BASE/fleet" | python3 -c "import json,sys; s=json.load(sys.stdin).get('system') or {}; print('banners', s.get('critical_banners')); print('policy_state', (s.get('zigbee_policy_state') or {}).get('$IEEE'))"
echo "=== DONE ==="