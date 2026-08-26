# Flash Sonoffs to 7.0.0.0 from Windows.
# Tries house LAN OTA first, then fallback SoftAP (admin required for static IP).
param(
    [string[]]$Seats = @("heater", "heatmat", "humidifier", "dehumidifier"),
    [string]$HomeSsid = "DSC-Brain",
    [string]$HomePassword = "Digital1",
    [int]$ApWaitSeconds = 180,
    [switch]$FallbackOnly,
    [switch]$SkipElevation
)

$ErrorActionPreference = "Stop"
$RepoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..\..")
$FwDir = Join-Path $RepoRoot "firmware\v4"
$LogPath = Join-Path $env:TEMP "dsc-sonoff-flash.log"

function Write-Log {
    param([string]$Message)
    $line = "[{0}] {1}" -f (Get-Date -Format "HH:mm:ss"), $Message
    Write-Host $line
    Add-Content -Path $LogPath -Value $line
}

$Devices = @{
    heater       = @{ Yaml = "dsc-heater.yaml";        LanIp = "192.168.86.50";  PiIp = "10.42.0.50";  ApSsid = "DSC-Heater Fallback Hotspot";        ApSecret = "dsc_heater_ap_password" }
    heatmat      = @{ Yaml = "dsc-heatmat.yaml";       LanIp = "192.168.86.51";  PiIp = "10.42.0.51";  ApSsid = "DSC-HeatMat Fallback Hotspot";       ApSecret = "dsc_heatmat_ap_password" }
    humidifier   = @{ Yaml = "dsc-humidifier.yaml";   LanIp = "192.168.86.54";  PiIp = "10.42.0.54";  ApSsid = "DSC-Humidifier Fallback Hotspot";    ApSecret = "dsc_humidifier_ap_password" }
    dehumidifier = @{ Yaml = "dsc-de-humidifier.yaml"; LanIp = "192.168.86.184"; PiIp = "10.42.0.55"; ApSsid = "DSC-De-Humidifi Fallback Hotspot"; ApSecret = "dsc_dehumidifier_ap_password" }
}

function Get-SecretsMap {
    $path = Join-Path $FwDir "secrets.yaml"
    if (-not (Test-Path $path)) { throw "Missing secrets.yaml - copy from Pi /opt/dsc-hub-repo/firmware/v4/secrets.yaml" }
    $map = @{}
    Get-Content $path | ForEach-Object {
        if ($_ -match '^\s*([A-Za-z0-9_]+):\s*"(.*)"\s*$') { $map[$Matches[1]] = $Matches[2] }
    }
    return $map
}

function Test-TcpPort {
    param([string]$HostName, [int]$Port)
    return (Test-NetConnection -ComputerName $HostName -Port $Port -WarningAction SilentlyContinue).TcpTestSucceeded
}

function Invoke-EsphomeOta {
    param([string]$Yaml, [string]$Device)
    Push-Location $FwDir
    try {
        Write-Log "  esphome run $Yaml -> $Device"
        & python -m esphome run $Yaml --device $Device --no-logs
        return ($LASTEXITCODE -eq 0)
    } finally { Pop-Location }
}

function Get-WifiInterfaceName {
    $wifi = Get-NetAdapter | Where-Object { $_.Status -eq "Up" -and $_.InterfaceDescription -match "Wi-Fi|Wireless|WLAN|802\.11" } | Select-Object -First 1
    if ($wifi) { return $wifi.Name }
    return "Wi-Fi"
}

function Test-VisibleSsid {
    param([string]$Ssid)
    $raw = netsh wlan show networks mode=bssid 2>$null
    return ($raw -match [regex]::Escape($Ssid))
}

function Wait-ForFallbackAp {
    param([string]$Ssid, [int]$TimeoutSeconds)
    Write-Log "  Scanning for AP '$Ssid' up to ${TimeoutSeconds}s (power-cycle device if not visible)..."
    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
    while ((Get-Date) -lt $deadline) {
        if (Test-VisibleSsid -Ssid $Ssid) {
            Write-Log "  Found AP: $Ssid"
            return $true
        }
        Start-Sleep -Seconds 5
    }
    Write-Log "  AP not seen: $Ssid"
    return $false
}

function Connect-FallbackAp {
    param([string]$Ssid, [string]$Password)
    $wifiName = Get-WifiInterfaceName
    $xmlPath = Join-Path $env:TEMP ("dsc-wlan-{0}.xml" -f ($Ssid -replace '\s','_'))
    @"
<?xml version="1.0"?>
<WLANProfile xmlns="http://www.microsoft.com/networking/WLAN/profile/v1">
  <name>$Ssid</name>
  <SSIDConfig><SSID><name>$Ssid</name></SSID></SSIDConfig>
  <connectionType>ESS</connectionType>
  <connectionMode>manual</connectionMode>
  <MSM><security>
    <authEncryption><authentication>WPA2PSK</authentication><encryption>AES</encryption><useOneX>false</useOneX></authEncryption>
    <sharedKey><keyType>passPhrase</keyType><protected>false</protected><keyMaterial>$Password</keyMaterial></sharedKey>
  </security></MSM>
</WLANProfile>
"@ | Set-Content $xmlPath -Encoding UTF8
    netsh wlan delete profile name="$Ssid" 2>$null | Out-Null
    netsh wlan add profile filename="$xmlPath" user=all | Out-Null
    netsh wlan disconnect | Out-Null
    Start-Sleep -Seconds 2
    netsh wlan connect name="$Ssid" ssid="$Ssid" interface="$wifiName" | Out-Null
    Start-Sleep -Seconds 10
    netsh interface ip set address name="$wifiName" static 192.168.4.2 255.255.255.0 192.168.4.1 1 | Out-Null
    Start-Sleep -Seconds 3
}

