#!/bin/bash
# Temporary plug_pump bind + MQTT switch payload to prove IrrigAct beyond OOS.
set -e
curl -s -m 8 -X PUT http://127.0.0.1:8787/settings/zigbee/bindings \
  -H 'Content-Type: application/json' \
  -d '{"bindings":{
    "0xqa001234567890ab":{"role":"canopy_4x8","zone":"4x8","enabled":true,"friendly_name":"qa_canopy","alias":"QA"},
    "0xqa00pump00000001":{"role":"plug_pump","zone":"shared","enabled":true,"friendly_name":"qa_pump","alias":"QAPump"}
  }}'
echo
# seed device state cache so reapply knows the plug
printf '%s\n' Digital | sudo -S docker exec dsc-hub-mosquitto mosquitto_pub -h 127.0.0.1 -t 'zigbee2mqtt/qa_pump' -m '{"state":"OFF"}'
sleep 1
# subscribe briefly in background? just fire shot and check mosquitto logs / grow log
echo "=== IRRIG SHOT ==="
curl -s -m 10 -X POST http://127.0.0.1:8787/control/irrigation/shot \
  -H 'Content-Type: application/json' -d '{"pot_id":"pot1","duration_s":1}'
echo
# canopy still present?
python3 -c "import json,urllib.request; f=json.load(urllib.request.urlopen('http://127.0.0.1:8787/fleet',timeout=8)); print('canopy_role',(f.get('canopy') or {}).get('role')); print('by_role_keys',list(((f.get('system') or {}).get('zigbee_by_role') or {}).keys()))"
# z2m permit + devices
curl -s http://127.0.0.1:8787/settings/zigbee/health; echo
printf '%s\n' Digital | sudo -S docker logs dsc-hub-z2m --tail 20 2>&1 | tail -20
