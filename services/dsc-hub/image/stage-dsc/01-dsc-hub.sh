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
systemctl enable dsc-hub-net-policy.service
systemctl enable dsc-hub-compose.service
hostnamectl set-hostname dsc-brain || true
