#!/usr/bin/env python3
"""Probe schemas of high-value DB DUMP files not yet deeply imported."""
from __future__ import annotations

import csv
import json
import sqlite3
from pathlib import Path

DUMP = Path(r"y:\Digital Stealth Care\Projects\DB DUMP")


def peek_csv(path: Path, n: int = 2) -> None:
    print(f"\n=== CSV {path.relative_to(DUMP)} ({path.stat().st_size} bytes) ===")
    with path.open(encoding="utf-8", errors="replace", newline="") as f:
        r = csv.DictReader(f)
        cols = r.fieldnames or []
        print(f"cols({len(cols)}): {cols[:40]}")
        if len(cols) > 40:
            print(f"  ... +{len(cols)-40} more")
        for i, row in enumerate(r):
            if i >= n:
                break
            sample = {k: (str(v)[:80] if v else v) for k, v in list(row.items())[:12]}
            print(f"  row{i}: {sample}")
        # count roughly
        count = i + 1
        for _ in r:
            count += 1
        print("rows=", count)


def peek_json(path: Path) -> None:
    print(f"\n=== JSON {path.relative_to(DUMP)} ({path.stat().st_size} bytes) ===")
    raw = path.read_text(encoding="utf-8", errors="replace")
    try:
        doc = json.loads(raw)
    except Exception as exc:
        print(f"  parse fail: {exc}")
        return
    if isinstance(doc, list):
        print(f"list len={len(doc)}")
        if doc and isinstance(doc[0], dict):
            print(f"keys: {list(doc[0].keys())[:30]}")
            print(f"sample: { {k:str(v)[:60] for k,v in list(doc[0].items())[:10]} }")
    elif isinstance(doc, dict):
        print(f"dict keys: {list(doc.keys())[:30]}")
        for k in ("strains", "data", "items", "results"):
            if k in doc and isinstance(doc[k], list):
                print(f"  {k} len={len(doc[k])}")
                if doc[k] and isinstance(doc[k][0], dict):
                    print(f"  {k}[0] keys: {list(doc[k][0].keys())[:25]}")


def peek_parquet(path: Path) -> None:
    import pyarrow.parquet as pq

    print(f"\n=== PARQUET {path.name} ({path.stat().st_size} bytes) ===")
    pf = pq.ParquetFile(path)
    schema = pf.schema_arrow
    print(f"rows={pf.metadata.num_rows} cols={len(schema)}")
    for f in schema:
        t = str(f.type)
        print(f"  {f.name}: {t[:80]}")


def peek_session_db(path: Path) -> None:
    print(f"\n=== SQLITE {path.name} ===")
    con = sqlite3.connect(str(path))
    try:
        tables = con.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()
        print(f"tables: {[t[0] for t in tables]}")
        for (t,) in tables[:10]:
            n = con.execute(f'SELECT COUNT(*) FROM "{t}"').fetchone()[0]
            cols = [r[1] for r in con.execute(f'PRAGMA table_info("{t}")').fetchall()]
            print(f"  {t}: rows={n} cols={cols[:15]}")
    finally:
        con.close()


def main() -> None:
    targets = [
        DUMP / "cannabis-intelligence-database-main" / "data" / "Cannabis_Intelligence_Database_15768_Strains_Final.csv",
        DUMP / "phytochemical-diversity-cannabis-main" / "data" / "preproc_lab_data_pub_20220218.csv",
        DUMP / "phytochemical-diversity-cannabis-main" / "data" / "strain_info_pub_20210915.csv",
        DUMP / "cannabis_analysis-main" / "Needed CSV files" / "Read" / "strain_thc_cbd_max_ranking_wa.csv",
        DUMP / "cannabis_analysis-main" / "Needed CSV files" / "kushy_strains_crosses_with_nulls.csv",
        DUMP / "cannabis_analysis-main" / "Needed CSV files" / "strain_rating_effects_v2.csv",
        DUMP / "cannabis_analysis-main" / "Needed CSV files" / "Read" / "strain_medical_effects.csv",
        DUMP / "med-cabinet-main" / "med-cabinet" / "static" / "data" / "cannabis.json",
        DUMP / "med-cabinet-main" / "notebooks" / "cannabis.csv",
        DUMP / "Cannabis-Strains-main" / "cannabis-strains.csv",
        DUMP / "cannia-master" / "src" / "data" / "strains.json",
        DUMP / "archive" / "cannabis.csv",
        DUMP / "archive (1)" / "Cannabis_Strains_Features.csv",
    ]
    for p in targets:
        if not p.exists():
            print(f"MISSING {p}")
            continue
        if p.suffix.lower() == ".json":
            peek_json(p)
        else:
            peek_csv(p)

    # north atlantic
    nas = list((DUMP / "cannabis-intelligence-database-main").rglob("north_atlantic*.json"))
    for p in nas[:2]:
        peek_json(p)

    # strain project unzipped
    sp = DUMP / "Strain project-20260807T130449Z-1-001"
    if sp.exists():
        for p in sp.rglob("*"):
            if p.is_file() and p.suffix.lower() in (".csv", ".txt", ".json"):
                print(f"\nstrain_project file: {p.relative_to(DUMP)} size={p.stat().st_size}")
                if p.suffix.lower() == ".csv":
                    peek_csv(p)

    peek_parquet(DUMP / "train-00000-of-00002.parquet")
    peek_session_db(DUMP / "session.db")

    # pickle sample with numpy
    import pickle
    from io import BytesIO

    pdir = DUMP / "archive (3)" / "cannabis 2" / "Strain data" / "strains"
    if pdir.exists():
        sample = next(pdir.glob("*.p"), None)
        if sample:
            print(f"\n=== PICKLE sample {sample.name} ===")
            try:
                obj = pickle.loads(sample.read_bytes())
                print(f"type={type(obj)}")
                if isinstance(obj, dict):
                    print(f"keys={list(obj.keys())[:40]}")
                    for k, v in list(obj.items())[:15]:
                        print(f"  {k}: {type(v).__name__} {str(v)[:100]}")
            except Exception as exc:
                print(f"pickle fail: {exc}")


if __name__ == "__main__":
    main()
