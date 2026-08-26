# Flash Sonoffs on house LAN via Pi ESPHome (SSH to Brain eth0; OTA targets 10.42.0.x).
param(
    [string]$PiHost = "192.168.86.48",
    [string]$PiUser = "dsc",
    [string]$PiPassword = "Digital",
    [string]$HostKey = "SHA256:4XD2kIJ5qNCnULKNmo/L9mvzLbmZdURLwLW7Utt9NJs",
    [string]$Seats = "heater heatmat humidifier dehumidifier"
)

$ErrorActionPreference = "Stop"
$RepoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..\..")
$RemoteSh = Join-Path $PSScriptRoot "flash-sonoff-lan-remote.sh"
$FirmwareDir = Join-Path $RepoRoot "firmware\v4"
$FwTar = Join-Path $env:TEMP "dsc-firmware-v4.tgz"

Write-Host "Pack firmware/v4..."
Push-Location $FirmwareDir
& tar -czf $FwTar .
Pop-Location

& pscp -batch -hostkey $HostKey -pw $PiPassword $RemoteSh "${PiUser}@${PiHost}:/tmp/flash-sonoff-lan-remote.sh"
& pscp -batch -hostkey $HostKey -pw $PiPassword $FwTar "${PiUser}@${PiHost}:/tmp/dsc-firmware-v4.tgz"

$remote = "sed -i 's/`r$//' /tmp/flash-sonoff-lan-remote.sh; bash /tmp/flash-sonoff-lan-remote.sh $PiPassword '$Seats'"
& plink -batch -hostkey $HostKey -pw $PiPassword "${PiUser}@${PiHost}" $remote
if ($LASTEXITCODE -ne 0) { throw "flash-sonoff-lan failed (exit $LASTEXITCODE)" }

Write-Host "Done."
