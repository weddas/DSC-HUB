#!/bin/bash
# Keep joining open + watch for canopy middle ieee (or any end device).
set -uo pipefail
LOG=/tmp/zb-pair-watch.log
TARGET_IEEE_COLON="a4:c1:38:ce:78:1c:d4:c1"
TARGET_IEEE_HEX="0xa4c138ce781cd4c1"
echo "pair-watch start $(date -Is) target=$TARGET_IEEE_HEX" | tee -a "$LOG"
for i in $(seq 1 180); do
  curl -s -m 5 -X POST http://127.0.0.1:8787/settings/zigbee/permit-join \
    -H 'Content-Type: application/json' -d '{"enabled":true,"duration_s":254}' >/dev/null || true
  DEV=$(curl -s -m 5 http://127.0.0.1:8787/settings/zigbee/devices || echo '{}')
  END=$(python3 -c "import json,sys; d=json.loads(sys.argv[1] or '{}'); print(sum(1 for x in d.get('devices') or [] if x.get('type')!='Coordinator'))" "$DEV" 2>/dev/null || echo 0)
  echo "$(date -Is) poll=$i end=$END" | tee -a "$LOG"
  if [ "$END" != "0" ]; then
    echo "JOINED $DEV" | tee -a "$LOG"
    bash /tmp/zb-integrate.run 2>&1 | tee -a "$LOG" || true
    # Prefer rename friendly name if this ieee
    python3 - <<'PY' || true
import json,urllib.request
BASE="http://127.0.0.1:8787"
devs=json.loads(urllib.request.urlopen(BASE+"/settings/zigbee/devices").read())
for d in devs.get("devices") or []:
    ieee=str(d.get("ieee_address") or "").lower().replace(":","")
    if ieee in ("0xa4c138ce781cd4c1","a4c138ce781cd4c1") or "a4c138ce781cd4c1" in ieee:
        print("matched canopy middle ieee", d)
PY
    exit 0
  fi
  sleep 20
done
echo "timeout $(date -Is)" | tee -a "$LOG"
exit 2
