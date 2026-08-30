# Wake agent when Pi 8787 answers. Emit sentinel once then exit.
$ErrorActionPreference = "Continue"
$hostIp = "192.168.86.48"
$port = 8787
$maxHours = 12
$deadline = (Get-Date).AddHours($maxHours)
$n = 0
while ((Get-Date) -lt $deadline) {
  $n++
  $up = $false
  try {
    $req = [System.Net.HttpWebRequest]::Create("http://${hostIp}:${port}/health")
    $req.Timeout = 4000
    $req.ReadWriteTimeout = 4000
    $resp = $req.GetResponse()
    $sr = New-Object System.IO.StreamReader($resp.GetResponseStream())
    $body = $sr.ReadToEnd()
    $sr.Close(); $resp.Close()
    if ($body -match "version|zigbee|ok") { $up = $true }
  } catch {}
  if ($up) {
    Write-Output "AGENT_LOOP_WAKE_onepass_pi {`"prompt`":`"Pi 8787 is UP. Run services/dsc-hub/pi/hotpatch-after-recover.ps1 with timeout-wrapped z2m/brain, verify /health zigbee.radio_up and /settings/zigbee/roles+bindings, capture evidence in docs/FOLLOWUPS.md. Do not bare docker kill. Keep full one-pass goal; do not mark complete until RADIO UP + Zigbee product path verified on Pi.`"}"
    exit 0
  }
  if (($n % 6) -eq 0) { Write-Output "pi_still_down try=$n $(Get-Date -Format o)" }
  Start-Sleep -Seconds 30
}
Write-Output "AGENT_LOOP_WAKE_onepass_pi {`"prompt`":`"Pi still down after ${maxHours}h. Report blocker; keep goal active; do not invent radio_up.`"}"
exit 1
