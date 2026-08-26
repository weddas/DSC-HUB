#!/bin/bash
# Automated island-proof checks (operator still confirms Nest/HA automations off).
set -eu

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
curl -sf "${BASE}/health" | tee /tmp/dsc-health.json
echo

FLEET=$(curl -sf "${BASE}/fleet")
echo "$FLEET" | python3 -c "
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
