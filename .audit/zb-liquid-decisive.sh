#!/bin/bash
echo "DECISIVE: submerged + untouched 120s"
echo "If occupancy stays true underwater = liquid signal (not PIR)"
echo "If occupancy clears to false underwater = PIR timeout"
echo Digital | sudo -S docker exec dsc-hub-mosquitto mosquitto_sub -v \
  -t "zigbee2mqtt/0xa4c1380d734f2033" \
  -t "zigbee2mqtt/0xa4c138b9e2b9b690" \
  -t "zigbee2mqtt/0xa4c1385a686af7df" \
  -W 120 2>/dev/null
echo "=== done ==="