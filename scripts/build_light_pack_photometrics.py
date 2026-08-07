#!/usr/bin/env python3
"""Build curated light pack YAML from cleaned dumps (PPFD / spectrum URLs).

Picks popular Spider Farmer + Mars Hydro AU fixtures that have real map images
and stated wattage/PPF/PPE. Does not invent heatmap cells.

Usage:
  python scripts/build_light_pack_photometrics.py
"""
from __future__ import annotations

import json
import re
import time
from pathlib import Path

try:
    import yaml
except ImportError:
    raise SystemExit("PyYAML required")

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "homeassistant" / "data"
OUT = DATA / "dsc_light_pack_photometrics.yaml"

TARGETS = [
    # (dump, name regex, pack id slug)
    ("dsc_lights_spider_farmer.json", r"(?i)\bSF1000\b", "spider_farmer_sf1000"),
    ("dsc_lights_spider_farmer.json", r"(?i)\bSF2000\b", "spider_farmer_sf2000"),
    ("dsc_lights_spider_farmer.json", r"(?i)\bSE7000\b", "spider_farmer_se7000"),
    ("dsc_lights_mars_hydro_au.json", r"(?i)FC-E3000|FC.?E.?3000", "mars_hydro_fc_e3000"),
    ("dsc_lights_mars_hydro_au.json", r"(?i)TS1000\b", "mars_hydro_ts1000"),
    ("dsc_lights_digi_lumen.json", r"(?i).", "digi_lumen_best"),  # best map coverage row
    ("dsc_lights_treegers.json", r"(?i).", "treegers_best"),
]


def _best_maps(row: dict) -> dict:
    def urls(key: str, limit: int = 3) -> list[str]:
        out = []
        for item in row.get(key) or []:
            u = (item.get("url") if isinstance(item, dict) else None) or ""
            if u and u not in out:
                out.append(u)
            if len(out) >= limit:
                break
        return out

    return {
        "ppfd_map_urls": urls("ppfd_maps"),
        "spectrum_map_urls": urls("spectrum_maps"),
        "beam_map_urls": urls("beam_maps"),
        "datasheet_urls": urls("datasheets", 2),
    }


def _pick(dump: str, pattern: str) -> dict | None:
    path = DATA / dump
    if not path.exists():
        return None
    doc = json.loads(path.read_text(encoding="utf-8"))
    rx = re.compile(pattern)
    candidates = []
    for row in doc.get("products") or []:
        name = row.get("name") or ""
        if not rx.search(name):
            continue
        # Prefer fixtures with maps + wattage
        score = 0
        if row.get("ppfd_maps"):
            score += 10 + len(row["ppfd_maps"])
        if row.get("spectrum_maps"):
            score += 5 + len(row["spectrum_maps"])
        if row.get("wattage_w") is not None:
            score += 3
        if row.get("ppf_umol_s") is not None:
            score += 2
        if row.get("efficacy_umol_j") is not None:
            score += 2
        # Prefer LED grow light wording; demote tents/kits/accessories
        low = name.lower()
        if "tent" in low or "insulation" in low or "filter" in low:
            score -= 20
        if "pre-owned" in low or "preowned" in low or "refurbished" in low:
            score -= 15
        if "led" in low or "grow light" in low:
            score += 4
        candidates.append((score, row))
    if not candidates:
        return None
    candidates.sort(key=lambda x: x[0], reverse=True)
    return candidates[0][1]


