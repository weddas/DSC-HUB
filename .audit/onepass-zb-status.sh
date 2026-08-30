#!/bin/bash
set -euo pipefail
curl -s -X POST http://127.0.0.1:8787/settings/zigbee/permit-join \
  -H 'Content-Type: application/json' -d '{"enabled":true,"duration_s":254}'; echo
sleep 1
curl -s http://127.0.0.1:8787/settings/zigbee/health; echo
curl -s http://127.0.0.1:8787/settings/zigbee/devices; echo
tail -3 /tmp/zb-waiter.log
pgrep -af '/tmp/zb-waiter.run' | head -1
