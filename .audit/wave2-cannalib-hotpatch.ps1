# Wave 2: SPA + brain catalog offset / strain hydrate hotpatch
$ErrorActionPreference = "Stop"
$Repo = "C:\Users\cmgwe\Documents\DSC-HUB"
$PiHost = "192.168.86.48"
$PiUser = "dsc"
$PiPassword = "Digital"
$HostKey = "SHA256:4XD2kIJ5qNCnULKNmo/L9mvzLbmZdURLwLW7Utt9NJs"

$pscp = "pscp -batch -hostkey `"$HostKey`" -pw $PiPassword"
$plink = "plink -batch -hostkey `"$HostKey`" -pw $PiPassword ${PiUser}@${PiHost}"

$SpaDir = Join-Path $Repo "homeassistant\custom_components\dsc_hub\frontend\spa-dist"
$Tmp = Join-Path $env:TEMP "w2-cat-$(Get-Date -Format 'yyyyMMddHHmmss')"
New-Item -ItemType Directory -Path $Tmp | Out-Null
$SpaTar = Join-Path $Tmp "spa.tgz"
Push-Location $SpaDir
tar -czf $SpaTar *
Pop-Location

Copy-Item (Join-Path $Repo "brain\dsc_brain\integrations.py") (Join-Path $Tmp "integrations.py")
Copy-Item (Join-Path $Repo "brain\dsc_brain\api.py") (Join-Path $Tmp "api.py")

$RemoteSh = @"
#!/bin/bash
set -euo pipefail
PW=Digital
mkdir -p /tmp/w2-spa
tar -xzf /tmp/w2-spa.tgz -C /tmp/w2-spa
echo "`$PW" | sudo -S docker cp /tmp/w2-spa/. dsc-hub-brain:/app/static/
echo "`$PW" | sudo -S docker cp /tmp/w2-integrations.py dsc-hub-brain:/app/dsc_brain/integrations.py
echo "`$PW" | sudo -S docker cp /tmp/w2-api.py dsc-hub-brain:/app/dsc_brain/api.py
# Restart so FastAPI picks up route changes (timeout — never bare kill)
timeout 45 docker restart dsc-hub-brain || echo "`$PW" | sudo -S timeout 45 docker restart dsc-hub-brain || true
sleep 10
curl -sS -o /dev/null -w "http=%{http_code}\n" http://127.0.0.1:8787/ || true
grep -oE 'assets/index-[^"]+\.js' /tmp/w2-spa/index.html | head -1
python3 - <<'PY'
import json, urllib.request
# page 0 vs page 1
def fetch(off):
    u = f'http://127.0.0.1:8787/v1/catalogs/strains?q=&limit=5&offset={off}'
    return json.load(urllib.request.urlopen(u, timeout=30))
a = fetch(0)
b = fetch(5)
ids_a = [x.get('id') or x.get('name') for x in (a if isinstance(a, list) else a.get('items') or [])]
ids_b = [x.get('id') or x.get('name') for x in (b if isinstance(b, list) else b.get('items') or [])]
print('page0', ids_a[:3])
print('page1', ids_b[:3])
print('overlap_first', bool(ids_a and ids_b and ids_a[0]==ids_b[0]))
try:
    d = json.load(urllib.request.urlopen('http://127.0.0.1:8787/v1/catalogs/strains/strain_fritz_the_cat', timeout=20))
    media_n = ((d.get('evidence') or {}).get('media') or {}).get('n')
    print('hydrate', d.get('name'), 'media_n', media_n)
except Exception as e:
    print('hydrate_err', e)
PY
"@

$RemotePath = Join-Path $Tmp "w2.sh"
[System.IO.File]::WriteAllText($RemotePath, ($RemoteSh -replace "`r`n", "`n"))

Invoke-Expression "$pscp `"$SpaTar`" ${PiUser}@${PiHost}:/tmp/w2-spa.tgz"
Invoke-Expression "$pscp `"$(Join-Path $Tmp 'integrations.py')`" ${PiUser}@${PiHost}:/tmp/w2-integrations.py"
Invoke-Expression "$pscp `"$(Join-Path $Tmp 'api.py')`" ${PiUser}@${PiHost}:/tmp/w2-api.py"
Invoke-Expression "$pscp `"$RemotePath`" ${PiUser}@${PiHost}:/tmp/w2.sh"
Invoke-Expression "$plink `"tr -d '\r' < /tmp/w2.sh > /tmp/w2.run.sh; bash /tmp/w2.run.sh`""
