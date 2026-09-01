# Live UX Pass 4 — Phase A Twin software Pi smoke
# Hotpatch SPA (index-BEjnawnp.js) + brain hybrid Got modules; Twin entity +
# on/brightness command round-trip (optical output N/A).
# Use plink/pscp only (see .cursor/rules/dsc-pi-hotpatch.mdc). Lab password
# pattern matches other .audit hotpatch scripts; durable store = Notion API Keys.
# Task 7 will extend this script for full gate (Phase B/C stress).
$ErrorActionPreference = "Stop"
$Repo = "C:\Users\cmgwe\Documents\DSC-HUB"
$PiHost = "192.168.86.48"
$PiUser = "dsc"
$PiPassword = "Digital"
$HostKey = "SHA256:4XD2kIJ5qNCnULKNmo/L9mvzLbmZdURLwLW7Utt9NJs"
$ExpectedJs = "assets/index-BEjnawnp.js"
$Phase = if ($env:PASS4_PHASE) { $env:PASS4_PHASE } else { "A" }

$SpaTar = Join-Path $env:TEMP "live-ux-pass4-spa.tgz"
$BrainTar = Join-Path $env:TEMP "live-ux-pass4-brain.tgz"
$RemoteSh = Join-Path $Repo ".audit\live-ux-pass4-prove.sh"
$SpaDist = Join-Path $Repo "homeassistant\custom_components\dsc_hub\frontend\spa-dist"
$BrainDir = Join-Path $Repo "brain"
$LocalEvid = Join-Path $Repo ".audit\live-ux-pass4-prove-evidence.json"

if (-not (Test-Path (Join-Path $SpaDist "index.html"))) {
  throw "Missing SPA dist - run npm run build:spa first"
}

$localJs = (Select-String -Path (Join-Path $SpaDist "index.html") -Pattern 'assets/index-[^"]+\.js').Matches.Value | Select-Object -First 1
Write-Host "Local SPA bundle: $localJs (phase=$Phase)"
if ($localJs -ne $ExpectedJs) {
  throw "Expected Pass 4 SPA bundle $ExpectedJs; found $localJs"
}

Write-Host "Pack SPA + brain tarballs..."
if (Test-Path $SpaTar) { Remove-Item $SpaTar -Force }
if (Test-Path $BrainTar) { Remove-Item $BrainTar -Force }
tar -czf $SpaTar -C $SpaDist .
if ($LASTEXITCODE -ne 0) { throw "tar spa failed" }
tar -czf $BrainTar -C $BrainDir dsc_brain
if ($LASTEXITCODE -ne 0) { throw "tar brain failed" }

$pscpArgs = @("-batch", "-hostkey", $HostKey, "-pw", $PiPassword)
$plinkTarget = "${PiUser}@${PiHost}"

Write-Host "Upload SPA + brain + remote Phase A prove script..."
& pscp @pscpArgs $SpaTar "${plinkTarget}:/tmp/live-ux-pass4-spa.tgz"
if ($LASTEXITCODE -ne 0) { throw "pscp spa failed" }
& pscp @pscpArgs $BrainTar "${plinkTarget}:/tmp/live-ux-pass4-brain.tgz"
if ($LASTEXITCODE -ne 0) { throw "pscp brain failed" }
& pscp @pscpArgs $RemoteSh "${plinkTarget}:/tmp/live-ux-pass4-prove.sh"
if ($LASTEXITCODE -ne 0) { throw "pscp script failed" }

Write-Host "Run remote Pass 4 Phase A prove on Pi..."
$remoteCmd = "PASS4_PHASE=$Phase tr -d '\r' < /tmp/live-ux-pass4-prove.sh > /tmp/live-ux-pass4-prove.run.sh; bash /tmp/live-ux-pass4-prove.run.sh"
& plink @("-batch", "-hostkey", $HostKey, "-pw", $PiPassword, $plinkTarget, $remoteCmd)
if ($LASTEXITCODE -ne 0) { throw "remote Pass 4 Phase A prove failed exit=$LASTEXITCODE" }

Write-Host "Pull evidence JSON..."
& pscp @pscpArgs "${plinkTarget}:/tmp/live-ux-pass4-prove-evidence.json" $LocalEvid
if ($LASTEXITCODE -ne 0) { Write-Warning "evidence pull failed (may still have partial run)" }

Write-Host "Verify live index from Windows..."
try {
  $liveHtml = (Invoke-WebRequest -Uri "http://${PiHost}:8787/" -UseBasicParsing -TimeoutSec 20).Content
  $liveJs = [regex]::Match($liveHtml, 'assets/index-[^"]+\.js').Value
  Write-Host "Live SPA bundle: $liveJs"
  if ($liveJs -ne $localJs) {
    throw "Live index bundle mismatch: local=$localJs live=$liveJs"
  }
  Write-Host "G0 OK: live index matches spa-dist ($localJs)"
} catch {
  throw "Live index verify failed: $_"
}

Write-Host "Done Phase A. Evidence: $LocalEvid"
