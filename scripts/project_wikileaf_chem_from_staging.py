#!/usr/bin/env python3
"""Project Wikileaf THC/CBD from staging raw → chemistry_profile (exact name_norm).

HONESTY: Wikileaf dumps often store categorical HTML ("Very High") inside
Angular-tagged <p> nodes. Digit-regex on that HTML reads attribute noise
(e.g. _ngcontent-sc58 → 58) and MUST be rejected.

Only accept explicit numeric percent values (or ranges) with a % sign or a
bare number that looks like real chem (0–40 THC typical; allow up to 45).
Never treat Sativa/Indica share labels as chem.

Usage:
  python scripts/project_wikileaf_chem_from_staging.py --db C:\\DSC\\collation\\dsc_brain.sqlite3 \\
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

from brain.dsc_brain.corpus import add_chemistry, connect, ensure_source, name_norm  # noqa: E402

_HTML_TAG = re.compile(r"<[^>]+>")
_CAT = re.compile(
    r"\b(very\s+high|very\s+low|high|low|normal|medium|average|unknown)\b",
    re.I,
)
_PCT = re.compile(
    r"(\d+(?:\.\d+)?)\s*(?:-|to|–)?\s*(\d+(?:\.\d+)?)?\s*%",
    re.I,
)
_BARE = re.compile(r"^\s*(\d+(?:\.\d+)?)\s*(?:-|to|–)?\s*(\d+(?:\.\d+)?)?\s*$")


def _clean(val) -> str:
    if val in (None, "", [], {}):
        return ""
    if isinstance(val, (int, float)):
        return str(val)
    s = _HTML_TAG.sub(" ", str(val))
    s = re.sub(r"\s+", " ", s).strip()
    return s


def _pct_range(val, *, field: str) -> list[float] | None:
    """Parse only honest numeric chem. Reject categorical Wikileaf labels."""
    if isinstance(val, (int, float)):
        f = float(val)
        if 0 <= f <= 45:
            return [f, f]
        return None
    if isinstance(val, (list, tuple)) and len(val) >= 2:
        try:
            a, b = float(val[0]), float(val[1])
            if 0 <= a <= 45 and 0 <= b <= 45:
                return [min(a, b), max(a, b)]
        except (TypeError, ValueError):
            return None
        return None

    s = _clean(val)
    if not s or _CAT.search(s):
        return None
    # reject angular/attr debris
    if "_ngcontent" in str(val).lower() or "<p" in str(val).lower():
        # still allow if a clear N% remains after strip
        pass

    m = _PCT.search(s)
    if m:
        a = float(m.group(1))
        b = float(m.group(2)) if m.group(2) else a
        if 0 <= a <= 45 and 0 <= b <= 45:
            return [min(a, b), max(a, b)]
        return None

    m = _BARE.match(s)
    if m:
        a = float(m.group(1))
        b = float(m.group(2)) if m.group(2) else a
        # bare numbers only if plausible chem %
        if 0 <= a <= 45 and 0 <= b <= 45:
            return [min(a, b), max(a, b)]
    return None


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--db", type=Path, required=True)
    ap.add_argument("--staging-dir", type=Path, required=True)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args(argv)

    path = args.staging_dir / "wikileaf.sqlite3"
    if not path.exists():
        print(json.dumps({"error": "missing_staging", "path": str(path)}))
        return 1

    con = connect(args.db)
    ensure_source(con, "wikileaf", "Wikileaf", url="https://www.wikileaf.com")
    canonical = {r[0] for r in con.execute("SELECT name_norm FROM strain_canonical")}
    already = {
        r[0]
        for r in con.execute(
            "SELECT DISTINCT name_norm FROM chemistry_profile WHERE source_id='wikileaf'"
        )
    }
    before = con.execute("SELECT COUNT(*) FROM chemistry_profile").fetchone()[0]
    stats = {
        "scanned": 0,
        "added": 0,
        "skipped_no_canonical": 0,
        "skipped_already": 0,
        "skipped_no_numeric_chem": 0,
        "skipped_categorical": 0,
        "samples": [],
    }

    src = sqlite3.connect(f"file:{path}?mode=ro", uri=True)
    for nn_raw, blob in src.execute("SELECT name_norm, payload_json FROM raw_record"):
        stats["scanned"] += 1
        key = name_norm(nn_raw or "")
        if not key or key not in canonical:
            stats["skipped_no_canonical"] += 1
            continue
        if key in already:
            stats["skipped_already"] += 1
            continue
        try:
            payload = json.loads(blob or "{}")
        except json.JSONDecodeError:
            continue
        if not isinstance(payload, dict):
            continue
        raw_thc = payload.get("THC") or payload.get("thc")
        raw_cbd = payload.get("CBD") or payload.get("cbd")
        if _CAT.search(_clean(raw_thc)) or _CAT.search(_clean(raw_cbd)):
            stats["skipped_categorical"] += 1
            continue
        thc = _pct_range(raw_thc, field="thc")
        cbd = _pct_range(raw_cbd, field="cbd")
        if not thc and not cbd:
            stats["skipped_no_numeric_chem"] += 1
            continue
        chem = {
            "thc_range": thc,
            "cbd_range": cbd,
            "type": payload.get("type") or payload.get("strain"),
            "source": "wikileaf",
            "strain_url": payload.get("strain_url"),
            "note": "numeric percent only; categorical Wikileaf labels rejected",
        }
        if args.dry_run:
            stats["added"] += 1
        else:
            add_chemistry(
                con,
                payload.get("name") or key,
                chem,
                source_id="wikileaf",
            )
            stats["added"] += 1
            already.add(key)
        if len(stats["samples"]) < 8:
            stats["samples"].append({"name_norm": key, "thc": thc, "cbd": cbd})
    src.close()
    if not args.dry_run:
        con.commit()
    after = con.execute("SELECT COUNT(*) FROM chemistry_profile").fetchone()[0]
    con.close()
    print(
        json.dumps(
            {
                "chemistry_before": before,
                "chemistry_after": after,
                **stats,
                "dry_run": args.dry_run,
                "built_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            },
            indent=2,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
