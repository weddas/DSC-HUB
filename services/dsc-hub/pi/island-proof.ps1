param(
    [string]$PiHost = "10.42.0.1",
    [string]$PiUser = "dsc",
    [string]$PiPassword = "Digital",
    [string]$HostKey = "SHA256:4XD2kIJ5qNCnULKNmo/L9mvzLbmZdURLwLW7Utt9NJs"
)

$ErrorActionPreference = "Stop"
$RemoteSh = Join-Path $PSScriptRoot "island-proof.sh"

& pscp -batch -hostkey $HostKey -pw $PiPassword $RemoteSh "${PiUser}@${PiHost}:/tmp/island-proof.sh"
$remote = "sed -i 's/`r$//' /tmp/island-proof.sh; bash /tmp/island-proof.sh http://127.0.0.1:8787 $PiPassword"
& plink -batch -hostkey $HostKey -pw $PiPassword "${PiUser}@${PiHost}" $remote
