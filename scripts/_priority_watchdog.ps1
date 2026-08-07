$log = "y:\Digital Stealth Care\Projects\DSC-HUB\scripts\_priority_watchdog.log"
$end = (Get-Date).AddMinutes(120)
Set-Content $log "start $(Get-Date -Format o)"
while ((Get-Date) -lt $end) {
  Get-CimInstance Win32_Process -Filter "Name='python.exe'" | Where-Object {
    $_.CommandLine -and (
      $_.CommandLine -match 'run_ci_merge|_forum_merge_now|_n087_merge_exclusive|_run_cr_merge|_merge_forums_batch|_run_cannlytics_expand'
    )
  } | ForEach-Object {
    Add-Content $log ("KILL {0} {1}" -f $_.ProcessId, (Get-Date -Format HH:mm:ss))
    Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
  }
  # also kill foreign merge_staging for forums/cannareviews only
  Get-CimInstance Win32_Process -Filter "Name='python.exe'" | Where-Object {
    $_.CommandLine -match 'merge_staging_to_master.py' -and $_.CommandLine -match '--only (cannareviews|forum_|alchimia|bank_)'
  } | ForEach-Object {
    Add-Content $log ("KILL_FOREIGN {0} {1}" -f $_.ProcessId, (Get-Date -Format HH:mm:ss))
    Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
  }
  Start-Sleep -Seconds 2
}