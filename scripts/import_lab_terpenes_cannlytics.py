#!/usr/bin/env python3
"""Import Cannlytics HF lab results (multi-state) → dumps + staging + master.

Prefer per-state CSVs (not data/all ~2.5GB). Full COA rows stay in staging
raw_record + dump JSON + chemistry_profile.payload_json. No pesticide
attribute_kv spam. License CC-BY-4.0 / redistributable=true.

WA/CT/CO on HF are xlsx-only → CSV URL 404s are skipped and noted.
"""

from __future__ import annotations

import argparse
import csv
import io
import json
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any, Iterator

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "scripts"))

from catalog_common import DATA, UA, name_norm, write_dump  # noqa: E402
from brain.dsc_brain.corpus import (  # noqa: E402
    add_chemistry,
    add_link,
    connect,
    corpus_stats,
    ensure_source,
    init_corpus,
    link_science_to_seed,
    rebuild_search_docs,
    store_raw_record,
    upsert_canonical,
)
from brain.dsc_brain.paths import DEFAULT_DB, STAGING_DIR, staging_db_path  # noqa: E402
from brain.dsc_brain.staging import (  # noqa: E402
    connect_staging,
    init_staging,
    resolve_source_family,
)

HF_BASE = (
    "https://huggingface.co/datasets/cannlytics/cannabis_results/resolve/main/data"
)

# CSV-backed states (wa/ct/co are xlsx-only on HF).
DEFAULT_EXPAND_STATES = [
    "ny",
    "ri",
    "ut",
    "mi",
    "hi",
    "ma",
    "or",
    "nv",
    "fl",
    "ca",
]
# Try these too (expected CSV 404 → note skip).
TRY_ALSO = ["wa", "ct", "co"]
SKIP_DEFAULT = {"md", "all"}  # MD already sampled; all ≈ 2.5GB

CACHE_DIR = STAGING_DIR / "_cache_cannlytics"
SOURCE_ID = "cannlytics_expand"
LICENSE = "CC-BY-4.0"

NAMED_TERPS = {
    "myrcene",
    "limonene",
    "caryophyllene",
    "pinene",
    "linalool",
    "humulene",
    "terpinolene",
    "ocimene",
    "nerolidol",
    "bisabolol",
    "guaiol",
    "eucalyptol",
    "geraniol",
    "camphene",
    "carene",
    "cymene",
    "isopulegol",
    "terpinene",
    "alpha_pinene",
    "beta_pinene",
    "beta_caryophyllene",
    "beta_myrcene",
}


def state_csv_url(state: str) -> str:
    s = state.lower().strip()
    return f"{HF_BASE}/{s}/{s}-results-latest.csv"


def _float_or_none(val: Any) -> float | None:
    if val in (None, ""):
        return None
    try:
        return float(val)
    except (TypeError, ValueError):
        return None


def extract_name(r: dict[str, Any]) -> str:
    # Prefer human strain/product names; skip opaque track-and-trace labels.
    for key in (
        "strain_name",
        "product_name",
        "variety",
        "sample_name",
        "name",
        "Strain Name",
        "Product Name",
    ):
        val = str(r.get(key) or "").strip()
        if val:
            return val
    return ""


def extract_chemistry(r: dict[str, Any]) -> dict[str, Any]:
    chem: dict[str, Any] = {}
    thc = _float_or_none(r.get("total_thc") or r.get("thc_total") or r.get("thc"))
    cbd = _float_or_none(r.get("total_cbd") or r.get("cbd_total") or r.get("cbd"))
    if thc is not None:
        chem["thc_range"] = [thc, thc]
    if cbd is not None:
        chem["cbd_range"] = [cbd, cbd]
    terps: list[tuple[str, float]] = []
    for k, v in r.items():
        lk = (k or "").lower().replace(" ", "_").replace("-", "_")
        if lk in {"product_type", "strain_name", "product_name", "date_tested"}:
            continue
        if not (
            "terp" in lk
            or lk.endswith("_pct")
            or lk in NAMED_TERPS
            or any(t in lk for t in NAMED_TERPS)
        ):
            continue
        fv = _float_or_none(v)
        if fv is None or fv <= 0:
            continue
        terps.append((k, fv))
    terps.sort(key=lambda x: x[1], reverse=True)
    if terps:
        chem["top_terpenes"] = [t[0] for t in terps[:5]]
        chem["terpene_values"] = {t[0]: t[1] for t in terps[:30]}
    return chem


