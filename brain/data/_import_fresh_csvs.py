"""Quick height sample + import fresh MaxValue/Wikileaf CSVs to dump+staging."""
from __future__ import annotations

import csv
import io
import json
import sqlite3
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "scripts"))

from catalog_common import DATA, fetch_text, name_norm, write_dump  # noqa: E402
from brain.dsc_brain.paths import STAGING_DIR  # noqa: E402
from brain.dsc_brain.staging import write_dump_to_staging  # noqa: E402

# height samples from enrich
src = STAGING_DIR / "leafly_flat_enrich.sqlite3"
c = sqlite3.connect(f"file:{src}?mode=ro", uri=True)
ctr = Counter()
samples = []
for (blob,) in c.execute("SELECT payload_json FROM raw_record"):
    o = json.loads(blob)
    v = o.get("grow_height")
    if v not in (None, ""):
        ctr[str(type(v).__name__) + ":" + str(v)[:40]] += 1
        if len(samples) < 15:
            samples.append(v)
print("grow_height samples", samples)
print("top", ctr.most_common(20))
c.close()

# Greenhouse sitemap locs
text = fetch_text("https://shop.greenhouseseeds.nl/sitemap.xml", timeout=60)
locs = [ln for ln in text.splitlines() if "<loc>" in ln]
print(f"greenhouse sitemap locs={len(locs)}")
print("sample", locs[:5])

# Fresh MaxValue results.csv → dump (terpenes)
text = fetch_text(
    "https://raw.githubusercontent.com/MaxValue/Terpene-Profile-Parser-for-Cannabis-Strains/master/results.csv",
    timeout=180,
)
reader = csv.DictReader(io.StringIO(text))
items = []
for r in reader:
    name = str(r.get("Strain") or r.get("strain") or r.get("name") or "").strip()
    if not name:
        # try common alt
        name = str(r.get("Sample") or r.get("sample") or "").strip()
    if not name:
        # keep row keyed by lab sample id if present
        name = str(r.get("id") or r.get("Id") or "").strip()
    if not name:
        continue
    row = {k: v for k, v in r.items() if v not in (None, "")}
    row["name"] = name
    row["name_norm"] = name_norm(name)
    row["source"] = "maxvalue_terpenes_csv"
    row["chemistry"] = {"terpenes_raw": row}
    items.append(row)
print(f"maxvalue csv rows with name={len(items)} header sample keys={list(reader.fieldnames or [])[:20]}")
# If names weak, still store raw dump of all rows
if len(items) < 100:
    reader = csv.DictReader(io.StringIO(text))
    items = []
    for i, r in enumerate(reader):
        row = {k: v for k, v in r.items() if v not in (None, "")}
        label = str(
            row.get("Strain")
            or row.get("strain")
            or row.get("Name")
            or row.get("Sample Name")
            or f"maxvalue_row_{i}"
        ).strip()
        row["name"] = label
        row["name_norm"] = name_norm(label)
        row["source"] = "maxvalue_terpenes_csv"
        items.append(row)
    print(f"maxvalue fallback rows={len(items)}")

out = DATA / "dsc_lab_terpenes_maxvalue_csv_fresh.json"
write_dump(
    out,
    "lab",
    items,
    source="maxvalue_terpenes_csv",
    source_url="https://github.com/MaxValue/Terpene-Profile-Parser-for-Cannabis-Strains",
    license="open/research (see upstream repo)",
    redistributable=True,
)
print(f"wrote {out} n={len(items)}")
r = write_dump_to_staging(out, source_id="maxvalue_terpenes_csv", staging_dir=STAGING_DIR, reset=False)
print("staged", r)

# Wikileaf ALL_data fresh — check columns for grow
text = fetch_text(
    "https://raw.githubusercontent.com/Loyal9-Elements/grow_data/master/Resources/csv/ALL_data.csv",
    timeout=180,
)
reader = csv.DictReader(io.StringIO(text))
fields = list(reader.fieldnames or [])
print("wikileaf fields", fields)
items = []
growish = 0
for r in reader:
    name = str(r.get("strain") or r.get("name") or r.get("Strain") or "").strip()
    if not name:
        continue
    row = {k: v for k, v in r.items() if v not in (None, "")}
    row["name"] = name
    row["name_norm"] = name_norm(name)
    row["source"] = "wikileaf_grow_data"
    flat = " ".join(fields).lower()
    items.append(row)
    info = str(row.get("info") or row.get("more_info") or "")
    if any(x in info.lower() for x in ("flower", "height", "week", "cm", "inch")):
        growish += 1
print(f"wikileaf n={len(items)} growish_text={growish}")
out = DATA / "dsc_strains_wikileaf_alldata_fresh.json"
write_dump(
    out,
    "strains",
    items,
    source="wikileaf_grow_data",
    source_url="https://github.com/Loyal9-Elements/grow_data",
    license="MIT",
    redistributable=True,
)
r = write_dump_to_staging(out, source_id="wikileaf_grow_data", staging_dir=STAGING_DIR, reset=False)
print("wikileaf staged", r)
