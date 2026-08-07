#!/usr/bin/env python3
"""Deep extract DB DUMP -> JSON sidecars + per-source staging SQLite.

Uses sibling staging API:
  brain/dsc_brain/staging.py  write_dump_to_staging / connect_staging
  brain/data/staging/<family>.sqlite3
  merge via scripts/merge_staging_to_master.py

Master is never wiped here. Fat raw stays in staging raw_record + dump JSON.
"""

from __future__ import annotations

import argparse
import csv
import json
import pickle
import re
import sys
import zipfile
from collections import defaultdict
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "scripts"))

from catalog_common import DATA, name_norm, write_dump  # noqa: E402
from brain.dsc_brain.paths import STAGING_DIR  # noqa: E402
from brain.dsc_brain.staging import (  # noqa: E402
    list_staging_dbs,
    write_dump_to_staging,
)

DEFAULT_DUMP = Path(r"y:\Digital Stealth Care\Projects\DB DUMP")


def _clean(r: dict) -> dict:
    return {k: v for k, v in r.items() if v not in (None, "", [], {})}


def _split_list(val: Any) -> list[str]:
    if val in (None, "", "NULL", "None"):
        return []
    if isinstance(val, list):
        return [str(x).strip() for x in val if str(x).strip()]
    s = str(val).strip()
    return [x.strip() for x in re.split(r"[,|;]", s) if x.strip() and x.strip().upper() != "NULL"]


def _pct(val: Any) -> list[float] | None:
    if val in (None, ""):
        return None
    if isinstance(val, (int, float)):
        f = float(val)
        return [f, f]
    s = str(val).strip().replace("%", "")
    m = re.search(r"(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)", s)
    if m:
        return [float(m.group(1)), float(m.group(2))]
    m = re.search(r"(\d+(?:\.\d+)?)", s)
    if m:
        f = float(m.group(1))
        return [f, f]
    return None


def _chem_mm(thc_min=None, thc_max=None, cbd_min=None, cbd_max=None, **extra) -> dict:
    chem: dict[str, Any] = {}
    try:
        if thc_min not in (None, "") or thc_max not in (None, ""):
            a = float(thc_min if thc_min not in (None, "") else thc_max)
            b = float(thc_max if thc_max not in (None, "") else thc_min)
            chem["thc_range"] = [a, b]
        if cbd_min not in (None, "") or cbd_max not in (None, ""):
            a = float(cbd_min if cbd_min not in (None, "") else cbd_max)
            b = float(cbd_max if cbd_max not in (None, "") else cbd_min)
            chem["cbd_range"] = [a, b]
    except (TypeError, ValueError):
        pass
    for k, v in extra.items():
        if v not in (None, "", [], {}):
            chem[k] = v
    return chem


def _stage(path: Path, *, reset: bool = False) -> dict:
    return write_dump_to_staging(path, reset=reset)


def extract_seedcity(dump: Path) -> Path | None:
    path = dump / "cannabis-strains-final.csv"
    if not path.exists():
        path = dump / "Cannabis-Strains-main" / "cannabis-strains.csv"
    if not path.exists():
        return None
    items = []
    with path.open(encoding="utf-8", errors="replace", newline="") as f:
        for r in csv.DictReader(f):
            name = str(r.get("strain_name") or "").strip()
            if not name:
                continue
            chem = {}
            thc, cbd = _pct(r.get("thc")), _pct(r.get("cbd"))
            if thc:
                chem["thc_range"] = thc
            if cbd:
                chem["cbd_range"] = cbd
            row = _clean(dict(r))
            row.update(
                {
                    "name": name,
                    "name_norm": name_norm(name),
                    "breeder": r.get("breeder"),
                    "type": r.get("indica_sativa") or r.get("strain_type_summary"),
                    "chemistry": chem,
                    "url": r.get("product_url"),
                    "source": "seedcity_local",
                }
            )
            items.append(row)
    out = DATA / "dsc_strains_seedcity_local.json"
    write_dump(out, "strains", items, source="seedcity_local", license="CC0-1.0", redistributable=True, note="DB DUMP Seed City")
    print(f"  extract seedcity_local items={len(items)}")
    return out