function Restore-HomeWifi {
    $wifiName = Get-WifiInterfaceName
    netsh interface ip set address name="$wifiName" dhcp | Out-Null
    netsh wlan connect name="$HomeSsid" ssid="$HomeSsid" interface="$wifiName" 2>$null | Out-Null
    Start-Sleep -Seconds 5
}

function Ensure-Admin {
    param([switch]$SkipElevation)
    $isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
    if ($isAdmin -or $SkipElevation) { return $isAdmin }
    Write-Log "Re-launching elevated for fallback AP static IP (UAC prompt)..."
    $argList = @(
        "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", "`"$PSCommandPath`"",
        "-Seats", ($Seats -join ","),
        "-ApWaitSeconds", $ApWaitSeconds,
        "-SkipElevation"
    )
    if ($FallbackOnly) { $argList += "-FallbackOnly" }
    Start-Process powershell -Verb RunAs -ArgumentList $argList -Wait
    exit $LASTEXITCODE
}

if ($Seats.Count -eq 1 -and $Seats[0] -match ',') {
    $Seats = $Seats[0].Split(',', [System.StringSplitOptions]::RemoveEmptyEntries)
}

Ensure-Admin -SkipElevation:$SkipElevation

$secrets = Get-SecretsMap
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

Write-Log "=== Sonoff flash from Windows ==="
Write-Log "Log: $LogPath"
Write-Log "Admin: $isAdmin"
Write-Log "Seats: $($Seats -join ', ')"
Write-Log ""

$results = @()
foreach ($seat in $Seats) {
    $dev = $Devices[$seat.Trim()]
    if (-not $dev) { continue }
    Write-Log "=== $seat ==="
    $ok = $false

    if (-not $FallbackOnly) {
        if (Test-Connection $dev.LanIp -Count 1 -Quiet -ErrorAction SilentlyContinue) {
            Write-Log "  LAN ping OK: $($dev.LanIp)"
            if ((Test-TcpPort $dev.LanIp 8266) -or (Test-TcpPort $dev.LanIp 6053)) {
                $ok = Invoke-EsphomeOta -Yaml $dev.Yaml -Device $dev.LanIp
            } else {
                Write-Log "  LAN OTA/API ports closed on $($dev.LanIp)"
            }
        } else {
            Write-Log "  LAN offline: $($dev.LanIp)"
        }
    }

    if (-not $ok) {
        if (-not $isAdmin) {
            Write-Log "  SKIP fallback AP (not elevated)"
        } else {
            $apPass = $secrets[$dev.ApSecret]
            if (-not $apPass) { throw "Missing secret $($dev.ApSecret) in secrets.yaml" }
            if (Wait-ForFallbackAp -Ssid $dev.ApSsid -TimeoutSeconds $ApWaitSeconds) {
                Write-Log "  Joining fallback AP $($dev.ApSsid) ..."
                Connect-FallbackAp -Ssid $dev.ApSsid -Password $apPass
                if (Test-Connection 192.168.4.1 -Count 2 -Quiet) {
                    $ok = Invoke-EsphomeOta -Yaml $dev.Yaml -Device "192.168.4.1"
                } else {
                    Write-Log "  Fallback AP unreachable at 192.168.4.1 (check static IP on WiFi adapter)"
                }
                Restore-HomeWifi
            } else {
                Write-Log "  Hint: power-cycle $seat Sonoff away from house WiFi so fallback AP appears"
            }
        }
    }

    if ($ok) {
        Write-Log "  Waiting for $seat to join $HomeSsid at $($dev.PiIp)..."
        Start-Sleep -Seconds 20
        if (Test-Connection $dev.PiIp -Count 1 -Quiet -ErrorAction SilentlyContinue) {
            Write-Log "  Pi AP reachability OK: $($dev.PiIp)"
        } else {
            Write-Log "  Not yet on Pi AP ($($dev.PiIp)) - may need a minute"
        }
    }

    $results += [pscustomobject]@{ Seat = $seat; Status = $(if ($ok) { "OK" } else { "FAILED" }) }
}

Write-Log ""
Write-Log "=== summary ==="
$results | ForEach-Object { Write-Log ("  {0}: {1}" -f $_.Seat, $_.Status) }
$failed = @($results | Where-Object Status -eq "FAILED")
if ($failed.Count -gt 0) { exit 1 }
exit 0
