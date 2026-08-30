#!/bin/bash
set -euo pipefail
echo Digital | sudo -S docker exec dsc-hub-brain sh -c 'python3 - <<"PY"
from pathlib import Path
import os, time
zb = Path("/app/dsc_brain/zigbee_mqtt.py").read_text()
esp = Path("/app/dsc_brain/esphome_client.py").read_text()
print("device_joined", "device_joined" in zb)
print("permit_live", "_update_permit_join_from_bridge" in zb)
print("apply_cache", "apply_zigbee_cache_to_state" in esp)
print("irrigact", Path("/app/dsc_brain/irrigact.py").exists())
print("root_steering", Path("/app/dsc_brain/root_steering.py").exists())
print("soft_cal_ai", Path("/app/dsc_brain/soft_cal_ai.py").exists())
for f in ("zigbee_mqtt.py","esphome_client.py","irrigact.py"):
    p=f"/app/dsc_brain/{f}"
    print(f, "mtime", time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(os.path.getmtime(p))))
PY'
echo "=== containers ==="
echo Digital | sudo -S docker ps --format '{{.Names}} {{.Status}}' | grep -E 'brain|z2m|mosq' || true
echo "=== plant uuid paths ==="
curl -s http://127.0.0.1:8787/fleet -o /tmp/fleet.json
python3 - <<'PY'
import json
d=json.load(open("/tmp/fleet.json"))
found=[]
def walk(o, path=""):
  if isinstance(o, dict):
    for k,v in o.items():
      p=f"{path}.{k}" if path else k
      if isinstance(v,str) and ("plant:" in v or k in ("plant_uuid","plant_id","uuid")):
        found.append((p,v))
      walk(v,p)
  elif isinstance(o, list):
    for i,v in enumerate(o[:100]):
      walk(v, f"{path}[{i}]")
walk(d)
print("hits", len(found))
for p,v in found[:40]:
  print(p, "=", v)
# common compose nests
for key in ("compose","roster","plants","slots","kit"):
  if key in d:
    print("top", key, type(d[key]).__name__)
PY
# try common endpoints
for path in /compose /roster /settings/compose /control/compose /fleet/compose; do
  code=$(curl -s -o /tmp/ep.json -w '%{http_code}' "http://127.0.0.1:8787$path" || true)
  echo "GET $path -> $code"
done
echo "=== zb poll ==="
curl -s http://127.0.0.1:8787/settings/zigbee/health; echo
tail -3 /tmp/zb-waiter.log
