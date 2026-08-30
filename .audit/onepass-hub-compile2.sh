#!/bin/bash
set -e
PW=Digital
LOG=/home/dsc/hub-compile.log
rm -f "$LOG"
echo "$PW" | sudo -S bash -lc "timeout 360 docker exec -w /config dsc-hub-esphome esphome compile dsc-hub.yaml" > "$LOG" 2>&1
echo COMPILE_EXIT:$?
grep -E "ERROR|Successfully compiled|Failed config|error:" "$LOG" | tail -40
curl -s -m 5 http://127.0.0.1:8787/health | python3 -c "import sys,json; z=json.load(sys.stdin)['zigbee']; print('radio',z['radio_up'],z['bridge_state'])"