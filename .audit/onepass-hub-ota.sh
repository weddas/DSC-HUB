#!/bin/bash
set -e
PW=Digital
if ! ping -c 1 -W 3 10.42.0.10 >/dev/null 2>&1; then
  echo HUB_UNREACHABLE
  exit 2
fi
echo "$PW" | sudo -S bash -lc "timeout 300 docker exec -w /config dsc-hub-esphome esphome upload dsc-hub.yaml --device 10.42.0.10" > /home/dsc/hub-ota.log 2>&1
echo OTA_EXIT:$?
grep -E "Successfully uploaded|ERROR|Failed|Took" /home/dsc/hub-ota.log | tail -20
sleep 15
# wait for hub api
for i in 1 2 3 4 5 6 7 8 9 10; do
  online=$(curl -s -m 3 http://127.0.0.1:8787/fleet | python3 -c "import sys,json; print(json.load(sys.stdin).get('hub',{}).get('online'))" 2>/dev/null || echo False)
  echo try_$i online=$online
  [ "$online" = "True" ] && break
  sleep 3
done
curl -s -m 5 http://127.0.0.1:8787/fleet | python3 -c "import sys,json; f=json.load(sys.stdin); h=f.get('hub') or {}; print('online',h.get('online'),'fw',h.get('firmware')); ks=[k for k in (h.get('values') or {}) if 'twin' in k.lower() or 'sf1000' in k.lower()]; print('keys',ks[:25])"
