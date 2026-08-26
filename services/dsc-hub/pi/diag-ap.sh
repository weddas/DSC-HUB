#!/bin/bash
set -eu
echo "=== hostapd ==="
grep -E '^(ssid|wpa_passphrase|channel)=' /etc/dsc-hub/hostapd.conf || true
systemctl is-active dsc-hub-ap.service || true
echo "=== wlan0 ==="
ip -4 addr show wlan0 || true
iw dev wlan0 info 2>/dev/null || true
echo "=== Pi secrets wifi ==="
grep -E '^(wifi_ssid|wifi_password):' /opt/dsc-hub-repo/firmware/v4/secrets.yaml 2>/dev/null || echo missing
echo "=== hub yaml wifi ==="
grep -E 'wifi_bssid|bridge_mac|lan_ip|wifi:' /opt/dsc-hub-repo/firmware/v4/dsc-hub.yaml | head -20
echo "=== dnsmasq leases ==="
grep -i hub /var/lib/misc/dnsmasq.leases 2>/dev/null || grep -i hub /var/lib/dsc-hub/dnsmasq.leases 2>/dev/null || echo no_leases
echo "=== recent hostapd (if journal) ==="
echo Digital | sudo -S journalctl -u dsc-hub-ap.service -n 20 --no-pager 2>/dev/null || true
