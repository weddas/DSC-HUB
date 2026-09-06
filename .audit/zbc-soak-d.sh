#!/bin/bash
# Physical relay soak, part D — observable is the Sonoff's OWN polled relay state
# (fleet.sonoffs[seat].values.relay_on, esphome_client polls every ~3 s), because the
# switch.dsc_<seat>_main_relay entity / appliance status currently mirror hub DEMAND.
# Target: heat mat (must be physically ON at start so the cut-out is visible).
set -uo pipefail
PW="${1:-}"
B=http://127.0.0.1:8787
SEAT=heatmat

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
# prints: t=<s> relay_on(device)=.. demand(driver)=.. in_service=.. hub_ok=.. banners=..
sample() { python3 - "$1" <<'PY'
import json, sys, time, urllib.request
d = json.load(urllib.request.urlopen('http://127.0.0.1:8787/fleet?include_hass=true', timeout=25))
s = (d.get('sonoffs') or {}).get('heatmat') or {}
hs = d.get('hass_states') or {}
inv = {r['seat_id']: r for r in d.get('inventory', [])}
print('  t=%-4s relay_on(device)=%-5s online=%-5s demand(driver)=%-3s in_service=%-5s hub_online=%-5s banners=%s' % (
    sys.argv[1], (s.get('values') or {}).get('relay_on'), s.get('online'),
    (hs.get('switch.dsc_heatmat_main_relay') or {}).get('state'), inv.get('heatmat', {}).get('in_service'),
    (d.get('hub') or {}).get('online'), [b.get('id') for b in (d['system'].get('critical_banners') or [])]))
PY
}
relay_dev() { curl -sf "$B/fleet" | python3 -c "import json,sys; print(((json.load(sys.stdin).get('sonoffs') or {}).get('heatmat') or {}).get('values',{}).get('relay_on'))"; }
wait_dev() {  # $1 expected (True/False), $2 max seconds, $3 label
  local t=0
  while [ $t -le $2 ]; do
    v=$(relay_dev); if [ "$v" = "$1" ]; then echo "  [$3] device relay_on=$1 after ~${t}s"; return 0; fi
    sleep 3; t=$((t+3))
  done
  echo "  [$3] device relay_on did NOT reach $1 within $2s (last=$v)"; return 1
}

echo "=== 0. baseline"; sample 0
if [ "$(relay_dev)" != "True" ]; then echo "heat mat relay is not ON right now — nothing visible to cut; abort"; exit 2; fi
curl -sf $B/settings/zigbee/bindings > /tmp/zb-bindings-orig.json
python3 - <<'PY'
import json, urllib.request
d = json.load(open('/tmp/zb-bindings-orig.json'))['bindings']
d['0xqa00000000c02'] = {"role": "co2_tent", "zone": "4x8", "enabled": True, "friendly_name": "qa_co2", "alias": ""}
req = urllib.request.Request('http://127.0.0.1:8787/settings/zigbee/bindings', data=json.dumps({"bindings": d}).encode(), headers={'Content-Type': 'application/json'}, method='PUT')
print('   QA bind http', urllib.request.urlopen(req, timeout=15).status)
PY
pub '{"co2":400}'; sleep 2

echo "=== 1. v2 cut-out rule on the mat relay"
api PUT /settings/automations '{"rules":[{"id":"qa_mat_cutout","name":"QA soak: mat cut-out","enabled":true,"trigger":{"entity_id":"sensor.dsc_zigbee_co2_tent_co2","op":"gt","value":800},"action":{"type":"relay","params":{"entity_id":"switch.dsc_heatmat_main_relay","on_when_firing":false}}}]}'
sleep 1; curl -sf $B/fleet >/dev/null
echo "--- FIRE (co2=812)"; pub '{"co2":812}'; sleep 2; curl -sf $B/fleet >/dev/null; sleep 2; curl -sf $B/fleet >/dev/null
wait_dev False 30 fire; sample fire
echo "--- hold 20 s while OOS: the driver must NOT re-assert the mat"; sleep 20; sample hold
echo "--- CLEAR (co2=400)"; pub '{"co2":400}'; sleep 2; curl -sf $B/fleet >/dev/null; sleep 2; curl -sf $B/fleet >/dev/null
wait_dev True 40 clear; sample clear
api PUT /settings/automations '{"rules":[]}'

echo "=== 2. operator flip: turn_off against hub demand ON -> driver re-asserts within a tick"
api POST /control/service '{"domain":"switch","service":"turn_off","data":{"entity_id":"switch.dsc_heatmat_main_relay"}}'
for t in 1 3 5 7 9 12 15; do sleep 2; sample $t; done
wait_dev True 30 reassert

echo "=== 3. failsafe drill: mat OOS while relay ON, then hub unreachable"
api PATCH /settings/inventory/heatmat '{"in_service":false}'
sleep 10; sample oos
echo "--- expected: device relay_on still True (OOS seats are skipped by demand mirroring = the old gap)"
api PATCH /settings/inventory/hub '{"host":"10.42.0.250"}'
echo "--- STALE_SEC is 45 s: relay must be forced OFF even though the seat is OOS"
wait_dev False 120 failsafe; sample failsafe
echo "--- restore hub host + mat in service"
api PATCH /settings/inventory/hub '{"host":"10.42.0.10"}'
api PATCH /settings/inventory/heatmat '{"in_service":true}'
wait_dev True 120 restore; sample restore

echo "=== 4. cleanup"
python3 - <<'PY'
import json, urllib.request
d = json.load(open('/tmp/zb-bindings-orig.json'))['bindings']
req = urllib.request.Request('http://127.0.0.1:8787/settings/zigbee/bindings', data=json.dumps({"bindings": d}).encode(), headers={'Content-Type': 'application/json'}, method='PUT')
print('   bindings restored http', urllib.request.urlopen(req, timeout=15).status)
PY
sleep 3; sample end
curl -sf $B/settings/automations | python3 -c "import json,sys; print('   rules', json.load(sys.stdin).get('rules'))"
echo "=== soak D done"
