param(
    [string]$PiHost = "10.42.0.1",
    [string]$PiUser = "dsc",
    [string]$PiPassword = "Digital",
    [string]$HostKey = "SHA256:4XD2kIJ5qNCnULKNmo/L9mvzLbmZdURLwLW7Utt9NJs"
)

$ErrorActionPreference = "Stop"
$RemoteSh = Join-Path $PSScriptRoot "soak-check.sh"

& pscp -batch -hostkey $HostKey -pw $PiPassword $RemoteSh "${PiUser}@${PiHost}:/tmp/soak-check.sh"
$remote = "sed -i 's/`r$//' /tmp/soak-check.sh; bash /tmp/soak-check.sh http://127.0.0.1:8787"
& plink -batch -hostkey $HostKey -pw $PiPassword "${PiUser}@${PiHost}" $remote
