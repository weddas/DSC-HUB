#!/bin/bash
curl -s -m 8 -X PUT http://127.0.0.1:8787/settings/zigbee/bindings \
  -H 'Content-Type: application/json' \
  -d '{"bindings":{"0xqa001234567890ab":{"role":"canopy_4x8","zone":"4x8","enabled":true,"friendly_name":"qa_canopy","alias":"QA"}}}'
echo
printf '%s\n' Digital | sudo -S docker exec dsc-hub-mosquitto mosquitto_pub -h 127.0.0.1 -t 'zigbee2mqtt/qa_canopy' -m '{"temperature":26.1,"humidity":57.0}'
sleep 1
python3 <<'PY'
import json,urllib.request
f=json.load(urllib.request.urlopen('http://127.0.0.1:8787/fleet',timeout=8))
print('canopy', f.get('canopy'))
print('by_role', (f.get('system') or {}).get('zigbee_by_role'))
print('system_keys', list((f.get('system') or {}).keys())[:40])
b=json.load(urllib.request.urlopen('http://127.0.0.1:8787/settings/zigbee/bindings',timeout=8))
print('bindings', b)
PY
# find spa
printf '%s\n' Digital | sudo -S find /opt/dsc-hub /home/dsc -name 'index-*.js' 2>/dev/null | head -20
printf '%s\n' Digital | sudo -S sh -c 'grep -l "Zigbee by role" /opt/dsc-hub/homeassistant/custom_components/dsc_hub/frontend/spa-dist/assets/index-*.js 2>/dev/null; ls -la /opt/dsc-hub/homeassistant/custom_components/dsc_hub/frontend/spa-dist/assets/index-*.js 2>/dev/null | head'
curl -s -m 5 http://127.0.0.1:8787/ | head -20