#!/bin/bash
curl -s -m 5 -X POST http://127.0.0.1:8787/settings/zigbee/permit-join -H 'Content-Type: application/json' -d '{"enabled":true,"duration_s":300}'; echo
curl -s http://127.0.0.1:8787/settings/zigbee/devices; echo
printf '%s\n' Digital | sudo -S docker logs dsc-hub-z2m --tail 8 2>&1 | tail -8