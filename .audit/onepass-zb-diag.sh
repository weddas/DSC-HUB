#!/bin/bash
set -euo pipefail
BASE=http://127.0.0.1:8787
echo "=== health ==="
curl -s "$BASE/settings/zigbee/health"; echo
echo "=== devices ==="
curl -s "$BASE/settings/zigbee/devices"; echo
echo "=== waiter ==="
pgrep -af '/tmp/zb-waiter.run' || echo DEAD
tail -4 /tmp/zb-waiter.log || true
echo "=== z2m info / channel ==="
echo Digital | sudo -S docker exec dsc-hub-mosquitto mosquitto_sub -h 127.0.0.1 -t zigbee2mqtt/bridge/info -C 1 -W 3 2>/dev/null | python3 -c '
import sys,json
d=json.load(sys.stdin)
net=d.get("network") or d.get("config") or {}
print("permit_join", d.get("permit_join"))
print("version", d.get("version"))
print("coordinator", d.get("coordinator") or d.get("coordinator_ieee"))
cfg=d.get("config") or {}
adv=cfg.get("advanced") or {}
print("channel", adv.get("channel"), "pan_id", adv.get("pan_id"))
print("keys", sorted(d.keys())[:40])
' || echo no_info
echo "=== recent z2m (non-permit) ==="
echo Digital | sudo -S timeout 8 docker logs dsc-hub-z2m --tail 120 2>&1 | grep -ivE 'permit_join|allowing new devices' | tail -30 || true
echo "=== USB stick ==="
ls -l /dev/serial/by-id/ 2>/dev/null || true
ls -l /dev/ttyUSB* /dev/ttyACM* 2>/dev/null || true
