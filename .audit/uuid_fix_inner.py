from dsc_brain.compose_store import get_roster_slots, get_helper
from dsc_brain.plant_probe import migrate_legacy_plant_ids, ensure_plant_uuid

slots = get_roster_slots()
print("slots_before", len(slots))
for s in slots:
    print("before", {k: s.get(k) for k in ("slot", "status", "plant_uuid", "strain_id")})
for i in range(1, 5):
    print(f"helper_probe{i}", get_helper(f"text.dsc_probe{i}_assigned_plant_id", None))
print("migrate_rewritten", migrate_legacy_plant_ids())
for s in get_roster_slots():
    st = str(s.get("status") or "")
    if st not in ("empty", "", "unknown", "unavailable") and not str(s.get("plant_uuid") or "").strip():
        print("force_uuid", ensure_plant_uuid(int(s["slot"])))
for s in get_roster_slots():
    print("after", s.get("slot"), s.get("status"), s.get("plant_uuid"))
