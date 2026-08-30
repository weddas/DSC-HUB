#!/bin/bash
# Full one-pass requirement evidence after physical pair
set -euo pipefail
B=http://127.0.0.1:8787
echo "=== ZIGBEE PHYSICAL PATH ==="
curl -s $B/settings/zigbee/health; echo
curl -s $B/settings/zigbee/devices | python3 -c 'import json,sys;d=json.load(sys.stdin);
for x in d.get("devices")or[]:
  if x.get("type")!="Coordinator":
    print("END",x.get("ieee_address"),x.get("model"),x.get("status"),x.get("binding"))'
curl -s $B/fleet -o /tmp/fleet.json
python3 <<'PY'
import json
d=json.load(open("/tmp/fleet.json"))
c=d.get("canopy")or{}
assert c.get("role")=="canopy_4x8", c
assert c.get("temp_c") is not None, c
assert not str(c.get("friendly_name")or"").startswith("qa_"), c
print("CANOPY_OK", c.get("temp_c"), c.get("rh_pct"), c.get("friendly_name"))
inv=d.get("inventory")or[]
pots=[i for i in inv if isinstance(i,dict) and str(i.get("seat_id")or"").startswith("pot")]
print("POTS",[(p.get("seat_id"),p.get("in_service"), (p.get("extra")or{}).get("assigned_plant_id")) for p in pots])
print("root_steering", "root_steering" in d or "root_steering" in (d.get("system")or{}))
PY
echo "=== SOFTCAL ==="
curl -s -X POST $B/ai/soft-cal-advice -H 'Content-Type: application/json' -d '{"probe":1,"dry_raw":100,"wet_raw":800}' | python3 -c 'import json,sys;d=json.load(sys.stdin);print({k:d.get(k) for k in ("ok","source","guardrail","error") if k in d or True});print("keys",list(d)[:12])'
echo "=== TWIN ==="
curl -s $B/fleet | python3 -c 'import json,sys;d=json.load(sys.stdin);
# find twin light in extras/entities
s=json.dumps(d)
print("twin_sf1000_mentioned", "twin_sf1000" in s or "Twin SF1000" in s)
'
# esphome entities via health or control
curl -s $B/health | python3 -c 'import json,sys;d=json.load(sys.stdin);print("health_zigbee",d.get("zigbee"))'
echo "=== IRRIGACT ==="
curl -s -X POST $B/control/irrigation/shot -H 'Content-Type: application/json' -d '{"probe":1,"duration_s":1}'; echo
echo "=== ROLES CATALOG ==="
curl -s $B/settings/zigbee/roles | python3 -c 'import json,sys;d=json.load(sys.stdin);r=d.get("roles")or d;print("role_count",len(r) if isinstance(r,list) else type(r))'
echo "=== SPA ==="
curl -s $B/ | grep -oE 'assets/index-[^"]+' | head -1
echo DONE_AUDIT
