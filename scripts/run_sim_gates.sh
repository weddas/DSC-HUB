#!/usr/bin/env bash
# run_sim_gates.sh — pre-compile sim/lint gates for the DSC-CYD control panel
# and hub fleet-heal logic. Runs each gate in order and stops at the first
# failure (fail-fast) so a broken glyph set doesn't hide a broken layout or
# a broken algorithm behind it. POSIX/Linux CI counterpart to
# run_sim_gates.ps1 (this repo's dev machine is Windows/PowerShell).
#
# Usage: bash scripts/run_sim_gates.sh   (or: ./scripts/run_sim_gates.sh)
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

gates=(
    "scripts/cyd_glyph_audit.py"
    "scripts/cyd_layout_check.py"
    "scripts/fleet_fix_sim.py"
)

for gate in "${gates[@]}"; do
    echo ""
    echo "==> $gate"
    if ! python3 "$gate"; then
        echo ""
        echo "run_sim_gates: FAILED at $gate"
        exit 1
    fi
done

echo ""
echo "run_sim_gates: all gates passed."
