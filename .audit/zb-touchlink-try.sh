#!/bin/bash
# Touchlink factory-reset attempt + keep join open + watch joins
set -euo pipefail
SUDO="sudo -n"
# fallback password sudo if needed
if ! $SUDO true 2>/dev/null; then
  SUDO="sudo -S"
  echo Digital | $SUDO true >/dev/null
  SUDO="sudo -n"
fi

curl -s -X POST http://127.0.0.1:8787/settings/zigbee/permit-join \
  -H 'Content-Type: application/json' \
  -d '{"enabled":true,"duration_s":254}' ; echo

Z2M=$(echo Digital | sudo -S docker ps --format '{{.Names}}' 2>/dev/null | grep -iE 'z2m|zigbee' | head -1)
MQTT=$(echo Digital | sudo -S docker ps --format '{{.Names}}' 2>/dev/null | grep -i mosq | head -1)
echo "z2m=$Z2M mqtt=$MQTT"

if [ -n "$MQTT" ]; then
  echo "=== touchlink scan ==="
  echo Digital | sudo -S docker exec "$MQTT" mosquitto_pub -h 127.0.0.1 -t zigbee2mqtt/bridge/request/touchlink/scan -m '{}' || true
  sleep 10
  echo "=== touchlink factory_reset ==="
  echo Digital | sudo -S docker exec "$MQTT" mosquitto_pub -h 127.0.0.1 -t zigbee2mqtt/bridge/request/touchlink/factory_reset -m '{}' || true
fi

for i in $(seq 1 24); do
  h=$(curl -s http://127.0.0.1:8787/settings/zigbee/health)
  n=$(python3 -c "import json,sys; print(json.load(sys.stdin).get('end_device_count',0))" <<<"$h")
  echo "$(date -Iseconds) end=$n"
  if [ "$n" != "0" ]; then
    curl -s http://127.0.0.1:8787/settings/zigbee/devices; echo
    bash /tmp/zb-integrate.run || true
    exit 0
  fi
  curl -s -X POST http://127.0.0.1:8787/settings/zigbee/permit-join \
    -H 'Content-Type: application/json' \
    -d '{"enabled":true,"duration_s":254}' >/dev/null || true
  sleep 5
done

echo "=== z2m recent ==="
echo Digital | sudo -S docker logs "$Z2M" --tail 120 2>&1 | tail -80
echo "=== touchlink / join lines ==="
echo Digital | sudo -S docker logs "$Z2M" --tail 250 2>&1 | grep -iE 'touchlink|interview|join|factory|Successfully' | tail -50 || true
exit 1
