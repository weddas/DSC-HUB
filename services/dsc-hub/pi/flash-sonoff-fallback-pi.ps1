# Flash Sonoffs via Pi wlan0 joining each fallback SoftAP (no Windows admin).
param(
    [string]$PiHost = "192.168.86.48",
    [string]$PiUser = "dsc",
    [string]$PiPassword = "Digital",
    [string]$HostKey = "SHA256:4XD2kIJ5qNCnULKNmo/L9mvzLbmZdURLwLW7Utt9NJs",
    [string]$Seats = "heater heatmat humidifier dehumidifier",
    [int]$ApWaitSeconds = 120
)

$ErrorActionPreference = "Stop"
$RepoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..\..")
$RemoteSh = Join-Path $PSScriptRoot "flash-sonoff-fallback-remote.sh"
$FirmwareDir = Join-Path $RepoRoot "firmware\v4"
$FwTar = Join-Path $env:TEMP "dsc-firmware-v4.tgz"

Write-Host "Pack firmware/v4..."
if (Test-Path $FwTar) { Remove-Item $FwTar -Force }
Push-Location $FirmwareDir
# Exclude build caches; they churn during packing and bloat the upload.
& tar --exclude=.esphome --exclude=__pycache__ -czf $FwTar .
$tarExit = $LASTEXITCODE
Pop-Location
if ($tarExit -ne 0 -or -not (Test-Path $FwTar) -or (Get-Item $FwTar).Length -lt 100KB) {
    throw "Firmware pack failed (tar exit $tarExit) - refusing to upload a corrupt archive"
}
Write-Host ("Packed {0:N1} MB" -f ((Get-Item $FwTar).Length / 1MB))

$PiScripts = "/opt/dsc-hub-repo/services/dsc-hub/pi"

Write-Host "Upload Pi fallback flasher + firmware to $PiHost (eth0; Brain AP may drop briefly)..."
& pscp -batch -hostkey $HostKey -pw $PiPassword $RemoteSh "${PiUser}@${PiHost}:/tmp/flash-sonoff-fallback-remote.sh"
& pscp -batch -hostkey $HostKey -pw $PiPassword $FwTar "${PiUser}@${PiHost}:/tmp/dsc-firmware-v4.tgz"

Write-Host "Seats: $Seats | AP wait: ${ApWaitSeconds}s per device"
Write-Host "Power-cycle each Sonoff away from house WiFi when prompted on Pi."
$remote = @"
set -eu
sed -i 's/`r$//' /tmp/flash-sonoff-fallback-remote.sh
install -d '$PiScripts'
install -m 0755 /tmp/flash-sonoff-fallback-remote.sh '$PiScripts/flash-sonoff-fallback-remote.sh'
bash /tmp/flash-sonoff-fallback-remote.sh $PiPassword '$Seats' $ApWaitSeconds
"@
& plink -batch -hostkey $HostKey -pw $PiPassword "${PiUser}@${PiHost}" $remote
if ($LASTEXITCODE -ne 0) { throw "flash-sonoff-fallback-pi failed (exit $LASTEXITCODE)" }

Write-Host "Done. Verify fleet: curl http://${PiHost}:8787/fleet"
