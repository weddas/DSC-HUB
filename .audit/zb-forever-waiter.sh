#!/bin/bash
# Keep JOIN OPEN; integrate only a real (non-qa/sim) end device; do not exit on smoke joins.
set -uo pipefail
LOG=/tmp/zb-forever.log
echo "forever start $(date -Is)" | tee -a "$LOG"
while true; do
  curl -s -m 5 -X POST http://127.0.0.1:8787/settings/zigbee/permit-join \
    -H 'Content-Type: application/json' -d '{"enabled":true,"duration_s":254}' >/dev/null || true
  DEV=$(curl -s -m 5 http://127.0.0.1:8787/settings/zigbee/devices || echo '{}')
  REAL=$(printf '%s' "$DEV" | python3 -c '
import json,sys
d=json.load(sys.stdin)
n=0
for x in d.get("devices") or []:
    if x.get("type")=="Coordinator":
        continue
    ieee=str(x.get("ieee_address") or "").lower()
    fn=str(x.get("friendly_name") or "").lower()
    if ieee.startswith("0xqa") or ieee.startswith("0xsim") or fn.startswith("qa_"):
        continue
    n+=1
print(n)
')
  echo "$(date -Is) real_end_devices=$REAL" | tee -a "$LOG"
  if [ "$REAL" != "0" ] && [ -n "$REAL" ]; then
    echo "JOINED_REAL $DEV" | tee -a "$LOG"
    if bash /tmp/zb-integrate.run 2>&1 | tee -a "$LOG"; then
      echo "INTEGRATE_OK $(date -Is)" | tee -a "$LOG"
      exit 0
    fi
    echo "INTEGRATE_RETRY $(date -Is)" | tee -a "$LOG"
  fi
  sleep 30
done
