#!/bin/bash
set -e
PW=Digital
curl -s -m 8 -X PUT http://127.0.0.1:8787/settings/zigbee/bindings \
  -H 'Content-Type: application/json' \
  -d '{"bindings":{"0xqa001234567890ab":{"role":"canopy_4x8","zone":"4x8","enabled":true,"friendly_name":"qa_canopy","alias":"QA"}}}'
echo
# republish canopy
echo "$PW" | sudo -S docker exec dsc-hub-mosquitto mosquitto_pub -h 127.0.0.1 -t zigbee2mqtt/qa_canopy -m '{"temperature":27.7,"humidity":59.0}'
curl -s -m 5 -X POST http://127.0.0.1:8787/settings/zigbee/permit-join -H 'Content-Type: application/json' -d '{"enabled":true,"duration_s":300}'; echo