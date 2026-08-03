#!/usr/bin/env bash
# Publish Lovelace cards into dist/ for HACS Dashboard installs.
# Source of truth: homeassistant/www/ (separate card sources).
# HACS requires a .js file matching the GitHub repo name (DSC-HUB.js).
# Bundle = system map + airflow map (both custom elements in one resource).
#
# dist/dsc-system-map-card.js is ALSO the bundle so existing /local installs
# that only register dsc-system-map-card.js still get the airflow card.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="${REPO_ROOT:-$(cd "${SCRIPT_DIR}/.." && pwd)}"
SRC="${REPO_ROOT}/homeassistant/www"
DIST="${REPO_ROOT}/dist"

mkdir -p "${DIST}"

BUNDLE="${DIST}/DSC-HUB.js"
{
  cat "${SRC}/dsc-system-map-card.js"
  printf '\n'
  cat "${SRC}/dsc-airflow-map-card.js"
} > "${BUNDLE}"

cp -f "${SRC}/dsc-system-map.svg" "${DIST}/dsc-system-map.svg"
# Same bundle under the legacy /local filename (already a Lovelace resource)
cp -f "${BUNDLE}" "${DIST}/dsc-system-map-card.js"
# Standalone airflow source (optional second resource / debugging)
cp -f "${SRC}/dsc-airflow-map-card.js" "${DIST}/dsc-airflow-map-card.js"

echo "HACS dist updated:"
ls -la "${DIST}/DSC-HUB.js" "${DIST}/dsc-system-map.svg" \
  "${DIST}/dsc-system-map-card.js" "${DIST}/dsc-airflow-map-card.js"
