#!/bin/bash
# Re-arm join + confirm forever waiter + dump quick audit
set -euo pipefail
curl -s -X POST http://127.0.0.1:8787/settings/zigbee/permit-join \
  -H 'Content-Type: application/json' \
  -d '{"enabled":true,"duration_s":254}'; echo
curl -s http://127.0.0.1:8787/settings/zigbee/health; echo
# ensure forever waiter alive
if ! pgrep -f 'zb-forever.run' >/dev/null; then
  nohup bash /tmp/zb-forever.run >>/tmp/zb-forever.log 2>&1 &
  echo "restarted forever pid=$!"
else
  echo "forever ok pid=$(pgrep -f 'zb-forever.run' | head -1)"
fi
# CH340 identity
echo Digital | sudo -S udevadm info -q all -n /dev/ttyUSB1 2>/dev/null | grep -E 'ID_MODEL|ID_VENDOR|ID_SERIAL|DEVLINKS' | head -20 || true
# quick evidence slice
python3 <<'PY'
import json,urllib.request
B='http://127.0.0.1:8787'
def get(p):
  try:
    return json.loads(urllib.request.urlopen(B+p,timeout=8).read())
  except Exception as e:
    return {'_err':str(e)}
h=get('/settings/zigbee/health')
f=get('/fleet')
print('zb', {k:h.get(k) for k in ('radio_up','end_device_count','permit_join','device_count')})
can=f.get('canopy') or {}
print('canopy', {k:can.get(k) for k in ('temp_c','humidity','role','friendly_name','source')})
rs=f.get('root_steering') or (f.get('system') or {}).get('root_steering')
print('root_steering_keys', list(rs.keys())[:8] if isinstance(rs,dict) else type(rs))
inv=f.get('inventory') or []
pots=[i for i in inv if isinstance(i,dict) and str(i.get('seat_id') or i.get('role') or '').startswith('pot')]
print('pots', [(p.get('seat_id'), p.get('in_service'), p.get('assigned_plant_id')) for p in pots])
PY
curl -s -X POST http://127.0.0.1:8787/ai/soft-cal-advice -H 'Content-Type: application/json' -d '{"probe":1,"dry_raw":100,"wet_raw":800}' | head -c 200; echo
curl -s -X POST http://127.0.0.1:8787/control/irrigation/shot -H 'Content-Type: application/json' -d '{"probe":1,"duration_s":1}' | head -c 200; echo
