#!/bin/bash
# Hourly soak check — appends fleet truth to the soak log (T+24h gate for SOAK-2026-08-26).
LOG=/var/lib/dsc-hub/soak-2026-08-26.log
TS=$(date -u +%Y-%m-%dT%H:%M:%SZ)
H=$(curl -sf --max-time 10 http://127.0.0.1:8787/health | tr -d '\n' | head -c 200)
F=$(curl -sf --max-time 10 http://127.0.0.1:8787/fleet | python3 -c "
import json, sys
f = json.load(sys.stdin)
s = f.get('sonoffs', {})
on = [k for k, v in s.items() if v.get('online')]
relays = ','.join(k + '=' + str(int(bool(v))) for k, v in f['system']['relays'].items())
print('hub=%s panel=%s sonoffs=%d/4 link=%s relays=%s' % (
    f['hub']['online'], f['panel']['online'], len(on),
    f['system']['appliance_link'], relays))
" 2>/dev/null)
echo "$TS $F health=$H" >> "$LOG"
