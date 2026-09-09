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
  # NO early exit here: the resolver / dhcpcd / NTP / docker hardening below must run on a
  # live Pi too. It used to `exit 0` on "already up", so every deploy since the hardening
  # was written skipped it — the Pi sat with an EMPTY /etc/resolv.conf, timesyncd
  # unsynced and the hub clock invalid (found 2026-09-09 when docker build could not
  # resolve the registry).
else
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
fi

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
  # MUST be PREPENDED, before the first `interface` block: appended at the end (as an
  # earlier version did) dhcpcd silently ignored it and kept soliciting on veths — the
  # 2026-09-09 reboot came up with dhcpcd still managing four veths despite the line
  # being present. sed 1i puts it at the very top.
  run_sudo sed -i '1i # DSC-HUB: never manage container interfaces (must precede any interface block).\ndenyinterfaces veth* docker0 br-*' /etc/dhcpcd.conf
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

# Fleet NTP. The SoftAP subnet (10.42.0.0/24: hub, panel, pots, Sonoffs) has NO NAT to the
# internet — only the docker subnets are masqueraded — so the hub's SNTP request to
# pool.ntp.org resolves (dnsmasq) but no reply can ever route back. Its clock stayed
# "unsynced" and the firmware, correctly, kept both photoperiod windows shut: tents dark
# from the 17:30 hub reboot until this landed (2026-09-09). The Pi serves NTP itself
# (chrony; upstream = the same numeric servers) and dsc-hub-ap-run.sh redirects the
# fleet's port-123 traffic to it. chrony replaces systemd-timesyncd (apt handles the swap).
# No `local stratum`: while the Pi itself is unsynced it must not hand the fleet a guess.
if ! command -v chronyd >/dev/null 2>&1; then
  if getent hosts deb.debian.org >/dev/null 2>&1; then
    run_sudo env DEBIAN_FRONTEND=noninteractive apt-get install -y -q chrony >/dev/null 2>&1 \
      || echo "chrony install failed — fleet NTP not served until it succeeds"
  else
    echo "no resolver for apt — skipping chrony install this pass"
  fi
fi
if command -v chronyd >/dev/null 2>&1 && [ ! -f /etc/chrony/conf.d/dsc-hub.conf ]; then
  printf '# DSC-HUB: the Pi is the NTP server for its SoftAP fleet (bring-up-eth0.sh).
server 162.159.200.1 iburst
server 162.159.200.123 iburst
server 216.239.35.0 iburst
server 216.239.35.4 iburst
pool time.cloudflare.com iburst
allow 10.42.0.0/24
' > /tmp/dsc-chrony.conf
  run_sudo install -m 0644 /tmp/dsc-chrony.conf /etc/chrony/conf.d/dsc-hub.conf
  rm -f /tmp/dsc-chrony.conf
  run_sudo systemctl enable --now chrony 2>/dev/null || true
  run_sudo systemctl restart chrony 2>/dev/null || true
fi
if command -v iptables >/dev/null 2>&1 && ip link show wlan0 >/dev/null 2>&1; then
  run_sudo iptables -t nat -C PREROUTING -i wlan0 -p udp --dport 123 -j REDIRECT --to-ports 123 2>/dev/null \
    || run_sudo iptables -t nat -A PREROUTING -i wlan0 -p udp --dport 123 -j REDIRECT --to-ports 123 || true
fi
# Make the redirect survive a reboot. iptables rules are not persisted and the AP can be
# brought up by more than one mechanism, so a dedicated boot-time oneshot re-arms it
# regardless (2026-09-09: a plain reboot left the redirect gone and the hub clock unsynced).
UNIT_SRC="$(dirname "$0")/dsc-hub-fleet-ntp.service"
if [ -f "${UNIT_SRC}" ] && [ ! -f /etc/systemd/system/dsc-hub-fleet-ntp.service ]; then
  run_sudo install -m 0644 "${UNIT_SRC}" /etc/systemd/system/dsc-hub-fleet-ntp.service
  run_sudo systemctl daemon-reload 2>/dev/null || true
  run_sudo systemctl enable --now dsc-hub-fleet-ntp.service 2>/dev/null || true
fi

# Docker: prefer IPv4 DNS (AP-only Pi had broken IPv6 resolver). Only meaningful
# now that eth0 actually has an uplink.
if [ ! -f /etc/docker/daemon.json ] || ! grep -q '"dns"' /etc/docker/daemon.json 2>/dev/null; then
  run_sudo mkdir -p /etc/docker
  # NEVER `run_sudo tee <<EOF`: run_sudo feeds the sudo PASSWORD on stdin, so tee wrote
  # "Digital" into daemon.json (live, 2026-09-09) — dockerd refused to start, hit its
  # start-limit and every container was gone. Write to /tmp, validate, then install.
  cat > /tmp/dsc-daemon.json <<'EOF'
{
  "dns": ["192.168.86.1", "8.8.8.8", "1.1.1.1"],
  "ipv6": false
}
EOF
  if python3 -m json.tool /tmp/dsc-daemon.json >/dev/null 2>&1; then
    run_sudo install -m 0644 /tmp/dsc-daemon.json /etc/docker/daemon.json
    # A restart takes every container down with it; only do it when the running daemon
    # is not already using this file (i.e. it actually changed).
    run_sudo systemctl reset-failed docker.service 2>/dev/null || true
    run_sudo systemctl restart docker
    sleep 3
  else
    echo "daemon.json candidate is not valid JSON — leaving /etc/docker/daemon.json alone"
  fi
  rm -f /tmp/dsc-daemon.json
fi

echo "$IFACE bring-up done"
