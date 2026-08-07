"""Count non-null grow/lineage/effect fields in leafly enrich + kushy dumps."""
import json
import sqlite3
from pathlib import Path

DATA = Path(r"y:\Digital Stealth Care\Projects\DSC-HUB\homeassistant\data")
STAGING = Path(r"y:\Digital Stealth Care\Projects\DSC-HUB\brain\data\staging")

# leafly enrich
p = STAGING / "leafly_flat_enrich.sqlite3"
c = sqlite3.connect(f"file:{p}?mode=ro", uri=True)
n = grow_h = grow_f = grow_y = parents = effects = terps = 0
for (blob,) in c.execute("SELECT payload_json FROM raw_record"):
    n += 1
    o = json.loads(blob)
    if o.get("grow_height"):
        grow_h += 1
    if o.get("grow_floweringDays"):
        grow_f += 1
    if o.get("grow_averageYield") or o.get("grow_difficulty"):
        grow_y += 1
    if o.get("parent_slugs"):
        parents += 1
    if any(o.get(k) is not None for k in o if k.startswith("effect_") and k.endswith("_score")):
        effects += 1
    if any(o.get(k) is not None for k in o if k.startswith("terp_") and k.endswith("_score")):
        terps += 1
print(
    f"leafly_enrich n={n} grow_height={grow_h} flowering={grow_f} "
    f"yield/diff={grow_y} parents={parents} effects={effects} terps={terps}"
)
c.close()

for name in (
    "dsc_strains_kushy.json",
    "dsc_strains_wikileaf.json",
    "dsc_strains_openthc.json",
    "dsc_strains_lynch_figshare.json",
    "dsc_strains_leafly_github.json",
    "dsc_strains_medical_effects.json",
):
    path = DATA / name
    if not path.exists():
        print(f"missing {name}")
        continue
    doc = json.loads(path.read_text(encoding="utf-8"))
    items = doc.get("items") or doc.get("strains") or []
    if not items and isinstance(doc, list):
        items = doc
    sample = items[0] if items else {}
    keys = sorted(sample.keys()) if isinstance(sample, dict) else []
    # field presence
    hits = {
        "height": 0,
        "flower": 0,
        "lineage": 0,
        "parent": 0,
        "effect": 0,
        "terp": 0,
        "thc": 0,
    }
    for it in items[:500]:
        if not isinstance(it, dict):
            continue
        flat = " ".join(str(k).lower() for k in it.keys())
        for v in it.values():
            if isinstance(v, dict):
                flat += " " + " ".join(str(k).lower() for k in v.keys())
        for h in hits:
            if h in flat:
                hits[h] += 1
    print(f"{name}: n={len(items)} sample_keys={keys[:25]} hits500={hits}")
