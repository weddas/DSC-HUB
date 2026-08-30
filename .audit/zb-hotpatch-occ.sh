#!/bin/bash
# Hotpatch zigbee_policies only — timeout restart, never bare kill
set -euo pipefail
echo Digital | sudo -S docker cp /tmp/zigbee_policies.py dsc-hub-brain:/app/dsc_brain/zigbee_policies.py
echo Digital | sudo -S timeout 25 docker restart dsc-hub-brain || {
  echo "restart failed — power-cycle; do NOT kill"
  exit 1
}
for i in $(seq 1 25); do
  if curl -s -m 3 http://127.0.0.1:8787/health >/tmp/h.json 2>/dev/null; then
    if curl -s -m 3 http://127.0.0.1:8787/settings/zigbee/recipes | grep -q tank_full; then
      echo "brain OK recipes live"
      python3 -c 'import json; d=json.load(open("/tmp/h.json")); print("version", d.get("version"))'
      exit 0
    fi
  fi
  sleep 2
done
echo "brain did not return"
exit 1
