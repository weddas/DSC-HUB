#!/bin/bash
# Snapshot Zigbee + look for any join noise
set -euo pipefail
echo "=== health ==="
curl -s http://127.0.0.1:8787/settings/zigbee/health; echo
echo "=== devices ==="
curl -s http://127.0.0.1:8787/settings/zigbee/devices; echo
echo "=== forever log tail ==="
tail -20 /tmp/zb-forever.log 2>/dev/null || true
echo "=== z2m log join/interview ==="
docker logs dsc-zigbee2mqtt --tail 80 2>&1 | grep -iE 'join|interview|permit|device_joined|Interview|Successfully' || echo "(no join lines)"
