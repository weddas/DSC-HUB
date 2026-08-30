#!/bin/bash
set -euo pipefail
BASE=http://127.0.0.1:8787
echo Digital | sudo -S docker exec dsc-hub-mosquitto mosquitto_pub -h 127.0.0.1 -t zigbee2mqtt/qa_canopy -m '{"temperature":27.6,"humidity":57.5}'
sleep 1
curl -s "$BASE/fleet" -o /tmp/fleet.json
python3 - <<'PY'
import json
d=json.load(open("/tmp/fleet.json"))
print("canopy", d.get("canopy"))
print("zigbee_by_role", (d.get("system") or {}).get("zigbee_by_role"))
h=(d.get("hub") or {}).get("values") or {}
for k in sorted(h):
  lk=k.lower()
  if any(x in lk for x in ("twin","sf1000","ir_","remote","honesty","ac_")):
    print("hub", k, h[k])
PY
echo "=== waiter ==="
pgrep -af zb-waiter || echo DEAD
tail -8 /tmp/zb-waiter.log || true
# if waiter dead, restart
if ! pgrep -f zb-waiter >/dev/null; then
  nohup bash /tmp/zb-waiter.run >/tmp/zb-waiter.nohup 2>&1 &
  echo restarted_waiter $!
fi
curl -s -X POST "$BASE/settings/zigbee/permit-join" -H 'Content-Type: application/json' -d '{"permit":true,"time_s":254}'; echo
curl -s "$BASE/settings/zigbee/health"; echo
