#!/bin/bash
set -euo pipefail
# Ensure forever waiter is the only long-lived join keeper; refresh integrate script.
echo Digital | sudo -S true
tr -d '\r' < /tmp/zb-forever-waiter.sh > /tmp/zb-forever.run
tr -d '\r' < /tmp/onepass-zb-integrate.sh > /tmp/zb-integrate.run
chmod +x /tmp/zb-forever.run /tmp/zb-integrate.run

# Kill finite waiters (keep z2m/brain alone)
pkill -f '/tmp/zb-long.run' 2>/dev/null || true
pkill -f '/tmp/zb-waiter.run' 2>/dev/null || true
pkill -f '/tmp/zb5m.run' 2>/dev/null || true
sleep 1

if pgrep -f '/tmp/zb-forever.run' >/dev/null; then
  echo "forever already running: $(pgrep -af '/tmp/zb-forever.run')"
else
  nohup bash /tmp/zb-forever.run >/tmp/zb-forever.nohup 2>&1 &
  echo "started forever pid=$!"
fi
sleep 2
tail -5 /tmp/zb-forever.log || true
curl -s http://127.0.0.1:8787/settings/zigbee/health; echo

echo "=== z2m device mounts ==="
echo Digital | sudo -S docker inspect dsc-hub-z2m --format '{{json .HostConfig.Devices}} {{json .HostConfig.Binds}}' 2>/dev/null | python3 -m json.tool 2>/dev/null || \
  echo Digital | sudo -S docker inspect dsc-hub-z2m --format '{{json .HostConfig.Devices}}'
echo
echo Digital | sudo -S docker exec dsc-hub-z2m sh -c 'ls -la /dev/ttyACM* /dev/ttyUSB* 2>/dev/null; ls -la /dev/serial/by-id 2>/dev/null; cat /app/data/configuration.yaml'
