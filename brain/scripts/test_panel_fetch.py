#!/usr/bin/env python3
import asyncio

from dsc_brain.esphome_client import _fetch_device


async def main() -> None:
    out = await _fetch_device("10.42.0.11", "", "panel", "control")
    print(out)


if __name__ == "__main__":
    asyncio.run(main())
