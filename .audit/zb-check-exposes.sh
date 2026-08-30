#!/bin/bash
set -euo pipefail
echo Digital | sudo -S docker exec dsc-hub-mosquitto mosquitto_sub -C 1 -W 5 -t zigbee2mqtt/bridge/devices 2>/dev/null > /tmp/zb-devs.json
python3 <<'PY'
import json
devs=json.load(open("/tmp/zb-devs.json"))
want={"0xa4c1380d734f2033","0xa4c138b9e2b9b690","0xa4c1385a686af7df"}
for d in devs:
    ieee=(d.get("ieee_address") or "").lower()
    if ieee not in want:
        continue
    defn=d.get("definition") or {}
    exp=defn.get("exposes") or []
    props=[]
    for e in exp:
        if not isinstance(e, dict):
            continue
        n=e.get("name") or e.get("property")
        if n:
            props.append(n)
        for f in (e.get("features") or []):
            if isinstance(f, dict) and f.get("name"):
                props.append(f["name"])
    print(ieee, "model=", defn.get("model"), "vendor=", defn.get("vendor"))
    print("  exposes:", sorted(set(props)))
# also last state for the wet ieee
print("---")
PY
for ieee in 0xa4c1380d734f2033 0xa4c138b9e2b9b690 0xa4c1385a686af7df; do
  echo "state $ieee:"
  echo Digital | sudo -S docker exec dsc-hub-mosquitto mosquitto_sub -C 1 -W 2 -t "zigbee2mqtt/$ieee" 2>/dev/null || echo "(no msg)"
done
