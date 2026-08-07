#!/usr/bin/env python3
"""Print dump counts / blockers for N-087 status."""
from __future__ import annotations

import json
from pathlib import Path

DATA = Path(__file__).resolve().parents[1] / "homeassistant" / "data"


def main() -> None:
    paths = sorted(DATA.glob("dsc_strains_*.json")) + sorted(DATA.glob("dsc_lab_*.json"))
    for p in paths:
        try:
            d = json.loads(p.read_text(encoding="utf-8"))
        except Exception as exc:  # noqa: BLE001
            print(f"{p.name}: READ_FAIL {exc}")
            continue
        items = d.get("items") or []
        blockers = d.get("blockers") or []
        auth = d.get("auth_needed") or []
        note = str(d.get("note") or "")[:90]
        print(
            f"{p.name}: count={d.get('count', len(items))} items={len(items)} "
            f"blockers={len(blockers)} auth={len(auth)}"
        )
        for a in (auth or blockers)[:3]:
            print(f"  ! {a}")
        if len(items) == 0 and note:
            print(f"  note={note}")


if __name__ == "__main__":
    main()
