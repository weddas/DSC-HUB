#!/usr/bin/env pwsh
# run_sim_gates.ps1 — pre-compile sim/lint gates for the DSC-CYD control panel
# and hub fleet-heal logic. Runs each gate in order and stops at the first
# failure (fail-fast) so a broken glyph set doesn't hide a broken layout or
# a broken algorithm behind it.
#
# Usage: pwsh -File scripts/run_sim_gates.ps1   (or: ./scripts/run_sim_gates.ps1)
# Exit code is the first non-zero gate's exit code, or 0 if all three pass.

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot

$gates = @(
    @{ Name = "cyd_glyph_audit"; Script = "scripts/cyd_glyph_audit.py" },
    @{ Name = "cyd_layout_check"; Script = "scripts/cyd_layout_check.py" },
    @{ Name = "fleet_fix_sim"; Script = "scripts/fleet_fix_sim.py" }
)

Push-Location $repoRoot
try {
    foreach ($gate in $gates) {
        Write-Host ""
        Write-Host "==> $($gate.Name)" -ForegroundColor Cyan
        python $gate.Script
        $exitCode = $LASTEXITCODE
        if ($exitCode -ne 0) {
            Write-Host ""
            Write-Host "run_sim_gates: FAILED at $($gate.Name) (exit $exitCode)" -ForegroundColor Red
            exit $exitCode
        }
    }
    Write-Host ""
    Write-Host "run_sim_gates: all gates passed." -ForegroundColor Green
    exit 0
}
finally {
    Pop-Location
}
