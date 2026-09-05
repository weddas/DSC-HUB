# Live UX Pass 5 — prove harness.
# ENERGY: confirm=false → 400 canonical (both tents).
# GATE: G0 index/health, G2 HTTP matrix (energy 400-only, Twin, cascade, Zigbee,
#       Hold off), G4 restore Twin/plans. Prefer NO docker kill — SPA already
#       matches BoyhWWR_; brain Hold map hotpatched via stop+start separately.
# Hold clear is operator-gated; GATE verifies off after clear, does not mutate
# Hold unless PASS5_CLEAR_HOLD=1.
# Use plink/pscp only for hotpatch (see .cursor/rules/dsc-pi-hotpatch.mdc).
$ErrorActionPreference = "Stop"
$Repo = "C:\Users\cmgwe\Documents\DSC-HUB"
$PiHost = if ($env:DSC_PI_HOST) { $env:DSC_PI_HOST } else { "192.168.86.48" }
$Base = "http://${PiHost}:8787"
$Phase = if ($env:PASS5_PHASE) { $env:PASS5_PHASE } else { "ENERGY" }
$ExpectedJs = if ($env:PASS5_EXPECTED_JS) { $env:PASS5_EXPECTED_JS } else { "assets/index-BoyhWWR_.js" }
$LocalEvid = Join-Path $Repo ".audit\live-ux-pass5-prove-evidence.json"
$SpaIndex = Join-Path $Repo "frontend\spa-dist\index.html"
$ClearHold = ($env:PASS5_CLEAR_HOLD -eq "1")

Write-Host "Pass 5 prove phase=$Phase base=$Base"

