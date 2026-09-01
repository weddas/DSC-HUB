# Live UX Pass 5 — prove harness (energy confirm=false → 400 canonical).
# Extensible for later gate phases. Use plink/pscp only for hotpatch (see
# .cursor/rules/dsc-pi-hotpatch.mdc). Lab password pattern matches other .audit
# scripts; durable store = Notion API Keys.
# Do NOT clear Manual Light Hold from this script.
$ErrorActionPreference = "Stop"
$Repo = "C:\Users\cmgwe\Documents\DSC-HUB"
$PiHost = if ($env:DSC_PI_HOST) { $env:DSC_PI_HOST } else { "192.168.86.48" }
$Base = "http://${PiHost}:8787"
$Phase = if ($env:PASS5_PHASE) { $env:PASS5_PHASE } else { "ENERGY" }
$LocalEvid = Join-Path $Repo ".audit\live-ux-pass5-prove-evidence.json"

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
        -Headers $headers -UseBasicParsing -TimeoutSec 30
    } else {
      $resp = Invoke-WebRequest -Uri $uri -Method $Method -Headers $headers -UseBasicParsing -TimeoutSec 30
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

$out = [ordered]@{
  ts = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
  phase = $Phase
  base = $Base
  gates = [ordered]@{}
  errors = @()
  note = "Pass 5: energy confirm=false must be HTTP 400 (not 422). Hold clear is operator-gated - not in this script."
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

# --- Energy confirm gate (canonical 400) ---
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
  # Canonical Pass 5: exactly 400 (422 is no longer accepted as success).
  Set-Gate "E_confirm_false_400_$sid" ($bad.status -eq 400) @{ status = $bad.status; body = $bad.body }
}

$failed = @($out.errors).Count
$out.ok = ($failed -eq 0)
$out | ConvertTo-Json -Depth 8 | Set-Content -Path $LocalEvid -Encoding utf8
Write-Host "Evidence written: $LocalEvid (ok=$($out.ok) fails=$failed)"
if (-not $out.ok) {
  throw "Pass 5 prove failed: $($out.errors -join ', ')"
}
Write-Host "Pass 5 ENERGY prove GREEN"
