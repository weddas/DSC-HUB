#!/usr/bin/env bash
# Publish Lovelace cards into dist/ for HACS Dashboard installs.
# Source of truth: homeassistant/www/
# HACS requires a .js file matching the GitHub repo name (DSC-HUB.js).
# Bundle = system map + airflow map (both custom elements in one resource).
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="${REPO_ROOT:-$(cd "${SCRIPT_DIR}/.." && pwd)}"
SRC="${REPO_ROOT}/homeassistant/www"
DIST="${REPO_ROOT}/dist"

mkdir -p "${DIST}"

# HACS single resource: both cards
{
  cat "${SRC}/dsc-system-map-card.js"
  printf '\n'
  cat "${SRC}/dsc-airflow-map-card.js"
} > "${DIST}/DSC-HUB.js"

cp -f "${SRC}/dsc-system-map.svg" "${DIST}/dsc-system-map.svg"
# Keep individual files for /local manual installs
cp -f "${SRC}/dsc-system-map-card.js" "${DIST}/dsc-system-map-card.js"
cp -f "${SRC}/dsc-airflow-map-card.js" "${DIST}/dsc-airflow-map-card.js"

echo "HACS dist updated:"
ls -la "${DIST}/DSC-HUB.js" "${DIST}/dsc-system-map.svg" \
  "${DIST}/dsc-system-map-card.js" "${DIST}/dsc-airflow-map-card.js"
