from dsc_brain.compose_store import get_helper
from dsc_brain.settings import list_inventory, upsert_inventory

for pot_n in (1, 2):
    aid = get_helper(f"text.dsc_probe{pot_n}_assigned_plant_id", "") or ""
    seat = f"pot{pot_n}"
    rows = [r for r in list_inventory() if r.get("seat_id") == seat]
    if not rows:
        print("missing", seat)
        continue
    extra = dict(rows[0].get("extra") or {})
    before = extra.get("assigned_plant_id")
    if aid and before != aid:
        extra["assigned_plant_id"] = aid
        upsert_inventory(seat, {"extra": extra})
        print("synced", seat, before, "->", aid)
    else:
        print("ok", seat, "assigned_plant_id=", before or aid)
