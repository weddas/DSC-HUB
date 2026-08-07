#!/usr/bin/env python3
"""One-shot patcher: turn scrape_breeder_tier_c.py into a real Tier C scraper."""
from __future__ import annotations

from pathlib import Path

p = Path(__file__).resolve().parents[1] / "scripts" / "scrape_breeder_tier_c.py"
text = p.read_text(encoding="utf-8")

new_head = '''#!/usr/bin/env python3
"""Fan-out Tier C breeder storefront scrape from _breeder_scrape_queue_1482.json.

Dump + staging only (NO master merge). Quick-skip CF/SPA; scrape when
Shopify products.json or sitemap/API is clear. No StrainDB. No master merge.

Claim locks under homeassistant/data/_breeder_claims/ so A/B/C siblings do not
fight the same slug.
"""

from __future__ import annotations

import argparse
import html as html_lib
import json
import re
import sys
import time
from pathlib import Path
from typing import Any
from urllib.parse import urljoin, urlparse

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(ROOT))

from catalog_common import DATA, name_norm, polite_get, write_dump, parse_grow_fields  # noqa: E402
from catalog_fetch import Checkpoint  # noqa: E402
from brain.dsc_brain.paths import sanitize_source_slug  # noqa: E402
from brain.dsc_brain.staging import write_dump_to_staging  # noqa: E402

LICENSE = "research archival scrape; redistributable=false until legal review"
QUEUE = DATA / "_breeder_scrape_queue_1482.json"
CLAIM_DIR = DATA / "_breeder_claims"
# Half-specific paths set in main() so first/second halves do not clobber each other.
PROGRESS = DATA / "_tier_c_first_half_progress.json"
RESULTS = DATA / "_tier_c_first_half_results.json"
TIER = "C"


def half_paths(half: str) -> tuple[Path, Path]:
    tag = "first" if half.startswith("f") else "second"
    return (
        DATA / f"_tier_c_{tag}_half_progress.json",
        DATA / f"_tier_c_{tag}_half_results.json",
    )

'''
text = new_head + "SKIP_HOST_FRAGMENTS" + text.split("SKIP_HOST_FRAGMENTS", 1)[1]

if '"straindb"' not in text:
    text = text.replace(
        '"strain-database",\n',
        '"strain-database",\n    "straindatabase",\n    "straindb",\n',
    )

text = text.replace(
    """def stage_dump(bank: str, *, reset: bool = True) -> dict:
    from brain.dsc_brain.staging import write_dump_to_staging  # noqa: WPS433

    out = DATA / f\"dsc_strains_{bank}.json\"
""",
    """def stage_dump(bank: str, *, reset: bool = True) -> dict:
    out = DATA / f\"dsc_strains_{bank}.json\"
""",
)

text = text.replace('tier="B",', "tier=TIER,")

repls = [
    (
        'help="Claim owner (default tier_b_<half>_half)"',
        'help="Claim owner (default tier_c_<half>_half)"',
    ),
    (
        'ap.add_argument("--delay", type=float, default=0.7)',
        'ap.add_argument("--delay", type=float, default=0.55)',
    ),
    (
        'ap.add_argument("--max-html", type=int, default=400)',
        'ap.add_argument("--max-html", type=int, default=200)',
    ),
    (
        'owner = args.owner or f"tier_b_{args.half}_half"',
        'owner = args.owner or f"tier_c_{args.half}_half"',
    ),
    (
        "queue complete tier_B={qpeek.get('counts', {}).get('tier_B')}",
        "queue complete tier_C={qpeek.get('counts', {}).get('tier_C')}",
    ),
    (
        "waiting queue… partial tier_B={qpeek.get('counts', {}).get('tier_B')} ",
        "waiting queue… partial tier_C={qpeek.get('counts', {}).get('tier_C')} ",
    ),
    (
        "waiting queue. partial tier_B={qpeek.get('counts', {}).get('tier_B')} ",
        "waiting queue… partial tier_C={qpeek.get('counts', {}).get('tier_C')} ",
    ),
    (
        'f"Tier B {args.half} half pass {pass_i + 1}/{args.passes}: "',
        'f"Tier C {args.half} half pass {pass_i + 1}/{args.passes}: "',
    ),
    (
        "tier_B={qdoc.get('counts', {}).get('tier_B')})",
        "tier_C={qdoc.get('counts', {}).get('tier_C')})",
    ),
]
for a, b in repls:
    text = text.replace(a, b)

