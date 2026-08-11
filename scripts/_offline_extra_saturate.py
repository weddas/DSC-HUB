#!/usr/bin/env python3
"""Offline extra densify: leftover exact-key merges/matches not in mass-merge loop.

Phases:
  1) pull richer NAS cannareviews if any
  2) re-merge cannareviews --no-link
  3) flowering_days text projection
  4) external id aliases (Leafly/SF/OpenTHC/SKU)
  5) Leafly parent_slugs → parent_of
  6) Wikileaf chem from staging
  7) resolve_lineage_literals
  8) project_lineage_edges (structured parents)
  9) link-only
 10) HA search indexes
 11) NAS master copy-back

Usage:
  python -u scripts/_offline_extra_saturate.py
"""

from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(r"y:\Digital Stealth Care\Projects\DSC-HUB")
PY = sys.executable
LOCAL_MASTER = Path(r"C:\DSC\collation\dsc_brain.sqlite3")
LOCAL_STAGING = Path(r"C:\DSC\collation\staging")
NAS_MASTER = ROOT / "brain" / "data" / "dsc_brain.sqlite3"
NAS_STAGING = ROOT / "brain" / "data" / "staging"
LOG = Path(r"C:\DSC\collation\_offline_extra_saturate.log")
SUMMARY = Path(r"C:\DSC\collation\_offline_extra_saturate_summary.json")
CREATE_NO_WINDOW = 0x08000000 if sys.platform == "win32" else 0


def log(msg: str) -> None:
    line = f"{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} {msg}"
    print(line, flush=True)
    with LOG.open("a", encoding="utf-8") as f:
        f.write(line + "\n")


def run(cmd: list[str]) -> tuple[int, str]:
    log("RUN " + " ".join(cmd))
    kwargs: dict = {
        "cwd": str(ROOT),
        "stdout": subprocess.PIPE,
        "stderr": subprocess.STDOUT,
        "text": True,
        "encoding": "utf-8",
        "errors": "replace",
    }
    if sys.platform == "win32":
        kwargs["creationflags"] = CREATE_NO_WINDOW
    proc = subprocess.run(cmd, **kwargs)
    out = proc.stdout or ""
    tail = "\n".join(out.splitlines()[-30:])
    if tail:
        log("OUT_TAIL\n" + tail)
    log(f"EXIT {proc.returncode}")
    return proc.returncode, out


def last_json(text: str) -> dict | None:
    dec = json.JSONDecoder()
    last = None
    i = 0
    while i < len(text):
        if text[i] != "{":
            i += 1
            continue
        try:
            obj, end = dec.raw_decode(text, i)
        except json.JSONDecodeError:
            i += 1
            continue
        if isinstance(obj, dict):
            last = obj
        i = end
    return last


def snapshot() -> dict:
    import sqlite3

    con = sqlite3.connect(str(LOCAL_MASTER))
    snap = {
        "strain_canonical": con.execute("SELECT COUNT(*) FROM strain_canonical").fetchone()[0],
        "strain_variant": con.execute("SELECT COUNT(*) FROM strain_variant").fetchone()[0],
        "observation": con.execute("SELECT COUNT(*) FROM observation").fetchone()[0],
        "review": con.execute("SELECT COUNT(*) FROM review").fetchone()[0],
        "science_alias": con.execute("SELECT COUNT(*) FROM science_alias").fetchone()[0],
        "entity_link": con.execute("SELECT COUNT(*) FROM entity_link").fetchone()[0],
        "parent_of": con.execute(
            "SELECT COUNT(*) FROM entity_link WHERE method='parent_of'"
        ).fetchone()[0],
        "subtype_of": con.execute(
            "SELECT COUNT(*) FROM entity_link WHERE method='subtype_of'"
        ).fetchone()[0],
        "height_cm": con.execute(
            "SELECT COUNT(*) FROM grow_trait WHERE height_cm_min IS NOT NULL"
        ).fetchone()[0],
        "flowering_days": con.execute(
            "SELECT COUNT(*) FROM grow_trait WHERE flowering_days_min IS NOT NULL"
        ).fetchone()[0],
        "grow_trait": con.execute("SELECT COUNT(*) FROM grow_trait").fetchone()[0],
        "chemistry_profile": con.execute("SELECT COUNT(*) FROM chemistry_profile").fetchone()[0],
        "nutrient_product": con.execute("SELECT COUNT(*) FROM nutrient_product").fetchone()[0],
        "medium_product": con.execute("SELECT COUNT(*) FROM medium_product").fetchone()[0],
        "light_fixture": con.execute("SELECT COUNT(*) FROM light_fixture").fetchone()[0],
    }
    con.close()
    return snap


