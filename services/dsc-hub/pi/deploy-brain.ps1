# Deploy brain + .env to DSC-Brain (same plink/pscp pattern as sync-cutover.ps1)
param(
    [string]$PiHost = "192.168.86.48",
    [string]$PiUser = "dsc",
    [string]$PiPassword = "Digital",
    [string]$HostKey = "SHA256:4XD2kIJ5qNCnULKNmo/L9mvzLbmZdURLwLW7Utt9NJs"
)

$ErrorActionPreference = "Stop"
$Share = "\\192.168.86.2\Digital-Documents"
if (-not (Test-Path "Y:\")) {
    Write-Host "Mapping Y: -> $Share (npm/vite require a drive letter, not UNC)"
    net use Y: $Share /persistent:no | Out-Null
}
$RepoRoot = "Y:\Digital Stealth Care\Projects\DSC-HUB"
if (-not (Test-Path (Join-Path $RepoRoot "brain\dsc_brain"))) {
    $RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..\..")).Path
}
$EnvFile = Join-Path $RepoRoot "services\dsc-hub\.env"
$BrainDir = Join-Path $RepoRoot "brain"
$FirmwareHub = Join-Path $RepoRoot "firmware\v4\dsc-hub.yaml"
$FrontendDir = Join-Path $RepoRoot "homeassistant\custom_components\dsc_hub\frontend"
$ComposeFile = Join-Path $RepoRoot "services\dsc-hub\docker-compose.yml"
$DockerPrebuilt = Join-Path $RepoRoot "services\dsc-hub\brain\Dockerfile.prebuilt"
$RemoteSh = Join-Path $PSScriptRoot "deploy-brain-remote.sh"

$plink = "plink -batch -hostkey `"$HostKey`" -pw $PiPassword ${PiUser}@${PiHost}"
$pscp = "pscp -batch -hostkey `"$HostKey`" -pw $PiPassword"

Write-Host "Build Pi SPA..."
Push-Location $FrontendDir
$prevEap = $ErrorActionPreference
$ErrorActionPreference = "Continue"
& npm.cmd run build:spa 2>&1 | ForEach-Object { Write-Host $_ }
$spaExit = $LASTEXITCODE
$ErrorActionPreference = $prevEap
Pop-Location
if ($spaExit -ne 0) { throw "SPA build failed (exit $spaExit)" }

$SpaDist = Join-Path $FrontendDir "spa-dist"
$WwwDir = Join-Path $RepoRoot "homeassistant\www"
New-Item -ItemType Directory -Force -Path (Join-Path $SpaDist "vendor") | Out-Null
foreach ($name in @("three.min.js", "dsc-dash-fx.js")) {
  $src = Join-Path $WwwDir "vendor\$name"
  if (Test-Path $src) { Copy-Item $src (Join-Path $SpaDist "vendor\$name") -Force }
}
foreach ($card in @("dsc-the-dash-card.js", "dsc-airflow-map-card.js", "dsc-system-map-card.js")) {
  $src = Join-Path $WwwDir $card
  if (Test-Path $src) { Copy-Item $src (Join-Path $SpaDist $card) -Force }
}
foreach ($asset in @("dsc-system-map.svg")) {
  $src = Join-Path $WwwDir $asset
  if (Test-Path $src) { Copy-Item $src (Join-Path $SpaDist $asset) -Force }
}

$SpaIndex = Join-Path $SpaDist "index.html"
if (Test-Path $SpaIndex) {
    $indexHtml = Get-Content $SpaIndex -Raw
    if ($indexHtml -match 'assets/(index-[^"]+\.js)') {
        Write-Host "SPA bundle: $($Matches[1])"
    }
}

Write-Host "Upload brain source..."
$TarPath = Join-Path $env:TEMP "dsc-brain-src.tgz"
$SpaTarPath = Join-Path $env:TEMP "dsc-spa-static.tgz"
if (Test-Path $TarPath) { Remove-Item $TarPath -Force }
if (Test-Path $SpaTarPath) { Remove-Item $SpaTarPath -Force }
Push-Location $BrainDir
tar -czf $TarPath dsc_brain requirements.txt
Pop-Location
Push-Location $SpaDist
tar -czf $SpaTarPath .
Pop-Location

$DataDir = Join-Path $RepoRoot "homeassistant\data"
$DataTarPath = Join-Path $env:TEMP "dsc-ha-data.tgz"
if (Test-Path $DataTarPath) { Remove-Item $DataTarPath -Force }
Push-Location $DataDir
tar -czf $DataTarPath --exclude=_cache_cannareviews *
Pop-Location

# Normalize .env to LF before upload (prevents .env\r on Pi)
$EnvUpload = Join-Path $env:TEMP "dsc-hub.env"
if (Test-Path $EnvFile) {
    $envText = [System.IO.File]::ReadAllText($EnvFile) -replace "`r`n", "`n" -replace "`r", "`n"
    [System.IO.File]::WriteAllText($EnvUpload, $envText)
} else {
    throw "Missing $EnvFile"
}

Invoke-Expression "$pscp `"$EnvUpload`" ${PiUser}@${PiHost}:/tmp/dsc-hub.env"
Invoke-Expression "$pscp `"$FirmwareHub`" ${PiUser}@${PiHost}:/tmp/dsc-hub.yaml"
Invoke-Expression "$pscp `"$TarPath`" ${PiUser}@${PiHost}:/tmp/dsc-brain-src.tgz"
Invoke-Expression "$pscp `"$SpaTarPath`" ${PiUser}@${PiHost}:/tmp/dsc-spa-static.tgz"
Invoke-Expression "$pscp `"$DataTarPath`" ${PiUser}@${PiHost}:/tmp/dsc-ha-data.tgz"
Invoke-Expression "$pscp `"$RemoteSh`" ${PiUser}@${PiHost}:/tmp/deploy-brain-remote.sh"
Invoke-Expression "$pscp `"$ComposeFile`" ${PiUser}@${PiHost}:/tmp/docker-compose.yml"
Invoke-Expression "$pscp `"$DockerPrebuilt`" ${PiUser}@${PiHost}:/tmp/Dockerfile.prebuilt"
$EthScript = Join-Path $PSScriptRoot "bring-up-eth0.sh"
Invoke-Expression "$pscp `"$EthScript`" ${PiUser}@${PiHost}:/tmp/bring-up-eth0.sh"

Write-Host "Apply on Pi + rebuild brain container..."
Invoke-Expression "$plink `"tr -d '\r' < /tmp/deploy-brain-remote.sh > /tmp/deploy.sh; bash /tmp/deploy.sh $PiPassword`""

Write-Host "Done. Brain: http://${PiHost}:8787/health"
Write-Host "Verify: services/dsc-hub/pi/verify-brain.ps1"
