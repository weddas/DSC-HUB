#!/usr/bin/env python3
"""Re-enrich Leafly flattened strains into staging + master (N-087).

Policy (NAS TB-free):
  - Staging `raw_record`: FULL JSONL row (all 191 cols / score matrices).
  - Master `chemistry_profile.payload_json`: rich projection (cannabinoids, terpene
    panel, full non-null effect/flavor score dicts, grow, meta) — one blob/row.
  - NEVER explode score/percentile columns into `attribute_kv`.

Staging DB: brain/data/staging/leafly_flat_enrich.sqlite3
Source id:  leafly_flat_enrich
"""

from __future__ import annotations

import argparse
import json
import sqlite3
import sys
import time
import uuid
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from brain.dsc_brain.corpus import (  # noqa: E402
    add_link,
    connect,
    corpus_stats,
    ensure_source,
    init_corpus,
    name_norm,
    store_raw_record,
    upsert_canonical,
)
from brain.dsc_brain.paths import DEFAULT_DB, STAGING_DIR  # noqa: E402

DEFAULT_DUMP = Path(r"y:\Digital Stealth Care\Projects\DB DUMP")
SOURCE_ID = "leafly_flat_enrich"
STAGING_NAME = "leafly_flat_enrich.sqlite3"
LEGACY_SOURCE_IDS = ("leafly_flat", "leafly_flat_enrich")


def _fnum(val: Any) -> float | None:
    if val in (None, ""):
        return None
    try:
        return float(val)
    except (TypeError, ValueError):
        return None


def _pct_range(val: Any) -> list[float] | None:
    f = _fnum(val)
    if f is None:
        return None
    return [f, f]


def _strip_prefix_suffix(key: str, prefix: str, suffix: str) -> str:
    mid = key[len(prefix) :]
    if mid.endswith(suffix):
        mid = mid[: -len(suffix)]
    return mid


def _scored_pairs(obj: dict[str, Any], prefix: str, suffix: str = "_score") -> list[tuple[str, float]]:
    out: list[tuple[str, float]] = []
    for k, v in obj.items():
        if not (k.startswith(prefix) and k.endswith(suffix)):
            continue
        f = _fnum(v)
        if f is None:
            continue
        out.append((_strip_prefix_suffix(k, prefix, suffix), f))
    out.sort(key=lambda x: x[1], reverse=True)
    return out


