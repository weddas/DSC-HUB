# Pass 5 Task 5 — hotpatch zigbee policy seed + live floor_flood Wet/Problem prove
$ErrorActionPreference = "Stop"
$Repo = "C:\Users\cmgwe\Documents\DSC-HUB"
$PiHost = "192.168.86.48"
$PiUser = "dsc"
$PiPassword = "Digital"
$HostKey = "SHA256:4XD2kIJ5qNCnULKNmo/L9mvzLbmZdURLwLW7Utt9NJs"

$pscp = "pscp -batch -hostkey `"$HostKey`" -pw $PiPassword"
$plink = "plink -batch -hostkey `"$HostKey`" -pw $PiPassword ${PiUser}@${PiHost}"

$Tmp = Join-Path $env:TEMP "pass5-t5-$(Get-Date -Format 'yyyyMMddHHmmss')"
New-Item -ItemType Directory -Path $Tmp | Out-Null
$BrainStage = Join-Path $Tmp "dsc_brain"
New-Item -ItemType Directory -Path $BrainStage | Out-Null
Copy-Item (Join-Path $Repo "brain\dsc_brain\zigbee_mqtt.py") (Join-Path $BrainStage "zigbee_mqtt.py")
Copy-Item (Join-Path $Repo "brain\dsc_brain\zigbee_policies.py") (Join-Path $BrainStage "zigbee_policies.py")
$BrainTar = Join-Path $Tmp "brain.tgz"
Push-Location $Tmp
tar -czf $BrainTar dsc_brain
Pop-Location

$RemoteSh = @'
#!/bin/bash
set -euo pipefail
BASE=http://127.0.0.1:8787
ROOM=0xa4c1385a686af7df
FOUR=0xa4c1380d734f2033
TANK=0xa4c138b9e2b9b690
EV=/tmp/pass5-t5-evidence.json

mkdir -p /tmp/pass5-t5-brain
tar -xzf /tmp/pass5-t5-brain.tgz -C /tmp/pass5-t5-brain
echo Digital | sudo -S docker cp /tmp/pass5-t5-brain/dsc_brain/zigbee_mqtt.py dsc-hub-brain:/app/dsc_brain/zigbee_mqtt.py
echo Digital | sudo -S docker cp /tmp/pass5-t5-brain/dsc_brain/zigbee_policies.py dsc-hub-brain:/app/dsc_brain/zigbee_policies.py
# Prefer kill+start — restart has hung the Pi
echo Digital | sudo -S timeout 20 docker kill dsc-hub-brain || true
sleep 2
echo Digital | sudo -S timeout 30 docker start dsc-hub-brain
for i in $(seq 1 40); do
  if curl -sf -m 3 "$BASE/health" >/tmp/p5t5-h.json 2>/dev/null; then
    echo "brain_up"
    break
  fi
  sleep 2
done
curl -sf -m 5 "$BASE/health" >/tmp/p5t5-h.json

pub() {
  echo Digital | sudo -S docker exec dsc-hub-mosquitto mosquitto_pub -h 127.0.0.1 -t "zigbee2mqtt/$1" -m "$2"
}

# Reapply bindings (forces by_role stubs + policy seed)
python3 <<'PY'
import json, urllib.request
base="http://127.0.0.1:8787"
with urllib.request.urlopen(base+"/settings/zigbee/bindings") as r:
    bindings=json.load(r).get("bindings") or {}
req=urllib.request.Request(
    base+"/settings/zigbee/bindings",
    data=json.dumps({"bindings":bindings}).encode(),
    headers={"Content-Type":"application/json"},
    method="PUT",
)
out=json.load(urllib.request.urlopen(req))
print("reapplied_bindings", len(out.get("bindings") or {}))
with urllib.request.urlopen(base+"/settings/zigbee/policies") as r:
    policies=json.load(r).get("policies") or {}
# Ensure floor_flood on desk sensors (existing recipe only — no new id)
room="0xa4c1385a686af7df"
four="0xa4c1380d734f2033"
tank="0xa4c138b9e2b9b690"
policies[room]={"recipe_id":"floor_flood_alert","enabled":True,"params":{"problem_when":"active","banner":"Floor water detected (room desk)","banner_tone":"critical"}}
policies[four]={"recipe_id":"floor_flood_alert","enabled":True,"params":{"problem_when":"active","banner":"Floor water detected (4x8 desk)","banner_tone":"critical"}}
if tank not in policies or (policies.get(tank) or {}).get("recipe_id") in (None,"","none"):
    policies[tank]={"recipe_id":"tank_full_appliance","enabled":True,"params":{"seat_id":"dehumidifier","problem_when":"active"}}
req=urllib.request.Request(
    base+"/settings/zigbee/policies",
    data=json.dumps({"policies":policies}).encode(),
    headers={"Content-Type":"application/json"},
    method="PUT",
)
out=json.load(urllib.request.urlopen(req))
print("policy_room", out["policies"][room]["recipe_id"])
print("policy_four", out["policies"][four]["recipe_id"])
PY

