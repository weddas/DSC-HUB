#!/bin/bash
# Safe brain module hotpatch — stop+start with timeout (never bare kill/restart)
set -euo pipefail
echo Digital | sudo -S docker cp /tmp/dsc_brain_hot/. dsc-hub-brain:/app/dsc_brain/
echo Digital | sudo -S timeout 20 docker stop dsc-hub-brain || true
echo Digital | sudo -S timeout 20 docker start dsc-hub-brain
for i in $(seq 1 25); do
  if curl -s -m 3 http://127.0.0.1:8787/health >/tmp/h.json 2>/dev/null; then
    python3 -c 'import json; d=json.load(open("/tmp/h.json")); print("ok", d.get("version"), "radio", (d.get("zigbee") or {}).get("radio_up"))'
    exit 0
  fi
  sleep 2
done
echo "brain did not return"
exit 1
