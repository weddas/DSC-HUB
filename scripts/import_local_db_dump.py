#!/usr/bin/env python3
"""Import useful files from the local DB DUMP folder into schema-v2 catalog dumps.

Default dump root:
  y:/Digital Stealth Care/Projects/DB DUMP

Produces (gitignored) dumps under homeassistant/data/:
  dsc_strains_seedcity_local.json
  dsc_strains_leafly_flat.json
  dsc_strains_leafly_features.json
  dsc_lab_replication.json
  dsc_strains_pickle_archive.json   (best-effort without numpy)
  dsc_strains_project_lists.json
"""

from __future__ import annotations

import argparse
import csv
import io
import json
import re
import sys
import zipfile
from pathlib import Path
from typing import Any, Iterable

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from catalog_common import DATA, name_norm, parse_grow_fields, write_dump  # noqa: E402

DEFAULT_DUMP = Path(r"y:\Digital Stealth Care\Projects\DB DUMP")


def _pct_range(val: Any) -> list[float] | None:
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


def _clean_row(r: dict) -> dict:
    return {k: v for k, v in r.items() if v not in (None, "", [], {})}


def import_seedcity_local(dump: Path) -> Path | None:
    candidates = [
        dump / "cannabis-strains-final.csv",
        dump / "cannabis-strains-final (1).csv",
    ]
    path = next((p for p in candidates if p.exists()), None)
    if not path:
        return None
    items = []
    with path.open(encoding="utf-8", errors="replace", newline="") as f:
        for r in csv.DictReader(f):
            name = str(r.get("strain_name") or r.get("name") or "").strip()
            if not name:
                continue
            row = _clean_row(dict(r))
            row["name"] = name
            row["name_norm"] = name_norm(name)
            row["breeder"] = r.get("breeder") or None
            row["type"] = r.get("indica_sativa") or r.get("strain_type_summary") or None
            chem: dict[str, Any] = {}
            thc = _pct_range(r.get("thc"))
            cbd = _pct_range(r.get("cbd"))
            if thc:
                chem["thc_range"] = thc
                row["thc_range"] = thc
            if cbd:
                chem["cbd_range"] = cbd
                row["cbd_range"] = cbd
            if chem:
                row["chemistry"] = chem
            # typed grow fields when present
            for src, dst in (
                ("height_indoor", "height_cm"),
                ("indoor_height_detail", "height_cm"),
                ("height_outdoor", "height_cm"),
                ("indoor_flowering_time", "flowering_days"),
                ("flowering_time", "flowering_days"),
            ):
                if row.get(src) and not row.get(dst):
                    # keep raw string; parse_grow_fields may extract numbers
                    blob = str(row[src])
                    props = parse_grow_fields(f"{dst.replace('_', ' ')}: {blob}")
                    for k, v in props.items():
                        if k not in row or row[k] in (None, "", [], {}):
                            row[k] = v
            blob = " ".join(
                str(row.get(k) or "")
                for k in ("growth_and_harvest", "overview", "description", "experience")
            )
            if blob.strip():
                for k, v in parse_grow_fields(blob).items():
                    if k not in row or row[k] in (None, "", [], {}):
                        row[k] = v
            row["source"] = "seedcity_local_cc0"
            items.append(row)
    out = DATA / "dsc_strains_seedcity_local.json"
    write_dump(
        out,
        "strains",
        items,
        source="seedcity_local",
        source_url=str(path),
        license="CC0-1.0",
        redistributable=True,
        note="Local DB DUMP copy of Seed City CC0 dataset (richer columns)",
    )
    print(f"seedcity_local: {len(items)} -> {out}")
    return out


