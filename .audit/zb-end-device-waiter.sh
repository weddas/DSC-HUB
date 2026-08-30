#!/bin/bash
# Aggressive join keep-open: refresh every 20s with duration 254 so network never closes.
LOG=/tmp/zb-waiter.log
echo "waiter aggressive $(date -Is)" >> "$LOG"
for i in $(seq 1 1440); do
  curl -s -m 5 -X POST http://127.0.0.1:8787/settings/zigbee/permit-join \
    -H 'Content-Type: application/json' \
    -d '{"enabled":true,"duration_s":254}' >/dev/null || true
  DEV=$(curl -s -m 5 http://127.0.0.1:8787/settings/zigbee/devices)
  END=$(python3 -c "import json,sys; d=json.loads(sys.argv[1]); print(sum(1 for x in d.get('devices') or [] if x.get('type')!='Coordinator'))" "$DEV")
  echo "$(date -Is) end_devices=$END" >> "$LOG"
  if [ "$END" != "0" ]; then
    echo "JOINED $DEV" >> "$LOG"
    bash /tmp/zb-integrate.run >> "$LOG" 2>&1 || true
    echo "JOINED"
    exit 0
  fi
  sleep 20
done
echo "timeout $(date -Is)" >> "$LOG"
exit 1
