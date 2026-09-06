#!/bin/bash
# Zigbee-completion live soak, part B: clear the QA rule (co2 back under threshold),
# remove the rule, restore the original bindings, prove nothing QA is left behind.
set -uo pipefail
PW="${1:-}"
B=http://127.0.0.1:8787

echo "=== publish co2=400 (below threshold) -> rule should clear"
echo "$PW" | sudo -S docker exec dsc-hub-mosquitto mosquitto_pub -h 127.0.0.1 -t zigbee2mqtt/qa_co2 -m '{"co2":400,"voc":12,"linkquality":100}' 2>/dev/null && echo "published co2=400"
sleep 1; curl -sf $B/fleet > /dev/null; sleep 2; curl -sf $B/fleet > /dev/null
python3 - <<'PY'
import json, urllib.request
d = json.load(urllib.request.urlopen('http://127.0.0.1:8787/fleet', timeout=20))
print('critical_banners after clear', d['system'].get('critical_banners'))
s = json.load(urllib.request.urlopen('http://127.0.0.1:8787/settings/automations', timeout=15))
print('rule summary', json.dumps([r for r in s.get('rules', []) if r.get('id') == 'qa_co2_high'])[:400])
PY

echo "=== remove QA rule (original rule list was empty)"
python3 - <<'PY'
import json, urllib.request
req = urllib.request.Request('http://127.0.0.1:8787/settings/automations', data=json.dumps({"rules": []}).encode(),
                             headers={'Content-Type': 'application/json'}, method='PUT')
print('rules cleared http', urllib.request.urlopen(req, timeout=15).status)
PY

echo "=== restore original bindings"
python3 - <<'PY'
import json, urllib.request
d = json.load(open('/tmp/zb-bindings-orig.json'))['bindings']
req = urllib.request.Request('http://127.0.0.1:8787/settings/zigbee/bindings', data=json.dumps({"bindings": d}).encode(),
                             headers={'Content-Type': 'application/json'}, method='PUT')
print('bindings restored http', urllib.request.urlopen(req, timeout=15).status, sorted(d))
PY
sleep 1
python3 - <<'PY'
import json, urllib.request
d = json.load(urllib.request.urlopen('http://127.0.0.1:8787/fleet?include_hass=true', timeout=20))
print('co2_tent still in by_role?', 'co2_tent' in (d['system'].get('zigbee_by_role') or {}))
print('qa entities left?', [e for e in (d.get('hass_states') or {}) if 'co2_tent' in e])
print('critical_banners', d['system'].get('critical_banners'))
b = json.load(urllib.request.urlopen('http://127.0.0.1:8787/settings/zigbee/bindings', timeout=15))['bindings']
print('bindings now', sorted(b))
PY
echo "=== soak B done"
