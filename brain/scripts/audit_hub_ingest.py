"""Compare live hub ESPHome object_ids vs brain ingest maps."""
import argparse
import asyncio
import os
from collections import defaultdict

from dsc_brain.hub_controls import (
    HUB_BINARY_OID_TO_ENTITY,
    HUB_FAN_OID_TO_ENTITY,
    HUB_LIGHT_OID_TO_ENTITY,
    HUB_NUMBER_OID_TO_ENTITY,
    HUB_SELECT_OID_TO_ENTITY,
    HUB_SENSOR_OID_TO_KEY,
    HUB_SWITCH_OID_TO_ENTITY,
    HUB_TEXT_SENSOR_OID_TO_KEY,
)
from dsc_brain.native_api import make_api_client
from dsc_brain.settings import list_inventory

ALL_MAPS: dict[str, dict[str, str]] = {
    "sensor": HUB_SENSOR_OID_TO_KEY,
    "switch": HUB_SWITCH_OID_TO_ENTITY,
    "number": HUB_NUMBER_OID_TO_ENTITY,
    "fan": HUB_FAN_OID_TO_ENTITY,
    "light": HUB_LIGHT_OID_TO_ENTITY,
    "select": HUB_SELECT_OID_TO_ENTITY,
    "binary": HUB_BINARY_OID_TO_ENTITY,
    "text": HUB_TEXT_SENSOR_OID_TO_KEY,
}
KNOWN = {oid for m in ALL_MAPS.values() for oid in m}

# Operational entities — silent drops here break the dash.
CRITICAL_OID_FRAGMENTS = (
    "_demand",
    "grow_mat_demand",
    "growmat_demand",
    "fire_countdown",
    "firmware_version",
    "fan__",
    "fan_intake",
    "fan_exhaust",
    "emergency_failsafe",
    "climate_sensor_fault",
    "tent_full_auto",
    "auto_photoperiod",
    "sf1000",
    "main_window",
    "clone_window",
    "priority_tent",
)


def is_critical_oid(oid: str) -> bool:
    return any(frag in oid for frag in CRITICAL_OID_FRAGMENTS)


async def main() -> None:
    parser = argparse.ArgumentParser(description="Audit hub ESPHome ingest coverage")
    parser.add_argument(
        "--critical-only",
        action="store_true",
        help="Only report unmapped object_ids that match operational fragments",
    )
    args = parser.parse_args()

    inv = {r["seat_id"]: r for r in list_inventory()}
    hub = inv.get("hub", {})
    host = hub.get("host") or os.environ.get("DSC_HUB_HOST")
    key = hub.get("api_key") or os.environ.get("DSC_HUB_API_KEY", "")
    client = make_api_client(host, key or "")
    await client.connect(login=True)
    states: dict[int, object] = {}

    def on_state(state: object) -> None:
        states[state.key] = state  # type: ignore[attr-defined]

    client.subscribe_states(on_state)
    await asyncio.sleep(8.0)
    entities, _services = await client.list_entities_services()
    by_kind: dict[str, list[str]] = defaultdict(list)
    key_to_object: dict[int, str] = {}
    for ent in entities:
        if not hasattr(ent, "key") or not hasattr(ent, "object_id"):
            continue
        oid = str(ent.object_id)
        key_to_object[int(ent.key)] = oid
        kind = type(ent).__name__.replace("EntityInfo", "").lower()
        by_kind[kind].append(oid)

    title = "CRITICAL unmapped hub entities" if args.critical_only else "UNMAPPED hub entities (likely silent data loss)"
    print(f"=== {title} ===")
    found = False
    for kind in sorted(by_kind):
        unmapped = sorted(oid for oid in by_kind[kind] if oid not in KNOWN)
        if args.critical_only:
            unmapped = [oid for oid in unmapped if is_critical_oid(oid)]
        if not unmapped:
            continue
        found = True
        print(f"\n-- {kind} ({len(unmapped)}) --")
        for oid in unmapped:
            key_id = next((k for k, v in key_to_object.items() if v == oid), None)
            st = states.get(key_id) if key_id is not None else None
            val = getattr(st, "state", "NO_STATE") if st else "NO_STATE"
            print(f"  {oid} -> {val}")

    if args.critical_only and not found:
        print("(none — all critical object_ids are mapped)")

    print("\n=== MAPPED but NO STATE this poll ===")
    for oid in sorted(KNOWN):
        keys = [k for k, v in key_to_object.items() if v == oid]
        if not keys:
            continue
        if keys[0] not in states:
            print(f"  {oid}")

    await client.disconnect()


if __name__ == "__main__":
    asyncio.run(main())
