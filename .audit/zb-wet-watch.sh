#!/bin/bash
IEEE=0xa4c1380d734f2033
echo "Watching $IEEE for 90s — wet probes now (look for water_leak)"
echo Digital | sudo -S docker exec dsc-hub-mosquitto mosquitto_sub -v -t "zigbee2mqtt/$IEEE" -W 90 2>/dev/null
echo "=== done ==="