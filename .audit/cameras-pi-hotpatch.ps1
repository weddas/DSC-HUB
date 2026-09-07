# Hot-patch Settings S1/S2/S7 (cameras) brain + SPA to the live Pi, and put ffmpeg into
# the running brain container so USB / RTSP capture and timelapse assembly work today.
# Pattern: dsc-pi-hotpatch.mdc — pscp/plink -batch -hostkey; docker cp; stop -t 20 + start
# (never restart/kill). Ships the WHOLE dsc_brain package + the freshly built spa-dist.
#
# ffmpeg: `docker exec … apt-get install ffmpeg` lands in the container's writable layer,
# so it survives stop/start but NOT a `compose up --force-recreate` / image rebuild — the
# Dockerfiles now install it at build time for the next image. /dev/video* passthrough
# needs the container recreated from the updated compose (DSC_CAMERA_DEVICE); that is a
# separate, operator-timed step (see docs/cameras.md) because recreate drops hotpatched code.
param(
    [string]$PiHost = "192.168.86.48",
    [string]$PiUser = "dsc",
    [string]$PiPassword = $env:DSC_PI_PASS,
    [string]$HostKey = "SHA256:4XD2kIJ5qNCnULKNmo/L9mvzLbmZdURLwLW7Utt9NJs",
    [string]$Repo = "C:\Users\cmgwe\Documents\DSC-HUB",
    [switch]$SkipFfmpeg
)
$ErrorActionPreference = "Stop"
if (-not $PiPassword) { throw "DSC_PI_PASS not set" }

$pscp = "pscp -batch -hostkey `"$HostKey`" -pw `"$PiPassword`""
$plink = "plink -batch -hostkey `"$HostKey`" -pw `"$PiPassword`""

$Tmp = Join-Path $env:TEMP "cam-hp-$(Get-Date -Format 'yyyyMMddHHmmss')"
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
$ffmpegFlag = if ($SkipFfmpeg) { "0" } else { "1" }

$RemoteSh = @"
#!/bin/bash
set -euo pipefail
PW="`$1"
WANT_FFMPEG="`$2"
d() { echo "`$PW" | sudo -S docker "`$@" 2>/dev/null; }
rm -rf /tmp/cam-spa /tmp/cam-brain
mkdir -p /tmp/cam-spa /tmp/cam-brain
tar -xzf /tmp/cam-spa.tgz -C /tmp/cam-spa
tar -xzf /tmp/cam-brain.tgz -C /tmp/cam-brain
echo "=== before: `$(curl -sf http://127.0.0.1:8787/health | head -c 120)"
echo "=== cameras route before: `$(curl -s -o /dev/null -w '%{http_code} %{content_type}' http://127.0.0.1:8787/cameras)"
d cp /tmp/cam-brain/dsc_brain/. dsc-hub-brain:/app/dsc_brain/
d cp /tmp/cam-spa/. dsc-hub-brain:/app/static/
echo "=== copied"
if [ "`$WANT_FFMPEG" = "1" ]; then
  if d exec dsc-hub-brain sh -c 'command -v ffmpeg' >/dev/null; then
    echo "=== ffmpeg already in the container"
  else
    echo "=== installing ffmpeg in the container (apt, ~2 min on a Pi 4)"
    timeout 900 bash -c "echo '`$PW' | sudo -S docker exec dsc-hub-brain sh -c 'apt-get update -qq && DEBIAN_FRONTEND=noninteractive apt-get install -y -qq --no-install-recommends ffmpeg && rm -rf /var/lib/apt/lists/*'" 2>&1 | tail -2 || echo "ffmpeg install failed — HTTP/MJPEG/motionEye sources still work"
  fi
  d exec dsc-hub-brain sh -c 'ffmpeg -version 2>/dev/null | head -1 || echo "ffmpeg: none"'
fi
echo "=== stop -t 20 + start (no restart/kill)"
timeout 60 bash -c "echo '`$PW' | sudo -S docker stop -t 20 dsc-hub-brain" || echo "stop timed out"
timeout 30 bash -c "echo '`$PW' | sudo -S docker start dsc-hub-brain"
for i in 1 2 3 4 5 6 7 8 9 10 11 12; do
  if curl -sf http://127.0.0.1:8787/health >/dev/null; then echo "health ok after `$((i*5))s"; break; fi
  sleep 5
done
# A container restart creates a new veth; dhcpcd on this Pi manages veth* and has
# rewritten the IPv4 default route onto wlan0. Re-assert the eth0 routes (repo remedy).
ETH_UP=/opt/dsc-hub-repo/services/dsc-hub/pi/bring-up-eth0.sh
[ -f "`$ETH_UP" ] || ETH_UP=/tmp/eth0-up.sh
[ -f "`$ETH_UP" ] && bash "`$ETH_UP" "`$PW" 2>&1 | grep -v 'password for' | tail -3
echo "=== after: `$(curl -sf http://127.0.0.1:8787/health | head -c 160)"
echo "=== served bundle: `$(curl -sf http://127.0.0.1:8787/ | grep -oE 'assets/index-[^"]+\.js' | head -1)"
echo "=== cameras: `$(curl -sf -m 10 http://127.0.0.1:8787/cameras | head -c 300)"
echo "=== zones: `$(curl -s -o /dev/null -w '%{http_code}' -m 10 http://127.0.0.1:8787/zones)  manifest: `$(curl -s -o /dev/null -w '%{http_code}' -m 10 http://127.0.0.1:8787/settings/manifest)  hub-tunables: `$(curl -s -o /dev/null -w '%{http_code}' -m 10 http://127.0.0.1:8787/settings/hub-tunables)"
echo "=== host video devices: `$(ls /dev/video* 2>/dev/null | tr '\n' ' ' || true)"
"@
$RemotePath = Join-Path $Tmp "cam-hp.sh"
[System.IO.File]::WriteAllText($RemotePath, ($RemoteSh -replace "`r`n", "`n"))

Invoke-Expression "$pscp `"$SpaTar`" ${PiUser}@${PiHost}:/tmp/cam-spa.tgz"
Invoke-Expression "$pscp `"$BrainTar`" ${PiUser}@${PiHost}:/tmp/cam-brain.tgz"
Invoke-Expression "$pscp `"$RemotePath`" ${PiUser}@${PiHost}:/tmp/cam-hp.sh"
Invoke-Expression "$plink ${PiUser}@${PiHost} `"tr -d '\r' < /tmp/cam-hp.sh > /tmp/cam-hp.run.sh; bash /tmp/cam-hp.run.sh '$PiPassword' '$ffmpegFlag' 2>&1 | grep -v 'password for'`""
Write-Host "expected bundle: $expectedBundle"
