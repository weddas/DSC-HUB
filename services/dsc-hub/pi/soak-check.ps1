param(
    [string]$PiHost = "192.168.86.48",
    [string]$PiUser = "dsc",
    [string]$PiPassword = "Digital",
    [string]$HostKey = "SHA256:4XD2kIJ5qNCnULKNmo/L9mvzLbmZdURLwLW7Utt9NJs"
)

$ErrorActionPreference = "Stop"
$RemoteSh = Join-Path $PSScriptRoot "soak-check.sh"

& pscp -batch -hostkey $HostKey -pw $PiPassword $RemoteSh "${PiUser}@${PiHost}:/tmp/soak-check.sh"
$remote = @"
set -eu
sed -i 's/`r$//' /tmp/soak-check.sh
install -m 0755 /tmp/soak-check.sh /home/dsc/soak-check.sh
bash /home/dsc/soak-check.sh http://127.0.0.1:8787
"@
& plink -batch -hostkey $HostKey -pw $PiPassword "${PiUser}@${PiHost}" $remote