def import_leafly_flat(dump: Path) -> Path | None:
    # Prefer JSONL (full nested fidelity) then CSV
    jsonl = dump / "flattened_strains.jsonl"
    csv_path = dump / "flattened_strains.csv"
    items: list[dict] = []
    used = None
    if jsonl.exists():
        used = str(jsonl)
        with jsonl.open(encoding="utf-8", errors="replace") as f:
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
                row = _clean_row(dict(obj))
                row["name"] = name
                row["name_norm"] = name_norm(name)
                row["type"] = obj.get("phenotype") or obj.get("category")
                chem: dict[str, Any] = {}
                thc = obj.get("cannabinoid_thc_percentile50")
                cbd = obj.get("cannabinoid_cbd_percentile50")
                thc_r = _pct_range(thc)
                cbd_r = _pct_range(cbd)
                if thc_r:
                    chem["thc_range"] = thc_r
                if cbd_r:
                    chem["cbd_range"] = cbd_r
                # top effects / flavors from scored columns
                effects = []
                flavors = []
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
                if effects:
                    row["top_effects"] = [e[0] for e in effects[:5]]
                if flavors:
                    row["top_flavors"] = [f[0] for f in flavors[:5]]
                    chem.setdefault("top_terpenes", [])  # flavors ≠ terps; keep separate
                if chem:
                    row["chemistry"] = chem
                row["source"] = "leafly_flat_research"
                items.append(row)
    elif csv_path.exists():
        used = str(csv_path)
        with csv_path.open(encoding="utf-8", errors="replace", newline="") as f:
            for r in csv.DictReader(f):
                name = str(r.get("name") or "").strip()
                if not name:
                    continue
                row = _clean_row(dict(r))
                row["name"] = name
                row["name_norm"] = name_norm(name)
                row["type"] = r.get("phenotype") or r.get("category")
                chem = {}
                thc_r = _pct_range(r.get("cannabinoid_thc_percentile50"))
                cbd_r = _pct_range(r.get("cannabinoid_cbd_percentile50"))
                if thc_r:
                    chem["thc_range"] = thc_r
                if cbd_r:
                    chem["cbd_range"] = cbd_r
                if chem:
                    row["chemistry"] = chem
                row["source"] = "leafly_flat_research"
                items.append(row)
    else:
        return None
    out = DATA / "dsc_strains_leafly_flat.json"
    write_dump(
        out,
        "strains",
        items,
        source="leafly_flat",
        source_url=used,
        license="research scrape / upstream ToS unclear",
        redistributable=False,
        note="Leafly-style flattened community chem percentiles + effects/flavors",
    )
    print(f"leafly_flat: {len(items)} -> {out}")
    return out


def import_leafly_features(dump: Path) -> Path | None:
    """Strain/Type/Rating/Effects/Flavor/Description CSVs from archive zips / xlsx sibling."""
    items: list[dict] = []
    used = None

    def ingest_csv_text(text: str, label: str) -> None:
        nonlocal used
        used = used or label
        reader = csv.DictReader(io.StringIO(text))
        for r in reader:
            name = str(r.get("Strain") or r.get("strain") or r.get("name") or "").strip()
            if not name:
                continue
            row = _clean_row(dict(r))
            row["name"] = name.replace("-", " ")
            row["name_norm"] = name_norm(row["name"])
            row["type"] = r.get("Type") or r.get("type")
            if r.get("Effects"):
                row["top_effects"] = [x.strip() for x in str(r["Effects"]).split(",") if x.strip()]
            if r.get("Flavor"):
                row["top_flavors"] = [x.strip() for x in str(r["Flavor"]).split(",") if x.strip()]
            row["source"] = "leafly_features_kaggle"
            items.append(row)

    # Prefer unzipped sibling if present via archive
    for zname in ("archive.zip", "archive (1).zip"):
        zpath = dump / zname
        if not zpath.exists():
            continue
        with zipfile.ZipFile(zpath) as z:
            for n in z.namelist():
                if not n.lower().endswith(".csv"):
                    continue
                raw = z.read(n)
                try:
                    text = raw.decode("utf-8")
                except UnicodeDecodeError:
                    text = raw.decode("latin-1", errors="replace")
                # only the 6-col features style
                head = text.splitlines()[0] if text else ""
                if "Strain" in head and "Effects" in head:
                    ingest_csv_text(text, f"{zname}:{n}")
                    break
        if items:
            break

    if not items:
        return None
    # de-dupe by name_norm keeping first
    seen = set()
    uniq = []
    for it in items:
        k = it["name_norm"]
        if k in seen:
            continue
        seen.add(k)
        uniq.append(it)
    out = DATA / "dsc_strains_leafly_features.json"
    write_dump(
        out,
        "strains",
        uniq,
        source="leafly_features",
        source_url=used,
        license="research scrape (Kaggle-class Leafly features)",
        redistributable=False,
        note="Effects/flavor/description feature table",
    )
    print(f"leafly_features: {len(uniq)} -> {out}")
    return out