def download_state_csv(state: str, *, timeout: int = 3600, force: bool = False) -> Path:
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    dest = CACHE_DIR / f"{state}-results-latest.csv"
    if dest.exists() and dest.stat().st_size > 0 and not force:
        print(f"  cache hit {dest.name} ({dest.stat().st_size / 1e6:.1f} MB)")
        return dest
    url = state_csv_url(state)
    print(f"  downloading {url} ...")
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
    tmp = dest.with_suffix(".csv.part")
    t0 = time.time()
    last_log = 0
    with urllib.request.urlopen(req, timeout=timeout) as resp, tmp.open("wb") as out:
        n = 0
        while True:
            chunk = resp.read(1024 * 1024)
            if not chunk:
                break
            out.write(chunk)
            n += len(chunk)
            if n - last_log >= 50 * 1024 * 1024:
                print(f"    ... {n / 1e6:.0f} MB ({time.time() - t0:.0f}s)")
                last_log = n
    tmp.replace(dest)
    print(f"  saved {dest.name} ({dest.stat().st_size / 1e6:.1f} MB in {time.time() - t0:.0f}s)")
    return dest


def iter_csv_rows(path: Path) -> Iterator[dict[str, str]]:
    with path.open("r", encoding="utf-8-sig", newline="", errors="replace") as fh:
        reader = csv.DictReader(fh)
        for r in reader:
            yield {k: (v if v is not None else "") for k, v in r.items()}


def row_to_item(r: dict[str, str], *, state: str) -> dict[str, Any] | None:
    name = extract_name(r)
    if not name:
        return None
    item = {k: v for k, v in r.items() if v not in (None, "")}
    item["name"] = name
    item["name_norm"] = name_norm(name)
    item["state"] = state
    item["source"] = "cannlytics_hf"
    chem = extract_chemistry(r)
    if chem:
        item["chemistry"] = chem
    return item


# Identity / lab meta kept in staging payload alongside chemistry.
_META_KEEP = {
    "name",
    "name_norm",
    "state",
    "source",
    "strain_name",
    "product_name",
    "variety",
    "sample_name",
    "product_type",
    "date_tested",
    "lab",
    "lab_id",
    "producer_id",
    "producer_license_number",
    "sample_id",
    "package_id",
    "batch_id",
    "month",
    "year",
}

# Wide residual panels stay in dump JSON only (staging payload keeps chem + meta).
_DROP_PREFIXES = (
    "1_",
    "2_",
    "3_",
)
_DROP_EXACT = {
    "acephate",
    "acequinocyl",
    "acetamiprid",
    "acetone",
    "acetonitrile",
    "aldicarb",
    "arsenic",
    "avermectin_b1b",
    "azoxystrobin",
    "benzene",
    "bifenazate",
    "bifenthrin",
    "boscalid",
    "cadmium",
    "carbaryl",
    "carbofuran",
    "chlorantraniliprole",
    "chlorfenapyr",
    "chlorpyrifos",
    "chromium",
    "clofentezine",
    "cyfluthrin",
    "cypermethrin",
    "daminozide",
    "diazinon",
    "dichloromethane",
    "dichlorvos",
    "dimethoate",
    "ethanol",
    "ethoprophos",
    "ethylene_oxide",
    "fenoxycarb",
    "fenpyroximate",
    "flonicamid",
    "fludioxonil",
    "hexythiazox",
    "imazalil",
    "imidacloprid",
    "kresoxim_methyl",
    "lead",
    "malathion",
    "mercury",
    "metalaxyl",
    "methiocarb",
    "methomyl",
    "methyl_parathion",
    "mevinphos",
    "mycobutanil",
    "naled",
    "oxamyl",
    "paclobutrazol",
    "pentachloronitrobenzene",
    "permethrin",
    "phosmet",
    "piperonyl_butoxide",
    "prallethrin",
    "propiconazole",
    "propoxur",
    "pyrethrins",
    "pyridaben",
    "spinetoram",
    "spinosad",
    "spiromesifen",
    "spirotetramat",
    "spiroxamine",
    "tebuconazole",
    "thiacloprid",
    "thiamethoxam",
    "trifloxystrobin",
}


