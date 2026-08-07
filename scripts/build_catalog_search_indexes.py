#!/usr/bin/env python3
"""Build slim catalog search indexes for Build a Plant (/local/dsc-catalog/).

Metric-friendly fields only. Chemistry is limited to ranges and three terpene
names; no full lab blobs or invented photometrics. Caps keep payloads small.

Usage:
  python scripts/build_catalog_search_indexes.py
"""
from __future__ import annotations

import json
import re
import time
from pathlib import Path

try:
    import yaml
except ImportError:
    yaml = None  # type: ignore

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "homeassistant" / "data"
WWW = ROOT / "homeassistant" / "www" / "dsc-catalog"
DIST = ROOT / "dist" / "dsc-catalog"

STRAIN_CAP = 2500
NUTE_CAP = 1500
MEDIUM_CAP = 800
LIGHT_CAP = 800


def _slug(*parts: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "_", "_".join(parts).lower()).strip("_")
    return s[:80] or "unknown"


def _write(name: str, payload: dict) -> Path:
    WWW.mkdir(parents=True, exist_ok=True)
    DIST.mkdir(parents=True, exist_ok=True)
    text = json.dumps(payload, ensure_ascii=False, indent=2)
    out = WWW / name
    out.write_text(text, encoding="utf-8")
    (DIST / name).write_text(text, encoding="utf-8")
    return out


def _products(path: Path) -> list[dict]:
    if not path.exists():
        return []
    try:
        doc = json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return []
    if isinstance(doc, dict):
        return list(
            doc.get("products")
            or doc.get("strains")
            or doc.get("seeds")
            or doc.get("items")
            or []
        )
    if isinstance(doc, list):
        return doc
    return []


def build_strains() -> dict:
    rows: list[dict] = []
    seen: set[str] = set()

    def add(name: str, **extra) -> None:
        name = (name or "").strip()
        if not name:
            return
        key = name.lower()
        if key in seen:
            return
        seen.add(key)
        chemistry = extra.get("chemistry") if isinstance(extra.get("chemistry"), dict) else {}
        top_terpenes = chemistry.get("top_terpenes") or chemistry.get("terpenes") or []
        if isinstance(top_terpenes, dict):
            top_terpenes = list(top_terpenes)
        if not isinstance(top_terpenes, list):
            top_terpenes = []
        thc_range = chemistry.get("thc_range")
        cbd_range = chemistry.get("cbd_range")
        has_chemistry = bool(top_terpenes or thc_range or cbd_range)
        rows.append(
            {
                "id": extra.get("id") or _slug("strain", name),
                "name": name,
                "type": extra.get("type"),
                "breeder": extra.get("breeder"),
                "source": extra.get("source"),
                "has_chemistry": has_chemistry,
                "top_terpenes": top_terpenes[:3],
                "thc_range": thc_range,
                "cbd_range": cbd_range,
            }
        )

    # Prefer the merged dump because it carries chemistry and bank overlays.
    merged = DATA / "dsc_strains_merged.json"
    if merged.exists():
        try:
            doc = json.loads(merged.read_text(encoding="utf-8"))
            for row in doc.get("seeds") or doc.get("strains") or doc.get("products") or []:
                if len(rows) >= STRAIN_CAP:
                    break
                if isinstance(row, dict):
                    add(
                        row.get("name"),
                        id=row.get("id"),
                        type=row.get("type") or row.get("lineage"),
                        breeder=row.get("breeder") or row.get("bank"),
                        chemistry=row.get("chemistry"),
                        source="merged",
                    )
        except Exception as e:
            print("merged skip", e)

    # Curated YAML seeds fill names absent from the merged dump.
    yaml_path = DATA / "dsc_strain_catalog.yaml"
    if yaml_path.exists() and yaml:
        try:
            doc = yaml.safe_load(yaml_path.read_text(encoding="utf-8")) or {}
            for s in doc.get("strains") or doc.get("seeds") or []:
                if isinstance(s, dict):
                    add(
                        s.get("name") or s.get("id"),
                        id=s.get("id"),
                        type=s.get("type") or s.get("lineage"),
                        breeder=(s.get("breeder") or s.get("bank")),
                        source="yaml",
                    )
        except Exception as e:
            print("yaml skip", e)

    # Popular dump is the final fallback.
    for row in _products(DATA / "dsc_strains_popular.json"):
        if len(rows) >= STRAIN_CAP:
            break
        if isinstance(row, dict):
            add(
                row.get("name"),
                id=row.get("id"),
                type=row.get("type") or row.get("species"),
                breeder=row.get("breeder") or row.get("bank"),
                chemistry=row.get("chemistry"),
                source="popular",
            )

    return {
        "schema_version": 1,
        "kind": "strains",
        "built_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "count": len(rows),
        "note": (
            "Slim strain index; merged dump preferred. Chemistry coverage is "
            "intentionally slim and limited to ranges plus three terpene names."
        ),
        "items": rows,
    }


