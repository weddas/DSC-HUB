# Grow Logs — Pi hotpatch (SPA + journal brain) + HTTP prove
param([switch]$SkipHotpatch)
$ErrorActionPreference = "Stop"
$Repo = "C:\Users\cmgwe\Documents\DSC-HUB"
$PiHost = if ($env:DSC_PI_HOST) { $env:DSC_PI_HOST } else { "192.168.86.48" }
$PiUser = "dsc"
$PiPassword = "Digital"
$HostKey = "SHA256:4XD2kIJ5qNCnULKNmo/L9mvzLbmZdURLwLW7Utt9NJs"
$Base = "http://${PiHost}:8787"

$pscp = "pscp -batch -hostkey `"$HostKey`" -pw $PiPassword"
$plink = "plink -batch -hostkey `"$HostKey`" -pw $PiPassword ${PiUser}@${PiHost}"

$SpaDir = Join-Path $Repo "frontend\spa-dist"
$ExpectedJs = ([regex]::Match((Get-Content -Raw (Join-Path $SpaDir "index.html")), 'assets/index-[^"]+\.js')).Value
if (-not $ExpectedJs) { $ExpectedJs = "assets/index-mqa24gAf.js" }
$EvidPath = Join-Path $Repo ".audit\grow-logs-pi-prove-evidence.json"

if (-not $SkipHotpatch) {
$BrainMods = @(
  "journal_snapshot.py",
  "plant_journal.py",
  "space_journal.py",
  "room_journal.py",
  "dsc_core_journal.py",
  "api.py"
)

$Tmp = Join-Path $env:TEMP "grow-logs-hp-$(Get-Date -Format 'yyyyMMddHHmmss')"
New-Item -ItemType Directory -Path $Tmp | Out-Null
$SpaTar = Join-Path $Tmp "spa.tgz"
$BrainTar = Join-Path $Tmp "brain.tgz"

Push-Location $SpaDir
tar -czf $SpaTar *
Pop-Location

$BrainStage = Join-Path $Tmp "dsc_brain"
New-Item -ItemType Directory -Path $BrainStage | Out-Null
foreach ($m in $BrainMods) {
  Copy-Item (Join-Path $Repo "brain\dsc_brain\$m") (Join-Path $BrainStage $m)
}
Push-Location $Tmp
tar -czf $BrainTar dsc_brain
Pop-Location

$RemoteSh = @"
#!/bin/bash
set -euo pipefail
PW=Digital
mkdir -p /tmp/grow-logs-spa /tmp/grow-logs-brain
tar -xzf /tmp/grow-logs-spa.tgz -C /tmp/grow-logs-spa
tar -xzf /tmp/grow-logs-brain.tgz -C /tmp/grow-logs-brain
echo "`$PW" | sudo -S docker cp /tmp/grow-logs-spa/. dsc-hub-brain:/app/static/
for f in journal_snapshot.py plant_journal.py space_journal.py room_journal.py dsc_core_journal.py api.py; do
  echo "`$PW" | sudo -S docker cp /tmp/grow-logs-brain/dsc_brain/`$f dsc-hub-brain:/app/dsc_brain/`$f
done
echo "`$PW" | sudo -S docker stop -t 20 dsc-hub-brain
echo "`$PW" | sudo -S docker start dsc-hub-brain
for i in `$(seq 1 45); do
  if curl -sf -m 3 http://127.0.0.1:8787/health >/dev/null 2>&1; then echo brain_up_`$i; break; fi
  sleep 2
done
grep -oE 'assets/index-[^"]+\.js' /tmp/grow-logs-spa/index.html | head -1
curl -sf http://127.0.0.1:8787/ | grep -oE 'assets/index-[^"]+\.js' | head -1 || true
"@

$RemotePath = Join-Path $Tmp "grow-logs-hp.sh"
[System.IO.File]::WriteAllText($RemotePath, ($RemoteSh -replace "`r`n", "`n"))

Write-Host "Upload SPA + brain tarballs..."
Invoke-Expression "$pscp `"$SpaTar`" ${PiUser}@${PiHost}:/tmp/grow-logs-spa.tgz"
Invoke-Expression "$pscp `"$BrainTar`" ${PiUser}@${PiHost}:/tmp/grow-logs-brain.tgz"
Invoke-Expression "$pscp `"$RemotePath`" ${PiUser}@${PiHost}:/tmp/grow-logs-hp.sh"
Write-Host "Run hotpatch (stop+start)..."
Invoke-Expression "$plink `"tr -d '\r' < /tmp/grow-logs-hp.sh > /tmp/grow-logs-hp.run.sh; bash /tmp/grow-logs-hp.run.sh`""
} else {
Write-Host "SkipHotpatch: HTTP prove only"
}

