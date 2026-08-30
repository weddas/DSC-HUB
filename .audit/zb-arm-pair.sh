#!/bin/bash
# Operator pairing window — keep join open and integrate first real end device.
set -uo pipefail
echo "=== arm permit ==="
curl -s -X POST http://127.0.0.1:8787/settings/zigbee/permit-join \
  -H 'Content-Type: application/json' -d '{"enabled":true,"duration_s":254}'; echo
curl -s http://127.0.0.1:8787/settings/zigbee/health; echo

# Ensure forever + integrate scripts are current
if [ -f /tmp/zb-forever-waiter.sh ]; then
  tr -d '\r' < /tmp/zb-forever-waiter.sh > /tmp/zb-forever.run 2>/dev/null || true
fi
if [ -f /tmp/onepass-zb-integrate.sh ]; then
  tr -d '\r' < /tmp/onepass-zb-integrate.sh > /tmp/zb-integrate.run 2>/dev/null || true
fi
if ! pgrep -f 'zb-forever.run' >/dev/null; then
  nohup bash /tmp/zb-forever.run >>/tmp/zb-forever.log 2>&1 &
  echo forever_started=$!
else
  echo forever_ok pid=$(pgrep -f 'zb-forever.run' | head -1)
fi

echo "=== watching 4 min for end device ==="
for i in $(seq 1 48); do
  curl -s -m 3 -X POST http://127.0.0.1:8787/settings/zigbee/permit-join \
    -H 'Content-Type: application/json' -d '{"enabled":true,"duration_s":254}' >/dev/null || true
  DEV=$(curl -s -m 5 http://127.0.0.1:8787/settings/zigbee/devices || echo '{}')
  REAL=$(printf '%s' "$DEV" | python3 -c '
import json,sys
d=json.load(sys.stdin)
n=0
for x in d.get("devices") or []:
    if x.get("type")=="Coordinator": continue
    ieee=str(x.get("ieee_address") or "").lower()
    fn=str(x.get("friendly_name") or "").lower()
    if ieee.startswith("0xqa") or ieee.startswith("0xsim") or fn.startswith("qa_"): continue
    n+=1
print(n)
')
  echo "$(date -Is) poll=$i real_ends=$REAL"
  if [ "$REAL" != "0" ] && [ -n "$REAL" ]; then
    echo "JOINED_REAL"
    echo "$DEV"
    bash /tmp/zb-integrate.run
    echo "=== post-integrate health ==="
    curl -s http://127.0.0.1:8787/settings/zigbee/health; echo
    curl -s http://127.0.0.1:8787/settings/zigbee/devices; echo
    curl -s http://127.0.0.1:8787/fleet | python3 -c 'import json,sys;d=json.load(sys.stdin);c=d.get("canopy") or {};print("canopy",{k:c.get(k) for k in ("temp_c","rh_pct","role","friendly_name")})'
    exit 0
  fi
  sleep 5
done
echo "NO_JOIN_IN_4MIN"
echo Digital | sudo -S docker logs dsc-hub-z2m --tail 40 2>&1 | grep -iE 'join|interview|announce|permit' | tail -25 || true
exit 1
