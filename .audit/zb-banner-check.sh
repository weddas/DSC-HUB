#!/bin/bash
set -euo pipefail
echo Digital | sudo -S docker exec dsc-hub-mosquitto mosquitto_pub -t zigbee2mqtt/qa_tank_leak -m '{"water_leak":true}'
sleep 0.3
curl -sf http://127.0.0.1:8787/fleet | python3 -c 'import json,sys; s=json.load(sys.stdin).get("system") or {}; print("banners", s.get("critical_banners")); print("has", "critical_banners" in s)'
sleep 3
curl -sf http://127.0.0.1:8787/fleet | python3 -c 'import json,sys; s=json.load(sys.stdin).get("system") or {}; print("after3s banners", s.get("critical_banners")); print("has", "critical_banners" in s)'
# dry cleanup
echo Digital | sudo -S docker exec dsc-hub-mosquitto mosquitto_pub -t zigbee2mqtt/qa_tank_leak -m '{"water_leak":false}'
