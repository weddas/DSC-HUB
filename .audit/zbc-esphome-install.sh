#!/bin/bash
# Install the ESPHome venv + dashboard systemd units (same steps as deploy-brain-remote.sh)
# and kick off venv provisioning without blocking. Idempotent.
set -uo pipefail
PW="${1:-}"
s() { echo "$PW" | sudo -S "$@" 2>/dev/null; }
REPO=/opt/dsc-hub-repo

echo "=== internet from host: $(curl -s -m 8 -o /dev/null -w '%{http_code}' https://pypi.org/simple/esphome/ || echo fail)"
s install -d /opt/dsc-hub/pi /etc/dsc-hub
s install -m 0755 /tmp/dsc-esphome-venv-setup.sh /opt/dsc-hub/pi/dsc-esphome-venv-setup.sh
s install -m 0755 /tmp/dsc-esphome-dashboard-run.sh /opt/dsc-hub/pi/dsc-esphome-dashboard-run.sh
s install -m 0644 /tmp/dsc-esphome-venv-setup.service /etc/systemd/system/dsc-esphome-venv-setup.service
s install -m 0644 /tmp/dsc-esphome-dashboard.service /etc/systemd/system/dsc-esphome-dashboard.service
echo "DSC_ESPHOME_PROJECT_DIR=${REPO}/firmware/v4" | s tee /etc/dsc-hub/esphome.env >/dev/null
s systemctl daemon-reload
s systemctl enable dsc-esphome-venv-setup.service dsc-esphome-dashboard.service >/dev/null 2>&1 || true
echo "=== starting venv provisioning (no-block; pip install esphome==2026.6.5)"
s systemctl start --no-block dsc-esphome-venv-setup.service
sleep 5
echo "=== venv-setup: $(systemctl is-active dsc-esphome-venv-setup.service 2>/dev/null)  dashboard: $(systemctl is-active dsc-esphome-dashboard.service 2>/dev/null)"
s journalctl -u dsc-esphome-venv-setup.service --no-pager -n 5 2>/dev/null | tail -5
echo "=== install done — poll with zbc-esphome-check.sh"
