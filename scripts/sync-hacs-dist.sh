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

THREE_JS="${SRC}/vendor/three.min.js"
DASH_FX="${SRC}/vendor/dsc-dash-fx.js"
DASH_JS="${SRC}/dsc-the-dash-card.js"
BUILD_JS="${SRC}/dsc-build-plant-card.js"
[[ -f "${THREE_JS}" ]] || { echo "Missing ${THREE_JS}" >&2; exit 1; }
[[ -f "${DASH_FX}" ]] || { echo "Missing ${DASH_FX}" >&2; exit 1; }
[[ -f "${DASH_JS}" ]] || { echo "Missing ${DASH_JS}" >&2; exit 1; }
[[ -f "${BUILD_JS}" ]] || { echo "Missing ${BUILD_JS}" >&2; exit 1; }

BUNDLE="${DIST}/DSC-HUB.js"
{
  cat "${SRC}/dsc-system-map-card.js"
  printf '\n'
  cat "${SRC}/dsc-airflow-map-card.js"
  printf '\n'
  cat "${THREE_JS}"
  printf '\n'
  cat "${DASH_FX}"
  printf '\n'
  cat "${DASH_JS}"
  printf '\n'
  cat "${BUILD_JS}"
} > "${BUNDLE}"

cp -f "${SRC}/dsc-system-map.svg" "${DIST}/dsc-system-map.svg"
# Same bundle under the legacy /local filename (already a Lovelace resource)
cp -f "${BUNDLE}" "${DIST}/dsc-system-map-card.js"
# Standalone sources (optional second resources / debugging)
cp -f "${SRC}/dsc-airflow-map-card.js" "${DIST}/dsc-airflow-map-card.js"
cp -f "${DASH_JS}" "${DIST}/dsc-the-dash-card.js"
cp -f "${BUILD_JS}" "${DIST}/dsc-build-plant-card.js"
# Build a Plant search indexes
mkdir -p "${DIST}/dsc-catalog"
if [[ -d "${SRC}/dsc-catalog" ]]; then
  cp -f "${SRC}/dsc-catalog/"*.json "${DIST}/dsc-catalog/" 2>/dev/null || true
fi
mkdir -p "${DIST}/vendor"
cp -f "${THREE_JS}" "${DIST}/vendor/three.min.js"
cp -f "${DASH_FX}" "${DIST}/vendor/dsc-dash-fx.js"

echo "HACS dist updated:"
ls -la "${DIST}/DSC-HUB.js" "${DIST}/dsc-system-map.svg" \
  "${DIST}/dsc-system-map-card.js" "${DIST}/dsc-airflow-map-card.js" \
  "${DIST}/dsc-the-dash-card.js" "${DIST}/dsc-build-plant-card.js"