def project_row(obj: dict[str, Any]) -> dict[str, Any] | None:
    """Rich master/staging chemistry projection (not the full raw blob)."""
    name = str(obj.get("name") or "").strip()
    if not name:
        return None

    cann: dict[str, float] = {}
    for k, v in obj.items():
        if not k.startswith("cannabinoid_") or "percentile" not in k:
            continue
        f = _fnum(v)
        if f is None:
            continue
        # cannabinoid_thc_percentile50 -> thc_percentile50
        cann[k[len("cannabinoid_") :]] = f

    effects = _scored_pairs(obj, "effect_")
    flavors = _scored_pairs(obj, "flavor_")
    terps = _scored_pairs(obj, "terp_")
    symptoms = _scored_pairs(obj, "symptom_")
    negatives = _scored_pairs(obj, "negative_")
    conditions = _scored_pairs(obj, "condition_")

    thc_r = _pct_range(obj.get("cannabinoid_thc_percentile50"))
    cbd_r = _pct_range(obj.get("cannabinoid_cbd_percentile50"))

    grow: dict[str, Any] = {}
    for src, dst in (
        ("grow_floweringDays", "flowering_days"),
        ("grow_height", "height"),
        ("grow_averageYield", "yield"),
        ("grow_difficulty", "difficulty"),
    ):
        if obj.get(src) not in (None, ""):
            grow[dst] = obj[src]

    payload: dict[str, Any] = {
        "name": name,
        "slug": obj.get("slug"),
        "leafly_id": obj.get("id"),
        "category": obj.get("category"),
        "phenotype": obj.get("phenotype"),
        "source": SOURCE_ID,
    }
    if cann:
        payload["cannabinoids"] = cann
    if thc_r:
        payload["thc_range"] = thc_r
    if cbd_r:
        payload["cbd_range"] = cbd_r
    cbg = _fnum(obj.get("cannabinoid_cbg_percentile50"))
    cbc = _fnum(obj.get("cannabinoid_cbc_percentile50"))
    thcv = _fnum(obj.get("cannabinoid_thcv_percentile50"))
    if cbg is not None:
        payload["cbg"] = cbg
    if cbc is not None:
        payload["cbc"] = cbc
    if thcv is not None:
        payload["thcv"] = thcv

    # Full score matrices as nested dicts (NOT attribute_kv).
    if effects:
        payload["effects_scores"] = {n: s for n, s in effects}
        payload["top_effects"] = [{"name": n, "score": s} for n, s in effects[:5]]
    if flavors:
        payload["flavors_scores"] = {n: s for n, s in flavors}
        payload["top_flavors"] = [{"name": n, "score": s} for n, s in flavors[:5]]
    if terps:
        payload["terpenes"] = {n: s for n, s in terps}
        payload["top_terpenes"] = [n for n, _ in terps[:8]]
    if symptoms:
        payload["symptoms_scores"] = {n: s for n, s in symptoms}
    if negatives:
        payload["negatives_scores"] = {n: s for n, s in negatives}
    if conditions:
        payload["conditions_scores"] = {n: s for n, s in conditions}

    if grow:
        payload["grow"] = grow

    for meta_k in (
        "averageRating",
        "reviewCount",
        "energizeScore",
        "topEffect",
        "subtitle",
        "descriptionPlain",
        "parent_slugs",
        "children_slugs",
        "photoCount",
        "totalFollowers",
    ):
        if obj.get(meta_k) not in (None, ""):
            payload[meta_k] = obj[meta_k]

    summary: dict[str, Any] = {}
    if payload.get("top_effects"):
        summary["top_effects"] = [e["name"] for e in payload["top_effects"]]
    if payload.get("top_flavors"):
        summary["top_flavors"] = [f["name"] for f in payload["top_flavors"]]
    if obj.get("slug"):
        summary["leafly_slug"] = obj["slug"]
    if obj.get("descriptionPlain"):
        summary["description"] = str(obj["descriptionPlain"])[:1200]

    return {
        "name": name,
        "name_norm": name_norm(name),
        "type": obj.get("phenotype") or obj.get("category"),
        "slug": obj.get("slug"),
        "summary": summary,
        "chemistry": payload,
        "raw": obj,
    }


def _upsert_chemistry(
    conn: sqlite3.Connection,
    name: str,
    payload: dict[str, Any],
    *,
    source_id: str,
) -> tuple[str, str]:
    """Insert or refresh chemistry_profile for this source family. Returns (id, action)."""
    key = name_norm(name)
    thc = payload.get("thc_range")
    cbd = payload.get("cbd_range")
    thc_min = thc_max = cbd_min = cbd_max = None
    if isinstance(thc, (list, tuple)) and len(thc) >= 2:
        thc_min, thc_max = float(thc[0]), float(thc[1])
    if isinstance(cbd, (list, tuple)) and len(cbd) >= 2:
        cbd_min, cbd_max = float(cbd[0]), float(cbd[1])
    tops = payload.get("top_terpenes")
    payload_text = json.dumps(payload, ensure_ascii=False)

    placeholders = ",".join("?" for _ in LEGACY_SOURCE_IDS)
    existing = conn.execute(
        f"SELECT id, source_id FROM chemistry_profile "
        f"WHERE name_norm=? AND source_id IN ({placeholders}) "
        f"ORDER BY CASE source_id WHEN ? THEN 0 WHEN ? THEN 1 ELSE 2 END LIMIT 1",
        (key, *LEGACY_SOURCE_IDS, SOURCE_ID, "leafly_flat"),
    ).fetchone()

    if existing:
        cid = existing["id"]
        conn.execute(
            "UPDATE chemistry_profile SET name=?, source_id=?, thc_min=?, thc_max=?, "
            "cbd_min=?, cbd_max=?, top_terpenes_json=?, payload_json=? WHERE id=?",
            (
                name,
                source_id,
                thc_min,
                thc_max,
                cbd_min,
                cbd_max,
                json.dumps(tops, ensure_ascii=False) if tops is not None else None,
                payload_text,
                cid,
            ),
        )
        return cid, "updated"

    cid = str(uuid.uuid4())
    conn.execute(
        "INSERT INTO chemistry_profile(id, name_norm, name, source_id, thc_min, thc_max, "
        "cbd_min, cbd_max, top_terpenes_json, payload_json) VALUES(?,?,?,?,?,?,?,?,?,?)",
        (
            cid,
            key or None,
            name,
            source_id,
            thc_min,
            thc_max,
            cbd_min,
            cbd_max,
            json.dumps(tops, ensure_ascii=False) if tops is not None else None,
            payload_text,
        ),
    )
    return cid, "inserted"


