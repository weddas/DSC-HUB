#!/usr/bin/env python3
"""Import local DB DUMP folder files into schema-v2 catalog dumps.

Reads from a folder of CSVs/zips (default: sibling `DB DUMP`), writes
`homeassistant/data/dsc_strains_*.json` and `dsc_lab_*.json` with honest
license / redistributable flags. Skips session.db; skips pickle/parquet
when deps missing.
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
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from catalog_common import DATA, name_norm, parse_grow_fields, write_dump  # noqa: E402

DEFAULT_DUMP = Path(r"y:\Digital Stealth Care\Projects\DB DUMP")


def _clean(row: dict) -> dict:
    return {k: (v.strip() if isinstance(v, str) else v) for k, v in row.items() if k is not None}


def _fnum(val: Any) -> float | None:
    if val in (None, "", "NA", "NaN", "null"):
        return None
    try:
        return float(str(val).replace("%", "").strip())
    except (TypeError, ValueError):
        return None


def _slug_to_name(slug: str) -> str:
    s = (slug or "").replace("-", " ").replace("_", " ").strip()
    return re.sub(r"\s+", " ", s)


def import_seedcity_local(dump: Path, errors: list[str]) -> Path | None:
    path = dump / "cannabis-strains-final.csv"
    if not path.exists():
        alt = dump / "cannabis-strains-final (1).csv"
        path = alt if alt.exists() else path
    if not path.exists():
        errors.append("seedcity_local: missing cannabis-strains-final.csv")
        return None
    items: list[dict] = []
    with path.open(encoding="utf-8", errors="replace") as fh:
        for r in csv.DictReader(fh):
            r = _clean(r)
            name = str(r.get("strain_name") or r.get("name") or "").strip()
            if not name:
                continue
            row = dict(r)
            row["name"] = name
            row["name_norm"] = name_norm(name)
            if row.get("indica_sativa") or row.get("type") or row.get("strain_type"):
                row["type"] = row.get("indica_sativa") or row.get("type") or row.get("strain_type")
            breeder = row.get("breeder") or row.get("seed_bank") or row.get("brand")
            if breeder:
                row["breeder"] = breeder
            for src, dst in (
                ("flowering_time", "flowering_days"),
                ("indoor_flowering_time", "flowering_days"),
                ("height_indoor", "height_cm"),
                ("height", "height_cm"),
            ):
                if row.get(src) and not row.get(dst):
                    row[dst] = row[src]
            thc = _fnum(row.get("thc"))
            cbd = _fnum(row.get("cbd"))
            chem: dict[str, Any] = {}
            if thc is not None:
                chem["thc_range"] = [thc, thc]
                row["thc_range"] = [thc, thc]
            if cbd is not None:
                chem["cbd_range"] = [cbd, cbd]
                row["cbd_range"] = [cbd, cbd]
            if chem:
                row["chemistry"] = chem
            blob = " ".join(
                str(row.get(k) or "")
                for k in ("growth_and_harvest", "overview", "description", "experience")
            )
            if blob.strip():
                props = parse_grow_fields(blob)
                for k, v in props.items():
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
        note="Local DB DUMP Seed City CSV (typed grow fields; richer than remote HF when present)",
        errors=errors,
    )
    print(f"wrote {out.name} count={len(items)}")
    return out


def import_flattened_leafly(dump: Path, errors: list[str]) -> Path | None:
    path = dump / "flattened_strains.csv"
    if not path.exists():
        errors.append("leafly_flat: missing flattened_strains.csv")
        return None
    items: list[dict] = []
    with path.open(encoding="utf-8", errors="replace") as fh:
        for r in csv.DictReader(fh):
            r = _clean(r)
            name = str(r.get("name") or r.get("strain") or "").strip()
            if not name:
                continue
            row = dict(r)
            row["name"] = name
            row["name_norm"] = name_norm(name)
            cat = str(r.get("category") or "").strip().lower()
            if cat:
                row["type"] = cat
            chem: dict[str, Any] = {}
            thc = _fnum(r.get("cannabinoid_thc_percentile50"))
            cbd = _fnum(r.get("cannabinoid_cbd_percentile50"))
            cbg = _fnum(r.get("cannabinoid_cbg_percentile50"))
            cbc = _fnum(r.get("cannabinoid_cbc_percentile50"))
            thcv = _fnum(r.get("cannabinoid_thcv_percentile50"))
            if thc is not None:
                chem["thc_range"] = [thc, thc]
                row["thc_range"] = [thc, thc]
            if cbd is not None:
                chem["cbd_range"] = [cbd, cbd]
                row["cbd_range"] = [cbd, cbd]
            for k, v in (("cbg", cbg), ("cbc", cbc), ("thcv", thcv)):
                if v is not None:
                    chem[k] = v
            # terpene percentile columns stay in attribute overflow via full row
            if chem:
                row["chemistry"] = chem
            row["source"] = "leafly_flattened"
            items.append(row)
    out = DATA / "dsc_strains_leafly_flat.json"
    write_dump(
        out,
        "strains",
        items,
        source="leafly_flat",
        source_url=str(path),
        license="upstream Leafly-style scrape / research-only",
        redistributable=False,
        note="Effects/flavors/cannabinoid percentiles; not redistributable without legal review",
        errors=errors,
    )
    print(f"wrote {out.name} count={len(items)}")
    return out


def import_replication_lab(dump: Path, errors: list[str], *, max_rows: int | None) -> Path | None:
    """Aggregate WA-style lab replication rows to one chemistry profile per strain."""
    path = dump / "Replication_Data.csv"
    if not path.exists():
        errors.append("replication: missing Replication_Data.csv")
        return None
    buckets: dict[str, dict[str, Any]] = {}
    raw_n = 0
    with path.open(encoding="utf-8", errors="replace") as fh:
        for r in csv.DictReader(fh):
            raw_n += 1
            if max_rows and raw_n > max_rows:
                break
            test = str(r.get("test_strain") or "").strip()
            leafly = str(r.get("leafly_strain") or "").strip()
            name = test or _slug_to_name(leafly)
            if not name:
                continue
            key = name_norm(name)
            if not key:
                continue
            thc = _fnum(r.get("thc_max"))
            cbd = _fnum(r.get("cbd_max"))
            b = buckets.get(key)
            if b is None:
                b = {
                    "name": name,
                    "name_norm": key,
                    "leafly_slug": leafly or None,
                    "thc_vals": [],
                    "cbd_vals": [],
                    "labs": set(),
                    "orgs": set(),
                    "chemotypes": set(),
                    "years": set(),
                    "n_tests": 0,
                    "sample_test_id": r.get("test_id"),
                    "strain_category": r.get("strain_category"),
                }
                buckets[key] = b
            b["n_tests"] += 1
            if thc is not None:
                b["thc_vals"].append(thc)
            if cbd is not None:
                b["cbd_vals"].append(cbd)
            if r.get("lab_name"):
                b["labs"].add(str(r["lab_name"]))
            if r.get("org_name"):
                b["orgs"].add(str(r["org_name"]))
            if r.get("chemotype"):
                b["chemotypes"].add(str(r["chemotype"]))
            if r.get("year"):
                b["years"].add(str(r["year"]))

    items: list[dict] = []
    for b in buckets.values():
        thcs = sorted(b["thc_vals"])
        cbds = sorted(b["cbd_vals"])
        chem: dict[str, Any] = {"n_tests": b["n_tests"]}
        if thcs:
            chem["thc_range"] = [thcs[0], thcs[-1]]
            chem["thc_median"] = thcs[len(thcs) // 2]
            chem["thc_max"] = thcs[-1]
        if cbds:
            chem["cbd_range"] = [cbds[0], cbds[-1]]
            chem["cbd_median"] = cbds[len(cbds) // 2]
            chem["cbd_max"] = cbds[-1]
        row = {
            "name": b["name"],
            "name_norm": b["name_norm"],
            "leafly_slug": b["leafly_slug"],
            "chemistry": chem,
            "thc_range": chem.get("thc_range"),
            "cbd_range": chem.get("cbd_range"),
            "lab_names": sorted(b["labs"])[:20],
            "org_names": sorted(b["orgs"])[:20],
            "chemotypes": sorted(b["chemotypes"]),
            "years": sorted(b["years"]),
            "n_tests": b["n_tests"],
            "strain_category": b["strain_category"],
            "sample_test_id": b["sample_test_id"],
            "source": "replication_wa_lab",
        }
        items.append(row)

    out = DATA / "dsc_lab_replication_wa.json"
    write_dump(
        out,
        "lab",
        items,
        source="replication_wa",
        source_url=str(path),
        license="academic replication / research-only (license unclear)",
        redistributable=False,
        note=(
            f"Aggregated unique strains from {raw_n} lab rows "
            f"(thc_max/cbd_max ranges + lab metadata); maximize unique coverage"
        ),
        errors=errors,
    )
    print(f"wrote {out.name} count={len(items)} from raw_rows={raw_n}")
    return out


def import_leafly_kaggle_zip(dump: Path, errors: list[str]) -> Path | None:
    """Kaggle-style Strain/Type/Rating/Effects/Flavor/Description from archive zips."""
    candidates = [
        dump / "archive.zip",
        dump / "archive (1).zip",
    ]
    text = None
    used = None
    for zp in candidates:
        if not zp.exists():
            continue
        try:
            with zipfile.ZipFile(zp) as zf:
                names = [
                    n
                    for n in zf.namelist()
                    if n.lower().endswith(".csv") and not n.startswith("__")
                ]
                # Prefer classic cannabis.csv columns
                prefer = [n for n in names if Path(n).name.lower() in {"cannabis.csv", "cannabis_strains_features.csv"}]
                order = prefer + [n for n in names if n not in prefer]
                for n in order:
                    raw = zf.read(n).decode("utf-8", errors="replace")
                    reader = csv.DictReader(io.StringIO(raw))
                    fields = {f.lower() for f in (reader.fieldnames or [])}
                    if "strain" in fields and ("type" in fields or "effects" in fields):
                        text = raw
                        used = f"{zp.name}:{n}"
                        break
            if text:
                break
        except Exception as exc:  # noqa: BLE001
            errors.append(f"leafly_kaggle {zp.name}: {exc}")
    if not text:
        # also try loose CSV next to xlsx
        loose = dump / "Cannabis_Strains_Features.csv"
        if loose.exists():
            text = loose.read_text(encoding="utf-8", errors="replace")
            used = str(loose)
        else:
            errors.append("leafly_kaggle: no matching zip/csv")
            return None

    items: list[dict] = []
    for r in csv.DictReader(io.StringIO(text)):
        r = _clean(r)
        name = str(r.get("Strain") or r.get("strain") or r.get("name") or "").strip()
        if not name:
            continue
        row = dict(r)
        row["name"] = name.replace("-", " ") if name.count("-") and " " not in name else name
        # Keep original slug-ish name if present; normalize display spaces for 100-Og style
        if re.fullmatch(r"[A-Za-z0-9]+(?:-[A-Za-z0-9]+)+", name):
            row["name"] = name.replace("-", " ")
        row["name_norm"] = name_norm(row["name"])
        if r.get("Type") or r.get("type"):
            row["type"] = r.get("Type") or r.get("type")
        if r.get("Effects") or r.get("effects"):
            row["effects"] = r.get("Effects") or r.get("effects")
        if r.get("Flavor") or r.get("flavor"):
            row["flavor"] = r.get("Flavor") or r.get("flavor")
        if r.get("Description") or r.get("description"):
            row["description"] = r.get("Description") or r.get("description")
        if r.get("Rating") not in (None, ""):
            row["rating"] = r.get("Rating")
        row["source"] = "leafly_kaggle"
        items.append(row)

    out = DATA / "dsc_strains_leafly_kaggle.json"
    write_dump(
        out,
        "strains",
        items,
        source="leafly_kaggle",
        source_url=used,
        license="Kaggle cannabis.csv mirror / Leafly-derived; research-only",
        redistributable=False,
        note="Classic Kaggle Leafly columns from local archive.zip",
        errors=errors,
    )
    print(f"wrote {out.name} count={len(items)} from {used}")
    return out


def import_mj_simple(dump: Path, errors: list[str]) -> Path | None:
    zpath = next(dump.glob("Strain project-*.zip"), None)
    if not zpath:
        errors.append("mj_simple: missing Strain project-*.zip")
        return None
    items: list[dict] = []
    try:
        with zipfile.ZipFile(zpath) as zf:
            # type list txts + MJ_strains_simple.csv
            for n in zf.namelist():
                if n.endswith("MJ_strains_simple.csv"):
                    text = zf.read(n).decode("utf-8", errors="replace")
                    for r in csv.DictReader(io.StringIO(text)):
                        r = _clean(r)
                        name = str(r.get("strain") or "").strip()
                        if not name:
                            continue
                        row = {
                            "name": name,
                            "name_norm": name_norm(name),
                            "type": r.get("species") or r.get("detailed_species"),
                            "detailed_species": r.get("detailed_species"),
                            "source": "mj_strains_simple",
                        }
                        items.append(row)
                elif n.endswith(".txt") and "Strain project" in n.replace("\\", "/"):
                    typ = Path(n).stem  # indica, sativa, etc.
                    for line in zf.read(n).decode("utf-8", errors="replace").splitlines():
                        name = line.strip()
                        if not name or name.startswith("#"):
                            continue
                        items.append(
                            {
                                "name": name,
                                "name_norm": name_norm(name),
                                "type": typ.replace("-", " "),
                                "source": "mj_strains_typelist",
                            }
                        )
    except Exception as exc:  # noqa: BLE001
        errors.append(f"mj_simple: {exc}")
        return None

    # de-dupe by name_norm keeping first richer type
    seen: dict[str, dict] = {}
    for row in items:
        k = row["name_norm"]
        if k not in seen:
            seen[k] = row
        elif not seen[k].get("type") and row.get("type"):
            seen[k] = row

    out_items = list(seen.values())
    out = DATA / "dsc_strains_mj_simple.json"
    write_dump(
        out,
        "strains",
        out_items,
        source="mj_simple",
        source_url=str(zpath),
        license="unknown / research type lists",
        redistributable=False,
        note="Strain project zip: MJ_strains_simple + indica/sativa/hybrid text lists",
        errors=errors,
    )
    print(f"wrote {out.name} count={len(out_items)}")
    return out


def try_parquet(dump: Path, errors: list[str]) -> None:
    path = dump / "train-00000-of-00002.parquet"
    if not path.exists():
        return
    try:
        import pyarrow.parquet as pq  # type: ignore
    except ImportError:
        errors.append(
            "parquet: skipped (pyarrow/pandas not installed); "
            f"{path.name} ~{path.stat().st_size // (1024*1024)}MB left on disk"
        )
        print(f"SKIP parquet {path.name} (no pyarrow)")
        return
    # Optional path if deps appear later
    try:
        table = pq.read_table(path)
        cols = table.column_names
        print(f"parquet cols={len(cols)} rows={table.num_rows} (not yet mapped)")
        errors.append(f"parquet: present but unmapped schema cols={cols[:20]}")
    except Exception as exc:  # noqa: BLE001
        errors.append(f"parquet read fail: {exc}")


def try_pickles(dump: Path, errors: list[str]) -> None:
    zpath = dump / "archive (3).zip"
    if not zpath.exists():
        return
    try:
        import numpy  # noqa: F401
    except ImportError:
        with zipfile.ZipFile(zpath) as zf:
            n = sum(1 for x in zf.namelist() if x.endswith(".p"))
        errors.append(
            f"pickles: skipped archive (3).zip ({n} .p files; needs numpy to unpickle)"
        )
        print(f"SKIP pickles archive (3).zip n={n} (no numpy)")
        return
    errors.append("pickles: numpy present but importer not implemented this pass")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--dump-dir", type=Path, default=DEFAULT_DUMP)
    ap.add_argument(
        "--replication-max-rows",
        type=int,
        default=0,
        help="Cap raw Replication_Data rows (0=all); still aggregates to unique strains",
    )
    ap.add_argument(
        "--skip",
        nargs="*",
        default=[],
        help="Skip stages: seedcity,flat,replication,kaggle,mj,parquet,pickles",
    )
    ap.add_argument(
        "--write-staging",
        action="store_true",
        help="Also ingest each written JSON into brain/data/staging/<family>.sqlite3 (full raw_record)",
    )
    args = ap.parse_args()
    dump: Path = args.dump_dir
    if not dump.is_dir():
        print(f"dump dir missing: {dump}")
        return 1

    skip = {s.lower() for s in args.skip}
    errors: list[str] = []
    written: list[str] = []
    written_paths: list[Path] = []

    print(f"Importing DB DUMP from {dump}")
    if "seedcity" not in skip:
        p = import_seedcity_local(dump, errors)
        if p:
            written.append(p.name)
            written_paths.append(p)
    if "flat" not in skip:
        p = import_flattened_leafly(dump, errors)
        if p:
            written.append(p.name)
            written_paths.append(p)
    if "replication" not in skip:
        mx = args.replication_max_rows or None
        p = import_replication_lab(dump, errors, max_rows=mx)
        if p:
            written.append(p.name)
            written_paths.append(p)
    if "kaggle" not in skip:
        p = import_leafly_kaggle_zip(dump, errors)
        if p:
            written.append(p.name)
            written_paths.append(p)
    if "mj" not in skip:
        p = import_mj_simple(dump, errors)
        if p:
            written.append(p.name)
            written_paths.append(p)
    if "parquet" not in skip:
        try_parquet(dump, errors)
    if "pickles" not in skip:
        try_pickles(dump, errors)

    # Always skip session.db (documented)
    if (dump / "session.db").exists():
        print("SKIP session.db (ADK sessions; irrelevant)")

    staging_results = []
    if args.write_staging and written_paths:
        sys.path.insert(0, str(ROOT))
        from brain.dsc_brain.staging import write_dumps_to_staging  # noqa: E402

        print("Writing staging DBs (full raw_record)...")
        staging_results = write_dumps_to_staging(written_paths)

    summary = {
        "written": written,
        "errors": errors,
        "staging": [
            {k: r[k] for k in ("family", "staging_db", "count", "error") if k in r}
            for r in staging_results
        ],
    }
    print(json.dumps(summary, indent=2))
    return 0 if written else 1


if __name__ == "__main__":
    raise SystemExit(main())
