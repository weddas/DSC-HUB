#!/bin/bash
set -e
PW=Digital
DEV=/dev/serial/by-id/usb-Nabu_Casa_SkyConnect_v1.0_de1fa3461992ed11b610c3d13b20a988-if00-port0
echo "$PW" | sudo -S docker stop dsc-hub-z2m || true
echo "$PW" | sudo -S timeout 8 docker kill -s KILL dsc-hub-z2m || true
sleep 2
ls -la /tmp/skyconnect_ncp.gbl
ls -l "$DEV"
echo "== probe =="
echo "$PW" | sudo -S universal-silabs-flasher --device "$DEV" probe 2>&1 | tee /tmp/skyconnect-probe.txt || true
echo "== flash =="
echo "$PW" | sudo -S universal-silabs-flasher --device "$DEV" flash --firmware /tmp/skyconnect_ncp.gbl 2>&1 | tee /tmp/skyconnect-flash.txt
echo "== start z2m =="
echo "$PW" | sudo -S timeout 20 docker start dsc-hub-z2m
sleep 20
echo "$PW" | sudo -S docker logs dsc-hub-z2m --tail 35 2>&1 | sed 's/\x1b\[[0-9;]*m//g'
curl -s -m 5 http://127.0.0.1:8787/health | python3 -c 'import sys,json; print(json.load(sys.stdin).get("zigbee"))'