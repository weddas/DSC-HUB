#!/bin/bash
set -euo pipefail
echo Digital | sudo -S docker exec dsc-hub-brain python3 -c '
from dsc_brain.compose_store import get_helper, set_helper, get_roster_slots
from dsc_brain.plant_probe import ensure_plant_uuid
from dsc_brain.settings import list_inventory, upsert_inventory
# Ensure helpers for kit probes match roster UUIDs
for n in (1, 2):
    pid = ensure_plant_uuid(n)
    key = f"text.dsc_probe{n}_assigned_plant_id"
    cur = get_helper(key, "")
    if cur != pid:
        set_helper(key, pid)
        print("set", key, pid)
    else:
        print("ok", key, pid)
# sync inventory extra if present
for row in list_inventory():
    seat = str(row.get("seat_id") or row.get("id") or "")
    if seat in ("pot1", "pot2"):
        n = 1 if seat == "pot1" else 2
        pid = ensure_plant_uuid(n)
        extra = dict(row.get("extra") or {})
        if extra.get("assigned_plant_id") != pid:
            extra["assigned_plant_id"] = pid
            upsert_inventory({**row, "extra": extra})
            print("inventory", seat, pid)
        else:
            print("inventory_ok", seat, pid)
print("done", [(s.get("slot"), s.get("plant_uuid")) for s in get_roster_slots() if s.get("slot") in (1,2)])
'
