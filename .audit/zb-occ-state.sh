#!/bin/bash
set -euo pipefail
# z2m container name may vary
for c in dsc-hub-z2m dsc-hub-zigbee2mqtt; do
  if echo Digital | sudo -S docker exec "$c" true 2>/dev/null; then
    CTR=$c
    break
  fi
done
echo "container=$CTR"
echo Digital | sudo -S docker exec "$CTR" cat /app/data/state.json > /tmp/z2m-state.json
python3 <<'PY'
import json
d=json.load(open("/tmp/z2m-state.json"))
for k in ["0xa4c1380d734f2033","0xa4c138b9e2b9b690","0xa4c1385a686af7df"]:
    s=d.get(k) or {}
    print(k, "occupancy=", s.get("occupancy"), "full=", {x:s.get(x) for x in ("occupancy","battery","linkquality","voltage")})
PY
