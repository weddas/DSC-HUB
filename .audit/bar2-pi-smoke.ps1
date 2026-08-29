# Bar 2 Pi smoke — vacant probe only; never mutates Amnesia on pot1.
param([string]$Base = "http://192.168.86.48:8787")
$ErrorActionPreference = "Stop"

function Get-Json([string]$path) {
  Invoke-RestMethod -Uri ($Base + $path) -TimeoutSec 20
}

function Call-Control([string]$domain, [string]$service, [hashtable]$data) {
  $body = @{ domain = $domain; service = $service; data = $data } | ConvertTo-Json -Depth 6 -Compress
  Invoke-RestMethod -Uri ($Base + "/control/service") -Method Post -ContentType "application/json" -Body $body -TimeoutSec 30
}

Write-Host "health..."
$h = Get-Json "/health"
Write-Host ("health ok version=" + $h.version)

$html = (Invoke-WebRequest ($Base + "/") -UseBasicParsing -TimeoutSec 20).Content
if ($html -notmatch 'assets/(index-[^"]+\.js)') { throw "no spa bundle" }
$bundle = $Matches[1]
Write-Host ("bundle " + $bundle)

$openapi = Get-Json "/openapi.json"
$paths = @($openapi.paths.PSObject.Properties.Name)
foreach ($need in @("/roster/detach/{pot_n}", "/roster/assign", "/roster/move")) {
  if ($paths -notcontains $need) { throw ("missing " + $need) }
}
Write-Host "openapi has detach/assign/move"

$roster = @(Get-Json "/roster").roster
Write-Host ("roster: " + (($roster | ForEach-Object { $_.seat_id }) -join ","))
$occupied = @{}
foreach ($r in $roster) {
  if ($r.seat_id -match '^pot(\d+)$') { $occupied[[int]$Matches[1]] = $true }
}

try {
  Invoke-RestMethod -Uri ($Base + "/roster/detach/9") -Method Post -TimeoutSec 10
  throw "expected HTTP error for pot 9"
} catch {
  Write-Host "detach validation rejects pot 9"
}

$target = $null
foreach ($n in @(2, 1)) {
  if (-not $occupied.ContainsKey($n)) { $target = $n; break }
}
if ($null -eq $target) {
  Write-Host "BAR2_SMOKE_API_OK no vacant kit probe; skipped mutate"
  exit 0
}

Write-Host ("lifecycle smoke on vacant pot" + $target)

Call-Control "input_text" "set_value" @{ entity_id = "input_text.dsc_build_strain"; value = "Bar2 Smoke Strain" } | Out-Null
Call-Control "input_text" "set_value" @{ entity_id = "input_text.dsc_build_nickname"; value = "Bar2Smoke" } | Out-Null
Call-Control "input_datetime" "set_datetime" @{ entity_id = "input_datetime.dsc_build_sprout_date"; date = "2026-08-01" } | Out-Null
Call-Control "input_select" "select_option" @{ entity_id = "input_select.dsc_build_tent"; option = "2x4" } | Out-Null
Call-Control "input_select" "select_option" @{ entity_id = "input_select.dsc_build_assign_pot"; option = ([string]$target) } | Out-Null
Call-Control "script" "turn_on" @{ entity_id = "script.dsc_build_plant_commit_and_assign"; pot = ([string]$target); variables = @{ pot = ([string]$target) } } | Out-Null
Start-Sleep 1

$after = @(Get-Json "/roster").roster
$seat = $after | Where-Object { $_.seat_id -eq ("pot" + $target) }
if (-not $seat) { throw ("commit_and_assign did not create pot" + $target) }
Write-Host ("assigned Bar2Smoke to pot" + $target)

$detach = Invoke-RestMethod -Uri ($Base + "/roster/detach/" + $target) -Method Post -TimeoutSec 20
Write-Host ("detached slot=" + $detach.slot)
$mid = @(Get-Json "/roster").roster
if ($mid | Where-Object { $_.seat_id -eq ("pot" + $target) }) { throw "detach left pot roster row" }

$slotNum = [int]$detach.slot
$assign = Invoke-RestMethod -Uri ($Base + "/roster/assign") -Method Post -ContentType "application/json" -Body (@{ slot = $slotNum; pot = $target } | ConvertTo-Json -Compress) -TimeoutSec 20
Write-Host ("reassigned plant_id=" + $assign.plant_id)

$roster2 = @(Get-Json "/roster").roster
$occ2 = @{}
foreach ($r in $roster2) {
  if ($r.seat_id -match '^pot(\d+)$') { $occ2[[int]$Matches[1]] = $true }
}
$other = $null
foreach ($n in @(1, 2)) {
  if ($n -eq $target) { continue }
  if (-not $occ2.ContainsKey($n)) { $other = $n; break }
}
if ($null -ne $other -and $other -ne 1) {
  Invoke-RestMethod -Uri ($Base + "/roster/move") -Method Post -ContentType "application/json" -Body (@{ from_pot = $target; to_pot = $other } | ConvertTo-Json -Compress) -TimeoutSec 20 | Out-Null
  Write-Host ("moved to pot" + $other)
  $target = $other
} else {
  Write-Host "skip move (no safe vacant peer)"
}

Call-Control "script" "turn_on" @{ entity_id = "script.dsc_plant_retire"; pot = ([string]$target); variables = @{ pot = ([string]$target) } } | Out-Null
Start-Sleep 1
$final = @(Get-Json "/roster").roster
if ($final | Where-Object { $_.seat_id -eq ("pot" + $target) }) { throw "retire left pot row" }
$amnesia = $final | Where-Object { $_.seat_id -eq "pot1" }
if (-not $amnesia) { throw "Amnesia pot1 missing after smoke" }
Write-Host ("Amnesia still on pot1: " + $amnesia.recipe.plant_name)
Write-Host "BAR2_SMOKE_OK"
exit 0
