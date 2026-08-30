#!/bin/bash
PW=Digital
echo "== hub reachability =="
ping -c 2 -W 2 10.42.0.10 || true
# SoftAP interface?
ip -br addr | head -20
echo "$PW" | sudo -S docker ps --filter name=esphome --format '{{.Names}} {{.Status}}'
# If hub answers, attempt OTA (long) with timeout wrapper
if ping -c 1 -W 2 10.42.0.10 >/dev/null 2>&1; then
  echo "$PW" | sudo -S docker cp /tmp/dsc-hub-v4_0.yaml dsc-hub-esphome:/config/dsc-hub.yaml
  echo "$PW" | sudo -S timeout 240 docker exec -w /config dsc-hub-esphome esphome run dsc-hub.yaml --device 10.42.0.10 --no-logs 2>&1 | tee /tmp/twin-ota.log | grep -E 'ERROR|Successfully|Twin SF1000|Uploading|FAILED|Took|INFO Compiling' | tail -40
  echo EXIT:$?
  # re-check entities after brief wait
  sleep 5
  curl -s -m 5 http://127.0.0.1:8787/fleet | python3 -c 'import sys,json; f=json.load(sys.stdin); print("online",f["hub"].get("online"),"fw",f["hub"].get("firmware")); print([k for k in (f["hub"].get("values") or {}) if "twin" in k.lower() or "sf1000" in k.lower()][:20])'
else
  echo HUB_UNREACHABLE
fi
# radio still up
curl -s -m 5 http://127.0.0.1:8787/health | python3 -c 'import sys,json; z=json.load(sys.stdin)["zigbee"]; print("radio",z["radio_up"],z["bridge_state"])'
