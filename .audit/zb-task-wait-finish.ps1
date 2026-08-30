# After Pi power-cycle: finish zigbee-task deploy WITHOUT wedging docker.
# SPA-first. Brain docker stop only if /settings/zigbee/recipes is missing.
param(
    [string]$PiHost = "192.168.86.48",
    [string]$PiUser = "dsc",
    [string]$PiPassword = "Digital",
    [string]$HostKey = "SHA256:4XD2kIJ5qNCnULKNmo/L9mvzLbmZdURLwLW7Utt9NJs",
    [string]$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path,
    [int]$MaxWaitMin = 45
)

$ErrorActionPreference = "Stop"
$plink = "C:\Program Files\PuTTY\plink.exe"
$pscp = "C:\Program Files\PuTTY\pscp.exe"
$audit = Join-Path $RepoRoot ".audit"

function Write-LfBash([string]$Path, [string]$Content) {
    $utf8NoBom = New-Object System.Text.UTF8Encoding $false
    [System.IO.File]::WriteAllText($Path, ($Content -replace "`r`n", "`n" -replace "`r", "`n"), $utf8NoBom)
}

Write-Host "Waiting for Pi (up to ${MaxWaitMin}m)..." -ForegroundColor Cyan
$ok = $false
$deadline = (Get-Date).AddMinutes($MaxWaitMin)
while ((Get-Date) -lt $deadline) {
    try {
        $h = Invoke-RestMethod -Uri "http://${PiHost}:8787/health" -TimeoutSec 5
        Write-Host "brain up radio=$($h.zigbee.radio_up) end=$($h.zigbee.end_device_count)"
        $ok = $true
        break
    } catch {
        Start-Sleep -Seconds 8
    }
}
if (-not $ok) { throw "Pi brain never came back" }

Write-Host "== SPA hotpatch ==" -ForegroundColor Cyan
$spaSrc = Join-Path $RepoRoot "homeassistant\custom_components\dsc_hub\frontend\spa-dist"
if (-not (Test-Path $spaSrc)) { throw "spa-dist missing - run npm run build:spa first" }
$spaTar = Join-Path $env:TEMP "dsc-spa-hotpatch.tgz"
if (Test-Path $spaTar) { Remove-Item $spaTar -Force }
Push-Location $spaSrc; tar -czf $spaTar *; Pop-Location
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
Write-LfBash (Join-Path $audit "zb-task-spa.sh") $spaSh
& $pscp -batch -hostkey $HostKey -pw $PiPassword (Join-Path $audit "zb-task-spa.sh") "${PiUser}@${PiHost}:/tmp/zb-task-spa.sh"
& $plink -batch -hostkey $HostKey -pw $PiPassword "${PiUser}@${PiHost}" "tr -d '\r' < /tmp/zb-task-spa.sh > /tmp/s.run; bash /tmp/s.run"

$needBrainRestart = $false
try {
    $recipes = Invoke-RestMethod -Uri "http://${PiHost}:8787/settings/zigbee/recipes" -TimeoutSec 8
    $ids = @($recipes.recipes | ForEach-Object { $_.id })
    Write-Host "recipes already: $($ids -join ', ')"
    if ($ids -notcontains "tank_full_appliance") { $needBrainRestart = $true }
} catch {
    Write-Host "recipes API missing - will restart brain"
    $needBrainRestart = $true
}

Write-Host "== brain docker cp ==" -ForegroundColor Cyan
$brainTar = Join-Path $env:TEMP "dsc_brain_hot.tgz"
Push-Location (Join-Path $RepoRoot "brain"); tar -czf $brainTar dsc_brain; Pop-Location
& $pscp -batch -hostkey $HostKey -pw $PiPassword $brainTar "${PiUser}@${PiHost}:/tmp/dsc_brain_hot.tgz"

if ($needBrainRestart) {
    $brainSh = @'
#!/bin/bash
set -euo pipefail
rm -rf /tmp/dsc_brain_hot && mkdir -p /tmp/dsc_brain_hot
tar -xzf /tmp/dsc_brain_hot.tgz -C /tmp/dsc_brain_hot
echo Digital | sudo -S docker cp /tmp/dsc_brain_hot/dsc_brain/. dsc-hub-brain:/app/dsc_brain/
if ! echo Digital | sudo -S timeout 12 docker stop dsc-hub-brain; then
  echo "STOP_TIMEOUT - power-cycle Pi"
  exit 42
fi
echo Digital | sudo -S timeout 20 docker start dsc-hub-brain
for i in $(seq 1 25); do
  if curl -s -m 3 http://127.0.0.1:8787/health >/tmp/h.json 2>/dev/null; then
    curl -sf http://127.0.0.1:8787/settings/zigbee/recipes | python3 -c 'import json,sys; print([r["id"] for r in json.load(sys.stdin)["recipes"]])'
    exit 0
  fi
  sleep 2
done
exit 1
'@
} else {
    $brainSh = @'
#!/bin/bash
set -euo pipefail
rm -rf /tmp/dsc_brain_hot && mkdir -p /tmp/dsc_brain_hot
tar -xzf /tmp/dsc_brain_hot.tgz -C /tmp/dsc_brain_hot
echo Digital | sudo -S docker cp /tmp/dsc_brain_hot/dsc_brain/. dsc-hub-brain:/app/dsc_brain/
echo "docker cp only - no restart (recipes API already live)"
test -f /tmp/dsc_brain_hot/dsc_brain/zigbee_policies.py && echo "zigbee_policies.py staged"
'@
}
Write-LfBash (Join-Path $audit "zb-task-brain-finish.sh") $brainSh
& $pscp -batch -hostkey $HostKey -pw $PiPassword (Join-Path $audit "zb-task-brain-finish.sh") "${PiUser}@${PiHost}:/tmp/zb-task-brain-finish.sh"
& $plink -batch -hostkey $HostKey -pw $PiPassword "${PiUser}@${PiHost}" "tr -d '\r' < /tmp/zb-task-brain-finish.sh > /tmp/f.run; bash /tmp/f.run"

Write-Host "== tank evidence ==" -ForegroundColor Cyan
& $pscp -batch -hostkey $HostKey -pw $PiPassword (Join-Path $audit "zb-task-tank-evidence3.sh") "${PiUser}@${PiHost}:/tmp/zb-task-tank-evidence3.sh"
& $plink -batch -hostkey $HostKey -pw $PiPassword "${PiUser}@${PiHost}" "tr -d '\r' < /tmp/zb-task-tank-evidence3.sh > /tmp/e.run; bash /tmp/e.run"

Write-Host "== arm pair ==" -ForegroundColor Cyan
& $pscp -batch -hostkey $HostKey -pw $PiPassword (Join-Path $audit "zb-task-arm-pair.sh") "${PiUser}@${PiHost}:/tmp/zb-task-arm-pair.sh"
& $plink -batch -hostkey $HostKey -pw $PiPassword "${PiUser}@${PiHost}" "tr -d '\r' < /tmp/zb-task-arm-pair.sh > /tmp/a.run; bash /tmp/a.run"

Write-Host "Done. Physical leak: pair while JOIN OPEN -> Role leak_tank -> Task tank full -> Save." -ForegroundColor Green
