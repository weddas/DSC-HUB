#!/bin/bash
# Flash Sonoffs on the Pi AP island (10.42.0.x) with the host ESPHome venv.
set -eu
PASS="${1:-Digital}"
SEATS="${2:-heater heatmat humidifier dehumidifier}"

run_sudo() { echo "$PASS" | sudo -S "$@"; }

# --- ESPHome from the host venv (the dsc-hub-esphome container is retired) ---
[ -f /etc/dsc-hub/esphome.env ] && . /etc/dsc-hub/esphome.env
ESPHOME="${DSC_ESPHOME_BIN:-/opt/dsc-esphome-venv/bin/esphome}"
[ -x "$ESPHOME" ] || ESPHOME="$(command -v esphome || true)"
[ -n "$ESPHOME" ] || { echo "FAIL: no esphome CLI — sudo systemctl start dsc-esphome-venv-setup" >&2; exit 1; }
export PLATFORMIO_CORE_DIR="${PLATFORMIO_CORE_DIR:-/var/lib/dsc-hub/platformio}"
PROJECT_DIR="${DSC_ESPHOME_PROJECT_DIR:-/opt/dsc-hub-repo/firmware/v4}"
[ -d "$PROJECT_DIR" ] || PROJECT_DIR=/opt/dsc-hub/firmware/v4
run_esphome() { (cd "$PROJECT_DIR" && "$ESPHOME" "$@"); }

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
  if ! run_esphome run "$yaml" --device "$ip" --no-logs; then
    echo "FAIL: $seat"
    continue
  fi
  echo "OK: $seat"
  sleep 5
done
echo "=== done ==="
