#!/bin/bash
for i in 1 2 3 4 5 6; do
  H=$(curl -s http://127.0.0.1:8787/settings/zigbee/health)
  END=$(python3 -c "import json,sys; print(json.loads(sys.argv[1]).get('end_device_count',0))" "$H")
  echo "$(date -Is) poll=$i end=$END"
  if [ "$END" != "0" ]; then
    curl -s http://127.0.0.1:8787/settings/zigbee/devices
    echo
    bash /tmp/zb-integrate.run || true
    exit 0
  fi
  sleep 30
done
echo "still_zero"
exit 2