def chem_payload_for_master(item: dict[str, Any]) -> dict[str, Any]:
    """Chem summary + identity/meta for master/staging.

    Full residual/pesticide panels remain in dump JSON (and optional raw_record).
    Staging payload keeps cannabinoids/terpenes + COA identity — not every
    pesticide column (avoids NAS SQLite OOM while still carrying evidence).
    """
    chem = item.get("chemistry") if isinstance(item.get("chemistry"), dict) else {}
    payload: dict[str, Any] = {}
    for k, v in item.items():
        if k == "chemistry":
            continue
        if v in (None, "", [], {}):
            continue
        lk = (k or "").lower()
        if k in _META_KEEP or lk in _META_KEEP:
            payload[k] = v
            continue
        # Keep cannabinoid / terpene / totals columns
        if any(
            x in lk
            for x in (
                "thc",
                "cbd",
                "cbg",
                "cbn",
                "cbc",
                "thcv",
                "terp",
                "myrcene",
                "limonene",
                "caryophyllene",
                "pinene",
                "linalool",
                "humulene",
                "ocimene",
                "bisabolol",
                "nerolidol",
                "guaiol",
                "eucalyptol",
            )
        ):
            payload[k] = v
            continue
        if lk in _DROP_EXACT or lk.startswith(_DROP_PREFIXES):
            continue
        # Unknown non-residual-looking keys: keep (may be useful meta)
        if lk.endswith("_pct") or "moisture" in lk or "water" in lk:
            payload[k] = v
    if chem:
        payload["chemistry"] = chem
        payload.update(chem)
    payload["coa_full_in_dump"] = True
    return payload


def write_dump_streaming(
    path: Path,
    kind: str,
    items: Iterator[dict[str, Any]],
    *,
    meta: dict[str, Any],
) -> int:
    """Stream items into a schema-v2 dump without holding the full list."""
    DATA.mkdir(parents=True, exist_ok=True)
    header = {
        "schema_version": 2,
        "kind": kind,
        "built_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        **meta,
        "items": None,  # placeholder replaced below
    }
    # Write manually so we can stream the array
    with path.open("w", encoding="utf-8") as fh:
        fh.write('{"schema_version":2,')
        fh.write(f'"kind":{json.dumps(kind)},')
        fh.write(f'"built_at":{json.dumps(header["built_at"])},')
        for k, v in meta.items():
            if k in {"schema_version", "kind", "built_at", "items", "count"}:
                continue
            fh.write(f"{json.dumps(k)}:{json.dumps(v, default=str)},")
        fh.write('"items":[')
        n = 0
        for item in items:
            if n:
                fh.write(",")
            fh.write(json.dumps(item, ensure_ascii=False, separators=(",", ":")))
            n += 1
            if n % 25000 == 0:
                fh.flush()
                print(f"    dump ... {n} rows")
        fh.write("],")
        fh.write(f'"count":{n}')
        fh.write("}")
    return n


def ingest_item(conn, item: dict[str, Any], *, source_id: str, store_raw: bool = False) -> None:
    name = item["name"]
    payload = chem_payload_for_master(item)
    cid = add_chemistry(conn, name, payload, source_id=source_id)
    key = name_norm(name)
    if key:
        upsert_canonical(conn, name)
        add_link(conn, "chemistry_profile", cid, "strain_canonical", key, source=source_id)
    # Full COA already lives in dump JSON + chemistry_profile.payload_json.
    # raw_record is optional (expensive SHA/dedupe per row on NAS).
    if store_raw:
        store_raw_record(
            conn,
            source_id=source_id,
            entity_kind="chemistry_profile",
            entity_id=cid,
            name=name,
            payload=item,
        )


