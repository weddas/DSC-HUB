#!/usr/bin/env bash
# DSC-HUB 8.0.0 — Linux bake (payload + docker images).
# Run on aarch64 Linux with Docker (kit Pi is fine).
# Produces: deploy/dsc-hub-8.0.0-{payload,docker}.tar.gz
set -euo pipefail

VERSION="${DSC_VERSION:-8.0.0}"
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
OUT="${DSC_BAKE_OUT:-${ROOT}/deploy}"
STAGE="${OUT}/stage-${VERSION}"
PAYLOAD="${OUT}/dsc-hub-${VERSION}-payload.tar.gz"
DOCKER_TAR="${OUT}/dsc-hub-${VERSION}-docker.tar.gz"
COMPOSE="${ROOT}/services/dsc-hub"
IMAGE_DIR="${COMPOSE}/image"

echo "=== DSC-HUB ${VERSION} linux bake ==="
echo "ROOT=${ROOT}"
echo "OUT=${OUT}"

mkdir -p "${OUT}" "${STAGE}/opt/dsc-hub" "${STAGE}/var/lib/dsc-hub" "${STAGE}/etc/dsc-hub" "${STAGE}/systemd"

# --- 1) SPA into brain/static (prebuilt Dockerfile expects this) ---
if [[ -d "${ROOT}/frontend/spa-dist" ]]; then
  echo "Using frontend/spa-dist"
  rm -rf "${ROOT}/brain/static"
  mkdir -p "${ROOT}/brain/static"
  cp -a "${ROOT}/frontend/spa-dist/." "${ROOT}/brain/static/"
else
  echo "WARN: no frontend/spa-dist — brain image may lack SPA"
fi

# --- 2) Firmware kit layout ---
bash "${IMAGE_DIR}/bake-firmware.sh"

# --- 3) Stage /opt/dsc-hub payload ---
rm -rf "${STAGE}/opt/dsc-hub"
mkdir -p "${STAGE}/opt/dsc-hub"
cp -a "${COMPOSE}/." "${STAGE}/opt/dsc-hub/"
rm -rf "${STAGE}/opt/dsc-hub/__pycache__" 2>/dev/null || true
# Ensure pi scripts + firmware present
mkdir -p "${STAGE}/opt/dsc-hub/firmware/kit"
# firmware already copied with compose tree; ensure kit placeholders exist
if [[ -d "${COMPOSE}/firmware" && "${STAGE}/opt/dsc-hub/firmware" != "${COMPOSE}/firmware" ]]; then
  cp -a "${COMPOSE}/firmware/." "${STAGE}/opt/dsc-hub/firmware/" 2>/dev/null || true
fi
if [[ -d "${ROOT}/data" ]]; then
  rm -rf "${STAGE}/opt/dsc-hub/data"
  cp -a "${ROOT}/data" "${STAGE}/opt/dsc-hub/data"
fi

# Systemd units + net-policy into stage
install -m 0755 "${COMPOSE}/pi/dsc-hub-net-policy.sh" "${STAGE}/etc/dsc-hub/net-policy.sh"
install -m 0755 "${COMPOSE}/pi/dsc-hub-ap-run.sh" "${STAGE}/etc/dsc-hub/ap-run.sh"
install -m 0644 "${COMPOSE}/pi/dsc-hub-ap.service" "${STAGE}/systemd/dsc-hub-ap.service"
install -m 0644 "${COMPOSE}/pi/dsc-hub-net-policy.service" "${STAGE}/systemd/dsc-hub-net-policy.service"
install -m 0644 "${COMPOSE}/pi/dsc-hub-compose.service" "${STAGE}/systemd/dsc-hub-compose.service"
# ESPHome toolchain: dedicated venv dashboard unit (default backend; replaces the
# dsc-hub-esphome container, now behind `--profile legacy-esphome`).
install -m 0755 "${COMPOSE}/pi/dsc-esphome-venv-setup.sh" "${STAGE}/opt/dsc-hub/pi/dsc-esphome-venv-setup.sh"
install -m 0755 "${COMPOSE}/pi/dsc-esphome-dashboard-run.sh" "${STAGE}/opt/dsc-hub/pi/dsc-esphome-dashboard-run.sh"
install -m 0644 "${COMPOSE}/pi/dsc-esphome-venv-setup.service" "${STAGE}/systemd/dsc-esphome-venv-setup.service"
install -m 0644 "${COMPOSE}/pi/dsc-esphome-dashboard.service" "${STAGE}/systemd/dsc-esphome-dashboard.service"
# ESPHome dashboard project dir for an SD-bake layout (remote-deploy overrides via
# its own esphome.env). The dashboard unit no-ops cleanly until firmware/v4 lands.
install -d "${STAGE}/etc/dsc-hub"
echo "DSC_ESPHOME_PROJECT_DIR=/opt/dsc-hub/firmware/v4" > "${STAGE}/etc/dsc-hub/esphome.env"

