#!/usr/bin/env python3
"""Import Phytochemical diversity lab CSV (Smith / cjsmith015) into DSC-HUB.

Policy (confirmed):
  - Maximize capture in staging raw_record + JSON dump (full lab rows, full terpene panels).
  - Master gets aggregated chemistry_profile per strain_slug with rich payload_json
    (full mean terpene panel, ranges, n_tests). No attribute_kv column explosion.
"""

from __future__ import annotations

import argparse
import csv
import io
import json
import sys
import time
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "scripts"))

from catalog_common import DATA, fetch_text, name_norm, write_dump  # noqa: E402
from brain.dsc_brain.corpus import (  # noqa: E402
    add_chemistry,
    add_link,
    connect,
    corpus_stats,
    ensure_source,
    store_raw_record,
    upsert_canonical,
)
from brain.dsc_brain.paths import DEFAULT_DB, staging_db_path  # noqa: E402
from brain.dsc_brain.staging import init_staging, resolve_source_family  # noqa: E402
from merge_staging_to_master import main as merge_main  # noqa: E402

SOURCE_ID = "phytochem_smith"
OUT = DATA / "dsc_lab_phytochemical_diversity.json"
REMOTE_URL = (
    "https://raw.githubusercontent.com/cjsmith015/phytochemical-diversity-cannabis/"
    "main/data/preproc_lab_data_pub_20220218.csv"
)
LOCAL_CANDIDATES = [
    Path(r"y:\Digital Stealth Care\Projects\DB DUMP")
    / "phytochemical-diversity-cannabis-main"
    / "data"
    / "preproc_lab_data_pub_20220218.csv",
    Path(r"y:\Digital Stealth Care\Projects\DB DUMP")
    / "preproc_lab_data_pub_20220218.csv",
]

TERP_COLS = (
    "myrcene",
    "limonene",
    "caryophyllene",
    "linalool",
    "humulene",
    "terpinolene",
    "a_pinene",
    "b_pinene",
    "bisabolol",
    "tot_ocimene",
    "camphene",
    "g_terpinene",
    "tot_nerolidol_ct",
    "a_terpinene",
)
CANNAB_EXTRA = ("tot_cbg", "tot_cbc", "tot_cbn", "tot_thcv", "total_terps")


def _f(val: Any) -> float | None:
    if val in (None, ""):
        return None
    try:
        return float(val)
    except (TypeError, ValueError):
        return None


def _clean(row: dict[str, Any]) -> dict[str, Any]:
    return {k: v for k, v in row.items() if v not in (None, "", [], {})}


def _slug_to_name(slug: str) -> str:
    return slug.replace("-", " ").strip()


def resolve_csv(*, prefer_local: bool = True) -> tuple[str, str]:
    if prefer_local:
        for path in LOCAL_CANDIDATES:
            if path.exists():
                return path.read_text(encoding="utf-8", errors="replace"), str(path)
    return fetch_text(REMOTE_URL, timeout=300), REMOTE_URL


def chemistry_from_row(r: dict[str, Any]) -> dict[str, Any]:
    """Per-lab-row chemistry with full terpene panel."""
    chem: dict[str, Any] = {}
    thc = _f(r.get("tot_thc"))
    cbd = _f(r.get("tot_cbd"))
    if thc is not None:
        chem["thc_range"] = [thc, thc]
        chem["tot_thc"] = thc
    if cbd is not None:
        chem["cbd_range"] = [cbd, cbd]
        chem["tot_cbd"] = cbd
    if r.get("chemotype"):
        chem["chemotype"] = r.get("chemotype")
    ratio = _f(r.get("chemotype_ratio"))
    if ratio is not None:
        chem["chemotype_ratio"] = ratio
    if r.get("top_terp_f"):
        chem["top_terp"] = r.get("top_terp_f")
    for col in CANNAB_EXTRA:
        v = _f(r.get(col))
        if v is not None:
            chem[col] = v
    terps: dict[str, float] = {}
    for col in TERP_COLS:
        v = _f(r.get(col))
        if v is not None:
            terps[col] = v
    if terps:
        ranked = sorted(terps.items(), key=lambda x: x[1], reverse=True)
        chem["terpene_values"] = terps
        chem["terpene_panel"] = terps
        chem["top_terpenes"] = [t[0] for t in ranked[:8] if t[1] > 0]
    return chem


