#!/usr/bin/env python3
"""Import MaxValue terpene profile results.csv (GitHub) as lab chemistry."""

from __future__ import annotations

import csv
import io
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from catalog_common import DATA, fetch_text, name_norm, write_dump  # noqa: E402

OUT = DATA / "dsc_lab_terpenes_maxvalue.json"
URLS = [
    "https://raw.githubusercontent.com/MaxValue/Terpene-Profile-Parser-for-Cannabis-Strains/master/results.csv",
    "https://raw.githubusercontent.com/MaxValue/Terpene-Profile-Parser-for-Cannabis-Strains/main/results.csv",
]


def main() -> int:
    text = None
    used = None
    errors = []
    for url in URLS:
        try:
            text = fetch_text(url, timeout=180)
            used = url
            break
        except Exception as exc:  # noqa: BLE001
            errors.append(f"{url}: {exc}")
    if not text:
        print("MaxValue import failed:\n " + "\n ".join(errors))
        return 1

    reader = csv.DictReader(io.StringIO(text))
    items = []
    for r in reader:
        name = str(
            r.get("Sample Name")
            or r.get("sample_name")
            or r.get("strain")
            or r.get("Strain")
            or r.get("name")
            or r.get("sample")
            or ""
        ).strip()
        if not name:
            continue
        # Skip obvious non-strain product codes lightly — still keep (maximize)
        row = {k: v for k, v in r.items() if v not in (None, "")}
        row["name"] = name
        row["name_norm"] = name_norm(name)
        chem = {}
        terps = []
        for k, v in r.items():
            lk = (k or "").lower().replace(" ", "_").replace("-", "_")
            if lk in {
                "thc",
                "total_thc",
                "d9_thc",
                "delta9_thc",
                "delta_9_thc",
                "thc_a",
                "delta_9_thc_a",
            }:
                try:
                    f = float(v)
                    # prefer max for range envelope
                    prev = chem.get("thc_range")
                    if prev:
                        chem["thc_range"] = [min(prev[0], f), max(prev[1], f)]
                    else:
                        chem["thc_range"] = [f, f]
                except (TypeError, ValueError):
                    pass
            if lk in {"cbd", "total_cbd", "cbd_a"}:
                try:
                    f = float(v)
                    prev = chem.get("cbd_range")
                    if prev:
                        chem["cbd_range"] = [min(prev[0], f), max(prev[1], f)]
                    else:
                        chem["cbd_range"] = [f, f]
                except (TypeError, ValueError):
                    pass
            # terpene / named compound columns (skip ids/meta)
            if lk in {
                "database_identifier",
                "database_name",
                "test_result_uid",
                "sample_name",
                "sample_type",
                "receipt_time",
                "test_time",
                "post_time",
                "provider",
                "moisture_content",
            }:
                continue
            try:
                fv = float(v)
            except (TypeError, ValueError):
                continue
            if fv <= 0:
                continue
            if any(
                t in lk
                for t in (
                    "myrcene",
                    "limonene",
                    "caryophyllene",
                    "pinene",
                    "linalool",
                    "humulene",
                    "terpinolene",
                    "ocimene",
                    "nerolidol",
                    "bisabolol",
                    "guaiol",
                    "eucalyptol",
                    "geraniol",
                    "camphene",
                    "carene",
                    "cymene",
                    "isopulegol",
                    "terpinene",
                )
            ):
                terps.append((k, fv))
        terps.sort(key=lambda x: x[1], reverse=True)
        if terps:
            chem["top_terpenes"] = [t[0] for t in terps[:5]]
            chem["terpene_values"] = {t[0]: t[1] for t in terps[:30]}
        if chem:
            row["chemistry"] = chem
        row["source"] = "maxvalue_terpene_github"
        items.append(row)

    write_dump(
        OUT,
        "lab_chemistry",
        items,
        source="maxvalue_terpenes",
        source_url=used,
        license="see upstream repo (research/open data)",
        redistributable=True,
        errors=errors,
    )
    print(f"wrote {OUT} count={len(items)} from {used}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
