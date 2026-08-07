#!/usr/bin/env python3
"""Import North Atlantic Seed Co scrape JSON → dump → staging → master.

Source (DB DUMP):
  cannabis-intelligence-database-main/**/north_atlantic_strains_comprehensive.json

Filters login-wall scrapes, multipack/bundle SKUs, and non-strain merch.
Staging keeps full raw_record; master merge is typed only (no attribute_kv).
redistributable=false (research scrape).
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(ROOT))

from catalog_common import DATA, name_norm, parse_grow_fields, write_dump  # noqa: E402
from brain.dsc_brain.staging import write_dump_to_staging  # noqa: E402
from merge_staging_to_master import main as merge_main  # noqa: E402

OUT = DATA / "dsc_strains_northatlantic.json"
SOURCE_ID = "northatlantic"
DEFAULT_DUMP = Path(r"y:\Digital Stealth Care\Projects\DB DUMP")

LOCAL_GLOBS = (
    "**/north_atlantic_strains_comprehensive.json",
    "**/north_atlantic*.json",
)

MERCH_NAME_RE = re.compile(
    r"(t-?shirt|hoodie|crewneck|sticker|poster|prints?|snapback|corduroy\s+hat|"
    r"hat\s*&\s*pins|\bpins\b|gift\s*card|display\s*case|rotating\s*countertop|"
    r"standing\s*banner|wooden\s+display|nasc\s+displays?)",
    re.I,
)
MERCH_TITLE_RE = re.compile(
    r"(t-?shirt|hoodie|crewneck|sticker\s*pack|poster|prints?|snapback|corduroy\s+hat|"
    r"hat\s*&\s*pins|dirty\s+bird\s+pins|gift\s*card|display\s*case|"
    r"rotating\s*countertop|standing\s*banner|wooden\s+display)",
    re.I,
)
BUNDLE_RE = re.compile(r"\b(bundle|multipack|multi[- ]?pack|variety\s*packs?)\b", re.I)
PCT_RE = re.compile(r"(\d+(?:\.\d+)?)\s*(?:%|percent)?", re.I)
RANGE_RE = re.compile(r"(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)")


def find_source(dump_root: Path) -> Path | None:
    root = dump_root / "cannabis-intelligence-database-main"
    search_roots = [root if root.is_dir() else dump_root, dump_root]
    for base in search_roots:
        if not base.is_dir():
            continue
        for pattern in LOCAL_GLOBS:
            matches = sorted(base.glob(pattern))
            # Prefer the comprehensive scrape over any smaller sibling.
            for m in matches:
                if m.name == "north_atlantic_strains_comprehensive.json":
                    return m
            if matches:
                return matches[0]
    return None


def junk_reason(row: dict[str, Any]) -> str | None:
    """Return filter reason or None if the row looks like a real strain SKU."""
    name = str(row.get("strain_name") or row.get("name") or "").strip()
    title = str(row.get("page_title") or "").strip()
    url = str(row.get("source_url") or row.get("url") or "").strip()
    if not name:
        return "empty_name"
    if "wholesale login" in title.lower():
        return "login_page"
    if BUNDLE_RE.search(name) or BUNDLE_RE.search(title):
        return "bundle_pack"
    if re.search(r"\bmultiple\b", name, re.I) and "multipack" in title.lower():
        return "bundle_pack"
    if MERCH_NAME_RE.search(name) or MERCH_TITLE_RE.search(title):
        return "merch"
    if "freebies" in name.lower() or "not-for-resale" in url.lower() or "not for resale" in name.lower():
        return "non_strain"
    if re.search(r"\b(collectors?\s+box|seed\s+menu)\b", name, re.I) or re.search(
        r"\b(collectors?\s+box|seed\s+menu)\b", title, re.I
    ):
        return "non_strain"
    return None


def _split_list(val: Any) -> list[str]:
    if val in (None, "", "NULL", "None", "budz"):
        return []
    if isinstance(val, list):
        return [str(x).strip() for x in val if str(x).strip() and str(x).strip().lower() != "budz"]
    s = str(val).strip()
    if s.lower() == "budz":
        return []
    if s.startswith("[") and s.endswith("]"):
        try:
            parsed = json.loads(s.replace("'", '"'))
            if isinstance(parsed, list):
                return [str(x).strip() for x in parsed if str(x).strip() and str(x).strip().lower() != "budz"]
        except json.JSONDecodeError:
            pass
    return [x.strip() for x in re.split(r"[,|;/]", s) if x.strip() and x.strip().lower() != "budz"]


def _pct_range(val: Any) -> list[float] | None:
    if val in (None, ""):
        return None
    if isinstance(val, (int, float)):
        f = float(val)
        return [f, f]
    s = str(val).strip().replace("%", "")
    m = RANGE_RE.search(s)
    if m:
        return [float(m.group(1)), float(m.group(2))]
    m = PCT_RE.search(s)
    if m:
        f = float(m.group(1))
        return [f, f]
    return None


def _map_seed_type(seed_type: str | None, strain_type: str | None) -> str | None:
    blob = f"{seed_type or ''} {strain_type or ''}".lower()
    if "auto" in blob:
        return "auto"
    if "indica" in blob and "sativa" not in blob:
        return "indica"
    if "sativa" in blob and "indica" not in blob:
        return "sativa"
    if "hybrid" in blob:
        return "hybrid"
    if strain_type:
        return str(strain_type).strip().lower() or None
    return None


def row_from_raw(r: dict[str, Any]) -> dict[str, Any] | None:
    reason = junk_reason(r)
    if reason:
        return None
    name = str(r.get("strain_name") or "").strip()
    if not name:
        return None

    breeder = str(r.get("breeder") or r.get("seed_bank") or "North Atlantic Seed Company").strip()
    url = str(r.get("source_url") or "").strip() or None
    seed_type = str(r.get("seed_type") or "").strip() or None
    strain_type = str(r.get("strain_type") or "").strip() or None
    genetics = str(r.get("genetics") or "").strip() or None
    meta_desc = str(r.get("meta_description") or "").strip() or None
    if meta_desc and meta_desc.startswith("North Atlantic Seed Company is an award-winning"):
        meta_desc = None

    effects = _split_list(r.get("effects"))
    flavors = _split_list(r.get("flavors"))

    row: dict[str, Any] = {
        "name": name,
        "name_norm": name_norm(name),
        "breeder": breeder,
        "seed_bank": str(r.get("seed_bank") or "North Atlantic Seed Company").strip(),
        "source": SOURCE_ID,
    }
    typ = _map_seed_type(seed_type, strain_type)
    if typ:
        row["type"] = typ
    if seed_type:
        row["seed_type"] = seed_type
        if "feminized" in seed_type.lower() or seed_type.upper() in {"F", "FEM"}:
            row["seed_gender"] = "feminized"
        if "auto" in seed_type.lower():
            row["flowering_behavior"] = "autoflower"
    if url:
        row["url"] = url
        row["bank_url"] = url
    if genetics:
        # Cap lineage blob; full text stays in staging raw_record via dump item.
        row["lineage"] = genetics[:800] + ("…" if len(genetics) > 800 else "")
        row["genetics"] = genetics[:2000] + ("…" if len(genetics) > 2000 else "")
    if effects:
        row["effects"] = effects
        row["top_effects"] = effects[:5]
    if flavors:
        row["flavors"] = flavors
        row["top_flavors"] = flavors[:5]
    if meta_desc:
        row["description"] = meta_desc[:1500]

    chem: dict[str, Any] = {}
    thc = _pct_range(r.get("thc_content"))
    cbd = _pct_range(r.get("cbd_content"))
    if thc:
        chem["thc_range"] = thc
        row["thc_range"] = thc
    if cbd:
        chem["cbd_range"] = cbd
        row["cbd_range"] = cbd
    if chem:
        row["chemistry"] = chem

    # Typed grow fields when present
    for src, dst in (
        ("flowering_time", "flowering_time"),
        ("height", "height"),
        ("indoor_yield", "yield_indoor"),
        ("outdoor_yield", "yield_outdoor"),
        ("yield_info", "yield_indoor"),
    ):
        val = r.get(src)
        if val not in (None, "", [], {}) and dst not in row:
            row[dst] = val if not isinstance(val, str) else val.strip()

    blob = " ".join(
        str(row.get(k) or "")
        for k in ("flowering_time", "height", "yield_indoor", "yield_outdoor", "genetics", "description")
    )
    if blob.strip():
        parsed = parse_grow_fields(blob)
        for k, v in parsed.items():
            if k == "chemistry" and isinstance(v, dict):
                chem = {**(row.get("chemistry") or {}), **v}
                row["chemistry"] = chem
                for ck, cv in v.items():
                    row.setdefault(ck, cv)
            elif k not in row or row[k] in (None, "", [], {}):
                row[k] = v

    return row


def build_items(raw_rows: list[Any]) -> tuple[list[dict], dict[str, int]]:
    items: list[dict] = []
    filtered: dict[str, int] = {}
    for r in raw_rows:
        if not isinstance(r, dict):
            filtered["non_object"] = filtered.get("non_object", 0) + 1
            continue
        reason = junk_reason(r)
        if reason:
            filtered[reason] = filtered.get(reason, 0) + 1
            continue
        row = row_from_raw(r)
        if not row:
            filtered["empty_name"] = filtered.get("empty_name", 0) + 1
            continue
        items.append(row)
    return items, filtered


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--dump-dir", type=Path, default=DEFAULT_DUMP)
    ap.add_argument("--input", type=Path, default=None, help="Explicit source JSON path")
    ap.add_argument("--skip-staging", action="store_true")
    ap.add_argument("--skip-merge", action="store_true")
    ap.add_argument("--no-link", action="store_true")
    ap.add_argument("--no-search", action="store_true")
    args = ap.parse_args(argv)

    src = args.input or find_source(args.dump_dir)
    if not src or not src.is_file():
        print(f"North Atlantic source JSON not found under {args.dump_dir}")
        return 1

    raw = json.loads(src.read_text(encoding="utf-8", errors="replace"))
    if not isinstance(raw, list):
        print(f"Expected JSON list in {src}")
        return 1

    items, filtered = build_items(raw)
    filtered_n = sum(filtered.values())
    write_dump(
        OUT,
        "strains",
        items,
        source=SOURCE_ID,
        source_url="https://www.northatlanticseed.com/",
        license="research archival scrape; redistributable=false",
        redistributable=False,
        note="research scrape; not for open export until legal review",
        local_source=str(src),
        filter_stats={"input": len(raw), "kept": len(items), "filtered": filtered_n, "by_reason": filtered},
    )
    print(
        f"dump: {OUT} kept={len(items)} filtered={filtered_n} "
        f"input={len(raw)} from {src}"
    )
    print(f"filter_by_reason: {json.dumps(filtered)}")

    staging_result = None
    if not args.skip_staging:
        staging_result = write_dump_to_staging(OUT, source_id=SOURCE_ID, reset=True)
        print(
            f"staging: {staging_result.get('staging_db')} "
            f"n={staging_result.get('count')} family={staging_result.get('family')}"
        )
        stats = staging_result.get("stats") or {}
        print(f"staging_stats: {json.dumps(stats, default=str)}")

    if not args.skip_merge:
        merge_argv = ["--only", "north_atlantic"]
        if args.no_link:
            merge_argv.append("--no-link")
        if args.no_search:
            merge_argv.append("--no-search")
        rc = merge_main(merge_argv)
        if rc != 0:
            return rc

    print(
        json.dumps(
            {
                "dump": str(OUT),
                "kept": len(items),
                "filtered": filtered_n,
                "filtered_by_reason": filtered,
                "input": len(raw),
                "source": SOURCE_ID,
                "from": str(src),
                "staging": staging_result,
            },
            indent=2,
            default=str,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
