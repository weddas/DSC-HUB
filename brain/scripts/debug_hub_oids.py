"""One-shot: list hub ESPHome object_ids (run on Pi brain container)."""
import asyncio

from dsc_brain.native_api import make_api_client
from dsc_brain.settings import list_inventory


async def main() -> None:
    inv = {r["seat_id"]: r for r in list_inventory()}
    hub = inv.get("hub", {})
    host = hub.get("host") or "10.42.0.10"
    key = hub.get("api_key") or ""
    client = make_api_client(host, key)
    await client.connect(login=True)
    states: dict[int, object] = {}

    def on_state(state: object) -> None:
        states[state.key] = state  # type: ignore[attr-defined]

    client.subscribe_states(on_state)
    await asyncio.sleep(6.0)
    entities, _services = await client.list_entities_services()
    key_to_object = {ent.key: str(ent.object_id) for ent in entities if hasattr(ent, "key")}
    needles = ("temp", "humid", "vpd", "room", "clone", "window", "espnow", "esp_now", "heartbeat", "uptime", "root")
    print("=== object_ids ===")
    for oid in sorted(set(key_to_object.values())):
        if any(n in oid for n in needles):
            print(oid)
    print("=== state keys with values ===")
    for key_id, st in sorted(states.items()):
        oid = key_to_object.get(key_id, "?")
        if any(n in oid for n in needles):
            print(f"{oid}: {getattr(st, 'state', None)}")
    print("=== binary map misses (entity exists, no state) ===")
    from dsc_brain.hub_controls import HUB_BINARY_OID_TO_ENTITY

    for oid, eid in HUB_BINARY_OID_TO_ENTITY.items():
        keys = [k for k, v in key_to_object.items() if v == oid]
        if not keys:
            continue
        key_id = keys[0]
        if key_id not in states:
            print(f"MISSING STATE {oid} -> {eid}")
    await client.disconnect()


if __name__ == "__main__":
    asyncio.run(main())