slice_fleet() {
  local label="$1"
  curl -sf "$BASE/fleet" | python3 -c "
import json,sys
label='$label'
d=json.load(sys.stdin)
sysd=d.get('system') or {}
by=sysd.get('zigbee_by_role') or {}
ps=sysd.get('zigbee_policy_state') or {}
pol=sysd.get('zigbee_device_policies') or {}
banners=sysd.get('critical_banners') or []
print('SLICE', label)
print('by_role_keys', sorted(by.keys()))
for role in ('leak_floor_room','leak_floor_4x8','leak_tank','leak_floor_2x4'):
  row=by.get(role) or {}
  if row:
    print('role', role, 'wet', row.get('wet'), 'active', row.get('active'), 'stub', row.get('bound_stub'), 'fn', row.get('friendly_name'))
for ieee in ['$ROOM','$FOUR','$TANK']:
  row=ps.get(ieee) or {}
  print('policy_state', ieee, 'problem', row.get('problem'), 'active', row.get('active'), 'recipe', row.get('recipe_id'))
  prow=pol.get(ieee) or {}
  print('device_policy', ieee, prow.get('recipe_id'))
ids=[x.get('id') for x in banners if isinstance(x,dict)]
print('banners', ids)
print('room_banner', 'zb-policy-$ROOM' in ids)
print('four_banner', 'zb-policy-$FOUR' in ids)
"
}

echo "=== after seed ==="
slice_fleet seed

echo "=== baseline dry ==="
pub "$ROOM" '{"occupancy":false}'
pub "$FOUR" '{"occupancy":false}'
sleep 2
slice_fleet dry_baseline

echo "=== WET room occupancy ==="
pub "$ROOM" '{"occupancy":true}'
sleep 2
slice_fleet wet_room

echo "=== DRY room ==="
pub "$ROOM" '{"occupancy":false}'
sleep 2
slice_fleet dry_room

echo "=== WET 4x8 ==="
pub "$FOUR" '{"occupancy":true}'
sleep 2
slice_fleet wet_4x8

echo "=== DRY 4x8 ==="
pub "$FOUR" '{"occupancy":false}'
sleep 2
slice_fleet dry_4x8

# Twin / GPIO5 honesty snapshot
curl -sf "$BASE/fleet/computed" | python3 -c "
import json,sys
x=(json.load(sys.stdin).get('hass_extras') or {})
twin=x.get('light.dsc_hub_twin_sf1000') or {}
print('TWIN', twin.get('state'), twin.get('attributes'))
"

# Inventory seats unchanged during flood (no OOS)
curl -sf "$BASE/settings/inventory" | python3 -c "
import json,sys
d=json.load(sys.stdin)
rows=d if isinstance(d,list) else d.get('inventory') or []
for sid in ['dehumidifier','humidifier']:
  for r in rows:
    if r.get('seat_id')==sid:
      print(sid, 'in_service', r.get('in_service'))
      break
" || true

# Write evidence JSON
python3 <<'PY'
import json, urllib.request
base="http://127.0.0.1:8787"
with urllib.request.urlopen(base+"/fleet") as r:
    fleet=json.load(r)
sysd=fleet.get("system") or {}
with urllib.request.urlopen(base+"/fleet/computed") as r:
    computed=json.load(r)
twin=(computed.get("hass_extras") or {}).get("light.dsc_hub_twin_sf1000") or {}
room="0xa4c1385a686af7df"
four="0xa4c1380d734f2033"
by=sysd.get("zigbee_by_role") or {}
ps=sysd.get("zigbee_policy_state") or {}
pol=sysd.get("zigbee_device_policies") or {}
ev={
  "ok": True,
  "by_role_keys": sorted(by.keys()),
  "leak_floor_2x4_present": "leak_floor_2x4" in by,
  "room_wet": (by.get("leak_floor_room") or {}).get("wet"),
  "four_wet": (by.get("leak_floor_4x8") or {}).get("wet"),
  "room_policy": ps.get(room),
  "four_policy": ps.get(four),
  "room_recipe": (pol.get(room) or {}).get("recipe_id"),
  "four_recipe": (pol.get(four) or {}).get("recipe_id"),
  "banners": [b.get("id") for b in (sysd.get("critical_banners") or []) if isinstance(b, dict)],
  "twin": {"state": twin.get("state"), "brightness": (twin.get("attributes") or {}).get("brightness")},
  "gpio5": "reserved_unwired_soft_gate",
}
# Final dry should be Clear / wet false
ok = (
  ev["room_recipe"]=="floor_flood_alert"
  and ev["four_recipe"]=="floor_flood_alert"
  and isinstance((ev["room_policy"] or {}).get("problem"), bool)
  and isinstance((ev["four_policy"] or {}).get("problem"), bool)
  and (ev["room_policy"] or {}).get("problem") is False
  and (ev["four_policy"] or {}).get("problem") is False
  and ev["room_wet"] is False
  and ev["four_wet"] is False
  and not ev["leak_floor_2x4_present"]
)
ev["ok"]=bool(ok)
json.dump(ev, open("/tmp/pass5-t5-evidence.json","w"), indent=2)
print("EVIDENCE_OK", ev["ok"])
print(json.dumps(ev, indent=2))
PY
'@

$RemotePath = Join-Path $Tmp "pass5-t5.sh"
[System.IO.File]::WriteAllText($RemotePath, ($RemoteSh -replace "`r`n","`n"))

Invoke-Expression "$pscp `"$BrainTar`" ${PiUser}@${PiHost}:/tmp/pass5-t5-brain.tgz"
Invoke-Expression "$pscp `"$RemotePath`" ${PiUser}@${PiHost}:/tmp/pass5-t5.sh"
Invoke-Expression "$plink `"tr -d '\r' < /tmp/pass5-t5.sh > /tmp/pass5-t5.run.sh; bash /tmp/pass5-t5.run.sh`""

# Pull evidence
Invoke-Expression "$pscp ${PiUser}@${PiHost}:/tmp/pass5-t5-evidence.json `"$Repo\.audit\live-ux-pass5-task5-evidence.json`""
Write-Host "Evidence saved to .audit/live-ux-pass5-task5-evidence.json"