def process_state(
    state: str,
    conn,
    *,
    max_rows: int | None,
    force_download: bool,
    store_raw: bool,
    stage_all_rows: bool,
) -> dict[str, Any]:
    path = download_state_csv(state, force=force_download)
    out_path = DATA / f"dsc_lab_terpenes_cannlytics_{state}.json"
    unique: set[str] = set()
    n_csv = 0

    # Pass 1: dump ALL named COA rows (full columns; SoT on NAS).
    def dump_gen() -> Iterator[dict[str, Any]]:
        nonlocal n_csv
        n = 0
        for r in iter_csv_rows(path):
            n_csv += 1
            if max_rows is not None and n >= max_rows:
                break
            item = row_to_item(r, state=state)
            if not item:
                continue
            unique.add(item["name_norm"])
            n += 1
            if n % 25000 == 0:
                print(f"    dump ... {n} rows", flush=True)
            yield item

    print(f"  writing dump {out_path.name} ...", flush=True)
    count: int | None = None
    skip_dump = path.stat().st_size > 400 * 1024 * 1024  # CA-scale: NAS chokes on multi-GB JSON
    if skip_dump:
        print(
            f"  skip full JSON dump (csv {path.stat().st_size/1e6:.0f} MB); "
            "staging unique COAs from CSV (dump SoT = cached CSV)",
            flush=True,
        )
        named_n = 0
        for r in iter_csv_rows(path):
            n_csv += 1
            item = row_to_item(r, state=state)
            if not item:
                continue
            unique.add(item["name_norm"])
            named_n += 1
            if max_rows is not None and named_n >= max_rows:
                break
            if named_n % 100000 == 0:
                print(f"    csv scan ... {named_n} named", flush=True)
        count = named_n
        # Tiny pointer dump so HA data/ has a discoverable artifact
        write_dump(
            out_path,
            "lab_chemistry_pointer",
            [
                {
                    "note": "full COA rows live in cached CSV (too large for JSON dump on SMB)",
                    "csv_cache": str(path),
                    "named_rows": count,
                    "unique_names": len(unique),
                    "state": state,
                }
            ],
            source="cannlytics",
            source_url=state_csv_url(state),
            license=LICENSE,
            redistributable=True,
            state=state,
            csv_bytes=path.stat().st_size,
            errors=["json_dump_skipped_large_csv"],
        )
    elif out_path.exists() and out_path.stat().st_size > 1000:
        try:
            with out_path.open("rb") as fh:
                fh.seek(max(0, out_path.stat().st_size - 160))
                end = fh.read().decode("utf-8", errors="replace")
            import re

            m = re.search(r'"count"\s*:\s*(\d+)\s*\}\s*$', end.strip())
            if m and end.rstrip().endswith("}"):
                count = int(m.group(1))
                print(f"  reuse dump {out_path.name} rows~={count}", flush=True)
        except OSError:
            count = None

    if count is None:
        n_csv = 0
        unique.clear()
        count = write_dump_streaming(
            out_path,
            "lab_chemistry",
            dump_gen(),
            meta={
                "source": "cannlytics",
                "source_url": state_csv_url(state),
                "license": LICENSE,
                "redistributable": True,
                "state": state,
                "truncated": bool(max_rows is not None),
                "errors": [],
            },
        )
        print(f"  dump done rows={count} unique={len(unique)}", flush=True)

    mode = "all rows" if stage_all_rows else "unique name_norm (first COA)"
    print(f"  staging ({mode}) ...", flush=True)

    # Pass 2: staging/master projection. Default = first full COA per name_norm
    # (maximize unique coverage). Dumps still hold every row.
    n_items = 0
    seen_stage: set[str] = set()
    for r in iter_csv_rows(path):
        if max_rows is not None and n_items >= max_rows and stage_all_rows:
            break
        item = row_to_item(r, state=state)
        if not item:
            continue
        nn = item["name_norm"]
        if not stage_all_rows:
            if nn in seen_stage:
                continue
            seen_stage.add(nn)
        ingest_item(conn, item, source_id=SOURCE_ID, store_raw=store_raw)
        n_items += 1
        if n_items % 2000 == 0:
            conn.commit()
        if n_items % 10000 == 0:
            print(f"    staging ... {n_items} rows", flush=True)
    conn.commit()
    # Prefer staged unique count when dump was reused without a full unique scan.
    if not unique:
        unique = set(seen_stage)
    return {
        "state": state,
        "rows": count,
        "unique_names": len(unique) if unique else len(seen_stage),
        "csv_lines": n_csv,
        "dump": str(out_path),
        "bytes": path.stat().st_size,
        "staged": n_items,
        "stage_mode": "all" if stage_all_rows else "unique_first",
    }


