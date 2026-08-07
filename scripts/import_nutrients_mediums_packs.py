#!/usr/bin/env python3
"""Seed nutrient/medium research rows from curated YAML packs into dump JSON."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from catalog_common import DATA, name_norm, write_dump  # noqa: E402

try:
    import yaml
except ImportError:
    yaml = None  # type: ignore


def pack_to_items(path: Path, keys: tuple[str, ...]) -> list[dict]:
    if not path.exists() or not yaml:
        return []
    doc = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
    rows = []
    for key in keys:
        for row in doc.get(key) or []:
            if isinstance(row, dict) and row.get("name"):
                r = dict(row)
                r["name_norm"] = name_norm(r["name"])
                rows.append(r)
    return rows


def main() -> int:
    nutes = pack_to_items(DATA / "dsc_nutrient_pack_canna_coco.yaml", ("products", "bottles"))
    nutes += pack_to_items(DATA / "dsc_nutrient_catalog.yaml", ("products", "nutrients"))
    write_dump(
        DATA / "dsc_nutrients_pack_seed.json",
        "nutrients",
        nutes,
        source="curated_packs",
        redistributable=True,
        license="DSC curated / manufacturer labels",
    )
    print(f"nutrients {len(nutes)}")

    meds = pack_to_items(DATA / "dsc_medium_pack_canna_coco.yaml", ("products", "mediums"))
    write_dump(
        DATA / "dsc_mediums_pack_seed.json",
        "mediums",
        meds,
        source="curated_packs",
        redistributable=True,
        license="DSC curated / manufacturer labels",
    )
    print(f"mediums {len(meds)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
