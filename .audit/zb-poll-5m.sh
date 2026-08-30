#!/bin/bash
# After ZHA leave of jar probe: keep join open and watch 5 minutes
set -euo pipefail
curl -s -X POST http://127.0.0.1:8787/settings/zigbee/permit-join \
  -H 'Content-Type: application/json' -d '{"enabled":true,"duration_s":254}'; echo
for i in $(seq 1 60); do
  h=$(curl -s http://127.0.0.1:8787/settings/zigbee/health)
  n=$(python3 -c "import json,sys; print(json.load(sys.stdin).get('end_device_count',0))" <<<"$h")
  echo "$(date -Is) poll=$i end=$n"
  if [ "$n" != "0" ]; then
    curl -s http://127.0.0.1:8787/settings/zigbee/devices; echo
    bash /tmp/zb-integrate.run || true
    exit 0
  fi
  if (( i % 10 == 0 )); then
    curl -s -X POST http://127.0.0.1:8787/settings/zigbee/permit-join \
      -H 'Content-Type: application/json' -d '{"enabled":true,"duration_s":254}' >/dev/null || true
  fi
  sleep 5
done
echo Digital | sudo -S docker logs dsc-hub-z2m --tail 80 2>&1 | grep -iE 'join|interview|announce' | tail -20 || echo no_join_lines
exit 1
