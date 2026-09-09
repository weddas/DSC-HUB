#!/bin/bash
# Bring eth0 up with DHCP — ONLY when a cable is actually plugged in.
# No cable => do nothing: don't run DHCP, don't touch routes, don't restart
# Docker. (A carrier-less bring-up was orphaning the Wi-Fi IPv4 route and
# making the Pi unreachable on the LAN after a deploy.)
set -eu
run_sudo() { echo "${DSC_SUDO_PASS:-}" | sudo -S "$@"; }

if [ -n "${1:-}" ]; then
  export DSC_SUDO_PASS="$1"
fi

IFACE="${DSC_ETH_IFACE:-eth0}"

if ! ip link show "$IFACE" >/dev/null 2>&1; then
  echo "no $IFACE on this host — skipping eth0 bring-up"
  exit 0
fi

# Carrier only reports truthfully once the link is admin-up; that alone
# installs no addresses or routes.
run_sudo ip link set "$IFACE" up 2>/dev/null || true
carrier=0
for _ in 1 2 3 4 5; do
  carrier=$(cat "/sys/class/net/$IFACE/carrier" 2>/dev/null || echo 0)
  [ "$carrier" = "1" ] && break
  sleep 1
done
if [ "$carrier" != "1" ]; then
  echo "$IFACE: no cable (carrier=$carrier) — leaving Wi-Fi networking untouched"
  exit 0
fi
echo "$IFACE: cable detected — bringing up"

if ip link show "$IFACE" 2>/dev/null | grep -q "state UP"; then
  echo "$IFACE already up"
  ip -4 addr show "$IFACE" || true
  # Link up is not enough: dhcpcd renewals have dropped the IPv4 routes while
  # the address stayed (noprefixroute), leaving replies to egress via wlan0.
  # Re-assert the subnet + default routes whenever they are missing.
  ETH_IP=$(ip -4 addr show "$IFACE" | awk '/inet /{print $2}' | cut -d/ -f1 | head -1)
  if [ -n "$ETH_IP" ]; then
    SUBNET=$(echo "$ETH_IP" | awk -F. '{printf "%s.%s.%s.0/24", $1, $2, $3}')
    GATEWAY=$(echo "$ETH_IP" | awk -F. '{printf "%s.%s.%s.1", $1, $2, $3}')
    if ! ip route show | grep -q "$SUBNET dev $IFACE"; then
      run_sudo ip route add "$SUBNET" dev "$IFACE" src "$ETH_IP" 2>/dev/null || true
      echo "re-added subnet route $SUBNET via $IFACE"
    fi
    if ! ip route show default | grep -q "dev $IFACE"; then
      run_sudo ip route add default via "$GATEWAY" dev "$IFACE" src "$ETH_IP" 2>/dev/null || true
      echo "re-added default route via $GATEWAY on $IFACE"
    fi
  fi
  exit 0
fi

if command -v dhcpcd >/dev/null 2>&1; then
  run_sudo dhcpcd -b "$IFACE" 2>/dev/null || run_sudo dhcpcd "$IFACE" || true
elif command -v dhclient >/dev/null 2>&1; then
  run_sudo dhclient -v "$IFACE" 2>/dev/null || run_sudo dhclient "$IFACE" || true
elif command -v nmcli >/dev/null 2>&1; then
  run_sudo nmcli dev connect "$IFACE" || true
fi

sleep 2
ip -4 addr show "$IFACE" || true
ip route | head -5 || true

# Host DNS: dhcpcd on this Pi writes an EMPTY /etc/resolv.conf on eth0 renewals
# (no resolvconf, lease carries no DNS) — containers still resolved through the
# Docker pin below, but host pip/apt/PlatformIO could not (seen live 2026-09-06:
# "Update ESPHome" failed on 'pypi.org' name resolution). Pin the same servers
# for the host via dhcpcd so a renewal keeps them.
# `static domain_name_servers` was NOT enough: dhcpcd still emptied resolv.conf on the
# next renewal (00:39, mid fleet-reflash — hub + probe builds failed resolving
# github.com). Take dhcpcd out of resolver management and keep a static file.
if ! grep -q '^nohook resolv.conf' /etc/dhcpcd.conf 2>/dev/null; then
  printf '
# DSC-HUB: dhcpcd rewrote an empty resolv.conf on renewals; the resolver is static (bring-up-eth0.sh).
nohook resolv.conf
' > /tmp/dsc-dhcpcd-dns.conf
  run_sudo bash -c "cat /tmp/dsc-dhcpcd-dns.conf >> /etc/dhcpcd.conf"
  rm -f /tmp/dsc-dhcpcd-dns.conf
fi
if ! grep -q 'DSC-HUB static resolver' /etc/resolv.conf 2>/dev/null || ! getent hosts pypi.org >/dev/null 2>&1; then
  printf '# DSC-HUB static resolver (dhcpcd nohook resolv.conf). Same servers as /etc/docker/daemon.json.
nameserver 192.168.86.1
nameserver 8.8.8.8
nameserver 1.1.1.1
' > /tmp/dsc-resolv.conf
  run_sudo install -m 0644 /tmp/dsc-resolv.conf /etc/resolv.conf
  rm -f /tmp/dsc-resolv.conf
fi

# dhcpcd was soliciting leases on docker's veth* interfaces: every brain restart created a
# new veth, dhcpcd gave it an IPv4LL address and a 169.254/16 route, and the eth0 default
# route went with it (LAN unreachable while the brain kept running). Deny them.
if ! grep -q '^denyinterfaces veth\*' /etc/dhcpcd.conf 2>/dev/null; then
  printf '
# DSC-HUB: never manage container interfaces (bring-up-eth0.sh).
denyinterfaces veth* docker0 br-*
' > /tmp/dsc-dhcpcd-deny.conf
  run_sudo bash -c "cat /tmp/dsc-dhcpcd-deny.conf >> /etc/dhcpcd.conf"
  rm -f /tmp/dsc-dhcpcd-deny.conf
fi

# Time: the Pi ran 7 minutes slow with NTPSynchronized=no because timesyncd's default pool
# needed DNS that dhcpcd had emptied. Numeric servers cannot be broken by a resolver, and the
# hub's SNTP + every photoperiod window depend on this clock. (Cloudflare + Google NTP.)
if [ ! -f /etc/systemd/timesyncd.conf.d/dsc-hub.conf ]; then
  run_sudo mkdir -p /etc/systemd/timesyncd.conf.d
  printf '# DSC-HUB: numeric NTP so a dead resolver cannot stop time sync (bring-up-eth0.sh).
[Time]
NTP=162.159.200.1 162.159.200.123 216.239.35.0 216.239.35.4
FallbackNTP=time.cloudflare.com time.google.com
' > /tmp/dsc-timesyncd.conf
  run_sudo install -m 0644 /tmp/dsc-timesyncd.conf /etc/systemd/timesyncd.conf.d/dsc-hub.conf
  rm -f /tmp/dsc-timesyncd.conf
  run_sudo systemctl restart systemd-timesyncd 2>/dev/null || true
fi

# Docker: prefer IPv4 DNS (AP-only Pi had broken IPv6 resolver). Only meaningful
# now that eth0 actually has an uplink.
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

echo "$IFACE bring-up done"
