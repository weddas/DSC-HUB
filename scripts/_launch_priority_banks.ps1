# Hidden-console launcher for priority seed-bank scrapes (N-087).
# No visible CMD windows. Logs under homeassistant/data/_bank_scrape_logs/

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
if (-not (Test-Path (Join-Path $Root "scripts\scrape_bank_sitemaps.py"))) {
  $Root = "y:\Digital Stealth Care\Projects\DSC-HUB"
}
Set-Location $Root

$LogDir = Join-Path $Root "homeassistant\data\_bank_scrape_logs"
New-Item -ItemType Directory -Force -Path $LogDir | Out-Null
$Py = (Get-Command python).Source

$jobs = @(
  @{ Name = "pacific"; Args = @("-u","scripts\scrape_wc_seed_banks.py","--bank","pacific","--delay","0.55","--checkpoint-every","25","--stage-every","300") },
  @{ Name = "truenorth"; Args = @("-u","scripts\scrape_bank_sitemaps.py","--bank","truenorth","--delay","0.55","--checkpoint-every","25","--stage-every","400") },
  @{ Name = "ilgm"; Args = @("-u","scripts\scrape_bank_sitemaps.py","--bank","ilgm","--delay","0.55","--checkpoint-every","25","--stage-every","200") },
  @{ Name = "seedsupreme"; Args = @("-u","scripts\scrape_bank_sitemaps.py","--bank","seedsupreme","--delay","0.6","--checkpoint-every","25","--stage-every","250") }
)

$started = @()
foreach ($j in $jobs) {
  $out = Join-Path $LogDir ("$($j.Name).out.log")
  $err = Join-Path $LogDir ("$($j.Name).err.log")
  $pidFile = Join-Path $LogDir ("$($j.Name).pid")
  # Skip if already running
  if (Test-Path $pidFile) {
    $old = Get-Content $pidFile -ErrorAction SilentlyContinue
    if ($old -and (Get-Process -Id $old -ErrorAction SilentlyContinue)) {
      Write-Host "skip $($j.Name) already running pid=$old"
      continue
    }
  }
  $p = Start-Process -FilePath $Py -ArgumentList $j.Args -WorkingDirectory $Root `
    -RedirectStandardOutput $out -RedirectStandardError $err `
    -WindowStyle Hidden -PassThru
  Set-Content -Path $pidFile -Value $p.Id -Encoding ascii
  Write-Host "started $($j.Name) pid=$($p.Id)"
  $started += [pscustomobject]@{ bank = $j.Name; pid = $p.Id; out = $out }
}

$started | ConvertTo-Json | Set-Content (Join-Path $LogDir "launched.json") -Encoding utf8
Write-Host "launched=$($started.Count)"
