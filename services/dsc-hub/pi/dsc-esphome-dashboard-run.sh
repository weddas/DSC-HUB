#!/usr/bin/env bash
# ExecStart for dsc-esphome-dashboard.service. Resolves the firmware/v4 project
# dir across deploy layouts and execs `esphome dashboard` on :6052.
#
# Exits 0 (clean no-op) when the venv or the firmware source tree isn't present
# yet — the unit is Restart=on-failure so that does not crash-loop. Re-run
# `systemctl restart dsc-esphome-dashboard` after the tree is synced.
set -euo pipefail

VENV=/opt/dsc-esphome-venv
export PLATFORMIO_CORE_DIR="${PLATFORMIO_CORE_DIR:-/var/lib/dsc-hub/platformio}"
export ESPHOME_DASHBOARD_USE_PING="${ESPHOME_DASHBOARD_USE_PING:-true}"

DIR="${DSC_ESPHOME_PROJECT_DIR:-}"
if [[ -z "${DIR}" ]]; then
  for c in /opt/dsc-hub-repo/firmware/v4 /opt/dsc-hub/firmware/v4 /opt/dsc-hub/firmware; do
    if compgen -G "${c}/*.yaml" > /dev/null 2>&1; then DIR="${c}"; break; fi
  done
fi

if [[ ! -x "${VENV}/bin/esphome" ]]; then
  echo "dsc-esphome-dashboard: ${VENV}/bin/esphome missing — venv not provisioned yet; not starting." >&2
  exit 0
fi
if [[ -z "${DIR}" || ! -d "${DIR}" ]]; then
  echo "dsc-esphome-dashboard: no firmware/v4 (*.yaml) tree found; not starting. Set DSC_ESPHOME_PROJECT_DIR in /etc/dsc-hub/esphome.env." >&2
  exit 0
fi

cd "${DIR}"
echo "dsc-esphome-dashboard: serving ${DIR} on 0.0.0.0:6052 (PLATFORMIO_CORE_DIR=${PLATFORMIO_CORE_DIR})"
exec "${VENV}/bin/esphome" dashboard "${DIR}" --address 0.0.0.0 --port 6052
