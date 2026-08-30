#!/bin/bash
echo "=== WAITER ==="
pgrep -af '/tmp/zb-waiter.run' || echo 'no waiter'
tail -8 /tmp/zb-waiter.log 2>/dev/null
echo "=== DEVICES/HEALTH ==="
curl -s http://127.0.0.1:8787/settings/zigbee/devices; echo
curl -s http://127.0.0.1:8787/settings/zigbee/health; echo
echo "=== Z2M RECENT ==="
printf '%s\n' Digital | sudo -S docker logs dsc-hub-z2m --tail 30 2>&1 | grep -iE 'interview|joined|device|Successfully|permit|error|IEEE' | tail -20
echo "=== BACKUPS ==="
printf '%s\n' Digital | sudo -S ls -la /var/lib/dsc-hub/z2m/ 2>/dev/null | head -20
printf '%s\n' Digital | sudo -S find /var/lib/dsc-hub /opt -name '*coordinator*' -o -name '*backup*' 2>/dev/null | head -30
echo "=== FLEET ==="
python3 <<'PY'
import json,urllib.request
f=json.load(urllib.request.urlopen('http://127.0.0.1:8787/fleet',timeout=8))
print('canopy', f.get('canopy'))
print('by_role', list(((f.get('system') or {}).get('zigbee_by_role') or {}).keys()))
print('spa')
print(urllib.request.urlopen('http://127.0.0.1:8787/',timeout=5).read().decode().split('src="')[1].split('"')[0])
PY