#!/bin/bash
# Hotpatch Pi cannalib sidecar with offset-aware standalone_server.py
set -euo pipefail
PW=Digital
SRC=/tmp/standalone_server.py
echo "$PW" | sudo -S docker cp "$SRC" dsc-hub-cannalib:/app/standalone_server.py
echo "$PW" | sudo -S timeout 45 docker restart dsc-hub-cannalib
sleep 5
echo "$PW" | sudo -S docker exec dsc-hub-cannalib python3 - <<'PY'
import json, urllib.request
for off in (0, 3):
    u = f"http://127.0.0.1:8790/v1/catalogs/strains?limit=2&offset={off}"
    d = json.load(urllib.request.urlopen(u, timeout=20))
    items = d.get("items") if isinstance(d, dict) else d
    print("off", off, items[0].get("id") if items else None)
PY
