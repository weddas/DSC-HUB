#!/bin/bash
PW=Digital
echo "$PW" | sudo -S bash -lc '
ls -l /dev/ttyACM* 2>/dev/null || echo no_ttyACM
ls -l /dev/serial/by-id/ 2>/dev/null || echo no_by_id
echo ---lsusb---
lsusb
echo ---dmesg---
dmesg | tail -60
echo ---z2m---
docker ps -a --filter name=z2m --format "{{.Names}} {{.Status}}"
echo ---compose device---
grep -n tty /opt/dsc-hub-repo/services/dsc-hub/docker-compose*.yml 2>/dev/null | head -20
grep -n ZIGBEE /opt/dsc-hub-repo/services/dsc-hub/.env 2>/dev/null || true
'
command -v universal-silabs-flasher || pip3 show universal-silabs-flasher 2>/dev/null | head -3 || echo NO_FLASHER
