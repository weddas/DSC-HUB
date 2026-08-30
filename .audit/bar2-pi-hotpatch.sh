#!/bin/bash
set -euo pipefail
mkdir -p /tmp/bar2-spa /tmp/bar2-brain
tar -xzf /tmp/bar2-spa.tgz -C /tmp/bar2-spa
tar -xzf /tmp/bar2-brain.tgz -C /tmp/bar2-brain
mkdir -p /opt/dsc-hub-repo/brain/static
rsync -a --delete /tmp/bar2-spa/ /opt/dsc-hub-repo/brain/static/
docker cp /opt/dsc-hub-repo/brain/static/. dsc-hub-brain:/app/static/
docker cp /tmp/bar2-brain/dsc_brain/plant_probe.py dsc-hub-brain:/app/dsc_brain/plant_probe.py
docker cp /tmp/bar2-brain/dsc_brain/compose_ops.py dsc-hub-brain:/app/dsc_brain/compose_ops.py
docker cp /tmp/bar2-brain/dsc_brain/api.py dsc-hub-brain:/app/dsc_brain/api.py
docker restart dsc-hub-brain
sleep 5
curl -sS -o /dev/null -w "http=%{http_code}\n" http://127.0.0.1:8787/
grep -oE 'assets/index-[^"]+\.js' /opt/dsc-hub-repo/brain/static/index.html | head -1
python3 -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8787/openapi.json', timeout=10).read(); print('openapi_ok')"
