#!/bin/bash
set -euo pipefail
echo Digital | sudo -S docker exec dsc-hub-brain python3 <<'PY'
from pathlib import Path
zb = Path("/app/dsc_brain/zigbee_mqtt.py").read_text()
esp = Path("/app/dsc_brain/esphome_client.py").read_text()
print("device_joined", "device_joined" in zb)
print("permit_live", "_update_permit_join_from_bridge" in zb)
print("apply_cache", "apply_zigbee_cache_to_state" in esp)
print("irrigact", Path("/app/dsc_brain/irrigact.py").exists())
print("root_steering", Path("/app/dsc_brain/root_steering.py").exists())
print("soft_cal_ai", Path("/app/dsc_brain/soft_cal_ai.py").exists())
import os, time
for f in ("zigbee_mqtt.py","esphome_client.py","irrigact.py"):
    p=f"/app/dsc_brain/{f}"
    print(f, "mtime", time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(os.path.getmtime(p))))
PY
echo "=== containers ==="
echo Digital | sudo -S docker ps --format '{{.Names}} {{.Status}}' | grep -E 'brain|z2m|mosq' || true
echo "=== compose plant ids ==="
curl -s http://127.0.0.1:8787/compose 2>/dev/null | python3 -c 'import sys,json
try:
 d=json.load(sys.stdin)
except Exception as e:
 print("no compose",e); raise SystemExit
slots=d.get("slots") or d.get("plants") or d
print(type(slots).__name__)
if isinstance(slots, dict):
  for k,v in list(slots.items())[:8]:
    if isinstance(v,dict):
      print(k, {x:v.get(x) for x in ("plant_uuid","plant_id","uuid","name","slot")})
    else:
      print(k,v)
elif isinstance(slots, list):
  for v in slots[:6]:
    if isinstance(v,dict):
      print({x:v.get(x) for x in ("plant_uuid","plant_id","uuid","name","slot","id")})
' || curl -s http://127.0.0.1:8787/roster | head -c 400
echo
echo "=== zb5m ==="
tail -8 /tmp/zb5m.out 2>/dev/null || true
curl -s http://127.0.0.1:8787/settings/zigbee/health; echo
