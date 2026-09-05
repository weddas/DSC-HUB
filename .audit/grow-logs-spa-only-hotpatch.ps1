# SPA-only hotpatch — no docker stop (static served without brain reload)
$ErrorActionPreference = "Stop"
$Repo = "C:\Users\cmgwe\Documents\DSC-HUB"
$PiHost = "192.168.86.48"
$PiUser = "dsc"
$PiPassword = "Digital"
$HostKey = "SHA256:4XD2kIJ5qNCnULKNmo/L9mvzLbmZdURLwLW7Utt9NJs"
$pscp = "pscp -batch -hostkey `"$HostKey`" -pw $PiPassword"
$plink = "plink -batch -hostkey `"$HostKey`" -pw $PiPassword ${PiUser}@${PiHost}"
$SpaDir = Join-Path $Repo "frontend\spa-dist"
$SpaTar = Join-Path $env:TEMP "grow-logs-spa-only.tgz"
Push-Location $SpaDir
tar -czf $SpaTar *
Pop-Location
Invoke-Expression "$pscp `"$SpaTar`" ${PiUser}@${PiHost}:/tmp/grow-logs-spa-only.tgz"
$RemoteSh = @"
#!/bin/bash
set -euo pipefail
mkdir -p /tmp/grow-logs-spa-only
tar -xzf /tmp/grow-logs-spa-only.tgz -C /tmp/grow-logs-spa-only
echo Digital | sudo -S docker cp /tmp/grow-logs-spa-only/. dsc-hub-brain:/app/static/
grep -oE 'assets/index-[^"]+\.js' /tmp/grow-logs-spa-only/index.html | head -1
curl -sf http://127.0.0.1:8787/ | grep -oE 'assets/index-[^"]+\.js' | head -1
"@
$Tmp = Join-Path $env:TEMP "grow-logs-spa-only.sh"
[System.IO.File]::WriteAllText($Tmp, ($RemoteSh -replace "`r`n", "`n"))
Invoke-Expression "$pscp `"$Tmp`" ${PiUser}@${PiHost}:/tmp/grow-logs-spa-only.sh"
Invoke-Expression "$plink `"tr -d '\r' < /tmp/grow-logs-spa-only.sh > /tmp/grow-logs-spa-only.run.sh; bash /tmp/grow-logs-spa-only.run.sh`""
