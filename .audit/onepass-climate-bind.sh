#!/bin/bash
# Prove Climate consumers: bind + MQTT + check fleet + hass canopy sensors
curl -s -m 8 -X PUT http://127.0.0.1:8787/settings/zigbee/bindings \
  -H 'Content-Type: application/json' \
  -d '{"bindings":{"0xqa001234567890ab":{"role":"canopy_4x8","zone":"4x8","enabled":true,"friendly_name":"qa_canopy","alias":"QA"}}}'
echo
docker exec dsc-hub-mosquitto mosquitto_pub -h 127.0.0.1 -t 'zigbee2mqtt/qa_canopy' -m '{"temperature":26.1,"humidity":57.0}' 2>/dev/null \
  || printf '%s\n' Digital | sudo -S docker exec dsc-hub-mosquitto mosquitto_pub -h 127.0.0.1 -t 'zigbee2mqtt/qa_canopy' -m '{"temperature":26.1,"humidity":57.0}'
sleep 2
python3 <<'PY'
import json,urllib.request
f=json.load(urllib.request.urlopen('http://127.0.0.1:8787/fleet', timeout=8))
print('canopy', f.get('canopy'))
print('by_role', (f.get('system') or {}).get('zigbee_by_role'))
c=json.load(urllib.request.urlopen('http://127.0.0.1:8787/fleet/computed', timeout=8))
e=c.get('hass_extras') or {}
for k in sorted(e):
  if 'canopy' in k or 'zigbee_canopy' in k:
    row=e[k]; print(k, row.get('state') if isinstance(row,dict) else row)
PY
