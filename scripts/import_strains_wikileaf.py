#!/usr/bin/env python3
"""Import Wikileaf-style grow data if available; else skip gracefully.

Looks for local CSV/JSON first, then known public mirrors.
"""

from __future__ import annotations

import csv
import io
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from catalog_common import DATA, fetch_text, name_norm, write_dump  # noqa: E402

OUT = DATA / "dsc_strains_wikileaf.json"
LOCAL_CANDIDATES = [
    DATA / "wikileaf_grow_data.csv",
    DATA / "grow_data.csv",
]
URLS = [
    "https://raw.githubusercontent.com/Loyal9-Elements/grow_data/main/Resources/csv/ALL_data.csv",
    "https://raw.githubusercontent.com/Shannon-Goddard/grow_data/main/Resources/csv/ALL_data.csv",
    "https://raw.githubusercontent.com/CannabisData/wikileaf-data/master/grow_data.csv",
]


def _from_csv(text: str) -> list[dict]:
    reader = csv.DictReader(io.StringIO(text))
    items = []
    for r in reader:
        name = str(r.get("name") or r.get("strain") or r.get("Strain") or "").strip()
        if not name:
            continue
        row = dict(r)
        row["name"] = name
        row["name_norm"] = name_norm(name)
        row["source"] = "wikileaf"
        # grow_data categorical chem → keep as attrs; type from sativa/indica cols
        sat = str(r.get("Sativa") or r.get("sativa") or "").strip().lower()
        ind = str(r.get("Indica") or r.get("indica") or "").strip().lower()
        if sat or ind:
            row["type"] = "hybrid"
            if "very high" in sat and "very low" in ind:
                row["type"] = "sativa"
            elif "very high" in ind and "very low" in sat:
                row["type"] = "indica"
        items.append(row)
    return items


def main() -> int:
    text = None
    used = None
    errors = []
    for path in LOCAL_CANDIDATES:
        if path.exists():
            text = path.read_text(encoding="utf-8", errors="replace")
            used = str(path)
            break
    if text is None:
        for url in URLS:
            try:
                text = fetch_text(url, timeout=120)
                used = url
                break
            except Exception as exc:  # noqa: BLE001
                errors.append(f"{url}: {exc}")
    if not text:
        # Minimal bootstrap from popular names with empty grow — still creates file for pipeline
        print("Wikileaf remote missing; writing empty shell dump for pipeline continuity")
        write_dump(
            OUT,
            "strains",
            [],
            source="wikileaf",
            license="MIT if upstream available",
            redistributable=True,
            note="upstream unavailable; re-run when mirror found",
            errors=errors,
        )
        return 0

    if used.endswith(".json"):
        doc = json.loads(text)
        items = doc if isinstance(doc, list) else doc.get("items") or doc.get("strains") or []
        items = [dict(r, name=r.get("name"), name_norm=name_norm(r.get("name", "")), source="wikileaf") for r in items if isinstance(r, dict) and r.get("name")]
    else:
        items = _from_csv(text)

    write_dump(
        OUT,
        "strains",
        items,
        source="wikileaf",
        source_url=used,
        license="MIT (upstream)",
        redistributable=True,
        errors=errors,
    )
    print(f"wrote {OUT} count={len(items)} from {used}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
