#!/bin/bash
set -e
PW=Digital
echo "$PW" | sudo -S cp /tmp/dsc-hub-stub.yaml /opt/dsc-hub-repo/firmware/v4/dsc-hub.yaml
wc -l /opt/dsc-hub-repo/firmware/v4/dsc-hub.yaml /opt/dsc-hub-repo/firmware/v4/dsc-hub-v4_0.yaml
head -5 /opt/dsc-hub-repo/firmware/v4/dsc-hub.yaml
grep -c 'Twin SF1000' /opt/dsc-hub-repo/firmware/v4/dsc-hub-v4_0.yaml || true
echo "$PW" | sudo -S timeout 360 docker exec -w /config dsc-hub-esphome esphome compile dsc-hub.yaml > /tmp/hub-compile.log 2>&1
echo COMPILE_EXIT:$?
grep -E 'ERROR|Successfully compiled|Failed config|error:' /tmp/hub-compile.log | tail -30
# radio still ok
curl -s -m 5 http://127.0.0.1:8787/health | python3 -c 'import sys,json; z=json.load(sys.stdin)["zigbee"]; print("radio",z["radio_up"],z["bridge_state"])'
