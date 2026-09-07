#!/bin/bash
# Read a Sonoff's PHYSICAL main_relay state straight from its ESPHome native API
# (inside the brain container: aioesphomeapi + inventory api_key), independent of
# the brain's polling — which stops for out-of-service seats.
# usage: bash zbc-sonoff-state.sh <pw> [seat_id ...]   -> "<seat> relay=on|off" per seat
set -uo pipefail
PW="${1:-}"; shift || true
SEATS="${*:-heatmat}"
cat > /tmp/zbc-sonoff-state.py <<'PY'
import asyncio, sys
from dsc_brain.settings import list_inventory
from dsc_brain.native_api import make_api_client
from dsc_brain.appliance_driver import _api_key_for   # same key resolution as the driver

async def read(seat: str) -> str:
    row = next((r for r in list_inventory() if r.get("seat_id") == seat), None)
    if not row or not row.get("host"):
        return f"{seat} no inventory host"
    key = _api_key_for(seat, row)
    client = make_api_client(row["host"], key or "")
    try:
        await asyncio.wait_for(client.connect(login=True), timeout=8)
        entities, _ = await client.list_entities_services()
        relay_key = next((int(e.key) for e in entities if str(getattr(e, "object_id", "")) == "main_relay"), None)
        got = {}
        def cb(state):
            if getattr(state, "key", None) == relay_key and hasattr(state, "state"):
                got["on"] = bool(state.state)
        client.subscribe_states(cb)
        for _ in range(40):
            if "on" in got:
                break
            await asyncio.sleep(0.1)
        if "on" in got:
            return f"{seat} relay={'on' if got['on'] else 'off'}"
        return f"{seat} relay=unknown (no state within 4 s; relay_key={relay_key})"
    except Exception as exc:
        return f"{seat} relay=error {type(exc).__name__}: {exc}"
    finally:
        try:
            await client.disconnect()
        except Exception:
            pass

async def main() -> None:
    for seat in sys.argv[1:]:
        print(await read(seat))

asyncio.run(main())
PY
echo "$PW" | sudo -S docker cp /tmp/zbc-sonoff-state.py dsc-hub-brain:/tmp/zbc-sonoff-state.py 2>/dev/null
echo "$PW" | sudo -S docker exec -w /app -e PYTHONPATH=/app dsc-hub-brain python /tmp/zbc-sonoff-state.py $SEATS 2>&1 | grep -v "password for"
