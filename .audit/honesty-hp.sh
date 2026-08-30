#!/bin/bash
set -euo pipefail
echo Digital | sudo -S docker cp /tmp/zigbee_mqtt.py dsc-hub-brain:/app/dsc_brain/zigbee_mqtt.py
echo Digital | sudo -S timeout 25 docker restart dsc-hub-brain
for i in $(seq 1 24); do
  if curl -s -m 3 http://127.0.0.1:8787/health >/tmp/h.json 2>/dev/null; then
    echo "brain_up"
    break
  fi
  sleep 3
done
curl -s -X POST http://127.0.0.1:8787/settings/zigbee/permit-join \
  -H 'Content-Type: application/json' -d '{"enabled":true,"duration_s":254}'; echo
sleep 2
curl -s http://127.0.0.1:8787/settings/zigbee/health; echo
# flap check: wait for a bridge/info cycle
sleep 8
curl -s http://127.0.0.1:8787/settings/zigbee/health; echo
# ensure forever waiter still running
if ! pgrep -f 'zb-forever.run' >/dev/null; then
  nohup bash /tmp/zb-forever.run >>/tmp/zb-forever.log 2>&1 &
  echo "restarted forever $!"
fi
if ! pgrep -f 'zb-agent-watch.run' >/dev/null; then
  nohup bash /tmp/zb-agent-watch.run >>/tmp/zb-agent-watch.log 2>&1 &
  echo "restarted watch $!"
fi
pgrep -af 'zb-forever.run|zb-agent-watch.run' | grep -v 'bash -c' || true
