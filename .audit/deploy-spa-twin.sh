#!/bin/bash
set -e
PW=Digital
echo "$PW" | sudo -S rm -rf /tmp/dsc-spa-unpack; echo "$PW" | sudo -S mkdir -p /tmp/dsc-spa-unpack
echo "$PW" | sudo -S tar -xzf /tmp/dsc-spa-hotpatch.tgz -C /tmp/dsc-spa-unpack
echo "$PW" | sudo -S rsync -a --delete /tmp/dsc-spa-unpack/ /opt/dsc-hub-repo/brain/static/
echo "$PW" | sudo -S docker cp /opt/dsc-hub-repo/brain/static/. dsc-hub-brain:/app/static/
curl -s http://127.0.0.1:8787/ | grep -oE 'assets/index-[^"]+' | head -1
echo "$PW" | sudo -S docker exec dsc-hub-mosquitto mosquitto_pub -h 127.0.0.1 -t zigbee2mqtt/qa_canopy -m '{"temperature":27.4,"humidity":56.0}'
curl -s http://127.0.0.1:8787/settings/zigbee/health; echo
tail -2 /tmp/zb-waiter.log