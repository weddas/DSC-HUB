# Copy a bash script to the Pi and run it as `bash <script> <password>` (LF-normalised).
param(
    [Parameter(Mandatory = $true)][string]$Script,
    [string]$PiHost = "192.168.86.48",
    [string]$PiUser = "dsc",
    [string]$PiPassword = $env:DSC_PI_PASS,
    [string]$HostKey = "SHA256:4XD2kIJ5qNCnULKNmo/L9mvzLbmZdURLwLW7Utt9NJs"
)
$ErrorActionPreference = "Stop"
if (-not $PiPassword) { throw "DSC_PI_PASS not set" }
$pscp = "pscp -batch -hostkey `"$HostKey`" -pw `"$PiPassword`""
$plink = "plink -batch -hostkey `"$HostKey`" -pw `"$PiPassword`""
$name = [System.IO.Path]::GetFileName($Script)
$lf = Join-Path $env:TEMP $name
[System.IO.File]::WriteAllText($lf, ([System.IO.File]::ReadAllText($Script) -replace "`r`n", "`n"))
Invoke-Expression "$pscp `"$lf`" ${PiUser}@${PiHost}:/tmp/$name"
Invoke-Expression "$plink ${PiUser}@${PiHost} `"bash /tmp/$name '$PiPassword'`""
