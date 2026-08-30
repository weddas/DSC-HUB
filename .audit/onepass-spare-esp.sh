#!/bin/bash
set -euo pipefail
curl -s http://127.0.0.1:8787/fleet -o /tmp/fleet.json
python3 <<'PY'
import json
d=json.load(open("/tmp/fleet.json"))
inv=d.get("inventory") or []
print("inventory", len(inv))
for i in inv:
    if not isinstance(i, dict):
        continue
    seat=i.get("seat_id") or i.get("id") or i.get("name")
    print(seat, "online=", i.get("online"), "in_service=", i.get("in_service"), "role=", i.get("role"), "ip=", (i.get("extra") or {}).get("ip") or i.get("ip"))
# esphome list via common endpoints
PY
for p in /esphome/status /settings/esphome /control/esphome; do
  code=$(curl -s -o /tmp/ep.json -w '%{http_code}' "http://127.0.0.1:8787$p" || true)
  echo "GET $p -> $code bytes=$(wc -c </tmp/ep.json)"
done
# ping common kit hosts?
for ip in 33 34 35 36 37 38 39 40 41 42 43; do
  if ping -c 1 -W 1 192.168.86.$ip >/dev/null 2>&1; then echo "up 192.168.86.$ip"; fi
done
# z2m still open?
curl -s http://127.0.0.1:8787/settings/zigbee/health; echo
pgrep -af zb-forever | head -2
