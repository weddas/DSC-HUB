# Sync Pi cutover secrets + .env to DSC-Brain (run from repo root on Windows)
# Requires: PuTTY plink/pscp, Pi reachable on house LAN
param(
    [string]$PiHost = "192.168.86.25",
    [string]$PiUser = "dsc",
    [string]$PiPassword = "Digital",
    [string]$HostKey = "SHA256:4XD2kIJ5qNCnULKNmo/L9mvzLbmZdURLwLW7Utt9NJs"
)

$ErrorActionPreference = "Stop"
$RepoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..\..")
$Secrets = Join-Path $RepoRoot "firmware\v4\secrets.yaml"
$EnvFile = Join-Path $RepoRoot "services\dsc-hub\.env"

if (-not (Test-Path $Secrets)) {
    Write-Error "Missing $Secrets — copy from secrets.yaml.template and fill in."
}
if (-not (Test-Path $EnvFile)) {
    Write-Error "Missing $EnvFile — copy from env.example and fill in."
}

$plink = "plink -batch -hostkey `"$HostKey`" -pw $PiPassword ${PiUser}@${PiHost}"
$pscp = "pscp -batch -hostkey `"$HostKey`" -pw $PiPassword"

Write-Host "Uploading secrets.yaml..."
Invoke-Expression "$pscp `"$Secrets`" ${PiUser}@${PiHost}:/opt/dsc-hub-repo/firmware/v4/secrets.yaml"

Write-Host "Uploading .env..."
Invoke-Expression "$pscp `"$EnvFile`" ${PiUser}@${PiHost}:/opt/dsc-hub-repo/services/dsc-hub/.env"

Write-Host "Fixing permissions and restarting stack..."
$remote = @"
chmod 600 /opt/dsc-hub-repo/firmware/v4/secrets.yaml /opt/dsc-hub-repo/services/dsc-hub/.env
cp /opt/dsc-hub-repo/services/dsc-hub/.env /opt/dsc-hub/.env 2>/dev/null || ln -sf /opt/dsc-hub-repo/services/dsc-hub/.env /opt/dsc-hub/.env
systemctl reset-failed dsc-hub-compose.service 2>/dev/null || true
systemctl start dsc-hub-ap.service
systemctl start dsc-hub-compose.service
systemctl is-active dsc-hub-compose
docker compose -f /opt/dsc-hub/docker-compose.yml ps --format 'table {{.Name}}\t{{.Status}}'
"@
Invoke-Expression "$plink `"$remote`""

Write-Host "Done. ESPHome: http://${PiHost}:6052  Brain: http://${PiHost}:8787"
