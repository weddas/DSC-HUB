#!/usr/bin/env bash
# SD inject only — assumes bake-on-linux artifacts already in /opt/dsc-hub-bake-out
set -euo pipefail
echo Digital | sudo -S true
export DSC_BAKE_OUT=/opt/dsc-hub-bake-out DSC_VERSION=8.0.0
BASE_XZ=/opt/dsc-hub-bake-out/raspios-lite-arm64.img.xz
BASE_IMG=/opt/dsc-hub-bake-out/raspios-lite-arm64.img
URL="https://downloads.raspberrypi.com/raspios_lite_arm64/images/raspios_lite_arm64-2024-11-19/2024-11-19-raspios-bookworm-arm64-lite.img.xz"

if [[ ! -f /opt/dsc-hub-bake-src/services/dsc-hub/image/bake-sd-image.sh ]]; then
  echo "missing bake-src — re-run kit-linux-bake.ps1 first" >&2
  exit 1
fi
sudo tr -d '\r' < /tmp/bake-sd-image.sh > /opt/dsc-hub-bake-src/services/dsc-hub/image/bake-sd-image.sh 2>/dev/null || true
sudo chmod +x /opt/dsc-hub-bake-src/services/dsc-hub/image/bake-sd-image.sh

if [[ ! -f "$BASE_IMG" ]]; then
  echo "Downloading Raspberry Pi OS Lite arm64 (large)…"
  if [[ ! -f "$BASE_XZ" ]]; then
    sudo curl -L --fail --retry 3 -o "$BASE_XZ" "$URL"
  fi
  echo "Decompressing xz…"
  sudo xz -dkf "$BASE_XZ"
fi

echo "Injecting DSC-HUB 8.0.0 into image…"
cd /opt/dsc-hub-bake-src
echo Digital | sudo -S -E bash services/dsc-hub/image/bake-sd-image.sh "$BASE_IMG"
ls -lh /opt/dsc-hub-bake-out/dsc-hub-8.0.0-arm64.img*
echo "=== SD bake DONE ==="
