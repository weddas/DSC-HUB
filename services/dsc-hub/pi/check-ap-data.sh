#!/bin/bash
grep wpa_passphrase /var/lib/dsc-hub/ops/network/hostapd.conf 2>/dev/null || echo no_ops_hostapd
echo Digital | sudo -S docker exec dsc-hub-brain python -c 'from dsc_brain.settings import get_setting; print("ap_psk=", repr(get_setting("ap_psk")))' 2>/dev/null || true
