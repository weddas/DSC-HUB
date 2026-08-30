#!/bin/bash
set -euo pipefail
echo "=== health ==="
curl -s http://127.0.0.1:8787/settings/zigbee/health; echo
echo "=== devices ==="
curl -s http://127.0.0.1:8787/settings/zigbee/devices; echo
echo "=== code on disk in container ==="
echo Digital | sudo -S docker exec dsc-hub-brain grep -c permit_end_still_open /app/dsc_brain/zigbee_mqtt.py || echo "MISSING_HOTPATCH"
echo "=== waiters ==="
pgrep -af 'zb-forever.run|zb-agent-watch.run' | grep -v 'bash -c' || echo "no waiters"
echo "=== flap check ==="
curl -s -X POST http://127.0.0.1:8787/settings/zigbee/permit-join \
  -H 'Content-Type: application/json' -d '{"enabled":true,"duration_s":254}'; echo
sleep 6
curl -s http://127.0.0.1:8787/settings/zigbee/health; echo
# ensure waiters
if [ -f /tmp/zb-forever.run ] && ! pgrep -f 'zb-forever.run' >/dev/null; then
  nohup bash /tmp/zb-forever.run >>/tmp/zb-forever.log 2>&1 &
  echo restarted_forever=$!
fi
if [ -f /tmp/zb-agent-watch.run ] && ! pgrep -f 'zb-agent-watch.run' >/dev/null; then
  nohup bash /tmp/zb-agent-watch.run >>/tmp/zb-agent-watch.log 2>&1 &
  echo restarted_watch=$!
fi
