#!/usr/bin/env bash
# DSC-HUB 7.0.0 — Pi appliance first-boot bootstrap (Raspberry Pi OS Lite 64-bit).
# Run as root after cloning the repo onto the Pi SSD.
set -euo pipefail

DSC_DATA="${DSC_DATA:-/var/lib/dsc-hub}"
REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
COMPOSE_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "DSC-HUB Pi bootstrap — data at ${DSC_DATA}"

export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y --no-install-recommends \
  avahi-daemon \
  dnsmasq \
  hostapd \
  iptables-persistent \
  nftables \
  git \
  curl \
  ca-certificates \
  python3 \
  python3-pip

# Docker (official convenience script)
if ! command -v docker >/dev/null 2>&1; then
  curl -fsSL https://get.docker.com | sh
fi
apt-get install -y docker-compose-plugin || true

# Pin brcmfmac SDIO firmware to minimal variant (10+ STA AP slots; see FOLLOWUPS 2026-08-27).
CYFMAC_ALT="/lib/firmware/cypress/cyfmac43455-sdio.bin"
CYFMAC_MIN="/lib/firmware/cypress/cyfmac43455-sdio-minimal.bin"
if [[ -f "${CYFMAC_MIN}" ]]; then
  update-alternatives --install "${CYFMAC_ALT}" cyfmac43455-sdio.bin "${CYFMAC_MIN}" 100 \
    2>/dev/null || true
  update-alternatives --set cyfmac43455-sdio.bin "${CYFMAC_MIN}" 2>/dev/null || true
  echo "Pinned cyfmac43455-sdio to minimal firmware"
else
  echo "WARN: ${CYFMAC_MIN} not found — skip cyfmac pin (run after apt firmware bump)"
fi

hostnamectl set-hostname dsc-brain || true
mkdir -p "${DSC_DATA}"/{cannalib,z2m,mosquitto,esphome,firmware,backups}
if [[ ! -f "${DSC_DATA}/z2m/configuration.yaml" ]]; then
  cp "${COMPOSE_DIR}/zigbee2mqtt/configuration.yaml" "${DSC_DATA}/z2m/configuration.yaml"
fi
chmod 755 "${DSC_DATA}"

# Swap on SSD (compile fallback path)
if [[ ! -f "${DSC_DATA}/swapfile" ]]; then
  fallocate -l 4G "${DSC_DATA}/swapfile" || dd if=/dev/zero of="${DSC_DATA}/swapfile" bs=1M count=4096
  chmod 600 "${DSC_DATA}/swapfile"
  mkswap "${DSC_DATA}/swapfile"
  swapon "${DSC_DATA}/swapfile"
  grep -q "${DSC_DATA}/swapfile" /etc/fstab || echo "${DSC_DATA}/swapfile none swap sw 0 0" >> /etc/fstab
fi

# Disable serial console grabbing SkyConnect ACM
if [[ -f /boot/firmware/cmdline.txt ]]; then
  sed -i 's/console=serial0,[0-9]* //g' /boot/firmware/cmdline.txt || true
fi

# AP + DHCP templates
install -d /etc/dsc-hub
AP_SSID="${DSC_AP_SSID:-DSC-Brain}"
AP_PSK="${DSC_AP_PSK:-Digital1}"
AP_CHANNEL="${DSC_AP_CHANNEL:-6}"
AP_NET="10.42.0.1"
AP_MASK="255.255.255.0"

cat > /etc/dsc-hub/hostapd.conf <<EOF
interface=wlan0
driver=nl80211
ssid=${AP_SSID}
hw_mode=g
channel=${AP_CHANNEL}
country_code=AU
ieee80211n=1
wmm_enabled=1
auth_algs=1
wpa=2
wpa_key_mgmt=WPA-PSK
wpa_passphrase=${AP_PSK}
rsn_pairwise=CCMP
max_num_sta=32
macaddr_acl=0
deny_mac_file=/etc/dsc-hub/hostapd.deny
EOF

cat > /etc/dsc-hub/hostapd.deny <<'EOF'
34:6f:24:da:41:77
EOF

