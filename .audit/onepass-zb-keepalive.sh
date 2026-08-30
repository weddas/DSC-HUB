#!/bin/bash
set -euo pipefail
BASE=http://127.0.0.1:8787
curl -s -X POST "$BASE/settings/zigbee/permit-join" -H 'Content-Type: application/json' -d '{"enabled":true,"duration_s":254}'; echo
curl -s "$BASE/settings/zigbee/health"; echo
curl -s "$BASE/settings/zigbee/devices"; echo
pgrep -af '/tmp/zb-waiter.run' || (tr -d '\r' </tmp/zb-waiter.sh >/tmp/zb-waiter.run; nohup bash /tmp/zb-waiter.run >/tmp/zb-waiter.nohup 2>&1 & echo restarted $!)
tail -3 /tmp/zb-waiter.log || true
curl -s "$BASE/" | grep -oE 'assets/index-[^"]+' | head -1
# canopy still?
curl -s "$BASE/fleet" | python3 -c 'import json,sys;d=json.load(sys.stdin);print("canopy",d.get("canopy"));print("twin", ((d.get("hub") or {}).get("values") or {}).get("controls",{}).get("light.dsc_hub_twin_sf1000"))'
# z2m network open?
echo Digital | sudo -S docker logs dsc-hub-z2m --tail 15 2>&1 | grep -iE 'join|error|online|device' | tail -10 || true