def extract_leafly_flat(dump: Path) -> Path | None:
    path = dump / "flattened_strains.jsonl"
    if not path.exists():
        return None
    items = []
    with path.open(encoding="utf-8", errors="replace") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                obj = json.loads(line)
            except json.JSONDecodeError:
                continue
            name = str(obj.get("name") or "").strip()
            if not name:
                continue
            chem = {}
            thc = _pct(obj.get("cannabinoid_thc_percentile50"))
            cbd = _pct(obj.get("cannabinoid_cbd_percentile50"))
            if thc:
                chem["thc_range"] = thc
            if cbd:
                chem["cbd_range"] = cbd
            effects, flavors = [], []
            for k, v in obj.items():
                if v in (None, "", 0, 0.0):
                    continue
                if k.startswith("effect_") and k.endswith("_score"):
                    try:
                        effects.append((k[7:-6], float(v)))
                    except (TypeError, ValueError):
                        pass
                if k.startswith("flavor_") and k.endswith("_score"):
                    try:
                        flavors.append((k[7:-6], float(v)))
                    except (TypeError, ValueError):
                        pass
            effects.sort(key=lambda x: x[1], reverse=True)
            flavors.sort(key=lambda x: x[1], reverse=True)
            # Slim projection for JSON sidecar; full obj still written as _raw for staging store_raw
            row = {
                "name": name,
                "name_norm": name_norm(name),
                "type": obj.get("phenotype") or obj.get("category"),
                "chemistry": chem,
                "top_effects": [e[0] for e in effects[:5]],
                "top_flavors": [f[0] for f in flavors[:5]],
                "slug": obj.get("slug"),
                "source": "leafly_flat",
                # keep full object under reserved key for raw_record staging
                "_full": obj,
            }
            items.append(row)
    # For staging raw: expand _full into store via write that uses store_raw on bulk leafly
    slim = []
    for it in items:
        full = it.pop("_full", None)
        # attach limited identity fields; staging bulk path stores whole row as raw
        if full:
            it["id"] = full.get("id")
            # Do NOT attach every score column to sidecar item (keeps JSON smaller)
        slim.append(it)
    out = DATA / "dsc_strains_leafly_flat.json"
    write_dump(
        out,
        "strains",
        slim,
        source="leafly_flat",
        license="research / ToS unclear",
        redistributable=False,
        note="Slim projection; full JSONL remains SoT on disk for overflow",
        source_url=str(path),
    )
    print(f"  extract leafly_flat items={len(slim)}")
    return out


def extract_intelligence(dump: Path) -> Path | None:
    path = (
        dump
        / "cannabis-intelligence-database-main"
        / "data"
        / "Cannabis_Intelligence_Database_15768_Strains_Final.csv"
    )
    if not path.exists():
        return None
    items = []
    with path.open(encoding="utf-8", errors="replace", newline="") as f:
        for r in csv.DictReader(f):
            name = str(r.get("strain_name") or "").strip()
            if not name:
                continue
            chem = _chem_mm(r.get("thc_min"), r.get("thc_max"), r.get("cbd_min"), r.get("cbd_max"))
            terps = _split_list(r.get("terpenes"))
            if terps:
                chem["top_terpenes"] = terps[:8]
            grow = {}
            try:
                if r.get("flowering_time_min") or r.get("flowering_time_max"):
                    a = float(r["flowering_time_min"] or r["flowering_time_max"])
                    b = float(r["flowering_time_max"] or r["flowering_time_min"])
                    grow["flowering_days"] = [a, b]
            except (TypeError, ValueError):
                pass
            if r.get("height_indoor"):
                grow["height_indoor"] = r["height_indoor"]
            if r.get("yield_units"):
                grow["yield_indoor"] = r["yield_units"]
            row = {
                "name": name,
                "name_norm": name_norm(name),
                "breeder": r.get("breeder_name"),
                "url": r.get("source_url"),
                "chemistry": chem,
                "top_effects": _split_list(r.get("effects"))[:5],
                "top_flavors": _split_list(r.get("flavors"))[:5],
                "description": (r.get("about_info") or "")[:800] or None,
                "source": "intelligence_db",
                **grow,
                "bank_name": r.get("bank_name"),
                "seed_gender": r.get("seed_gender"),
                "flowering_behavior": r.get("flowering_behavior"),
            }
            items.append(_clean(row))
    out = DATA / "dsc_strains_intelligence_db.json"
    write_dump(out, "strains", items, source="intelligence_db", license="research scrape", redistributable=False, source_url=str(path))
    print(f"  extract intelligence_db items={len(items)}")
    return out


