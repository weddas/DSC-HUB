#!/bin/bash
set -euo pipefail
IEEE=0xa4c138b9e2b9b690
BASE=http://127.0.0.1:8787
FNAME=0xa4c138b9e2b9b690
pub(){ echo Digital | sudo -S docker exec dsc-hub-mosquitto mosquitto_pub -t "zigbee2mqtt/$FNAME" -m "$1"; }
echo "=== LIVE WET ==="
pub '{"occupancy":true}'
sleep 2
curl -sf $BASE/fleet | python3 -c "import json,sys; d=json.load(sys.stdin).get('system') or {}; ps=(d.get('zigbee_policy_state') or {}).get('$IEEE') or {}; print('live_problem', ps.get('problem'), 'problem_when', ps.get('problem_when')); print('banners', d.get('critical_banners'))"
curl -sf $BASE/settings/inventory | python3 -c "import json,sys; d=json.load(sys.stdin); rows=d if isinstance(d,list) else d.get('inventory') or []; [print('humidifier in_service', r.get('in_service')) for r in rows if r.get('seat_id')=='dehumidifier']" 2>/dev/null || true
echo "=== LIVE DRY ==="
pub '{"occupancy":false}'
sleep 2
curl -sf $BASE/fleet | python3 -c "import json,sys; d=json.load(sys.stdin).get('system') or {}; ps=(d.get('zigbee_policy_state') or {}).get('$IEEE') or {}; print('live_problem_after_dry', ps.get('problem')); print('banners', d.get('critical_banners'))"