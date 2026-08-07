#!/usr/bin/env python3
"""Merge local strain seed dumps into one normalized catalog.

Usage:
  python scripts/merge_strain_catalogs.py [--chemistry] [--write]
"""
from __future__ import annotations

import argparse
import json
import re
from copy import deepcopy
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "homeassistant" / "data"
OUTPUT = DATA / "dsc_strains_merged.json"


def name_norm(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", value.lower()).strip()


def rows_from(path: Path) -> list[dict[str, Any]]:
    try:
        doc = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        print(f"skip {path.name}: {exc}")
        return []
    if isinstance(doc, list):
        return [row for row in doc if isinstance(row, dict)]
    if isinstance(doc, dict):
        for key in ("products", "seeds", "strains", "items", "profiles"):
            rows = doc.get(key)
            if isinstance(rows, list):
                return [row for row in rows if isinstance(row, dict)]
    return []


def merge_overlay(base: dict[str, Any], incoming: dict[str, Any]) -> None:
    """Fill blanks, but let explicit bank properties override generic values."""
    bank_props = incoming.get("bank_props")
    for key, value in incoming.items():
        if key in {"name_norm", "bank_props"} or value in (None, "", [], {}):
            continue
        if key not in base or base[key] in (None, "", [], {}):
            base[key] = deepcopy(value)
    if isinstance(bank_props, dict):
        base.setdefault("bank_props", {}).update(deepcopy(bank_props))
        for key, value in bank_props.items():
            if value not in (None, "", [], {}):
                base[key] = deepcopy(value)


def chemistry_payload(row: dict[str, Any]) -> dict[str, Any]:
    chemistry = row.get("chemistry")
    if isinstance(chemistry, dict):
        return deepcopy(chemistry)
    keys = ("thc_range", "cbd_range", "top_terpenes", "terpenes")
    return {key: deepcopy(row[key]) for key in keys if row.get(key) not in (None, "", [], {})}


def build(with_chemistry: bool) -> tuple[dict[str, Any], int]:
    merged: dict[str, dict[str, Any]] = {}
    sources: dict[str, set[str]] = {}
    seed_paths = sorted(
        path
        for path in DATA.glob("dsc_strains_*.json")
        if path.name != OUTPUT.name and "checkpoint" not in path.name
    )
    for path in seed_paths:
        for row in rows_from(path):
            name = str(row.get("name") or row.get("strain") or "").strip()
            key = name_norm(name)
            if not key:
                continue
            if key not in merged:
                merged[key] = {"name": name, "name_norm": key}
                sources[key] = set()
            merge_overlay(merged[key], row)
            sources[key].add(path.name)

    chemistry_by_name: dict[str, dict[str, Any]] = {}
    chemistry_sources: dict[str, str] = {}
    if with_chemistry:
        for path in sorted(DATA.glob("dsc_lab_terpenes_*.json")):
            for row in rows_from(path):
                key = name_norm(str(row.get("name_norm") or row.get("name") or row.get("strain") or ""))
                payload = chemistry_payload(row)
                if key and payload:
                    chemistry_by_name.setdefault(key, {}).update(payload)
                    chemistry_sources[key] = path.name

    attached = 0
    items: list[dict[str, Any]] = []
    for key in sorted(merged):
        row = merged[key]
        if key in chemistry_by_name:
            row["chemistry"] = chemistry_by_name[key]
            row["chemistry_source"] = chemistry_sources[key]
            attached += 1
        row["sources"] = sorted(sources[key])
        items.append(row)

    payload = {
        "schema_version": 1,
        "kind": "strains",
        "chemistry_mode": "slim_mvp" if with_chemistry else "none",
        "count": len(items),
        "seeds": items,
    }
    return payload, attached


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--chemistry", action="store_true", help="attach local lab terpene profiles")
    parser.add_argument("--write", action="store_true", help=f"write {OUTPUT.relative_to(ROOT)}")
    args = parser.parse_args()
    payload, attached = build(args.chemistry)
    total = payload["count"]
    rate = (attached / total * 100) if total else 0
    print(f"unique strains: {total}")
    print(f"chemistry attached: {attached}/{total} ({rate:.1f}%)")
    if args.write:
        OUTPUT.parent.mkdir(parents=True, exist_ok=True)
        OUTPUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"wrote {OUTPUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