def _force_summary(conn: sqlite3.Connection, key: str, summary: dict[str, Any]) -> None:
    row = conn.execute(
        "SELECT summary_json FROM strain_canonical WHERE name_norm=?", (key,)
    ).fetchone()
    merged: dict[str, Any] = {}
    if row:
        try:
            merged = json.loads(row["summary_json"] or "{}")
        except json.JSONDecodeError:
            merged = {}
    for k, v in summary.items():
        if v not in (None, "", [], {}):
            merged[k] = v
    conn.execute(
        "UPDATE strain_canonical SET summary_json=?, updated_at=? WHERE name_norm=?",
        (
            json.dumps(merged, ensure_ascii=False),
            time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            key,
        ),
    )


def _ensure_chem_link(conn: sqlite3.Connection, chem_id: str, name_norm_key: str) -> bool:
    exists = conn.execute(
        "SELECT 1 FROM entity_link WHERE from_kind=? AND from_id=? AND to_kind=? AND to_id=? LIMIT 1",
        ("chemistry_profile", chem_id, "strain_canonical", name_norm_key),
    ).fetchone()
    if exists:
        return False
    add_link(
        conn,
        "chemistry_profile",
        chem_id,
        "strain_canonical",
        name_norm_key,
        method="leafly_flat_enrich",
        source=SOURCE_ID,
    )
    return True


def _upsert_slug_alias(conn: sqlite3.Connection, slug: str, name_norm_key: str) -> bool:
    """Map Leafly slug → canonical. alias_norm uses spaces (hyphens stripped via name_norm)."""
    alias = str(slug).strip()
    if not alias:
        return False
    alias_norm = name_norm(alias.replace("-", " "))
    if not alias_norm:
        return False
    before = conn.execute(
        "SELECT name_norm FROM science_alias WHERE alias_norm=?", (alias_norm,)
    ).fetchone()
    conn.execute(
        "INSERT INTO science_alias(alias_norm, alias, name_norm, source_id) VALUES(?,?,?,?) "
        "ON CONFLICT(alias_norm) DO UPDATE SET "
        "alias=excluded.alias, name_norm=excluded.name_norm, source_id=excluded.source_id",
        (alias_norm, alias, name_norm_key, SOURCE_ID),
    )
    return before is None


def load_rows(dump: Path) -> list[dict[str, Any]]:
    jsonl = dump / "flattened_strains.jsonl"
    csv_path = dump / "flattened_strains.csv"
    rows: list[dict[str, Any]] = []
    if jsonl.exists():
        with jsonl.open(encoding="utf-8", errors="replace") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    obj = json.loads(line)
                except json.JSONDecodeError:
                    continue
                if isinstance(obj, dict):
                    rows.append(obj)
        return rows
    if csv_path.exists():
        import csv

        with csv_path.open(encoding="utf-8", errors="replace", newline="") as f:
            for r in csv.DictReader(f):
                rows.append(dict(r))
        return rows
    raise FileNotFoundError(f"No flattened_strains.jsonl/csv under {dump}")


