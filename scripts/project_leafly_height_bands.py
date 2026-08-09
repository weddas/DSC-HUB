#!/usr/bin/env python3
"""D-N087-HEIGHT-BAND: project Leafly Short/Medium/Tall into typed grow_trait payload.

Never invents cm ranges. Writes staging family `leafly_height_bands` only.
Merge later: python scripts/merge_staging_to_master.py --only leafly_height_bands --no-link --no-search
"""

from __future__ import annotations

import argparse
import json
import sqlite3
import sys
import time
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from brain.dsc_brain.corpus import connect, ensure_source, ingest_strain_row  # noqa: E402
from brain.dsc_brain.paths import STAGING_DIR  # noqa: E402
from brain.dsc_brain.staging import init_staging  # noqa: E402

SRC_STAGING = STAGING_DIR / "leafly_flat_enrich.sqlite3"
BAND_ORDINAL = {
    "short": 1,
    "medium": 2,
    "med": 2,
    "tall": 3,
}


def normalize_band(raw: Any) -> str | None:
    if raw is None:
        return None
    s = str(raw).strip().lower()
    if not s:
        return None
    # Exact categorical labels only — never parse "120cm" into a band.
    if s in BAND_ORDINAL:
        return "Short" if s == "short" else ("Medium" if s in ("medium", "med") else "Tall")
    return None


def extract_height(payload: dict[str, Any]) -> Any:
    grow = payload.get("grow")
    if isinstance(grow, dict) and grow.get("height") not in (None, ""):
        return grow.get("height")
    return payload.get("height")


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--source-staging", type=Path, default=SRC_STAGING)
    ap.add_argument("--reset", action="store_true")
    args = ap.parse_args(argv)

    if not args.source_staging.exists():
        print(f"missing source staging: {args.source_staging}")
        return 2

    if args.reset:
        dest = STAGING_DIR / "leafly_height_bands.sqlite3"
        if dest.exists():
            dest.unlink()
            print(f"reset {dest}")

    family = init_staging(
        "leafly_height_bands",
        note="Leafly height categorical → ordinal payload only; no invented cm",
    )
    out = connect(family)
    ensure_source(
        out,
        "leafly_height_bands",
        "Leafly height bands (projected)",
        url="https://www.leafly.com/",
        license="research projection from local Leafly flat enrich",
        redistributable=False,
        note="height_band + height_ordinal only; never invents cm",
    )
    out.commit()

    src = sqlite3.connect(f"file:{args.source_staging.as_posix()}?mode=ro", uri=True)
    src.row_factory = sqlite3.Row
    rows = src.execute(
        "SELECT id, name_norm, name, payload_json FROM chemistry_profile "
        "WHERE payload_json IS NOT NULL AND payload_json != ''"
    ).fetchall()

    counts = {"scanned": 0, "with_height": 0, "banded": 0, "skipped_unknown": 0}
    band_hist: dict[str, int] = {}
    for row in rows:
        counts["scanned"] += 1
        try:
            payload = json.loads(row["payload_json"] or "{}")
        except json.JSONDecodeError:
            continue
        if not isinstance(payload, dict):
            continue
        raw_h = extract_height(payload)
        if raw_h in (None, ""):
            continue
        counts["with_height"] += 1
        band = normalize_band(raw_h)
        if not band:
            counts["skipped_unknown"] += 1
            continue
        ordinal = BAND_ORDINAL[band.lower() if band.lower() != "medium" else "medium"]
        band_hist[band] = band_hist.get(band, 0) + 1
        name = str(row["name"] or payload.get("name") or row["name_norm"] or "").strip()
        if not name:
            continue
        grow_payload = {
            "height_band": band,
            "height_ordinal": ordinal,
            "height_source": "leafly_grow_height",
            "height_raw": str(raw_h),
            # Explicit: no cm invention
            "height_cm_min": None,
            "height_cm_max": None,
        }
        strain = {
            "name": name,
            "name_norm": row["name_norm"] or name,
            "source": "leafly_height_bands",
            "props": {"height_band": band, "height_ordinal": ordinal},
            "grow": grow_payload,
        }
        ingest_strain_row(
            out,
            strain,
            source_id="leafly_height_bands",
            store_attrs=False,
            store_raw=True,
        )
        counts["banded"] += 1

    out.commit()
    src.close()
    out.close()
    print(
        json.dumps(
            {
                "family": str(family),
                "counts": counts,
                "band_hist": band_hist,
                "built_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                "merge": "python scripts/merge_staging_to_master.py --only leafly_height_bands --no-link --no-search",
            },
            indent=2,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
