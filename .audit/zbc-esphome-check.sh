#!/bin/bash
# Poll the ESPHome venv provisioning + dashboard, then prove the brain routes to it
# and can run a COMPILE-ONLY job (no OTA — flashing a live seat is the operator's call).
set -uo pipefail
PW="${1:-}"
MODE="${2:-check}"   # check | compile
s() { echo "$PW" | sudo -S "$@" 2>/dev/null; }
B=http://127.0.0.1:8787

echo "=== units: venv-setup=$(systemctl is-active dsc-esphome-venv-setup.service 2>/dev/null) dashboard=$(systemctl is-active dsc-esphome-dashboard.service 2>/dev/null)"
s journalctl -u dsc-esphome-venv-setup.service --no-pager -n 3 2>/dev/null | tail -3
ls -la /opt/dsc-esphome-venv/bin/esphome 2>/dev/null || echo "venv esphome binary not present yet"
if [ -x /opt/dsc-esphome-venv/bin/esphome ]; then
  echo "=== venv esphome: $(PLATFORMIO_CORE_DIR=/var/lib/dsc-hub/platformio /opt/dsc-esphome-venv/bin/esphome version 2>/dev/null | head -1)"
  if ! systemctl is-active --quiet dsc-esphome-dashboard.service; then
    echo "=== starting dashboard unit"; s systemctl restart dsc-esphome-dashboard.service; sleep 6
  fi
  echo "=== dashboard :6052/version -> $(curl -s -m 8 http://127.0.0.1:6052/version || echo unreachable)"
  echo "=== :6052 listener: $(ss -ltnp 2>/dev/null | grep ':6052' | head -1)"
  s docker ps --format '{{.Names}}' 2>/dev/null | grep -q dsc-hub-esphome && echo "legacy container still running!" || echo "no legacy dsc-hub-esphome container"
  echo "=== point brain at the host dashboard (host.docker.internal resolves to 172.17.0.1 in the brain container)"
  python3 - <<'PY'
import json, urllib.request
body = json.dumps({"settings": {"esphome_dashboard_api": "http://host.docker.internal:6052"}}).encode()
req = urllib.request.Request('http://127.0.0.1:8787/settings', data=body, headers={'Content-Type': 'application/json'}, method='PATCH')
try:
    print('settings patch http', urllib.request.urlopen(req, timeout=15).status)
except Exception as exc:
    print('settings patch failed', exc)
PY
  curl -s -m 20 "$B/settings/esphome/toolchain?refresh=true" | python3 -c "import json,sys; d=json.load(sys.stdin); print('toolchain', {k:d.get(k) for k in ('installed','latest','min_version','meets_min','build_backend','dashboard_api','update_available')})"
  if [ "$MODE" = "compile" ]; then
    echo "=== compile-only job for pot2 via the brain (no upload)"
    python3 - <<'PY'
import json, urllib.request, time
req = urllib.request.Request('http://127.0.0.1:8787/settings/esphome/jobs', data=json.dumps({"seat_id": "pot2", "action": "compile"}).encode(),
                             headers={'Content-Type': 'application/json'}, method='POST')
try:
    r = json.load(urllib.request.urlopen(req, timeout=20)); print('queued', json.dumps(r)[:300])
except Exception as exc:
    print('queue failed', exc); raise SystemExit
deadline = time.time() + 1500
last = ''
while time.time() < deadline:
    jobs = json.load(urllib.request.urlopen('http://127.0.0.1:8787/settings/esphome/jobs', timeout=20)).get('jobs', [])
    mine = [j for j in jobs if j.get('seat_id') == 'pot2' and j.get('action') == 'compile']
    if not mine:
        print('job vanished'); break
    j = sorted(mine, key=lambda x: x.get('created_at', 0))[-1]
    line = f"{j.get('status')} {str(j.get('detail') or '')[-160:]!r}"
    if line != last:
        print(time.strftime('%H:%M:%S'), line); last = line
    if j.get('status') in ('done', 'ok', 'success', 'failed', 'error'):
        break
    time.sleep(20)
PY
  fi
fi
