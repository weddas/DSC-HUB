# Hot-patch PR #197 (zigbee completion + automation v2) to the live Pi.
# Pattern: dsc-pi-hotpatch.mdc — pscp/plink -batch -hostkey; docker cp; stop -t 20 + start (never restart/kill).
# Ships the WHOLE dsc_brain package (the Pi runs a pre-v2 image) + the freshly built spa-dist.
param(
    [string]$PiHost = "192.168.86.48",
    [string]$PiUser = "dsc",
    [string]$PiPassword = $env:DSC_PI_PASS,
    [string]$HostKey = "SHA256:4XD2kIJ5qNCnULKNmo/L9mvzLbmZdURLwLW7Utt9NJs",
    [string]$Repo = "C:\Users\cmgwe\Documents\DSC-HUB"
)
$ErrorActionPreference = "Stop"
if (-not $PiPassword) { throw "DSC_PI_PASS not set" }

$pscp = "pscp -batch -hostkey `"$HostKey`" -pw `"$PiPassword`""
$plink = "plink -batch -hostkey `"$HostKey`" -pw `"$PiPassword`""

$Tmp = Join-Path $env:TEMP "zbc-hp-$(Get-Date -Format 'yyyyMMddHHmmss')"
New-Item -ItemType Directory -Path $Tmp | Out-Null
$SpaTar = Join-Path $Tmp "spa.tgz"
$BrainTar = Join-Path $Tmp "brain.tgz"

# Windows bsdtar explicitly — Git's GNU tar on PATH treats "C:" as a remote host.
$tar = Join-Path $env:SystemRoot "System32\tar.exe"
Push-Location (Join-Path $Repo "frontend\spa-dist")
& $tar -czf $SpaTar *
Pop-Location
Push-Location (Join-Path $Repo "brain")
& $tar -czf $BrainTar --exclude=__pycache__ dsc_brain
Pop-Location
if (-not (Test-Path $SpaTar) -or -not (Test-Path $BrainTar)) { throw "tarball build failed" }

$expectedBundle = (Select-String -Path (Join-Path $Repo "frontend\spa-dist\index.html") -Pattern 'assets/(index-[^"]+\.js)').Matches[0].Groups[1].Value
Write-Host "SPA bundle to ship: $expectedBundle"

$RemoteSh = @"
#!/bin/bash
set -euo pipefail
PW="`$1"
d() { echo "`$PW" | sudo -S docker "`$@" 2>/dev/null; }
rm -rf /tmp/zbc-spa /tmp/zbc-brain
mkdir -p /tmp/zbc-spa /tmp/zbc-brain
tar -xzf /tmp/zbc-spa.tgz -C /tmp/zbc-spa
tar -xzf /tmp/zbc-brain.tgz -C /tmp/zbc-brain
echo "=== before: `$(curl -sf http://127.0.0.1:8787/health | head -c 120)"
d cp /tmp/zbc-brain/dsc_brain/. dsc-hub-brain:/app/dsc_brain/
d cp /tmp/zbc-spa/. dsc-hub-brain:/app/static/
echo "=== copied; stop -t 20 + start (no restart/kill)"
timeout 60 bash -c "echo '`$PW' | sudo -S docker stop -t 20 dsc-hub-brain" || echo "stop timed out"
timeout 30 bash -c "echo '`$PW' | sudo -S docker start dsc-hub-brain"
for i in 1 2 3 4 5 6 7 8 9 10 11 12; do
  if curl -sf http://127.0.0.1:8787/health >/dev/null; then echo "health ok after `$((i*5))s"; break; fi
  sleep 5
done
echo "=== after: `$(curl -sf http://127.0.0.1:8787/health | head -c 160)"
echo "=== served bundle: `$(curl -sf http://127.0.0.1:8787/ | grep -oE 'assets/index-[^"]+\.js' | head -1)"
echo "=== targets: `$(curl -sf -m 10 http://127.0.0.1:8787/settings/automations/targets | head -c 200)"
"@
$RemotePath = Join-Path $Tmp "zbc-hp.sh"
[System.IO.File]::WriteAllText($RemotePath, ($RemoteSh -replace "`r`n", "`n"))

Invoke-Expression "$pscp `"$SpaTar`" ${PiUser}@${PiHost}:/tmp/zbc-spa.tgz"
Invoke-Expression "$pscp `"$BrainTar`" ${PiUser}@${PiHost}:/tmp/zbc-brain.tgz"
Invoke-Expression "$pscp `"$RemotePath`" ${PiUser}@${PiHost}:/tmp/zbc-hp.sh"
Invoke-Expression "$plink ${PiUser}@${PiHost} `"tr -d '\r' < /tmp/zbc-hp.sh > /tmp/zbc-hp.run.sh; bash /tmp/zbc-hp.run.sh '$PiPassword' 2>&1 | grep -v 'password for'`""
Write-Host "expected bundle: $expectedBundle"
