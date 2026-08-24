#!/usr/bin/env python3
"""Clear hub preferred WiFi BSSID and turn off Lock WiFi AP via Native API."""
from __future__ import annotations

import asyncio
import os
import sys

HUB = os.environ.get("HUB_HOST", "10.42.0.10")
KEY = os.environ.get("HUB_KEY") or os.environ.get("DSC_HUB_API_KEY", "")
if not KEY and os.path.isfile("/tmp/hub_key.txt"):
    KEY = open("/tmp/hub_key.txt", encoding="utf-8").read().strip()


async def main() -> None:
    if not KEY:
        print("HUB_KEY missing", file=sys.stderr)
        sys.exit(1)
    from aioesphomeapi import APIClient

    client = APIClient(HUB, 6053, noise_psk=KEY)
    await client.connect(login=True)
    info = await client.device_info()
    print("device", info.name, info.esphome_version)

    entities, _ = await client.list_entities_services()
    clear_key = None
    lock_key = None
    pref_key = None
    for ent in entities:
        oid = str(getattr(ent, "object_id", ""))
        cls = type(ent).__name__
        if "clear_preferred_wifi" in oid:
            clear_key = ent.key
        if oid == "lock_wifi_ap" or oid == "wifi_ap_lock":
            lock_key = ent.key
        if "preferred_wifi" in oid and "Text" in cls:
            pref_key = ent.key

    print("clear_key", clear_key, "lock_key", lock_key, "pref_key", pref_key)

    if lock_key is not None:
        client.switch_command(lock_key, False)
        print("lock_wifi_ap OFF")

    if clear_key is not None:
        client.button_command(clear_key)
        print("clear_preferred_wifi_ap pressed")
    elif pref_key is not None:
        client.text_command(pref_key, "")
        print("preferred_wifi_bssid cleared")
    else:
        print("no clear target found", file=sys.stderr)
        sys.exit(1)

    await asyncio.sleep(2)
    await client.disconnect()
    print("done")


if __name__ == "__main__":
    asyncio.run(main())
