#!/bin/bash
curl -s -m 20 -X POST http://127.0.0.1:8787/ai/soft-cal-advice -H 'Content-Type: application/json' -d '{"seat_id":"pot1"}' | python3 -c 'import sys,json; d=json.load(sys.stdin); print("ok",d.get("ok")); print((d.get("narrative") or "")[:200])'
# plant uuids
printf '%s\n' Digital | sudo -S docker exec dsc-hub-brain python3 -c "from dsc_brain.compose_store import get_roster_slots; print([(s.get('slot'),s.get('plant_uuid')) for s in get_roster_slots() if s.get('plant_uuid')])"
curl -s -m 5 http://127.0.0.1:8787/settings/zigbee/health
echo