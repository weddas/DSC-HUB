#!/bin/bash
set -eu
# Fix live Pi AP PSK if brain network apply wrote the bootstrap placeholder.
if grep -q '^wpa_passphrase=changeme-dsc-brain' /etc/dsc-hub/hostapd.conf 2>/dev/null; then
  echo Digital | sudo -S sed -i 's/^wpa_passphrase=.*/wpa_passphrase=Digital1/' /etc/dsc-hub/hostapd.conf
  echo Digital | sudo -S systemctl restart dsc-hub-ap.service
  echo fixed_live_hostapd
else
  echo live_hostapd_ok
fi
grep wpa_passphrase /etc/dsc-hub/hostapd.conf
