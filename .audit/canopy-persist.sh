#!/bin/bash
set -e
echo "=== BIND ==="
curl -s -m 8 -X PUT http://127.0.0.1:8787/settings/zigbee/bindings \
  -H 'Content-Type: application/json' \
  -d '{"bindings":{"0xqa001234567890ab":{"role":"canopy_4x8","zone":"4x8","enabled":true,"friendly_name":"qa_canopy","alias":"QA"}}}'
echo
echo "=== MQTT ==="
printf '%s\n' Digital | sudo -S docker exec dsc-hub-mosquitto mosquitto_pub -h 127.0.0.1 -t 'zigbee2mqtt/qa_canopy' -m '{"temperature":27.2,"humidity":58.5}'
sleep 1
echo "=== FLEET t+1 ==="
python3 <<'PY'
import json,urllib.request,time
for i in range(6):
  f=json.load(urllib.request.urlopen('http://127.0.0.1:8787/fleet',timeout=8))
  sys=f.get('system') or {}
  print(f't={i}', 'canopy', f.get('canopy'), 'by_role', sys.get('zigbee_by_role'), 'zkeys', [k for k in sys if 'zigbee' in k])
  time.sleep(2)
PY
echo "=== BINDINGS/HEALTH ==="
curl -s http://127.0.0.1:8787/settings/zigbee/bindings; echo
curl -s http://127.0.0.1:8787/settings/zigbee/health; echo
printf '%s\n' Digital | sudo -S docker logs dsc-hub-brain --tail 40 2>&1 | tail -40
