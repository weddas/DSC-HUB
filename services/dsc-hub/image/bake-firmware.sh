#!/usr/bin/env bash
# Bake kit firmware binaries for USB flash (DSC-HUB 8.0.0).
# Run on a host with ESPHome CLI or the dsc-hub-esphome container.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
OUT="${ROOT}/services/dsc-hub/firmware/kit"
MANIFEST_SRC="${ROOT}/services/dsc-hub/firmware/kit-manifest.json"
FW="${ROOT}/firmware/v4"

mkdir -p "${OUT}"
# kit-manifest.json already lives beside firmware/; ensure readable
[[ -f "${MANIFEST_SRC}" ]] || { echo "missing ${MANIFEST_SRC}" >&2; exit 1; }

echo "bake-firmware: output ${OUT}"
echo "Map kit YAML → binary names (compile each with esphome compile, then copy .bin):"
echo "  ${FW}/dsc-hub-kit.yaml          → hub.bin"
echo "  ${FW}/dsc-control-kit.yaml      → control.bin"
echo "  ${FW}/dsc-pot1-kit.yaml         → pot1.bin"
echo "  ${FW}/dsc-pot2-kit.yaml         → pot2.bin"
echo "  bridge / sonoff kit YAMLs       → bridge.bin, heater.bin, …"
echo "Placeholder: create empty markers so image layout is testable without full compile."
for name in hub control pot1 pot2 bridge heater heatmat humidifier dehumidifier; do
  touch "${OUT}/${name}.bin"
done
echo "bake-firmware: done (replace placeholder .bin with real builds before release)"
