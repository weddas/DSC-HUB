#!/usr/bin/env bash
# Bake kit firmware binaries for the USB flash wizard (DSC-HUB 8.x).
#
# Compiles each kit YAML in firmware/v4 with the ESPHome CLI and copies the
# flashable image to services/dsc-hub/firmware/kit/<role>.bin, matching
# kit-manifest.json (offset 0x0 → the *factory* image for ESP32, the plain
# image for ESP8266 Sonoffs). Writes kit-build.json beside them.
#
# Secrets: the bake owns the keys (decided 2026-09-06). firmware/v4/secrets.yaml
# must exist on the bake host — the same file is shipped into the SD image by
# bake-on-linux.sh so later on-Pi OTA builds agree with these binaries.
#
#   DSC_RELEASE=1   fail instead of writing placeholders when the CLI or
#                   secrets are missing (release bakes must be real).
#   DSC_ESPHOME_BIN override the esphome binary.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
OUT="${ROOT}/services/dsc-hub/firmware/kit"
MANIFEST_SRC="${ROOT}/services/dsc-hub/firmware/kit-manifest.json"
FW="${ROOT}/firmware/v4"
RELEASE="${DSC_RELEASE:-0}"

mkdir -p "${OUT}"
[[ -f "${MANIFEST_SRC}" ]] || { echo "missing ${MANIFEST_SRC}" >&2; exit 1; }

ESPHOME="${DSC_ESPHOME_BIN:-}"
if [[ -z "${ESPHOME}" ]]; then
  for c in /opt/dsc-esphome-venv/bin/esphome "$(command -v esphome || true)"; do
    if [[ -n "${c}" && -x "${c}" ]]; then ESPHOME="${c}"; break; fi
  done
fi
export PLATFORMIO_CORE_DIR="${PLATFORMIO_CORE_DIR:-/var/lib/dsc-hub/platformio}"
[[ -d "${PLATFORMIO_CORE_DIR}" ]] || PLATFORMIO_CORE_DIR="${HOME}/.platformio"

# role → kit YAML. bridge (WT32-ETH01) is retired to firmware/_history and is
# not baked; its manifest entry stays for old kits until the manifest is re-cut.
declare -A KIT=(
  [hub]=dsc-hub-kit.yaml
  [control]=dsc-control-kit.yaml
  [pot1]=dsc-pot1-kit.yaml
  [pot2]=dsc-pot2-kit.yaml
  [heater]=dsc-heater.yaml
  [heatmat]=dsc-heatmat.yaml
  [humidifier]=dsc-humidifier.yaml
  [dehumidifier]=dsc-de-humidifier.yaml
)
ORDER=(hub control pot1 pot2 heater heatmat humidifier dehumidifier)

# role -> ESPHome device name, i.e. the .esphome/build/<dir> ESPHome writes into.
# Declared, not parsed: ESPHome 2026.8 stopped printing the "Build path:" line the
# previous approach scraped, so any log-scraping breaks silently on upgrade.
declare -A DEVDIR=(
  [hub]=dsc-hub
  [control]=dsc-control
  [pot1]=dsc_probe1
  [pot2]=dsc_probe2
  [heater]=dsc-heater
  [heatmat]=dsc-heatmat
  [humidifier]=dsc-humidifier
  [dehumidifier]=dsc-de-humidifier
)

placeholders() {
  echo "bake-firmware: $1"
  if [[ "${RELEASE}" == "1" ]]; then
    echo "bake-firmware: DSC_RELEASE=1 — refusing to write placeholder .bin" >&2
    exit 1
  fi
  for name in "${ORDER[@]}" bridge; do
    [[ -s "${OUT}/${name}.bin" ]] || : > "${OUT}/${name}.bin"
  done
  echo "bake-firmware: wrote empty placeholder .bin files (layout only — NOT flashable)"
}

if [[ -z "${ESPHOME}" ]]; then
  placeholders "no esphome CLI (set DSC_ESPHOME_BIN or run dsc-esphome-venv-setup)"
  exit 0
fi
if [[ ! -f "${FW}/secrets.yaml" ]]; then
  placeholders "${FW}/secrets.yaml missing — run ${FW}/generate-secrets.sh on this bake host first"
  exit 0
fi

ESPHOME_VER="$("${ESPHOME}" version 2>/dev/null | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1 || echo unknown)"
GIT_SHA="$(git -C "${ROOT}" rev-parse --short HEAD 2>/dev/null || echo unknown)"
echo "bake-firmware: esphome ${ESPHOME_VER} (${ESPHOME}), repo ${GIT_SHA}, output ${OUT}"

cd "${FW}"
BUILT="{"
first=1
for role in "${ORDER[@]}"; do
  yaml="${KIT[$role]}"
  if [[ ! -f "${yaml}" ]]; then
    echo "bake-firmware: ${role}: ${yaml} not found — skipping" >&2
    continue
  fi
  echo "=== compile ${role} (${yaml}) ==="
  "${ESPHOME}" compile "${yaml}"
  # Take the image from this role's own build dir.
  #
  # History: this used to hunt for a file NEWER than a marker touched before the
  # compile, which assumed every compile relinks — a fully cached build is a
  # SUCCESS that rewrites nothing, so the probe found no image and aborted a
  # perfectly good build. Scraping ESPHome's "Build path:" line replaced that,
  # but 2026.8 stopped printing it (and moved ESP32 output from .pioenvs/<name>/
  # to build/). DEVDIR is declared config and survives both layouts.
  bdir="${FW}/.esphome/build/${DEVDIR[$role]}"
  if [[ ! -d "${bdir}" ]]; then
    echo "bake-firmware: ${role}: no build dir at ${bdir}" >&2
    exit 1
  fi
  # ESP32 → firmware.factory.bin (bootloader + partitions + app, flash at 0x0);
  # ESP8266 → firmware.bin.
  img="$(find "${bdir}" -type f -name 'firmware.factory.bin' -printf '%T@ %p\n' 2>/dev/null | sort -rn | head -1 | awk '{print $2}')"
  if [[ -z "${img}" ]]; then
    img="$(find "${bdir}" -type f -name 'firmware.bin' -printf '%T@ %p\n' 2>/dev/null | sort -rn | head -1 | awk '{print $2}')"
  fi
  if [[ -z "${img}" || ! -s "${img}" ]]; then
    echo "bake-firmware: ${role}: no firmware image under ${bdir}" >&2
    exit 1
  fi
  cp -f "${img}" "${OUT}/${role}.bin"
  sha="$(sha256sum "${OUT}/${role}.bin" | awk '{print $1}')"
  size="$(stat -c%s "${OUT}/${role}.bin")"
  echo "bake-firmware: ${role}.bin ← ${img} (${size} bytes, sha256 ${sha:0:12}…)"
  [[ ${first} -eq 1 ]] || BUILT+=","
  first=0
  BUILT+="\"${role}\":{\"yaml\":\"${yaml}\",\"source\":\"${img}\",\"bytes\":${size},\"sha256\":\"${sha}\"}"
done
BUILT+="}"

cat > "${OUT}/kit-build.json" <<EOF
{
  "esphome": "${ESPHOME_VER}",
  "repo": "${GIT_SHA}",
  "built_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "host": "$(hostname)",
  "roles": ${BUILT}
}
EOF
echo "bake-firmware: done — $(ls "${OUT}"/*.bin | wc -l) images, manifest ${OUT}/kit-build.json"
