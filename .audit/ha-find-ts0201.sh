#!/bin/bash
# Probe house HA for TS0201 / zigbee temp entities (token from secrets if present).
set -euo pipefail
HA="${HA_URL:-http://192.168.86.2:8123}"
TOK=""
for f in /opt/dsc-hub-repo/config/secrets.yaml /var/lib/dsc-hub/secrets.yaml /home/dsc/secrets.yaml; do
  if [ -f "$f" ]; then
    TOK=$(grep -E 'ha_token|hass_token|long_lived' "$f" 2>/dev/null | head -1 | sed 's/.*:\s*//' | tr -d '"' | tr -d "'" || true)
  fi
done
# try without auth first
code=$(curl -s -o /tmp/ha_api.json -w '%{http_code}' -m 5 "$HA/api/" || echo 000)
echo "HA $HA /api -> $code"
if [ -n "$TOK" ]; then
  curl -s -m 20 -H "Authorization: Bearer $TOK" -H "Content-Type: application/json" \
    "$HA/api/states" -o /tmp/ha_states.json -w "states_http=%{http_code}\n" || true
  if [ -f /tmp/ha_states.json ]; then
    python3 - <<'PY'
import json
try:
  d=json.load(open("/tmp/ha_states.json"))
except Exception as e:
  print("parse fail", e); raise SystemExit
if not isinstance(d, list):
  print("not list", type(d), str(d)[:200]); raise SystemExit
hits=[]
for st in d:
  eid=str(st.get("entity_id") or "")
  name=str((st.get("attributes") or {}).get("friendly_name") or "")
  blob=(eid+" "+name).lower()
  if any(k in blob for k in ("ts0201","temp_probe","temp/humidity","zigbee","zha","canopy")):
    hits.append((eid, name, st.get("state"), (st.get("attributes") or {}).get("device_class")))
print("hits", len(hits))
for row in hits[:40]:
  print(row)
# also ieee in attributes
ieee=[]
for st in d:
  a=st.get("attributes") or {}
  for k,v in a.items():
    if "ieee" in str(k).lower() or (isinstance(v,str) and v.startswith("0x") and len(v)>=15):
      ieee.append((st.get("entity_id"), k, v))
print("ieee-ish", len(ieee))
for row in ieee[:20]:
  print(row)
PY
  fi
else
  echo "no token found on pi"
fi