def extract_north_atlantic(dump: Path) -> Path | None:
    """Delegate to import_strains_northatlantic (login/bundle/merch filter + north_atlantic staging)."""
    from import_strains_northatlantic import main as nas_main  # type: ignore

    rc = nas_main(["--dump-dir", str(dump), "--skip-staging", "--skip-merge"])
    out = DATA / "dsc_strains_northatlantic.json"
    if rc != 0 or not out.is_file():
        print("  extract northatlantic FAIL")
        return None
    count = 0
    try:
        count = int(json.loads(out.read_text(encoding="utf-8")).get("count") or 0)
    except (OSError, json.JSONDecodeError, TypeError, ValueError):
        pass
    print(f"  extract northatlantic items={count} -> {out.name}")
    return out


def extract_phytochem(dump: Path) -> Path | None:
    path = dump / "phytochemical-diversity-cannabis-main" / "data" / "preproc_lab_data_pub_20220218.csv"
    info = dump / "phytochemical-diversity-cannabis-main" / "data" / "strain_info_pub_20210915.csv"
    if not path.exists():
        return None
    slug_meta = {}
    if info.exists():
        with info.open(encoding="utf-8", errors="replace", newline="") as f:
            for r in csv.DictReader(f):
                slug = str(r.get("strain_slug") or "").strip()
                if slug:
                    slug_meta[slug] = r
    buckets: dict[str, dict] = {}
    anon = total = 0
    with path.open(encoding="utf-8", errors="replace", newline="") as f:
        for r in csv.DictReader(f):
            total += 1
            slug = str(r.get("strain_slug") or "").strip()
            if not slug:
                anon += 1
                continue
            name = slug.replace("-", " ")
            b = buckets.setdefault(slug, {"name": name, "n": 0, "thc": [], "cbd": [], "terps": defaultdict(list), "chemotype": None, "type": None})
            b["n"] += 1
            try:
                if r.get("tot_thc") not in (None, ""):
                    b["thc"].append(float(r["tot_thc"]))
                if r.get("tot_cbd") not in (None, ""):
                    b["cbd"].append(float(r["tot_cbd"]))
            except (TypeError, ValueError):
                pass
            if r.get("chemotype"):
                b["chemotype"] = r["chemotype"]
            meta = slug_meta.get(slug) or {}
            if meta.get("strain_category"):
                b["type"] = meta["strain_category"]
            for tcol in ("myrcene", "limonene", "caryophyllene", "linalool", "humulene", "terpinolene", "a_pinene", "b_pinene"):
                try:
                    if r.get(tcol) not in (None, ""):
                        b["terps"][tcol].append(float(r[tcol]))
                except (TypeError, ValueError):
                    pass
    items = []
    for slug, b in buckets.items():
        chem: dict[str, Any] = {"n_tests": b["n"]}
        if b["thc"]:
            chem["thc_range"] = [min(b["thc"]), max(b["thc"])]
        if b["cbd"]:
            chem["cbd_range"] = [min(b["cbd"]), max(b["cbd"])]
        if b["chemotype"]:
            chem["chemotype"] = b["chemotype"]
        top = sorted(((t, sum(v) / len(v)) for t, v in b["terps"].items() if v), key=lambda x: -x[1])
        if top:
            chem["top_terpenes"] = [t[0] for t in top[:5]]
        items.append(
            {
                "name": b["name"],
                "name_norm": name_norm(b["name"]),
                "type": b.get("type"),
                "chemistry": chem,
                "strain_slug": slug,
                "source": "phytochem_lab",
            }
        )
    out = DATA / "dsc_lab_phytochem_lab.json"
    write_dump(
        out,
        "lab",
        items,
        source="phytochem_lab",
        license="academic research",
        redistributable=False,
        note=f"agg by slug; anon_skipped={anon} total_rows={total}; raw CSV SoT",
    )
    print(f"  extract phytochem_lab named={len(items)} anon={anon} total={total}")
    return out


