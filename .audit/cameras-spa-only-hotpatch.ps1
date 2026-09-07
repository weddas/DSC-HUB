# SPA-only hot-patch: freshly built spa-dist → dsc-hub-brain:/app/static/ (no brain change,
# no container restart — the brain serves static files from disk per request).
# Pattern: dsc-pi-hotpatch.mdc — pscp/plink -batch -hostkey; password from DSC_PI_PASS.
param(
    [string]$PiHost = "192.168.86.48",
    [string]$PiUser = "dsc",
    [string]$PiPassword = $env:DSC_PI_PASS,
    [string]$HostKey = "SHA256:4XD2kIJ5qNCnULKNmo/L9mvzLbmZdURLwLW7Utt9NJs",
    [string]$Repo = "C:\Users\cmgwe\Documents\DSC-HUB"
)
$ErrorActionPreference = "Stop"
if (-not $PiPassword) { throw "DSC_PI_PASS not set" }

$Tmp = Join-Path $env:TEMP "spa-hp-$(Get-Date -Format 'yyyyMMddHHmmss')"
New-Item -ItemType Directory -Path $Tmp | Out-Null
$SpaTar = Join-Path $Tmp "spa.tgz"
# Windows bsdtar explicitly — Git's GNU tar on PATH treats "C:" as a remote host.
$tar = Join-Path $env:SystemRoot "System32\tar.exe"
& $tar -czf $SpaTar -C (Join-Path $Repo "frontend\spa-dist") .
if (-not (Test-Path $SpaTar)) { throw "tarball build failed" }
$expected = (Select-String -Path (Join-Path $Repo "frontend\spa-dist\index.html") -Pattern 'assets/(index-[^"]+\.js)').Matches[0].Groups[1].Value
Write-Host "SPA bundle to ship: $expected"

$RemoteSh = @"
#!/bin/bash
set -euo pipefail
PW="`$1"
rm -rf /tmp/spa-hp && mkdir -p /tmp/spa-hp
tar -xzf /tmp/spa-hp.tgz -C /tmp/spa-hp
echo "`$PW" | sudo -S docker cp /tmp/spa-hp/. dsc-hub-brain:/app/static/ 2>/dev/null && echo "=== copied"
echo "=== served bundle: `$(curl -sf http://127.0.0.1:8787/ | grep -oE 'assets/index-[^"]+\.js' | head -1)"
for a in `$(curl -sf http://127.0.0.1:8787/ | grep -oE 'assets/[^"]+\.(js|css)'); do echo "  `$a `$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8787/`$a)"; done
echo "=== health: `$(curl -sf http://127.0.0.1:8787/health | head -c 80)"
"@
$RemotePath = Join-Path $Tmp "spa-hp.sh"
[System.IO.File]::WriteAllText($RemotePath, ($RemoteSh -replace "`r`n", "`n"))

& pscp -batch -hostkey $HostKey -pw $PiPassword $SpaTar "${PiUser}@${PiHost}:/tmp/spa-hp.tgz" 2>&1 | Select-Object -Last 1
& pscp -batch -hostkey $HostKey -pw $PiPassword $RemotePath "${PiUser}@${PiHost}:/tmp/spa-hp.sh" 2>&1 | Select-Object -Last 1
& plink -batch -hostkey $HostKey -pw $PiPassword "${PiUser}@${PiHost}" "tr -d '\r' < /tmp/spa-hp.sh > /tmp/spa-hp.run.sh; bash /tmp/spa-hp.run.sh '$PiPassword' 2>&1 | grep -v 'password for'"
Write-Host "expected bundle: $expected"
