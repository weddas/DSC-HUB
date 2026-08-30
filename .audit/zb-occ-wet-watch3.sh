#!/bin/bash
echo "Watching 3 SNZB-03 for 120s — dunk after clear if needed"
echo Digital | sudo -S docker exec dsc-hub-mosquitto mosquitto_sub -v \
  -t "zigbee2mqtt/0xa4c1380d734f2033" \
  -t "zigbee2mqtt/0xa4c138b9e2b9b690" \
  -t "zigbee2mqtt/0xa4c1385a686af7df" \
  -W 120 2>/dev/null
echo "=== done ==="