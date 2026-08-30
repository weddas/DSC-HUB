#!/bin/bash
set -e
PW=Digital
echo "$PW" | sudo -S docker cp /tmp/zigbee_mqtt.py dsc-hub-brain:/app/dsc_brain/zigbee_mqtt.py
echo "$PW" | sudo -S docker cp /tmp/esphome_client.py dsc-hub-brain:/app/dsc_brain/esphome_client.py
# Prefer graceful reload; fall back to timed kill/start (never bare kill).
echo "$PW" | sudo -S timeout 15 docker restart dsc-hub-brain || {
  echo "$PW" | sudo -S timeout 8 docker kill -s KILL dsc-hub-brain || true
  sleep 1
  echo "$PW" | sudo -S timeout 20 docker start dsc-hub-brain
}
for i in 1 2 3 4 5 6 7 8 9 10; do
  if curl -sf -m 3 http://127.0.0.1:8787/health >/dev/null; then
    echo "brain up after ${i}s"
    break
  fi
  sleep 2
done
curl -s -m 8 http://127.0.0.1:8787/health | python3 -c 'import sys,json; d=json.load(sys.stdin); print("health", d.get("version"), d.get("zigbee"))'
# prove canopy survives ESPHome poll window (~10s)
curl -s -m 8 -X PUT http://127.0.0.1:8787/settings/zigbee/bindings \
  -H 'Content-Type: application/json' \
  -d '{"bindings":{"0xqa001234567890ab":{"role":"canopy_4x8","zone":"4x8","enabled":true,"friendly_name":"qa_canopy","alias":"QA"}}}'
echo
echo "$PW" | sudo -S docker exec dsc-hub-mosquitto mosquitto_pub -h 127.0.0.1 -t 'zigbee2mqtt/qa_canopy' -m '{"temperature":27.7,"humidity":59.0}'
sleep 2
python3 <<'PY'
import json,urllib.request,time
for i in range(8):
  f=json.load(urllib.request.urlopen('http://127.0.0.1:8787/fleet',timeout=8))
  c=f.get('canopy') or {}
  br=(f.get('system') or {}).get('zigbee_by_role')
  print(f't+{i*2}s canopy_temp={c.get("temp_c")} by_role={bool(br)} zkeys={[k for k in (f.get("system") or {}) if "zigbee" in k][:4]}')
  time.sleep(2)
PY
curl -s -m 5 -X POST http://127.0.0.1:8787/settings/zigbee/permit-join \
  -H 'Content-Type: application/json' -d '{"enabled":true,"duration_s":120}'; echo
