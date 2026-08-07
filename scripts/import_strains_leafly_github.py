#!/usr/bin/env python3
"""Import UberJoe / Kaggle Leafly cannabis.csv mirror → local dump (remote)."""

from __future__ import annotations

import csv
import io
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from catalog_common import DATA, fetch_text, name_norm, write_dump  # noqa: E402

OUT = DATA / "dsc_strains_leafly_github.json"
URLS = [
    "https://cdn.jsdelivr.net/gh/UberJoe83/Cannabis-Recommendation-System@master/cannabis.csv",
    "https://raw.githubusercontent.com/UberJoe83/Cannabis-Recommendation-System/master/cannabis.csv",
]


def main() -> int:
    text = None
    used = None
    errors = []
    for url in URLS:
        try:
            text = fetch_text(url, timeout=120)
            used = url
            break
        except Exception as exc:  # noqa: BLE001
            errors.append(f"{url}: {exc}")
    if not text:
        print("Leafly github import failed:\n " + "\n ".join(errors))
        return 1

    items = []
    for r in csv.DictReader(io.StringIO(text)):
        name = str(r.get("Strain") or r.get("strain") or "").strip()
        if not name:
            continue
        display = name.replace("-", " ") if re.fullmatch(r"[A-Za-z0-9]+(?:-[A-Za-z0-9]+)+", name) else name
        row = {
            "name": display,
            "name_norm": name_norm(display),
            "type": r.get("Type") or r.get("type"),
            "rating": r.get("Rating"),
            "effects": r.get("Effects") or r.get("effects"),
            "flavor": r.get("Flavor") or r.get("flavor"),
            "description": r.get("Description") or r.get("description"),
            "source": "leafly_github",
        }
        items.append(row)

    write_dump(
        OUT,
        "strains",
        items,
        source="leafly_github",
        source_url=used,
        license="Kaggle cannabis.csv mirror / Leafly-derived; research-only",
        redistributable=False,
        errors=errors,
    )
    print(f"wrote {OUT} count={len(items)} from {used}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
