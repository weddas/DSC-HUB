#!/bin/bash
for i in $(seq 1 8); do
  H=$(curl -s http://127.0.0.1:8787/settings/zigbee/health)
  END=$(python3 -c "import json,sys; print(json.loads(sys.argv[1]).get('end_device_count',0))" "$H")
  echo "$(date -Is) poll=$i end=$END" | tee -a /tmp/zb4m.out
  if [ "$END" != "0" ]; then
    curl -s http://127.0.0.1:8787/settings/zigbee/devices | tee -a /tmp/zb4m.out
    bash /tmp/zb-integrate.run 2>&1 | tee -a /tmp/zb4m.out
    exit 0
  fi
  sleep 30
done
echo still_zero | tee -a /tmp/zb4m.out
exit 2