def extract_cannia(dump: Path) -> Path | None:
    path = dump / "cannia-master" / "src" / "data" / "strains.json"
    if not path.exists():
        path = dump / "cannia-master (1)" / "cannia-master" / "src" / "data" / "strains.json"
    if not path.exists():
        return None
    doc = json.loads(path.read_text(encoding="utf-8", errors="replace"))
    items = []
    for name, body in (doc if isinstance(doc, dict) else {}).items():
        if not isinstance(body, dict):
            continue
        effects = []
        if isinstance(body.get("effects"), dict):
            effects = [k for k, v in body["effects"].items() if v][:8]
        elif isinstance(body.get("effects"), list):
            effects = [str(x) for x in body["effects"][:8]]
        flavors = [str(x) for x in body["flavors"][:8]] if isinstance(body.get("flavors"), list) else []
        items.append(
            {
                "name": name,
                "name_norm": name_norm(name),
                "type": body.get("race"),
                "top_effects": effects,
                "top_flavors": flavors,
                "source": "cannia",
            }
        )
    out = DATA / "dsc_strains_cannia.json"
    write_dump(out, "strains", items, source="cannia", license="research", redistributable=False)
    print(f"  extract cannia items={len(items)}")
    return out


def extract_strains_master(dump: Path) -> Path | None:
    path = dump / "strains-master" / "strains.json"
    if not path.exists():
        return None
    doc = json.loads(path.read_text(encoding="utf-8", errors="replace"))
    items = []
    for r in doc if isinstance(doc, list) else []:
        name = str((r or {}).get("name") if isinstance(r, dict) else r).strip()
        if name:
            items.append({"name": name, "name_norm": name_norm(name), "source": "strains_master"})
    out = DATA / "dsc_strains_strains_master.json"
    write_dump(out, "strains", items, source="strains_master", license="unknown/research", redistributable=False)
    print(f"  extract strains_master items={len(items)}")
    return out


def extract_medical_effects(dump: Path) -> Path | None:
    path = dump / "cannabis_analysis-main" / "Needed CSV files" / "Read" / "strain_medical_effects.csv"
    if not path.exists():
        return None
    items = []
    with path.open(encoding="utf-8", errors="replace", newline="") as f:
        for r in csv.DictReader(f):
            name = str(r.get("name") or "").strip()
            if not name or name.isdigit():
                continue
            scored = []
            for k, v in r.items():
                if k in {"name", "type", "thc_level", "most_common_terpene"}:
                    continue
                try:
                    fv = float(v)
                except (TypeError, ValueError):
                    continue
                if fv > 0:
                    scored.append((k, fv))
            scored.sort(key=lambda x: -x[1])
            chem = {}
            thc = _pct(r.get("thc_level"))
            if thc:
                if thc[0] <= 1.0:
                    thc = [thc[0] * 100, thc[1] * 100]
                chem["thc_range"] = thc
            if r.get("most_common_terpene"):
                chem["top_terpenes"] = [r["most_common_terpene"]]
            items.append(
                {
                    "name": name,
                    "name_norm": name_norm(name),
                    "type": r.get("type"),
                    "chemistry": chem,
                    "top_effects": [k for k, _ in scored[:5]],
                    "source": "medical_effects",
                }
            )
    out = DATA / "dsc_strains_medical_effects.json"
    write_dump(
        out,
        "strains",
        items,
        source="medical_effects",
        license="research scrape",
        redistributable=False,
        note="Top effects only; full score matrix remains in CSV SoT",
    )
    print(f"  extract medical_effects items={len(items)}")
    return out


