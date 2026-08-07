$log = "brain\data\_na_wait_serial.log"
"" | Set-Content $log
function W($m) { $line = "{0} {1}" -f (Get-Date -Format "HH:mm:ss"), $m; $line | Tee-Object -FilePath $log -Append }
W "waiting for serial apply to finish"
for ($i = 1; $i -le 60; $i++) {
  $serial = Get-CimInstance Win32_Process -Filter "Name='python.exe'" | Where-Object { $_.CommandLine -match '_n087_serial_corpus_apply' }
  $lock = Test-Path "scripts\_n087_apply_staging.lock"
  $wd = Get-CimInstance Win32_Process -Filter "Name='powershell.exe'" | Where-Object { $_.CommandLine -match '_priority_watchdog|KILL.*merge_staging|_n087_apply_staging.lock' }
  $tail = (Get-Content "scripts\_n087_serial_corpus_apply.log" -Tail 3 -ErrorAction SilentlyContinue) -join " | "
  W ("poll {0}/60 serial={1} lock={2} wd={3} tail={4}" -f $i, ($null -ne $serial), $lock, @($wd).Count, $tail)
  if (-not $serial -and -not $lock) {
    W "SERIAL_CLEAR"
    # small settle
    Start-Sleep -Seconds 5
    # confirm no priority killer still active against merge_staging
    $killer = Get-CimInstance Win32_Process -Filter "Name='powershell.exe'" | Where-Object { $_.CommandLine -match 'Stop-Process' -and $_.CommandLine -match 'merge_staging_to_master' }
    if ($killer) {
      W ("killers still present count={0}; waiting more" -f @($killer).Count)
      Start-Sleep -Seconds 20
      continue
    }
    W "READY_TO_MERGE"
    break
  }
  Start-Sleep -Seconds 30
}
if (-not (Test-Path "brain\data\_na_wait_ready.flag")) {
  if (-not (Get-CimInstance Win32_Process -Filter "Name='python.exe'" | Where-Object { $_.CommandLine -match '_n087_serial_corpus_apply' }) -and -not (Test-Path "scripts\_n087_apply_staging.lock")) {
    "ready" | Set-Content "brain\data\_na_wait_ready.flag"
    W "flag written"
  } else {
    W "TIMEOUT still blocked"
    exit 2
  }
}
# Merge with retries
$env:PYTHONUNBUFFERED = '1'
$max = 10
$code = 1
foreach ($only in @('north_atlantic.sqlite3','north_atlantic_local.sqlite3')) {
  if ($only -eq 'north_atlantic_local.sqlite3' -and -not (Test-Path "brain\data\staging\north_atlantic_local.sqlite3")) { W "skip missing local"; continue }
  for ($a = 1; $a -le $max; $a++) {
    W ("MERGE attempt {0}/{1} only={2}" -f $a, $max, $only)
    # check killer again
    $killer = Get-CimInstance Win32_Process -Filter "Name='powershell.exe'" | Where-Object { $_.CommandLine -match 'Stop-Process' -and $_.CommandLine -match 'merge_staging_to_master' }
    if ($killer) {
      W "killer active; sleep 25"
      Start-Sleep -Seconds 25
      continue
    }
    $outPath = "brain\data\_na_merge_once_out.txt"
    $errPath = "brain\data\_na_merge_once_err.txt"
    $p = Start-Process -FilePath "python" -ArgumentList @('-u','scripts\merge_staging_to_master.py','--only',$only,'--no-search','--no-link') -WorkingDirectory (Get-Location) -RedirectStandardOutput $outPath -RedirectStandardError $errPath -PassThru -WindowStyle Hidden
    $p.WaitForExit(600000) | Out-Null
    if (-not $p.HasExited) { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue; W "merge timeout kill"; Start-Sleep 20; continue }
    $code = $p.ExitCode
    $out = (Get-Content $outPath -Raw -ErrorAction SilentlyContinue) + (Get-Content $errPath -Raw -ErrorAction SilentlyContinue)
    W ("exit={0}" -f $code)
    if ($out) { $out.Substring(0, [Math]::Min(2000, $out.Length)) | Tee-Object -FilePath $log -Append | Out-Null }
    if ($code -eq 0 -and $out -match 'ok ') { W ("MERGE_OK {0}" -f $only); break }
    if ($out -match 'lock|busy|database is locked' -or $code -ne 0) { W "retry sleep"; Start-Sleep 25; continue }
    W "non-lock fail"; break
  }
}
W ("FINAL code={0}" -f $code)
exit $code
