#!/bin/bash
# Flash DSC fleet to 7.0.0.0 via ESPHome on the Pi (AP island).
# Order: hub → pot2 canary → pot1,pot3,pot4 → sonoffs → panel
set -eu

PASS="${1:-Digital}"
REPO="/opt/dsc-hub-repo"
CONFIG="/config"
SEATS="${2:-hub pot2 pot1 pot3 pot4 heater heatmat humidifier dehumidifier control}"

run_sudo() { echo "$PASS" | sudo -S "$@"; }

if [ -f /tmp/dsc-firmware-v4.tgz ]; then
  echo "=== sync firmware/v4 from upload ==="
  mkdir -p "${REPO}/firmware/v4"
  tar -xzf /tmp/dsc-firmware-v4.tgz -C "${REPO}/firmware/v4"
fi

declare -A YAML=(
  [hub]=dsc-hub.yaml
  [control]=dsc-control.yaml
  [pot1]=dsc-pot1.yaml
  [pot2]=dsc-pot2.yaml
  [pot3]=dsc-pot3.yaml
  [pot4]=dsc-pot4.yaml
  [heater]=dsc-heater.yaml
  [heatmat]=dsc-heatmat.yaml
  [humidifier]=dsc-humidifier.yaml
  [dehumidifier]=dsc-de-humidifier.yaml
)

declare -A HOST=(
  [hub]=10.42.0.10
  [control]=10.42.0.11
  [pot1]=10.42.0.21
  [pot2]=10.42.0.22
  [pot3]=10.42.0.23
  [pot4]=10.42.0.24
  [heater]=10.42.0.50
  [heatmat]=10.42.0.51
  [humidifier]=10.42.0.54
  [dehumidifier]=10.42.0.55
)

echo "=== DSC fleet flash train 7.0.0.0 ==="
for seat in $SEATS; do
  yaml="${YAML[$seat]:-}"
  host="${HOST[$seat]:-}"
  if [ -z "$yaml" ] || [ -z "$host" ]; then
    echo "SKIP unknown seat: $seat"
    continue
  fi
  echo ""
  echo "=== OTA $seat ($yaml → $host) ==="
  if ! run_sudo docker exec -w "$CONFIG" dsc-hub-esphome esphome run "$yaml" --device "$host" --no-logs; then
    echo "FAIL: $seat OTA failed — fix and re-run: flash-fleet-remote.sh $PASS $seat"
    exit 1
  fi
  echo "OK: $seat OTA complete"
  sleep 5
done

echo ""
echo "=== post-flash /fleet firmware ==="
curl -sf http://127.0.0.1:8787/fleet | python3 -c "
import json,sys
d=json.load(sys.stdin)
print('hub', d.get('hub',{}).get('firmware'))
for k,v in sorted((d.get('pots') or {}).items()):
    print(k, v.get('firmware'))
" || echo "WARN: fleet check failed (brain warming up?)"

echo "=== flash-fleet complete ==="
