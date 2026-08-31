# SPA-only hotpatch after datetime draft fix
$ErrorActionPreference = "Stop"
$PiHost = "192.168.86.48"
$PiUser = "dsc"
$PiPassword = "Digital"
$HostKey = "SHA256:4XD2kIJ5qNCnULKNmo/L9mvzLbmZdURLwLW7Utt9NJs"
$pscp = "pscp -batch -hostkey `"$HostKey`" -pw $PiPassword"
$plink = "plink -batch -hostkey `"$HostKey`" -pw $PiPassword ${PiUser}@${PiHost}"

$SpaTar = Join-Path $env:TEMP "stress-spa.tgz"
if (-not (Test-Path $SpaTar)) { throw "Missing $SpaTar" }

Invoke-Expression "$pscp `"$SpaTar`" ${PiUser}@${PiHost}:/tmp/stress-spa.tgz"

$RemoteSh = @"
#!/bin/bash
set -euo pipefail
mkdir -p /tmp/stress-spa
tar -xzf /tmp/stress-spa.tgz -C /tmp/stress-spa
echo Digital | sudo -S docker cp /tmp/stress-spa/. dsc-hub-brain:/app/static/
grep -oE 'assets/index-[^"]+\.js' /tmp/stress-spa/index.html | head -1
curl -sf http://127.0.0.1:8787/ | grep -oE 'assets/index-[^"]+\.js' | head -1 || true
"@
$TmpSh = Join-Path $env:TEMP "stress-spa-only.sh"
[System.IO.File]::WriteAllText($TmpSh, ($RemoteSh -replace "`r`n", "`n"))
Invoke-Expression "$pscp `"$TmpSh`" ${PiUser}@${PiHost}:/tmp/stress-spa-only.sh"
Invoke-Expression "$plink `"tr -d '\r' < /tmp/stress-spa-only.sh > /tmp/stress-spa-only.run.sh; bash /tmp/stress-spa-only.run.sh`""
