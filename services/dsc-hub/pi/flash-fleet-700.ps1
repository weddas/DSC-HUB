# Queue / run fleet OTA to 7.0.0.0 on DSC-Brain Pi (ESPHome dashboard container).
param(
    [string]$PiHost = "192.168.86.48",
    [string]$PiUser = "dsc",
    [string]$PiPassword = "Digital",
    [string]$HostKey = "SHA256:4XD2kIJ5qNCnULKNmo/L9mvzLbmZdURLwLW7Utt9NJs",
    [string]$Seats = "hub pot2 pot1 heater heatmat humidifier dehumidifier control"
)

$ErrorActionPreference = "Stop"
$RepoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..\..")
$RemoteSh = Join-Path $PSScriptRoot "flash-fleet-remote.sh"
$FirmwareDir = Join-Path $RepoRoot "firmware\v4"
$FwTar = Join-Path $env:TEMP "dsc-firmware-v4.tgz"

Write-Host "Pack firmware/v4..."
Push-Location $FirmwareDir
& tar -czf $FwTar .
Pop-Location

Write-Host "Upload flash-fleet-remote.sh + firmware..."
& pscp -batch -hostkey $HostKey -pw $PiPassword $RemoteSh "${PiUser}@${PiHost}:/tmp/flash-fleet-remote.sh"
& pscp -batch -hostkey $HostKey -pw $PiPassword $FwTar "${PiUser}@${PiHost}:/tmp/dsc-firmware-v4.tgz"

Write-Host "Flash order: $Seats"
Write-Host "ESPHome OTA per device; hub alone can take 10+ minutes."
$remote = "sed -i 's/`r$//' /tmp/flash-fleet-remote.sh; bash /tmp/flash-fleet-remote.sh $PiPassword '$Seats'"
& plink -batch -hostkey $HostKey -pw $PiPassword "${PiUser}@${PiHost}" $remote
if ($LASTEXITCODE -ne 0) { throw "flash-fleet failed (exit $LASTEXITCODE)" }

Write-Host "Done. Verify: services/dsc-hub/pi/verify-brain.ps1"
