#!/bin/bash
curl -s http://127.0.0.1:8787/fleet | python3 - <<'PY'
import json,sys
d=json.load(sys.stdin)
c=d.get("canopy") or {}
print("canopy", {k:c.get(k) for k in ("temp_c","rh_pct","role","friendly_name")})
b=(d.get("system") or {}).get("zigbee_device_bindings") or {}
print("bindings", b)
PY
curl -s http://127.0.0.1:8787/settings/zigbee/bindings; echo
