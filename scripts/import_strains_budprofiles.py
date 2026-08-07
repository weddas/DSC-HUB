#!/usr/bin/env python3
"""Import BudProfiles / similar public strain APIs if live; else empty shell."""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from catalog_common import DATA, fetch_json, name_norm, write_dump  # noqa: E402

OUT = DATA / "dsc_strains_budprofiles.json"
URLS = [
    "https://budprofiles.com/api/strains",
    "https://api.budprofiles.com/strains",
]


def main() -> int:
    items: list[dict] = []
    used = None
    errors = []
    for url in URLS:
        try:
            doc = fetch_json(url, timeout=60)
            rows = doc if isinstance(doc, list) else doc.get("strains") or doc.get("data") or []
            if not rows:
                errors.append(f"{url}: empty")
                continue
            used = url
            for r in rows:
                if not isinstance(r, dict):
                    continue
                name = str(r.get("name") or r.get("strain") or "").strip()
                if not name:
                    continue
                row = dict(r)
                row["name"] = name
                row["name_norm"] = name_norm(name)
                row["source"] = "budprofiles"
                items.append(row)
            break
        except Exception as exc:  # noqa: BLE001
            errors.append(f"{url}: {exc}")

    write_dump(
        OUT,
        "strains",
        items,
        source="budprofiles",
        source_url=used,
        license="upstream ToS / research scrape",
        redistributable=False,
        note="live API preferred; empty if offline",
        errors=errors,
    )
    print(f"wrote {OUT} count={len(items)} from {used or 'none'}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
