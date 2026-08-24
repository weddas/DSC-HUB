#!/bin/bash
set -eu
KEY=$(echo Digital | sudo -S cat /opt/dsc-hub/.env | grep '^DSC_HUB_API_KEY=' | cut -d= -f2- | tr -d '\r\n')
export HUB_KEY="$KEY"
export HUB_HOST="10.42.0.10"

if [ -z "$HUB_KEY" ]; then
  echo "HUB_KEY missing from /opt/dsc-hub/.env" >&2
  exit 1
fi

printf '%s' "$HUB_KEY" > /tmp/hub_key.txt

echo Digital | sudo -S docker cp /tmp/clear_hub_wifi_pref.py dsc-hub-brain:/tmp/clear_hub_wifi_pref.py
echo Digital | sudo -S docker cp /tmp/hub_key.txt dsc-hub-brain:/tmp/hub_key.txt
echo Digital | sudo -S docker exec -e HUB_HOST="$HUB_HOST" dsc-hub-brain python /tmp/clear_hub_wifi_pref.py

sleep 5
curl -s http://127.0.0.1:8787/fleet | python3 -c "import sys,json; d=json.load(sys.stdin); h=d.get('hub',{}); print('hub online', h.get('online'), 'fw', h.get('firmware')); hs=d.get('hass_states',{}); print('hub_link', hs.get('binary_sensor.dsc_hub_link',{}).get('state')); print('appliance_link', hs.get('binary_sensor.dsc_pi_appliance_link',{}).get('state'))"
