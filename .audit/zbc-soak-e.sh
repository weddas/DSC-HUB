#!/bin/bash
# Physical relay soak, part E — the observable is the Sonoff's own native-API relay state
# (/tmp/zbc-sonoff-state.run.sh, run inside the brain container), because every brain-side
# relay field (entity, appliance status, values.relay_on) mirrors hub demand.
# Target: heat mat; it must be physically ON at start.
set -uo pipefail
PW="${1:-}"
B=http://127.0.0.1:8787
DEV() { bash /tmp/zbc-sonoff-state.run.sh "$PW" heatmat 2>/dev/null | tail -1; }
pub() { echo "$PW" | sudo -S docker exec dsc-hub-mosquitto mosquitto_pub -h 127.0.0.1 -t zigbee2mqtt/qa_co2 -m "$1" 2>/dev/null; }
api() { python3 - "$@" <<'PY'
import json, sys, urllib.request
method, path = sys.argv[1], sys.argv[2]
body = sys.argv[3].encode() if len(sys.argv) > 3 else None
req = urllib.request.Request('http://127.0.0.1:8787' + path, data=body, headers={'Content-Type': 'application/json'}, method=method)
try:
    r = urllib.request.urlopen(req, timeout=25); print('  ', method, path, '->', r.status)
except Exception as exc:
    print('  ', method, path, '-> FAILED', exc)
PY
}
ctx() { python3 - "$1" <<'PY'
import json, sys, urllib.request
d = json.load(urllib.request.urlopen('http://127.0.0.1:8787/fleet?include_hass=true', timeout=25))
hs = d.get('hass_states') or {}; inv = {r['seat_id']: r for r in d.get('inventory', [])}
print('  [%s] demand(driver)=%s in_service=%s hub_online=%s banners=%s' % (sys.argv[1], (hs.get('switch.dsc_heatmat_main_relay') or {}).get('state'),
      inv.get('heatmat', {}).get('in_service'), (d.get('hub') or {}).get('online'), [b.get('id') for b in (d['system'].get('critical_banners') or [])]))
PY
}
wait_dev() {  # $1 = on|off, $2 = max s, $3 = label ; direct device reads every ~6 s
  local t=0
  while [ $t -le $2 ]; do
    v=$(DEV); echo "    t=${t}s $v"
    case "$v" in *"relay=$1"*) echo "  [$3] device relay=$1 after ~${t}s"; return 0;; esac
    sleep 6; t=$((t+6))
  done
  echo "  [$3] device did NOT reach relay=$1 within $2s"; return 1
}

echo "=== 0. baseline"; echo "    $(DEV)"; ctx base
# The mat cycles with root-zone temperature; wait (up to 12 min) for it to be physically ON.
waited=0
until [ $waited -ge 720 ]; do
  case "$(DEV)" in *"relay=on"*) break;; esac
  sleep 15; waited=$((waited+15))
done
echo "    mat ON after waiting ${waited}s: $(DEV)"
case "$(DEV)" in *"relay=on"*) ;; *) echo "heat mat never came ON within 12 min — abort"; exit 2;; esac
curl -sf $B/settings/zigbee/bindings > /tmp/zb-bindings-orig.json
python3 - <<'PY'
import json, urllib.request
d = json.load(open('/tmp/zb-bindings-orig.json'))['bindings']
d['0xqa00000000c02'] = {"role": "co2_tent", "zone": "4x8", "enabled": True, "friendly_name": "qa_co2", "alias": ""}
req = urllib.request.Request('http://127.0.0.1:8787/settings/zigbee/bindings', data=json.dumps({"bindings": d}).encode(), headers={'Content-Type': 'application/json'}, method='PUT')
print('   QA bind http', urllib.request.urlopen(req, timeout=15).status)
PY
pub '{"co2":400}'; sleep 2

echo "=== 1. v2 cut-out rule -> physical relay OFF, stays OFF while OOS, back after clear"
api PUT /settings/automations '{"rules":[{"id":"qa_mat_cutout","name":"QA soak: mat cut-out","enabled":true,"trigger":{"entity_id":"sensor.dsc_zigbee_co2_tent_co2","op":"gt","value":800},"action":{"type":"relay","params":{"entity_id":"switch.dsc_heatmat_main_relay","on_when_firing":false}}}]}'
sleep 1; curl -sf $B/fleet >/dev/null
echo "--- FIRE (co2=812)"; pub '{"co2":812}'; sleep 2; curl -sf $B/fleet >/dev/null; sleep 2; curl -sf $B/fleet >/dev/null
wait_dev off 30 fire; ctx fire
echo "--- hold 20 s OOS"; sleep 20; echo "    $(DEV)"; ctx hold
echo "--- CLEAR (co2=400)"; pub '{"co2":400}'; sleep 2; curl -sf $B/fleet >/dev/null; sleep 2; curl -sf $B/fleet >/dev/null
wait_dev on 45 clear; ctx clear
api PUT /settings/automations '{"rules":[]}'

echo "=== 2. operator flip: turn_off against demand -> driver re-asserts on its next 2 s tick"
ctx pre-flip
api POST /control/service '{"domain":"switch","service":"turn_off","data":{"entity_id":"switch.dsc_heatmat_main_relay"}}'
for i in 1 2 3 4; do echo "    +$((i*4))s $(DEV)"; sleep 1; done
ctx post-flip

echo "=== 3. failsafe drill: OOS while ON, then hub unreachable -> forced OFF within STALE_SEC"
api PATCH /settings/inventory/heatmat '{"in_service":false}'
sleep 8; echo "    after OOS: $(DEV)"; ctx oos
api PATCH /settings/inventory/hub '{"host":"10.42.0.250"}'
wait_dev off 120 failsafe; ctx failsafe
echo "--- restore"
api PATCH /settings/inventory/hub '{"host":"10.42.0.10"}'
api PATCH /settings/inventory/heatmat '{"in_service":true}'
wait_dev on 150 restore; ctx restore

echo "=== 4. cleanup"
python3 - <<'PY'
import json, urllib.request
d = json.load(open('/tmp/zb-bindings-orig.json'))['bindings']
req = urllib.request.Request('http://127.0.0.1:8787/settings/zigbee/bindings', data=json.dumps({"bindings": d}).encode(), headers={'Content-Type': 'application/json'}, method='PUT')
print('   bindings restored http', urllib.request.urlopen(req, timeout=15).status)
PY
sleep 3; echo "    $(DEV)"; ctx end
curl -sf $B/settings/automations | python3 -c "import json,sys; print('   rules', json.load(sys.stdin).get('rules'))"
echo "=== soak E done"
