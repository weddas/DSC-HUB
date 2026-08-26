#!/bin/bash
# Post-deploy acceptance for DSC-Brain (:8787). Run on Pi or via verify-brain.ps1.
set -eu

BASE="${1:-http://127.0.0.1:8787}"
PASS="${2:-Digital}"

echo "=== health ==="
curl -sf "${BASE}/health" || { echo "FAIL: /health"; exit 1; }
echo

echo "=== fleet (native FleetState) ==="
if command -v jq >/dev/null 2>&1; then
  FLEET=$(curl -sf "${BASE}/fleet")
  echo "${FLEET}" | jq '{
    hub_online: .hub.online,
    surface: .surface,
    version: .version,
    inventory: (.inventory | length),
    hub_controls: (.hub.values.controls // {} | keys | length),
    pots_online: [.pots | to_entries[] | select(.value.online) | .key]
  }'
  HUB_ON=$(echo "${FLEET}" | jq -r '.hub.online')
  if [ "${HUB_ON}" != "true" ]; then
    echo "WARN: hub not online yet (ingest may still be warming up)"
  fi
else
  curl -sf "${BASE}/fleet" | head -c 500
  echo
fi

echo "=== appliance driver ==="
echo "${PASS}" | sudo -S docker exec dsc-hub-brain python -c \
  "import dsc_brain.appliance_driver as a; print('demands', sorted(a.DEMAND_TO_SEAT.keys()))" \
  2>/dev/null || echo "WARN: driver check skipped (not on Pi?)"

echo "=== SPA static (container) ==="
echo "${PASS}" | sudo -S docker exec dsc-hub-brain sh -c \
  "grep -oE 'assets/index-[^\"]+\\.js' /app/static/index.html | head -1" \
  2>/dev/null || echo "WARN: SPA hash check skipped"

echo "=== recent brain logs ==="
echo "${PASS}" | sudo -S docker logs dsc-hub-brain --tail 12 2>/dev/null || true

echo "OK: verify-brain complete (${BASE})"
