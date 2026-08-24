# Deploy brain + .env to DSC-Brain (same plink/pscp pattern as sync-cutover.ps1)
param(
    [string]$PiHost = "10.42.0.1",
    [string]$PiUser = "dsc",
    [string]$PiPassword = "Digital",
    [string]$HostKey = "SHA256:4XD2kIJ5qNCnULKNmo/L9mvzLbmZdURLwLW7Utt9NJs"
)

$ErrorActionPreference = "Stop"
$RepoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..\..")
$EnvFile = Join-Path $RepoRoot "services\dsc-hub\.env"
$BrainDir = Join-Path $RepoRoot "brain"
$FirmwareHub = Join-Path $RepoRoot "firmware\v4\dsc-hub.yaml"
$RemoteSh = Join-Path $PSScriptRoot "deploy-brain-remote.sh"

$plink = "plink -batch -hostkey `"$HostKey`" -pw $PiPassword ${PiUser}@${PiHost}"
$pscp = "pscp -batch -hostkey `"$HostKey`" -pw $PiPassword"

Write-Host "Upload brain source..."
$TarPath = Join-Path $env:TEMP "dsc-brain-src.tgz"
if (Test-Path $TarPath) { Remove-Item $TarPath -Force }
Push-Location $BrainDir
tar -czf $TarPath dsc_brain requirements.txt
Pop-Location

Invoke-Expression "$pscp `"$EnvFile`" ${PiUser}@${PiHost}:/tmp/dsc-hub.env"
Invoke-Expression "$pscp `"$FirmwareHub`" ${PiUser}@${PiHost}:/tmp/dsc-hub.yaml"
Invoke-Expression "$pscp `"$TarPath`" ${PiUser}@${PiHost}:/tmp/dsc-brain-src.tgz"
Invoke-Expression "$pscp `"$RemoteSh`" ${PiUser}@${PiHost}:/tmp/deploy-brain-remote.sh"

Write-Host "Apply on Pi + rebuild brain container..."
Invoke-Expression "$plink `"tr -d '\r' < /tmp/deploy-brain-remote.sh > /tmp/deploy.sh; bash /tmp/deploy.sh $PiPassword`""

Write-Host "Done. Brain: http://${PiHost}:8787/health"
