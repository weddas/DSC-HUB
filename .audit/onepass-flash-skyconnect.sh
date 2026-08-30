#!/bin/bash
set -e
PW=Digital
DEV=/dev/serial/by-id/usb-Nabu_Casa_SkyConnect_v1.0_de1fa3461992ed11b610c3d13b20a988-if00-port0
echo "$PW" | sudo -S docker stop dsc-hub-z2m || true
echo "$PW" | sudo -S timeout 8 docker kill -s KILL dsc-hub-z2m || true
sleep 2
ls -l "$DEV"

if ! command -v universal-silabs-flasher >/dev/null 2>&1; then
  echo "$PW" | sudo -S pip3 install --break-system-packages -q 'universal-silabs-flasher'
fi
universal-silabs-flasher --version

echo "== probe =="
echo "$PW" | sudo -S universal-silabs-flasher --device "$DEV" info 2>&1 | tee /tmp/skyconnect-info.txt || true

cd /tmp
FW_URL="https://github.com/NabuCasa/silabs-firmware-builder/releases/download/v2026.02.23/skyconnect_zigbee_ncp_7.5.1.0.gbl"
curl -fL --retry 3 -o skyconnect_ncp.gbl "$FW_URL"
ls -la skyconnect_ncp.gbl

echo "== flash =="
echo "$PW" | sudo -S universal-silabs-flasher --device "$DEV" flash --firmware /tmp/skyconnect_ncp.gbl 2>&1 | tee /tmp/skyconnect-flash.txt

CFG=/var/lib/dsc-hub/z2m/configuration.yaml
echo "$PW" | sudo -S grep -E 'adapter|port|baudrate|rtscts' "$CFG" || true

echo "$PW" | sudo -S timeout 20 docker start dsc-hub-z2m
sleep 18
echo "$PW" | sudo -S docker logs dsc-hub-z2m --tail 40 2>&1 | sed 's/\x1b\[[0-9;]*m//g' | tee /tmp/z2m-after-flash.txt
curl -s -m 5 http://127.0.0.1:8787/health | python3 -c 'import sys,json; print(json.load(sys.stdin).get("zigbee"))'
