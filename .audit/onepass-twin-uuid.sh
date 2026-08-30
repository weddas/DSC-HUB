#!/bin/bash
python3 <<'PY'
import json, urllib.request

def get(url):
    return json.loads(urllib.request.urlopen(url, timeout=12).read().decode())

f = get("http://127.0.0.1:8787/fleet?include_hass=true")
hub = f.get("hub") or {}
vals = hub.get("values") or {}
print("hub_online", hub.get("online"))
print("twin_vals", {k: vals[k] for k in vals if "twin" in k or "sf1000" in k})
hs = f.get("hass_states") or {}
for k in sorted(hs):
    if "twin" in k or "sf1000" in k:
        print(k, hs[k].get("state") if isinstance(hs[k], dict) else hs[k])
print("by_role", (f.get("system") or {}).get("zigbee_by_role"))
print("canopy", f.get("canopy"))

c = get("http://127.0.0.1:8787/fleet/computed")
ex = c.get("hass_extras") or {}
for k in sorted(ex):
    if any(x in k for x in ("twin", "sf1000", "canopy", "zigbee")):
        row = ex[k]
        print("EXTRA", k, row.get("state") if isinstance(row, dict) else row)

s = get("http://127.0.0.1:8787/settings")
keys = [k for k in s if any(x in k for x in ("roster", "plant", "compose"))]
print("settings_keys", keys)
PY

printf '%s\n' Digital | sudo -S docker exec dsc-hub-brain python3 -c '
from dsc_brain.compose_store import get_roster_slots, export_settings_snapshot
slots = get_roster_slots()
print("SLOTS", [(s.get("slot"), s.get("status"), s.get("plant_uuid")) for s in slots if s.get("plant_uuid") or s.get("status")=="active"])
snap = export_settings_snapshot()
print("snap_roster_count", len(snap.get("roster_slots") or []))
print("uuid_sample", [s.get("plant_uuid") for s in (snap.get("roster_slots") or []) if s.get("plant_uuid")][:3])
'
