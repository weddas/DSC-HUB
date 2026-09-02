# Grow Logs — resume after Pi recovery (tarballs may already be in /tmp)
# Safer: verify health BEFORE stop+start; SPA static works without restart.
$ErrorActionPreference = "Stop"
$Repo = "C:\Users\cmgwe\Documents\DSC-HUB"
$PiHost = if ($env:DSC_PI_HOST) { $env:DSC_PI_HOST } else { "192.168.86.48" }
$PiUser = "dsc"
$PiPassword = "Digital"
$HostKey = "SHA256:4XD2kIJ5qNCnULKNmo/L9mvzLbmZdURLwLW7Utt9NJs"
$Base = "http://${PiHost}:8787"

$pscp = "pscp -batch -hostkey `"$HostKey`" -pw $PiPassword"
$plink = "plink -batch -hostkey `"$HostKey`" -pw $PiPassword ${PiUser}@${PiHost}"

Write-Host "Preflight: Pi must respond before stop+start."
try {
  $h = Invoke-WebRequest -Uri "$Base/health" -UseBasicParsing -TimeoutSec 10
  Write-Host "health OK: $($h.Content.Substring(0, [Math]::Min(80, $h.Content.Length)))"
} catch {
  Write-Host "Pi not reachable at $Base — power-cycle host, then re-run."
  exit 2
}

$RemoteSh = @"
#!/bin/bash
set -euo pipefail
PW=Digital
BASE=http://127.0.0.1:8787
if [ ! -f /tmp/grow-logs-spa.tgz ]; then echo "missing /tmp/grow-logs-spa.tgz — re-run grow-logs-pi-hotpatch-prove.ps1"; exit 3; fi
mkdir -p /tmp/grow-logs-spa /tmp/grow-logs-brain
tar -xzf /tmp/grow-logs-spa.tgz -C /tmp/grow-logs-spa
tar -xzf /tmp/grow-logs-brain.tgz -C /tmp/grow-logs-brain
echo "`$PW" | sudo -S docker cp /tmp/grow-logs-spa/. dsc-hub-brain:/app/static/
for f in journal_snapshot.py plant_journal.py space_journal.py room_journal.py dsc_core_journal.py api.py; do
  echo "`$PW" | sudo -S docker cp /tmp/grow-logs-brain/dsc_brain/`$f dsc-hub-brain:/app/dsc_brain/`$f
done
echo SPA_LIVE `$(curl -sf `$BASE/ | grep -oE 'assets/index-[^"]+\.js' | head -1)
echo "`$PW" | sudo -S docker stop -t 20 dsc-hub-brain
echo "`$PW" | sudo -S docker start dsc-hub-brain
for i in `$(seq 1 45); do
  if curl -sf -m 3 "`$BASE/health" >/dev/null 2>&1; then echo brain_up_`$i; break; fi
  sleep 2
done
curl -sf "`$BASE/" | grep -oE 'assets/index-[^"]+\.js' | head -1
"@

$Tmp = Join-Path $env:TEMP "grow-logs-resume.sh"
[System.IO.File]::WriteAllText($Tmp, ($RemoteSh -replace "`r`n", "`n"))
Invoke-Expression "$pscp `"$Tmp`" ${PiUser}@${PiHost}:/tmp/grow-logs-resume.sh"
Invoke-Expression "$plink `"tr -d '\r' < /tmp/grow-logs-resume.sh > /tmp/grow-logs-resume.run.sh; bash /tmp/grow-logs-resume.run.sh`""

Write-Host "HTTP prove..."
& (Join-Path $Repo ".audit\grow-logs-pi-hotpatch-prove.ps1") -SkipHotpatch
