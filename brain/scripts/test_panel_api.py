#!/usr/bin/env python3
import asyncio
from dsc_brain.native_api import make_api_client


async def main() -> None:
    c = make_api_client("10.42.0.11", "")
    await c.connect(login=True)
    info = await c.device_info()
    print("device_info", info)
    await c.disconnect()


if __name__ == "__main__":
    asyncio.run(main())
