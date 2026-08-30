#!/bin/bash
set -euo pipefail
echo "=== z2m recent logs (join/interview/error) ==="
echo Digital | sudo -S docker logs dsc-hub-z2m --tail 120 2>&1 | grep -iE 'permit|interview|join|error|fail|unsupported|SNZB|leak|water|0xa4c138' | tail -60 || true
echo "=== z2m last 40 raw ==="
echo Digital | sudo -S docker logs dsc-hub-z2m --tail 40 2>&1 || true
echo "=== mosquitto bridge permit ==="
echo Digital | sudo -S docker exec dsc-hub-mosquitto mosquitto_sub -t 'zigbee2mqtt/bridge/#' -C 5 -W 3 2>/dev/null || true
