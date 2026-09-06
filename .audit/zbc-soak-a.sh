#!/bin/bash
# Zigbee-completion live soak, part A (non-physical): deploy checks, QA co2_tent bind,
# MQTT publish, entity export, banner rule fires. Leaves the QA bind + rule in place
# for a screenshot; zbc-soak-b.sh clears and cleans up.
set -uo pipefail
PW="${1:-}"
B=http://127.0.0.1:8787

echo "=== health"; curl -sf $B/health | head -c 200; echo
echo "=== targets"
curl -sf -m 10 $B/settings/automations/targets | python3 -c "import json,sys; d=json.load(sys.stdin); print('relays',len(d['relays']),'setpoints',len(d['setpoints']),'entities',len(d.get('entities',[])), 'age_prefixes has binary_sensor.dsc_zigbee_:', 'binary_sensor.dsc_zigbee_' in d['age_prefixes'])"
echo "=== toolchain timing (was >30 s before the fix)"
START=$(date +%s.%N)
curl -s -m 25 -o /tmp/tc.json -w "http=%{http_code}\n" $B/settings/esphome/toolchain
END=$(date +%s.%N)
python3 -c "print('toolchain elapsed %.1fs' % ($END - $START))"
python3 -c "import json; d=json.load(open('/tmp/tc.json')); print({k:d.get(k) for k in ('installed','latest','latest_error','build_backend','meets_min','dashboard_api')})" 2>/dev/null || echo "toolchain body not json"
echo "=== unknown route"
curl -s -o /dev/null -w "no-such-route http=%{http_code} type=%{content_type}\n" $B/settings/no-such-route

echo "=== QA bind: 0xqa00000000c02 -> co2_tent (qa_co2)"
curl -sf $B/settings/zigbee/bindings > /tmp/zb-bindings-orig.json
python3 - <<'PY'
import json, urllib.request
d = json.load(open('/tmp/zb-bindings-orig.json'))['bindings']
print('orig bindings', sorted(d))
d['0xqa00000000c02'] = {"role": "co2_tent", "zone": "4x8", "enabled": True, "friendly_name": "qa_co2", "alias": ""}
req = urllib.request.Request('http://127.0.0.1:8787/settings/zigbee/bindings', data=json.dumps({"bindings": d}).encode(),
                             headers={'Content-Type': 'application/json'}, method='PUT')
print('bind put http', urllib.request.urlopen(req, timeout=15).status)
PY
echo "$PW" | sudo -S docker exec dsc-hub-mosquitto mosquitto_pub -h 127.0.0.1 -t zigbee2mqtt/qa_co2 -m '{"co2":812,"voc":30,"linkquality":100}' 2>/dev/null && echo "published co2=812"
sleep 2
python3 - <<'PY'
import json, urllib.request
d = json.load(urllib.request.urlopen('http://127.0.0.1:8787/fleet?include_hass=true', timeout=20))
row = d['system'].get('zigbee_by_role', {}).get('co2_tent')
print('by_role co2_tent', {k: row.get(k) for k in ('co2', 'voc', 'kind', 'friendly_name')} if row else None)
hs = d.get('hass_states') or {}
for eid in ('sensor.dsc_zigbee_co2_tent_co2', 'sensor.dsc_zigbee_co2_tent_voc', 'sensor.dsc_zigbee_co2_tent_linkquality'):
    st = hs.get(eid)
    print(eid, '->', st and st.get('state'), st and (st.get('attributes') or {}).get('unit_of_measurement'))
t = json.load(urllib.request.urlopen('http://127.0.0.1:8787/settings/automations/targets', timeout=15))
print('targets.entities co2:', [e for e in t.get('entities', []) if 'co2' in e['entity_id']])
PY

echo "=== QA rule: banner when sensor.dsc_zigbee_co2_tent_co2 > 800"
python3 - <<'PY'
import json, urllib.request
s = json.load(urllib.request.urlopen('http://127.0.0.1:8787/settings/automations', timeout=15))
print('existing rules', [r.get('id') for r in s.get('rules', [])])
rule = {"id": "qa_co2_high", "name": "QA CO2 high (soak)", "enabled": True,
        "trigger": {"entity_id": "sensor.dsc_zigbee_co2_tent_co2", "op": "gt", "value": 800},
        "action": {"type": "banner", "params": {"text": "QA soak: CO2 above 800 ppm", "tone": "warn"}}}
req = urllib.request.Request('http://127.0.0.1:8787/settings/automations', data=json.dumps({"rules": [rule]}).encode(),
                             headers={'Content-Type': 'application/json'}, method='PUT')
print('rule put http', urllib.request.urlopen(req, timeout=15).status)
PY
sleep 1; curl -sf $B/fleet > /dev/null; sleep 2; curl -sf $B/fleet > /dev/null
python3 - <<'PY'
import json, urllib.request
d = json.load(urllib.request.urlopen('http://127.0.0.1:8787/fleet', timeout=20))
print('critical_banners', d['system'].get('critical_banners'))
s = json.load(urllib.request.urlopen('http://127.0.0.1:8787/settings/automations', timeout=15))
print('rule summary', json.dumps([r for r in s.get('rules', []) if r.get('id') == 'qa_co2_high'])[:600])
PY
echo "=== soak A done (QA bind + rule left in place for screenshot)"