cat > /etc/dsc-hub/dnsmasq.conf <<EOF
interface=wlan0
bind-interfaces
dhcp-range=10.42.0.50,10.42.0.200,12h
dhcp-option=option:router,${AP_NET}
dhcp-option=option:dns-server,${AP_NET}
domain=dsc-brain.local
address=/dsc-brain.local/${AP_NET}
# Static reservations — MACs from Settings inventory after first flash
dhcp-host=10.42.0.10,dsc-hub
dhcp-host=10.42.0.11,dsc-control
dhcp-host=10.42.0.21,DSC-Probe1
dhcp-host=10.42.0.22,DSC-Probe2
dhcp-host=10.42.0.23,DSC-Probe3
dhcp-host=10.42.0.24,DSC-Probe4
dhcp-host=10.42.0.50,dsc-heater
dhcp-host=10.42.0.51,dsc-heatmat
dhcp-host=10.42.0.54,dsc-humidifier
dhcp-host=10.42.0.55,dsc-dehumidifier
EOF

# Static AP address on wlan0 (NetworkManager may fight this on some images — document in ops)
cat > /etc/dsc-hub/wlan0-ap.sh <<'WEOF'
#!/bin/sh
ip link set wlan0 up
ip addr flush dev wlan0
ip addr add 10.42.0.1/24 dev wlan0
WEOF
chmod +x /etc/dsc-hub/wlan0-ap.sh

install -m 0755 "${COMPOSE_DIR}/pi/dsc-hub-ap-run.sh" /etc/dsc-hub/ap-run.sh

# Recovery scripts — on-box fallback flash path (LF; see .gitattributes)
install -d /opt/dsc-hub-repo/services/dsc-hub/pi
for _script in flash-sonoff-fallback-remote.sh flash-hub-fallback-remote.sh soak-check.sh island-proof.sh setup-soak-cron.sh; do
  if [[ -f "${COMPOSE_DIR}/pi/${_script}" ]]; then
    install -m 0755 "${COMPOSE_DIR}/pi/${_script}" "/opt/dsc-hub-repo/services/dsc-hub/pi/${_script}"
  fi
done

# IP forward AP <-> eth0 (ETH01 switch)
cat > /etc/sysctl.d/99-dsc-hub.conf <<EOF
net.ipv4.ip_forward=1
EOF
sysctl -p /etc/sysctl.d/99-dsc-hub.conf

# NAT AP -> eth0 (house uplink optional)
if command -v nft >/dev/null 2>&1; then
  cat > /etc/nftables.dsc-hub.conf <<'NFEOF'
table ip dsc_hub {
  chain postrouting {
    type nat hook postrouting priority srcnat; policy accept;
    oifname "eth0" ip saddr 10.42.0.0/24 masquerade
  }
  chain forward {
    type filter hook forward priority filter; policy accept;
    iifname "wlan0" oifname "eth0" accept
    iifname "eth0" oifname "wlan0" ct state established,related accept
  }
}
NFEOF
  nft -f /etc/nftables.dsc-hub.conf || true
  grep -q 'nftables.dsc-hub.conf' /etc/rc.local 2>/dev/null || \
    echo 'nft -f /etc/nftables.dsc-hub.conf' >> /etc/rc.local 2>/dev/null || true
fi

install -m 0644 "${COMPOSE_DIR}/pi/dsc-hub-ap.service" /etc/systemd/system/dsc-hub-ap.service
install -m 0644 "${COMPOSE_DIR}/pi/dsc-hub-compose.service" /etc/systemd/system/dsc-hub-compose.service

if [[ ! -f "${COMPOSE_DIR}/.env" ]]; then
  cp "${COMPOSE_DIR}/env.example" "${COMPOSE_DIR}/.env"
  echo "Created ${COMPOSE_DIR}/.env — edit secrets before production."
fi

systemctl daemon-reload
systemctl enable dsc-hub-compose.service

# Compose systemd unit expects /opt/dsc-hub — symlink repo compose dir if missing
if [[ ! -e /opt/dsc-hub ]]; then
  ln -sfn "${COMPOSE_DIR}" /opt/dsc-hub
fi

# Full repo path for docker compose build + deploy hot-patch source
REPO_ROOT="$(cd "${COMPOSE_DIR}/../.." && pwd)"
if [[ ! -e /opt/dsc-hub-repo ]]; then
  ln -sfn "${REPO_ROOT}" /opt/dsc-hub-repo
fi

echo "Bootstrap complete. Next:"
echo "  1. Edit ${COMPOSE_DIR}/.env (API keys, AP PSK, SkyConnect by-id)"
echo "  2. Copy CannaLib checkpoint sqlite to ${DSC_DATA}/cannalib/dsc_brain.sqlite3"
echo "  3. systemctl start dsc-hub-ap.service   # after wlan0 is free"
echo "  4. systemctl start dsc-hub-compose.service"
