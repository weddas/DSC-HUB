#!/usr/bin/env python3
"""Discover + import additional open strain/lab datasets (GitHub / research portals)."""

from __future__ import annotations

import csv
import io
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from catalog_common import DATA, fetch_text, name_norm, write_dump  # noqa: E402

DISCOVERY_OUT = DATA / "dsc_dataset_discovery.json"

# Curated discovery list — importers fetch what is reachable.
SOURCES = [
    {
        "id": "kushy_mit",
        "name": "Kushy cannabis-dataset (strains)",
        "url": "https://github.com/kushyapp/cannabis-dataset",
        "license": "MIT",
        "redistributable": True,
        "importer": "import_strains_kushy.py",
    },
    {
        "id": "maxvalue_terpenes",
        "name": "MaxValue Terpene Profile Parser results",
        "url": "https://github.com/MaxValue/Terpene-Profile-Parser-for-Cannabis-Strains",
        "license": "open/research (see repo)",
        "redistributable": True,
        "importer": "import_lab_terpenes_maxvalue.py",
    },
    {
        "id": "grow_data_wikileaf",
        "name": "Loyal9-Elements/grow_data Wikileaf CSV",
        "url": "https://github.com/Loyal9-Elements/grow_data",
        "license": "MIT",
        "redistributable": True,
        "importer": "import_strains_wikileaf.py",
        "already": True,
    },
    {
        "id": "seedcity_cc0",
        "name": "JonusNattapong Cannabis-Strains (Seed City)",
        "url": "https://github.com/JonusNattapong/Cannabis-Strains",
        "license": "CC0-1.0",
        "redistributable": True,
        "importer": "import_strains_seedcity.py / import_local_db_dump.py",
        "already": True,
    },
    {
        "id": "cannlytics_hf",
        "name": "Cannlytics cannabis_results (HF)",
        "url": "https://huggingface.co/datasets/cannlytics/cannabis_results",
        "license": "CC-BY-4.0",
        "redistributable": True,
        "importer": "import_lab_terpenes_cannlytics.py",
        "already": True,
    },
    {
        "id": "openthc_vdb",
        "name": "OpenTHC Variety Database",
        "url": "https://vdb.openthc.org/download/strains.json",
        "license": "OpenTHC open",
        "redistributable": True,
        "importer": "import_strains_openthc.py",
        "already": True,
    },
    {
        "id": "mendeley_effects_chem",
        "name": "Mendeley: 800+ strains subjective effects + chemistry",
        "url": "https://data.mendeley.com/datasets/6zwcgrttkp/1",
        "license": "see Mendeley dataset card",
        "redistributable": False,
        "note": "Manual download / DOI gate — listed for follow-up, not auto-fetched",
        "skip": True,
    },
    {
        "id": "connecticut_open_data_terpenes",
        "name": "Connecticut Open Data cannabis lab/terpene (via Cannlytics talks)",
        "url": "https://data.ct.gov/",
        "license": "public open data",
        "redistributable": True,
        "note": "Portal search required; CT subsets often already in Cannlytics HF",
        "skip": True,
    },
    {
        "id": "strain_data_project",
        "name": "Strain Data Project terpene research",
        "url": "https://straindataproject.org/research",
        "license": "unknown",
        "redistributable": False,
        "note": "Research site; no clear bulk CSV URL found — follow-up",
        "skip": True,
    },
]


def try_ethan_holleman() -> Path | None:
    """Best-effort: Leafly processed CSV if a known raw URL exists."""
    urls = [
        "https://raw.githubusercontent.com/ethanholleman/ethanholleman.github.io/master/posts/leafly_data/leafly_strains.csv",
        "https://ethanholleman.com/posts/leafly_data/data.csv",
    ]
    for url in urls:
        try:
            text = fetch_text(url, timeout=60)
            if "strain" not in text.lower()[:500] and "name" not in text.lower()[:200]:
                continue
            reader = csv.DictReader(io.StringIO(text))
            items = []
            for r in reader:
                name = str(r.get("name") or r.get("strain") or r.get("Strain") or "").strip()
                if not name:
                    continue
                row = {k: v for k, v in r.items() if v not in (None, "")}
                row["name"] = name
                row["name_norm"] = name_norm(name)
                row["source"] = "ethan_holleman_leafly"
                items.append(row)
            if not items:
                continue
            out = DATA / "dsc_strains_ethan_leafly.json"
            write_dump(
                out,
                "strains",
                items,
                source="ethan_holleman",
                source_url=url,
                license="research scrape mirror",
                redistributable=False,
            )
            print(f"ethan_holleman: {len(items)} from {url}")
            return out
        except Exception as exc:  # noqa: BLE001
            print(f"ethan skip {url}: {exc}")
    return None


def main() -> int:
    DATA.mkdir(parents=True, exist_ok=True)
    write_dump(
        DISCOVERY_OUT,
        "dataset_discovery",
        SOURCES,
        source="n087_public_discovery",
        note="Catalog of public/research datasets for N-087 expansion",
        redistributable=True,
    )
    print(f"wrote discovery {DISCOVERY_OUT} count={len(SOURCES)}")
    try_ethan_holleman()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
