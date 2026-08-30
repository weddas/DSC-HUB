#!/bin/bash
set -e
tr -d '\r' </tmp/zb-waiter.sh >/tmp/zb-waiter.run
OLD=$(pgrep -f '/tmp/zb-waiter.run' || true)
if [ -n "$OLD" ]; then kill $OLD 2>/dev/null || true; sleep 1; fi
nohup bash /tmp/zb-waiter.run >/tmp/zb-waiter.nohup 2>&1 &
echo new_pid $!
sleep 2
# confirm network open via bridge info
echo Digital | sudo -S docker exec dsc-hub-mosquitto mosquitto_sub -h 127.0.0.1 -t zigbee2mqtt/bridge/info -C 1 -W 3 2>/dev/null | python3 -c 'import sys,json;d=json.load(sys.stdin);print("permit_join",d.get("permit_join"),"end",d.get("permit_join_end"))'
curl -s http://127.0.0.1:8787/settings/zigbee/health; echo
tail -3 /tmp/zb-waiter.log