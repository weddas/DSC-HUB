# One-shot: map repo drive (if needed), deploy brain, verify, island-proof.
# Run from any PowerShell: right-click → Run with PowerShell, or:
#   powershell -ExecutionPolicy Bypass -File "\\...\studio-deploy.ps1"
$ErrorActionPreference = "Stop"
$Share = "\\192.168.86.2\Digital-Documents"
$PiDir = Join-Path $Share "Digital Stealth Care\Projects\DSC-HUB\services\dsc-hub\pi"

if (-not (Test-Path "Y:\")) {
    Write-Host "Mapping Y: -> $Share"
    net use Y: $Share /persistent:no | Out-Null
    $RepoPi = "Y:\Digital Stealth Care\Projects\DSC-HUB\services\dsc-hub\pi"
} else {
    $RepoPi = $PiDir
    if (-not (Test-Path (Join-Path $RepoPi "deploy-brain.ps1"))) {
        $RepoPi = "Y:\Digital Stealth Care\Projects\DSC-HUB\services\dsc-hub\pi"
    }
}

if (-not (Test-Path (Join-Path $RepoPi "deploy-brain.ps1"))) {
    throw "Cannot find deploy-brain.ps1 at $RepoPi — map Y: or check NAS share."
}

Set-Location $RepoPi
Write-Host "=== deploy-brain ===" -ForegroundColor Cyan
& .\deploy-brain.ps1
if ($LASTEXITCODE -ne 0) { throw "deploy-brain failed" }

Write-Host "=== verify-brain ===" -ForegroundColor Cyan
& .\verify-brain.ps1
if ($LASTEXITCODE -ne 0) { throw "verify-brain failed" }

Write-Host "=== island-proof ===" -ForegroundColor Cyan
& .\island-proof.ps1
if ($LASTEXITCODE -ne 0) { throw "island-proof failed" }

Write-Host "Done. Brain: http://192.168.86.48:8787/" -ForegroundColor Green
