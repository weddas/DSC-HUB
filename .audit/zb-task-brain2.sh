#!/bin/bash
set -euo pipefail
rm -rf /tmp/dsc_brain_hot
mkdir -p /tmp/dsc_brain_hot
tar -xzf /tmp/dsc_brain_hot.tgz -C /tmp/dsc_brain_hot
echo Digital | sudo -S docker cp /tmp/dsc_brain_hot/dsc_brain/. dsc-hub-brain:/app/dsc_brain/
echo Digital | sudo -S timeout 20 docker stop dsc-hub-brain || true
echo Digital | sudo -S timeout 20 docker start dsc-hub-brain
for i in $(seq 1 25); do
  if curl -s -m 3 http://127.0.0.1:8787/health >/tmp/h.json 2>/dev/null; then
    python3 -c 'import json; d=json.load(open("/tmp/h.json")); print("ok", d.get("version"), "radio", (d.get("zigbee") or {}).get("radio_up"))'
    # prove new module present
    echo Digital | sudo -S docker exec dsc-hub-brain test -f /app/dsc_brain/zigbee_policies.py && echo "zigbee_policies.py present"
    curl -sf http://127.0.0.1:8787/settings/zigbee/recipes | python3 -c "import json,sys; print('recipes', [r['id'] for r in json.load(sys.stdin)['recipes']])"
    exit 0
  fi
  sleep 2
done
echo "brain did not return"
exit 1