def apply_staging_to_master(
    *,
    staging_path: Path,
    master_path: Path,
) -> dict[str, Any]:
    """Push projections from an existing staging DB into master (no JSONL re-read)."""
    if not staging_path.is_file():
        raise FileNotFoundError(staging_path)

    print(f"Applying {staging_path} -> {master_path}", flush=True)
    last_err: Exception | None = None
    master = None
    hb = staging_path.with_suffix(".apply.heartbeat")
    for attempt in range(1, 360):
        try:
            hb.write_text(f"attempt={attempt} waiting\n", encoding="utf-8")
            probe = sqlite3.connect(str(master_path), timeout=1.0)
            probe.execute("PRAGMA busy_timeout=1000")
            probe.execute("BEGIN IMMEDIATE")
            probe.execute("COMMIT")
            probe.close()
        except sqlite3.OperationalError as exc:
            last_err = exc
            if attempt == 1 or attempt % 12 == 0:
                print(f"  master locked (attempt {attempt}/360): {exc}; sleeping.", flush=True)
            time.sleep(5)
            continue
        except Exception as exc:  # noqa: BLE001
            last_err = exc
            print(f"  probe error (attempt {attempt}/360): {type(exc).__name__}: {exc}", flush=True)
            time.sleep(5)
            continue
        try:
            hb.write_text(f"attempt={attempt} opening\n", encoding="utf-8")
            init_corpus(master_path)
            master = connect(master_path, timeout=300.0)
            master.execute("PRAGMA busy_timeout=300000")
            print(f"  master open on attempt {attempt}", flush=True)
            hb.write_text(f"attempt={attempt} open\n", encoding="utf-8")
            break
        except sqlite3.OperationalError as exc:
            last_err = exc
            print(f"  master open race (attempt {attempt}/360): {exc}; sleeping.", flush=True)
            time.sleep(5)
        except Exception as exc:  # noqa: BLE001
            last_err = exc
            print(f"  master open FAIL (attempt {attempt}/360): {type(exc).__name__}: {exc}", flush=True)
            time.sleep(5)
    if master is None:
        raise RuntimeError(f"could not open master after retries: {last_err}")

    ensure_source(
        master,
        SOURCE_ID,
        "Leafly flattened strains (re-enrich)",
        url=None,
        license="research / ToS unclear",
        redistributable=False,
        note="Re-enrich from staging; rich payload_json; scores not in attribute_kv",
    )

    src = connect(staging_path)
    src.execute("PRAGMA busy_timeout=60000")
    stats = {
        "rows_projected": 0,
        "master_chem_inserted": 0,
        "master_chem_updated": 0,
        "master_links_added": 0,
        "master_aliases_upserted": 0,
        "canonical_touched": 0,
        "payload_bytes_master_chem": 0,
        "staging_db": str(staging_path),
        "master_db": str(master_path),
    }

    for row in src.execute(
        "SELECT sc.name_norm, sc.name, sc.type, sc.summary_json, "
        "cp.id AS chem_id, cp.payload_json, cp.thc_min "
        "FROM chemistry_profile cp "
        "JOIN strain_canonical sc ON sc.name_norm = cp.name_norm "
        "WHERE cp.source_id=?",
        (SOURCE_ID,),
    ):
        name = row["name"]
        key = row["name_norm"]
        try:
            chem = json.loads(row["payload_json"] or "{}")
        except json.JSONDecodeError:
            chem = {}
        try:
            summary = json.loads(row["summary_json"] or "{}")
        except json.JSONDecodeError:
            summary = {}
        if not isinstance(chem, dict) or not chem:
            continue
        stats["rows_projected"] += 1
        upsert_canonical(master, name, type_=row["type"], summary=summary if isinstance(summary, dict) else {})
        if isinstance(summary, dict):
            _force_summary(master, key, summary)
        stats["canonical_touched"] += 1
        cid, action = _upsert_chemistry(master, name, chem, source_id=SOURCE_ID)
        stats[f"master_chem_{action}"] = stats.get(f"master_chem_{action}", 0) + 1
        stats["payload_bytes_master_chem"] += len(row["payload_json"] or "")
        if _ensure_chem_link(master, cid, key):
            stats["master_links_added"] += 1
        slug = chem.get("slug") or (summary.get("leafly_slug") if isinstance(summary, dict) else None)
        if slug and _upsert_slug_alias(master, str(slug), key):
            stats["master_aliases_upserted"] += 1
        if stats["rows_projected"] % 500 == 0:
            master.commit()
            print(f"  … master apply {stats['rows_projected']}")

    # Aliases that may only live in science_alias on staging
    for arow in src.execute(
        "SELECT alias_norm, alias, name_norm FROM science_alias WHERE source_id=?",
        (SOURCE_ID,),
    ):
        master.execute(
            "INSERT INTO science_alias(alias_norm, alias, name_norm, source_id) VALUES(?,?,?,?) "
            "ON CONFLICT(alias_norm) DO UPDATE SET "
            "alias=excluded.alias, name_norm=excluded.name_norm, source_id=excluded.source_id",
            (arow["alias_norm"], arow["alias"], arow["name_norm"], SOURCE_ID),
        )

    master.commit()
    stats["master_attr_kv_score_rows"] = master.execute(
        "SELECT COUNT(1) c FROM attribute_kv WHERE key LIKE '%_score' OR key LIKE '%percentile%'"
    ).fetchone()["c"]
    stats["master_attr_kv_total"] = master.execute(
        "SELECT COUNT(1) c FROM attribute_kv"
    ).fetchone()["c"]
    stats["master_leafly_chem"] = master.execute(
        "SELECT COUNT(1) c FROM chemistry_profile WHERE source_id IN (?, ?)",
        LEGACY_SOURCE_IDS,
    ).fetchone()["c"]
    sample = master.execute(
        "SELECT name, length(payload_json) FROM chemistry_profile "
        "WHERE source_id=? AND thc_min IS NOT NULL ORDER BY thc_min DESC LIMIT 3",
        (SOURCE_ID,),
    ).fetchall()
    stats["sample_payload_lens"] = [(r["name"], r[1]) for r in sample]
    # Confirm staging attr still zero
    stats["staging_attr_kv"] = src.execute("SELECT COUNT(1) c FROM attribute_kv").fetchone()["c"]
    stats["staging_raw"] = src.execute("SELECT COUNT(1) c FROM raw_record").fetchone()["c"]
    stats["master_corpus"] = corpus_stats(master)
    src.close()
    master.close()
    return stats


