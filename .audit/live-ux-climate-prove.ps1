# Live UX Pass 2 — Climate Pi prove: SPA hotpatch + HTTP reduced_kit/canopy/CFM
# Use plink/pscp only (see .cursor/rules/dsc-pi-hotpatch.mdc). Lab password pattern
# matches other .audit hotpatch scripts; durable store = Notion API Keys.
$ErrorActionPreference = "Stop"
$Repo = "C:\Users\cmgwe\Documents\DSC-HUB"
$PiHost = "192.168.86.48"
$PiUser = "dsc"
$PiPassword = "Digital"
$HostKey = "SHA256:4XD2kIJ5qNCnULKNmo/L9mvzLbmZdURLwLW7Utt9NJs"

$SpaTar = Join-Path $env:TEMP "live-ux-climate-spa.tgz"
$RemoteSh = Join-Path $Repo ".audit\live-ux-climate-prove.sh"
$SpaDist = Join-Path $Repo "homeassistant\custom_components\dsc_hub\frontend\spa-dist"
$LocalEvid = Join-Path $Repo ".audit\live-ux-climate-prove-evidence.json"

if (-not (Test-Path (Join-Path $SpaDist "index.html"))) {
  throw "Missing SPA dist - run npm run build:spa first"
}

$localJs = (Select-String -Path (Join-Path $SpaDist "index.html") -Pattern 'assets/index-[^"]+\.js').Matches.Value | Select-Object -First 1
Write-Host "Local SPA bundle: $localJs"
if ($localJs -notmatch "index-CzcL7cKc\.js") {
  Write-Warning "Expected Task 5 bundle index-CzcL7cKc.js; found $localJs"
}

Write-Host "Pack SPA tarball..."
if (Test-Path $SpaTar) { Remove-Item $SpaTar -Force }
tar -czf $SpaTar -C $SpaDist .
if ($LASTEXITCODE -ne 0) { throw "tar spa failed" }

$pscpArgs = @("-batch", "-hostkey", $HostKey, "-pw", $PiPassword)
$plinkTarget = "${PiUser}@${PiHost}"

Write-Host "Upload SPA + remote prove script..."
& pscp @pscpArgs $SpaTar "${plinkTarget}:/tmp/live-ux-climate-spa.tgz"
if ($LASTEXITCODE -ne 0) { throw "pscp spa failed" }
& pscp @pscpArgs $RemoteSh "${plinkTarget}:/tmp/live-ux-climate-prove.sh"
if ($LASTEXITCODE -ne 0) { throw "pscp script failed" }

Write-Host "Run remote Climate prove on Pi..."
$remoteCmd = "tr -d '\r' < /tmp/live-ux-climate-prove.sh > /tmp/live-ux-climate-prove.run.sh; bash /tmp/live-ux-climate-prove.run.sh"
& plink @("-batch", "-hostkey", $HostKey, "-pw", $PiPassword, $plinkTarget, $remoteCmd)
if ($LASTEXITCODE -ne 0) { throw "remote Climate prove failed exit=$LASTEXITCODE" }

Write-Host "Pull evidence JSON..."
& pscp @pscpArgs "${plinkTarget}:/tmp/live-ux-climate-prove-evidence.json" $LocalEvid
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

Write-Host "Done. Evidence: $LocalEvid"