def merge_to_master() -> dict[str, Any]:
    sys.path.insert(0, str(ROOT / "scripts"))
    import merge_staging_to_master as msm  # noqa: E402

    family = resolve_source_family(SOURCE_ID)
    stg_path = staging_db_path(family)
    master_path = DEFAULT_DB
    init_corpus(master_path)
    master = connect(master_path)
    master.execute("PRAGMA busy_timeout=180000")
    before = corpus_stats(master)
    print(f"\nMerging {stg_path} -> {master_path}")
    st = msm.merge_one(master, stg_path, include_raw=False)
    master.commit()
    links = link_science_to_seed(master)
    docs = rebuild_search_docs(master)
    master.commit()
    after = corpus_stats(master)
    delta = {k: after.get(k, 0) - before.get(k, 0) for k in sorted(set(before) | set(after))}
    master.close()
    return {"merge": st, "links": links, "search_docs": docs, "before": before, "after": after, "delta": delta}


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--states", type=str, default=",".join(DEFAULT_EXPAND_STATES))
    ap.add_argument("--max-rows-per-state", type=int, default=None)
    ap.add_argument("--max-rows", type=int, default=None, help="legacy alias")
    ap.add_argument("--include-md", action="store_true")
    ap.add_argument("--merge", action="store_true")
    ap.add_argument("--reset-staging", action="store_true", default=True)
    ap.add_argument("--no-reset-staging", action="store_true")
    ap.add_argument("--force-download", action="store_true")
    ap.add_argument(
        "--store-raw",
        action="store_true",
        help="also write raw_record (slow; dumps + payload_json already keep full COA)",
    )
    ap.add_argument(
        "--stage-all-rows",
        action="store_true",
        help="stage every COA row (default: first full COA per unique name_norm)",
    )
    ap.add_argument("--skip-xlsx-probes", action="store_true", help="do not try wa/ct/co")
    ap.add_argument("--legacy-single", action="store_true")
    args = ap.parse_args()

    if args.legacy_single:
        return _legacy_single(args.max_rows or args.max_rows_per_state or 50000)

    states = [s.strip().lower() for s in args.states.split(",") if s.strip()]
    if not args.include_md:
        states = [s for s in states if s not in SKIP_DEFAULT]
    if not args.skip_xlsx_probes:
        for extra in TRY_ALSO:
            if extra not in states:
                states.append(extra)

    priority = ["ny", "ri", "ut", "mi", "hi", "ma", "or", "nv", "fl", "wa", "ct", "co", "ca"]
    rank = {s: i for i, s in enumerate(priority)}
    states = sorted(set(states), key=lambda s: (rank.get(s, 50), s))
    cap = args.max_rows_per_state if args.max_rows_per_state is not None else args.max_rows

    family = resolve_source_family(SOURCE_ID)
    stg_path = staging_db_path(family)
    reset = args.reset_staging and not args.no_reset_staging
    if reset and stg_path.exists():
        print(f"Reset staging {stg_path}")
        stg_path.unlink()
    init_staging(
        SOURCE_ID,
        note=f"multi-state expand; states={','.join(states)}; full COA payloads",
    )
    conn = connect_staging(SOURCE_ID)
    conn.commit()
    conn.execute("PRAGMA busy_timeout=180000")
    conn.execute("PRAGMA synchronous=NORMAL")
    ensure_source(
        conn,
        SOURCE_ID,
        "Cannlytics HF cannabis_results (multi-state expand)",
        url="https://huggingface.co/datasets/cannlytics/cannabis_results",
        license=LICENSE,
        redistributable=True,
        note="full COA in raw_record + payload_json; no attribute_kv pesticides",
    )
    conn.commit()

    summary: dict[str, Any] = {
        "states_ok": [],
        "states_skip": [],
        "per_state": {},
        "errors": [],
        "unique_names": 0,
        "total_rows": 0,
        "staging": str(stg_path),
        "source_id": SOURCE_ID,
    }
    all_unique: set[str] = set()

    for state in states:
        print(f"\n=== {state} ===")
        try:
            st = process_state(
                state,
                conn,
                max_rows=cap,
                force_download=args.force_download,
                store_raw=args.store_raw,
                stage_all_rows=args.stage_all_rows,
            )
        except urllib.error.HTTPError as exc:
            msg = f"{state}: HTTP {exc.code} (skip - likely xlsx-only)"
            print(f"  {msg}")
            summary["states_skip"].append({"state": state, "reason": f"HTTP {exc.code}"})
            summary["errors"].append(msg)
            continue
        except Exception as exc:  # noqa: BLE001
            msg = f"{state}: {exc}"
            print(f"  ERR {msg}")
            summary["states_skip"].append({"state": state, "reason": str(exc)})
            summary["errors"].append(msg)
            continue
        summary["states_ok"].append(state)
        summary["per_state"][state] = st
        summary["total_rows"] += st["rows"]
        # unique tracked inside process; re-query loosely via dump note
        print(
            f"  rows={st['rows']} unique_names={st['unique_names']} "
            f"csv_lines={st['csv_lines']} -> {Path(st['dump']).name}"
        )
        # accumulate unique approx from per-state (overcounts across states)
        all_unique.add(f"__state_{state}_unique_{st['unique_names']}")

    # Accurate unique name_norm from staging
    cur = conn.execute(
        "SELECT COUNT(DISTINCT name_norm) FROM chemistry_profile WHERE name_norm IS NOT NULL AND name_norm != ''"
    )
    summary["unique_names"] = int(cur.fetchone()[0])
    summary["staging_stats"] = corpus_stats(conn)
    conn.commit()
    conn.close()

    # Lightweight expand index (not a second full dump of every row)
    index_path = DATA / "dsc_lab_terpenes_cannlytics_expand.json"
    write_dump(
        index_path,
        "lab_chemistry_index",
        [
            {
                "state": s,
                "rows": summary["per_state"][s]["rows"],
                "unique_names": summary["per_state"][s]["unique_names"],
                "dump": summary["per_state"][s]["dump"],
            }
            for s in summary["states_ok"]
        ],
        source="cannlytics",
        source_url="https://huggingface.co/datasets/cannlytics/cannabis_results",
        license=LICENSE,
        redistributable=True,
        states=summary["states_ok"],
        states_skipped=summary["states_skip"],
        total_rows=summary["total_rows"],
        unique_names=summary["unique_names"],
        errors=summary["errors"],
    )
    summary["expand_index"] = str(index_path)

    if args.merge:
        summary["master_delta"] = merge_to_master()

    report = DATA / "dsc_lab_terpenes_cannlytics_expand_report.json"
    report.write_text(json.dumps(summary, indent=2, default=str), encoding="utf-8")
    print(f"\nReport -> {report}", flush=True)
    print(
        f"OK states={summary['states_ok']} skipped={[x.get('state') for x in summary['states_skip']]} "
        f"rows={summary['total_rows']} unique={summary['unique_names']}",
        flush=True,
    )
    if summary.get("master_delta"):
        print(f"master delta: {summary['master_delta'].get('delta')}", flush=True)
    return 0 if summary["states_ok"] else 1


def _legacy_single(max_rows: int) -> int:
    from catalog_common import fetch_text

    urls = [state_csv_url("md"), state_csv_url("ca"), state_csv_url("or")]
    text = None
    used = None
    errors: list[str] = []
    for url in urls:
        try:
            print(f"fetching {url} ...")
            text = fetch_text(url, timeout=600)
            used = url
            break
        except Exception as exc:  # noqa: BLE001
            errors.append(f"{url}: {exc}")
    if not text:
        print("Cannlytics import failed:\n " + "\n ".join(errors))
        return 1
    items = []
    for r in csv.DictReader(io.StringIO(text)):
        item = row_to_item(r, state="md")
        if not item:
            continue
        items.append(item)
        if len(items) >= max_rows:
            break
    out = DATA / "dsc_lab_terpenes_cannlytics.json"
    write_dump(
        out,
        "lab_chemistry",
        items,
        source="cannlytics",
        source_url=used,
        license=LICENSE,
        redistributable=True,
        errors=errors,
        truncated=len(items) >= max_rows,
    )
    print(f"wrote {out} count={len(items)} from {used}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:  # noqa: BLE001
        import traceback

        traceback.print_exc()
        print(f"FATAL: {exc}", flush=True)
        raise SystemExit(1) from exc
