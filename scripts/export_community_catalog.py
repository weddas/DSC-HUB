#!/usr/bin/env python3
"""Export attributed open-layer subset for community packaging (N-087 stub→working).

Includes source_record rows with redistributable=1 only. Bank research scrapes stay out.
"""

from __future__ import annotations

import argparse
import json
import sqlite3
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DB = ROOT / "brain" / "data" / "dsc_brain.sqlite3"
OUT_DIR = ROOT / "homeassistant" / "data" / "exports"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--db", type=Path, default=DEFAULT_DB)
    ap.add_argument("--out", type=Path, default=OUT_DIR / "community_catalog_open")
    args = ap.parse_args()
    if not args.db.exists():
        print(f"DB missing: {args.db} — run ingest_corpus_dumps.py first")
        return 1

    args.out.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(args.db)
    conn.row_factory = sqlite3.Row

    sources = [
        dict(r)
        for r in conn.execute("SELECT * FROM source_record WHERE redistributable=1")
    ]
    open_ids = {s["id"] for s in sources}

    # Canonical strains that have at least one open-source attribute/variant/chem
    canons = [dict(r) for r in conn.execute("SELECT * FROM strain_canonical")]
    variants = [
        dict(r)
        for r in conn.execute("SELECT * FROM strain_variant")
        if (r["source_id"] in open_ids) or not r["source_id"]
    ]
    chems = [
        dict(r)
        for r in conn.execute("SELECT * FROM chemistry_profile")
        if r["source_id"] in open_ids
    ]
    grows = [
        dict(r)
        for r in conn.execute("SELECT * FROM grow_trait")
        if r["source_id"] in open_ids
    ]

    manifest = {
        "id": "community_open_v1",
        "title": "DSC-HUB community open catalog subset",
        "built_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "note": (
            "Open/redistributable sources only (OpenTHC, Seed City CC0, Wikileaf mirrors, "
            "Cannlytics CC-BY-4.0, etc.). Research bank scrapes excluded pending legal review."
        ),
        "sources": sources,
        "counts": {
            "canonical": len(canons),
            "variants_open": len(variants),
            "chemistry_open": len(chems),
            "grow_open": len(grows),
        },
    }
    (args.out / "README.md").write_text(
        "\n".join(
            [
                "# DSC-HUB community open catalog",
                "",
                manifest["note"],
                "",
                "## Sources",
                "",
                *[
                    f"- **{s['id']}** — {s.get('license') or 'see upstream'} — {s.get('url') or ''}"
                    for s in sources
                ],
                "",
                f"Built: {manifest['built_at']}",
                "",
                "Files: `manifest.json`, `strains_canonical.json`, `chemistry_open.json`.",
                "",
            ]
        ),
        encoding="utf-8",
    )
    (args.out / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    (args.out / "strains_canonical.json").write_text(
        json.dumps(canons, indent=1), encoding="utf-8"
    )
    (args.out / "chemistry_open.json").write_text(json.dumps(chems, indent=1), encoding="utf-8")
    (args.out / "variants_open.json").write_text(json.dumps(variants, indent=1), encoding="utf-8")

    conn.execute(
        "INSERT INTO export_manifest(id, title, include_json, note) VALUES(?,?,?,?) "
        "ON CONFLICT(id) DO UPDATE SET include_json=excluded.include_json, note=excluded.note",
        (
            "community_open_v1",
            manifest["title"],
            json.dumps({"sources": list(open_ids), "counts": manifest["counts"]}),
            manifest["note"],
        ),
    )
    conn.commit()
    conn.close()
    print(json.dumps({"out": str(args.out), **manifest["counts"]}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
