#!/bin/bash
set -euo pipefail
IEEE="0xa4c1380d734f2033"
echo "=== z2m devices.json entry ==="
echo Digital | sudo -S docker exec dsc-hub-z2m cat /app/data/devices.yaml 2>/dev/null | head -5 || true
# devices often in database.db or devices.yaml - try bridge devices via mqtt
echo Digital | sudo -S docker exec dsc-hub-mosquitto mosquitto_pub -t zigbee2mqtt/bridge/request/device/interview -m "{\"id\":\"$IEEE\"}" 2>/dev/null || true
sleep 1
echo "=== last interview / identify for this ieee ==="
echo Digital | sudo -S docker logs dsc-hub-z2m --tail 200 2>&1 | grep -i "$IEEE\|SNZB\|leak\|water\|SJCG\|TS0207\|flood" | tail -40
echo "=== live state subscribe 3s ==="
echo Digital | sudo -S docker exec dsc-hub-mosquitto mosquitto_sub -v -t "zigbee2mqtt/$IEEE" -W 3 2>/dev/null || true
echo "=== bridge devices dump (python filter) ==="
echo Digital | sudo -S docker exec dsc-hub-mosquitto mosquitto_sub -t zigbee2mqtt/bridge/devices -C 1 -W 5 2>/dev/null | python3 -c "
import json,sys
raw=sys.stdin.read()
if not raw.strip():
  print('no devices dump')
  raise SystemExit
devs=json.loads(raw)
for d in devs:
  ieee=d.get('ieee_address') or d.get('ieeeAddress')
  if ieee in ('0xa4c1380d734f2033','0xa4c138b9e2b9b690','0xa4c1385a686af7df'):
    defn=d.get('definition') or {}
    print('---', ieee)
    print(' model', defn.get('model'), 'vendor', defn.get('vendor'), 'desc', defn.get('description'))
    print(' type', d.get('type'), 'friendly', d.get('friendly_name'))
    exposes=defn.get('exposes') or []
    names=[e.get('name') for e in exposes if isinstance(e,dict) and e.get('name')]
    print(' exposes', names)
    print(' fingerprint', d.get('model_id'), d.get('manufacturer'), d.get('manufacturerID'))
"
