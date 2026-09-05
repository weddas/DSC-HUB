# DSC-HUB 8.0.0 — push tree to Pi and run linux bake (payload + docker images).
# Optional -MakeSdImage downloads Raspberry Pi OS Lite and injects (needs free disk + sudo on Pi).
param(
  [string]$PiHost = "192.168.86.48",
  [string]$PiUser = "dsc",
  [string]$PiPassword = "Digital",
  [string]$HostKey = "SHA256:4XD2kIJ5qNCnULKNmo/L9mvzLbmZdURLwLW7Utt9NJs",
  [switch]$SkipSpaBuild,
  [switch]$MakeSdImage,
  [string]$BaseImgUrl = ""
)

$ErrorActionPreference = "Stop"
$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$FrontendDir = Join-Path $RepoRoot "frontend"
$plinkArgs = @("-batch", "-hostkey", $HostKey, "-pw", $PiPassword)
$pscpArgs = @("-batch", "-hostkey", $HostKey, "-pw", $PiPassword)
$target = "${PiUser}@${PiHost}"

Write-Host "=== SPA build ==="
Push-Location $FrontendDir
if (-not $SkipSpaBuild) {
  & npm.cmd run build 2>&1 | ForEach-Object { Write-Host $_ }
  if ($LASTEXITCODE -ne 0) { throw "SPA build failed" }
} else {
  Write-Host "SkipSpaBuild"
}
Pop-Location

# Sync bake-relevant tree to Pi (rsync-like via tar)
$BakeTar = Join-Path $env:TEMP "dsc-hub-8.0-bake-src.tgz"
if (Test-Path $BakeTar) { Remove-Item $BakeTar -Force }
Write-Host "=== Packing bake source ==="
Push-Location $RepoRoot
# Git bash tar for excludes
$tarExe = "C:\Program Files\Git\bin\tar.exe"
if (-not (Test-Path $tarExe)) { $tarExe = "tar" }
& $tarExe -czf $BakeTar `
  --exclude=node_modules --exclude=.git --exclude=__pycache__ `
  --exclude=frontend/node_modules --exclude=*.pyc `
  --exclude=deploy --exclude=.audit `
  brain frontend/spa-dist data services/dsc-hub firmware/v4
Pop-Location

Write-Host "=== Upload to Pi ==="
& pscp @pscpArgs $BakeTar "${target}:/tmp/dsc-hub-8.0-bake-src.tgz"
$remoteBake = Join-Path $RepoRoot "services\dsc-hub\image\bake-on-linux.sh"
$remoteSd = Join-Path $RepoRoot "services\dsc-hub\image\bake-sd-image.sh"
& pscp @pscpArgs $remoteBake "${target}:/tmp/bake-on-linux.sh"
& pscp @pscpArgs $remoteSd "${target}:/tmp/bake-sd-image.sh"
$remoteFw = Join-Path $RepoRoot "services\dsc-hub\image\bake-firmware.sh"
& pscp @pscpArgs $remoteFw "${target}:/tmp/bake-firmware.sh"

