#!/bin/bash
PW=Digital
echo "$PW" | sudo -S docker cp /tmp/plant_probe.py dsc-hub-brain:/app/dsc_brain/plant_probe.py
echo "$PW" | sudo -S docker exec dsc-hub-brain python3 -c "from dsc_brain.plant_probe import migrate_legacy_plant_ids, ensure_plant_uuid; print(migrate_legacy_plant_ids()); print(ensure_plant_uuid(1)); print(ensure_plant_uuid(2))"
curl -s -m 5 http://127.0.0.1:8787/roster | python3 -c "import sys,json; r=json.load(sys.stdin).get('roster') or [];
[print(x.get('seat_id'), x.get('plant_uuid') or x.get('plant_id'), x.get('strain_id')) for x in r[:6]]"