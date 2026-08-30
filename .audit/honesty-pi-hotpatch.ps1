# Hot-patch honesty followups to Pi (SPA + brain modules)
$ErrorActionPreference = "Stop"
$Repo = "C:\Users\cmgwe\Documents\DSC-HUB"
$PiHost = "192.168.86.48"
$PiUser = "dsc"
$PiPassword = "Digital"
$HostKey = "SHA256:4XD2kIJ5qNCnULKNmo/L9mvzLbmZdURLwLW7Utt9NJs"

$pscp = "pscp -batch -hostkey `"$HostKey`" -pw $PiPassword"
$plink = "plink -batch -hostkey `"$HostKey`" -pw $PiPassword ${PiUser}@${PiHost}"

$SpaDir = Join-Path $Repo "homeassistant\custom_components\dsc_hub\frontend\spa-dist"
$BrainMods = @(
  "soil_tests.py",
  "hub_controls.py",
  "esphome_client.py",
  "computed_ops.py",
  "dash_computed.py"
)

$Tmp = Join-Path $env:TEMP "honesty-hp-$(Get-Date -Format 'yyyyMMddHHmmss')"
New-Item -ItemType Directory -Path $Tmp | Out-Null
$SpaTar = Join-Path $Tmp "spa.tgz"
$BrainTar = Join-Path $Tmp "brain.tgz"

Push-Location $SpaDir
tar -czf $SpaTar *
Pop-Location

$BrainStage = Join-Path $Tmp "dsc_brain"
New-Item -ItemType Directory -Path $BrainStage | Out-Null
foreach ($m in $BrainMods) {
  Copy-Item (Join-Path $Repo "brain\dsc_brain\$m") (Join-Path $BrainStage $m)
}
Push-Location $Tmp
tar -czf $BrainTar dsc_brain
Pop-Location

$RemoteSh = @"
#!/bin/bash
set -euo pipefail
mkdir -p /tmp/honesty-spa /tmp/honesty-brain
tar -xzf /tmp/honesty-spa.tgz -C /tmp/honesty-spa
tar -xzf /tmp/honesty-brain.tgz -C /tmp/honesty-brain
docker cp /tmp/honesty-spa/. dsc-hub-brain:/app/static/
for f in soil_tests.py hub_controls.py esphome_client.py computed_ops.py dash_computed.py; do
  docker cp /tmp/honesty-brain/dsc_brain/`$f dsc-hub-brain:/app/dsc_brain/`$f
done
timeout 45 docker restart dsc-hub-brain || true
sleep 8
curl -sS -o /dev/null -w "http=%{http_code}\n" http://127.0.0.1:8787/ || true
grep -oE 'assets/index-[^"]+\.js' /tmp/honesty-spa/index.html | head -1
python3 -c "import urllib.request,json; u=urllib.request.urlopen('http://127.0.0.1:8787/settings/probe-stations', timeout=15); d=json.load(u); print('stations', len(d.get('stations') or []));
[print(s.get('seat_id'), 'trust', s.get('home_trustworthy'), 'moist', (s.get('thereabouts') or {}).get('moisture_pct')) for s in (d.get('stations') or [])]"
python3 -c "import urllib.request,json; u=urllib.request.urlopen('http://127.0.0.1:8787/fleet/computed', timeout=20); d=json.load(u); x=d.get('hass_extras') or {};
print('want_m1', (x.get('sensor.dsc_probe1_want_moisture_min') or {}).get('state'));
print('need1', (x.get('sensor.dsc_probe1_need_summary') or {}).get('state'));
print('lights_on', (x.get('time.dsc_hub_lights_on_time') or {}).get('state'));
print('override_pending', (x.get('binary_sensor.dsc_brain_hub_override_active') or {}).get('attributes',{}).get('pending_reassert'))"
"@

$RemotePath = Join-Path $Tmp "honesty-hp.sh"
# LF endings for Pi bash
[System.IO.File]::WriteAllText($RemotePath, ($RemoteSh -replace "`r`n","`n"))

Invoke-Expression "$pscp `"$SpaTar`" ${PiUser}@${PiHost}:/tmp/honesty-spa.tgz"
Invoke-Expression "$pscp `"$BrainTar`" ${PiUser}@${PiHost}:/tmp/honesty-brain.tgz"
Invoke-Expression "$pscp `"$RemotePath`" ${PiUser}@${PiHost}:/tmp/honesty-hp.sh"
Invoke-Expression "$plink `"tr -d '\r' < /tmp/honesty-hp.sh > /tmp/honesty-hp.run.sh; bash /tmp/honesty-hp.run.sh`""
