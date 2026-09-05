#!/usr/bin/env bash
# Idempotent: create the dedicated ESPHome venv that `dsc-esphome-dashboard`
# (:6052) and the brain's OTA/compile job runner share. Kept separate from the
# brain's venv so an ESPHome dependency bump can't break the brain.
#
# Floors to the firmware-pinned min_version (2026.6.5). The operator bumps later
# from Settings -> Device -> ESPHome ("Update ESPHome"), which runs
# `pip install -U esphome` in this venv and restarts the dashboard unit.
set -euo pipefail

VENV=/opt/dsc-esphome-venv
PIO_DIR=/var/lib/dsc-hub/platformio
PIN=2026.6.5   # keep in lock-step with firmware/v4 `esphome: min_version:`

install -d -o dsc -g dsc "$PIO_DIR"
install -d -o dsc -g dsc "$(dirname "$VENV")"

if [[ ! -x "$VENV/bin/python" ]]; then
  python3 -m venv "$VENV"
fi

"$VENV/bin/pip" install --upgrade pip wheel
if ! "$VENV/bin/esphome" version >/dev/null 2>&1; then
  "$VENV/bin/pip" install "esphome==${PIN}"
fi

chown -R dsc:dsc "$VENV" "$PIO_DIR"
PLATFORMIO_CORE_DIR="$PIO_DIR" "$VENV/bin/esphome" version
echo "esphome venv ready: $VENV  (PLATFORMIO_CORE_DIR=$PIO_DIR)"
