#!/bin/bash
set -euo pipefail
BASE=http://127.0.0.1:8787
IEEE_LIVE=0xa4c138b9e2b9b690
IEEE_QA=0xqa_task5_inactive
FN_QA=qa_task5_inactive
DC="docker"
if ! docker ps >/dev/null 2>&1; then DC="echo Digital | sudo -S docker"; fi

echo "=== HOTPATCH unpack ==="
mkdir -p /tmp/task5-spa /tmp/task5-brain
tar -xzf /tmp/task5-spa.tgz -C /tmp/task5-spa
tar -xzf /tmp/task5-brain.tgz -C /tmp/task5-brain
eval $DC cp /tmp/task5-spa/. dsc-hub-brain:/app/static/
eval $DC cp /tmp/task5-brain/dsc_brain/zigbee_policies.py dsc-hub-brain:/app/dsc_brain/zigbee_policies.py
eval $DC cp /tmp/task5-brain/dsc_brain/zigbee_mqtt.py dsc-hub-brain:/app/dsc_brain/zigbee_mqtt.py
if docker ps >/dev/null 2>&1; then
  timeout 25 docker restart dsc-hub-brain
else
  echo Digital | sudo -S timeout 25 docker restart dsc-hub-brain
fi
for i in $(seq 1 30); do
  if curl -sf -m 3 "$BASE/health" >/tmp/t5h.json 2>/dev/null; then
    python3 -c 'import json; d=json.load(open("/tmp/t5h.json")); print("health_ok", d.get("version"))'
    break
  fi
  sleep 2
done
curl -sf "$BASE/" | grep -oE 'assets/index-[^"]+\.js' | head -1

echo "=== recipes capability_class ==="
curl -sf "$BASE/settings/zigbee/recipes" | python3 -c "
import json,sys
for r in json.load(sys.stdin).get('recipes') or []:
  if r.get('id')=='tank_full_appliance':
    print('recipe', r.get('id'), 'capability_class', r.get('capability_class'))
    print('defaults', r.get('defaults'))
    print('param_schema keys', list((r.get('param_schema') or {}).keys()))
"

echo "=== LIVE policy before ==="
curl -sf "$BASE/settings/zigbee/policies" | python3 -c "
import json,sys
p=json.load(sys.stdin).get('policies') or {}
print('live_policy', p.get('$IEEE_LIVE'))
"

echo "=== QA policy problem_when=inactive ==="
curl -sf -X PUT "$BASE/settings/zigbee/policies" -H 'Content-Type: application/json' \
  -d "{\"policies\":{\"$IEEE_QA\":{\"recipe_id\":\"tank_full_appliance\",\"enabled\":true,\"params\":{\"seat_id\":\"humidifier\",\"problem_when\":\"inactive\"}}}}" \
  | python3 -c "import json,sys; print(json.load(sys.stdin)['policies'].get('$IEEE_QA'))"

python3 <<PY
import json, urllib.request
base = "$BASE"
ieee = "$IEEE_QA"
fn = "$FN_QA"
with urllib.request.urlopen(base + "/settings/zigbee/bindings") as r:
    bindings = json.load(r).get("bindings") or {}
bindings[ieee] = {
    "role": "leak_tank",
    "zone": "4x8",
    "enabled": True,
    "friendly_name": fn,
    "alias": "Task5 inactive polarity QA",
}
req = urllib.request.Request(
    base + "/settings/zigbee/bindings",
    data=json.dumps({"bindings": bindings}).encode(),
    headers={"Content-Type": "application/json"},
    method="PUT",
)
with urllib.request.urlopen(req) as r:
    print("bound", json.load(r)["bindings"].get(ieee))
PY

pub() {
  if docker ps >/dev/null 2>&1; then
    docker exec dsc-hub-mosquitto mosquitto_pub -t "zigbee2mqtt/$FN_QA" -m "$1"
  else
    echo Digital | sudo -S docker exec dsc-hub-mosquitto mosquitto_pub -t "zigbee2mqtt/$FN_QA" -m "$1"
  fi
}

check_fleet() {
  curl -sf "$BASE/fleet" | python3 -c "
import json,sys
d=json.load(sys.stdin).get('system') or {}
ps=(d.get('zigbee_policy_state') or {}).get('$IEEE_QA') or {}
print('qa_problem', ps.get('problem'), 'problem_when', ps.get('problem_when'), 'active', ps.get('active'))
print('banners', d.get('critical_banners'))
"
  curl -sf "$BASE/settings/inventory" | python3 -c "
import json,sys
d=json.load(sys.stdin)
rows=d if isinstance(d,list) else d.get('inventory') or []
for r in rows:
  if r.get('seat_id')=='humidifier':
    print('humidifier in_service', r.get('in_service')); break
" 2>/dev/null || true
}

echo "=== INACTIVE: dry occupancy false => expect OOS ==="
pub '{"occupancy":false}'
sleep 2
check_fleet

echo "=== INACTIVE: wet occupancy true => expect clear ==="
pub '{"occupancy":true}'
sleep 2
check_fleet

echo "=== LIVE tank default active polarity ==="
curl -sf "$BASE/settings/zigbee/policies" | python3 -c "
import json,sys
p=(json.load(sys.stdin).get('policies') or {}).get('$IEEE_LIVE') or {}
params=p.get('params') or {}
print('live_params', params, 'problem_when_default', params.get('problem_when','active'))
"
FNAME=$(curl -sf "$BASE/settings/zigbee/bindings" | python3 -c "
import json,sys
b=json.load(sys.stdin).get('bindings',{})
print((b.get('$IEEE_LIVE') or {}).get('friendly_name') or '$IEEE_LIVE')
")
echo "live_friendly=$FNAME"

pub_live() {
  if docker ps >/dev/null 2>&1; then
    docker exec dsc-hub-mosquitto mosquitto_pub -t "zigbee2mqtt/$FNAME" -m "$1"
  else
    echo Digital | sudo -S docker exec dsc-hub-mosquitto mosquitto_pub -t "zigbee2mqtt/$FNAME" -m "$1"
  fi
}

echo "=== LIVE: wet occupancy true => expect OOS (active) ==="
pub_live '{"occupancy":true}'
sleep 2
curl -sf "$BASE/fleet" | python3 -c "
import json,sys
d=json.load(sys.stdin).get('system') or {}
ps=(d.get('zigbee_policy_state') or {}).get('$IEEE_LIVE') or {}
print('live_problem', ps.get('problem'), 'problem_when', ps.get('problem_when'))
print('banners', d.get('critical_banners'))
"
curl -sf "$BASE/settings/inventory" | python3 -c "
import json,sys
d=json.load(sys.stdin)
rows=d if isinstance(d,list) else d.get('inventory') or []
for r in rows:
  if r.get('seat_id')=='humidifier':
    print('humidifier in_service', r.get('in_service')); break
" 2>/dev/null || true

echo "=== LIVE: dry restore ==="
pub_live '{"occupancy":false}'
sleep 2
curl -sf "$BASE/fleet" | python3 -c "
import json,sys
d=json.load(sys.stdin).get('system') or {}
ps=(d.get('zigbee_policy_state') or {}).get('$IEEE_LIVE') or {}
print('live_problem_after_dry', ps.get('problem'))
print('banners', d.get('critical_banners'))
"
echo "=== TASK5 DONE ==="