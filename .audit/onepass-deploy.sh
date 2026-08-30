#!/bin/bash
set -e
PW=Digital
echo "$PW" | sudo -S docker cp /tmp/dsc_brain_hot/. dsc-hub-brain:/app/dsc_brain/
echo "$PW" | sudo -S rm -rf /tmp/dsc-spa-unpack
echo "$PW" | sudo -S mkdir -p /tmp/dsc-spa-unpack
echo "$PW" | sudo -S tar -xzf /tmp/dsc-spa-hotpatch.tgz -C /tmp/dsc-spa-unpack
echo "$PW" | sudo -S mkdir -p /opt/dsc-hub-repo/brain/static
echo "$PW" | sudo -S rsync -a --delete /tmp/dsc-spa-unpack/ /opt/dsc-hub-repo/brain/static/
echo "$PW" | sudo -S docker cp /opt/dsc-hub-repo/brain/static/. dsc-hub-brain:/app/static/
echo "$PW" | sudo -S timeout 8 docker kill -s HUP dsc-hub-brain || echo "$PW" | sudo -S timeout 8 docker kill -s KILL dsc-hub-brain || true
sleep 1
echo "$PW" | sudo -S timeout 20 docker start dsc-hub-brain
sleep 7
echo "$PW" | sudo -S grep -oE 'assets/index-[^"]+' /opt/dsc-hub-repo/brain/static/index.html | head -1
curl -s -m 8 http://127.0.0.1:8787/health | python3 -c 'import sys,json; d=json.load(sys.stdin); z=d.get("zigbee") or {}; print("ver",d.get("version"),"radio",z.get("radio_up"),"bridge",z.get("bridge_state"))'
curl -s -m 5 http://127.0.0.1:8787/settings/zigbee/roles | python3 -c 'import sys,json; d=json.load(sys.stdin); print("roles",len(d.get("roles") or []))'
curl -s -m 5 http://127.0.0.1:8787/settings/zigbee/bindings | python3 -c 'import sys,json; d=json.load(sys.stdin); print("bindings",list((d.get("bindings") or {}).keys())[:5])'
ls -l /dev/ttyACM0 2>/dev/null || echo no_ttyACM0
echo "$PW" | sudo -S docker ps --filter name=z2m --format '{{.Names}} {{.Status}}'