def import_replication_lab(dump: Path, *, max_rows: int | None = None) -> Path | None:
    path = dump / "Replication_Data.csv"
    if not path.exists():
        return None
    items = []
    with path.open(encoding="utf-8", errors="replace", newline="") as f:
        for r in csv.DictReader(f):
            name = str(r.get("test_strain") or r.get("leafly_strain") or "").strip()
            if not name:
                continue
            # leafly slug → spaces
            if "-" in name and " " not in name and not r.get("test_strain"):
                name = name.replace("-", " ")
            display = str(r.get("test_strain") or name).strip()
            row = _clean_row(dict(r))
            row["name"] = display
            row["name_norm"] = name_norm(display)
            chem: dict[str, Any] = {}
            thc = _pct_range(r.get("thc_max"))
            cbd = _pct_range(r.get("cbd_max"))
            if thc:
                chem["thc_range"] = thc
            if cbd:
                chem["cbd_range"] = cbd
            if r.get("chemotype"):
                chem["chemotype"] = r.get("chemotype")
            if chem:
                row["chemistry"] = chem
            row["type"] = r.get("strain_category")
            row["lab_name"] = r.get("lab_name")
            row["source"] = "replication_data_lab"
            items.append(row)
            if max_rows and len(items) >= max_rows:
                break
    out = DATA / "dsc_lab_replication.json"
    write_dump(
        out,
        "lab_chemistry",
        items,
        source="replication_data",
        source_url=str(path),
        license="research / academic replication dataset (verify upstream)",
        redistributable=False,
        note="Lab flower-lot THC/CBD max + chemotype; research corpus",
        truncated=bool(max_rows and len(items) >= max_rows),
    )
    print(f"replication_lab: {len(items)} -> {out}")
    return out


def import_strain_project_lists(dump: Path) -> Path | None:
    zpath = next(dump.glob("Strain project*.zip"), None)
    if not zpath:
        return None
    items = []
    with zipfile.ZipFile(zpath) as z:
        for n in z.namelist():
            low = n.lower()
            if low.endswith(".csv"):
                text = z.read(n).decode("utf-8", errors="replace")
                reader = csv.DictReader(io.StringIO(text))
                for r in reader:
                    name = str(r.get("name") or r.get("Strain") or r.get("strain") or "").strip()
                    if not name:
                        # maybe first column
                        vals = list(r.values())
                        name = str(vals[0] if vals else "").strip()
                    if not name:
                        continue
                    row = _clean_row(dict(r))
                    row["name"] = name
                    row["name_norm"] = name_norm(name)
                    row["type"] = r.get("type") or r.get("Type")
                    row["source"] = "strain_project_lists"
                    items.append(row)
            elif low.endswith(".txt"):
                kind = Path(n).stem.replace("-", " ")
                text = z.read(n).decode("utf-8", errors="replace")
                for line in text.splitlines():
                    name = line.strip().strip(",").strip()
                    if not name or len(name) < 2:
                        continue
                    items.append(
                        {
                            "name": name,
                            "name_norm": name_norm(name),
                            "type": kind,
                            "source": "strain_project_lists",
                        }
                    )
    if not items:
        return None
    seen = set()
    uniq = []
    for it in items:
        k = it["name_norm"]
        if k in seen:
            continue
        seen.add(k)
        uniq.append(it)
    out = DATA / "dsc_strains_project_lists.json"
    write_dump(
        out,
        "strains",
        uniq,
        source="strain_project",
        source_url=str(zpath),
        license="unknown / research",
        redistributable=False,
        note="Simple phenotype name lists from Strain project zip",
    )
    print(f"strain_project: {len(uniq)} -> {out}")
    return out


def import_pickles_best_effort(dump: Path, *, limit: int = 2000) -> Path | None:
    """Best-effort parse of archive (3).zip .p files without requiring numpy."""
    zpath = dump / "archive (3).zip"
    if not zpath.exists():
        return None
    items = []
    errors = 0
    try:
        import pickle
    except ImportError:
        return None

    class _Dummy:
        def __init__(self, *a, **k):
            pass

        def __setstate__(self, state):
            self.__dict__.update(state if isinstance(state, dict) else {"_state": state})

    class Unpickler(pickle.Unpickler):
        def find_class(self, module, name):
            if module.startswith("numpy") or module.startswith("pandas"):
                return _Dummy
            try:
                return super().find_class(module, name)
            except Exception:
                return _Dummy

    with zipfile.ZipFile(zpath) as z:
        names = [n for n in z.namelist() if n.endswith(".p")]
        for n in names[:limit]:
            try:
                raw = z.read(n)
                obj = Unpickler(io.BytesIO(raw)).load()
                if not isinstance(obj, dict):
                    # Dummy may wrap
                    obj = getattr(obj, "__dict__", {}) or {}
                # common keys from leafly-style pickles
                strain = obj.get("strain") or obj.get("name") or Path(n).stem
                if isinstance(strain, bytes):
                    strain = strain.decode("utf-8", "replace")
                name = str(strain).replace("-", " ").strip()
                if not name:
                    continue
                row = {"name": name, "name_norm": name_norm(name), "source": "pickle_archive_research"}
                for k, v in obj.items():
                    if k in ("strain",):
                        continue
                    if isinstance(v, (str, int, float, bool)):
                        row[k] = v
                    elif isinstance(v, (list, dict)):
                        try:
                            json.dumps(v)
                            row[k] = v
                        except TypeError:
                            row[k] = str(v)[:500]
                    else:
                        row[k] = str(v)[:500]
                items.append(row)
            except Exception:
                errors += 1
                continue
    if not items:
        print(f"pickle_archive: 0 items (errors={errors})")
        return None
    out = DATA / "dsc_strains_pickle_archive.json"
    write_dump(
        out,
        "strains",
        items,
        source="pickle_archive",
        source_url=str(zpath),
        license="research scrape",
        redistributable=False,
        note=f"Best-effort pickle parse; errors={errors}",
        errors=errors,
    )
    print(f"pickle_archive: {len(items)} -> {out} (errors={errors})")
    return out


