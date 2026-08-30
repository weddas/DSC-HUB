#!/bin/bash
set -euo pipefail
echo Digital | sudo -S docker exec dsc-hub-brain python3 -c '
from dsc_brain.compose_store import get_helper, get_roster_slots
from dsc_brain.plant_probe import migrate_legacy_plant_ids, ensure_plant_uuid
print("migrate", migrate_legacy_plant_ids())
for n in (1,2,3,4):
    print("ensure", n, ensure_plant_uuid(n))
for k in (
 "text.dsc_probe1_assigned_plant_id","text.dsc_probe2_assigned_plant_id",
 "text.dsc_probe3_assigned_plant_id","text.dsc_probe4_assigned_plant_id",
):
    print(k, get_helper(k, ""))
for s in get_roster_slots():
    print("slot", s.get("slot"), "plant_uuid", s.get("plant_uuid"), "name", s.get("name") or s.get("plant_name") or s.get("nickname"))
'
echo "=== long poll ==="
tail -5 /tmp/zb-long.out 2>/dev/null || true
pgrep -af 'zb-long|zb-waiter' || true
curl -s http://127.0.0.1:8787/settings/zigbee/health; echo
# uptime since radio
python3 - <<'PY'
import json,urllib.request,time
h=json.loads(urllib.request.urlopen("http://127.0.0.1:8787/settings/zigbee/health").read())
# bridge_state_updated_at is epoch seconds
t=h.get("bridge_state_updated_at") or 0
print("bridge_age_s", round(time.time()-float(t),1), "radio_up", h.get("radio_up"), "end", h.get("end_device_count"))
PY
