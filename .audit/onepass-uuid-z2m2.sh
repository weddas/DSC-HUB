#!/bin/bash
set -euo pipefail
for path in /compose /roster /settings/compose; do
  echo "=== $path ==="
  curl -s "http://127.0.0.1:8787$path" -o /tmp/ep.raw -w "http=%{http_code} bytes=%{size_download}\n"
  head -c 200 /tmp/ep.raw; echo
  python3 - <<'PY'
from pathlib import Path
raw=Path("/tmp/ep.raw").read_text(errors="replace")
import json
try:
  d=json.loads(raw)
except Exception as e:
  print("not json", e); raise SystemExit
found=[]
def walk(o, path=""):
  if isinstance(o, dict):
    for k,v in o.items():
      p=f"{path}.{k}" if path else k
      if isinstance(v,str) and ("plant:" in v or k in ("plant_uuid","plant_id","assigned_plant_id","uuid")):
        found.append((p,v))
      walk(v,p)
  elif isinstance(o, list):
    for i,v in enumerate(o[:80]):
      walk(v, f"{path}[{i}]")
walk(d)
print("keys", list(d)[:20] if isinstance(d,dict) else type(d))
print("plant hits", len(found))
for p,v in found[:30]:
  print(p, "=", v)
PY
done
echo "=== z2m data ==="
echo Digital | sudo -S ls -la /var/lib/dsc-hub/z2m/ 2>/dev/null | head -25
echo Digital | sudo -S docker exec dsc-hub-mosquitto mosquitto_sub -h 127.0.0.1 -t zigbee2mqtt/bridge/devices -C 1 -W 4 2>/dev/null | python3 -c 'import sys,json; d=json.load(sys.stdin); print("devices",len(d));
[print(x.get("type"), x.get("friendly_name"), x.get("ieee_address"), (x.get("definition") or {}).get("model")) for x in d]' || echo no_msg
echo "=== end check ==="
curl -s http://127.0.0.1:8787/settings/zigbee/health; echo
