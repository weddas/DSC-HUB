#!/usr/bin/env python3
"""Import Cannabis Intelligence Database (MIT, ~15.7k strains) → dump → staging → master.

Prefers local DB DUMP CSV; falls back to GitHub raw. Staging keeps fuller raw_record;
master merge is typed only (no attribute_kv bomb).
"""

from __future__ import annotations

import argparse
import ast
import csv
import io
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(ROOT))

from catalog_common import DATA, fetch_text, name_norm, write_dump  # noqa: E402
from brain.dsc_brain.staging import write_dump_to_staging  # noqa: E402
from merge_staging_to_master import main as merge_main  # noqa: E402

OUT = DATA / "dsc_strains_cannabis_intelligence.json"
SOURCE_ID = "cannabis_intelligence"
URL = (
    "https://raw.githubusercontent.com/Shannon-Goddard/cannabis-intelligence-database/"
    "main/data/Cannabis_Intelligence_Database_15768_Strains_Final.csv"
)
LOCAL_CANDIDATES = [
    Path(r"Y:\Digital Stealth Care\Projects\DB DUMP")
    / "cannabis-intelligence-database-main"
    / "data"
    / "Cannabis_Intelligence_Database_15768_Strains_Final.csv",
    ROOT.parent / "DB DUMP" / "cannabis-intelligence-database-main" / "data"
    / "Cannabis_Intelligence_Database_15768_Strains_Final.csv",
]


def _fnum(val: str | None) -> float | None:
    if val in (None, "", "NULL", "null", "None", "nan", "NaN"):
        return None
    try:
        return float(str(val).replace("%", "").strip())
    except ValueError:
        return None


def _parse_list(val: str | None) -> list[str] | None:
    if val in (None, "", "NULL", "null", "[]"):
        return None
    text = str(val).strip()
    try:
        parsed = ast.literal_eval(text)
        if isinstance(parsed, (list, tuple)):
            out = [str(x).strip() for x in parsed if str(x).strip()]
            return out or None
    except (SyntaxError, ValueError):
        pass
    parts = [p.strip() for p in text.replace("|", ",").split(",") if p.strip()]
    return parts or None


def _range(lo: float | None, hi: float | None) -> list[float] | None:
    if lo is None and hi is None:
        return None
    if lo is None:
        return [hi, hi]  # type: ignore[list-item]
    if hi is None:
        return [lo, lo]
    a, b = (lo, hi) if lo <= hi else (hi, lo)
    return [a, b]


def _type_from_pct(sativa: float | None, indica: float | None) -> str | None:
    if sativa is None and indica is None:
        return None
    s = sativa if sativa is not None else (100.0 - indica if indica is not None else 0.0)
    i = indica if indica is not None else (100.0 - sativa if sativa is not None else 0.0)
    if s >= 70:
        return "sativa"
    if i >= 70:
        return "indica"
    return "hybrid"


def _load_csv_text() -> tuple[str, str]:
    for path in LOCAL_CANDIDATES:
        if path.is_file():
            return path.read_text(encoding="utf-8", errors="replace"), str(path)
    return fetch_text(URL, timeout=180), URL


