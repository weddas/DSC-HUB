#!/bin/bash
# Post-power-cycle one-pass evidence pack (no PowerShell quoting).
set -euo pipefail
BASE=http://127.0.0.1:8787

echo "=== time ==="
date -Is

echo "=== zigbee health ==="
curl -s -X POST "$BASE/settings/zigbee/permit-join" \
  -H 'Content-Type: application/json' -d '{"enabled":true,"duration_s":254}'; echo
curl -s "$BASE/settings/zigbee/health"; echo
curl -s "$BASE/settings/zigbee/devices"; echo

echo "=== irrigact ==="
curl -s -X POST "$BASE/control/irrigation/shot" \
  -H 'Content-Type: application/json' -d '{"pot_id":"pot1","duration_s":1}'; echo

echo "=== softcal ==="
curl -s -X POST "$BASE/ai/soft-cal-advice" \
  -H 'Content-Type: application/json' \
  -d '{"pot_id":"pot1","mode":"climate"}' | head -c 800; echo

echo "=== root_steering ==="
curl -s "$BASE/control/root-steering" | head -c 600; echo

echo "=== fleet slice ==="
curl -s "$BASE/fleet" -o /tmp/fleet.json -w "http=%{http_code} bytes=%{size_download}\n"
python3 <<'PY'
import json
d=json.load(open("/tmp/fleet.json"))
print("canopy", d.get("canopy"))
sysm=d.get("system") or {}
print("zigbee_by_role keys", list((sysm.get("zigbee_by_role") or {}).keys()))
rs=d.get("root_steering")
if isinstance(rs, dict):
    print("root_steering pots", list((rs.get("pots") or rs).keys())[:8] if rs else None)
else:
    print("root_steering", type(rs).__name__)
pots=d.get("pots") or {}
for pid in ("pot1","pot2","pot3","pot4"):
    p=pots.get(pid) or {}
    print(pid, {
        "sensor_fault": p.get("sensor_fault"),
        "modbus_probe_online": p.get("modbus_probe_online"),
        "plant_uuid": p.get("plant_uuid") or p.get("plant_id"),
        "in_service": p.get("in_service"),
    })
# twin entity
hub=((d.get("hub") or {}).get("values") or {})
controls=hub.get("controls") or {}
twin=controls.get("light.dsc_hub_twin_sf1000") or controls.get("twin_sf1000")
print("twin", twin)
# plant: hits
s=json.dumps(d)
print("plant: count", s.count("plant:"))
print("twin_sf1000 count", s.count("twin_sf1000"))
PY

echo "=== spa asset ==="
curl -s "$BASE/" | grep -oE 'assets/index-[^"]+' | head -1

echo "=== waiter ==="
pgrep -af '/tmp/zb-waiter.run' | head -1 || echo NO_WAITER
tail -2 /tmp/zb-waiter.log || true
tail -5 /tmp/zb5m.out 2>/dev/null || true

echo "=== z2m recent ==="
echo Digital | sudo -S docker logs dsc-hub-z2m --tail 40 2>&1 \
  | grep -iE 'join|interview|device annou|Successfully interviewed|error|HOST_FATAL' | tail -20 || true
