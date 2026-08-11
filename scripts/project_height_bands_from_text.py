#!/usr/bin/env python3
"""Project categorical height bands (Short/Medium/Tall) into grow_trait.payload_json.

Never invents cm. Only fills height_band / height_ordinal when missing.

Usage:
  python scripts/project_height_bands_from_text.py --db C:\\DSC\\collation\\dsc_brain.sqlite3 \\
    --staging-dir C:\\DSC\\collation\\staging
"""

from __future__ import annotations

import argparse
import json
import re
import sqlite3
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from brain.dsc_brain.corpus import connect, name_norm  # noqa: E402

BAND_RE = re.compile(
    r"\b(short(?:\s+to\s+medium)?|medium(?:\s+to\s+tall)?|tall|med)\b",
    re.I,
)
ORDINAL = {
    "short": 1,
    "short to medium": 2,
    "medium": 3,
    "med": 3,
    "medium to tall": 4,
    "tall": 5,
}
KEYS = (
    "height_indoor",
    "height_outdoor",
    "grow_height",
    "height",
    "height_band",
    "height_raw",
)


def band_from_val(val) -> tuple[str | None, int | None]:
    if val in (None, "", [], {}):
        return None, None
    if isinstance(val, (int, float)):
        return None, None
    s = str(val).strip().lower()
    # reject numeric heights here — those belong to cm projector
    if re.search(r"\d", s) and re.search(r"cm|inch|feet|ft\b", s):
        return None, None
    m = BAND_RE.search(s)
    if not m:
        return None, None
    raw = m.group(1).lower()
    if raw == "med":
        raw = "medium"
    # normalize "short to medium"
    if "to" in s and "short" in s and "medium" in s:
        raw = "short to medium"
    elif "to" in s and "medium" in s and "tall" in s:
        raw = "medium to tall"
    band = raw.title() if raw in ("short", "medium", "tall") else raw.title()
    if raw == "short to medium":
        band = "Short to Medium"
    elif raw == "medium to tall":
        band = "Medium to Tall"
    return band, ORDINAL.get(raw)


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--db", type=Path, required=True)
    ap.add_argument("--staging-dir", type=Path, required=True)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args(argv)

    con = connect(args.db)
    # name_norm -> all grow rows lacking height_band (apply same band to duplicates)
    targets: dict[str, list[tuple[str, dict]]] = {}
    for gid, nn, blob in con.execute(
        "SELECT id, name_norm, payload_json FROM grow_trait"
    ):
        if not nn:
            continue
        try:
            payload = json.loads(blob or "{}")
        except json.JSONDecodeError:
            payload = {}
        if not isinstance(payload, dict):
            payload = {}
        if payload.get("height_band"):
            continue
        targets.setdefault(nn, []).append((gid, payload))

    updated = 0
    samples: list[dict] = []
    scanned = 0
    for path in sorted(args.staging_dir.glob("*.sqlite3")):
        try:
            src = sqlite3.connect(f"file:{path}?mode=ro", uri=True)
        except sqlite3.Error:
            continue
        try:
            rows = src.execute("SELECT name_norm, payload_json FROM raw_record")
        except sqlite3.Error:
            src.close()
            continue
        batch: list[tuple[str, str]] = []
        for nn_raw, blob in rows:
            scanned += 1
            key = name_norm(nn_raw or "")
            if not key or key not in targets:
                continue
            try:
                p = json.loads(blob or "{}")
            except json.JSONDecodeError:
                continue
            if not isinstance(p, dict):
                continue
            band = ordinal = None
            src_k = None
            for k in KEYS:
                band, ordinal = band_from_val(p.get(k))
                if band:
                    src_k = k
                    break
                grow = p.get("grow")
                if isinstance(grow, dict):
                    band, ordinal = band_from_val(grow.get(k))
                    if band:
                        src_k = f"grow.{k}"
                        break
            if not band:
                continue
            entries = targets.pop(key)
            for gid, payload in entries:
                payload = dict(payload)
                payload["height_band"] = band
                if ordinal is not None:
                    payload["height_ordinal"] = ordinal
                payload["height_band_source"] = f"{path.stem}:{src_k}"
                batch.append((json.dumps(payload, ensure_ascii=False), gid))
            if len(samples) < 12:
                samples.append(
                    {
                        "name_norm": key,
                        "band": band,
                        "from": src_k,
                        "file": path.name,
                        "rows": len(entries),
                    }
                )
        src.close()
        if not args.dry_run and batch:
            con.executemany(
                "UPDATE grow_trait SET payload_json=? WHERE id=?",
                batch,
            )
            updated += len(batch)
        elif args.dry_run:
            updated += len(batch)

    if not args.dry_run:
        con.commit()
    band_n = con.execute(
        "SELECT COUNT(*) FROM grow_trait WHERE payload_json LIKE '%height_band%'"
    ).fetchone()[0]
    con.close()
    print(
        json.dumps(
            {
                "scanned_raw": scanned,
                "updated": updated,
                "height_band_payload_rows": band_n,
                "samples": samples,
                "dry_run": args.dry_run,
                "built_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            },
            indent=2,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
