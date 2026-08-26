# Remote verify for DSC-Brain after deploy-brain.ps1
param(
    [string]$PiHost = "10.42.0.1",
    [string]$PiUser = "dsc",
    [string]$PiPassword = "Digital",
    [string]$HostKey = "SHA256:4XD2kIJ5qNCnULKNmo/L9mvzLbmZdURLwLW7Utt9NJs"
)

$ErrorActionPreference = "Stop"
$VerifySh = Join-Path $PSScriptRoot "verify-brain.sh"

& pscp -batch -hostkey $HostKey -pw $PiPassword $VerifySh "${PiUser}@${PiHost}:/tmp/verify-brain.sh"
$remote = "sed -i 's/`r$//' /tmp/verify-brain.sh; bash /tmp/verify-brain.sh http://127.0.0.1:8787 $PiPassword"
& plink -batch -hostkey $HostKey -pw $PiPassword "${PiUser}@${PiHost}" $remote
