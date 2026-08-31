#!/bin/bash
set -euo pipefail
mkdir -p /tmp/stress-spa
tar -xzf /tmp/stress-spa.tgz -C /tmp/stress-spa
echo Digital | sudo -S docker cp /tmp/stress-spa/. dsc-hub-brain:/app/static/
head -5 /tmp/stress-spa/index.html
