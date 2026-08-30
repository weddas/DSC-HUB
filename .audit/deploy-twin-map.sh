#!/bin/bash
PW=Digital
echo "$PW" | sudo -S docker cp /tmp/hub_controls.py dsc-hub-brain:/app/dsc_brain/hub_controls.py
echo "$PW" | sudo -S docker cp /tmp/esphome_client.py dsc-hub-brain:/app/dsc_brain/esphome_client.py
echo "$PW" | sudo -S timeout 8 docker kill -s KILL dsc-hub-brain || true
sleep 1
echo "$PW" | sudo -S timeout 20 docker start dsc-hub-brain
sleep 10
python3 <<'PY'
import json,urllib.request,time
time.sleep(3)
c=json.load(urllib.request.urlopen('http://127.0.0.1:8787/fleet/computed', timeout=8))
e=c.get('hass_extras') or {}
hits=[k for k in e if 'twin' in k or 'sf1000' in k]
print('hits', hits)
for k in sorted(hits):
  row=e[k]; print(k, row.get('state') if isinstance(row,dict) else row)
f=json.load(urllib.request.urlopen('http://127.0.0.1:8787/fleet', timeout=8))
ctrl=(f.get('hub') or {}).get('values',{}).get('controls') or {}
print('controls_twin', ctrl.get('light.dsc_hub_twin_sf1000'))
print('controls_clone', ctrl.get('light.dsc_hub_sf1000_dimmer'))
print('hub_online', f['hub'].get('online'), f['hub'].get('firmware'))
PY