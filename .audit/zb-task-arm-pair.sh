#!/bin/bash
# Clean QA tank inject leftovers; open JOIN for physical leak sensor.
set -euo pipefail
BASE="http://127.0.0.1:8787"

echo "=== clear QA tank policy ==="
curl -sf -X PUT "$BASE/settings/zigbee/policies" -H 'Content-Type: application/json' \
  -d '{"policies":{}}' | python3 -c "import json,sys; print(json.load(sys.stdin))"

echo "=== remove QA leak binding (keep real devices) ==="
python3 <<'PY'
import json, urllib.request
base = "http://127.0.0.1:8787"
with urllib.request.urlopen(base + "/settings/zigbee/bindings") as r:
    bindings = json.load(r).get("bindings") or {}
removed = []
for ieee in list(bindings):
    if ieee.startswith("0xqa") or str(bindings[ieee].get("friendly_name") or "").startswith("qa_"):
        removed.append(ieee)
        bindings.pop(ieee, None)
req = urllib.request.Request(
    base + "/settings/zigbee/bindings",
    data=json.dumps({"bindings": bindings}).encode(),
    headers={"Content-Type": "application/json"},
    method="PUT",
)
with urllib.request.urlopen(req) as r:
    print("removed", removed, "kept", list(json.load(r)["bindings"].keys()))
PY

# Ensure dehumidifier in service after QA wet tests
python3 <<'PY'
import json, urllib.request
base = "http://127.0.0.1:8787"
req = urllib.request.Request(
    base + "/settings/inventory/dehumidifier",
    data=json.dumps({"in_service": True}).encode(),
    headers={"Content-Type": "application/json"},
    method="PATCH",
)
try:
    with urllib.request.urlopen(req) as r:
        print("dehumidifier", json.load(r))
except Exception as exc:
    # fallback via settings list
    print("inventory patch:", exc)
PY

echo "=== permit join 254s ==="
curl -sf -X POST "$BASE/settings/zigbee/permit-join" -H 'Content-Type: application/json' \
  -d '{"enabled":true,"duration_s":254}' | python3 -c "import json,sys; print(json.load(sys.stdin))"

curl -sf "$BASE/settings/zigbee/health" | python3 -c "import json,sys; h=json.load(sys.stdin); print('JOIN', h.get('permit_join'), 'radio', h.get('radio_up'), 'end_devices', h.get('end_device_count'))"
echo "=== ready for physical leak sensor pair ==="
