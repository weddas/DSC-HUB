#!/bin/bash
# Background: wait for first Zigbee end device; keep permit join refreshed.
PW=Digital
LOG=/tmp/zb-waiter.log
echo "waiter start $(date -Is)" > "$LOG"
for i in $(seq 1 60); do
  curl -s -m 5 -X POST http://127.0.0.1:8787/settings/zigbee/permit-join \
    -H 'Content-Type: application/json' -d '{"enabled":true,"duration_s":120}' >/dev/null || true
  DEV=$(curl -s -m 5 http://127.0.0.1:8787/settings/zigbee/devices)
  END=$(python3 -c "import json,sys; d=json.loads(sys.argv[1]); print(sum(1 for x in d.get('devices') or [] if x.get('type')!='Coordinator'))" "$DEV")
  echo "$(date -Is) end_devices=$END" >> "$LOG"
  if [ "$END" != "0" ]; then
    echo "JOINED $DEV" >> "$LOG"
    echo "JOINED"
    echo "$DEV"
    exit 0
  fi
  sleep 30
done
echo "timeout no end device" >> "$LOG"
exit 1
