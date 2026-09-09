#!/bin/sh
# Foreground AP runner — hostapd stays the main process so systemd restarts on crash.
set -eu

/etc/dsc-hub/wlan0-ap.sh
killall wpa_supplicant 2>/dev/null || true

if [ -f /run/dsc-hub-dnsmasq.pid ]; then
  kill "$(cat /run/dsc-hub-dnsmasq.pid)" 2>/dev/null || true
fi
/usr/sbin/dnsmasq -C /etc/dsc-hub/dnsmasq.conf -x /run/dsc-hub-dnsmasq.pid
# Fleet NTP: nothing NATs 10.42.0.0/24, so the hub's SNTP request to pool.ntp.org can never
# get a reply — its clock stayed "unsynced" and the firmware kept both photoperiod windows
# shut (live 2026-09-09, tents dark for 3.5 h). Answer port 123 from the SoftAP on the Pi
# itself (chrony, installed by bring-up-eth0.sh / the bake) — no firmware change needed.
if command -v iptables >/dev/null 2>&1; then
  iptables -t nat -C PREROUTING -i wlan0 -p udp --dport 123 -j REDIRECT --to-ports 123 2>/dev/null \
    || iptables -t nat -A PREROUTING -i wlan0 -p udp --dport 123 -j REDIRECT --to-ports 123 || true
fi

exec /usr/sbin/hostapd /etc/dsc-hub/hostapd.conf
