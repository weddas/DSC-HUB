#!/usr/bin/env python3
"""Import Kushy open cannabis strain CSV (MIT) → local dump."""

from __future__ import annotations

import csv
import io
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from catalog_common import DATA, fetch_text, name_norm, write_dump  # noqa: E402

OUT = DATA / "dsc_strains_kushy.json"
URL = (
    "https://raw.githubusercontent.com/kushyapp/cannabis-dataset/master/"
    "Dataset/Strains/strains-kushy_api.2017-11-14.csv"
)


def _fnum(val: str | None) -> float | None:
    if val in (None, "", "NULL", "null"):
        return None
    try:
        return float(str(val).replace("%", "").strip())
    except ValueError:
        return None


def _strip_html(text: str) -> str:
    return re.sub(r"<[^>]+>", " ", text or "").strip()


def main() -> int:
    errors: list[str] = []
    try:
        text = fetch_text(URL, timeout=180)
    except Exception as exc:  # noqa: BLE001
        print(f"Kushy import failed: {exc}")
        return 1

    items: list[dict] = []
    for r in csv.DictReader(io.StringIO(text)):
        name = str(r.get("name") or "").strip()
        if not name or name.upper() == "NULL":
            continue
        row = {k: v for k, v in r.items() if v not in (None, "", "NULL")}
        row["name"] = name
        row["name_norm"] = name_norm(name)
        if row.get("type"):
            row["type"] = str(row["type"]).lower()
        if row.get("breeder"):
            row["breeder"] = row["breeder"]
        if row.get("description"):
            row["description"] = _strip_html(str(row["description"]))
        chem = {}
        thc = _fnum(r.get("thc"))
        cbd = _fnum(r.get("cbd"))
        if thc is not None:
            chem["thc_range"] = [thc, thc]
            row["thc_range"] = [thc, thc]
        if cbd is not None:
            chem["cbd_range"] = [cbd, cbd]
            row["cbd_range"] = [cbd, cbd]
        for key in ("thca", "thcv", "cbda", "cbdv", "cbn", "cbg", "cbc"):
            v = _fnum(r.get(key))
            if v is not None:
                chem[key] = v
        if chem:
            row["chemistry"] = chem
        row["source"] = "kushy"
        items.append(row)

    write_dump(
        OUT,
        "strains",
        items,
        source="kushy",
        source_url=URL,
        license="MIT",
        redistributable=True,
        note="kushyapp/cannabis-dataset strains CSV",
        errors=errors,
    )
    print(f"wrote {OUT} count={len(items)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
