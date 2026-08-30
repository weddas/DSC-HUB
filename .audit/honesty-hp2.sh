#!/bin/bash
# Apply zigbee_mqtt honesty hotpatch without docker restart (stop then start).
set -euo pipefail
echo Digital | sudo -S docker cp /tmp/zigbee_mqtt.py dsc-hub-brain:/app/dsc_brain/zigbee_mqtt.py
echo "copied"
# Prefer stop+start over restart — restart wedged this Pi 2026-08-30 ~18:32
echo Digital | sudo -S timeout 20 docker stop dsc-hub-brain
echo "stopped"
echo Digital | sudo -S timeout 30 docker start dsc-hub-brain
echo "started"
for i in $(seq 1 30); do
  if curl -s -m 3 http://127.0.0.1:8787/health >/tmp/h.json 2>/dev/null; then
    echo HEALTH_OK
    break
  fi
  sleep 2
done
curl -s -X POST http://127.0.0.1:8787/settings/zigbee/permit-join \
  -H 'Content-Type: application/json' -d '{"enabled":true,"duration_s":254}'; echo
sleep 3
echo "health1:"; curl -s http://127.0.0.1:8787/settings/zigbee/health; echo
sleep 8
echo "health2:"; curl -s http://127.0.0.1:8787/settings/zigbee/health; echo
# restore waiters
if [ -f /tmp/zb-forever.run ]; then
  pkill -f zb-forever.run 2>/dev/null || true
  nohup bash /tmp/zb-forever.run >>/tmp/zb-forever.log 2>&1 &
  echo forever_pid=$!
fi
if [ -f /tmp/zb-agent-watch.run ]; then
  pkill -f zb-agent-watch.run 2>/dev/null || true
  nohup bash /tmp/zb-agent-watch.run >>/tmp/zb-agent-watch.log 2>&1 &
  echo watch_pid=$!
fi
curl -s http://127.0.0.1:8787/settings/zigbee/devices; echo
echo DONE
