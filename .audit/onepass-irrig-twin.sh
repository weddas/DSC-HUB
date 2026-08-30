#!/bin/bash
set -e
PW=Digital
# Deploy irrigact + api hotpatch
cd /tmp && tar -xzf dsc_brain_hot.tgz
echo "$PW" | sudo -S docker cp /tmp/dsc_brain/irrigact.py dsc-hub-brain:/app/dsc_brain/irrigact.py
echo "$PW" | sudo -S docker cp /tmp/dsc_brain/api.py dsc-hub-brain:/app/dsc_brain/api.py
echo "$PW" | sudo -S docker cp /tmp/dsc_brain/zigbee_mqtt.py dsc-hub-brain:/app/dsc_brain/zigbee_mqtt.py
echo "$PW" | sudo -S timeout 8 docker kill -s KILL dsc-hub-brain || true
sleep 1
echo "$PW" | sudo -S timeout 20 docker start dsc-hub-brain
sleep 7
curl -s -m 5 -X POST http://127.0.0.1:8787/control/irrigation/shot -H 'Content-Type: application/json' -d '{"pot_id":"pot1"}'
echo
# Twin SF1000: sync hub yaml into esphome config and compile-check entity id (OTA if device reachable)
HUB_YAML=/opt/dsc-hub-repo/firmware/v4/dsc-hub-v4_0.yaml
if [ -f /tmp/dsc-hub-v4_0.yaml ]; then
  echo "$PW" | sudo -S cp /tmp/dsc-hub-v4_0.yaml "$HUB_YAML" || true
  echo "$PW" | sudo -S docker cp /tmp/dsc-hub-v4_0.yaml dsc-hub-esphome:/config/dsc-hub.yaml || true
fi
# Probe hub API entities for twin
python3 <<'PY'
import json,urllib.request
f=json.load(urllib.request.urlopen('http://127.0.0.1:8787/fleet', timeout=8))
vals=f.get('hub',{}).get('values') or {}
keys=[k for k in vals if 'twin' in k.lower() or 'sf1000' in k.lower()]
print('hub_keys', keys[:30])
print('hub_online', f.get('hub',{}).get('online'), 'fw', f.get('hub',{}).get('firmware'))
# inventory hub host
for row in f.get('inventory') or []:
  if row.get('seat_id')=='hub':
    print('hub_host', row.get('host'))
PY
# health zigbee soak
curl -s -m 5 http://127.0.0.1:8787/health | python3 -c 'import sys,json; z=json.load(sys.stdin).get("zigbee") or {}; print("radio",z.get("radio_up"),"bridge",z.get("bridge_state"),"devices",z.get("device_count"))'
