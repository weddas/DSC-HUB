#!/usr/bin/env python3
"""Verify Alchimia scrape outputs and print counts."""
from __future__ import annotations

import json
import sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
dump_path = ROOT / "homeassistant" / "data" / "dsc_strains_alchimia.json"
ck_path = ROOT / "homeassistant" / "data" / "dsc_strains_alchimia.checkpoint.json"
sm_path = ROOT / "homeassistant" / "data" / "dsc_strains_alchimia.sitemap_urls.json"
db_path = ROOT / "brain" / "data" / "staging" / "alchimia.sqlite3"

d = json.loads(dump_path.read_text(encoding="utf-8"))
ck = json.loads(ck_path.read_text(encoding="utf-8"))
sm = json.loads(sm_path.read_text(encoding="utf-8"))
items = d.get("items") or []

breeders: dict[str, int] = {}
seed_types: dict[str, int] = {}
with_thc = with_genetics = with_breeder = 0
for i in items:
    b = (i.get("breeder") or "").strip() or "(none)"
    breeders[b] = breeders.get(b, 0) + 1
    st = (i.get("seed_type") or "").strip() or "(none)"
    seed_types[st] = seed_types.get(st, 0) + 1
    if i.get("thc_range") or i.get("thc") or i.get("thc_label"):
        with_thc += 1
    if i.get("genetics") or i.get("lineage"):
        with_genetics += 1
    if i.get("breeder"):
        with_breeder += 1

print("DUMP count", d.get("count"))
print("DUMP redistributable", d.get("redistributable"))
print("DUMP sitemap_urls", d.get("sitemap_urls"))
print("DUMP skipped_non_seed", d.get("skipped_non_seed"))
print("CK done", ck.get("done_count"), "skipped", ck.get("skipped_count"), "errors", len(ck.get("errors") or []))
print("SITEMAP cached", sm.get("count"))
print("seed_types", dict(sorted(seed_types.items(), key=lambda x: -x[1])))
print("top_breeders", sorted(breeders.items(), key=lambda x: -x[1])[:10])
print("coverage breeder/thc/genetics", with_breeder, with_thc, with_genetics)

con = sqlite3.connect(str(db_path))
print(
    "STAGING",
    {
        "raw_record": con.execute("SELECT COUNT(*) FROM raw_record").fetchone()[0],
        "strain_canonical": con.execute("SELECT COUNT(*) FROM strain_canonical").fetchone()[0],
        "strain_variant": con.execute("SELECT COUNT(*) FROM strain_variant").fetchone()[0],
        "source": con.execute(
            "SELECT id, redistributable, license FROM source_record"
        ).fetchall(),
    },
)
con.close()
print("sizes dump/staging MB", round(dump_path.stat().st_size / 1e6, 2), round(db_path.stat().st_size / 1e6, 2))
