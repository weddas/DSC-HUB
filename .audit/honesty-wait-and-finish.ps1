# Wait for Pi after hung docker restart; apply zigbee_mqtt honesty hotpatch.
# After power-cycle Docker is healthy - one timed stop/start is OK.
# NEVER call this while ping is already flaky mid-session.
param(
  [string]$PiHost = "192.168.86.48",
  [string]$HostKey = "SHA256:4XD2kIJ5qNCnULKNmo/L9mvzLbmZdURLwLW7Utt9NJs",
  [int]$MaxMinutes = 120
)
$ErrorActionPreference = "Continue"
$plink = "C:\Program Files\PuTTY\plink.exe"
$pscp = "C:\Program Files\PuTTY\pscp.exe"
$repo = "C:\Users\cmgwe\Documents\DSC-HUB"
$deadline = (Get-Date).AddMinutes($MaxMinutes)
Write-Host "Waiting for Pi $PiHost until $deadline"

while ((Get-Date) -lt $deadline) {
  $up = $false
  try {
    $up = Test-Connection -ComputerName $PiHost -Count 1 -Quiet -ErrorAction SilentlyContinue
  } catch {
    $up = $false
  }
  if (-not $up) {
    Write-Host ("{0} ping down - need physical Pi power-cycle" -f (Get-Date -Format o))
    Start-Sleep -Seconds 20
    continue
  }

  try {
    $h = Invoke-RestMethod -Uri "http://${PiHost}:8787/health" -TimeoutSec 8
  } catch {
    Write-Host ("{0} ping ok brain not ready: {1}" -f (Get-Date -Format o), $_.Exception.Message)
    Start-Sleep -Seconds 15
    continue
  }

  Write-Host ("{0} brain alive - applying honesty hotpatch" -f (Get-Date -Format o))
  & $pscp -batch -pw Digital -hostkey $HostKey `
    "$repo\brain\dsc_brain\zigbee_mqtt.py" `
    "dsc@${PiHost}:/tmp/zigbee_mqtt.py" | Out-Null

  $shPath = "$repo\.audit\honesty-wait-finish.sh"
  $lines = @(
    '#!/bin/bash',
    'set -euo pipefail',
    'echo Digital | sudo -S docker cp /tmp/zigbee_mqtt.py dsc-hub-brain:/app/dsc_brain/zigbee_mqtt.py',
    '# Fresh post-power-cycle Docker only - timed stop/start (not restart)',
    'echo Digital | sudo -S timeout 15 docker stop dsc-hub-brain',
    'echo Digital | sudo -S timeout 30 docker start dsc-hub-brain',
    'for i in $(seq 1 40); do',
    '  if curl -s -m 3 http://127.0.0.1:8787/health >/tmp/h.json 2>/dev/null; then',
    '    echo HEALTH_OK',
    '    break',
    '  fi',
    '  sleep 2',
    'done',
    'curl -s -X POST http://127.0.0.1:8787/settings/zigbee/permit-join -H "Content-Type: application/json" -d "{\"enabled\":true,\"duration_s\":254}"; echo',
    'sleep 3',
    'echo HEALTH1=$(curl -s http://127.0.0.1:8787/settings/zigbee/health)',
    'sleep 8',
    'echo HEALTH2=$(curl -s http://127.0.0.1:8787/settings/zigbee/health)',
    'if [ -f /tmp/zb-forever.run ]; then',
    '  pkill -f zb-forever.run 2>/dev/null || true',
    '  nohup bash /tmp/zb-forever.run >>/tmp/zb-forever.log 2>&1 &',
    'fi',
    'if [ -f /tmp/zb-agent-watch.run ]; then',
    '  pkill -f zb-agent-watch.run 2>/dev/null || true',
    '  nohup bash /tmp/zb-agent-watch.run >>/tmp/zb-agent-watch.log 2>&1 &',
    'fi',
    'pgrep -af "zb-forever.run|zb-agent-watch.run" | grep -v "bash -c" || true',
    'echo DONE'
  )
  [System.IO.File]::WriteAllLines($shPath, $lines)
  & $pscp -batch -pw Digital -hostkey $HostKey $shPath "dsc@${PiHost}:/tmp/honesty-wait-finish.sh" | Out-Null
  & $plink -batch -pw Digital -hostkey $HostKey "dsc@$PiHost" "tr -d '\r' < /tmp/honesty-wait-finish.sh > /tmp/honesty-wait-finish.run; bash /tmp/honesty-wait-finish.run"
  Write-Host 'AGENT_LOOP_TICK_pirecover {"prompt":"Pi recovered - verify JOIN OPEN honesty hotpatch, rearm Zigbee forever waiter, poll end_device_count, continue one-pass."}'
  exit 0
}
Write-Host "TIMEOUT waiting for Pi"
exit 1