def enrich(
    *,
    dump: Path,
    master_path: Path,
    staging_dir: Path,
    store_staging_raw: bool = True,
    apply_master: bool = True,
    limit: int | None = None,
) -> dict[str, Any]:
    staging_dir.mkdir(parents=True, exist_ok=True)
    staging_path = staging_dir / STAGING_NAME
    if staging_path.exists():
        staging_path.unlink()

    init_corpus(staging_path)
    staging = connect(staging_path)
    staging.execute("PRAGMA busy_timeout=120000")
    ensure_source(
        staging,
        SOURCE_ID,
        "Leafly flattened strains (re-enrich)",
        url=str(dump / "flattened_strains.jsonl"),
        license="research / ToS unclear",
        redistributable=False,
        note="Full JSONL in raw_record; rich chem projection; no attribute_kv scores",
    )
    staging.execute(
        "INSERT INTO meta(key, value) VALUES(?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",
        ("staging_role", "staging"),
    )
    staging.execute(
        "INSERT INTO meta(key, value) VALUES(?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",
        ("staging_source_id", SOURCE_ID),
    )

    master = None
    if apply_master:
        last_err: Exception | None = None
        for attempt in range(1, 13):
            try:
                # Set timeout before schema script — master is often contended on NAS.
                uri = f"file:{master_path.as_posix()}?timeout=120000"
                mconn = sqlite3.connect(uri, uri=True, timeout=120.0)
                mconn.execute("PRAGMA busy_timeout=120000")
                mconn.close()
                init_corpus(master_path)
                master = connect(master_path)
                master.execute("PRAGMA busy_timeout=120000")
                break
            except sqlite3.OperationalError as exc:
                last_err = exc
                print(f"  master locked (attempt {attempt}/12): {exc}; sleeping…")
                time.sleep(5)
        if master is None:
            raise RuntimeError(f"could not open master after retries: {last_err}")
        ensure_source(
            master,
            SOURCE_ID,
            "Leafly flattened strains (re-enrich)",
            url=str(dump / "flattened_strains.jsonl"),
            license="research / ToS unclear",
            redistributable=False,
            note="Re-enrich: rich payload_json; scores not in attribute_kv",
        )

    stats = {
        "rows_read": 0,
        "rows_projected": 0,
        "staging_raw": 0,
        "staging_chem_inserted": 0,
        "staging_chem_updated": 0,
        "master_chem_inserted": 0,
        "master_chem_updated": 0,
        "master_links_added": 0,
        "master_aliases_upserted": 0,
        "canonical_touched": 0,
        "payload_bytes_staging_chem": 0,
        "payload_bytes_master_chem": 0,
        "source_path": str(
            (dump / "flattened_strains.jsonl")
            if (dump / "flattened_strains.jsonl").exists()
            else dump / "flattened_strains.csv"
        ),
        "staging_db": str(staging_path),
        "master_db": str(master_path) if apply_master else None,
    }

    raw_objs = load_rows(dump)
    if limit is not None:
        raw_objs = raw_objs[:limit]

    for obj in raw_objs:
        stats["rows_read"] += 1
        projected = project_row(obj)
        if not projected:
            continue
        stats["rows_projected"] += 1
        name = projected["name"]
        key = projected["name_norm"]
        chem = projected["chemistry"]
        summary = projected["summary"]

        if store_staging_raw:
            rid = store_raw_record(
                staging,
                source_id=SOURCE_ID,
                entity_kind="strain",
                entity_id=key,
                name=name,
                payload=projected["raw"],
                record_id=f"leafly:{obj.get('id') or key}",
            )
            stats["staging_raw"] += 1
            _ = rid

        cid_s, action_s = _upsert_chemistry(staging, name, chem, source_id=SOURCE_ID)
        stats[f"staging_chem_{action_s}"] = stats.get(f"staging_chem_{action_s}", 0) + 1
        stats["payload_bytes_staging_chem"] += len(json.dumps(chem, ensure_ascii=False))
        upsert_canonical(staging, name, type_=projected["type"], summary=summary)
        _force_summary(staging, key, summary)
        _ensure_chem_link(staging, cid_s, key)
        if projected.get("slug"):
            _upsert_slug_alias(staging, str(projected["slug"]), key)

        # Explicitly do not call store_attributes — scores stay in raw/payload only.

        if master is not None:
            upsert_canonical(master, name, type_=projected["type"], summary=summary)
            _force_summary(master, key, summary)
            stats["canonical_touched"] += 1
            cid_m, action_m = _upsert_chemistry(master, name, chem, source_id=SOURCE_ID)
            stats[f"master_chem_{action_m}"] = stats.get(f"master_chem_{action_m}", 0) + 1
            stats["payload_bytes_master_chem"] += len(json.dumps(chem, ensure_ascii=False))
            if _ensure_chem_link(master, cid_m, key):
                stats["master_links_added"] += 1
            if projected.get("slug") and _upsert_slug_alias(master, str(projected["slug"]), key):
                stats["master_aliases_upserted"] += 1

        if stats["rows_projected"] % 500 == 0:
            staging.commit()
            if master is not None:
                master.commit()
            print(f"  … {stats['rows_projected']}/{stats['rows_read']} projected")

    staging.commit()
    st_stats = corpus_stats(staging)
    staging.close()

    if master is not None:
        master.commit()
        # Confirm no Leafly score explosion in attribute_kv
        kv_scores = master.execute(
            "SELECT COUNT(1) c FROM attribute_kv WHERE key LIKE '%_score' OR key LIKE '%percentile%'"
        ).fetchone()["c"]
        stats["master_attr_kv_score_rows"] = kv_scores
        stats["master_attr_kv_total"] = master.execute(
            "SELECT COUNT(1) c FROM attribute_kv"
        ).fetchone()["c"]
        stats["master_leafly_chem"] = master.execute(
            "SELECT COUNT(1) c FROM chemistry_profile WHERE source_id IN (?, ?)",
            LEGACY_SOURCE_IDS,
        ).fetchone()["c"]
        # Sample payload richness vs old slim
        sample = master.execute(
            "SELECT name, length(payload_json) FROM chemistry_profile "
            "WHERE source_id=? AND thc_min IS NOT NULL ORDER BY thc_min DESC LIMIT 3",
            (SOURCE_ID,),
        ).fetchall()
        stats["sample_payload_lens"] = [(r["name"], r[1]) for r in sample]
        m_stats = corpus_stats(master)
        master.close()
    else:
        m_stats = {}

    stats["staging_corpus"] = st_stats
    stats["master_corpus"] = m_stats
    return stats


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--dump-dir", type=Path, default=DEFAULT_DUMP)
    ap.add_argument("--master", type=Path, default=DEFAULT_DB)
    ap.add_argument("--staging-dir", type=Path, default=STAGING_DIR)
    ap.add_argument("--limit", type=int, default=None)
    ap.add_argument("--staging-only", action="store_true")
    ap.add_argument(
        "--apply-from-staging",
        action="store_true",
        help="Merge existing leafly_flat_enrich.sqlite3 into master (no JSONL re-read)",
    )
    ap.add_argument("--no-raw", action="store_true", help="skip staging raw_record (not recommended)")
    args = ap.parse_args()

    try:
        return _main_inner(args)
    except Exception as exc:  # noqa: BLE001
        import traceback

        traceback.print_exc()
        err_path = args.staging_dir / "leafly_flat_enrich_apply.crash"
        err_path.write_text(f"{type(exc).__name__}: {exc}\n{traceback.format_exc()}", encoding="utf-8")
        print(f"CRASH written to {err_path}", flush=True)
        return 1


