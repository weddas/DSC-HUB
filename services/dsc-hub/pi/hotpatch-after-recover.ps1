# Safe Pi hotpatch after hung docker kill recovery.
# NEVER bare docker kill/restart without timeout.
# Uses LF bash scripts via pscp (PowerShell here-strings break bash if/||).
param(
    [string]$PiHost = "192.168.86.48",
    [string]$PiUser = "dsc",
    [string]$PiPassword = "Digital",
    [string]$HostKey = "SHA256:4XD2kIJ5qNCnULKNmo/L9mvzLbmZdURLwLW7Utt9NJs",
    [string]$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..\..")).Path
)

$ErrorActionPreference = "Stop"
$plink = "C:\Program Files\PuTTY\plink.exe"
$pscp = "C:\Program Files\PuTTY\pscp.exe"
$audit = Join-Path $RepoRoot ".audit"

Write-Host "== health ==" -ForegroundColor Cyan
try {
    $h = Invoke-RestMethod -Uri "http://${PiHost}:8787/health" -TimeoutSec 8
    Write-Host "brain up version=$($h.version) radio=$($h.zigbee.radio_up)"
} catch {
    Write-Host "Brain not reachable — power-cycle Pi first." -ForegroundColor Red
    exit 1
}

function Push-RunBash([string]$LocalName, [string]$RemoteName) {
    $local = Join-Path $audit $LocalName
    & $pscp -batch -hostkey $HostKey -pw $PiPassword $local "${PiUser}@${PiHost}:/tmp/$RemoteName"
    & $plink -batch -hostkey $HostKey -pw $PiPassword "${PiUser}@${PiHost}" "tr -d '\r' < /tmp/$RemoteName > /tmp/$RemoteName.run; bash /tmp/$RemoteName.run"
}

Write-Host "== z2m config + timeout start ==" -ForegroundColor Cyan
Push-RunBash "onepass-z2m.sh" "onepass-z2m.sh"

Write-Host "== push brain dsc_brain ==" -ForegroundColor Cyan
$brainSrc = Join-Path $RepoRoot "brain\dsc_brain"
& $pscp -batch -hostkey $HostKey -pw $PiPassword -r $brainSrc "${PiUser}@${PiHost}:/tmp/dsc_brain_hot"
$brainSh = @'
#!/bin/bash
set -e
echo Digital | sudo -S docker cp /tmp/dsc_brain_hot/. dsc-hub-brain:/app/dsc_brain/
# Prefer timeout restart over kill — kill -s KILL has wedged Docker+SSH on this Pi (2026-08-30).
echo Digital | sudo -S timeout 25 docker restart dsc-hub-brain || {
  echo "restart failed — operator power-cycle required; do NOT issue more kills"
  exit 1
}
for i in $(seq 1 20); do
  if curl -s -m 3 http://127.0.0.1:8787/health >/tmp/h.json 2>/dev/null; then
    python3 -c 'import sys,json; d=json.load(open("/tmp/h.json")); print(d.get("version"), d.get("zigbee"))'
    exit 0
  fi
  sleep 3
done
echo "brain did not return after restart"
exit 1
'@
[System.IO.File]::WriteAllText((Join-Path $audit "onepass-brain.sh"), ($brainSh -replace "`r`n","`n"))
Push-RunBash "onepass-brain.sh" "onepass-brain.sh"

Write-Host "== push SPA to brain/static ==" -ForegroundColor Cyan
$spaSrc = Join-Path $RepoRoot "homeassistant\custom_components\dsc_hub\frontend\spa-dist"
if (-not (Test-Path $spaSrc)) {
    Write-Host "spa-dist missing — run npm run build:spa first" -ForegroundColor Red
    exit 1
}
$spaTar = Join-Path $env:TEMP "dsc-spa-hotpatch.tgz"
if (Test-Path $spaTar) { Remove-Item $spaTar -Force }
Push-Location $spaSrc
tar -czf $spaTar *
Pop-Location
& $pscp -batch -hostkey $HostKey -pw $PiPassword $spaTar "${PiUser}@${PiHost}:/tmp/dsc-spa-hotpatch.tgz"
$spaSh = @'
#!/bin/bash
set -e
echo Digital | sudo -S rm -rf /tmp/dsc-spa-unpack
echo Digital | sudo -S mkdir -p /tmp/dsc-spa-unpack
echo Digital | sudo -S tar -xzf /tmp/dsc-spa-hotpatch.tgz -C /tmp/dsc-spa-unpack
echo Digital | sudo -S mkdir -p /opt/dsc-hub-repo/brain/static
echo Digital | sudo -S rsync -a --delete /tmp/dsc-spa-unpack/ /opt/dsc-hub-repo/brain/static/
echo Digital | sudo -S docker cp /opt/dsc-hub-repo/brain/static/. dsc-hub-brain:/app/static/
echo Digital | sudo -S grep -oE 'assets/index-[^"]+' /opt/dsc-hub-repo/brain/static/index.html | head -1
'@
[System.IO.File]::WriteAllText((Join-Path $audit "onepass-spa.sh"), ($spaSh -replace "`r`n","`n"))
Push-RunBash "onepass-spa.sh" "onepass-spa.sh"

Write-Host "== verify Zigbee product APIs ==" -ForegroundColor Cyan
try {
    $roles = Invoke-RestMethod -Uri "http://${PiHost}:8787/settings/zigbee/roles" -TimeoutSec 8
    Write-Host "roles_ok count=$(@($roles.roles).Count)"
} catch {
    Write-Host "roles API: $($_.Exception.Message)" -ForegroundColor Yellow
}
try {
    $bind = Invoke-RestMethod -Uri "http://${PiHost}:8787/settings/zigbee/bindings" -TimeoutSec 8
    Write-Host "bindings_ok"
} catch {
    Write-Host "bindings API: $($_.Exception.Message)" -ForegroundColor Yellow
}
try {
    $h2 = Invoke-RestMethod -Uri "http://${PiHost}:8787/health" -TimeoutSec 8
    Write-Host "health radio_up=$($h2.zigbee.radio_up) mqtt=$($h2.zigbee.mqtt_connected) bridge=$($h2.zigbee.bridge_state) note=$($h2.zigbee.radio_note)"
} catch {
    Write-Host "post-health failed: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "Done. If radio_up still false and logs show HOST_FATAL, flash SkyConnect EmberZNet 7.4.x (policy B escalate)." -ForegroundColor Green
