#!/bin/bash
# Long poll: keep join open; auto-integrate on first end device; exit 0 on success.
set -euo pipefail
BASE=http://127.0.0.1:8787
LOG=/tmp/zb-long.out
: > "$LOG"
echo "long poll start $(date -Is)" | tee -a "$LOG"
for i in $(seq 1 90); do
  curl -s -X POST "$BASE/settings/zigbee/permit-join" \
    -H 'Content-Type: application/json' -d '{"enabled":true,"duration_s":254}' >/dev/null || true
  H=$(curl -s "$BASE/settings/zigbee/health" || echo '{}')
  END=$(python3 -c "import json,sys; print(json.loads(sys.argv[1]).get('end_device_count',0))" "$H" 2>/dev/null || echo 0)
  echo "$(date -Is) poll=$i end=$END" | tee -a "$LOG"
  if [ "$END" != "0" ]; then
    curl -s "$BASE/settings/zigbee/devices" | tee -a "$LOG"
    bash /tmp/zb-integrate.run 2>&1 | tee -a "$LOG"
    exit 0
  fi
  sleep 20
done
echo still_zero | tee -a "$LOG"
exit 2