old_skip = """        tier_a = {
            str(x.get("name_norm") or "").lower()
            for x in (qdoc.get("tiers", {}).get("A") or [])
        }"""
new_skip = """        sibling_tiers = {
            str(x.get("name_norm") or "").lower()
            for t in ("A", "B")
            for x in (qdoc.get("tiers", {}).get(t) or [])
        }"""
if old_skip in text:
    text = text.replace(old_skip, new_skip)
    text = text.replace("if nn in tier_a:", "if nn in sibling_tiers:")
    text = text.replace('"status": "skipped_tier_a_sibling"', '"status": "skipped_higher_tier"')
    text = text.replace('"note": "name also in Tier A"', '"note": "name also in Tier A/B"')
    text = text.replace(
        'print(f"SKIP Tier A overlap: {entry.get(\'name\')}", flush=True)',
        'print(f"SKIP A/B overlap: {entry.get(\'name\')}", flush=True)',
    )

# Ensure load_queue_slice targets C
old_load = '''def load_queue_slice(*, half: str) -> tuple[dict, list[dict]]:
    d = json.loads(QUEUE.read_text(encoding="utf-8"))
    b = list(d.get("tiers", {}).get("B") or [])
    # Prefer classifier partitions when present (stable slice indices).
    part_key = "tier_B_first_half" if half.startswith("f") else "tier_B_second_half"
    part = (d.get("partitions") or {}).get(part_key)
    if isinstance(part, dict) and isinstance(part.get("slice"), list) and len(part["slice"]) == 2:
        start, end = int(part["slice"][0]), int(part["slice"][1])
        slice_ = b[start:end]
        return d, slice_
    mid = (len(b) + 1) // 2
    slice_ = b[:mid] if half.startswith("f") else b[mid:]
    return d, slice_
'''
new_load = '''def load_queue_slice(*, half: str) -> tuple[dict, list[dict]]:
    d = json.loads(QUEUE.read_text(encoding="utf-8"))
    c = list(d.get("tiers", {}).get("C") or [])
    # Prefer classifier partitions when present (stable slice indices).
    part_key = "tier_C_first_half" if half.startswith("f") else "tier_C_second_half"
    part = (d.get("partitions") or {}).get(part_key)
    if isinstance(part, dict) and isinstance(part.get("slice"), list) and len(part["slice"]) == 2:
        start, end = int(part["slice"][0]), int(part["slice"][1])
        slice_ = c[start:end]
        return d, slice_
    mid = (len(c) + 1) // 2
    slice_ = c[:mid] if half.startswith("f") else c[mid:]
    return d, slice_
'''
if old_load in text:
    text = text.replace(old_load, new_load)

# Quick-skip: when home_link_scan would run on thin_body/not_seedish, bail empty.
needle = """        elif is_shopify:
            result["status"] = "empty_shopify"
            result["note"] = "shopify signals but no products.json / sitemap products"
            return result
        else:
            # Magento/other: one more short attempt — collections or shop page links
            method = "home_link_scan"
"""
insert = """        elif is_shopify:
            result["status"] = "empty_shopify"
            result["note"] = "shopify signals but no products.json / sitemap products"
            return result
        else:
            # Tier C: thin/not-seedish homes rarely yield PDPs via link scan — skip fast.
            sigs = set(entry.get("signals") or [])
            if ("thin_body" in sigs or "not_seedish" in sigs) and not (
                {"jsonld_product", "product_paths", "wordpress"} & sigs
            ):
                result["status"] = "skipped_thin_or_not_seedish"
                result["note"] = "no sitemap/API products; classifier signals thin/not_seedish"
                return result
            # Magento/other: one more short attempt — collections or shop page links
            method = "home_link_scan"
"""
if needle in text and "skipped_thin_or_not_seedish" not in text:
    text = text.replace(needle, insert)

# Faster home probe timeout for Tier C
text = text.replace(
    "home, herr = soft_get(url, delay=delay, timeout=40)",
    "home, herr = soft_get(url, delay=delay, timeout=25)",
)

p.write_text(text, encoding="utf-8")
t2 = p.read_text(encoding="utf-8")
assert 'TIER = "C"' in t2
assert "_tier_c_" in t2
assert 'tier_c_{args.half}' in t2
assert 'get("C")' in t2
assert "write_dump_to_staging  # noqa: E402" in t2
assert "from brain.dsc_brain.staging import write_dump_to_staging  # noqa: WPS433" not in t2
assert "tier_C_first_half" in t2
print("patched", p, "bytes", p.stat().st_size)