def extract_kushy_crosses(dump: Path) -> Path | None:
    path = dump / "cannabis_analysis-main" / "Needed CSV files" / "kushy_strains_crosses_with_nulls.csv"
    if not path.exists():
        return None
    items = []
    with path.open(encoding="utf-8", errors="replace", newline="") as f:
        for r in csv.DictReader(f):
            name = str(r.get("name") or "").strip()
            if not name:
                continue
            chem = {}
            for src, dest in (("thc", "thc_range"), ("cbd", "cbd_range")):
                pr = _pct(r.get(src))
                if pr:
                    chem[dest] = pr
            if r.get("terpenes") and str(r.get("terpenes")).upper() != "NULL":
                chem["top_terpenes"] = _split_list(r.get("terpenes"))[:5]
            row = {
                "name": name,
                "name_norm": name_norm(name),
                "type": r.get("type") if str(r.get("type") or "").upper() != "NULL" else None,
                "breeder": r.get("breeder") if str(r.get("breeder") or "").upper() != "NULL" else None,
                "chemistry": chem,
                "top_effects": _split_list(r.get("effects"))[:5] if str(r.get("effects") or "").upper() != "NULL" else [],
                "top_flavors": _split_list(r.get("flavor"))[:5] if str(r.get("flavor") or "").upper() != "NULL" else [],
                "crosses": r.get("crosses") if str(r.get("crosses") or "").upper() != "NULL" else None,
                "source": "kushy_crosses_local",
            }
            items.append(_clean(row))
    out = DATA / "dsc_strains_kushy_crosses_local.json"
    write_dump(out, "strains", items, source="kushy_crosses_local", license="MIT", redistributable=True)
    print(f"  extract kushy_crosses_local items={len(items)}")
    return out


def extract_pickles(dump: Path) -> Path | None:
    pdir = dump / "archive (3)" / "cannabis 2" / "Strain data" / "strains"
    zpath = dump / "archive (3).zip"
    items = []
    errors = 0

    def one(name: str, raw: bytes) -> None:
        nonlocal errors
        try:
            obj = pickle.loads(raw)
        except Exception:
            errors += 1
            return
        if not isinstance(obj, dict):
            errors += 1
            return
        strain = obj.get("strain") or Path(name).stem
        if isinstance(strain, bytes):
            strain = strain.decode("utf-8", "replace")
        name_s = str(strain).replace("-", " ").strip()
        cats = obj.get("categorias")
        if hasattr(cats, "tolist"):
            cats = cats.tolist()
        data = obj.get("data_strain")
        items.append(
            {
                "name": name_s,
                "name_norm": name_norm(name_s),
                "type": cats[0] if isinstance(cats, list) and cats else None,
                "n_reports": len(data) if isinstance(data, list) else 0,
                "source": "pickle_archive",
            }
        )

    if pdir.exists():
        for fp in sorted(pdir.glob("*.p")):
            one(fp.name, fp.read_bytes())
    elif zpath.exists():
        with zipfile.ZipFile(zpath) as z:
            for n in z.namelist():
                if n.endswith(".p"):
                    one(n, z.read(n))
    else:
        return None
    out = DATA / "dsc_strains_pickle_archive.json"
    write_dump(out, "strains", items, source="pickle_archive", license="research", redistributable=False, note=f"numpy pickle errors={errors}")
    print(f"  extract pickle_archive items={len(items)} errors={errors}")
    return out


