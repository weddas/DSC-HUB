$deadline = (Get-Date).AddMinutes(60)
while ((Get-Date) -lt $deadline) {
  $inproc = Get-CimInstance Win32_Process -Filter "Name='python.exe'" | Where-Object { $_.CommandLine -match '_merge_serial_inproc' }
  if (-not $inproc) { if ($started) { break } else { Start-Sleep 2; continue } }
  $started = $true
  Get-CimInstance Win32_Process -Filter "Name='python.exe'" | Where-Object {
    $_.CommandLine -match 'merge_staging_to_master' -and $_.CommandLine -notmatch '_merge_serial_inproc'
  } | ForEach-Object {
    "KILL $($_.ProcessId)" | Out-File -Append "y:\Digital Stealth Care\Projects\DSC-HUB\scripts\_merge_watchdog.log"
    Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
  }
  Start-Sleep -Seconds 2
}