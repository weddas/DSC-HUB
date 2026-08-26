#!/bin/bash
# Flash Sonoffs on the Pi AP island (10.42.0.x) from the ESPHome container.
set -eu
PASS="${1:-Digital}"
SEATS="${2:-heater heatmat humidifier dehumidifier}"

run_sudo() { echo "$PASS" | sudo -S "$@"; }

declare -A YAML=(
  [heater]=dsc-heater.yaml
  [heatmat]=dsc-heatmat.yaml
  [humidifier]=dsc-humidifier.yaml
  [dehumidifier]=dsc-de-humidifier.yaml
)
declare -A OTAIP=(
  [heater]=10.42.0.50
  [heatmat]=10.42.0.51
  [humidifier]=10.42.0.54
  [dehumidifier]=10.42.0.55
)

if [ -f /tmp/dsc-firmware-v4.tgz ]; then
  mkdir -p /opt/dsc-hub-repo/firmware/v4
  tar -xzf /tmp/dsc-firmware-v4.tgz -C /opt/dsc-hub-repo/firmware/v4
fi

echo "=== Sonoff Pi AP flash 7.0.0.0 ==="
for seat in $SEATS; do
  yaml="${YAML[$seat]:-}"
  ip="${OTAIP[$seat]:-}"
  [ -z "$yaml" ] || [ -z "$ip" ] && continue
  echo ""
  echo "=== $seat ($yaml -> $ip) ==="
  if ! ping -c1 -W2 "$ip" >/dev/null 2>&1; then
    echo "SKIP: $ip offline"
    continue
  fi
  if ! run_sudo docker exec -w /config dsc-hub-esphome esphome run "$yaml" --device "$ip" --no-logs; then
    echo "FAIL: $seat"
    continue
  fi
  echo "OK: $seat"
  sleep 5
done
echo "=== done ==="
