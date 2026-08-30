#!/bin/bash
set -e
tr -d '\r' </tmp/zb-integrate.sh >/tmp/zb-integrate.run
chmod +x /tmp/zb-integrate.run
curl -s -X POST http://127.0.0.1:8787/settings/zigbee/permit-join \
  -H 'Content-Type: application/json' -d '{"enabled":true,"duration_s":254}' ; echo
echo Digital | sudo -S timeout 20 docker exec dsc-hub-mosquitto mosquitto_sub -h 127.0.0.1 -t 'zigbee2mqtt/#' -v 2>/dev/null | grep -v bridge | head -30 || echo no_device_mqtt
pgrep -af '/tmp/zb-waiter.run' | head -1
tail -2 /tmp/zb-waiter.log