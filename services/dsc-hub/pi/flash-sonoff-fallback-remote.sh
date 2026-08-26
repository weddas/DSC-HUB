#!/bin/bash
# Flash Sonoffs via fallback SoftAP from the Pi (stops DSC-Brain AP briefly).
# Usage: flash-sonoff-fallback-remote.sh [sudo_password] [seats] [ap_wait_seconds]
set -eu

PASS="${1:-Digital}"
SEATS="${2:-heater heatmat humidifier dehumidifier}"
AP_WAIT="${3:-120}"
REPO="/opt/dsc-hub-repo/firmware/v4"
SECRETS="${REPO}/secrets.yaml"

run_sudo() { echo "$PASS" | sudo -S "$@"; }

declare -A YAML=(
  [heater]=dsc-heater.yaml
  [heatmat]=dsc-heatmat.yaml
  [humidifier]=dsc-humidifier.yaml
  [dehumidifier]=dsc-de-humidifier.yaml
)
declare -A APSSID=(
  [heater]="DSC-Heater Fallback Hotspot"
  [heatmat]="DSC-HeatMat Fallback Hotspot"
  [humidifier]="DSC-Humidifier Fallback Hotspot"
  [dehumidifier]="DSC-De-Humidifi Fallback Hotspot"
)
declare -A APSECRET=(
  [heater]=dsc_heater_ap_password
  [heatmat]=dsc_heatmat_ap_password
  [humidifier]=dsc_humidifier_ap_password
  [dehumidifier]=dsc_dehumidifier_ap_password
)
declare -A PIIP=(
  [heater]=10.42.0.50
  [heatmat]=10.42.0.51
  [humidifier]=10.42.0.54
  [dehumidifier]=10.42.0.55
)
declare -A LANIP=(
  [heater]=192.168.86.50
  [heatmat]=192.168.86.51
  [humidifier]=192.168.86.54
  [dehumidifier]=192.168.86.184
)

get_secret() {
  local key="$1"
  grep "^${key}:" "$SECRETS" | sed -n 's/^[^:]*: "\(.*\)"/\1/p' | head -1
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

cleanup() {
  start_brain_ap
}
trap cleanup EXIT

scan_for_ssid() {
  local ssid="$1"
  local end=$((SECONDS + AP_WAIT))
  echo "Scanning for AP '${ssid}' up to ${AP_WAIT}s (power-cycle device if missing)..."
  while [ "$SECONDS" -lt "$end" ]; do
    if run_sudo iw dev wlan0 scan 2>/dev/null | grep -Fq "SSID: ${ssid}"; then
      echo "Found AP: ${ssid}"
      return 0
    fi
    sleep 5
  done
  echo "AP not seen: ${ssid}"
  return 1
}

connect_fallback_ap() {
  local ssid="$1" psk="$2"
  local conf="/tmp/dsc-wpa-fallback.conf"
  cat >"$conf" <<EOF
ctrl_interface=/run/wpa_supplicant
update_config=0
country=AU

network={
  ssid="${ssid}"
  psk="${psk}"
  key_mgmt=WPA-PSK
}
EOF
  run_sudo killall wpa_supplicant 2>/dev/null || true
  run_sudo ip addr flush dev wlan0 || true
  run_sudo ip link set wlan0 up
  run_sudo wpa_supplicant -B -i wlan0 -c "$conf"
  local i=0
  while [ "$i" -lt 20 ]; do
    if run_sudo iw dev wlan0 link 2>/dev/null | grep -Fq "SSID: ${ssid}"; then
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

try_lan_ota() {
  local seat="$1" ip="$2" yaml="$3"
  if ! ping -c1 -W2 "$ip" >/dev/null 2>&1; then
    echo "LAN offline: $ip"
    return 1
  fi
  echo "LAN ping OK: $ip"
  if ! (echo >/dev/tcp/"$ip"/8266) 2>/dev/null && ! (echo >/dev/tcp/"$ip"/6053) 2>/dev/null; then
    echo "LAN OTA/API closed on $ip"
    return 1
  fi
  run_sudo docker exec -w /config dsc-hub-esphome esphome run "$yaml" --device "$ip" --no-logs
}

flash_fallback_ota() {
  local yaml="$1"
  run_sudo docker exec -w /config dsc-hub-esphome esphome run "$yaml" --device 192.168.4.1 --no-logs
}

if [ -f /tmp/dsc-firmware-v4.tgz ]; then
  mkdir -p "$REPO"
  tar -xzf /tmp/dsc-firmware-v4.tgz -C "$REPO"
fi

echo "=== Sonoff fallback flash 7.0.0.0 (Pi wlan0 client) ==="
echo "Seats: $SEATS"

for seat in $SEATS; do
  yaml="${YAML[$seat]:-}"
  ssid="${APSSID[$seat]:-}"
  secret_key="${APSECRET[$seat]:-}"
  pi_ip="${PIIP[$seat]:-}"
  lan_ip="${LANIP[$seat]:-}"
  [ -z "$yaml" ] && continue

  echo ""
  echo "=== $seat ($yaml) ==="
  ok=0

  if try_lan_ota "$seat" "$lan_ip" "$yaml"; then
    ok=1
    echo "OK via LAN: $seat"
  else
    stop_brain_ap
    ap_psk="$(get_secret "$secret_key")"
    if [ -z "$ap_psk" ]; then
      echo "Missing secret $secret_key"
    elif scan_for_ssid "$ssid"; then
      # NOTE: must stay inside `if` — a bare call under `set -e` aborts the
      # whole script (EXIT trap fires) before any diagnostic prints.
      if connect_fallback_ap "$ssid" "$ap_psk" && ping -c2 -W3 192.168.4.1 >/dev/null 2>&1; then
        if flash_fallback_ota "$yaml"; then
          ok=1
          echo "OK via fallback AP: $seat"
        else
          echo "FAIL OTA via fallback AP: $seat"
        fi
      else
        echo "Fallback AP unreachable at 192.168.4.1 (association or ping failed)"
        run_sudo iw dev wlan0 link || true
      fi
    else
      echo "Hint: power-cycle $seat away from house WiFi so fallback AP broadcasts"
    fi
    run_sudo killall wpa_supplicant 2>/dev/null || true
    start_brain_ap
  fi

  if [ "$ok" -eq 1 ]; then
    echo "Waiting for $seat on Pi AP ($pi_ip)..."
    sleep 25
    if ping -c1 -W3 "$pi_ip" >/dev/null 2>&1; then
      echo "Reachable on Pi AP: $pi_ip"
    else
      echo "Not yet on Pi AP ($pi_ip) — may need another minute"
    fi
  else
    echo "FAIL: $seat"
  fi
done

echo ""
echo "=== done ==="
