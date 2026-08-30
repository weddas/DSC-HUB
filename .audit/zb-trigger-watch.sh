#!/bin/bash
echo "Watching SNZB-03 candidates for 50s — trigger the device now"
echo Digital | sudo -S docker exec dsc-hub-mosquitto mosquitto_sub -v -t 'zigbee2mqtt/0xa4c138b9e2b9b690' -t 'zigbee2mqtt/0xa4c1385a686af7df' -t 'zigbee2mqtt/+/availability' -W 50 2>/dev/null | head -80
echo "=== done ==="