def import_parquet_if_possible(dump: Path) -> Path | None:
    path = dump / "train-00000-of-00002.parquet"
    if not path.exists():
        return None
    try:
        import pandas as pd  # type: ignore
    except ImportError:
        print("parquet: skipped (pandas not installed)")
        return None
    try:
        df = pd.read_parquet(path)
    except Exception as exc:  # noqa: BLE001
        print(f"parquet: failed to read ({exc})")
        return None
    items = []
    cols = {c.lower(): c for c in df.columns}
    name_col = cols.get("name") or cols.get("strain") or cols.get("strain_name") or list(df.columns)[0]
    for _, series in df.iterrows():
        name = str(series.get(name_col) or "").strip()
        if not name or name == "nan":
            continue
        row = {"name": name, "name_norm": name_norm(name), "source": "hf_parquet_train"}
        for c in df.columns:
            v = series.get(c)
            if v is None:
                continue
            try:
                if isinstance(v, float) and v != v:  # NaN
                    continue
            except Exception:
                pass
            if hasattr(v, "item"):
                try:
                    v = v.item()
                except Exception:
                    v = str(v)
            if isinstance(v, (str, int, float, bool)):
                row[str(c)] = v
            else:
                row[str(c)] = str(v)[:500]
        items.append(row)
        if len(items) >= 25000:
            break
    out = DATA / "dsc_strains_parquet_train.json"
    write_dump(
        out,
        "strains",
        items,
        source="parquet_train",
        source_url=str(path),
        license="unknown / verify HF dataset card",
        redistributable=False,
        note="First shard of train parquet; capped at 25k",
    )
    print(f"parquet_train: {len(items)} -> {out}")
    return out


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dump-dir", type=Path, default=DEFAULT_DUMP)
    ap.add_argument("--replication-max", type=int, default=None, help="cap lab replication rows")
    ap.add_argument("--skip-pickle", action="store_true")
    ap.add_argument("--skip-parquet", action="store_true")
    ap.add_argument(
        "--write-staging",
        action="store_true",
        help="Also ingest each written JSON into brain/data/staging/<family>.sqlite3 (full raw_record)",
    )
    args = ap.parse_args(argv)
    dump = args.dump_dir
    if not dump.exists():
        print(f"dump dir missing: {dump}")
        return 1
    DATA.mkdir(parents=True, exist_ok=True)
    outs = []
    outs.append(import_seedcity_local(dump))
    outs.append(import_leafly_flat(dump))
    outs.append(import_leafly_features(dump))
    outs.append(import_replication_lab(dump, max_rows=args.replication_max))
    outs.append(import_strain_project_lists(dump))
    if not args.skip_pickle:
        outs.append(import_pickles_best_effort(dump))
    if not args.skip_parquet:
        outs.append(import_parquet_if_possible(dump))
    ok = [p for p in outs if p]
    staging_results = []
    if args.write_staging and ok:
        sys.path.insert(0, str(ROOT))
        from brain.dsc_brain.staging import write_dumps_to_staging  # noqa: E402

        print("Writing staging DBs (full raw_record)...")
        staging_results = write_dumps_to_staging(ok)
    print(
        json.dumps(
            {
                "wrote": [str(p) for p in ok],
                "count": len(ok),
                "staging": [
                    {k: r[k] for k in ("family", "staging_db", "count", "error") if k in r}
                    for r in staging_results
                ],
            },
            indent=2,
        )
    )
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
