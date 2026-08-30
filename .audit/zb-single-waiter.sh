#!/bin/bash
set -euo pipefail
tr -d '\r' < /tmp/zb-forever-waiter.sh > /tmp/zb-forever.run
tr -d '\r' < /tmp/onepass-zb-integrate.sh > /tmp/zb-integrate.run
chmod +x /tmp/zb-forever.run /tmp/zb-integrate.run
# Kill all join spam waiters; one forever is enough
pkill -f '/tmp/zb-waiter.run' 2>/dev/null || true
pkill -f '/tmp/zb-long.run' 2>/dev/null || true
pkill -f '/tmp/zb-pair-watch.run' 2>/dev/null || true
pkill -f '/tmp/zb-forever.run' 2>/dev/null || true
sleep 1
nohup bash /tmp/zb-forever.run >/tmp/zb-forever.nohup 2>&1 &
echo forever_pid=$!
sleep 2
curl -s -X POST http://127.0.0.1:8787/settings/zigbee/permit-join -H 'Content-Type: application/json' -d '{"enabled":true,"duration_s":254}'; echo
curl -s http://127.0.0.1:8787/settings/zigbee/health; echo
pgrep -af 'zb-forever|zb-pair|zb-waiter|zb-long' | head -10 || true
tail -3 /tmp/zb-forever.log || true
