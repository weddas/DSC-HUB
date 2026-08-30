#!/bin/bash
set -euo pipefail
echo Digital | sudo -S mkdir -p /tmp/dsc-spa-unpack /opt/dsc-hub-repo/brain/static
echo Digital | sudo -S tar -xzf /tmp/dsc-spa-hotpatch.tgz -C /tmp/dsc-spa-unpack
echo Digital | sudo -S rsync -a --delete /tmp/dsc-spa-unpack/ /opt/dsc-hub-repo/brain/static/
echo Digital | sudo -S docker cp /opt/dsc-hub-repo/brain/static/. dsc-hub-brain:/app/static/
# api.py default duration — present on disk for next recycle; SPA already sends 254
if [ -f /tmp/api.py ]; then
  echo Digital | sudo -S docker cp /tmp/api.py dsc-hub-brain:/app/dsc_brain/api.py
fi
curl -s http://127.0.0.1:8787/ | grep -oE 'assets/index-[^"]+' | head -1
curl -s -X POST http://127.0.0.1:8787/settings/zigbee/permit-join \
  -H 'Content-Type: application/json' -d '{"enabled":true,"duration_s":254}'; echo
curl -s http://127.0.0.1:8787/settings/zigbee/health; echo
pgrep -af '/tmp/zb-forever.run' | head -1 || echo NO_FOREVER
tail -3 /tmp/zb-forever.log || true
