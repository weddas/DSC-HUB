#!/bin/bash
# Automated island-proof checks (operator still confirms Nest/HA automations off).
set -uo pipefail

BASE="${1:-http://127.0.0.1:8787}"
PASS="${2:-Digital}"
FAIL=0

check() {
  if "$@"; then
    echo "PASS: $*"
  else
    echo "FAIL: $*"
    FAIL=1
  fi
}

echo "=== island proof: DSC-Brain 7.0.0 ==="

echo "--- health ---"
if curl -sf "${BASE}/health" | tee /tmp/dsc-health.json; then
  echo
else
  echo "FAIL: curl ${BASE}/health"
  FAIL=1
fi

FLEET_JSON="$(curl -sf "${BASE}/fleet" 2>/dev/null || true)"
HUB_WARMUP_SEC="${HUB_WARMUP_SEC:-90}"
HUB_POLL_SEC="${HUB_POLL_SEC:-5}"
if [ -n "$FLEET_JSON" ]; then
  waited=0
  while [ "$waited" -lt "$HUB_WARMUP_SEC" ]; do
    hub_online="$(echo "$FLEET_JSON" | python3 -c "import json,sys; d=json.load(sys.stdin); print('1' if d.get('hub',{}).get('online') else '0')" 2>/dev/null || echo 0)"
    if [ "$hub_online" = "1" ]; then
      break
    fi
    echo "waiting for hub ingest (${waited}s / ${HUB_WARMUP_SEC}s)..."
    sleep "$HUB_POLL_SEC"
    waited=$((waited + HUB_POLL_SEC))
    FLEET_JSON="$(curl -sf "${BASE}/fleet" 2>/dev/null || true)"
  done
fi

if [ -z "$FLEET_JSON" ]; then
  echo "FAIL: curl ${BASE}/fleet"
  FAIL=1
else
  echo "$FLEET_JSON" | python3 -c "
import json,sys
d=json.load(sys.stdin)
h=d['hub']
exp=d.get('expected_firmware','7.0.0.0')
fw=h.get('firmware') or ''
ok=fw.startswith('7.0.0')
print('hub_online', h.get('online'))
print('hub_firmware', fw, 'expected', exp, 'match', ok)
print('surface', d.get('surface'))
print('inventory_in_service', [r['seat_id'] for r in d.get('inventory',[]) if r.get('in_service')])
pots=d.get('pots',{})
for k,v in sorted(pots.items()):
    print(k, 'online', v.get('online'), 'fw', v.get('firmware'), 'moisture', v.get('values',{}).get('moisture_pct'))
pot3=[r for r in d.get('inventory',[]) if r.get('seat_id')=='pot3']
if pot3 and pot3[0].get('in_service'):
    print('WARN: pot3 still in_service — F-003 gate')
sys.exit(0 if h.get('online') else 1)
" || FAIL=1
fi

echo "--- critical ingest ---"
if [ -f /opt/dsc-hub-repo/brain/scripts/audit_hub_ingest.py ]; then
  echo "$PASS" | sudo -S docker cp /opt/dsc-hub-repo/brain/scripts/audit_hub_ingest.py dsc-hub-brain:/tmp/audit_hub_ingest.py 2>/dev/null || true
  echo "$PASS" | sudo -S docker exec -e PYTHONPATH=/app dsc-hub-brain python /tmp/audit_hub_ingest.py --critical-only || FAIL=1
fi

echo "--- SPA bundle ---"
echo "$PASS" | sudo -S docker exec dsc-hub-brain sh -c "grep -oE 'assets/index-[^\"]+\\.js' /app/static/index.html | head -1" || FAIL=1

if [ "$FAIL" -eq 0 ]; then
  echo "OK: island-proof automated checks passed"
else
  echo "FAIL: island-proof — see items above"
  exit 1
fi
