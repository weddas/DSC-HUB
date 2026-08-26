#!/bin/bash
# Snapshot critical Pi dash fields — run hourly during 24h soak.
set -eu

BASE="${1:-http://127.0.0.1:8787}"
STAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
OUT="${2:-/tmp/dsc-soak-$STAMP.json}"

curl -sf "${BASE}/fleet" | python3 -c "
import json,sys,urllib.request
d=json.load(sys.stdin)
h=d.get('hub',{})
v=h.get('values',{})
ctrl=v.get('controls',{})
def fan_pct(k):
    c=ctrl.get(k,{})
    return c.get('percentage')
try:
    comp=json.load(urllib.request.urlopen('${BASE}/fleet/computed'))
    alerts=(comp.get('hass_extras') or {}).get('sensor.dsc_active_alert_count',{}).get('state')
except Exception:
    alerts=None
out={
  'ts': '$STAMP',
  'hub_online': h.get('online'),
  'hub_fw': h.get('firmware'),
  'temp_c': v.get('temp_c'),
  'rh_pct': v.get('rh_pct'),
  'countdowns': {k:v[k] for k in v if 'countdown' in k},
  'fans': {
    'intake_main': fan_pct('fan.dsc_hub_4_inch_intake_fan_main'),
    'intake_2x4': fan_pct('fan.dsc_hub_4_inch_intake_fan_2x4'),
    'ex_room': fan_pct('fan.dsc_hub_6_inch_exhaust_room'),
    'ex_out': fan_pct('fan.dsc_hub_6_inch_exhaust_outside'),
  },
  'demands': {
    k: ctrl[k].get('state') for k in ctrl if k.startswith('switch.dsc_hub_') and 'demand' in k
  },
  'relays': d.get('system',{}).get('relays',{}),
  'alerts': alerts,
}
# silent-zero guard: fans online but all 0 while hub online
if out['hub_online'] and out['fans']['intake_main'] == 0 and out['fans']['ex_out'] == 0:
    out['warn'] = 'fans_all_zero'
json.dump(out, sys.stdout, indent=2)
" > "$OUT"

echo "soak snapshot: $OUT"
cat "$OUT"
