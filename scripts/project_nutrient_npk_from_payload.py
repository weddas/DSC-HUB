#!/usr/bin/env python3
"""Fill nutrient_product.npk / dose_ml_l from existing payload body_html (honest extract only).

Does not invent values. Only writes when columns are empty and a clear pattern matches.

Usage:
  python scripts/project_nutrient_npk_from_payload.py --db C:\\DSC\\collation\\dsc_brain.sqlite3
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from brain.dsc_brain.corpus import connect  # noqa: E402

NPK_RE = re.compile(
    r"(?:NPK|N-P-K|analysis)\s*[:\s]*"
    r"(\d+(?:\.\d+)?)\s*[-:/]\s*(\d+(?:\.\d+)?)\s*[-:/]\s*(\d+(?:\.\d+)?)",
    re.I,
)
NPK_LOOSE = re.compile(
    r"\b(\d{1,2}(?:\.\d+)?)\s*-\s*(\d{1,2}(?:\.\d+)?)\s*-\s*(\d{1,2}(?:\.\d+)?)\b"
)
DOSE_RE = re.compile(
    r"(?:dose|rate|use)\s*[:\s]*(\d+(?:\.\d+)?)\s*(?:ml|mL)\s*(?:per\s*)?(?:/?\s*l(?:itre|iter)?|/L)\b",
    re.I,
)
DOSE_RE2 = re.compile(
    r"(\d+(?:\.\d+)?)\s*mL\s*per\s*litre",
    re.I,
)


def extract_npk(text: str) -> str | None:
    if not text:
        return None
    m = NPK_RE.search(text) or NPK_LOOSE.search(text)
    if not m:
        return None
    a, b, c = m.group(1), m.group(2), m.group(3)
    # reject years / weird triples
    try:
        fa, fb, fc = float(a), float(b), float(c)
    except ValueError:
        return None
    if fa > 50 or fb > 50 or fc > 50:
        return None
    return f"{a}-{b}-{c}"


def extract_dose_ml_l(text: str) -> float | None:
    if not text:
        return None
    m = DOSE_RE.search(text) or DOSE_RE2.search(text)
    if not m:
        return None
    try:
        v = float(m.group(1))
    except ValueError:
        return None
    if v <= 0 or v > 200:
        return None
    return v


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--db", type=Path, required=True)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args(argv)

    con = connect(args.db)
    rows = con.execute(
        "SELECT id, name, npk, dose_ml_l, payload_json FROM nutrient_product"
    ).fetchall()
    npk_n = dose_n = 0
    for nid, name, npk, dose, pj in rows:
        payload = {}
        try:
            payload = json.loads(pj or "{}")
        except json.JSONDecodeError:
            payload = {}
        blob = " ".join(
            str(x or "")
            for x in (
                name,
                payload.get("body_html"),
                payload.get("category"),
                " ".join(payload.get("tags") or []),
            )
        )
        new_npk = None if npk else extract_npk(blob)
        new_dose = None if dose is not None else extract_dose_ml_l(blob)
        if not new_npk and not new_dose:
            continue
        if args.dry_run:
            print(json.dumps({"id": nid, "npk": new_npk, "dose_ml_l": new_dose, "name": name}))
        else:
            if new_npk:
                con.execute("UPDATE nutrient_product SET npk=? WHERE id=?", (new_npk, nid))
                npk_n += 1
            if new_dose is not None:
                con.execute(
                    "UPDATE nutrient_product SET dose_ml_l=? WHERE id=?", (new_dose, nid)
                )
                dose_n += 1
    if not args.dry_run:
        con.commit()
    filled_npk = con.execute(
        "SELECT COUNT(*) FROM nutrient_product WHERE npk IS NOT NULL AND TRIM(npk)!=''"
    ).fetchone()[0]
    filled_dose = con.execute(
        "SELECT COUNT(*) FROM nutrient_product WHERE dose_ml_l IS NOT NULL"
    ).fetchone()[0]
    print(
        json.dumps(
            {
                "updated_npk": npk_n,
                "updated_dose": dose_n,
                "filled_npk": filled_npk,
                "filled_dose": filled_dose,
                "total": len(rows),
            }
        )
    )
    con.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
