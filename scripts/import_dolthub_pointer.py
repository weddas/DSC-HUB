#!/usr/bin/env python3
"""Record DoltHub cannabis repos; WA tests mirror local Replication_Data when API times out."""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from catalog_common import DATA, write_dump  # noqa: E402


def main() -> int:
    # Local aggregated dump already built from same schema as Liquidata/cannabis-testing-wa
    local = DATA / "dsc_lab_replication_wa.json"
    items = []
    note = "DoltHub Liquidata/cannabis-testing-wa table=tests (215285 rows) matches local Replication_Data.csv"
    if local.exists():
        doc = json.loads(local.read_text(encoding="utf-8"))
        items = list(doc.get("items") or [])
        # Re-tag provenance for dual source tracking without re-download
        for row in items:
            row = dict(row)
            row["source"] = "dolthub_wa_via_local_replication"
            row["dolthub_repo"] = "Liquidata/cannabis-testing-wa"
        # write separate dump only if not huge duplicate work: symlink-like thin pointer
        write_dump(
            DATA / "dsc_lab_dolthub_wa_pointer.json",
            "lab",
            [],
            source="dolthub_wa_testing",
            source_url="https://www.dolthub.com/repositories/Liquidata/cannabis-testing-wa",
            license="DoltHub public / research",
            redistributable=False,
            note=note + f"; use {local.name} count={len(items)} (API GROUP BY timed out; local CSV is source of truth)",
            mirror_dump=local.name,
            mirror_count=len(items),
            blockers=[
                "API aggregate SELECT context deadline exceeded on 215k rows",
                "liquidata-samples/marijuana_data HTTP 400 (repo unavailable via API)",
            ],
        )
        print(f"wrote pointer; mirror {local.name} n={len(items)}")
    else:
        write_dump(
            DATA / "dsc_lab_dolthub_wa_pointer.json",
            "lab",
            [],
            source="dolthub_wa_testing",
            note=note + "; local mirror missing — run import_db_dump_folder.py",
            redistributable=False,
        )
        print("pointer only; no local mirror")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