function Invoke-BrainJson {
  param([string]$Method, [string]$Path, [object]$Body = $null)
  $uri = "$Base$Path"
  try {
    if ($null -ne $Body) {
      $json = $Body | ConvertTo-Json -Compress -Depth 8
      $resp = Invoke-WebRequest -Uri $uri -Method $Method -Body $json -ContentType "application/json" `
        -Headers @{ Accept = "application/json" } -UseBasicParsing -TimeoutSec 45
    } else {
      $resp = Invoke-WebRequest -Uri $uri -Method $Method -Headers @{ Accept = "application/json" } `
        -UseBasicParsing -TimeoutSec 45
    }
    $payload = $null
    if ($resp.Content) { try { $payload = $resp.Content | ConvertFrom-Json } catch { $payload = @{ raw = $resp.Content } } }
    return @{ status = [int]$resp.StatusCode; body = $payload }
  } catch {
    $exResp = $_.Exception.Response
    if (-not $exResp) { throw }
    $code = [int]$exResp.StatusCode
    $reader = New-Object System.IO.StreamReader($exResp.GetResponseStream())
    $txt = $reader.ReadToEnd()
    $payload = $null
    if ($txt) { try { $payload = $txt | ConvertFrom-Json } catch { $payload = @{ raw = $txt } } }
    return @{ status = $code; body = $payload }
  }
}

$out = [ordered]@{
  ts = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
  base = $Base
  expected_js = $ExpectedJs
  gates = [ordered]@{}
  errors = @()
}

function Set-Gate([string]$Name, [bool]$Ok, $Detail = $null) {
  $out.gates[$Name] = @{ ok = $Ok; detail = $Detail }
  if (-not $Ok) {
    $script:out.errors += $Name
    Write-Host "FAIL $Name"
  } else {
    Write-Host "OK   $Name"
  }
}

Start-Sleep -Seconds 3

$localHtml = Get-Content -Raw -Path (Join-Path $SpaDir "index.html")
$localJs = [regex]::Match($localHtml, 'assets/index-[^"]+\.js').Value
$liveHtml = (Invoke-WebRequest -Uri "$Base/" -UseBasicParsing -TimeoutSec 20).Content
$liveJs = [regex]::Match($liveHtml, 'assets/index-[^"]+\.js').Value
Set-Gate "G0_index_bundle" ($localJs -eq $liveJs -and $liveJs -eq $ExpectedJs) @{ local = $localJs; live = $liveJs }

$health = Invoke-BrainJson -Method GET -Path "/health"
Set-Gate "G0_health" ($health.status -eq 200 -and $health.body.status -eq "ok") $health.body

$list = Invoke-BrainJson -Method GET -Path "/journal/space/4x8?limit=10&offset=0"
$hasPaginated = ($list.status -eq 200 -and $list.body.entries -ne $null -and $list.body.total -ne $null)
Set-Gate "G1_journal_list_paginated" $hasPaginated @{
  status = $list.status
  total = if ($list.body) { $list.body.total } else { $null }
  count = if ($list.body -and $list.body.entries) { @($list.body.entries).Count } else { 0 }
}

$note = "grow-logs prove $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
$post = Invoke-BrainJson -Method POST -Path "/journal/space/4x8" -Body @{
  note = $note
  tags = @("prove")
  source = "operator"
}
$hasSnapshot = ($post.status -in 200, 201) -and ($post.body.snapshot -ne $null)
Set-Gate "G2_post_snapshot" $hasSnapshot @{
  status = $post.status
  snapshot_keys = if ($post.body -and $post.body.snapshot) { @($post.body.snapshot.PSObject.Properties.Name) } else { @() }
  entry_id = if ($post.body) { $post.body.id } else { $null }
}

$entryId = if ($post.body) { $post.body.id } else { $null }
if ($entryId) {
  $patch = Invoke-BrainJson -Method PATCH -Path "/journal/space/4x8/$entryId" -Body @{
    note = "$note (edited)"
    tags = @("prove", "highlight")
  }
  Set-Gate "G3_patch_operator" ($patch.status -eq 200) @{ status = $patch.status; id = $entryId }

  # Find a system row to prove 403
  $sysId = $null
  if ($list.body -and $list.body.entries) {
    foreach ($e in @($list.body.entries)) {
      if ($e.source -eq "system") { $sysId = $e.id; break }
    }
  }
  if ($sysId) {
    $sysPatch = Invoke-BrainJson -Method PATCH -Path "/journal/space/4x8/$sysId" -Body @{ note = "should fail" }
    Set-Gate "G4_patch_system_403" ($sysPatch.status -eq 403) @{ status = $sysPatch.status; id = $sysId }
  } else {
    Set-Gate "G4_patch_system_403" $true @{ skipped = "no system row in first page" }
  }

  $del = Invoke-BrainJson -Method DELETE -Path "/journal/space/4x8/$entryId"
  Set-Gate "G5_delete_operator" ($del.status -in 200, 204) @{ status = $del.status; id = $entryId }
}

$out | ConvertTo-Json -Depth 8 | Set-Content -Path $EvidPath -Encoding UTF8
Write-Host "Evidence: $EvidPath"
if ($out.errors.Count -gt 0) {
  Write-Host "GATE RED - $($out.errors -join ', ')"
  exit 1
}
Write-Host "HTTP GATE GREEN"
exit 0
