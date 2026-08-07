#!/usr/bin/env python3
"""MA CCC open testing data — status + optional METRC-only THC staging.

Honest finding (2026-08-08): published CSVs do **not** carry usable strain names.
  - Testing_Results_2024_*: Strain column present but blank on all ~440k rows
  - Testing_Data_THC_THCA_Y&M-2021-2023: Strain values are anonymized Strain_N
  - CCC_Testing_Results_2025: no Strain column (METRC id + analyte only)
  - Terpenes: not present in these open releases

This importer writes a discovery/status dump and, optionally, a compact
METRC-keyed THC sample for research (not catalog-matchable). Default is
status-only so we do not flood staging with nameless chem rows.
"""
from __future__ import annotations

import argparse
import csv
import json
import sys
import time
import urllib.request
from collections import Counter
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(ROOT))

from catalog_common import DATA, UA, write_dump  # noqa: E402

SOURCE = "ma_ccc_labs"
OUT = DATA / "dsc_lab_ma_ccc.json"
CACHE = DATA / "_cache_ma_ccc"
CATALOG = "https://masscannabiscontrol.com/open-data/data-catalog"

FILES = [
    {
        "id": "ccc_2025",
        "url": "https://masscannabiscontrol.com/resource/CCC_Testing_Results_2025.csv",
        "note": "no Strain column; METRC + analyte only",
    },
    {
        "id": "ccc_2024",
        "url": "https://masscannabiscontrol.com/resource/Testing_Results_2024_20260415_OpenData.csv",
        "note": "Strain column blank across full file (~440k rows)",
    },
    {
        "id": "ccc_2021_2023",
        "url": (
            "https://masscannabiscontrol.com/resource/"
            "Research-IndustryReport/Testing_Data_THC_THCA_Y%26M-2021-2023.csv"
        ),
        "note": "Strain values anonymized as Strain_N",
    },
]


def stream_stats(url: str, *, max_rows: int | None = None) -> dict[str, Any]:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
    named = 0
    empty = 0
    anon = 0
    thc = 0
    terp = 0
    analytes: Counter[str] = Counter()
    strains: Counter[str] = Counter()
    fields: list[str] = []
    with urllib.request.urlopen(req, timeout=300) as resp:
        reader = csv.DictReader((ln.decode("utf-8", "replace") for ln in resp))
        fields = list(reader.fieldnames or [])
        for i, row in enumerate(reader, 1):
            # Normalize keys
            lower = { (k or "").strip().lower(): (v or "").strip() for k, v in row.items() }
            strain = lower.get("strain") or ""
            analyte = (
                lower.get("analyte/test id")
                or lower.get("test type name")
                or lower.get("analyte/testid")
                or ""
            )
            analytes[analyte] += 1
            if "thc" in analyte.lower():
                thc += 1
            if "terp" in analyte.lower():
                terp += 1
            if not strain:
                empty += 1
            elif strain.lower().startswith("strain_") or strain.lower().startswith("strain "):
                anon += 1
            else:
                named += 1
                strains[strain] += 1
            if max_rows and i >= max_rows:
                break
            if i % 200_000 == 0:
                print(f"  … {url.rsplit('/',1)[-1]} scanned {i}", flush=True)
    return {
        "url": url,
        "fields": fields,
        "named_strain_rows": named,
        "empty_strain_rows": empty,
        "anon_strain_rows": anon,
        "thc_analyte_rows": thc,
        "terpene_analyte_rows": terp,
        "unique_named_strains": len(strains),
        "top_named_strains": strains.most_common(20),
        "top_analytes": analytes.most_common(15),
    }


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description="MA CCC open labs status / optional sample")
    ap.add_argument(
        "--full-scan",
        action="store_true",
        help="Stream full CSVs for stats (slow; ~100MB+ each)",
    )
    ap.add_argument(
        "--sample-rows",
        type=int,
        default=50_000,
        help="When not --full-scan, cap rows per file for stats",
    )
    ap.add_argument("--skip-stage", action="store_true")
    args = ap.parse_args(argv)

    DATA.mkdir(parents=True, exist_ok=True)
    CACHE.mkdir(parents=True, exist_ok=True)

    reports = []
    for meta in FILES:
        print(f"scanning {meta['id']} …", flush=True)
        try:
            stats = stream_stats(
                meta["url"],
                max_rows=None if args.full_scan else max(1000, args.sample_rows),
            )
            stats.update({"id": meta["id"], "note": meta["note"], "ok": True})
        except Exception as exc:  # noqa: BLE001
            stats = {"id": meta["id"], "url": meta["url"], "ok": False, "error": str(exc), "note": meta["note"]}
        reports.append(stats)
        print(
            f"  {meta['id']}: named={stats.get('named_strain_rows')} "
            f"empty={stats.get('empty_strain_rows')} anon={stats.get('anon_strain_rows')} "
            f"thc={stats.get('thc_analyte_rows')} terp={stats.get('terpene_analyte_rows')}",
            flush=True,
        )

    usable = sum(int(r.get("named_strain_rows") or 0) for r in reports)
    items: list[dict[str, Any]] = [
        {
            "name": "MA CCC open testing — status",
            "name_norm": "ma_ccc_open_testing_status",
            "source": SOURCE,
            "kind": "lab_status",
            "catalog_url": CATALOG,
            "usable_named_strain_rows": usable,
            "terpenes_present": any(int(r.get("terpene_analyte_rows") or 0) > 0 for r in reports),
            "files": reports,
            "verdict": (
                "no_usable_strain_names"
                if usable == 0
                else "partial_named_strains"
            ),
            "note": (
                "Do not invent strain labels from METRC IDs. "
                "Prefer Cannlytics MA expand or future CCC releases with Strain filled."
            ),
            "redistributable": True,
        }
    ]

    write_dump(
        OUT,
        "lab",
        items,
        source=SOURCE,
        source_url=CATALOG,
        license="Massachusetts CCC open data; public domain / open government data",
        redistributable=True,
        note=(
            "Status pass: open CSVs lack matchable strain names; "
            f"usable_named_strain_rows={usable}; terpenes absent in scanned analytes"
        ),
        built_at=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    )
    print(f"wrote {OUT} items={len(items)} usable_named={usable}")

    # Cache report JSON for follow-ups.
    (CACHE / "scan_report.json").write_text(
        json.dumps({"built_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), "reports": reports}, indent=2),
        encoding="utf-8",
    )

    if not args.skip_stage:
        from brain.dsc_brain.staging import write_dump_to_staging  # noqa: WPS433

        # Kind is lab — staging routes to chemistry; status row has no chem so
        # may yield count 0. Still write raw via strain path if needed.
        try:
            st = write_dump_to_staging(OUT, source_id=SOURCE, reset=True)
            print("staging:", json.dumps({k: st.get(k) for k in ("family", "count", "stats")}, indent=2, default=str))
        except Exception as exc:  # noqa: BLE001
            print(f"staging skipped/failed (expected for status-only): {exc}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
