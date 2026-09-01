import json
import urllib.request

BASE = "http://127.0.0.1:8787"


def get(path: str):
    with urllib.request.urlopen(BASE + path, timeout=30) as resp:
        return json.loads(resp.read().decode())


fleet = get("/fleet/computed")
extras = fleet.get("hass_extras") or fleet.get("extras") or {}
hits = {}
for k, v in extras.items():
    s = f"{k}={v}"
    if any(t in s.lower() for t in ("reduced", "pot3", "pot4", "offline", "planned_oos", "capacity")):
        hits[k] = v
print(json.dumps({"honesty_hits": hits, "sample_keys": list(extras.keys())[:30]}, indent=2))
core = get("/journal/core?limit=8")
print("core_notes", [e.get("note") for e in core.get("entries", [])[:8]])
room = get("/journal/room/grow_room?limit=8")
print("room_notes", [e.get("note") for e in room.get("entries", [])[:8]])
