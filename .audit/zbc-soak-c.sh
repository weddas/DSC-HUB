#!/bin/bash
# Zigbee-completion live soak, part C (PHYSICAL — operator-authorised 2026-09-06):
#   1. v2 Sonoff cut-out rule on the heat mat (the only relay currently ON) + a setpoint
#      rule (4x8 RH max 60 -> 61), both triggered by the QA CO2 entity: fire, then clear.
#   2. Operator-flip fix: /control/service turn_off on the mat relay -> driver re-asserts.
#   3. Stale-hub failsafe drill: mat OOS while its relay is ON, hub host made unreachable
#      -> relay must be forced OFF within STALE_SEC (45 s); then everything restored.
set -uo pipefail
PW="${1:-}"
B=http://127.0.0.1:8787
RELAY=switch.dsc_heatmat_main_relay
NUM=number.dsc_hub_rh_target_max

pub() { echo "$PW" | sudo -S docker exec dsc-hub-mosquitto mosquitto_pub -h 127.0.0.1 -t zigbee2mqtt/qa_co2 -m "$1" 2>/dev/null; }
api() { python3 - "$@" <<'PY'
import json, sys, urllib.request
method, path = sys.argv[1], sys.argv[2]
body = sys.argv[3].encode() if len(sys.argv) > 3 else None
req = urllib.request.Request('http://127.0.0.1:8787' + path, data=body, headers={'Content-Type': 'application/json'}, method=method)
try:
    r = urllib.request.urlopen(req, timeout=25); print(method, path, '->', r.status)
except Exception as exc:
    print(method, path, '-> FAILED', exc)
PY
}
snap() { python3 - <<'PY'
import json, urllib.request
d = json.load(urllib.request.urlopen('http://127.0.0.1:8787/fleet?include_hass=true', timeout=25))
hs = d.get('hass_states') or {}
inv = {r['seat_id']: r for r in d.get('inventory', [])}
c = json.load(urllib.request.urlopen('http://127.0.0.1:8787/fleet/computed', timeout=25)).get('hass_extras') or {}
print('  relay=%s mat_in_service=%s hub_online=%s rh_max=%s banners=%s' % (
    (hs.get('switch.dsc_heatmat_main_relay') or {}).get('state'),
    inv.get('heatmat', {}).get('in_service'),
    (d.get('hub') or {}).get('online'),
    (c.get('number.dsc_hub_rh_target_max') or {}).get('state'),
    [b.get('id') for b in (d['system'].get('critical_banners') or [])]))
PY
}
rules() { curl -sf $B/settings/automations | python3 -c "import json,sys; print('  rules', [(r['id'], r.get('firing'), r.get('last_error')) for r in json.load(sys.stdin).get('rules',[])])"; }
wait_relay() {  # $1 = expected state, $2 = max seconds
  for i in $(seq 1 $(( $2 / 3 ))); do
    st=$(curl -sf "$B/fleet?include_hass=true" | python3 -c "import json,sys; print((json.load(sys.stdin).get('hass_states') or {}).get('switch.dsc_heatmat_main_relay',{}).get('state'))")
    if [ "$st" = "$1" ]; then echo "  relay=$1 after ~$((i*3))s"; return 0; fi
    sleep 3
  done
  echo "  relay did NOT reach $1 within $2s (last=$st)"; return 1
}

echo "=== 0. baseline"; snap
curl -sf $B/settings/zigbee/bindings > /tmp/zb-bindings-orig.json
python3 - <<'PY'
import json, urllib.request
d = json.load(open('/tmp/zb-bindings-orig.json'))['bindings']
d['0xqa00000000c02'] = {"role": "co2_tent", "zone": "4x8", "enabled": True, "friendly_name": "qa_co2", "alias": ""}
req = urllib.request.Request('http://127.0.0.1:8787/settings/zigbee/bindings', data=json.dumps({"bindings": d}).encode(), headers={'Content-Type': 'application/json'}, method='PUT')
print('  QA bind http', urllib.request.urlopen(req, timeout=15).status)
PY
pub '{"co2":400}'; sleep 2

