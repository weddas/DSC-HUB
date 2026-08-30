#!/bin/bash
# Aggressive poll for end-device after Tent Top leave
set -euo pipefail
for i in $(seq 1 36); do
  h=$(curl -s http://127.0.0.1:8787/settings/zigbee/health)
  n=$(python3 -c "import json,sys; print(json.load(sys.stdin).get('end_device_count',0))" <<<"$h")
  pj=$(python3 -c "import json,sys; print(json.load(sys.stdin).get('permit_join'))" <<<"$h")
  echo "$(date -Iseconds) poll=$i end=$n permit=$pj"
  if [ "$n" != "0" ]; then
    echo "JOINED"
    curl -s http://127.0.0.1:8787/settings/zigbee/devices; echo
    # trigger integrate if script present
    if [ -f /tmp/zb-integrate.run ]; then
      bash /tmp/zb-integrate.run || true
    elif [ -f /tmp/onepass-zb-integrate.run ]; then
      bash /tmp/onepass-zb-integrate.run || true
    fi
    exit 0
  fi
  # keep join open
  curl -s -X POST http://127.0.0.1:8787/settings/zigbee/permit-join \
    -H 'Content-Type: application/json' \
    -d '{"enabled":true,"duration_s":254}' >/dev/null || true
  sleep 5
done
echo "NO_JOIN_AFTER_180s"
docker logs dsc-zigbee2mqtt --tail 100 2>&1 | grep -iE 'join|interview|leave|announce|permit' | tail -40 || true
exit 1
