# Remote verify for DSC-Brain after deploy-brain.ps1
param(
    [string]$PiHost = "10.42.0.1",
    [string]$PiUser = "dsc",
    [string]$PiPassword = "Digital",
    [string]$HostKey = "SHA256:4XD2kIJ5qNCnULKNmo/L9mvzLbmZdURLwLW7Utt9NJs"
)

$ErrorActionPreference = "Stop"
$RepoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..\..")
$VerifySh = Join-Path $PSScriptRoot "verify-brain.sh"
$plink = "plink -batch -hostkey `"$HostKey`" -pw $PiPassword ${PiUser}@${PiHost}"
$pscp = "pscp -batch -hostkey `"$HostKey`" -pw $PiPassword"

Invoke-Expression "$pscp `"$VerifySh`" ${PiUser}@${PiHost}:/tmp/verify-brain.sh"
Invoke-Expression "$plink `"tr -d '\r' < /tmp/verify-brain.sh > /tmp/verify.sh; bash /tmp/verify.sh http://127.0.0.1:8787 $PiPassword`""
