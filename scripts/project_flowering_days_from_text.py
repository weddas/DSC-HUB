#!/usr/bin/env python3
"""Fill grow_trait.flowering_days_* from numeric / weeks text already in payload/staging.

Exact parse only. Never invents days from categorical phrases like
"Average flowering period" or "Medium" without numbers.

Usage:
  python scripts/project_flowering_days_from_text.py --db C:\\DSC\\collation\\dsc_brain.sqlite3
  python scripts/project_flowering_days_from_text.py --db ... --staging-dir C:\\DSC\\collation\\staging
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

FLOWER_KEYS = (
    "flowering_days",
    "flower_days",
    "flowering_time",
    "flowering_time_days",
    "indoor_flowering_time",
    "outdoor_flowering_time",
    "flowering",
    "flower_time",
    "bloom_time",
    "flowering_period",
)
_PROSE_KEYS = ("more_info", "info", "description", "about_info", "page_text_excerpt")
_NUM = re.compile(r"(\d+(?:\.\d+)?)")
_WEEKS = re.compile(
    r"(\d+(?:\.\d+)?)\s*(?:-|to|–|—)?\s*(\d+(?:\.\d+)?)?\s*weeks?\b",
    re.I,
)
_DAYS = re.compile(
    r"(\d+(?:\.\d+)?)\s*(?:-|to|–|—)?\s*(\d+(?:\.\d+)?)?\s*days?\b",
    re.I,
)
_PROSE_FLOWER = re.compile(
    r"(?:flower(?:ing)?|bloom(?:ing)?)\D{0,40}?"
    r"(\d+(?:\.\d+)?)\s*(?:-|to|–)?\s*(\d+(?:\.\d+)?)?\s*"
    r"(days?|weeks?)",
    re.I,
)
_REJECT = re.compile(
    r"^\s*(average|short|medium|tall|long|fast|slow|auto)\b",
    re.I,
)


def parse_flowering_days(val) -> tuple[float | None, float | None]:
    """Return (min,max) days or (None,None)."""
    if val in (None, "", [], {}):
        return None, None
    if isinstance(val, (int, float)):
        f = float(val)
        if 20 <= f <= 200:
            return f, f
        if 3 <= f <= 20:
            # bare weeks-ish without unit — honesty skip unless already days-ish
            return None, None
        return None, None
    if isinstance(val, (list, tuple)) and len(val) >= 2:
        try:
            a, b = float(val[0]), float(val[1])
        except (TypeError, ValueError):
            return None, None
        if 20 <= a <= 200 and 20 <= b <= 200:
            return min(a, b), max(a, b)
        if 3 <= a <= 20 and 3 <= b <= 20:
            return min(a, b) * 7.0, max(a, b) * 7.0
        return None, None

    s = str(val).strip()
    if not s or _REJECT.match(s) and not _NUM.search(s):
        return None, None
    if _REJECT.match(s) and not re.search(r"\d", s):
        return None, None

    m = _DAYS.search(s)
    if m:
        a = float(m.group(1))
        b = float(m.group(2)) if m.group(2) else a
        if 15 <= a <= 200 and 15 <= b <= 200:
            return min(a, b), max(a, b)

    m = _WEEKS.search(s)
    if m:
        a = float(m.group(1))
        b = float(m.group(2)) if m.group(2) else a
        if 3 <= a <= 30 and 3 <= b <= 30:
            return min(a, b) * 7.0, max(a, b) * 7.0

    # bare number in known day range when key already says flowering_days
    nums = [float(x) for x in _NUM.findall(s)]
    if len(nums) == 1 and 20 <= nums[0] <= 200 and "week" not in s.lower():
        return nums[0], nums[0]
    if len(nums) >= 2 and all(20 <= n <= 200 for n in nums[:2]) and "week" not in s.lower():
        return min(nums[0], nums[1]), max(nums[0], nums[1])
    return None, None


def _extract_from_payload(payload: dict) -> tuple[float | None, float | None, str | None]:
    for k in FLOWER_KEYS:
        d0, d1 = parse_flowering_days(payload.get(k))
        if d0 is not None:
            return d0, d1, k
    grow = payload.get("grow")
    if isinstance(grow, dict):
        for k in FLOWER_KEYS:
            d0, d1 = parse_flowering_days(grow.get(k))
            if d0 is not None:
                return d0, d1, f"grow.{k}"
    for k in _PROSE_KEYS:
        text = payload.get(k)
        if not isinstance(text, str) or len(text) < 12:
            continue
        m = _PROSE_FLOWER.search(text)
        if not m:
            continue
        a = float(m.group(1))
        b = float(m.group(2)) if m.group(2) else a
        unit = m.group(3).lower()
        if unit.startswith("week"):
            if 3 <= a <= 30 and 3 <= b <= 30:
                return min(a, b) * 7.0, max(a, b) * 7.0, f"prose:{k}"
        elif 15 <= a <= 200 and 15 <= b <= 200:
            return min(a, b), max(a, b), f"prose:{k}"
    return None, None, None


def fill_from_master_payloads(con: sqlite3.Connection, *, dry_run: bool) -> dict:
    stats = {"scanned": 0, "updated": 0, "samples": []}
    updates: list[tuple[float, float, str]] = []
    for gid, nn, blob in con.execute(
        "SELECT id, name_norm, payload_json FROM grow_trait WHERE flowering_days_min IS NULL"
    ):
        stats["scanned"] += 1
        try:
            payload = json.loads(blob or "{}")
        except json.JSONDecodeError:
            continue
        if not isinstance(payload, dict):
            continue
        d0, d1, src = _extract_from_payload(payload)
        if d0 is None:
            continue
        updates.append((d0, d1 if d1 is not None else d0, gid))
        if len(stats["samples"]) < 12:
            stats["samples"].append(
                {"id": gid, "name_norm": nn, "days": [d0, d1], "from": src}
            )
    if not dry_run and updates:
        con.executemany(
            "UPDATE grow_trait SET flowering_days_min=?, flowering_days_max=? WHERE id=?",
            updates,
        )
    stats["updated"] = len(updates)
    return stats


def fill_from_staging(
    con: sqlite3.Connection, staging_dir: Path, *, dry_run: bool
) -> dict:
    stats = {"files": 0, "scanned": 0, "updated": 0, "samples": []}
    empty: dict[str, list[str]] = {}
    for nn, gid in con.execute(
        "SELECT name_norm, id FROM grow_trait WHERE flowering_days_min IS NULL"
    ):
        if not nn:
            continue
        empty.setdefault(nn, []).append(gid)
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
                continue
            try:
                payload = json.loads(blob or "{}")
            except json.JSONDecodeError:
                continue
            if not isinstance(payload, dict):
                continue
            d0, d1, src_k = _extract_from_payload(payload)
            if d0 is None:
                continue
            gids = empty.pop(key, None)
            if not gids:
                continue
            dmax = d1 if d1 is not None else d0
            for gid in gids:
                batch.append((d0, dmax, gid))
            if len(stats["samples"]) < 8:
                stats["samples"].append(
                    {
                        "file": path.name,
                        "name_norm": key,
                        "days": [d0, d1],
                        "from": src_k,
                        "rows": len(gids),
                    }
                )
        src.close()
        if not dry_run and batch:
            con.executemany(
                "UPDATE grow_trait SET flowering_days_min=?, flowering_days_max=? WHERE id=?",
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
        "SELECT COUNT(*) FROM grow_trait WHERE flowering_days_min IS NOT NULL"
    ).fetchone()[0]
    total = con.execute("SELECT COUNT(*) FROM grow_trait").fetchone()[0]
    master_stats = fill_from_master_payloads(con, dry_run=args.dry_run)
    staging_stats: dict = {}
    if args.staging_dir and args.staging_dir.exists():
        staging_stats = fill_from_staging(con, args.staging_dir, dry_run=args.dry_run)
    if not args.dry_run:
        con.commit()
    after = con.execute(
        "SELECT COUNT(*) FROM grow_trait WHERE flowering_days_min IS NOT NULL"
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
