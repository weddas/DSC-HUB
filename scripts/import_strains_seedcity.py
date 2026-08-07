#!/usr/bin/env python3
"""Import Seed City CC0 strain dataset (Hugging Face CSV) → local dump."""

from __future__ import annotations

import csv
import io
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from catalog_common import DATA, fetch_text, name_norm, write_dump, parse_grow_fields  # noqa: E402

OUT = DATA / "dsc_strains_seedcity.json"
URLS = [
    "https://huggingface.co/datasets/JonusNattapong/cannabis-strains/resolve/main/cannabis-strains-final.csv",
    "https://huggingface.co/datasets/JonusNattapong/cannabis-strains/resolve/main/cannabis-strains.csv",
]


def main() -> int:
    text = None
    used = None
    errors = []
    for url in URLS:
        try:
            text = fetch_text(url, timeout=180)
            used = url
            break
        except Exception as exc:  # noqa: BLE001
            errors.append(f"{url}: {exc}")
    if not text:
        print("Seed City import failed:\n " + "\n ".join(errors))
        return 1

    reader = csv.DictReader(io.StringIO(text))
    items = []
    for r in reader:
        name = str(
            r.get("strain_name") or r.get("name") or r.get("strain") or r.get("title") or ""
        ).strip()
        if not name:
            continue
        row = {k: (v.strip() if isinstance(v, str) else v) for k, v in r.items()}
        row["name"] = name
        row["name_norm"] = name_norm(name)
        # Map common seed-city fields
        if row.get("indica_sativa") or row.get("type") or row.get("strain_type"):
            row["type"] = row.get("indica_sativa") or row.get("type") or row.get("strain_type")
        breeder = row.get("breeder") or row.get("seed_bank") or row.get("brand")
        if breeder:
            row["breeder"] = breeder
        # grow fields when present
        for src, dst in (
            ("flowering_time", "flowering_days"),
            ("flowering_days", "flowering_days"),
            ("height", "height_cm"),
            ("plant_height", "height_cm"),
        ):
            if row.get(src) and not row.get(dst):
                row[dst] = row[src]
        # Parse free-text growth blocks into typed grow fields when possible
        blob = " ".join(
            str(row.get(k) or "")
            for k in ("growth_and_harvest", "overview", "description", "experience")
        )
        if blob.strip():
            props = parse_grow_fields(blob)
            for k, v in props.items():
                if k not in row or row[k] in (None, "", [], {}):
                    row[k] = v
        row["source"] = "seedcity_hf_cc0"
        items.append(row)

    write_dump(
        OUT,
        "strains",
        items,
        source="seedcity",
        source_url=used,
        license="CC0-1.0",
        redistributable=True,
        errors=errors,
    )
    print(f"wrote {OUT} count={len(items)} from {used}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
