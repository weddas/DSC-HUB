#!/bin/bash
set -eu
PASS="$1"
run_sudo() { echo "$PASS" | sudo -S "$@"; }

tar -xzf /tmp/dsc-brain-src.tgz -C /opt/dsc-hub-repo/brain
cp /tmp/dsc-hub.yaml /opt/dsc-hub-repo/firmware/v4/dsc-hub.yaml
run_sudo install -m 600 /tmp/dsc-hub.env /opt/dsc-hub/.env
run_sudo install -m 600 /tmp/dsc-hub.env /opt/dsc-hub-repo/services/dsc-hub/.env
run_sudo chown -R dsc:dsc /opt/dsc-hub-repo/brain

echo "=== firmware ==="
grep espnow_control /opt/dsc-hub-repo/firmware/v4/dsc-hub.yaml
test -f /opt/dsc-hub-repo/brain/dsc_brain/appliance_driver.py && echo appliance_driver_ok
grep wpa_passphrase /etc/dsc-hub/hostapd.conf || true

echo "=== reload brain env from .env ==="
run_sudo cp /opt/dsc-hub/.env /tmp/dsc-hub-compose.env
run_sudo chmod 644 /tmp/dsc-hub-compose.env
run_sudo rm -f $'/opt/dsc-hub/.env\r' 2>/dev/null || true
run_sudo docker compose -f /opt/dsc-hub/docker-compose.yml --env-file /tmp/dsc-hub-compose.env up -d --force-recreate brain

echo "=== hot-patch brain container ==="
run_sudo docker cp /opt/dsc-hub-repo/brain/dsc_brain/. dsc-hub-brain:/app/dsc_brain/
run_sudo docker restart dsc-hub-brain
sleep 3
curl -s http://127.0.0.1:8787/health
run_sudo docker exec dsc-hub-brain python -c "import dsc_brain.appliance_driver as a; print('driver_ok', list(a.DEMAND_TO_SEAT.keys()))"
run_sudo docker logs dsc-hub-brain --tail 20