def row_from_csv(r: dict) -> dict | None:
    name = str(r.get("strain_name") or r.get("name") or "").strip()
    if not name:
        return None
    breeder = str(r.get("breeder_name") or r.get("breeder") or "").strip() or None
    bank = str(r.get("bank_name") or r.get("bank") or "").strip() or None
    thc = _range(_fnum(r.get("thc_min")), _fnum(r.get("thc_max")))
    cbd = _range(_fnum(r.get("cbd_min")), _fnum(r.get("cbd_max")))
    f_lo = _fnum(r.get("flowering_time_min"))
    f_hi = _fnum(r.get("flowering_time_max"))
    flowering = _range(f_lo, f_hi)
    effects = _parse_list(r.get("effects"))
    flavors = _parse_list(r.get("flavors"))
    terpenes = _parse_list(r.get("terpenes"))
    sativa = _fnum(r.get("sativa_percentage"))
    indica = _fnum(r.get("indica_percentage"))
    about = str(r.get("about_info") or "").strip() or None

    row: dict = {
        "name": name,
        "name_norm": name_norm(name),
        "source": SOURCE_ID,
    }
    if breeder:
        row["breeder"] = breeder
    if bank:
        row["bank"] = bank
        row["bank_props"] = {"bank": bank}
    typ = _type_from_pct(sativa, indica)
    if typ:
        row["type"] = typ
    if sativa is not None:
        row["sativa_percentage"] = sativa
    if indica is not None:
        row["indica_percentage"] = indica
    if effects:
        row["effects"] = effects
        row["top_effects"] = effects
    if flavors:
        row["flavors"] = flavors
        row["top_flavors"] = flavors
    if flowering:
        row["flowering_days"] = flowering
    height = str(r.get("height_indoor") or "").strip()
    if height:
        row["height_indoor"] = height
    yield_u = str(r.get("yield_units") or "").strip()
    if yield_u:
        row["yield_indoor"] = yield_u
    difficulty = str(r.get("grow_difficulty") or "").strip()
    if difficulty:
        row["grow_difficulty"] = difficulty
    gender = str(r.get("seed_gender") or "").strip()
    if gender:
        row["seed_gender"] = gender
    behavior = str(r.get("flowering_behavior") or "").strip()
    if behavior:
        row["flowering_behavior"] = behavior
    if about:
        row["about_info"] = about
        row["description"] = about[:1500] + ("…" if len(about) > 1500 else "")
    src_url = str(r.get("source_url") or "").strip()
    if src_url:
        row["url"] = src_url
        row["bank_url"] = src_url
    strain_id = str(r.get("strain_id") or "").strip()
    if strain_id:
        row["external_id"] = strain_id

    chem: dict = {}
    if thc:
        chem["thc_range"] = thc
        row["thc_range"] = thc
    if cbd:
        chem["cbd_range"] = cbd
        row["cbd_range"] = cbd
    if terpenes:
        chem["top_terpenes"] = terpenes
        row["top_terpenes"] = terpenes
        row["terpenes"] = terpenes
    if chem:
        row["chemistry"] = chem
    return row


def build_items(text: str) -> list[dict]:
    items: list[dict] = []
    for r in csv.DictReader(io.StringIO(text)):
        row = row_from_csv(r)
        if row:
            items.append(row)
    return items


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--skip-staging", action="store_true")
    ap.add_argument("--skip-merge", action="store_true")
    ap.add_argument("--no-link", action="store_true")
    ap.add_argument("--no-search", action="store_true")
    args = ap.parse_args(argv)

    errors: list[str] = []
    try:
        text, used = _load_csv_text()
    except Exception as exc:  # noqa: BLE001
        print(f"Cannabis Intelligence import failed: {exc}")
        return 1

    items = build_items(text)
    write_dump(
        OUT,
        "strains",
        items,
        source=SOURCE_ID,
        source_url=URL,
        license="MIT",
        redistributable=True,
        note="Shannon-Goddard/cannabis-intelligence-database (~15740 strains)",
        local_source=used if used != URL else None,
        citation="Goddard / Loyal9 Cannabis Intelligence Database (MIT); Zenodo 10.5281/zenodo.17645958",
        errors=errors,
    )
    print(f"dump: {OUT} count={len(items)} from {used}")

    staging_result = None
    if not args.skip_staging:
        staging_result = write_dump_to_staging(OUT, source_id=SOURCE_ID, reset=True)
        print(
            f"staging: {staging_result.get('staging_db')} "
            f"n={staging_result.get('count')} family={staging_result.get('family')}"
        )
        stats = staging_result.get("stats") or {}
        print(f"staging_stats: {json.dumps(stats, default=str)}")

    merge_status: dict | str | None = None
    if not args.skip_merge:
        merge_argv = ["--only", "cannabis_intelligence"]
        if args.no_link:
            merge_argv.append("--no-link")
        if args.no_search:
            merge_argv.append("--no-search")
        # Concurrent fan-out often holds master; retry briefly then leave staging ready.
        import sqlite3
        import time

        rc = 1
        last_err = None
        for attempt in range(1, 7):
            try:
                rc = merge_main(merge_argv)
                last_err = None
                break
            except sqlite3.OperationalError as exc:
                last_err = str(exc)
                print(f"merge lock attempt {attempt}: {exc}", flush=True)
                time.sleep(10 * attempt)
        if last_err or rc != 0:
            merge_status = {
                "status": "deferred",
                "reason": last_err or f"merge_rc={rc}",
                "hint": "staging ready; run: python scripts/merge_staging_to_master.py --only cannabis_intelligence",
            }
            print(f"merge deferred: {merge_status}", flush=True)
        else:
            merge_status = {"status": "merged", "rc": rc}

    print(
        json.dumps(
            {
                "dump": str(OUT),
                "dump_count": len(items),
                "source": SOURCE_ID,
                "from": used,
                "staging": staging_result,
                "merge": merge_status,
            },
            indent=2,
            default=str,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
