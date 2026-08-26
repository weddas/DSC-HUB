#!/bin/bash
# Recover the hub off its fallback SoftAP from the Pi (stops DSC-Brain AP briefly).
# Assumes dsc-hub.yaml is already compiled in the dsc-hub-esphome container
# (run `esphome compile dsc-hub.yaml` first so AP downtime is upload-only).
# Usage: flash-hub-fallback-remote.sh [sudo_password] [ap_wait_seconds]
set -eu

PASS="${1:-Digital}"
AP_WAIT="${2:-120}"
SSID="DSC-HUB Fallback Hotspot"
SECRETS="/opt/dsc-hub-repo/firmware/v4/secrets.yaml"
BRAIN_MDNS="${BRAIN_MDNS:-dsc-brain.local}"
BRAIN_ETH_IP="${BRAIN_ETH_IP:-192.168.86.48}"
IW_SCAN_TIMEOUT="${IW_SCAN_TIMEOUT:-30}"

run_sudo() { echo "$PASS" | sudo -S "$@"; }

get_secret() {
  grep "^dsc_hub_ap_password:" "$SECRETS" | sed -n 's/^[^:]*: "\(.*\)"/\1/p' | head -1
}

iw_scan() {
  run_sudo timeout "$IW_SCAN_TIMEOUT" iw dev wlan0 scan 2>/dev/null || true
}

stop_brain_ap() {
  echo "Stopping DSC-Brain AP..."
  run_sudo systemctl stop dsc-hub-ap.service || true
  run_sudo killall hostapd dnsmasq wpa_supplicant 2>/dev/null || true
  sleep 2
  run_sudo ip addr flush dev wlan0 || true
  run_sudo ip link set wlan0 up
}

start_brain_ap() {
  echo "Restoring DSC-Brain AP..."
  run_sudo killall wpa_supplicant 2>/dev/null || true
  run_sudo ip addr flush dev wlan0 || true
  run_sudo systemctl restart dsc-hub-ap.service || true
  sleep 3
  if ! ip -4 addr show wlan0 | grep -q '10.42.0.1/'; then
    echo "WARN: wlan0 missing 10.42.0.1 — running wlan0-ap.sh"
    run_sudo /etc/dsc-hub/wlan0-ap.sh || true
    run_sudo systemctl restart dsc-hub-ap.service || true
    sleep 2
  fi
}

cleanup() { start_brain_ap; }
trap cleanup EXIT

connect_fallback_ap() {
  local psk="$1"
  local conf="/tmp/dsc-wpa-hub.conf"
  cat >"$conf" <<EOF
ctrl_interface=/run/wpa_supplicant
update_config=0
country=AU

network={
  ssid="${SSID}"
  psk="${psk}"
  key_mgmt=WPA-PSK
}
EOF
  run_sudo killall wpa_supplicant 2>/dev/null || true
  run_sudo ip addr flush dev wlan0 || true
  run_sudo ip link set wlan0 up
  run_sudo wpa_supplicant -B -i wlan0 -c "$conf"
  local i=0
  while [ "$i" -lt 25 ]; do
    if run_sudo iw dev wlan0 link 2>/dev/null | grep -Fq "SSID: ${SSID}"; then
      break
    fi
    sleep 1
    i=$((i + 1))
  done
  run_sudo ip addr add 192.168.4.2/24 dev wlan0 2>/dev/null || run_sudo ip addr replace 192.168.4.2/24 dev wlan0
  local i=0
  while [ "$i" -lt 15 ]; do
    if ping -c1 -W2 192.168.4.1 >/dev/null 2>&1; then
      return 0
    fi
    sleep 2
    i=$((i + 1))
  done
  return 1
}

AP_PSK="$(get_secret)"
if [ -z "$AP_PSK" ]; then
  echo "Missing secret dsc_hub_ap_password"
  exit 1
fi

echo "=== Hub fallback recovery (Pi wlan0 client) ==="
echo "Brain: ${BRAIN_MDNS} / ${BRAIN_ETH_IP}"
if ping -c1 -W2 "$BRAIN_ETH_IP" >/dev/null 2>&1 || ping -c1 -W2 "$BRAIN_MDNS" >/dev/null 2>&1; then
  echo "Brain eth0 reachable"
else
  echo "WARN: Brain not pingable on eth0 — continuing (SSH session may still work)"
fi

# Pi AP OTA first (hub fleet address) before tearing down the Brain AP.
HUB_PI_IP="10.42.0.10"
if ping -c1 -W2 "$HUB_PI_IP" >/dev/null 2>&1; then
  if (echo >/dev/tcp/"$HUB_PI_IP"/8266) 2>/dev/null || (echo >/dev/tcp/"$HUB_PI_IP"/6053) 2>/dev/null; then
    echo "Hub reachable on Pi AP ($HUB_PI_IP) — trying OTA without stopping Brain AP..."
    if run_sudo docker exec -w /config dsc-hub-esphome esphome upload dsc-hub.yaml --device "$HUB_PI_IP"; then
      echo "OK via Pi AP: hub"
      echo "=== done — hub reboots and should rejoin DSC-Brain within ~2 min ==="
      exit 0
    fi
    echo "Pi AP OTA failed — falling back to hub SoftAP recovery"
  fi
fi

stop_brain_ap

end=$((SECONDS + AP_WAIT))
found=0
echo "Scanning for AP '${SSID}' up to ${AP_WAIT}s (iw scan timeout ${IW_SCAN_TIMEOUT}s)..."
while [ "$SECONDS" -lt "$end" ]; do
  if iw_scan | grep -Fq "SSID: ${SSID}"; then
    found=1
    echo "Found AP: ${SSID}"
    break
  fi
  sleep 5
done

if [ "$found" -ne 1 ]; then
  echo "Hub fallback AP not seen — hub may have rejoined on its own; aborting cleanly"
  exit 0
fi

# NOTE: keep inside `if` — a bare call under `set -e` aborts via the EXIT trap.
if connect_fallback_ap "$AP_PSK"; then
  echo "Connected — uploading pre-built dsc-hub firmware over fallback AP..."
  if run_sudo docker exec -w /config dsc-hub-esphome esphome upload dsc-hub.yaml --device 192.168.4.1; then
    echo "OK via fallback AP: hub"
  else
    echo "FAIL OTA via fallback AP: hub"
    exit 1
  fi
else
  echo "Fallback AP unreachable at 192.168.4.1 (association or ping failed)"
  run_sudo iw dev wlan0 link || true
  exit 1
fi

echo "=== done — hub reboots and should rejoin DSC-Brain within ~2 min ==="
