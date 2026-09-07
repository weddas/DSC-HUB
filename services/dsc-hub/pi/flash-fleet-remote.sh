#!/bin/bash
# Manual fleet OTA from the Pi — the fallback when Settings → Device → ESPHome is
# not available. Uses the host ESPHome venv (dsc-esphome-venv-setup), never Docker.
#
#   flash-fleet-remote.sh <sudo-pass> [seat ...]
#
# Default order matches the in-app rollout rule: pot2 first as the canary, then
# the other probes, the Sonoffs, the panel, and the HUB LAST so a mid-train
# failure never takes the room down with the rest still on the old build.
# Hosts come from the brain inventory (/settings) with a static map as fallback.
set -eu

PASS="${1:-Digital}"
shift || true
SEATS="${*:-pot2 pot1 heater heatmat humidifier dehumidifier control hub}"

run_sudo() { echo "$PASS" | sudo -S "$@"; }

# --- toolchain -------------------------------------------------------------
[ -f /etc/dsc-hub/esphome.env ] && . /etc/dsc-hub/esphome.env
ESPHOME="${DSC_ESPHOME_BIN:-/opt/dsc-esphome-venv/bin/esphome}"
if [ ! -x "$ESPHOME" ]; then
  ESPHOME="$(command -v esphome || true)"
fi
if [ -z "$ESPHOME" ]; then
  echo "FAIL: no esphome CLI — run: sudo systemctl start dsc-esphome-venv-setup" >&2
  exit 1
fi
export PLATFORMIO_CORE_DIR="${PLATFORMIO_CORE_DIR:-/var/lib/dsc-hub/platformio}"

PROJECT_DIR="${DSC_ESPHOME_PROJECT_DIR:-}"
if [ -z "$PROJECT_DIR" ]; then
  for c in /opt/dsc-hub-repo/firmware/v4 /opt/dsc-hub/firmware/v4; do
    if ls "$c"/*.yaml >/dev/null 2>&1; then PROJECT_DIR="$c"; break; fi
  done
fi
if [ -z "$PROJECT_DIR" ] || [ ! -d "$PROJECT_DIR" ]; then
  echo "FAIL: no firmware/v4 tree (set DSC_ESPHOME_PROJECT_DIR in /etc/dsc-hub/esphome.env)" >&2
  exit 1
fi

if [ -f /tmp/dsc-firmware-v4.tgz ]; then
  echo "=== sync firmware/v4 from upload ==="
  mkdir -p "$PROJECT_DIR"
  tar -xzf /tmp/dsc-firmware-v4.tgz -C "$PROJECT_DIR"
fi
if [ ! -f "$PROJECT_DIR/secrets.yaml" ]; then
  echo "FAIL: $PROJECT_DIR/secrets.yaml missing — every !secret compile fails. Baked kits ship it; otherwise run generate-secrets.sh there." >&2
  exit 1
fi

# --- seats -----------------------------------------------------------------
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

# Static fallback (kit dnsmasq reservations, pi-bootstrap.sh).
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

# Prefer the brain's inventory (operator-edited hosts, in_service flags).
INV="$(curl -sf --max-time 5 http://127.0.0.1:8787/settings 2>/dev/null || true)"
if [ -n "$INV" ]; then
  while IFS=$'\t' read -r seat host in_svc; do
    [ -n "$seat" ] || continue
    [ -n "$host" ] && HOST[$seat]="$host"
    if [ "$in_svc" = "0" ]; then HOST[$seat]=""; echo "note: $seat is out of service in inventory — skipping"; fi
  done < <(printf '%s' "$INV" | python3 -c '
import json, sys
d = json.load(sys.stdin)
for r in d.get("inventory") or []:
    print(f"{r.get(\"seat_id\",\"\")}\t{r.get(\"host\") or \"\"}\t{1 if r.get(\"in_service\", True) else 0}")
' 2>/dev/null)
fi

echo "=== DSC fleet flash train ($ESPHOME @ $PROJECT_DIR) ==="
"$ESPHOME" version
cd "$PROJECT_DIR"
for seat in $SEATS; do
  yaml="${YAML[$seat]:-}"
  host="${HOST[$seat]:-}"
  if [ -z "$yaml" ]; then
    echo "SKIP unknown seat: $seat"
    continue
  fi
  if [ -z "$host" ]; then
    echo "SKIP $seat: no host / out of service"
    continue
  fi
  echo ""
  echo "=== OTA $seat ($yaml → $host) ==="
  if ! "$ESPHOME" run "$yaml" --device "$host" --no-logs; then
    echo "FAIL: $seat OTA failed — fix and re-run: flash-fleet-remote.sh $PASS $seat" >&2
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
print('panel', (d.get('panel') or {}).get('firmware'))
for k,v in sorted((d.get('pots') or {}).items()):
    print(k, v.get('firmware'))
for k,v in sorted((d.get('sonoffs') or {}).items()):
    print(k, v.get('firmware'))
" || echo "WARN: fleet check failed (brain warming up?)"

echo "=== flash-fleet complete ==="
