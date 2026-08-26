# Recover the hub via Pi AP OTA or hub fallback SoftAP (upload from Windows).
param(
    [string]$PiHost = "192.168.86.48",
    [string]$PiUser = "dsc",
    [string]$PiPassword = "Digital",
    [string]$HostKey = "SHA256:4XD2kIJ5qNCnULKNmo/L9mvzLbmZdURLwLW7Utt9NJs",
    [int]$ApWaitSeconds = 120
)

$ErrorActionPreference = "Stop"
$RemoteSh = Join-Path $PSScriptRoot "flash-hub-fallback-remote.sh"
$PiScripts = "/opt/dsc-hub-repo/services/dsc-hub/pi"

Write-Host "Upload hub fallback flasher to $PiHost (Brain AP may drop briefly)..."
& pscp -batch -hostkey $HostKey -pw $PiPassword $RemoteSh "${PiUser}@${PiHost}:/tmp/flash-hub-fallback-remote.sh"

$remote = @"
set -eu
sed -i 's/`r$//' /tmp/flash-hub-fallback-remote.sh
install -d '$PiScripts'
install -m 0755 /tmp/flash-hub-fallback-remote.sh '$PiScripts/flash-hub-fallback-remote.sh'
bash /tmp/flash-hub-fallback-remote.sh $PiPassword $ApWaitSeconds
"@

& plink -batch -hostkey $HostKey -pw $PiPassword "${PiUser}@${PiHost}" $remote
if ($LASTEXITCODE -ne 0) { throw "flash-hub-fallback-pi failed (exit $LASTEXITCODE)" }

Write-Host "Done. Verify fleet: curl http://${PiHost}:8787/fleet"
