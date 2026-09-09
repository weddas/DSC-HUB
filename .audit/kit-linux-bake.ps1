# DSC-HUB — push tree to Pi and run the linux bake (payload + docker images).
# Optional -MakeSdImage downloads Raspberry Pi OS Lite and injects (needs free disk + sudo on Pi).
#
# TWO FOOTGUNS THIS SCRIPT NOW HANDLES (both have bitten a release before):
#  1. DSC_RELEASE=1 is ALWAYS set. Without it bake-firmware.sh falls back to placeholders()
#     and the card ships nine ZERO-BYTE kit .bin files — the 2026-09-06 8.0.0 image.
#  2. firmware/v4/secrets.yaml is gitignored, so it is NOT in the uploaded tar. If it is
#     missing, bake-on-linux.sh SILENTLY MINTS A FRESH KEY SET and the baked firmware can
#     no longer OTA the live fleet. We copy the live one off the Pi and verify its md5.
param(
  [string]$Version = "8.2.0",
  [string]$ExpectSecretsMd5 = "d52acf95ae087bfaf0580526638456ce",
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
  brain frontend/spa-dist data services/dsc-hub services/cannalib firmware/v4
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
# --- the secrets.yaml trap: NEVER let the bake mint a fresh key set ---
LIVE_SECRETS=/opt/dsc-hub-repo/firmware/v4/secrets.yaml
if [[ ! -f "`$LIVE_SECRETS" ]]; then
  echo "ERROR: `$LIVE_SECRETS missing — refusing to bake, the fleet keys would be regenerated" >&2
  exit 1
fi
sudo install -m 0600 "`$LIVE_SECRETS" /opt/dsc-hub-bake-src/firmware/v4/secrets.yaml
GOT=`$(echo Digital | sudo -S md5sum /opt/dsc-hub-bake-src/firmware/v4/secrets.yaml 2>/dev/null | cut -d' ' -f1)
if [[ "`$GOT" != "$ExpectSecretsMd5" ]]; then
  echo "ERROR: secrets.yaml md5 `$GOT != expected $ExpectSecretsMd5 — refusing to bake (fleet OTA would break)" >&2
  exit 1
fi
echo "secrets.yaml verified (`$GOT) — baked firmware will still OTA the live fleet"

# --- archive the previous artifacts as a rollback ---
if compgen -G "/opt/dsc-hub-bake-out/dsc-hub-*-arm64.img*" > /dev/null; then
  ARCH=/opt/dsc-hub-bake-archive/`$(date +%Y%m%d-%H%M%S)
  sudo mkdir -p "`$ARCH"
  sudo mv /opt/dsc-hub-bake-out/dsc-hub-*-arm64.img* "`$ARCH"/ 2>/dev/null || true
  echo "archived previous image artifacts to `$ARCH"
fi

export DSC_BAKE_OUT=/opt/dsc-hub-bake-out
export DSC_VERSION=$Version
export DSC_RELEASE=1          # refuse placeholder/zero-byte kit binaries
cd /opt/dsc-hub-bake-src
# Detached + niced: a full build can saturate the Pi and drop it off the network, which
# would kill a foreground plink mid-bake. Poll /var/log/dsc-bake.log instead.
echo Digital | sudo -S -E bash -c 'setsid nohup nice -n 10 ionice -c2 -n7 bash services/dsc-hub/image/bake-on-linux.sh > /var/log/dsc-bake.log 2>&1 < /dev/null & echo started pid `$!'
echo "bake started detached — tail /var/log/dsc-bake.log"
"@

$remotePath = Join-Path $env:TEMP "dsc-bake-remote.sh"
[System.IO.File]::WriteAllText($remotePath, ($remote -replace "`r`n", "`n"))
& pscp @pscpArgs $remotePath "${target}:/tmp/dsc-bake-remote.sh"

Write-Host "=== Run bake-on-linux on Pi (detached; poll /var/log/dsc-bake.log) ==="
& plink @plinkArgs $target "tr -d '\r' < /tmp/dsc-bake-remote.sh > /tmp/dsc-bake-run.sh; bash /tmp/dsc-bake-run.sh"
if ($LASTEXITCODE -ne 0) { throw "bake-on-linux failed on Pi" }

# The bake now runs DETACHED, so artifacts do not exist yet. Poll the log, then fetch:
#   plink ... "tail -f /var/log/dsc-bake.log"
#   pscp  ... "dsc@<pi>:/opt/dsc-hub-bake-out/dsc-hub-<ver>-*" deploy\
$LocalDeploy = Join-Path $RepoRoot "deploy"
New-Item -ItemType Directory -Force -Path $LocalDeploy | Out-Null
Write-Host "=== Bake launched detached. Poll: plink ... 'tail -20 /var/log/dsc-bake.log' ==="
Write-Host "=== Fetch when complete into: $LocalDeploy ==="
return

if ($MakeSdImage) {
  Write-Host "=== SD image inject (download base if needed) ==="
  $url = $BaseImgUrl
  if (-not $url) {
    # Raspberry Pi OS Lite 64-bit — pin may drift; override -BaseImgUrl if 404
    $url = "https://downloads.raspberrypi.com/raspios_lite_arm64/images/raspios_lite_arm64-2024-11-19/2024-11-19-raspios-bookworm-arm64-lite.img.xz"
  }
  $sdRemote = @"
set -euo pipefail
export DSC_BAKE_OUT=/opt/dsc-hub-bake-out DSC_VERSION=$Version DSC_RELEASE=1
BASE_XZ=/opt/dsc-hub-bake-out/raspios-lite-arm64.img.xz
BASE_IMG=/opt/dsc-hub-bake-out/raspios-lite-arm64.img
if [[ ! -f "`$BASE_IMG" ]]; then
  echo "Downloading base OS (large)…"
  sudo curl -L -o "`$BASE_XZ" "$url"
  sudo xz -dkf "`$BASE_XZ"
fi
cd /opt/dsc-hub-bake-src
sudo -E bash services/dsc-hub/image/bake-sd-image.sh "`$BASE_IMG"
ls -lh /opt/dsc-hub-bake-out/dsc-hub-$Version-arm64.img*
"@
  $sdPath = Join-Path $env:TEMP "dsc-bake-sd-remote.sh"
  [System.IO.File]::WriteAllText($sdPath, ($sdRemote -replace "`r`n", "`n"))
  & pscp @pscpArgs $sdPath "${target}:/tmp/dsc-bake-sd-remote.sh"
  & plink @plinkArgs $target "tr -d '\r' < /tmp/dsc-bake-sd-remote.sh > /tmp/dsc-bake-sd-run.sh; bash /tmp/dsc-bake-sd-run.sh"
  & pscp @pscpArgs "${target}:/opt/dsc-hub-bake-out/dsc-hub-$Version-arm64.img.xz" $LocalDeploy
}

Write-Host "Done. Artifacts in $LocalDeploy"
Get-ChildItem $LocalDeploy -Filter "dsc-hub-$Version-*" | Format-Table Name, Length
