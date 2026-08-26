#!/bin/bash
# Bring eth0 up with DHCP when cable is connected (house LAN uplink).
set -eu
run_sudo() { echo "${DSC_SUDO_PASS:-}" | sudo -S "$@"; }

if [ -n "${1:-}" ]; then
  export DSC_SUDO_PASS="$1"
fi

if ip link show eth0 2>/dev/null | grep -q "state UP"; then
  echo "eth0 already up"
  ip -4 addr show eth0 || true
  # Link up is not enough: dhcpcd renewals have dropped the IPv4 routes while
  # the address stayed (noprefixroute), leaving replies to egress via wlan0.
  # Re-assert the subnet + default routes whenever they are missing.
  ETH_IP=$(ip -4 addr show eth0 | awk '/inet /{print $2}' | cut -d/ -f1 | head -1)
  if [ -n "$ETH_IP" ]; then
    SUBNET=$(echo "$ETH_IP" | awk -F. '{printf "%s.%s.%s.0/24", $1, $2, $3}')
    GATEWAY=$(echo "$ETH_IP" | awk -F. '{printf "%s.%s.%s.1", $1, $2, $3}')
    if ! ip route show | grep -q "$SUBNET dev eth0"; then
      run_sudo ip route add "$SUBNET" dev eth0 src "$ETH_IP" 2>/dev/null || true
      echo "re-added subnet route $SUBNET via eth0"
    fi
    if ! ip route show default | grep -q "dev eth0"; then
      run_sudo ip route add default via "$GATEWAY" dev eth0 src "$ETH_IP" 2>/dev/null || true
      echo "re-added default route via $GATEWAY on eth0"
    fi
  fi
  exit 0
fi

run_sudo ip link set eth0 up
if command -v dhcpcd >/dev/null 2>&1; then
  run_sudo dhcpcd -b eth0 2>/dev/null || run_sudo dhcpcd eth0 || true
elif command -v dhclient >/dev/null 2>&1; then
  run_sudo dhclient -v eth0 2>/dev/null || run_sudo dhclient eth0 || true
elif command -v nmcli >/dev/null 2>&1; then
  run_sudo nmcli dev connect eth0 || true
fi

sleep 2
ip -4 addr show eth0 || true
ip route | head -5 || true

# Docker: prefer IPv4 DNS (AP-only Pi had broken IPv6 resolver)
if [ ! -f /etc/docker/daemon.json ] || ! grep -q '"dns"' /etc/docker/daemon.json 2>/dev/null; then
  run_sudo mkdir -p /etc/docker
  run_sudo tee /etc/docker/daemon.json >/dev/null <<'EOF'
{
  "dns": ["192.168.86.1", "8.8.8.8", "1.1.1.1"],
  "ipv6": false
}
EOF
  run_sudo systemctl restart docker
  sleep 3
fi

echo "eth0 bring-up done"