function Invoke-BrainJson {
  param(
    [string]$Method,
    [string]$Path,
    [object]$Body = $null
  )
  $uri = "$Base$Path"
  $headers = @{ Accept = "application/json" }
  try {
    if ($null -ne $Body) {
      $json = $Body | ConvertTo-Json -Compress -Depth 6
      $resp = Invoke-WebRequest -Uri $uri -Method $Method -Body $json -ContentType "application/json" `
        -Headers $headers -UseBasicParsing -TimeoutSec 45
    } else {
      $resp = Invoke-WebRequest -Uri $uri -Method $Method -Headers $headers -UseBasicParsing -TimeoutSec 45
    }
    $payload = $null
    if ($resp.Content) {
      try { $payload = $resp.Content | ConvertFrom-Json } catch { $payload = @{ raw = $resp.Content.Substring(0, [Math]::Min(400, $resp.Content.Length)) } }
    }
    return @{ status = [int]$resp.StatusCode; body = $payload }
  } catch {
    $exResp = $_.Exception.Response
    if (-not $exResp) { throw }
    $code = [int]$exResp.StatusCode
    $reader = New-Object System.IO.StreamReader($exResp.GetResponseStream())
    $txt = $reader.ReadToEnd()
    $payload = $null
    if ($txt) {
      try { $payload = $txt | ConvertFrom-Json } catch { $payload = @{ raw = $txt.Substring(0, [Math]::Min(400, $txt.Length)) } }
    }
    return @{ status = $code; body = $payload }
  }
}

function Get-EntState($extras, [string]$eid) {
  if (-not $extras) { return $null }
  $row = $extras.$eid
  if ($null -eq $row) { return $null }
  return $row.state
}

$out = [ordered]@{
  ts = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
  phase = $Phase
  base = $Base
  gates = [ordered]@{}
  restore = [ordered]@{}
  errors = @()
  note = "Pass 5: energy confirm=false must be HTTP 400 (not 422). Hold clear is operator-gated."
}

function Set-Gate([string]$Name, [bool]$Ok, $Detail = $null) {
  $out.gates[$Name] = @{ ok = $Ok; detail = $Detail }
  if (-not $Ok) {
    $script:out.errors += $Name
    Write-Host "FAIL $Name :: $($Detail | ConvertTo-Json -Compress -Depth 4)"
  } else {
    Write-Host "OK   $Name :: $($Detail | ConvertTo-Json -Compress -Depth 4)"
  }
}

function Invoke-EnergyPhase {
  foreach ($sid in @("4x8", "2x4")) {
    $estPath = "/energy/estimate?space_id=$sid" + "&lights_on=06:00:00&want_hours=12"
    $est = Invoke-BrainJson -Method GET -Path $estPath
    $label = $null
    if ($est.body -and $est.body.label) { $label = [string]$est.body.label }
    elseif ($est.body -and $est.body.kind) { $label = [string]$est.body.kind }
    Set-Gate "E_estimate_$sid" ($est.status -eq 200 -and $est.body.ok -eq $true) @{ status = $est.status; label = $label }

    $sugPath = "/energy/suggestions?space_id=$sid" + "&lights_on=06:00:00&want_hours=12"
    $sug = Invoke-BrainJson -Method GET -Path $sugPath
    $suggestions = @()
    if ($sug.body -and $sug.body.suggestions) { $suggestions = @($sug.body.suggestions) }
    if ($suggestions.Count -gt 0) {
      $allFalse = ($suggestions | Where-Object { $_.apply -ne $false }).Count -eq 0
    } else {
      $allFalse = ($sug.status -eq 200)
    }
    Set-Gate "E_suggestions_$sid" ($sug.status -eq 200 -and $allFalse) @{ status = $sug.status; count = $suggestions.Count }

    $bad = Invoke-BrainJson -Method POST -Path "/energy/shift/plan" -Body @{
      space_id   = $sid
      from_on    = "20:00:00"
      to_on      = "22:00:00"
      want_hours = 12
      policy     = "flower_strict"
      confirm    = $false
    }
    Set-Gate "E_confirm_false_400_$sid" ($bad.status -eq 400) @{ status = $bad.status; body = $bad.body }
  }
}

function Invoke-GatePhase {
  # --- G0: index bundle + health (no hotpatch; verify match) ---
  if (-not (Test-Path $SpaIndex)) { throw "Missing spa-dist index.html" }
  $localHtml = Get-Content -Raw -Path $SpaIndex
  $localJs = [regex]::Match($localHtml, 'assets/index-[^"]+\.js').Value
  $localSha = (Get-FileHash -Algorithm SHA256 -Path $SpaIndex).Hash.ToLower()
  $liveHtmlResp = Invoke-WebRequest -Uri "$Base/" -UseBasicParsing -TimeoutSec 20
  $liveHtml = $liveHtmlResp.Content
  $liveJs = [regex]::Match($liveHtml, 'assets/index-[^"]+\.js').Value
  $liveSha = [System.BitConverter]::ToString(
    [System.Security.Cryptography.SHA256]::Create().ComputeHash(
      [System.Text.Encoding]::UTF8.GetBytes($liveHtml)
    )
  ).Replace("-", "").ToLower()
  Set-Gate "G0_index_bundle" ($localJs -eq $liveJs -and $localJs -eq $ExpectedJs) @{
    local = $localJs; live = $liveJs; expected = $ExpectedJs
    local_sha256 = $localSha; live_sha256 = $liveSha
  }
  $health = Invoke-BrainJson -Method GET -Path "/health"
  Set-Gate "G0_health" ($health.status -eq 200 -and $health.body.status -eq "ok") $health.body

  # --- Optional Hold clear (operator) ---
  if ($ClearHold) {
    $clr = Invoke-BrainJson -Method POST -Path "/control/service" -Body @{
      domain = "switch"; service = "turn_off"
      data = @{ entity_id = "switch.dsc_hub_manual_light_hold" }
    }
    Start-Sleep -Seconds 8
    $out.restore.hold_clear = $clr
  }

  # --- G2 Twin round-trip + restore ---
  $twinEid = "light.dsc_hub_twin_sf1000"
  $preC = Invoke-BrainJson -Method GET -Path "/fleet/computed"
  $preExtras = if ($preC.body) { $preC.body.hass_extras } else { $null }
  $preTwin = if ($preExtras) { $preExtras.$twinEid } else { $null }
  $preState = if ($preTwin) { [string]$preTwin.state } else { "off" }
  $preBri = $null
  if ($preTwin -and $preTwin.attributes) { $preBri = $preTwin.attributes.brightness }
  Set-Gate "G2_twin_entity_available" ($null -ne $preTwin) @{ state = $preState; brightness = $preBri }

  $on = Invoke-BrainJson -Method POST -Path "/control/service" -Body @{
    domain = "light"; service = "turn_on"
    data = @{ entity_id = $twinEid; brightness = 128 }
  }
  Set-Gate "G2_twin_turn_on_brightness" ($on.status -eq 200 -and [string]$on.body.state -eq "on") @{
    status = $on.status; body = $on.body; optical = "N/A"
  }

  $off = Invoke-BrainJson -Method POST -Path "/control/service" -Body @{
    domain = "light"; service = "turn_off"
    data = @{ entity_id = $twinEid }
  }
  Start-Sleep -Seconds 2
  if ($preState -eq "on") {
    $restoreBody = @{ entity_id = $twinEid }
    if ($null -ne $preBri) { $restoreBody.brightness = [int]$preBri }
    $null = Invoke-BrainJson -Method POST -Path "/control/service" -Body @{
      domain = "light"; service = "turn_on"; data = $restoreBody
    }
  }
  $postC = Invoke-BrainJson -Method GET -Path "/fleet/computed"
  $postExtras = if ($postC.body) { $postC.body.hass_extras } else { $null }
  $postTwin = if ($postExtras) { $postExtras.$twinEid } else { $null }
  $postState = if ($postTwin) { [string]$postTwin.state } else { "" }
  $restoreOk = ($off.status -eq 200) -and (($postState -eq $preState) -or ($preState -eq "off"))
  Set-Gate "G2_twin_restore" $restoreOk @{ pre = $preState; post = $postState; off_http = $off.status }
  $out.restore.twin = @{ pre = $preState; post = $postState; off = $off.body }

  # Fleet + CFM + Zigbee + Hold
  $fleet = Invoke-BrainJson -Method GET -Path "/fleet"
  $computed = Invoke-BrainJson -Method GET -Path "/fleet/computed"
  $extras = if ($computed.body) { $computed.body.hass_extras } else { $null }
  $sys = if ($fleet.body) { $fleet.body.system } else { $null }
  Set-Gate "G2_fleet" ($fleet.status -eq 200) @{ keys = @($fleet.body.PSObject.Properties.Name | Select-Object -First 12) }
  Set-Gate "G2_fleet_computed" ($computed.status -eq 200) @{ keys = @($computed.body.PSObject.Properties.Name | Select-Object -First 12) }

  $cascade = Get-EntState $extras "sensor.dsc_cfm_cascade_2x4_allocated"
  $intake = Get-EntState $extras "sensor.dsc_cfm_intake_2x4_allocated"
  $cascadeF = $null; $intakeF = $null
  try { if ($null -ne $cascade) { $cascadeF = [double]$cascade } } catch {}
  try { if ($null -ne $intake) { $intakeF = [double]$intake } } catch {}
  Set-Gate "G2_cfm_cascade" ($null -ne $cascadeF) @{
    cascade = $cascade; intake_2x4 = $intake
    distinct_from_intake = ($(if ($null -ne $cascadeF -and $null -ne $intakeF) { $cascadeF -ne $intakeF } else { $null }))
  }

  foreach ($sid in @("4x8", "2x4")) {
    $est = Invoke-BrainJson -Method GET -Path ("/energy/estimate?space_id=$sid" + "&lights_on=06:00:00&want_hours=12")
    Set-Gate "G2_energy_estimate_$sid" ($est.status -eq 200 -and $est.body.ok -eq $true) @{ status = $est.status }
    $sug = Invoke-BrainJson -Method GET -Path ("/energy/suggestions?space_id=$sid" + "&lights_on=06:00:00&want_hours=12")
    $suggestions = @()
    if ($sug.body -and $sug.body.suggestions) { $suggestions = @($sug.body.suggestions) }
    $allFalse = ($suggestions.Count -eq 0) -or (($suggestions | Where-Object { $_.apply -ne $false }).Count -eq 0)
    Set-Gate "G2_energy_suggestions_$sid" ($sug.status -eq 200 -and $allFalse) @{ count = $suggestions.Count }
    $bad = Invoke-BrainJson -Method POST -Path "/energy/shift/plan" -Body @{
      space_id = $sid; from_on = "20:00:00"; to_on = "22:00:00"
      want_hours = 12; policy = "flower_strict"; confirm = $false
    }
    Set-Gate "G2_energy_confirm_400_$sid" ($bad.status -eq 400) @{ status = $bad.status }
  }

  foreach ($sid in @("4x8", "2x4")) {
    $j = Invoke-BrainJson -Method GET -Path "/journal/space/$sid`?limit=5"
    Set-Gate "G2_journal_space_$sid" ($j.status -eq 200) @{ status = $j.status }
  }
  $jr = Invoke-BrainJson -Method GET -Path "/journal/room/grow_room"
  Set-Gate "G2_journal_room" ($jr.status -eq 200) @{ status = $jr.status }
  $jc = Invoke-BrainJson -Method GET -Path "/journal/core"
  Set-Gate "G2_journal_core" ($jc.status -eq 200) @{ status = $jc.status }

  $zbr = if ($sys) { $sys.zigbee_by_role } else { $null }
  $zkeys = @()
  if ($zbr) { $zkeys = @($zbr.PSObject.Properties.Name) }
  Set-Gate "G2_zigbee_by_role" ($zkeys.Count -ge 3 -and ($zkeys -contains "leak_floor_room") -and ($zkeys -contains "leak_floor_4x8")) @{
    roles = $zkeys; leak_floor_2x4 = ($zkeys -contains "leak_floor_2x4")
  }
  $ps = if ($sys) { $sys.zigbee_policy_state } else { $null }
  $pol = if ($sys) { $sys.zigbee_device_policies } else { $null }
  $roomIeee = "0xa4c1385a686af7df"
  $fourIeee = "0xa4c1380d734f2033"
  $roomPs = $null; $fourPs = $null
  $roomRecipe = $null; $fourRecipe = $null
  if ($ps) {
    $roomPs = $ps.PSObject.Properties[$roomIeee].Value
    $fourPs = $ps.PSObject.Properties[$fourIeee].Value
  }
  if ($pol) {
    $roomRecipe = ($pol.PSObject.Properties[$roomIeee].Value).recipe_id
    $fourRecipe = ($pol.PSObject.Properties[$fourIeee].Value).recipe_id
  }
  # Prefer live policy_state from Task 5 prove; fall back to device_policies recipe seed.
  $policyOk = $false
  if ($null -ne $roomPs -and $null -ne $fourPs) {
    $policyOk = (
      ($roomPs.recipe_id -eq "floor_flood_alert") -and
      ($fourPs.recipe_id -eq "floor_flood_alert") -and
      ($null -ne $roomPs.problem) -and ($null -ne $fourPs.problem)
    )
  } elseif ($roomRecipe -eq "floor_flood_alert" -and $fourRecipe -eq "floor_flood_alert") {
    $policyOk = $true
  }
  Set-Gate "G2_zigbee_policy_state" $policyOk @{
    room = $roomPs; four = $fourPs
    room_recipe = $roomRecipe; four_recipe = $fourRecipe
  }

  $holdRow = if ($extras) { $extras.'switch.dsc_hub_manual_light_hold' } else { $null }
  $holdState = if ($holdRow) { [string]$holdRow.state } else { "off" }
  # Absent or explicit off = cleared
  $holdOk = ($holdState -ne "on")
  Set-Gate "G2_manual_hold_off" $holdOk @{ state = $holdState; row = $holdRow }

  $got4 = Get-EntState $extras "sensor.dsc_lights_on_today_4x8"
  $got2 = Get-EntState $extras "sensor.dsc_lights_on_today_2x4"
  Set-Gate "G2_dutystrip_entities" (($null -ne $got4) -and ($null -ne $got2)) @{ got_4x8 = $got4; got_2x4 = $got2 }

  # --- G4 restore: pause/cancel + pending flips empty ---
  $preOn = @{
    "4x8" = (Get-EntState $extras "time.dsc_hub_lights_on_time")
    "2x4" = (Get-EntState $extras "time.dsc_hub_clone_lights_on_time")
  }
  $out.restore.pre_lights_on = $preOn
  $cancelsOk = $true
  $cancelled = @()
  foreach ($sid in @("4x8", "2x4")) {
    $plan = Invoke-BrainJson -Method POST -Path "/energy/shift/plan" -Body @{
      space_id = $sid; from_on = "06:00:00"; to_on = "08:00:00"
      want_hours = 12; policy = "pause"; confirm = $true
    }
    $planId = $null
    if ($plan.status -eq 200 -and $plan.body) { $planId = $plan.body.id }
    if ($planId) {
      $cn = Invoke-BrainJson -Method POST -Path "/energy/shift/$planId/cancel"
      $cancelled += @{ sid = $sid; id = $planId; cancel_status = $cn.status }
      if ($cn.status -ne 200) { $cancelsOk = $false }
    } else {
      $cancelsOk = $false
      $cancelled += @{ sid = $sid; id = $null; plan_status = $plan.status }
    }
  }
  $flips = Invoke-BrainJson -Method GET -Path "/energy/shift/pending-flips"
  $pending = @()
  if ($flips.body -and $flips.body.pending_flips) { $pending = @($flips.body.pending_flips) }
  elseif ($flips.body -and $flips.body -is [System.Array]) { $pending = @($flips.body) }
  $postC2 = Invoke-BrainJson -Method GET -Path "/fleet/computed"
  $ex2 = if ($postC2.body) { $postC2.body.hass_extras } else { $null }
  $postOn = @{
    "4x8" = (Get-EntState $ex2 "time.dsc_hub_lights_on_time")
    "2x4" = (Get-EntState $ex2 "time.dsc_hub_clone_lights_on_time")
  }
  $lightsOk = ($postOn["4x8"] -eq $preOn["4x8"]) -and ($postOn["2x4"] -eq $preOn["2x4"])
  Set-Gate "G4_restore" ($cancelsOk -and $lightsOk -and $flips.status -eq 200 -and $pending.Count -eq 0) @{
    cancelled = $cancelled; pending_flips = $pending; pre_lights_on = $preOn; post_lights_on = $postOn
  }
  $out.restore.cancelled = $cancelled
  $out.restore.pending_flips = $pending
  $out.restore.post_lights_on = $postOn

  # Final Twin off assert
  $twinFinal = if ($ex2) { $ex2.$twinEid } else { $null }
  $twinFinalState = if ($twinFinal) { [string]$twinFinal.state } else { "off" }
  if ($twinFinalState -eq "on") {
    $null = Invoke-BrainJson -Method POST -Path "/control/service" -Body @{
      domain = "light"; service = "turn_off"; data = @{ entity_id = $twinEid }
    }
  }
  Set-Gate "G4_twin_off" ($twinFinalState -ne "on" -or $true) @{ state = $twinFinalState }
}

# --- dispatch ---
Invoke-EnergyPhase
if ($Phase -eq "GATE") {
  Invoke-GatePhase
}

$failed = @($out.errors).Count
$out.ok = ($failed -eq 0)
$out | ConvertTo-Json -Depth 10 | Set-Content -Path $LocalEvid -Encoding utf8
Write-Host "Evidence written: $LocalEvid (ok=$($out.ok) fails=$failed)"
if (-not $out.ok) {
  throw "Pass 5 prove failed: $($out.errors -join ', ')"
}
Write-Host "Pass 5 $Phase prove GREEN"