def main() -> int:
    # Prefer new SF2000 over pre-owned
    global TARGETS
    TARGETS = [
        ("dsc_lights_spider_farmer.json", r"(?i)\bSF1000\b", "spider_farmer_sf1000"),
        ("dsc_lights_spider_farmer.json", r"(?i)\bSF2000\b", "spider_farmer_sf2000"),
        ("dsc_lights_spider_farmer.json", r"(?i)\bSE7000\b", "spider_farmer_se7000"),
        ("dsc_lights_mars_hydro_au.json", r"(?i)FC-E3000|FC.?E.?3000", "mars_hydro_fc_e3000"),
        ("dsc_lights_mars_hydro_au.json", r"(?i)TS1000\b", "mars_hydro_ts1000"),
        ("dsc_lights_digi_lumen.json", r"(?i).", "digi_lumen_best"),
        ("dsc_lights_treegers.json", r"(?i).", "treegers_best"),
        # Vivosun joins only when keyword-labeled map URLs exist (CDN hashes alone are not maps).
        ("dsc_lights_vivosun.json", r"(?i)AeroLight\s*A?100\b|AeroLight 100", "vivosun_aerolight_100"),
        ("dsc_lights_vivosun.json", r"(?i)AeroLight\s*320|AeroLight 320", "vivosun_aerolight_320"),
        ("dsc_lights_vivosun.json", r"(?i)VS1000|VS.?1000", "vivosun_vs1000"),
    ]
    fixtures = []
    seen_ids: set[str] = set()
    for dump, pattern, pack_id in TARGETS:
        row = _pick(dump, pattern)
        if not row:
            print(f"skip {pack_id}: no match in {dump}")
            continue
        rid = row.get("id") or pack_id
        if rid in seen_ids:
            # digi/treegers "best" may collide — suffix
            continue
        seen_ids.add(rid)
        maps = _best_maps(row)
        if not maps["ppfd_map_urls"] and not maps["spectrum_map_urls"] and not maps["beam_map_urls"]:
            print(f"skip {pack_id}: no cleaned map URLs")
            continue
        fixtures.append(
            {
                "id": pack_id,
                "dump_id": rid,
                "dump": dump,
                "name": row.get("name"),
                "brand": row.get("brand"),
                "url": row.get("url"),
                "wattage_w": row.get("wattage_w"),
                "ppf_umol_s": row.get("ppf_umol_s"),
                "efficacy_umol_j": row.get("efficacy_umol_j"),
                **maps,
                "curated": True,
                "note": "URLs + stated photometrics only; no invented PPFD grid cells.",
            }
        )
        print(f"ok {pack_id}: maps ppfd={len(maps['ppfd_map_urls'])} spectrum={len(maps['spectrum_map_urls'])}")

    payload = {
        "schema_version": 1,
        "id": "photometrics_starter",
        "name": "DSC Photometrics Starter Pack",
        "curated": True,
        "built_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "note": (
            "Starter fixtures with cleaned PPFD/spectrum/beam map image URLs from "
            "manufacturer dumps. Honesty: never invent heatmap values; open the "
            "linked images/PDFs. Rebuild via scripts/build_light_pack_photometrics.py "
            "after clean_light_map_assets.py."
        ),
        "fixtures": fixtures,
    }
    OUT.write_text(
        "# DSC curated light photometrics pack (PPFD / spectrum map URLs)\n"
        "# Rebuild: python scripts/clean_light_map_assets.py && "
        "python scripts/build_light_pack_photometrics.py\n#\n"
        + yaml.safe_dump(payload, sort_keys=False, allow_unicode=True),
        encoding="utf-8",
    )
    print(f"wrote {OUT} ({len(fixtures)} fixtures)")
    _write_ha_package(fixtures)
    return 0