def extract_replication_agg(dump: Path) -> Path | None:
    path = dump / "Replication_Data.csv"
    if not path.exists():
        return None
    buckets: dict[str, dict] = {}
    with path.open(encoding="utf-8", errors="replace", newline="") as f:
        for r in csv.DictReader(f):
            name = str(r.get("test_strain") or "").strip()
            leafly = str(r.get("leafly_strain") or "").strip()
            if not name and leafly:
                name = leafly.replace("-", " ")
            if not name:
                continue
            key = name_norm(name)
            b = buckets.setdefault(key, {"name": name, "n": 0, "thc": [], "cbd": [], "leafly": leafly, "type": r.get("strain_category"), "chemotype": None})
            b["n"] += 1
            try:
                if r.get("thc_max") not in (None, ""):
                    b["thc"].append(float(r["thc_max"]))
                if r.get("cbd_max") not in (None, ""):
                    b["cbd"].append(float(r["cbd_max"]))
            except (TypeError, ValueError):
                pass
            if r.get("chemotype"):
                b["chemotype"] = r["chemotype"]
    items = []
    for key, b in buckets.items():
        chem: dict[str, Any] = {"n_tests": b["n"]}
        if b["thc"]:
            chem["thc_range"] = [min(b["thc"]), max(b["thc"])]
        if b["cbd"]:
            chem["cbd_range"] = [min(b["cbd"]), max(b["cbd"])]
        if b["chemotype"]:
            chem["chemotype"] = b["chemotype"]
        items.append(
            {
                "name": b["name"],
                "name_norm": key,
                "type": b.get("type"),
                "chemistry": chem,
                "leafly_strain": b["leafly"],
                "source": "replication_wa",
            }
        )
    out = DATA / "dsc_lab_replication_wa.json"
    write_dump(out, "lab", items, source="replication_wa", license="research", redistributable=False, note="agg from Replication_Data.csv")
    print(f"  extract replication_wa items={len(items)}")
    return out


def record_skips(dump: Path) -> list[Path]:
    outs = []
    # parquet is image+label only
    pq = dump / "train-00000-of-00002.parquet"
    if pq.exists():
        out = DATA / "dsc_strains_parquet_train.json"
        write_dump(
            out,
            "strains",
            [],
            source="parquet_train_images",
            redistributable=False,
            note="SKIPPED: parquet cols=image(bytes),label(int) rows=158 — not strain chem",
            source_url=str(pq),
        )
        outs.append(out)
        print("  skip parquet image shard (158 rows)")
    if (dump / "session.db").exists():
        out = DATA / "dsc_session_adk_skip.json"
        write_dump(out, "discovery", [{"skipped": True, "reason": "adk_sessions"}], source="session_adk", note="SKIPPED ADK sessions")
        print("  skip session.db ADK")
    return outs


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dump-dir", type=Path, default=DEFAULT_DUMP)
    ap.add_argument("--merge", action="store_true")
    ap.add_argument("--skip-stage", action="store_true", help="extract JSON only")
    args = ap.parse_args()
    dump = args.dump_dir
    DATA.mkdir(parents=True, exist_ok=True)
    STAGING_DIR.mkdir(parents=True, exist_ok=True)

    print(f"Deep DB DUMP extract from {dump}")
    dumps: list[Path] = []
    for fn in (
        extract_seedcity,
        extract_leafly_flat,
        extract_intelligence,
        extract_north_atlantic,
        extract_phytochem,
        extract_cannia,
        extract_strains_master,
        extract_medical_effects,
        extract_kushy_crosses,
        extract_pickles,
        extract_replication_agg,
    ):
        try:
            p = fn(dump)
            if p:
                dumps.append(p)
        except Exception as exc:  # noqa: BLE001
            print(f"  FAIL {fn.__name__}: {exc}")
    record_skips(dump)

    staged = []
    if not args.skip_stage:
        print(f"Writing staging DBs under {STAGING_DIR}")
        for p in dumps:
            try:
                # reset per dump family so this pass is authoritative for that source
                st = _stage(p, reset=True)
                staged.append(st)
                print(f"  staged {p.name} -> {st.get('family')}.sqlite3 n={st.get('count')} raw={st.get('store_raw')}")
            except Exception as exc:  # noqa: BLE001
                print(f"  stage FAIL {p.name}: {exc}")
                staged.append({"path": str(p), "error": str(exc)})

    present = [p.name for p in list_staging_dbs()]
    manifest = DATA / "dsc_db_dump_staging_manifest.json"
    write_dump(
        manifest,
        "manifest",
        {"extracted": [str(p) for p in dumps], "staged": staged, "staging_dbs": present},
        source="db_dump_deep",
        note="Per-source staging under brain/data/staging/",
        redistributable=True,
    )
    print(f"staging DBs now: {present}")
    print(f"manifest -> {manifest}")

    if args.merge:
        from merge_staging_to_master import main as merge_main

        # Pass clean argv so merge argparse does not see --merge / dump flags.
        return merge_main([])
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
