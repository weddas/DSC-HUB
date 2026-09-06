#!/usr/bin/env bash
# Install DSC-HUB tree + systemd units into the image rootfs.
set -euo pipefail
# Expect DSC_RELEASE_DIR to contain compose project + spa-dist + firmware/kit
: "${DSC_RELEASE_DIR:?set DSC_RELEASE_DIR to staged release payload}"
install -d /opt/dsc-hub /var/lib/dsc-hub /etc/dsc-hub
cp -a "${DSC_RELEASE_DIR}/." /opt/dsc-hub/
install -m 0755 /opt/dsc-hub/pi/dsc-hub-net-policy.sh /etc/dsc-hub/net-policy.sh
install -m 0755 /opt/dsc-hub/pi/dsc-hub-ap-run.sh /etc/dsc-hub/ap-run.sh
install -m 0644 /opt/dsc-hub/pi/dsc-hub-ap.service /etc/systemd/system/dsc-hub-ap.service
install -m 0644 /opt/dsc-hub/pi/dsc-hub-net-policy.service /etc/systemd/system/dsc-hub-net-policy.service
install -m 0644 /opt/dsc-hub/pi/dsc-hub-compose.service /etc/systemd/system/dsc-hub-compose.service
# ESPHome venv dashboard unit (default build backend; dsc-hub-esphome container is
# opt-in via `--profile legacy-esphome`). Self-disables until venv + firmware/v4 exist.
chmod 0755 /opt/dsc-hub/pi/dsc-esphome-dashboard-run.sh /opt/dsc-hub/pi/dsc-esphome-venv-setup.sh || true
install -m 0644 /opt/dsc-hub/pi/dsc-esphome-venv-setup.service /etc/systemd/system/dsc-esphome-venv-setup.service
install -m 0644 /opt/dsc-hub/pi/dsc-esphome-dashboard.service /etc/systemd/system/dsc-esphome-dashboard.service
install -d /etc/dsc-hub
echo "DSC_ESPHOME_PROJECT_DIR=/opt/dsc-hub/firmware/v4" > /etc/dsc-hub/esphome.env
systemctl enable dsc-hub-net-policy.service
systemctl enable dsc-hub-compose.service
systemctl enable dsc-esphome-venv-setup.service dsc-esphome-dashboard.service || true
hostnamectl set-hostname dsc-brain || true
