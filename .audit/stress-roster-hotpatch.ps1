# Stress-test hotpatch: SPA + brain (10-slot roster, assign fix)
$ErrorActionPreference = "Stop"
$Repo = "C:\Users\cmgwe\Documents\DSC-HUB"
$PiHost = "192.168.86.48"
$PiUser = "dsc"
$PiPassword = "Digital"
$HostKey = "SHA256:4XD2kIJ5qNCnULKNmo/L9mvzLbmZdURLwLW7Utt9NJs"

$pscp = "pscp -batch -hostkey `"$HostKey`" -pw $PiPassword"
$plink = "plink -batch -hostkey `"$HostKey`" -pw $PiPassword ${PiUser}@${PiHost}"

$SpaTar = Join-Path $env:TEMP "stress-spa.tgz"
$BrainTar = Join-Path $env:TEMP "stress-brain.tgz"
$RemoteSh = Join-Path $Repo ".audit\stress-roster-hp.sh"

if (-not (Test-Path $SpaTar)) { throw "Missing $SpaTar" }
if (-not (Test-Path $BrainTar)) { throw "Missing $BrainTar" }

Write-Host "Upload tarballs..."
Invoke-Expression "$pscp `"$SpaTar`" ${PiUser}@${PiHost}:/tmp/stress-spa.tgz"
Invoke-Expression "$pscp `"$BrainTar`" ${PiUser}@${PiHost}:/tmp/stress-brain.tgz"
Invoke-Expression "$pscp `"$RemoteSh`" ${PiUser}@${PiHost}:/tmp/stress-roster-hp.sh"

Write-Host "Run hotpatch on Pi..."
Invoke-Expression "$plink `"tr -d '\r' < /tmp/stress-roster-hp.sh > /tmp/stress-roster.run.sh; bash /tmp/stress-roster.run.sh`""

Write-Host "Verify health..."
Invoke-Expression "$plink `"curl -sf http://127.0.0.1:8787/health | head -c 200`""
