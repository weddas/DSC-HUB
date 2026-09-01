# Pass 5 Task 5 RESUME — Wet/Problem MQTT prove WITHOUT docker kill (Pi just recovered)
$ErrorActionPreference = "Stop"
$Repo = "C:\Users\cmgwe\Documents\DSC-HUB"
$PiHost = "192.168.86.48"
$PiUser = "dsc"
$PiPassword = "Digital"
$HostKey = "SHA256:4XD2kIJ5qNCnULKNmo/L9mvzLbmZdURLwLW7Utt9NJs"

$pscp = "pscp -batch -hostkey `"$HostKey`" -pw $PiPassword"
$plink = "plink -batch -hostkey `"$HostKey`" -pw $PiPassword ${PiUser}@${PiHost}"

$Tmp = Join-Path $env:TEMP "pass5-t5r-$(Get-Date -Format 'yyyyMMddHHmmss')"
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

for i in $(seq 1 60); do
  if curl -sf -m 3 "$BASE/health" >/dev/null 2>&1; then echo "brain_up_$i"; break; fi
  sleep 2
done

mkdir -p /tmp/pass5-t5r-brain
tar -xzf /tmp/pass5-t5r-brain.tgz -C /tmp/pass5-t5r-brain
echo Digital | sudo -S docker cp /tmp/pass5-t5r-brain/dsc_brain/zigbee_mqtt.py dsc-hub-brain:/app/dsc_brain/zigbee_mqtt.py
echo Digital | sudo -S docker cp /tmp/pass5-t5r-brain/dsc_brain/zigbee_policies.py dsc-hub-brain:/app/dsc_brain/zigbee_policies.py
echo "cp_done_no_restart"

pub() {
  echo Digital | sudo -S docker exec dsc-hub-mosquitto mosquitto_pub -h 127.0.0.1 -t "zigbee2mqtt/$1" -m "$2"
}

python3 <<'PY'
import json, urllib.request
base="http://127.0.0.1:8787"
with urllib.request.urlopen(base+"/settings/zigbee/bindings", timeout=30) as r:
    bindings=json.load(r).get("bindings") or {}
req=urllib.request.Request(
    base+"/settings/zigbee/bindings",
    data=json.dumps({"bindings":bindings}).encode(),
    headers={"Content-Type":"application/json"},
    method="PUT",
)
out=json.load(urllib.request.urlopen(req, timeout=60))
print("reapplied_bindings", len(out.get("bindings") or {}))
with urllib.request.urlopen(base+"/settings/zigbee/policies", timeout=30) as r:
    policies=json.load(r).get("policies") or {}
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
out=json.load(urllib.request.urlopen(req, timeout=60))
print("policy_room", out["policies"][room]["recipe_id"])
print("policy_four", out["policies"][four]["recipe_id"])
PY

slice_fleet() {
  local label="$1"
  curl -sf -m 45 "$BASE/fleet" | python3 -c "
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

echo "=== seed ==="
slice_fleet seed

echo "=== dry baseline ==="
pub "$ROOM" '{"occupancy":false}'
pub "$FOUR" '{"occupancy":false}'
sleep 3
slice_fleet dry_baseline

echo "=== WET room ==="
pub "$ROOM" '{"occupancy":true}'
sleep 3
slice_fleet wet_room

echo "=== DRY room ==="
pub "$ROOM" '{"occupancy":false}'
sleep 3
slice_fleet dry_room

echo "=== WET 4x8 ==="
pub "$FOUR" '{"occupancy":true}'
sleep 3
slice_fleet wet_4x8

echo "=== DRY 4x8 ==="
pub "$FOUR" '{"occupancy":false}'
sleep 3
slice_fleet dry_4x8

python3 <<'PY'
import json, urllib.request
base="http://127.0.0.1:8787"
body=json.dumps({"entity_id":"switch.dsc_hub_manual_light_hold","on":False}).encode()
req=urllib.request.Request(base+"/control/service", data=body, headers={"Content-Type":"application/json"}, method="POST")
try:
    out=json.load(urllib.request.urlopen(req, timeout=30))
    print("HOLD_CLEAR", out)
except Exception as e:
    print("HOLD_CLEAR_ERR", e)
PY

python3 <<'PY'
import json, urllib.request
base="http://127.0.0.1:8787"
with urllib.request.urlopen(base+"/fleet", timeout=60) as r:
    fleet=json.load(r)
sysd=fleet.get("system") or {}
with urllib.request.urlopen(base+"/fleet/computed", timeout=60) as r:
    computed=json.load(r)
extras=computed.get("hass_extras") or {}
twin=extras.get("light.dsc_hub_twin_sf1000") or {}
hold=extras.get("switch.dsc_hub_manual_light_hold") or {}
ents=fleet.get("entities") or {}
if not hold:
    hold=ents.get("switch.dsc_hub_manual_light_hold") or {}
room="0xa4c1385a686af7df"
four="0xa4c1380d734f2033"
by=sysd.get("zigbee_by_role") or {}
ps=sysd.get("zigbee_policy_state") or {}
pol=sysd.get("zigbee_device_policies") or {}
ev={
  "ok": False,
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
  "manual_hold": hold.get("state"),
  "resume": "no_docker_kill",
}
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

$RemotePath = Join-Path $Tmp "pass5-t5r.sh"
[System.IO.File]::WriteAllText($RemotePath, ($RemoteSh -replace "`r`n","`n"))

$ready=$false
for ($i=0; $i -lt 30; $i++) {
  try {
    $null = Invoke-RestMethod "http://${PiHost}:8787/fleet" -TimeoutSec 20
    $ready=$true
    Write-Host "fleet_ready_$i"
    break
  } catch {
    Write-Host "fleet_wait_$i"
    Start-Sleep -Seconds 5
  }
}
if (-not $ready) { throw "fleet not ready" }

Invoke-Expression "$pscp `"$BrainTar`" ${PiUser}@${PiHost}:/tmp/pass5-t5r-brain.tgz"
Invoke-Expression "$pscp `"$RemotePath`" ${PiUser}@${PiHost}:/tmp/pass5-t5r.sh"
Invoke-Expression "$plink `"tr -d '\r' < /tmp/pass5-t5r.sh > /tmp/pass5-t5r.run.sh; bash /tmp/pass5-t5r.run.sh`""

Invoke-Expression "$pscp ${PiUser}@${PiHost}:/tmp/pass5-t5-evidence.json `"$Repo\.audit\live-ux-pass5-task5-evidence.json`""
Get-Content "$Repo\.audit\live-ux-pass5-task5-evidence.json"
Write-Host "DONE resume Task 5"
