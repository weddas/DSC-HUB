"""Backfill Leafly grow/lineage into NEW staging family (no lock on enrich DB).

Reads leafly_flat_enrich.sqlite3 read-only → writes leafly_flat_grow.sqlite3.
NO master merge.
"""
from __future__ import annotations

import json
import re
import sqlite3
import sys
import uuid
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

from brain.dsc_brain.corpus import connect, ensure_source, name_norm, upsert_canonical  # noqa: E402
from brain.dsc_brain.paths import STAGING_DIR  # noqa: E402

SRC = STAGING_DIR / "leafly_flat_enrich.sqlite3"
DST = STAGING_DIR / "leafly_flat_grow.sqlite3"
SOURCE_ID = "leafly_flat_grow"
_NUM = re.compile(r"(-?\d+(?:\.\d+)?)")


def _parse_days(val):
    if val in (None, ""):
        return None, None
    if isinstance(val, (int, float)):
        f = float(val)
        return f, f
    nums = [float(x) for x in _NUM.findall(str(val))]
    if not nums:
        return None, None
    if len(nums) == 1:
        return nums[0], nums[0]
    return min(nums[0], nums[1]), max(nums[0], nums[1])


def _parse_height_cm(val):
    if val in (None, ""):
        return None, None
    if isinstance(val, (int, float)):
        f = float(val)
        return f, f
    s = str(val).lower()
    nums = [float(x) for x in _NUM.findall(s)]
    if not nums:
        return None, None
    if "in" in s and "cm" not in s:
        nums = [n * 2.54 for n in nums]
    if len(nums) == 1:
        return nums[0], nums[0]
    return min(nums[0], nums[1]), max(nums[0], nums[1])


def main() -> int:
    if not SRC.exists():
        print("missing enrich staging")
        return 1
    if DST.exists():
        DST.unlink()

    ro = sqlite3.connect(f"file:{SRC}?mode=ro", uri=True)
    rows = list(ro.execute("SELECT payload_json FROM raw_record"))
    ro.close()
    print(f"read {len(rows)} raw rows from enrich")

    conn = connect(DST, timeout=30)
    ensure_source(
        conn,
        SOURCE_ID,
        "Leafly flat grow projection",
        redistributable=False,
        note="Typed grow_trait from leafly enrich grow_*/parent_slugs; effects in payload; no invented chem",
    )

    inserted = 0
    with_height = with_flower = with_parents = with_effects = 0
    for (blob,) in rows:
        o = json.loads(blob)
        name = str(o.get("name") or o.get("strain") or "").strip()
        if not name:
            continue
        nn = name_norm(name)
        upsert_canonical(conn, name, type_=o.get("category") or o.get("type"))

        hmin, hmax = _parse_height_cm(o.get("grow_height"))
        fmin, fmax = _parse_days(o.get("grow_floweringDays"))
        parents = o.get("parent_slugs") or []
        if isinstance(parents, str):
            parents = [p for p in parents.split(",") if p.strip()]
        yield_v = o.get("grow_averageYield")
        difficulty = o.get("grow_difficulty")
        effects = {
            k: v
            for k, v in o.items()
            if k.startswith("effect_") and k.endswith("_score") and v is not None
        }
        payload = {
            k: o.get(k)
            for k in (
                "grow_height",
                "grow_floweringDays",
                "grow_averageYield",
                "grow_difficulty",
                "parent_slugs",
                "children_slugs",
                "topEffect",
            )
            if o.get(k) not in (None, "", [], {})
        }
        if parents:
            payload["parents"] = parents
            with_parents += 1
        if effects:
            payload["effects"] = effects
            with_effects += 1
        if hmin is not None:
            with_height += 1
        if fmin is not None:
            with_flower += 1
        # Keep rows that have any grow/lineage/effects signal (high-signal weak fields)
        if not payload and hmin is None and fmin is None:
            continue
        conn.execute(
            """
            INSERT INTO grow_trait(
              id, name_norm, source_id,
              height_cm_min, height_cm_max,
              flowering_days_min, flowering_days_max,
              yield_indoor, yield_outdoor, climate, payload_json
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?)
            """,
            (
                str(uuid.uuid4()),
                nn,
                SOURCE_ID,
                hmin,
                hmax,
                fmin,
                fmax,
                str(yield_v) if yield_v not in (None, "") else None,
                None,
                str(difficulty) if difficulty not in (None, "") else None,
                json.dumps(payload, ensure_ascii=False),
            ),
        )
        # lightweight raw pointer (name + grow slice only — full row stays in enrich)
        conn.execute(
            """
            INSERT INTO raw_record(id, source_id, entity_kind, entity_id, name_norm, payload_json, payload_sha1, stored_at)
            VALUES (?,?,?,?,?,?,?,datetime('now'))
            """,
            (
                str(uuid.uuid4()),
                SOURCE_ID,
                "grow_projection",
                nn,
                nn,
                json.dumps({"name": name, **payload}, ensure_ascii=False),
                None,
            ),
        )
        inserted += 1
        if inserted % 1000 == 0:
            conn.commit()
            print(f"  …{inserted}")

    conn.commit()
    grow_n = conn.execute("SELECT COUNT(*) FROM grow_trait").fetchone()[0]
    conn.close()
    summary = {
        "staging": str(DST),
        "grow_rows": grow_n,
        "inserted": inserted,
        "with_height": with_height,
        "with_flowering": with_flower,
        "with_parents": with_parents,
        "with_effects": with_effects,
    }
    out = Path(__file__).with_name("_leafly_grow_result.json")
    out.write_text(json.dumps(summary, indent=2), encoding="utf-8")
    print(json.dumps(summary, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
