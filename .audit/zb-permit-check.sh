#!/bin/bash
# Diagnose permit_join flaps + remaining options
set -euo pipefail
curl -s -X POST http://127.0.0.1:8787/settings/zigbee/permit-join \
  -H 'Content-Type: application/json' -d '{"enabled":true,"duration_s":254}'; echo

echo Digital | sudo -S docker logs dsc-hub-z2m --tail 40 2>&1 | grep -iE 'permit|join|interview|INTERPAN|error' | tail -30

echo "=== mqtt subscribers? ==="
# who publishes permit_join false?
echo Digital | sudo -S docker exec dsc-hub-mosquitto mosquitto_sub -h 127.0.0.1 -v -t 'zigbee2mqtt/bridge/#' -W 8 2>/dev/null | head -40 || true

echo "=== health after 5s ==="
sleep 5
curl -s http://127.0.0.1:8787/settings/zigbee/health; echo
