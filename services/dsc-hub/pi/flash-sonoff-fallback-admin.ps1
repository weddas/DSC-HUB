# Run flash-sonoff-fallback.ps1 elevated (UAC prompt).
$script = Join-Path $PSScriptRoot "flash-sonoff-fallback.ps1"
Start-Process powershell -Verb RunAs -ArgumentList @(
    "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", "`"$script`""
) -Wait
exit $LASTEXITCODE