def _main_inner(args: argparse.Namespace) -> int:
    print(f"Leafly flat re-enrich from {args.dump_dir}", flush=True)
    staging_path = args.staging_dir / STAGING_NAME
    print(f"  staging -> {staging_path}", flush=True)
    if not args.staging_only:
        print(f"  master  -> {args.master}", flush=True)

    if args.apply_from_staging:
        stats = apply_staging_to_master(staging_path=staging_path, master_path=args.master)
    else:
        stats = enrich(
            dump=args.dump_dir,
            master_path=args.master,
            staging_dir=args.staging_dir,
            store_staging_raw=not args.no_raw,
            apply_master=not args.staging_only,
            limit=args.limit,
        )
    print(json.dumps(stats, indent=2, default=str), flush=True)
    if stats.get("master_attr_kv_score_rows", 0):
        print(
            f"NOTE: pre-existing score-like attribute_kv rows={stats['master_attr_kv_score_rows']} "
            "(enricher itself never writes attribute_kv)",
            file=sys.stderr,
            flush=True,
        )
    print(
        f"OK rows={stats.get('rows_projected', stats.get('rows_read'))} "
        f"chem +{stats.get('master_chem_inserted', 0)}/~{stats.get('master_chem_updated', 0)} "
        f"raw={stats.get('staging_raw', 'n/a')} kv_scores={stats.get('master_attr_kv_score_rows', 'n/a')} "
        f"kv_total={stats.get('master_attr_kv_total', 'n/a')}",
        flush=True,
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