# Install helper for first boot / SD inject
cat > "${STAGE}/opt/dsc-hub/install-from-payload.sh" <<'INST'
#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
install -d /opt/dsc-hub /var/lib/dsc-hub/{ops,z2m,mosquitto,firmware,backups,cannalib} /etc/dsc-hub
cp -a "${ROOT}/." /opt/dsc-hub/
# Prefer staged etc/systemd if present beside payload extract
if [[ -d /tmp/dsc-hub-stage/etc/dsc-hub ]]; then
  cp -a /tmp/dsc-hub-stage/etc/dsc-hub/. /etc/dsc-hub/
fi
if [[ -d /tmp/dsc-hub-stage/systemd ]]; then
  install -m 0644 /tmp/dsc-hub-stage/systemd/*.service /etc/systemd/system/
fi
install -m 0755 /opt/dsc-hub/pi/dsc-hub-net-policy.sh /etc/dsc-hub/net-policy.sh
install -m 0755 /opt/dsc-hub/pi/dsc-hub-ap-run.sh /etc/dsc-hub/ap-run.sh
chmod 0755 /opt/dsc-hub/pi/dsc-esphome-venv-setup.sh || true
systemctl daemon-reload
systemctl enable dsc-hub-net-policy.service dsc-hub-compose.service dsc-hub-ap.service || true
systemctl enable dsc-esphome-venv-setup.service dsc-esphome-dashboard.service || true
hostnamectl set-hostname dsc-brain || true
echo "install-from-payload: enabled units. Start: systemctl start dsc-hub-net-policy dsc-hub-compose"
INST
chmod +x "${STAGE}/opt/dsc-hub/install-from-payload.sh"

# --- 4) Docker images ---
DOCKER=(docker)
if ! docker info >/dev/null 2>&1; then
  if sudo docker info >/dev/null 2>&1; then
    DOCKER=(sudo docker)
  else
    echo "ERROR: docker required" >&2
    exit 1
  fi
fi

echo "Building dsc-hub-brain:${VERSION}…"
"${DOCKER[@]}" build \
  -f "${COMPOSE}/brain/Dockerfile.prebuilt" \
  -t "dsc-hub-brain:${VERSION}" \
  "${ROOT}"

echo "Pulling mosquitto + zigbee2mqtt…"
"${DOCKER[@]}" pull eclipse-mosquitto:2
"${DOCKER[@]}" pull koenkk/zigbee2mqtt:2

echo "Saving docker images…"
"${DOCKER[@]}" save \
  "dsc-hub-brain:${VERSION}" \
  eclipse-mosquitto:2 \
  koenkk/zigbee2mqtt:2 \
  | gzip -c > "${DOCKER_TAR}"

# --- 5) Payload tar ---
echo "Packing payload…"
tar -C "${STAGE}" -czf "${PAYLOAD}" opt etc systemd var

# Manifest
cat > "${OUT}/dsc-hub-${VERSION}-bake-manifest.json" <<EOF
{
  "version": "${VERSION}",
  "payload": "$(basename "${PAYLOAD}")",
  "docker": "$(basename "${DOCKER_TAR}")",
  "payload_bytes": $(stat -c%s "${PAYLOAD}" 2>/dev/null || stat -f%z "${PAYLOAD}"),
  "docker_bytes": $(stat -c%s "${DOCKER_TAR}" 2>/dev/null || stat -f%z "${DOCKER_TAR}"),
  "built_at": "$(date -Iseconds)",
  "host": "$(hostname)",
  "arch": "$(uname -m)"
}
EOF

ls -lh "${PAYLOAD}" "${DOCKER_TAR}" "${OUT}/dsc-hub-${VERSION}-bake-manifest.json"
echo "=== bake-on-linux DONE ==="
echo "Next: bake-sd-image.sh BASE.img  (inject into Raspberry Pi OS Lite) or install payload on a flashed card."
