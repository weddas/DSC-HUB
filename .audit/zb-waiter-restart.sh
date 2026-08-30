#!/bin/bash
set -e
tr -d '\r' </tmp/zb-waiter.sh >/tmp/zb-waiter.run
tr -d '\r' </tmp/fleetslice.sh >/tmp/fleetslice.run
bash /tmp/fleetslice.run
# kill old waiter (only the loop script)
OLD=$(pgrep -f '/tmp/zb-waiter.run' || true)
if [ -n "$OLD" ]; then kill $OLD 2>/dev/null || true; sleep 1; fi
nohup bash /tmp/zb-waiter.run >/tmp/zb-waiter.nohup 2>&1 &
echo "new_waiter_pid $!"
sleep 1
pgrep -af zb-waiter | head -3
tail -2 /tmp/zb-waiter.log