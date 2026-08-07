#!/usr/bin/env python3
"""Create small synthetic/local MVP catalog dumps when they are absent.

Chemistry values are structured UI fixtures, not laboratory claims.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "homeassistant" / "data"

STRAINS = [
    ("Blue Dream", "hybrid"),
    ("Wedding Cake", "hybrid"),
    ("Gorilla Glue", "hybrid"),
    ("OG Kush", "hybrid"),
    ("Sour Diesel", "sativa"),
    ("Girl Scout Cookies", "hybrid"),
    ("Gelato", "hybrid"),
    ("Northern Lights", "indica"),
    ("White Widow", "hybrid"),
    ("Granddaddy Purple", "indica"),
    ("Jack Herer", "sativa"),
    ("Pineapple Express", "hybrid"),
    ("AK-47", "hybrid"),
    ("Amnesia Haze", "sativa"),
    ("Purple Haze", "sativa"),
    ("Zkittlez", "indica"),
    ("Runtz", "hybrid"),
    ("Do-Si-Dos", "indica"),
    ("Bruce Banner", "hybrid"),
    ("Durban Poison", "sativa"),
    ("Super Lemon Haze", "sativa"),
    ("Chemdawg", "hybrid"),
    ("Bubba Kush", "indica"),
    ("Trainwreck", "hybrid"),
    ("Maui Wowie", "sativa"),
    ("Strawberry Cough", "sativa"),
    ("Skywalker OG", "indica"),
    ("Critical Mass", "indica"),
    ("Blueberry", "indica"),
    ("Forbidden Fruit", "indica"),
    ("MAC 1", "hybrid"),
    ("Ice Cream Cake", "indica"),
    ("Gary Payton", "hybrid"),
    ("Apple Fritter", "hybrid"),
    ("Mimosa", "hybrid"),
    ("Sunset Sherbet", "hybrid"),
    ("Tangie", "sativa"),
    ("Acapulco Gold", "sativa"),
    ("Hindu Kush", "indica"),
    ("Green Crack", "sativa"),
]

CHEMISTRY = {
    "Blue Dream": ([17, 24], [0, 2], ["myrcene", "pinene", "caryophyllene"]),
    "Wedding Cake": ([20, 27], [0, 1], ["caryophyllene", "limonene", "myrcene"]),
    "Gorilla Glue": ([20, 28], [0, 1], ["caryophyllene", "myrcene", "limonene"]),
    "OG Kush": ([18, 26], [0, 1], ["myrcene", "limonene", "caryophyllene"]),
    "Sour Diesel": ([18, 26], [0, 1], ["caryophyllene", "limonene", "myrcene"]),
    "Girl Scout Cookies": ([19, 28], [0, 1], ["caryophyllene", "limonene", "humulene"]),
    "Gelato": ([20, 27], [0, 1], ["caryophyllene", "limonene", "myrcene"]),
    "Northern Lights": ([16, 21], [0, 1], ["myrcene", "caryophyllene", "limonene"]),
    "White Widow": ([16, 25], [0, 1], ["myrcene", "caryophyllene", "pinene"]),
    "Granddaddy Purple": ([17, 24], [0, 1], ["myrcene", "caryophyllene", "pinene"]),
    "Jack Herer": ([17, 24], [0, 1], ["terpinolene", "caryophyllene", "pinene"]),
    "Pineapple Express": ([18, 25], [0, 1], ["caryophyllene", "limonene", "myrcene"]),
    "Amnesia Haze": ([18, 25], [0, 1], ["myrcene", "caryophyllene", "limonene"]),
    "Zkittlez": ([18, 23], [0, 1], ["caryophyllene", "humulene", "limonene"]),
    "Durban Poison": ([17, 25], [0, 1], ["terpinolene", "myrcene", "ocimene"]),
    "Blueberry": ([16, 23], [0, 1], ["myrcene", "caryophyllene", "pinene"]),
}


def slug(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "_", value.lower()).strip("_")


def write_if_missing(name: str, payload: dict) -> None:
    path = DATA / name
    if path.exists():
        print(f"kept {path}")
        return
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"created {path}")


def main() -> int:
    DATA.mkdir(parents=True, exist_ok=True)
    products = []
    profiles = []
    for name, strain_type in STRAINS:
        row = {
            "id": f"mvp_{slug(name)}",
            "name": name,
            "type": strain_type,
            "source": "synthetic_mvp_fixture",
        }
        if name in CHEMISTRY:
            thc, cbd, terpenes = CHEMISTRY[name]
            chemistry = {
                "thc_range": thc,
                "cbd_range": cbd,
                "top_terpenes": terpenes,
                "synthetic": True,
            }
            row["chemistry"] = chemistry
            profiles.append({"name": name, "name_norm": name.lower(), **chemistry})
        products.append(row)

    write_if_missing(
        "dsc_strains_popular.json",
        {
            "schema_version": 1,
            "kind": "strains",
            "note": "MVP names; chemistry is synthetic UI fixture data, not lab guidance.",
            "products": products,
        },
    )
    write_if_missing(
        "dsc_lab_terpenes_mvp.json",
        {
            "schema_version": 1,
            "kind": "chemistry_profiles",
            "note": "Synthetic slim profiles for feature/index testing only.",
            "profiles": profiles,
        },
    )
    write_if_missing(
        "dsc_nutrients_canna.json",
        {
            "schema_version": 1,
            "products": [
                {"id": "canna_coco_a", "name": "CANNA Coco A", "brand": "CANNA", "category": "base", "dose_ml_l": 4.0},
                {"id": "canna_coco_b", "name": "CANNA Coco B", "brand": "CANNA", "category": "base", "dose_ml_l": 4.0},
                {"id": "canna_calmag_agent", "name": "CANNA CALMAG Agent", "brand": "CANNA", "category": "calmag", "dose_ml_l": 1.0},
            ],
        },
    )
    write_if_missing(
        "dsc_mediums_canna.json",
        {
            "schema_version": 1,
            "products": [
                {
                    "id": "canna_coco_professional_plus",
                    "name": "CANNA Coco Professional Plus",
                    "brand": "CANNA",
                    "category": "coco",
                    "composition_pct": {"coco": 100},
                }
            ],
        },
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
