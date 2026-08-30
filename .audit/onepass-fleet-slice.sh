#!/bin/bash
set -euo pipefail
curl -s http://127.0.0.1:8787/fleet -o /tmp/fleet.json
python3 - <<'PY'
import json
d=json.load(open("/tmp/fleet.json"))
rs=d.get("root_steering") or {}
print("has_root_steering", bool(rs))
print("override", rs.get("override"), "lights_on", rs.get("lights_on"))
pots=rs.get("pots") or {}
for k in ("pot1","pot2","pot3","pot4"):
  p=pots.get(k) or {}
  print(k, "phase=", p.get("phase"), "reason=", p.get("reason"), "act=", p.get("act_allowed"))
print("canopy", d.get("canopy"))
print("twin keys", [k for k in ((d.get("hub") or {}).get("values") or {}) if "twin" in k.lower() or "sf1000" in k.lower()])
PY
