#!/usr/bin/env bash
# Inject DSC-HUB 8.0.0 payload + docker images into a Raspberry Pi OS Lite arm64 .img
# Usage: sudo ./bake-sd-image.sh /path/to/raspios-lite-arm64.img
set -euo pipefail

VERSION="${DSC_VERSION:-8.0.0}"
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
OUT="${DSC_BAKE_OUT:-${ROOT}/deploy}"
SRC_IMG="${1:?usage: bake-sd-image.sh <raspios-lite-arm64.img>}"
PAYLOAD="${DSC_PAYLOAD:-${OUT}/dsc-hub-${VERSION}-payload.tar.gz}"
DOCKER_TAR="${DSC_DOCKER_TAR:-${OUT}/dsc-hub-${VERSION}-docker.tar.gz}"
OUT_IMG="${OUT}/dsc-hub-${VERSION}-arm64.img"
OUT_XZ="${OUT_IMG}.xz"
WORK="${OUT}/sd-work-$$"
MNT="${WORK}/mnt"

[[ -f "${SRC_IMG}" ]] || { echo "missing image: ${SRC_IMG}" >&2; exit 1; }
[[ -f "${PAYLOAD}" ]] || { echo "missing payload: ${PAYLOAD} — run bake-on-linux.sh first" >&2; exit 1; }
[[ -f "${DOCKER_TAR}" ]] || { echo "missing docker tar: ${DOCKER_TAR}" >&2; exit 1; }
[[ "$(id -u)" -eq 0 ]] || { echo "run as root (losetup/mount)" >&2; exit 1; }

mkdir -p "${OUT}" "${MNT}"
echo "=== Copying base → ${OUT_IMG} ==="
cp -f "${SRC_IMG}" "${OUT_IMG}"

LOOP=""
cleanup() {
  sync || true
  if mountpoint -q "${MNT}/boot/firmware" 2>/dev/null; then umount "${MNT}/boot/firmware" || true; fi
  if mountpoint -q "${MNT}/boot" 2>/dev/null; then umount "${MNT}/boot" || true; fi
  if mountpoint -q "${MNT}" 2>/dev/null; then umount "${MNT}" || true; fi
  if [[ -n "${LOOP}" ]]; then losetup -d "${LOOP}" 2>/dev/null || true; fi
  rm -rf "${WORK}"
}
trap cleanup EXIT

echo "=== Attaching ${OUT_IMG} ==="
LOOP="$(losetup -fP --show "${OUT_IMG}")"
echo "LOOP=${LOOP}"

ROOTPART="${LOOP}p2"
BOOTPART="${LOOP}p1"
mount "${ROOTPART}" "${MNT}"
if [[ -d "${MNT}/boot/firmware" ]]; then
  mount "${BOOTPART}" "${MNT}/boot/firmware"
elif [[ -d "${MNT}/boot" ]]; then
  mount "${BOOTPART}" "${MNT}/boot" || true
fi

echo "=== Extracting payload ==="
STAGE="${WORK}/stage"
mkdir -p "${STAGE}"
tar -C "${STAGE}" -xzf "${PAYLOAD}"
mkdir -p "${MNT}/opt" "${MNT}/var/lib/dsc-hub" "${MNT}/etc/dsc-hub" "${MNT}/etc/systemd/system"
cp -a "${STAGE}/opt/dsc-hub" "${MNT}/opt/"
cp -a "${STAGE}/etc/dsc-hub/." "${MNT}/etc/dsc-hub/" 2>/dev/null || true
cp -a "${STAGE}/systemd/." "${MNT}/etc/systemd/system/" 2>/dev/null || true
chmod +x "${MNT}/etc/dsc-hub/"*.sh 2>/dev/null || true
chmod +x "${MNT}/opt/dsc-hub/install-from-payload.sh" 2>/dev/null || true
chmod +x "${MNT}/opt/dsc-hub/pi/"*.sh 2>/dev/null || true

echo "dsc-brain" > "${MNT}/etc/hostname"

mkdir -p "${MNT}/etc/systemd/system/multi-user.target.wants"
ln -sfn /etc/systemd/system/dsc-hub-net-policy.service \
  "${MNT}/etc/systemd/system/multi-user.target.wants/dsc-hub-net-policy.service"
ln -sfn /etc/systemd/system/dsc-hub-compose.service \
  "${MNT}/etc/systemd/system/multi-user.target.wants/dsc-hub-compose.service"

install -d "${MNT}/opt/dsc-hub/docker-preload"
cp -f "${DOCKER_TAR}" "${MNT}/opt/dsc-hub/docker-preload/images.tar.gz"
cat > "${MNT}/etc/systemd/system/dsc-hub-docker-preload.service" <<'EOF'
[Unit]
Description=DSC-HUB one-shot docker image preload
After=docker.service
Requires=docker.service
ConditionPathExists=/opt/dsc-hub/docker-preload/images.tar.gz

[Service]
Type=oneshot
RemainAfterExit=yes
ExecStart=/bin/bash -c 'gunzip -c /opt/dsc-hub/docker-preload/images.tar.gz | docker load && mv /opt/dsc-hub/docker-preload/images.tar.gz /opt/dsc-hub/docker-preload/images.tar.gz.done'
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF
ln -sfn /etc/systemd/system/dsc-hub-docker-preload.service \
  "${MNT}/etc/systemd/system/multi-user.target.wants/dsc-hub-docker-preload.service"

if [[ ! -f "${MNT}/opt/dsc-hub/.env" ]]; then
  if [[ -f "${MNT}/opt/dsc-hub/env.example" ]]; then
    cp "${MNT}/opt/dsc-hub/env.example" "${MNT}/opt/dsc-hub/.env"
  else
    echo "DSC_SURFACE_VERSION=${VERSION}" > "${MNT}/opt/dsc-hub/.env"
  fi
fi

CMDLINE="${MNT}/boot/firmware/cmdline.txt"
[[ -f "${CMDLINE}" ]] || CMDLINE="${MNT}/boot/cmdline.txt"
if [[ -f "${CMDLINE}" ]]; then
  sed -i 's/console=serial0,[0-9]* //g' "${CMDLINE}" || true
fi

# Ensure docker present note — stock Lite may need packages; first-boot may fail without docker.
# Prefer baking docker via raspi-config/cloud-init later; mark in manifest.
echo "${VERSION}" > "${MNT}/opt/dsc-hub/IMAGE_VERSION"

sync
umount "${MNT}/boot/firmware" 2>/dev/null || umount "${MNT}/boot" 2>/dev/null || true
umount "${MNT}"
losetup -d "${LOOP}"
LOOP=""
trap - EXIT
rm -rf "${WORK}"

echo "=== Compressing → ${OUT_XZ} ==="
xz -T0 -f -k "${OUT_IMG}"
ls -lh "${OUT_IMG}" "${OUT_XZ}"
cat > "${OUT}/dsc-hub-${VERSION}-sd-manifest.json" <<EOF
{
  "version": "${VERSION}",
  "img": "$(basename "${OUT_IMG}")",
  "xz": "$(basename "${OUT_XZ}")",
  "source_base": "$(basename "${SRC_IMG}")",
  "built_at": "$(date -Iseconds)"
}
EOF
echo "=== bake-sd-image DONE ==="
echo "Flash: ${OUT_XZ}"
