#!/usr/bin/env python3
"""Parse pharmacies page into dump + staging raw."""
from __future__ import annotations

import html as htmlmod
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from catalog_common import DATA, name_norm, write_dump  # noqa: E402
from brain.dsc_brain.corpus import ensure_source, store_raw_record  # noqa: E402
from brain.dsc_brain.staging import connect_staging  # noqa: E402

CACHE = DATA / "_cache_cannareviews"
html = (CACHE / "pharmacies.html").read_text(encoding="utf-8", errors="replace")
# Prefer structured cards
items = []
for m in re.finditer(
    r"<h[2-4][^>]*>(.*?)</h[2-4]>|<div[^>]*class=\"[^\"]*pharmacy[^\"]*\"[^>]*>(.*?)</div>",
    html,
    re.I | re.S,
):
    pass

# Extract from list-like blocks with state names
states = ("NSW", "QLD", "VIC", "WA", "SA", "ACT", "TAS", "NT")
# simple: anchor texts that look like pharmacy names
for m in re.finditer(r"<a[^>]+href=\"([^\"]+)\"[^>]*>(.*?)</a>", html, re.I | re.S):
    href, inner = m.group(1), clean if False else m.group(2)
    name = htmlmod.unescape(re.sub(r"<[^>]+>", " ", inner))
    name = re.sub(r"\s+", " ", name).strip()
    if len(name) < 4 or len(name) > 120:
        continue
    if not re.search(r"pharmacy|dispensar|chemist|cannabis|clinic", name, re.I):
        # keep if nearby context has pharmacy words
        continue
    items.append(
        {
            "source": "cannareviews",
            "name": name,
            "name_norm": name_norm(name),
            "url": href if href.startswith("http") else f"https://cannareviews.health{href}",
            "entity": "pharmacy",
            "country": "AU",
        }
    )

# Also pull plain text lines with Pharmacy
for m in re.finditer(r">([^<]*(?:Pharmacy|Dispensary|Chemist)[^<]{0,80})<", html, re.I):
    name = htmlmod.unescape(re.sub(r"\s+", " ", m.group(1))).strip()
    if 4 <= len(name) <= 120:
        items.append(
            {
                "source": "cannareviews",
                "name": name,
                "name_norm": name_norm(name),
                "entity": "pharmacy",
                "country": "AU",
            }
        )

seen = set()
out = []
for it in items:
    k = it["name_norm"]
    if not k or k in seen:
        continue
    if any(x in k for x in ("sign in", "canna review", "find a", "dispensaries and")):
        continue
    seen.add(k)
    out.append(it)

write_dump(
    DATA / "dsc_pharmacies_cannareviews.json",
    "pharmacies",
    out,
    source="cannareviews",
    source_url="https://cannareviews.health/cannabis-dispensary-pharmacies",
    license="AU medical / site ToS — license unclear",
    redistributable=False,
)
try:
    conn = connect_staging("cannareviews")
    ensure_source(
        conn,
        "cannareviews",
        "CannaReviews AU medical (cannareviews.health)",
        url="https://cannareviews.health/",
        license="AU medical / site ToS",
        redistributable=False,
    )
    for it in out:
        store_raw_record(conn, source_id="cannareviews", entity_kind="pharmacy", name=it["name"], payload=it)
    conn.commit()
    conn.close()
except Exception as exc:
    print("staging append skip", exc)
print("pharmacies", len(out))
print(json.dumps(out[:5], indent=2))
