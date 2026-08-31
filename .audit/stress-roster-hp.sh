#!/bin/bash
set -euo pipefail
mkdir -p /tmp/stress-spa /tmp/stress-brain
tar -xzf /tmp/stress-spa.tgz -C /tmp/stress-spa
tar -xzf /tmp/stress-brain.tgz -C /tmp/stress-brain
echo Digital | sudo -S docker cp /tmp/stress-spa/. dsc-hub-brain:/app/static/
echo Digital | sudo -S docker cp /tmp/stress-brain/dsc_brain/. dsc-hub-brain:/app/dsc_brain/
echo Digital | sudo -S timeout 45 docker restart dsc-hub-brain
sleep 8
curl -sf http://127.0.0.1:8787/health | head -c 120
