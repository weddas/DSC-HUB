# SPA-only Wave 1 hotpatch to Pi
$ErrorActionPreference = "Stop"
$Repo = "C:\Users\cmgwe\Documents\DSC-HUB"
$PiHost = "192.168.86.48"
$PiUser = "dsc"
$PiPassword = "Digital"
$HostKey = "SHA256:4XD2kIJ5qNCnULKNmo/L9mvzLbmZdURLwLW7Utt9NJs"

$pscp = "pscp -batch -hostkey `"$HostKey`" -pw $PiPassword"
$plink = "plink -batch -hostkey `"$HostKey`" -pw $PiPassword ${PiUser}@${PiHost}"

$SpaDir = Join-Path $Repo "frontend\spa-dist"
$Tmp = Join-Path $env:TEMP "w1-spa-$(Get-Date -Format 'yyyyMMddHHmmss')"
New-Item -ItemType Directory -Path $Tmp | Out-Null
$SpaTar = Join-Path $Tmp "spa.tgz"

Push-Location $SpaDir
tar -czf $SpaTar *
Pop-Location

$RemoteSh = @"
#!/bin/bash
set -euo pipefail
PW=Digital
mkdir -p /tmp/w1-spa
tar -xzf /tmp/w1-spa.tgz -C /tmp/w1-spa
echo "`$PW" | sudo -S docker cp /tmp/w1-spa/. dsc-hub-brain:/app/static/
curl -sS -o /dev/null -w "http=%{http_code}\n" http://127.0.0.1:8787/ || true
grep -oE 'assets/index-[^"]+\.js' /tmp/w1-spa/index.html | head -1
python3 - <<'PY'
import json, urllib.request
f = json.load(urllib.request.urlopen('http://127.0.0.1:8787/fleet', timeout=15))
inv = f.get('inventory') or []
for row in inv:
    sid = row.get('seat_id')
    if not str(sid).startswith('pot'):
        continue
    extra = row.get('extra') or {}
    print(sid, 'assigned_plant_id=', (extra.get('assigned_plant_id') or '') or '(empty)', 'in_service=', row.get('in_service'))
try:
    c = json.load(urllib.request.urlopen('http://127.0.0.1:8787/fleet/computed', timeout=20))
    x = c.get('hass_extras') or {}
    for n in (1, 2, 3, 4):
        aid = (x.get(f'text.dsc_probe{n}_assigned_plant_id') or {}).get('state')
        name = (x.get(f'text.dsc_probe{n}_plant_name') or {}).get('state')
        print(f'helper pot{n}', 'id=', aid, 'name=', name)
except Exception as e:
    print('computed skip', e)
live = urllib.request.urlopen('http://127.0.0.1:8787/', timeout=10).read().decode('utf-8', 'replace')
import re
m = re.search(r'assets/index-[^"]+\.js', live)
print('LIVE_SPA', m.group(0) if m else 'missing')
cal = re.search(r'assets/calibrate-[^"]+\.js', live)
print('LIVE_CAL', cal.group(0) if cal else 'lazy')
# prove SoftCal strings in static
import pathlib
static = pathlib.Path('/tmp/w1-spa/assets')
hits = []
for p in static.glob('calibrate-*.js'):
    t = p.read_text(encoding='utf-8', errors='replace')
    hits.append((p.name, 'SoftCal OK' in t, 'What:' in t, 'Start holds live fans' in t or 'holds live fans' in t))
print('CAL_BUNDLE', hits)
PY
"@

$RemotePath = Join-Path $Tmp "w1-spa.sh"
[System.IO.File]::WriteAllText($RemotePath, ($RemoteSh -replace "`r`n", "`n"))

Invoke-Expression "$pscp `"$SpaTar`" ${PiUser}@${PiHost}:/tmp/w1-spa.tgz"
Invoke-Expression "$pscp `"$RemotePath`" ${PiUser}@${PiHost}:/tmp/w1-spa.sh"
Invoke-Expression "$plink `"tr -d '\r' < /tmp/w1-spa.sh > /tmp/w1-spa.run.sh; bash /tmp/w1-spa.run.sh`""