def main() -> int:
    LOG.write_text("", encoding="utf-8")
    summary: dict = {
        "started_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "phases": [],
        "before": snapshot(),
    }
    log(f"BEFORE {json.dumps(summary['before'])}")

    # 1) cannareviews pull if NAS richer
    local_cr = LOCAL_STAGING / "cannareviews.sqlite3"
    nas_cr = NAS_STAGING / "cannareviews.sqlite3"
    if nas_cr.exists() and (
        not local_cr.exists() or nas_cr.stat().st_size > local_cr.stat().st_size
    ):
        log(f"COPY cannareviews {nas_cr.stat().st_size} -> local")
        shutil.copy2(nas_cr, local_cr)
        summary["phases"].append({"phase": "copy_cannareviews", "bytes": nas_cr.stat().st_size})
        rc, out = run(
            [
                PY,
                "-u",
                str(ROOT / "scripts" / "merge_staging_to_master.py"),
                "--master",
                str(LOCAL_MASTER),
                "--staging-dir",
                str(LOCAL_STAGING),
                "--only",
                "cannareviews",
                "--no-link",
                "--no-search",
            ]
        )
        summary["phases"].append(
            {"phase": "merge_cannareviews", "rc": rc, "json": last_json(out)}
        )
    else:
        summary["phases"].append({"phase": "copy_cannareviews", "skipped": True})

    steps = [
        (
            "flowering_days",
            [
                PY,
                "-u",
                str(ROOT / "scripts" / "project_flowering_days_from_text.py"),
                "--db",
                str(LOCAL_MASTER),
                "--staging-dir",
                str(LOCAL_STAGING),
            ],
        ),
        (
            "external_id_aliases",
            [
                PY,
                "-u",
                str(ROOT / "scripts" / "project_external_id_aliases.py"),
                "--db",
                str(LOCAL_MASTER),
                "--staging-dir",
                str(LOCAL_STAGING),
            ],
        ),
        (
            "leafly_parent_slugs",
            [
                PY,
                "-u",
                str(ROOT / "scripts" / "project_leafly_parent_slugs.py"),
                "--db",
                str(LOCAL_MASTER),
            ],
        ),
        (
            "wikileaf_chem",
            [
                PY,
                "-u",
                str(ROOT / "scripts" / "project_wikileaf_chem_from_staging.py"),
                "--db",
                str(LOCAL_MASTER),
                "--staging-dir",
                str(LOCAL_STAGING),
            ],
        ),
        (
            "resolve_lineage_literals",
            [
                PY,
                "-u",
                str(ROOT / "scripts" / "resolve_lineage_literals.py"),
                "--db",
                str(LOCAL_MASTER),
            ],
        ),
        (
            "project_lineage_edges",
            [
                PY,
                "-u",
                str(ROOT / "scripts" / "project_lineage_edges.py"),
                "--db",
                str(LOCAL_MASTER),
            ],
        ),
        (
            "link_only",
            [
                PY,
                "-u",
                str(ROOT / "scripts" / "merge_staging_to_master.py"),
                "--master",
                str(LOCAL_MASTER),
                "--staging-dir",
                str(LOCAL_STAGING),
                "--link-only",
                "--no-search",
            ],
        ),
        (
            "ha_indexes",
            [
                PY,
                "-u",
                str(ROOT / "scripts" / "build_catalog_search_indexes.py"),
                "--db",
                str(LOCAL_MASTER),
            ],
        ),
    ]

    for name, cmd in steps:
        rc, out = run(cmd)
        summary["phases"].append({"phase": name, "rc": rc, "json": last_json(out)})
        if rc != 0:
            log(f"WARN phase {name} rc={rc}")

    bak = Path(str(NAS_MASTER) + ".pre_offline_extra")
    if NAS_MASTER.exists():
        log(f"BAK {NAS_MASTER} -> {bak}")
        shutil.copy2(NAS_MASTER, bak)
    log(f"COPY_BACK {LOCAL_MASTER} -> {NAS_MASTER}")
    shutil.copy2(LOCAL_MASTER, NAS_MASTER)

    summary["after"] = snapshot()
    summary["finished_at"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    SUMMARY.write_text(json.dumps(summary, indent=2), encoding="utf-8")
    log(f"AFTER {json.dumps(summary['after'])}")
    log(f"SUMMARY {SUMMARY}")
    return 0


if __name__ == "__main__":
    os.chdir(r"C:\DSC\collation")
    raise SystemExit(main())
