#!/usr/bin/env python3
"""Import OpenTHC Variety Database into a local strain dump.

Tries public download endpoints and GitHub raw data. Stores all fields.
"""

from __future__ import annotations

import csv
import io
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from catalog_common import DATA, fetch_bytes, fetch_text, name_norm, write_dump  # noqa: E402

OUT = DATA / "dsc_strains_openthc.json"

CANDIDATES = [
    "https://vdb.openthc.org/download/strains.json",
    "https://vdb.openthc.org/download/strains.csv",
    "https://vdb.openthc.org/download/strains.tsv",
]


def _rows_from_json(doc) -> list[dict]:
    if isinstance(doc, list):
        return [r for r in doc if isinstance(r, dict)]
    if isinstance(doc, dict):
        for key in ("data", "variety", "varieties", "items", "results"):
            if isinstance(doc.get(key), list):
                return [r for r in doc[key] if isinstance(r, dict)]
        # map id -> row
        vals = list(doc.values())
        if vals and all(isinstance(v, dict) for v in vals[:20]):
            return [v for v in vals if isinstance(v, dict)]
    return []


def _rows_from_csv(text: str) -> list[dict]:
    dialect = csv.Sniffer().sniff(text[:2000], delimiters=",\t")
    reader = csv.DictReader(io.StringIO(text), dialect=dialect)
    return [dict(r) for r in reader]


def main() -> int:
    items: list[dict] = []
    used = None
    err = []
    for url in CANDIDATES:
        try:
            raw = fetch_bytes(url)
            text = raw.decode("utf-8", errors="replace")
            if url.endswith(".csv") or url.endswith(".tsv") or "\t" in text[:200]:
                rows = _rows_from_csv(text)
            else:
                rows = _rows_from_json(json.loads(text))
            if not rows:
                err.append(f"{url}: empty")
                continue
            used = url
            for r in rows:
                name = str(r.get("name") or r.get("variety") or r.get("Name") or "").strip()
                if not name:
                    continue
                row = dict(r)
                row["name"] = name
                row["name_norm"] = name_norm(name)
                row["source"] = "openthc_vdb"
                # aliases
                for ak in ("aka", "alias", "aliases", "stub"):
                    if r.get(ak):
                        row[ak] = r[ak]
                items.append(row)
            break
        except Exception as exc:  # noqa: BLE001
            err.append(f"{url}: {exc}")
    if not items:
        print("OpenTHC import failed; tried:\n " + "\n ".join(err))
        return 1
    write_dump(
        OUT,
        "strains",
        items,
        source="openthc_vdb",
        source_url=used,
        license="see OpenTHC VDB",
        redistributable=True,
        errors=err,
    )
    print(f"wrote {OUT} count={len(items)} from {used}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
