#!/usr/bin/env python3
"""Wave 3 summary counts."""
from __future__ import annotations

import json
import sqlite3
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "homeassistant" / "data"
ST = ROOT / "brain" / "data" / "staging"


def main() -> None:
    print("=== DUMPS ===")
    for p in sorted(DATA.glob("dsc_lights_*.json")):
        d = json.loads(p.read_text(encoding="utf-8"))
        rows = d.get("products") or d.get("items") or []
        cov = d.get("coverage") or {
            "wattage_w": sum(1 for r in rows if r.get("wattage_w") is not None),
            "ppfd_maps": sum(1 for r in rows if r.get("ppfd_maps")),
            "spectrum_maps": sum(1 for r in rows if r.get("spectrum_maps")),
            "beam_maps": sum(1 for r in rows if r.get("beam_maps")),
            "datasheets": sum(1 for r in rows if r.get("datasheets")),
        }
        print(
            f"{p.name}: count={d.get('count', len(rows))} "
            f"watt={cov.get('wattage_w')} ppfd={cov.get('ppfd_maps')} "
            f"spec={cov.get('spectrum_maps')} beam={cov.get('beam_maps')} "
            f"datasheet={cov.get('datasheets')} bytes={p.stat().st_size}"
        )

    print("=== STAGING ===")
    paths = sorted(ST.glob("lights_*.sqlite3")) + [
        ST / "ppfd_maps.sqlite3",
        ST / "nutrients_pack_seed.sqlite3",
        ST / "mediums_pack_seed.sqlite3",
    ]
    for p in paths:
        if not p.exists():
            continue
        c = sqlite3.connect(str(p))

        def q(sql: str):
            try:
                return c.execute(sql).fetchone()[0]
            except Exception:
                return None

        print(
            f"{p.name}: light={q('select count(*) from light_fixture')} "
            f"raw={q('select count(*) from raw_record')} "
            f"media={q('select count(*) from media_asset')} "
            f"gaps={q('select count(*) from followup_gap')} "
            f"nute={q('select count(*) from nutrient_product')} "
            f"med={q('select count(*) from medium_product')}"
        )
        c.close()

    media = list((DATA / "media" / "ppfd").glob("*"))
    crops = list((DATA / "media" / "ppfd").glob("*_crop.png"))
    print(f"=== MEDIA ppfd files={len(media)} crops={len(crops)} ===")
    pack = yaml.safe_load((DATA / "dsc_light_pack_photometrics.yaml").read_text(encoding="utf-8"))
    print(f"photometrics pack fixtures={len(pack.get('fixtures') or [])}")
    tents = DATA / "dsc_tents_vivosun.json"
    if tents.exists():
        td = json.loads(tents.read_text(encoding="utf-8"))
        print(f"dsc_tents_vivosun.json count={td.get('count')}")


if __name__ == "__main__":
    main()
