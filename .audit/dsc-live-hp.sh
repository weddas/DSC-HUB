#!/bin/bash
set -euo pipefail
mkdir -p /tmp/dsc-live-spa /tmp/dsc-live-brain
tar -xzf /tmp/dsc-live-spa.tgz -C /tmp/dsc-live-spa
tar -xzf /tmp/dsc-live-brain.tgz -C /tmp/dsc-live-brain
echo Digital | sudo -S docker cp /tmp/dsc-live-spa/. dsc-hub-brain:/app/static/
echo Digital | sudo -S docker cp /tmp/dsc-live-brain/dsc_brain/compose_ops.py dsc-hub-brain:/app/dsc_brain/compose_ops.py
echo Digital | sudo -S docker stop -t 20 dsc-hub-brain
echo Digital | sudo -S docker start dsc-hub-brain
sleep 10
BUILT=$(grep -oE 'assets/index-[^"]+\.js' /tmp/dsc-live-spa/index.html | head -1)
LIVE=$(curl -sf http://127.0.0.1:8787/ | grep -oE 'assets/index-[^"]+\.js' | head -1 || true)
echo "BUILT=$BUILT"
echo "LIVE=$LIVE"
curl -sf http://127.0.0.1:8787/health
echo
echo Digital | sudo -S docker exec dsc-hub-brain grep -n 'Prefer script' /app/dsc_brain/compose_ops.py | head -3
