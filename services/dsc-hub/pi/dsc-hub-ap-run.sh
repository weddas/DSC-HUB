#!/bin/sh
# Foreground AP runner — hostapd stays the main process so systemd restarts on crash.
set -eu

/etc/dsc-hub/wlan0-ap.sh
killall wpa_supplicant 2>/dev/null || true

if [ -f /run/dsc-hub-dnsmasq.pid ]; then
  kill "$(cat /run/dsc-hub-dnsmasq.pid)" 2>/dev/null || true
fi
/usr/sbin/dnsmasq -C /etc/dsc-hub/dnsmasq.conf -x /run/dsc-hub-dnsmasq.pid

exec /usr/sbin/hostapd /etc/dsc-hub/hostapd.conf
