# ESPHome venv dashboard smoke on the live Pi (plan Phase 5).
# Ships the four unit/wrapper files + the remote script, installs them, starts venv
# provisioning NON-blocking (pip install esphome==2026.6.5 takes minutes on a Pi).
# Poll afterwards with:  .audit/zbc-run-remote.ps1 -Script .audit/zbc-esphome-check.sh
param(
    [string]$PiHost = "192.168.86.48",
    [string]$PiUser = "dsc",
    [string]$PiPassword = $env:DSC_PI_PASS,
    [string]$HostKey = "SHA256:4XD2kIJ5qNCnULKNmo/L9mvzLbmZdURLwLW7Utt9NJs",
    [string]$Repo = "C:\Users\cmgwe\Documents\DSC-HUB"
)
$ErrorActionPreference = "Stop"
if (-not $PiPassword) { throw "DSC_PI_PASS not set" }
$pscp = "pscp -batch -hostkey `"$HostKey`" -pw `"$PiPassword`""
$plink = "plink -batch -hostkey `"$HostKey`" -pw `"$PiPassword`""

$src = Join-Path $Repo "services\dsc-hub\pi"
foreach ($f in @("dsc-esphome-dashboard-run.sh", "dsc-esphome-venv-setup.sh", "dsc-esphome-dashboard.service", "dsc-esphome-venv-setup.service")) {
    $lf = Join-Path $env:TEMP $f
    [System.IO.File]::WriteAllText($lf, ([System.IO.File]::ReadAllText((Join-Path $src $f)) -replace "`r`n", "`n"))
    Invoke-Expression "$pscp `"$lf`" ${PiUser}@${PiHost}:/tmp/$f"
}
$remote = Join-Path $Repo ".audit\zbc-esphome-install.sh"
$lf = Join-Path $env:TEMP "zbc-esphome-install.sh"
[System.IO.File]::WriteAllText($lf, ([System.IO.File]::ReadAllText($remote) -replace "`r`n", "`n"))
Invoke-Expression "$pscp `"$lf`" ${PiUser}@${PiHost}:/tmp/zbc-esphome-install.sh"
Invoke-Expression "$plink ${PiUser}@${PiHost} `"bash /tmp/zbc-esphome-install.sh '$PiPassword' 2>&1 | grep -v 'password for'`""