def chem_from_bucket(b: dict[str, Any]) -> dict[str, Any]:
    chem: dict[str, Any] = {"n_tests": b["n"], "strain_slug": b["slug"]}
    if b["thc"]:
        thcs = sorted(b["thc"])
        chem["thc_range"] = [thcs[0], thcs[-1]]
        chem["thc_median"] = thcs[len(thcs) // 2]
        chem["thc_mean"] = sum(thcs) / len(thcs)
        chem["tot_thc"] = chem["thc_mean"]
    if b["cbd"]:
        cbds = sorted(b["cbd"])
        chem["cbd_range"] = [cbds[0], cbds[-1]]
        chem["cbd_median"] = cbds[len(cbds) // 2]
        chem["cbd_mean"] = sum(cbds) / len(cbds)
        chem["tot_cbd"] = chem["cbd_mean"]
    if b["chemotypes"]:
        chem["chemotype"] = b["chemotypes"].most_common(1)[0][0]
        chem["chemotype_counts"] = dict(b["chemotypes"])
    if b["top_terp_f"]:
        chem["top_terp"] = b["top_terp_f"].most_common(1)[0][0]
    for col, vals in b["cannabs"].items():
        if vals:
            chem[col] = sum(vals) / len(vals)
    terp_means: dict[str, float] = {}
    terp_ranges: dict[str, list[float]] = {}
    for col, vals in b["terps"].items():
        if not vals:
            continue
        terp_means[col] = sum(vals) / len(vals)
        terp_ranges[col] = [min(vals), max(vals)]
    if terp_means:
        ranked = sorted(terp_means.items(), key=lambda x: x[1], reverse=True)
        chem["terpene_values"] = terp_means
        chem["terpene_panel_mean"] = terp_means
        chem["terpene_panel_range"] = terp_ranges
        chem["top_terpenes"] = [t[0] for t in ranked[:8]]
    if b["categories"]:
        chem["strain_category"] = b["categories"].most_common(1)[0][0]
    if b["regions"]:
        chem["regions"] = [r for r, _ in b["regions"].most_common(20)]
    return chem


def parse_rows(text: str, *, max_rows: int = 0) -> tuple[list[dict], dict[str, dict], int, int]:
    """Return dump_items, agg buckets, total, anon."""
    dump_items: list[dict[str, Any]] = []
    buckets: dict[str, dict[str, Any]] = {}
    anon = 0
    total = 0
    for r in csv.DictReader(io.StringIO(text)):
        total += 1
        if max_rows and total > max_rows:
            total -= 1
            break
        payload = _clean(dict(r))
        slug = str(r.get("strain_slug") or "").strip()
        chem = chemistry_from_row(r)
        if not slug:
            anon += 1
            dump_items.append(
                {
                    **payload,
                    "name": None,
                    "name_norm": "",
                    "anonymous": True,
                    "chemistry": chem,
                    "source": SOURCE_ID,
                }
            )
            continue

        name = _slug_to_name(slug)
        nn = name_norm(name)
        dump_items.append(
            {
                **payload,
                "name": name,
                "name_norm": nn,
                "strain_slug": slug,
                "chemistry": chem,
                "source": SOURCE_ID,
            }
        )
        b = buckets.setdefault(
            slug,
            {
                "name": name,
                "slug": slug,
                "n": 0,
                "thc": [],
                "cbd": [],
                "cannabs": defaultdict(list),
                "terps": defaultdict(list),
                "chemotypes": Counter(),
                "categories": Counter(),
                "regions": Counter(),
                "top_terp_f": Counter(),
            },
        )
        b["n"] += 1
        thc = _f(r.get("tot_thc"))
        cbd = _f(r.get("tot_cbd"))
        if thc is not None:
            b["thc"].append(thc)
        if cbd is not None:
            b["cbd"].append(cbd)
        for col in CANNAB_EXTRA:
            v = _f(r.get(col))
            if v is not None:
                b["cannabs"][col].append(v)
        for col in TERP_COLS:
            v = _f(r.get(col))
            if v is not None:
                b["terps"][col].append(v)
        if r.get("chemotype"):
            b["chemotypes"][str(r["chemotype"])] += 1
        if r.get("strain_category"):
            b["categories"][str(r["strain_category"])] += 1
        if r.get("region"):
            b["regions"][str(r["region"])] += 1
        if r.get("top_terp_f"):
            b["top_terp_f"][str(r["top_terp_f"])] += 1
    return dump_items, buckets, total, anon


def write_staging(dump_items: list[dict], buckets: dict[str, dict], *, used: str) -> dict[str, Any]:
    family = resolve_source_family(SOURCE_ID)
    db_path = staging_db_path(family)
    if db_path.exists():
        db_path.unlink()
    init_staging(
        SOURCE_ID,
        note=(
            f"Full phytochem lab rows in raw_record; agg chemistry by strain_slug. "
            f"from={used}"
        ),
    )
    conn = connect(db_path)
    ensure_source(
        conn,
        SOURCE_ID,
        "Phytochemical diversity cannabis lab (Smith / cjsmith015)",
        url=REMOTE_URL,
        license="academic / research (verify upstream paper license)",
        redistributable=False,
        note="Full terpene panels in raw_record + dump; agg chem on master merge",
    )

    raw_n = 0
    for i, row in enumerate(dump_items):
        name = row.get("name")
        uid = row.get("u_id")
        if uid in (None, ""):
            uid = i
        if name:
            eid = f"{SOURCE_ID}:lab:{uid}"
            kind = "lab_row"
        else:
            eid = f"{SOURCE_ID}:anon:{uid}"
            kind = "lab_anon"
        store_raw_record(
            conn,
            source_id=SOURCE_ID,
            entity_kind=kind,
            entity_id=eid,
            name=name,
            payload=row,
            record_id=eid,
        )
        raw_n += 1
        if raw_n % 5000 == 0:
            conn.commit()
            print(f"  staging raw_record {raw_n}/{len(dump_items)}")

    chem_n = 0
    for slug, b in buckets.items():
        chem = chem_from_bucket(b)
        # Richer payload_json: aggregated chem + provenance (no attribute_kv).
        payload = {
            **chem,
            "source": SOURCE_ID,
            "lab_aggregate": True,
            "strain_slug": slug,
        }
        cid = add_chemistry(conn, b["name"], payload, source_id=SOURCE_ID)
        nn = name_norm(b["name"])
        upsert_canonical(conn, b["name"])
        add_link(
            conn,
            "chemistry_profile",
            cid,
            "strain_canonical",
            nn,
            method="phytochem_slug_agg",
            source=SOURCE_ID,
        )
        chem_n += 1

    conn.commit()
    stats = corpus_stats(conn)
    conn.close()
    return {
        "family": family,
        "staging_db": str(db_path),
        "raw_records": raw_n,
        "chemistry_profiles": chem_n,
        "unique_names": len(buckets),
        "stats": stats,
    }


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--remote", action="store_true", help="Prefer GitHub raw over local twin")
    ap.add_argument("--skip-staging", action="store_true")
    ap.add_argument("--skip-merge", action="store_true")
    ap.add_argument("--no-link", action="store_true")
    ap.add_argument("--no-search", action="store_true")
    ap.add_argument("--max-rows", type=int, default=0)
    args = ap.parse_args(argv)

    print("Resolving phytochem CSV ...")
    text, used = resolve_csv(prefer_local=not args.remote)
    print(f"source: {used}")

    dump_items, buckets, total, anon = parse_rows(text, max_rows=args.max_rows)
    unique_names = len(buckets)
    print(
        f"parsed rows={total} named={total - anon} anon={anon} "
        f"unique_slugs={unique_names}"
    )

    write_dump(
        OUT,
        "lab_chemistry",
        dump_items,
        source=SOURCE_ID,
        source_url=REMOTE_URL,
        license="academic / research (verify upstream paper license)",
        redistributable=False,
        note=(
            f"FULL phytochem lab rows (incl. anon) with terpene panels; "
            f"unique_slugs={unique_names}; staging family=phytochem_smith"
        ),
        local_path=used if not str(used).startswith("http") else None,
        unique_names=unique_names,
        anon_rows=anon,
        total_rows=total,
        terpene_cols=list(TERP_COLS),
    )
    print(f"wrote dump {OUT} count={len(dump_items)}")

    staging_result = None
    if not args.skip_staging:
        print("Writing staging (full raw_record + agg chemistry) ...")
        staging_result = write_staging(dump_items, buckets, used=used)
        print(
            f"staging: {staging_result['staging_db']} "
            f"raw={staging_result['raw_records']} "
            f"chem={staging_result['chemistry_profiles']}"
        )

    chem_before = None
    chem_after = None
    if not args.skip_merge:
        # Concurrent fan-out jobs often lock master on NAS; retry briefly.
        for attempt in range(40):
            try:
                master = connect(DEFAULT_DB)
                master.execute("PRAGMA busy_timeout=5000")
                master.execute("BEGIN IMMEDIATE")
                chem_before = master.execute(
                    "SELECT COUNT(*) FROM chemistry_profile"
                ).fetchone()[0]
                master.execute("ROLLBACK")
                master.close()
                break
            except Exception as exc:  # noqa: BLE001
                print(f"master locked (pre-merge) attempt={attempt}: {exc}", flush=True)
                try:
                    master.close()
                except Exception:
                    pass
                time.sleep(15)
        else:
            print("master still locked; staging+dump complete; merge skipped", flush=True)
            args.skip_merge = True

    if not args.skip_merge:
        merge_argv = ["--only", "phytochem_smith"]
        if args.no_link:
            merge_argv.append("--no-link")
        if args.no_search:
            merge_argv.append("--no-search")
        rc = merge_main(merge_argv)
        if rc != 0:
            return rc
        for attempt in range(20):
            try:
                master = connect(DEFAULT_DB)
                master.execute("PRAGMA busy_timeout=60000")
                chem_after = master.execute(
                    "SELECT COUNT(*) FROM chemistry_profile"
                ).fetchone()[0]
                master.close()
                break
            except Exception as exc:  # noqa: BLE001
                print(f"master locked (post-merge count) attempt={attempt}: {exc}", flush=True)
                time.sleep(10)

    out = {
        "rows_ingested": total,
        "dump_items": len(dump_items),
        "unique_names": unique_names,
        "anon_rows": anon,
        "staging_path": (staging_result or {}).get("staging_db"),
        "dump_path": str(OUT),
        "master_chem_before": chem_before,
        "master_chem_after": chem_after,
        "master_chem_delta": (
            None if chem_before is None or chem_after is None else chem_after - chem_before
        ),
        "built_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }
    print(json.dumps(out, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
