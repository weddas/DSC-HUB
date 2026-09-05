# Space-energy Pi closure: SPA + brain hotpatch + HTTP/force-tick stress
$ErrorActionPreference = "Stop"
$Repo = "C:\Users\cmgwe\Documents\DSC-HUB"
$PiHost = "192.168.86.48"
$PiUser = "dsc"
# Lab creds: same pattern as other .audit hotpatch scripts; durable store = Notion API Keys.
$PiPassword = "Digital"
$HostKey = "SHA256:4XD2kIJ5qNCnULKNmo/L9mvzLbmZdURLwLW7Utt9NJs"

$SpaTar = Join-Path $env:TEMP "space-energy-spa.tgz"
$BrainTar = Join-Path $env:TEMP "space-energy-brain.tgz"
$RemoteSh = Join-Path $Repo ".audit\space-energy-pi-closure.sh"
$SpaDist = Join-Path $Repo "frontend\spa-dist"
$BrainDir = Join-Path $Repo "brain"
$LocalEvid = Join-Path $Repo ".audit\space-energy-closure-evidence.json"

if (-not (Test-Path (Join-Path $SpaDist "index.html"))) {
  throw "Missing SPA dist - run npm run build first"
}

Write-Host "Pack tarballs..."
if (Test-Path $SpaTar) { Remove-Item $SpaTar -Force }
if (Test-Path $BrainTar) { Remove-Item $BrainTar -Force }
tar -czf $SpaTar -C $SpaDist .
tar -czf $BrainTar -C $BrainDir dsc_brain

$pscpArgs = @("-batch", "-hostkey", $HostKey, "-pw", $PiPassword)
$plinkTarget = "${PiUser}@${PiHost}"

Write-Host "Upload..."
& pscp @pscpArgs $SpaTar "${plinkTarget}:/tmp/space-energy-spa.tgz"
if ($LASTEXITCODE -ne 0) { throw "pscp spa failed" }
& pscp @pscpArgs $BrainTar "${plinkTarget}:/tmp/space-energy-brain.tgz"
if ($LASTEXITCODE -ne 0) { throw "pscp brain failed" }
& pscp @pscpArgs $RemoteSh "${plinkTarget}:/tmp/space-energy-pi-closure.sh"
if ($LASTEXITCODE -ne 0) { throw "pscp script failed" }
& pscp @pscpArgs (Join-Path $Repo ".audit\se-force-tick.py") "${plinkTarget}:/tmp/se-force-tick.py"
& pscp @pscpArgs (Join-Path $Repo ".audit\se-veg-tick.py") "${plinkTarget}:/tmp/se-veg-tick.py"

Write-Host "Run remote closure on Pi..."
$remoteCmd = "tr -d '\r' < /tmp/space-energy-pi-closure.sh > /tmp/space-energy-pi-closure.run.sh; bash /tmp/space-energy-pi-closure.run.sh"
& plink @("-batch", "-hostkey", $HostKey, "-pw", $PiPassword, $plinkTarget, $remoteCmd)
if ($LASTEXITCODE -ne 0) { throw "remote closure failed exit=$LASTEXITCODE" }

Write-Host "Pull evidence JSON..."
& pscp @pscpArgs "${plinkTarget}:/tmp/space-energy-closure-evidence.json" $LocalEvid
if ($LASTEXITCODE -ne 0) { Write-Warning "evidence pull failed (may still have partial run)" }

Write-Host "Done. Evidence: $LocalEvid"