echo "=== 1. arm cut-out + setpoint rules (trigger: QA co2 > 800)"
api PUT /settings/automations '{"rules":[
 {"id":"qa_mat_cutout","name":"QA soak: mat cut-out","enabled":true,"trigger":{"entity_id":"sensor.dsc_zigbee_co2_tent_co2","op":"gt","value":800},"action":{"type":"relay","params":{"entity_id":"switch.dsc_heatmat_main_relay","on_when_firing":false}}},
 {"id":"qa_rh_max","name":"QA soak: RH max 61","enabled":true,"trigger":{"entity_id":"sensor.dsc_zigbee_co2_tent_co2","op":"gt","value":800},"action":{"type":"setpoint","params":{"entity_id":"number.dsc_hub_rh_target_max","value":61}}}]}'
sleep 1; curl -sf $B/fleet >/dev/null; rules
echo "--- FIRE (co2=812)"; pub '{"co2":812}'; sleep 3; curl -sf $B/fleet >/dev/null; sleep 3; curl -sf $B/fleet >/dev/null
rules; snap; wait_relay off 20
echo "--- hold 20 s, then check the driver did NOT re-assert the mat while OOS"; sleep 20; snap
echo "--- CLEAR (co2=400)"; pub '{"co2":400}'; sleep 3; curl -sf $B/fleet >/dev/null; sleep 3; curl -sf $B/fleet >/dev/null
rules; snap; wait_relay on 30
echo "--- setpoint restore check (hub mirror lag up to ~60 s)"
for i in 1 2 3 4 5 6; do v=$(curl -sf $B/fleet/computed | python3 -c "import json,sys; print((json.load(sys.stdin).get('hass_extras') or {}).get('number.dsc_hub_rh_target_max',{}).get('state'))"); echo "  rh_max=$v"; [ "$v" = "60.0" ] && break; sleep 10; done
api PUT /settings/automations '{"rules":[]}'

echo "=== 2. operator flip: turn_off mat relay against hub demand -> driver re-asserts"
api POST /control/service '{"domain":"switch","service":"turn_off","data":{"entity_id":"switch.dsc_heatmat_main_relay"}}'
sleep 1; snap; wait_relay on 20

echo "=== 3. failsafe drill: mat OOS with relay ON, then hub unreachable"
api PATCH /settings/inventory/heatmat '{"in_service":false}'
sleep 8; snap
echo "--- relay should still be ON here (OOS seats are skipped by demand mirroring — the old gap)"
api PATCH /settings/inventory/hub '{"host":"10.42.0.250"}'
echo "--- waiting for STALE_SEC (45 s) + tick: relay must go OFF"
wait_relay off 110; snap
echo "--- restore hub host + mat in service"
api PATCH /settings/inventory/hub '{"host":"10.42.0.10"}'
api PATCH /settings/inventory/heatmat '{"in_service":true}'
wait_relay on 90; snap

echo "=== 4. cleanup: bindings, banners, safety restore of RH max"
python3 - <<'PY'
import json, urllib.request
d = json.load(open('/tmp/zb-bindings-orig.json'))['bindings']
req = urllib.request.Request('http://127.0.0.1:8787/settings/zigbee/bindings', data=json.dumps({"bindings": d}).encode(), headers={'Content-Type': 'application/json'}, method='PUT')
print('  bindings restored http', urllib.request.urlopen(req, timeout=15).status)
PY
v=$(curl -sf $B/fleet/computed | python3 -c "import json,sys; print((json.load(sys.stdin).get('hass_extras') or {}).get('number.dsc_hub_rh_target_max',{}).get('state'))")
if [ "$v" != "60.0" ]; then echo "  rh_max=$v -> forcing back to 60"; api POST /control/service '{"domain":"number","service":"set_value","data":{"entity_id":"number.dsc_hub_rh_target_max","value":60}}'; fi
sleep 2; snap; rules
echo "=== soak C done"
