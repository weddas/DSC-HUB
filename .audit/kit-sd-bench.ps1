# DSC-HUB 8.0 kit SD bench gates (Windows → Pi)
# Usage: .\.audit\kit-sd-bench.ps1 [-PiHost 192.168.86.48]
param(
  [string]$PiHost = "192.168.86.48",
  [int]$Port = 8787
)
$ErrorActionPreference = "Stop"
$base = "http://${PiHost}:${Port}"
Write-Host "kit-sd-bench 8.0 against $base"

function Assert-True($cond, $msg) {
  if (-not $cond) { throw "FAIL: $msg" }
  Write-Host "PASS: $msg"
}

$h = Invoke-RestMethod -Uri "$base/health" -TimeoutSec 15
Assert-True ($h.version -like "8.0*") "brain version 8.0.x (got $($h.version))"
Assert-True ($h.surface -like "8.0*") "surface 8.0.x (got $($h.surface))"

$net = Invoke-RestMethod -Uri "$base/settings/network" -TimeoutSec 15
Assert-True ($null -ne $net.operator_mode) "operator_mode present ($($net.operator_mode))"
Assert-True ($null -ne $net.spa_urls) "spa_urls present"

$st = Invoke-RestMethod -Uri "$base/setup/state" -TimeoutSec 15
Write-Host "setup commissioned=$($st.commissioned) phase=$($st.phase)"

$ports = Invoke-RestMethod -Uri "$base/settings/usb-flash/ports" -TimeoutSec 15
Assert-True ($null -ne $ports.ports) "usb-flash ports endpoint OK"

$upd = Invoke-RestMethod -Uri "$base/settings/update" -TimeoutSec 15
Write-Host "update eth_up=$($upd.eth_up) can_full_pull=$($upd.can_full_pull)"

Write-Host "kit-sd-bench: core API gates passed. Manual: SoftAP path, one USB flash, Zigbee bind."