def build_nutrients() -> dict:
    rows: list[dict] = []
    seen: set[str] = set()

    # Prefer curated pack + CANNA dump + a few AU retailers
    preferred = [
        DATA / "dsc_nutrient_pack_canna_coco.yaml",
        DATA / "dsc_nutrients_canna.json",
        DATA / "dsc_nutrients_growkings.json",
        DATA / "dsc_nutrients_advanced_nutrients.json",
        DATA / "dsc_nutrients_athena.json",
        DATA / "dsc_nutrients_house_garden.json",
        DATA / "dsc_nutrients_bunnings.json",
    ]
    # Also sweep remaining brand dumps until cap
    extras = sorted(DATA.glob("dsc_nutrients_*.json"))
    paths: list[Path] = []
    for p in preferred + extras:
        if p not in paths and p.exists() and "checkpoint" not in p.name:
            paths.append(p)

    for path in paths:
        if len(rows) >= NUTE_CAP:
            break
        if path.suffix in (".yaml", ".yml") and yaml:
            try:
                doc = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
                products = doc.get("products") or doc.get("bottles") or []
            except Exception:
                products = []
        else:
            products = _products(path)
        for row in products:
            if len(rows) >= NUTE_CAP:
                break
            if not isinstance(row, dict):
                continue
            name = (row.get("name") or "").strip()
            if not name:
                continue
            key = name.lower()
            if key in seen:
                continue
            seen.add(key)
            dose = row.get("dose_ml_l") or row.get("rate_ml_l")
            if dose is None:
                # pack shape
                dose = (row.get("dose") or {}).get("ml_l") if isinstance(row.get("dose"), dict) else None
            rows.append(
                {
                    "id": row.get("id") or _slug("nute", name),
                    "name": name,
                    "brand": row.get("brand"),
                    "dose_ml_l": dose,
                    "category": row.get("category") or row.get("kind"),
                    "source": path.stem,
                }
            )

    return {
        "schema_version": 1,
        "kind": "nutrients",
        "built_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "count": len(rows),
        "note": "Slim nutrient index. dose_ml_l only when stated in dump/pack.",
        "items": rows,
    }


def build_mediums() -> dict:
    rows: list[dict] = []
    seen: set[str] = set()
    preferred = [
        DATA / "dsc_medium_pack_canna_coco.yaml",
        DATA / "dsc_mediums_canna.json",
        DATA / "dsc_mediums_cyco.json",
        DATA / "dsc_mediums_coco.json",
        DATA / "dsc_mediums_growkings.json",
        DATA / "dsc_mediums_bunnings.json",
        DATA / "dsc_mediums_soil.json",
        DATA / "dsc_mediums_perlite.json",
    ]
    extras = sorted(DATA.glob("dsc_mediums_*.json"))
    paths: list[Path] = []
    for p in preferred + extras:
        if p not in paths and p.exists() and "checkpoint" not in p.name:
            paths.append(p)

    for path in paths:
        if len(rows) >= MEDIUM_CAP:
            break
        if path.suffix in (".yaml", ".yml") and yaml:
            try:
                doc = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
                products = doc.get("products") or doc.get("mediums") or []
            except Exception:
                products = []
        else:
            products = _products(path)
        for row in products:
            if len(rows) >= MEDIUM_CAP:
                break
            if not isinstance(row, dict):
                continue
            name = (row.get("name") or "").strip()
            if not name:
                continue
            key = name.lower()
            if key in seen:
                continue
            seen.add(key)
            rows.append(
                {
                    "id": row.get("id") or _slug("medium", name),
                    "name": name,
                    "brand": row.get("brand"),
                    "category": row.get("category") or row.get("kind"),
                    "composition": row.get("composition") or row.get("composition_pct"),
                    "source": path.stem,
                }
            )

    # Ensure pack picker labels exist even if dump miss
    for label in (
        "CANNA Coco Professional Plus",
        "Cyco Coco Lite 70/30",
        "Perlite",
        "Vermiculite",
        "Clay pebbles / LECA",
    ):
        if label.lower() not in seen:
            seen.add(label.lower())
            rows.insert(
                0,
                {
                    "id": _slug("medium", label),
                    "name": label,
                    "brand": None,
                    "category": "substrate",
                    "composition": None,
                    "source": "builder_seed",
                },
            )

    return {
        "schema_version": 1,
        "kind": "mediums",
        "built_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "count": len(rows),
        "note": "Slim medium index for soil % blend search.",
        "items": rows,
    }


