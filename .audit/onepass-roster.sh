#!/bin/bash
# Full one-pass evidence dump (Pi). Exit 0 always; prints BLOCKED if no end device.
set -u
BASE=http://127.0.0.1:8787
echo "=== TIME $(date -Is) ==="
echo "=== HEALTH ==="
curl -s "$BASE/health"; echo
echo "=== ZIGBEE HEALTH ==="
curl -s "$BASE/settings/zigbee/health"; echo
echo "=== ZIGBEE DEVICES ==="
curl -s "$BASE/settings/zigbee/devices"; echo
echo "=== ZIGBEE BINDINGS ==="
curl -s "$BASE/settings/zigbee/bindings"; echo
echo "=== ZIGBEE ROLES (count) ==="
curl -s "$BASE/settings/zigbee/roles" | python3 -c 'import sys,json;d=json.load(sys.stdin);r=d.get("roles") or d;print(len(r) if isinstance(r,list) else r)'
echo "=== FLEET SLICE ==="
curl -s "$BASE/fleet" -o /tmp/fleet.json
python3 - <<'PY'
import json
d=json.load(open("/tmp/fleet.json"))
print("canopy", d.get("canopy"))
print("zigbee_by_role", (d.get("system") or {}).get("zigbee_by_role"))
rs=d.get("root_steering") or {}
print("root_steering override", rs.get("override"), "lights_on", rs.get("lights_on"))
pots=rs.get("pots") or {}
for k in ("pot1","pot2","pot3","pot4"):
  p=pots.get(k) or {}
  print(k, "phase", p.get("phase"), "reason", p.get("reason"), "act", p.get("act_allowed"))
ctrl=((d.get("hub") or {}).get("values") or {}).get("controls") or {}
print("twin", ctrl.get("light.dsc_hub_twin_sf1000"))
print("pot3", (d.get("pots") or {}).get("pot3"))
print("pot4", (d.get("pots") or {}).get("pot4"))
PY
echo "=== IRRIGACT ==="
curl -s -X POST "$BASE/control/irrigation/shot" -H 'Content-Type: application/json' -d '{"pot_id":"pot1","duration_s":1}'; echo
echo "=== SOFTCAL ==="
curl -s -m 40 -X POST "$BASE/ai/soft-cal-advice" -H 'Content-Type: application/json' \
  -d '{"plant_name":"Amnesia Blue","stage":"flower","probe_index":1}' | python3 -c 'import sys,json;d=json.load(sys.stdin);print({k:d.get(k) for k in ("ok","ollama","seat","narrative") if k in d or True}); print("narrative_head",(d.get("narrative") or "")[:120])'
echo "=== PLANT UUIDS ==="
echo Digital | sudo -S docker exec dsc-hub-brain python3 -c "from dsc_brain.compose_store import get_roster_slots; print([(s.get('slot'),s.get('plant_uuid'),s.get('status')) for s in get_roster_slots() if s.get('plant_uuid') or s.get('status') not in (None,'','empty')])" 2>/dev/null || true
echo "=== WAITER ==="
pgrep -af '/tmp/zb-waiter.run' || echo DEAD
tail -3 /tmp/zb-waiter.log || true
END=$(curl -s "$BASE/settings/zigbee/health" | python3 -c 'import sys,json;print(json.load(sys.stdin).get("end_device_count",0))')
if [ "$END" = "0" ]; then
  echo "BLOCKED physical_end_device"
else
  echo "END_DEVICE_PRESENT count=$END"
  bash /tmp/zb-integrate.run || true
fi
