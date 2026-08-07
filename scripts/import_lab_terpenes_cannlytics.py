#!/usr/bin/env python3
"""Import Cannlytics lab results (Hugging Face) into chemistry dump.

Uses product_name as strain name when present; stores ALL columns in each row.
"""

from __future__ import annotations

import csv
import io
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from catalog_common import DATA, fetch_text, name_norm, write_dump  # noqa: E402

OUT = DATA / "dsc_lab_terpenes_cannlytics.json"
# Prefer state CSVs (tens of MB). Skip data/all (~2.5GB) unless --all.
URLS = [
    "https://huggingface.co/datasets/cannlytics/cannabis_results/resolve/main/data/md/md-results-latest.csv",
    "https://huggingface.co/datasets/cannlytics/cannabis_results/resolve/main/data/ca/ca-results-latest.csv",
    "https://huggingface.co/datasets/cannlytics/cannabis_results/resolve/main/data/or/or-results-latest.csv",
]


def main() -> int:
    import argparse

    ap = argparse.ArgumentParser()
    ap.add_argument("--max-rows", type=int, default=50000, help="cap rows (science sample floor)")
    ap.add_argument("--all-states-small", action="store_true")
    args = ap.parse_args()

    urls = list(URLS)
    text = None
    used = None
    errors = []
    items = []
    for url in urls:
        try:
            print(f"fetching {url} …")
            text = fetch_text(url, timeout=600)
            used = url
            break
        except Exception as exc:  # noqa: BLE001
            errors.append(f"{url}: {exc}")
    if not text:
        print("Cannlytics import failed:\n " + "\n ".join(errors))
        return 1

    reader = csv.DictReader(io.StringIO(text))
    for r in reader:
        name = str(
            r.get("strain_name")
            or r.get("product_name")
            or r.get("variety")
            or r.get("name")
            or ""
        ).strip()
        if not name:
            continue
        # Skip obvious non-flower SKUs lightly
        ptype = str(r.get("product_type") or "").lower()
        if ptype and ptype not in {"", "flower", "bud", "plant", "strain"} and "flower" not in ptype:
            # still keep — maximize capture — but tag
            pass
        row = {k: v for k, v in r.items() if v not in (None, "")}
        row["name"] = name
        row["name_norm"] = name_norm(name)
        # chemistry summary
        try:
            thc = float(r["total_thc"]) if r.get("total_thc") not in (None, "") else None
        except ValueError:
            thc = None
        try:
            cbd = float(r["total_cbd"]) if r.get("total_cbd") not in (None, "") else None
        except ValueError:
            cbd = None
        chem = {}
        if thc is not None:
            chem["thc_range"] = [thc, thc]
        if cbd is not None:
            chem["cbd_range"] = [cbd, cbd]
        # collect terpene columns dynamically
        terps = []
        for k, v in r.items():
            lk = (k or "").lower()
            if "terp" in lk or lk.endswith("_pct") or lk in {"myrcene", "limonene", "caryophyllene", "pinene", "linalool", "humulene", "terpinolene", "ocimene"}:
                try:
                    fv = float(v)
                except (TypeError, ValueError):
                    continue
                if fv > 0:
                    terps.append((k, fv))
        terps.sort(key=lambda x: x[1], reverse=True)
        if terps:
            chem["top_terpenes"] = [t[0] for t in terps[:5]]
            chem["terpene_values"] = {t[0]: t[1] for t in terps[:20]}
        if chem:
            row["chemistry"] = chem
        row["source"] = "cannlytics_hf"
        items.append(row)
        if len(items) >= args.max_rows:
            break

    write_dump(
        OUT,
        "lab_chemistry",
        items,
        source="cannlytics",
        source_url=used,
        license="CC-BY-4.0",
        redistributable=True,
        errors=errors,
        truncated=len(items) >= args.max_rows,
    )
    print(f"wrote {OUT} count={len(items)} from {used}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
