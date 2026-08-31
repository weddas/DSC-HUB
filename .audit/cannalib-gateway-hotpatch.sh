#!/bin/bash
# Deploy offset-aware standalone_server.py to Digital-Gateway cannalib bind-mount
set -euo pipefail
REMOTE="/mnt/user/Digital-Documents/Digital Stealth Care/Projects/CannaLib/services/cannalib/standalone_server.py"
cp /tmp/standalone_server.py "$REMOTE"
chmod 644 "$REMOTE"
docker restart cannalib
sleep 4
python3 - <<'PY'
import json, urllib.request
for off in (0, 3):
    u = f"http://127.0.0.1:8790/v1/catalogs/strains?limit=2&offset={off}"
    d = json.load(urllib.request.urlopen(u, timeout=20))
    items = d.get("items") if isinstance(d, dict) else d
    print("off", off, items[0].get("id") if items else None)
PY
