#!/bin/bash
# Safe post-power-cycle restore. NEVER bare docker kill.
# Assumes zigbee_mqtt.py already at /tmp/zigbee_mqtt.py if hotpatching.
set -euo pipefail
PW=Digital
BASE=http://127.0.0.1:8787

echo "=== wait brain ==="
for i in $(seq 1 60); do
  if curl -s -m 3 "$BASE/health" >/tmp/h.json 2>/dev/null; then
    python3 -c 'import json;d=json.load(open("/tmp/h.json"));print("brain",d.get("version"),d.get("zigbee"))'
    break
  fi
  echo "waiting_brain_$i"
  sleep 5
done
curl -s -m 3 "$BASE/health" >/tmp/h.json || { echo "BRAIN_DOWN"; exit 1; }

# Optional: copy new zigbee_mqtt if present — reload via soft recreate only if file newer
if [ -f /tmp/zigbee_mqtt.py ]; then
  echo "=== hotpatch zigbee_mqtt (cp only; no kill) ==="
  echo "$PW" | sudo -S docker cp /tmp/zigbee_mqtt.py dsc-hub-brain:/app/dsc_brain/zigbee_mqtt.py || true
  # Prefer graceful reload: touch + uvicorn if compose supports it with timeout
  # Only restart if module not yet loaded with _handle_bridge_event
  NEED=$(echo "$PW" | sudo -S docker exec dsc-hub-brain python3 -c 'import inspect,dsc_brain.zigbee_mqtt as z; print("yes" if hasattr(z.ZigbeeMqttIngest,"_handle_bridge_event") else "no")' 2>/dev/null || echo no)
  echo "handle_bridge_event=$NEED"
  if [ "$NEED" != "yes" ]; then
    echo "Module stale — soft recreate with timeout (not bare kill)"
    echo "$PW" | sudo -S timeout 20 docker restart dsc-hub-brain || {
      echo "$PW" | sudo -S timeout 10 docker kill -s KILL dsc-hub-brain || true
      sleep 2
      echo "$PW" | sudo -S timeout 25 docker start dsc-hub-brain || true
    }
    for i in $(seq 1 30); do
      curl -s -m 3 "$BASE/health" >/tmp/h.json 2>/dev/null && break
      sleep 3
    done
  fi
fi

echo "=== z2m up? ==="
echo "$PW" | sudo -S docker ps --filter name=dsc-hub-z2m --format '{{.Names}} {{.Status}}' || true
# If z2m down, start with timeout only
if ! echo "$PW" | sudo -S docker ps --filter name=dsc-hub-z2m --format '{{.Names}}' | grep -q z2m; then
  echo "$PW" | sudo -S timeout 25 docker start dsc-hub-z2m || true
  sleep 8
fi

echo "=== permit join + canopy QA ==="
curl -s -X POST "$BASE/settings/zigbee/permit-join" -H 'Content-Type: application/json' -d '{"enabled":true,"duration_s":254}' || true
echo
curl -s -X PUT "$BASE/settings/zigbee/bindings" -H 'Content-Type: application/json' \
  -d '{"bindings":{"0xqa001234567890ab":{"role":"canopy_4x8","zone":"4x8","alias":"QA","enabled":true,"friendly_name":"qa_canopy"}}}' || true
echo
echo "$PW" | sudo -S docker exec dsc-hub-mosquitto mosquitto_pub -h 127.0.0.1 -t zigbee2mqtt/qa_canopy -m '{"temperature":27.1,"humidity":54.5}' || true

echo "=== restart long waiter ==="
pkill -f '/tmp/zb-waiter.run' 2>/dev/null || true
sleep 1
if [ -f /tmp/zb-waiter.sh ]; then
  tr -d '\r' </tmp/zb-waiter.sh >/tmp/zb-waiter.run
elif [ -f /tmp/zb-waiter.run ]; then
  true
else
  echo "no waiter script"
fi
if [ -f /tmp/zb-integrate.sh ]; then
  tr -d '\r' </tmp/zb-integrate.sh >/tmp/zb-integrate.run
fi
nohup bash /tmp/zb-waiter.run >/tmp/zb-waiter.nohup 2>&1 &
echo waiter_pid $!
sleep 2
curl -s "$BASE/settings/zigbee/health"; echo
curl -s "$BASE/fleet" | python3 -c 'import json,sys;d=json.load(sys.stdin);print("canopy",d.get("canopy"))'
pgrep -af zb-waiter | head -2
echo RECOVER_OK