def build_lights() -> dict:
    rows: list[dict] = []
    seen: set[str] = set()

    # Pack first
    pack = DATA / "dsc_light_pack_photometrics.yaml"
    if pack.exists() and yaml:
        try:
            doc = yaml.safe_load(pack.read_text(encoding="utf-8")) or {}
            for fx in doc.get("fixtures") or []:
                if not isinstance(fx, dict):
                    continue
                name = fx.get("name") or fx.get("id")
                if not name:
                    continue
                key = str(name).lower()
                if key in seen:
                    continue
                seen.add(key)
                rows.append(
                    {
                        "id": fx.get("id"),
                        "name": name,
                        "brand": fx.get("brand"),
                        "wattage_w": fx.get("wattage_w"),
                        "ppf_umol_s": fx.get("ppf_umol_s"),
                        "efficacy_umol_j": fx.get("efficacy_umol_j"),
                        "has_ppfd": bool(fx.get("ppfd_map_urls")),
                        "has_spectrum": bool(fx.get("spectrum_map_urls")),
                        "ppfd_url": (fx.get("ppfd_map_urls") or [None])[0],
                        "spectrum_url": (fx.get("spectrum_map_urls") or [None])[0],
                        "source": "photometrics_pack",
                    }
                )
        except Exception as e:
            print("pack skip", e)

    for path in sorted(DATA.glob("dsc_lights_*.json")):
        if "checkpoint" in path.name:
            continue
        if len(rows) >= LIGHT_CAP:
            break
        for row in _products(path):
            if len(rows) >= LIGHT_CAP:
                break
            if not isinstance(row, dict):
                continue
            name = (row.get("name") or "").strip()
            if not name:
                continue
            key = name.lower()
            if key in seen:
                continue
            seen.add(key)
            rp = row.get("raw_props") or {}
            rows.append(
                {
                    "id": row.get("id") or _slug("light", name),
                    "name": name,
                    "brand": row.get("brand"),
                    "wattage_w": row.get("wattage_w"),
                    "ppf_umol_s": row.get("ppf_umol_s"),
                    "efficacy_umol_j": row.get("efficacy_umol_j"),
                    "has_ppfd": bool(row.get("ppfd_maps")),
                    "has_spectrum": bool(row.get("spectrum_maps")),
                    "has_datasheet": bool(row.get("datasheets")),
                    "stated_ppfd": rp.get("stated_ppfd"),
                    "ppfd_url": ((row.get("ppfd_maps") or [{}])[0] or {}).get("url")
                    if row.get("ppfd_maps")
                    else None,
                    "spectrum_url": ((row.get("spectrum_maps") or [{}])[0] or {}).get("url")
                    if row.get("spectrum_maps")
                    else None,
                    "source": path.stem,
                }
            )

    return {
        "schema_version": 1,
        "kind": "lights",
        "built_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "count": len(rows),
        "note": (
            "Slim light index. Map URLs only when present; stated_ppfd is a point "
            "reading, not a heatmap grid."
        ),
        "items": rows,
    }


def main() -> int:
    outs = [
        _write("dsc_strains_search_index.json", build_strains()),
        _write("dsc_nutrients_search_index.json", build_nutrients()),
        _write("dsc_mediums_search_index.json", build_mediums()),
        _write("dsc_lights_search_index.json", build_lights()),
    ]
    for p in outs:
        print("wrote", p)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
