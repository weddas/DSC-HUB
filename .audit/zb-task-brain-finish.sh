#!/bin/bash
set -euo pipefail
rm -rf /tmp/dsc_brain_hot && mkdir -p /tmp/dsc_brain_hot
tar -xzf /tmp/dsc_brain_hot.tgz -C /tmp/dsc_brain_hot
echo Digital | sudo -S docker cp /tmp/dsc_brain_hot/dsc_brain/. dsc-hub-brain:/app/dsc_brain/
echo "docker cp only - no restart (recipes API already live)"
test -f /tmp/dsc_brain_hot/dsc_brain/zigbee_policies.py && echo "zigbee_policies.py staged"