def _write_ha_package(fixtures: list[dict]) -> None:
    pkg = ROOT / "homeassistant" / "packages" / "dsc_v4_light_catalog.yaml"
    if not fixtures:
        print(f"skip HA package rewrite: 0 fixtures (refusing to wipe {pkg.name})")
        return
    labels = []
    by_label = {}
    for fx in fixtures:
        # Human label from id
        label = fx["id"].replace("_", " ").title()
        if fx["id"].startswith("spider_farmer_"):
            label = "Spider Farmer " + fx["id"].split("spider_farmer_", 1)[1].upper().replace("SF", "SF").replace("SE", "SE")
            # nicer: sf1000 → SF1000
            rest = fx["id"].removeprefix("spider_farmer_")
            label = "Spider Farmer " + rest.upper()
        elif fx["id"].startswith("mars_hydro_"):
            rest = fx["id"].removeprefix("mars_hydro_").replace("_", "-").upper()
            label = "Mars Hydro " + rest
        elif fx["id"] == "digi_lumen_best":
            label = "Digi-Lumen (best map)"
        elif fx["id"] == "treegers_best":
            label = "Treegers (best map)"
        elif fx["id"].startswith("vivosun_"):
            rest = fx["id"].removeprefix("vivosun_").replace("_", " ").title()
            label = "VIVOSUN " + rest
        labels.append(label)
        by_label[label] = fx

    opt_lines = "\n".join(f'      - "{l}"' for l in labels + ["Custom / other"])

    def _clean_url(val):
        if not isinstance(val, str):
            return val
        # Manufacturer pages sometimes embed ZWSP; strip before packaging.
        return "".join(ch for ch in val if ch not in ("\u200b", "\u200c", "\u200d", "\ufeff"))

    # Build jinja branches for maps / watts
    def branches(field_get, unknown="unknown"):
        lines = []
        for label, fx in by_label.items():
            val = field_get(fx)
            if val is None or val == "" or val == []:
                continue
            if isinstance(val, list):
                val = val[0] if val else None
            if val is None:
                continue
            if isinstance(val, str):
                val = _clean_url(val)
            lines.append(f"          {{% elif f == '{label}' %}}{val}")
        return "\n".join(lines)

    # Also strip ZWSP from jinja URL branches so PPFD sensor states stay clean.
    ppfd_b = branches(lambda fx: (fx.get("ppfd_map_urls") or [None])[0])
    spec_b = branches(lambda fx: (fx.get("spectrum_map_urls") or [None])[0])
    watt_b = branches(lambda fx: fx.get("wattage_w"))
    ppf_b = branches(lambda fx: fx.get("ppf_umol_s"))
    ppe_b = branches(lambda fx: fx.get("efficacy_umol_j"))

    fixtures_obj = {
        lab: {
            "pack_id": fx["id"],
            "wattage_w": fx.get("wattage_w"),
            "ppf_umol_s": fx.get("ppf_umol_s"),
            "efficacy_umol_j": fx.get("efficacy_umol_j"),
            "ppfd_map_url": _clean_url((fx.get("ppfd_map_urls") or [None])[0]),
            "spectrum_map_url": _clean_url((fx.get("spectrum_map_urls") or [None])[0]),
            "url": _clean_url(fx.get("url")),
        }
        for lab, fx in by_label.items()
    }
    # HA 2026.8+ rejects nested mapping attributes on template sensors.
    fixtures_json = json.dumps(fixtures_obj, ensure_ascii=False, separators=(",", ":"))
    fixtures_indented = json.dumps(fixtures_json, ensure_ascii=False)

    initial = labels[0] if labels else "Custom / other"
    text = f"""# ==================================================================
#  DSC-HUB · LIGHT PHOTOMETRICS CATALOG (PPFD / spectrum maps)
#  ------------------------------------------------------------------
#  AUTO-GENERATED by scripts/build_light_pack_photometrics.py — do not hand-edit.
#  Pack: homeassistant/data/dsc_light_pack_photometrics.yaml
#  Honesty: image/PDF URLs only — never invent PPFD grid cells.
# ==================================================================

input_select:
  dsc_light_fixture:
    name: "DSC Light Fixture"
    icon: mdi:led-strip-variant
    options:
{opt_lines}
    initial: "{initial}"

input_text:
  dsc_light_custom_name:
    name: "DSC Light Custom Name"
    max: 64
    initial: ""
  dsc_light_ppfd_map_url:
    name: "DSC Light PPFD Map URL (override)"
    # HA entity state max is 255 chars — higher values abort the whole input_text domain.
    max: 255
    initial: ""
  dsc_light_spectrum_map_url:
    name: "DSC Light Spectrum Map URL (override)"
    max: 255
    initial: ""

template:
  - sensor:
      - name: "DSC Light Catalog"
        unique_id: dsc_light_catalog
        icon: mdi:led-strip-variant
        state: "ready"
        attributes:
          schema_version: 1
          curated_pack: photometrics_starter
          pack_file: homeassistant/data/dsc_light_pack_photometrics.yaml
          note: >-
            PPFD/spectrum/beam are manufacturer image or PDF URLs only.
            Do not invent heatmap cells.
          fixtures: {fixtures_indented}

      - name: "DSC Light Active Summary"
        unique_id: dsc_light_active_summary
        icon: mdi:information-outline
        state: >
          {{% set f = states('input_select.dsc_light_fixture') %}}
          {{% if f == 'Custom / other' %}}
            {{{{ states('input_text.dsc_light_custom_name') or 'Custom fixture' }}}}
          {{% else %}}{{{{ f }}}}{{% endif %}}

      - name: "DSC Light PPFD Map"
        unique_id: dsc_light_ppfd_map
        icon: mdi:grid
        state: >
          {{% set f = states('input_select.dsc_light_fixture') %}}
          {{% set custom = states('input_text.dsc_light_ppfd_map_url')|trim %}}
          {{% if custom %}}{{{{ custom }}}}
{ppfd_b}
          {{% else %}}unknown{{% endif %}}

      - name: "DSC Light Spectrum Map"
        unique_id: dsc_light_spectrum_map
        icon: mdi:rainbow
        state: >
          {{% set f = states('input_select.dsc_light_fixture') %}}
          {{% set custom = states('input_text.dsc_light_spectrum_map_url')|trim %}}
          {{% if custom %}}{{{{ custom }}}}
{spec_b}
          {{% else %}}unknown{{% endif %}}

      - name: "DSC Light Wattage"
        unique_id: dsc_light_wattage_w
        unit_of_measurement: "W"
        state: >
          {{% set f = states('input_select.dsc_light_fixture') %}}
{watt_b}
          {{% else %}}unknown{{% endif %}}

      - name: "DSC Light PPF"
        unique_id: dsc_light_ppf_umol_s
        unit_of_measurement: "µmol/s"
        state: >
          {{% set f = states('input_select.dsc_light_fixture') %}}
{ppf_b}
          {{% else %}}unknown{{% endif %}}

      - name: "DSC Light PPE"
        unique_id: dsc_light_ppe_umol_j
        unit_of_measurement: "µmol/J"
        state: >
          {{% set f = states('input_select.dsc_light_fixture') %}}
{ppe_b}
          {{% else %}}unknown{{% endif %}}

# Sync catalog nameplate watts into climate physics when the 2x4 fixture is SF1000.
automation:
  - id: dsc_light_sync_sf1000_nameplate_watts
    alias: "DSC Light · Sync SF1000 nameplate watts to climate spec"
    mode: single
    trigger:
      - platform: state
        entity_id: input_select.dsc_light_fixture
      - platform: homeassistant
        event: start
    condition:
      - condition: state
        entity_id: input_select.dsc_light_fixture
        state: "Spider Farmer SF1000"
      - condition: template
        value_template: >-
          {{{{ states('sensor.dsc_light_wattage_w') not in ['unknown','unavailable',''] }}}}
    action:
      - service: input_number.set_value
        target:
          entity_id: input_number.dsc_sf1000_w
        data:
          value: "{{{{ states('sensor.dsc_light_wattage_w')|float(100) }}}}"
"""
    # Fix jinja: first branch should be {% if %} not {% elif %}
    text = text.replace(
        "{% set custom = states('input_text.dsc_light_ppfd_map_url')|trim %}}\n"
        "          {% if custom %}{{ custom }}}\n"
        "          {% elif f ==",
        "{% set custom = states('input_text.dsc_light_ppfd_map_url')|trim %}}\n"
        "          {% if custom %}{{ custom }}}\n"
        "          {% elif f ==",
    )
    # Wattage/PPF/PPE blocks start with elif — convert first elif to if
    for uid in ("dsc_light_wattage_w", "dsc_light_ppf_umol_s", "dsc_light_ppe_umol_j"):
        pass
    # Post-process: for wattage/ppf/ppe sensors, replace first {% elif with {% if
    import re as _re
    def fix_sensor_if(block_unique: str, body: str) -> str:
        pat = _re.compile(
            rf"(unique_id: {block_unique}\n"
            rf"        unit_of_measurement: \"[^\"]+\"\n"
            rf"        state: >\n"
            rf"          {{% set f = states\('input_select\.dsc_light_fixture'\) %}}\n)"
            rf"          {{% elif ",
        )
        return pat.sub(r"\1          {% if ", body, count=1)

    for uid in ("dsc_light_wattage_w", "dsc_light_ppf_umol_s", "dsc_light_ppe_umol_j"):
        text = fix_sensor_if(uid, text)

    pkg.write_text(text, encoding="utf-8")
    print(f"wrote {pkg}")


if __name__ == "__main__":
    raise SystemExit(main())
