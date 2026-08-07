#!/usr/bin/env python3
"""Promote curated strain Want bands into Home Assistant.

Writes the JSON companion artifact and synchronizes a generated inline
``want_bands`` attribute on ``sensor.dsc_strain_catalog``. Home Assistant
cannot load arbitrary JSON from a template, so keeping the generated mapping
inside the package makes the runtime entity self-contained.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

try:
    import yaml
except ImportError as exc:
    raise SystemExit("PyYAML is required: python -m pip install pyyaml") from exc

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "homeassistant" / "data"
SOURCE = DATA / "dsc_strain_catalog.yaml"
OUTPUT = DATA / "dsc_strain_catalog_want_bands.json"
PACKAGE = ROOT / "homeassistant" / "packages" / "dsc_v4_strain_catalog.yaml"
START_MARKER = "          # BEGIN GENERATED STRAIN WANT BANDS"
END_MARKER = "          # END GENERATED STRAIN WANT BANDS"


def _sync_package(bands: dict[str, dict]) -> None:
    text = PACKAGE.read_text(encoding="utf-8")
    # Historical copies of this package had an empty line between every line.
    text = re.sub(r"\n[ \t]*\n", "\n", text)

    names = ", ".join(row["name"] for row in bands.values())
    text = re.sub(
        r'(?m)^        state: ".*?"\n(?=        attributes:\n)',
        f"        state: {json.dumps(names, ensure_ascii=False)}\n",
        text,
        count=1,
    )
    text = re.sub(
        r'(?m)^          seed: ".*?"$',
        f"          seed: {json.dumps(names, ensure_ascii=False)}",
        text,
        count=1,
    )

    # HA 2026.8+ rejects nested mapping attributes on template sensors.
    # Store want_bands as a JSON string; templates use |from_json.
    want_json = json.dumps(bands, ensure_ascii=False, separators=(",", ":"))
    block = (
        f"{START_MARKER}\n"
        f"          want_bands: {json.dumps(want_json, ensure_ascii=False)}\n"
        f"{END_MARKER}"
    )

    if START_MARKER in text:
        text = re.sub(
            re.escape(START_MARKER) + r".*?" + re.escape(END_MARKER),
            block,
            text,
            count=1,
            flags=re.DOTALL,
        )
    else:
        anchor = "          custom_slots: 5"
        if anchor not in text:
            raise SystemExit(f"Could not find catalog attribute anchor in {PACKAGE}")
        text = text.replace(anchor, anchor + "\n" + block, 1)

    PACKAGE.write_text(text.rstrip() + "\n", encoding="utf-8")


def main() -> int:
    doc = yaml.safe_load(SOURCE.read_text(encoding="utf-8")) or {}
    bands: dict[str, dict] = {}
    for row in doc.get("seeds") or doc.get("strains") or []:
        if not isinstance(row, dict):
            continue
        key = str(row.get("id") or "").strip()
        name = str(row.get("name") or "").strip()
        want = row.get("want")
        if key and name and isinstance(want, dict):
            bands[key] = {
                "name": name,
                "type": row.get("type"),
                "curated": bool(row.get("curated")),
                **want,
            }
            chemistry = row.get("chem_summary") or row.get("chemistry")
            if chemistry:
                bands[key]["chem_summary"] = chemistry
    payload = {
        "schema_version": 1,
        "source": SOURCE.name,
        "want_bands": bands,
    }
    text = json.dumps(payload, ensure_ascii=False, indent=2)
    OUTPUT.write_text(text + "\n", encoding="utf-8")
    _sync_package(bands)
    print(json.dumps({"want_bands": bands}, ensure_ascii=False))
    print(f"wrote {OUTPUT}")
    print(f"updated {PACKAGE}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
