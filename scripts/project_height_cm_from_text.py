#!/usr/bin/env python3
"""Fill grow_trait.height_cm_* from numeric height text already in payload/staging.

Never invents cm from Short/Medium/Tall bands.
Updates existing grow_trait rows where height_cm_min IS NULL.
Also projects from staging raw when master grow row exists and is empty.

Usage:
  python scripts/project_height_cm_from_text.py --db C:\\DSC\\collation\\dsc_brain.sqlite3
  python scripts/project_height_cm_from_text.py --db ... --staging-dir C:\\DSC\\collation\\staging
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

_NUM = re.compile(r"(\d+(?:\.\d+)?)")
_BAND = re.compile(r"^\s*(short|medium|med|tall|average)\s*$", re.I)
HEIGHT_KEYS = (
    "grow_height",
    "height",
    "height_cm",
    "plant_height",
    "plant_height_cm",
    "grow_height_cm",
    "height_raw",
    "height_indoor",
    "height_outdoor",
)
# Free-text: only when unit present near a height verb/noun (never bare HTML colors).
_PROSE_HEIGHT = re.compile(
    r"(?:height|tall|reach(?:es|ing)?|grows?(?:\s+up)?\s+to|up to)\D{0,40}?"
    r"(\d+(?:\.\d+)?)\s*(?:-|to|–)?\s*(\d+(?:\.\d+)?)?\s*"
    r"(cm|centimet(?:er|re)s?|inches|inch|in\b|ft|feet)",
    re.I,
)
_PROSE_KEYS = (
    "more_info",
    "info",
    "description",
    "about_info",
    "page_text_excerpt",
)


def parse_height_cm(val) -> tuple[float | None, float | None]:
    """Return (min,max) cm or (None,None). Rejects categorical bands."""
    if val in (None, "", [], {}):
        return None, None
    if isinstance(val, (int, float)):
        f = float(val)
        if f <= 0 or f > 2000:
            return None, None
        return f, f
    if isinstance(val, (list, tuple)) and len(val) >= 2:
        try:
            a, b = float(val[0]), float(val[1])
            if a <= 0 or b <= 0 or a > 2000 or b > 2000:
                return None, None
            return min(a, b), max(a, b)
        except (TypeError, ValueError):
            return None, None
    s = str(val).lower().strip()
    if _BAND.match(s):
        return None, None
    if any(w in s for w in ("short", "medium", "tall")) and not _NUM.search(s):
        return None, None
    nums = [float(x) for x in _NUM.findall(s)]
    if not nums:
        return None, None
    # unit: inches if in/inch/"/ft and no cm
    if (("in" in s or "inch" in s or '"' in s or "ft" in s or "'" in s) and "cm" not in s):
        nums = [n * 2.54 for n in nums]
    elif "cm" not in s and "in" not in s and "ft" not in s:
        # bare numbers: only accept if look like cm-ish plant heights (20–400)
        if all(20 <= n <= 400 for n in nums[:2]):
            pass
        elif all(8 <= n <= 160 for n in nums[:2]):
            # ambiguous inches-ish without unit — skip (honesty)
            return None, None
        else:
            return None, None
    if len(nums) == 1:
        n = nums[0]
        if n <= 0 or n > 2000:
            return None, None
        return n, n
    a, b = nums[0], nums[1]
    if a <= 0 or b <= 0 or a > 2000 or b > 2000:
        return None, None
    return min(a, b), max(a, b)


def _extract_from_payload(payload: dict) -> tuple[float | None, float | None, str | None]:
    for k in HEIGHT_KEYS:
        h0, h1 = parse_height_cm(payload.get(k))
        if h0 is not None:
            return h0, h1, k
    grow = payload.get("grow")
    if isinstance(grow, dict):
        for k in HEIGHT_KEYS:
            h0, h1 = parse_height_cm(grow.get(k))
            if h0 is not None:
                return h0, h1, f"grow.{k}"
    for k in _PROSE_KEYS:
        text = payload.get(k)
        if not isinstance(text, str) or len(text) < 12:
            continue
        # skip obvious HTML attribute noise
        if 'font color' in text.lower() or 'href=' in text.lower()[:200]:
            # still allow if explicit height+cm later in text
            pass
        m = _PROSE_HEIGHT.search(text)
        if not m:
            continue
        a = float(m.group(1))
        b = float(m.group(2)) if m.group(2) else a
        unit = m.group(3).lower()
        if unit.startswith("in") or unit in ("ft", "feet"):
            if unit in ("ft", "feet"):
                a, b = a * 30.48, b * 30.48
            else:
                a, b = a * 2.54, b * 2.54
        if a <= 0 or b <= 0 or a > 2000 or b > 2000:
            continue
        return min(a, b), max(a, b), f"prose:{k}"
    return None, None, None


def fill_from_master_payloads(con: sqlite3.Connection, *, dry_run: bool) -> dict:
    stats = {"scanned": 0, "updated": 0, "samples": []}
    rows = con.execute(
        "SELECT id, name_norm, payload_json FROM grow_trait WHERE height_cm_min IS NULL"
    )
    updates: list[tuple[float, float, str]] = []
    for gid, nn, blob in rows:
        stats["scanned"] += 1
        try:
            payload = json.loads(blob or "{}")
        except json.JSONDecodeError:
            continue
        if not isinstance(payload, dict):
            continue
        h0, h1, src = _extract_from_payload(payload)
        if h0 is None:
            continue
        updates.append((h0, h1 if h1 is not None else h0, gid))
        if len(stats["samples"]) < 12:
            stats["samples"].append({"id": gid, "name_norm": nn, "cm": [h0, h1], "from": src})
    if not dry_run and updates:
        con.executemany(
            "UPDATE grow_trait SET height_cm_min=?, height_cm_max=? WHERE id=?",
            updates,
        )
    stats["updated"] = len(updates)
    return stats


def fill_from_staging(
    con: sqlite3.Connection, staging_dir: Path, *, dry_run: bool
) -> dict:
    stats = {"files": 0, "scanned": 0, "updated": 0, "no_grow_row": 0, "samples": []}
    # Index empty-height grow rows by name_norm
    empty = {
        r[0]: r[1]
        for r in con.execute(
            "SELECT name_norm, id FROM grow_trait WHERE height_cm_min IS NULL"
        )
    }
    if not empty:
        return stats
    for path in sorted(staging_dir.glob("*.sqlite3")):
        stats["files"] += 1
        try:
            src = sqlite3.connect(f"file:{path}?mode=ro", uri=True)
        except sqlite3.Error:
            continue
        try:
            cur = src.execute("SELECT name_norm, payload_json FROM raw_record")
        except sqlite3.Error:
            src.close()
            continue
        batch: list[tuple[float, float, str]] = []
        for nn_raw, blob in cur:
            stats["scanned"] += 1
            key = name_norm(nn_raw or "")
            if not key or key not in empty:
                if key and key not in empty:
                    pass
                continue
            try:
                payload = json.loads(blob or "{}")
            except json.JSONDecodeError:
                continue
            if not isinstance(payload, dict):
                continue
            h0, h1, src_k = _extract_from_payload(payload)
            if h0 is None:
                continue
            gid = empty.pop(key, None)
            if not gid:
                stats["no_grow_row"] += 1
                continue
            batch.append((h0, h1 if h1 is not None else h0, gid))
            if len(stats["samples"]) < 8:
                stats["samples"].append(
                    {"file": path.name, "name_norm": key, "cm": [h0, h1], "from": src_k}
                )
        src.close()
        if not dry_run and batch:
            con.executemany(
                "UPDATE grow_trait SET height_cm_min=?, height_cm_max=? WHERE id=?",
                batch,
            )
            stats["updated"] += len(batch)
        elif dry_run:
            stats["updated"] += len(batch)
    return stats


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--db", type=Path, required=True)
    ap.add_argument("--staging-dir", type=Path, default=None)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args(argv)

    con = connect(args.db)
    before = con.execute(
        "SELECT COUNT(*) FROM grow_trait WHERE height_cm_min IS NOT NULL"
    ).fetchone()[0]
    total = con.execute("SELECT COUNT(*) FROM grow_trait").fetchone()[0]
    master_stats = fill_from_master_payloads(con, dry_run=args.dry_run)
    staging_stats = {}
    if args.staging_dir and args.staging_dir.exists():
        staging_stats = fill_from_staging(con, args.staging_dir, dry_run=args.dry_run)
    if not args.dry_run:
        con.commit()
    after = con.execute(
        "SELECT COUNT(*) FROM grow_trait WHERE height_cm_min IS NOT NULL"
    ).fetchone()[0]
    con.close()
    print(
        json.dumps(
            {
                "before_filled": before,
                "after_filled": after,
                "grow_total": total,
                "pct_after": round(100.0 * after / total, 2) if total else 0,
                "master_payload": master_stats,
                "staging": staging_stats,
                "dry_run": args.dry_run,
                "built_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            },
            indent=2,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
