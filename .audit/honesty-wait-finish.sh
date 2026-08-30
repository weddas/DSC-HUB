#!/bin/bash
set -euo pipefail
echo Digital | sudo -S docker cp /tmp/zigbee_mqtt.py dsc-hub-brain:/app/dsc_brain/zigbee_mqtt.py
# Fresh post-power-cycle Docker only - timed stop/start (not restart)
echo Digital | sudo -S timeout 15 docker stop dsc-hub-brain
echo Digital | sudo -S timeout 30 docker start dsc-hub-brain
for i in $(seq 1 40); do
  if curl -s -m 3 http://127.0.0.1:8787/health >/tmp/h.json 2>/dev/null; then
    echo HEALTH_OK
    break
  fi
  sleep 2
done
curl -s -X POST http://127.0.0.1:8787/settings/zigbee/permit-join -H "Content-Type: application/json" -d "{\"enabled\":true,\"duration_s\":254}"; echo
sleep 3
echo HEALTH1=$(curl -s http://127.0.0.1:8787/settings/zigbee/health)
sleep 8
echo HEALTH2=$(curl -s http://127.0.0.1:8787/settings/zigbee/health)
if [ -f /tmp/zb-forever.run ]; then
  pkill -f zb-forever.run 2>/dev/null || true
  nohup bash /tmp/zb-forever.run >>/tmp/zb-forever.log 2>&1 &
fi
if [ -f /tmp/zb-agent-watch.run ]; then
  pkill -f zb-agent-watch.run 2>/dev/null || true
  nohup bash /tmp/zb-agent-watch.run >>/tmp/zb-agent-watch.log 2>&1 &
fi
pgrep -af "zb-forever.run|zb-agent-watch.run" | grep -v "bash -c" || true
echo DONE
