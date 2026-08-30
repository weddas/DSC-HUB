#!/bin/bash
set -euo pipefail
BASE=http://127.0.0.1:8787
PW=Digital
echo "=== status ==="
curl -s "$BASE/settings/zigbee/health"; echo
curl -s "$BASE/settings/zigbee/devices"; echo
# Prove join-event → Unbound row (then leave) — not physical claim
echo "$PW" | sudo -S docker exec dsc-hub-mosquitto mosquitto_pub -h 127.0.0.1 \
  -t zigbee2mqtt/bridge/event \
  -m '{"type":"device_joined","data":{"friendly_name":"0xsimdeadbeef","ieee_address":"0xsimdeadbeef"}}'
sleep 1
echo "=== after simulated join ==="
curl -s "$BASE/settings/zigbee/devices"; echo
curl -s "$BASE/settings/zigbee/health"; echo
echo "$PW" | sudo -S docker exec dsc-hub-mosquitto mosquitto_pub -h 127.0.0.1 \
  -t zigbee2mqtt/bridge/event \
  -m '{"type":"device_leave","data":{"friendly_name":"0xsimdeadbeef","ieee_address":"0xsimdeadbeef"}}'
sleep 1
echo "=== after leave (clean) ==="
curl -s "$BASE/settings/zigbee/devices"; echo
pgrep -af '/tmp/zb-waiter.run' | head -1
tail -3 /tmp/zb-waiter.log
echo "=== canopy ==="
curl -s "$BASE/fleet" | python3 -c 'import json,sys;d=json.load(sys.stdin);print(d.get("canopy"))'
