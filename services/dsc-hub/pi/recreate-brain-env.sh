#!/bin/bash
set -eu
PASS="${1:-Digital}"
run_sudo() { echo "$PASS" | sudo -S "$@"; }

cd /opt/dsc-hub
# Remove accidental Windows-upload duplicate .env (CR in filename)
run_sudo find /opt/dsc-hub -maxdepth 1 -name '.env*' -print
run_sudo rm -f $'/opt/dsc-hub/.env\r' 2>/dev/null || true

run_sudo cp /opt/dsc-hub/.env /tmp/dsc-hub-compose.env
run_sudo chmod 644 /tmp/dsc-hub-compose.env

run_sudo docker compose -f /opt/dsc-hub/docker-compose.yml --env-file /tmp/dsc-hub-compose.env config | grep DSC_HUB_API_KEY || true
run_sudo docker compose -f /opt/dsc-hub/docker-compose.yml --env-file /tmp/dsc-hub-compose.env up -d --force-recreate brain
run_sudo docker cp /opt/dsc-hub-repo/brain/dsc_brain/. dsc-hub-brain:/app/dsc_brain/
run_sudo docker restart dsc-hub-brain
sleep 10
run_sudo docker exec dsc-hub-brain sh -c 'echo KEYLEN=${#DSC_HUB_API_KEY}'
curl -s http://127.0.0.1:8787/health
echo
curl -s http://127.0.0.1:8787/fleet | python3 -c "import sys,json; d=json.load(sys.stdin); h=d['hub']; print('hub online', h['online'], 'fw', h.get('firmware')); print('appliance', d.get('appliance',{}))"
