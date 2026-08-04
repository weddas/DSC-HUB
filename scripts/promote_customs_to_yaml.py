#!/usr/bin/env python3
"""N-011: promote occupied HA custom strain/nutrient slots into git YAML seeds.

Reads a JSON dump of HA states (from Developer Tools → Template or
`ha core` / REST) and prints YAML fragments to merge into:
  homeassistant/data/dsc_strain_catalog.yaml
  homeassistant/data/dsc_nutrient_catalog.yaml

Usage:
  python scripts/promote_customs_to_yaml.py states.json

Or run HA script.dsc_promote_customs_yaml_preview which posts a
persistent_notification with the same YAML for copy-paste (no file write).
"""
from __future__ import annotations

import json
import sys
from pathlib import Path


def st(states: dict, entity_id: str, default: str = "") -> str:
    e = states.get(entity_id) or {}
    v = e.get("state", default)
    if v in (None, "unknown", "unavailable"):
        return default
    return str(v).strip()


def fl(states: dict, entity_id: str, default: float = 0.0) -> float:
    try:
        return float(st(states, entity_id, str(default)))
    except ValueError:
        return default


def promote_strains(states: dict) -> list[dict]:
    out = []
    for i in range(1, 6):
        name = st(states, f"input_text.dsc_custom_strain_{i}_name")
        if not name or name.lower().startswith("custom"):
            continue
        out.append(
            {
                "id": f"custom_{i}_{name.lower().replace(' ', '_')[:24]}",
                "name": name,
                "type": st(states, f"input_select.dsc_custom_strain_{i}_type", "photo"),
                "notes": st(states, f"input_text.dsc_custom_strain_{i}_notes"),
                "want": {
                    "ph": [
                        fl(states, f"input_number.dsc_custom_strain_{i}_ph_min", 5.8),
                        fl(states, f"input_number.dsc_custom_strain_{i}_ph_max", 6.5),
                    ],
                    "ec_us": [
                        fl(states, f"input_number.dsc_custom_strain_{i}_ec_min", 1000),
                        fl(states, f"input_number.dsc_custom_strain_{i}_ec_max", 2000),
                    ],
                    "moisture_pct": [
                        fl(states, f"input_number.dsc_custom_strain_{i}_moisture_min", 45),
                        fl(states, f"input_number.dsc_custom_strain_{i}_moisture_max", 70),
                    ],
                },
                "veg_days": int(fl(states, f"input_number.dsc_custom_strain_{i}_veg_days", 28)),
                "flower_days": int(fl(states, f"input_number.dsc_custom_strain_{i}_flower_days", 56)),
            }
        )
    return out


def promote_nutrients(states: dict) -> list[dict]:
    out = []
    for i in range(1, 9):
        name = st(states, f"input_text.dsc_nutrient_{i}_name")
        if not name or name.lower() in ("", "custom", f"custom {i}"):
            # also try product-style helpers if present
            name = st(states, f"input_text.dsc_custom_nutrient_{i}_name", name)
        if not name or name.lower().startswith("custom"):
            continue
        out.append(
            {
                "id": f"custom_nutrient_{i}",
                "name": name,
                "stock_ml": fl(states, f"input_number.dsc_nutrient_{i}_stock_ml", 0),
                "dose_ml_per_l": fl(states, f"input_number.dsc_nutrient_{i}_dose_ml_l", 0),
            }
        )
    return out


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__)
        return 2
    path = Path(sys.argv[1])
    raw = json.loads(path.read_text(encoding="utf-8"))
    # Accept either {entity_id: {state:…}} or HA /api/states list
    if isinstance(raw, list):
        states = {e["entity_id"]: e for e in raw}
    else:
        states = raw
    strains = promote_strains(states)
    nutrients = promote_nutrients(states)
    print("# --- strains to merge under seeds: ---")
    print(json.dumps(strains, indent=2))
    print("# --- nutrients to merge under products/customs: ---")
    print(json.dumps(nutrients, indent=2))
    if not strains and not nutrients:
        print("# No occupied customs found — nothing to promote.", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
