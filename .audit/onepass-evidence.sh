#!/bin/bash
set -euo pipefail
echo "=== health ==="
curl -s http://127.0.0.1:8787/settings/zigbee/health; echo
echo "=== devices ==="
curl -s http://127.0.0.1:8787/settings/zigbee/devices; echo
echo "=== bindings ==="
curl -s http://127.0.0.1:8787/settings/zigbee/bindings; echo
echo "=== fleet canopy + by_role ==="
curl -s http://127.0.0.1:8787/fleet -o /tmp/fleet.json
python3 <<'PY'
import json
d=json.load(open("/tmp/fleet.json"))
c=d.get("canopy") or {}
print("canopy", {k:c.get(k) for k in ("temp_c","rh_pct","humidity","role","friendly_name","updated_at")})
sys=(d.get("system") or {})
print("by_role", sys.get("zigbee_by_role"))
print("bindings", sys.get("zigbee_device_bindings"))
PY
# SoftCal / IrrigAct / root / twin quick
curl -s http://127.0.0.1:8787/control/root-steering | python3 -c 'import json,sys;d=json.load(sys.stdin);print("root_steering pots", list((d.get("pots") or {}).keys())[:6] if isinstance(d.get("pots"),dict) else type(d.get("pots")))'
curl -s -X POST http://127.0.0.1:8787/control/irrigation/shot -H 'Content-Type: application/json' -d '{"probe":1,"duration_s":1}' | head -c 180; echo
curl -s http://127.0.0.1:8787/ | grep -oE 'assets/index-[^"]+' | head -1
