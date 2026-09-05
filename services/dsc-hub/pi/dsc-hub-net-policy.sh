#!/usr/bin/env bash
# DSC-HUB 8.0.0 — Ethernet-first operator network policy.
# eth0 carrier up → stop Pi SoftAP (operator uses LAN/mDNS).
# No carrier → start dsc-hub-ap (operator Setup SoftAP). Distinct from hub/bridge SoftAP.
set -euo pipefail

IFACE="${DSC_ETH_IFACE:-eth0}"
CARRIER_FILE="/sys/class/net/${IFACE}/carrier"

carrier=0
if [[ -f "${CARRIER_FILE}" ]]; then
  carrier="$(tr -d '[:space:]' < "${CARRIER_FILE}" || echo 0)"
fi

if [[ "${carrier}" == "1" ]]; then
  echo "dsc-hub-net-policy: ${IFACE} carrier up → SoftAP off (LAN/mDNS)"
  systemctl stop dsc-hub-ap.service 2>/dev/null || true
  # Keep unit enabled so SoftAP can return if cable is unplugged later (policy re-run).
  hostnamectl set-hostname dsc-brain 2>/dev/null || true
  exit 0
fi

echo "dsc-hub-net-policy: ${IFACE} no carrier → SoftAP on"
systemctl start dsc-hub-ap.service 2>/dev/null || true
