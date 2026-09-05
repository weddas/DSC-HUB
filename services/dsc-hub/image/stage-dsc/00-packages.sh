#!/usr/bin/env bash
# pi-gen stage snippet — packages for DSC-HUB 8.0.0 kit image
set -e
apt-get update
apt-get install -y --no-install-recommends \
  avahi-daemon dnsmasq hostapd nftables \
  ca-certificates curl git \
  python3 python3-pip python3-serial \
  docker.io docker-compose-plugin \
  || true
# esptool: prefer distro package, else pip
apt-get install -y --no-install-recommends esptool || pip3 install --break-system-packages esptool || true