$remote = @"
set -euo pipefail
echo Digital | sudo -S true
sudo rm -rf /opt/dsc-hub-bake-src
sudo mkdir -p /opt/dsc-hub-bake-src /opt/dsc-hub-bake-out
sudo tar -C /opt/dsc-hub-bake-src -xzf /tmp/dsc-hub-8.0-bake-src.tgz
# Normalize all bake/pi shell scripts (Windows CRLF breaks set -o pipefail)
sudo find /opt/dsc-hub-bake-src/services/dsc-hub -name '*.sh' -print0 | sudo xargs -0 sed -i 's/\r$//'
sudo tr -d '\r' < /tmp/bake-on-linux.sh > /opt/dsc-hub-bake-src/services/dsc-hub/image/bake-on-linux.sh
sudo tr -d '\r' < /tmp/bake-sd-image.sh > /opt/dsc-hub-bake-src/services/dsc-hub/image/bake-sd-image.sh
sudo tr -d '\r' < /tmp/bake-firmware.sh > /opt/dsc-hub-bake-src/services/dsc-hub/image/bake-firmware.sh
sudo chmod +x /opt/dsc-hub-bake-src/services/dsc-hub/image/*.sh /opt/dsc-hub-bake-src/services/dsc-hub/pi/*.sh 2>/dev/null || true
export DSC_BAKE_OUT=/opt/dsc-hub-bake-out
export DSC_VERSION=8.0.0
cd /opt/dsc-hub-bake-src
# Run as root so docker works (dsc is not in docker group)
echo Digital | sudo -S -E bash services/dsc-hub/image/bake-on-linux.sh
ls -lh /opt/dsc-hub-bake-out/
"@

$remotePath = Join-Path $env:TEMP "dsc-bake-remote.sh"
[System.IO.File]::WriteAllText($remotePath, ($remote -replace "`r`n", "`n"))
& pscp @pscpArgs $remotePath "${target}:/tmp/dsc-bake-remote.sh"

Write-Host "=== Run bake-on-linux on Pi (long) ==="
& plink @plinkArgs $target "tr -d '\r' < /tmp/dsc-bake-remote.sh > /tmp/dsc-bake-run.sh; bash /tmp/dsc-bake-run.sh"
if ($LASTEXITCODE -ne 0) { throw "bake-on-linux failed on Pi" }

Write-Host "=== Fetch bake artifacts ==="
$LocalDeploy = Join-Path $RepoRoot "deploy"
New-Item -ItemType Directory -Force -Path $LocalDeploy | Out-Null
& pscp @pscpArgs "${target}:/opt/dsc-hub-bake-out/dsc-hub-8.0.0-*" $LocalDeploy

if ($MakeSdImage) {
  Write-Host "=== SD image inject (download base if needed) ==="
  $url = $BaseImgUrl
  if (-not $url) {
    # Raspberry Pi OS Lite 64-bit — pin may drift; override -BaseImgUrl if 404
    $url = "https://downloads.raspberrypi.com/raspios_lite_arm64/images/raspios_lite_arm64-2024-11-19/2024-11-19-raspios-bookworm-arm64-lite.img.xz"
  }
  $sdRemote = @"
set -euo pipefail
export DSC_BAKE_OUT=/opt/dsc-hub-bake-out DSC_VERSION=8.0.0
BASE_XZ=/opt/dsc-hub-bake-out/raspios-lite-arm64.img.xz
BASE_IMG=/opt/dsc-hub-bake-out/raspios-lite-arm64.img
if [[ ! -f "`$BASE_IMG" ]]; then
  echo "Downloading base OS (large)…"
  sudo curl -L -o "`$BASE_XZ" "$url"
  sudo xz -dkf "`$BASE_XZ"
fi
cd /opt/dsc-hub-bake-src
sudo -E bash services/dsc-hub/image/bake-sd-image.sh "`$BASE_IMG"
ls -lh /opt/dsc-hub-bake-out/dsc-hub-8.0.0-arm64.img*
"@
  $sdPath = Join-Path $env:TEMP "dsc-bake-sd-remote.sh"
  [System.IO.File]::WriteAllText($sdPath, ($sdRemote -replace "`r`n", "`n"))
  & pscp @pscpArgs $sdPath "${target}:/tmp/dsc-bake-sd-remote.sh"
  & plink @plinkArgs $target "tr -d '\r' < /tmp/dsc-bake-sd-remote.sh > /tmp/dsc-bake-sd-run.sh; bash /tmp/dsc-bake-sd-run.sh"
  & pscp @pscpArgs "${target}:/opt/dsc-hub-bake-out/dsc-hub-8.0.0-arm64.img.xz" $LocalDeploy
}

Write-Host "Done. Artifacts in $LocalDeploy"
Get-ChildItem $LocalDeploy -Filter "dsc-hub-8.0.0-*" | Format-Table Name, Length
