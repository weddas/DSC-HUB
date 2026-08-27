#!/bin/bash
# Hourly soak check — append fleet truth to the soak log (T+24h gate).
# No set -e: keep logging when Brain or fleet is briefly down.
LOG="${SOAK_LOG:-/var/lib/dsc-hub/soak-$(date -u +%Y-%m-%d).log}"
ALERT_LOG="${SOAK_ALERT_LOG:-/var/lib/dsc-hub/soak-alerts.log}"
BASE="${1:-http://127.0.0.1:8787}"
TS=$(date -u +%Y-%m-%dT%H:%M:%SZ)

mkdir -p "$(dirname "$LOG")" "$(dirname "$ALERT_LOG")"

H="$(curl -sf --max-time 10 "${BASE}/health" 2>/dev/null | tr -d '\n' | head -c 200 || echo health_fail)"
F="$(curl -sf --max-time 10 "${BASE}/fleet" 2>/dev/null | python3 -c "
import json, sys
f = json.load(sys.stdin)
s = f.get('sonoffs', {})
on = [k for k, v in s.items() if v.get('online')]
relays = ','.join(k + '=' + str(int(bool(v))) for k, v in f['system']['relays'].items())
print('hub=%s panel=%s sonoffs=%d/4 link=%s relays=%s' % (
    f['hub']['online'], f['panel']['online'], len(on),
    f['system']['appliance_link'], relays))
" 2>/dev/null || echo fleet_fail)"

LINE="$TS $F health=$H"
echo "$LINE" >> "$LOG"

SONOFF_COUNT="$(echo "$F" | sed -n 's/.*sonoffs=\([0-9]*\)\/4.*/\1/p')"
if [ -n "$SONOFF_COUNT" ] && [ "$SONOFF_COUNT" -lt 4 ]; then
  echo "ALERT: sonoffs=${SONOFF_COUNT}/4 at $TS" | tee -a "$ALERT_LOG" >&2
fi

COMPUTED_MS="$(curl -sf --max-time 15 -o /dev/null -w '%{time_total}' "${BASE}/fleet/computed" 2>/dev/null || echo fail)"
COMPUTED_MS_INT="$(echo "$COMPUTED_MS" | awk '{printf "%.0f", $1 * 1000}')"
if [ "$COMPUTED_MS" != "fail" ] && [ "$COMPUTED_MS_INT" -gt 3000 ] 2>/dev/null; then
  echo "ALERT: /fleet/computed ${COMPUTED_MS_INT}ms > 3000ms at $TS" | tee -a "$ALERT_LOG" >&2
fi

echo "soak snapshot: $LOG"
tail -1 "$LOG"
