#!/usr/bin/env python3
"""Mass local merge + match saturation until projectors report 0 new fills.

Workset: C:\\DSC\\collation\\dsc_brain.sqlite3 + staging\\
No scraping. SoftAP out of scope.

Phases:
  1) copy missing/fresher NAS staging (never clobber richer local)
  2) merge all local staging --no-link --no-search
  3) loop projectors until saturated (or max rounds)
  4) link-only + rebuild HA indexes
  5) bak + copy master to NAS

Usage:
  python -u scripts/_mass_merge_and_match_saturate.py
  python -u scripts/_mass_merge_and_match_saturate.py --match-only
"""

from __future__ import annotations

import argparse
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
LOG = Path(r"C:\DSC\collation\_mass_merge_match.log")
SUMMARY = Path(r"C:\DSC\collation\_mass_merge_match_summary.json")

CREATE_NO_WINDOW = 0x08000000 if sys.platform == "win32" else 0
MAX_ROUNDS = 40


def log(msg: str) -> None:
    line = f"{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} {msg}"
    print(line, flush=True)
    with LOG.open("a", encoding="utf-8") as f:
        f.write(line + "\n")


def run(cmd: list[str], *, timeout: int | None = None) -> tuple[int, str]:
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
    proc = subprocess.run(cmd, timeout=timeout, **kwargs)
    out = proc.stdout or ""
    # keep last chunk in log
    tail = "\n".join(out.splitlines()[-40:])
    if tail:
        log("OUT_TAIL\n" + tail)
    log(f"EXIT {proc.returncode}")
    return proc.returncode, out


def last_json_object(text: str) -> dict | None:
    """Parse the last top-level JSON object from mixed stdout."""
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


def corpus_snapshot() -> dict:
    import sqlite3

    con = sqlite3.connect(str(LOCAL_MASTER))
    snap = {
        "strain_canonical": con.execute("SELECT COUNT(*) FROM strain_canonical").fetchone()[0],
        "strain_variant": con.execute("SELECT COUNT(*) FROM strain_variant").fetchone()[0],
        "observation": con.execute("SELECT COUNT(*) FROM observation").fetchone()[0],
        "review": con.execute("SELECT COUNT(*) FROM review").fetchone()[0],
        "science_alias": con.execute("SELECT COUNT(*) FROM science_alias").fetchone()[0],
        "entity_link": con.execute("SELECT COUNT(*) FROM entity_link").fetchone()[0],
        "subtype_of": con.execute(
            "SELECT COUNT(*) FROM entity_link WHERE method='subtype_of'"
        ).fetchone()[0],
        "height_cm": con.execute(
            "SELECT COUNT(*) FROM grow_trait WHERE height_cm_min IS NOT NULL"
        ).fetchone()[0],
        "grow_trait": con.execute("SELECT COUNT(*) FROM grow_trait").fetchone()[0],
        "nutrient_product": con.execute("SELECT COUNT(*) FROM nutrient_product").fetchone()[0],
        "medium_product": con.execute("SELECT COUNT(*) FROM medium_product").fetchone()[0],
    }
    con.close()
    return snap


def main() -> int:
    ap = argparse.ArgumentParser(description="Mass merge + match saturation")
    ap.add_argument(
        "--match-only",
        action="store_true",
        help="Skip NAS copy + mass merge; continue match rounds until saturated",
    )
    ap.add_argument("--max-rounds", type=int, default=MAX_ROUNDS)
    args = ap.parse_args()
    max_rounds = max(1, int(args.max_rounds))

    if not args.match_only:
        LOG.write_text("", encoding="utf-8")
    else:
        log("=== MATCH-ONLY CONTINUE ===")

    summary: dict = {
        "started_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "phases": [],
        "match_only": bool(args.match_only),
        "max_rounds": max_rounds,
    }
    summary["before"] = corpus_snapshot()
    log(f"BEFORE {json.dumps(summary['before'])}")

    if not args.match_only:
        # --- Phase 1: copy ---
        rc, out = run([PY, "-u", str(ROOT / "scripts" / "_copy_staging_nas_to_local.py")])
        summary["phases"].append({"phase": "copy", "rc": rc, "json": last_json_object(out)})
        if rc != 0:
            log("COPY_FAILED abort")
            SUMMARY.write_text(json.dumps(summary, indent=2), encoding="utf-8")
            return rc

        # --- Phase 2: mass merge all local staging ---
        rc, out = run(
            [
                PY,
                "-u",
                str(ROOT / "scripts" / "merge_staging_to_master.py"),
                "--master",
                str(LOCAL_MASTER),
                "--staging-dir",
                str(LOCAL_STAGING),
                "--no-link",
                "--no-search",
            ],
            timeout=None,
        )
        summary["phases"].append(
            {
                "phase": "mass_merge",
                "rc": rc,
                "json": last_json_object(out),
                "after": corpus_snapshot(),
            }
        )
        if rc != 0:
            log("MERGE_FAILED continuing to match with current master")

    # --- Phase 3: match saturation ---
    projectors = [
        (
            "subtype_links",
            [
                PY,
                "-u",
                str(ROOT / "scripts" / "project_subtype_links.py"),
                "--db",
                str(LOCAL_MASTER),
            ],
            ("linked_new", "subtype_of_after"),
        ),
        (
            "alias_og",
            [PY, "-u", str(ROOT / "scripts" / "alias_og_spacing.py"), "--db", str(LOCAL_MASTER)],
            ("written", "science_alias_after", "added"),
        ),
        (
            "harvest_aliases",
            [
                PY,
                "-u",
                str(ROOT / "scripts" / "harvest_bank_aliases.py"),
                "--db",
                str(LOCAL_MASTER),
                "--staging-dir",
                str(LOCAL_STAGING),
            ],
            ("promoted",),
        ),
        (
            "promote_unresolved",
            [
                PY,
                "-u",
                str(ROOT / "scripts" / "promote_unresolved_literals.py"),
                "--db",
                str(LOCAL_MASTER),
                "--min-edges",
                "3",
            ],
            ("promoted", "edges_resolved"),
        ),
        (
            "quarantine_junk",
            [
                PY,
                "-u",
                str(ROOT / "scripts" / "quarantine_junk_literals.py"),
                "--db",
                str(LOCAL_MASTER),
            ],
            ("quarantined", "quarantine_inserted"),
        ),
        (
            "observations",
            [
                PY,
                "-u",
                str(ROOT / "scripts" / "project_observations_from_raw.py"),
                "--db",
                str(LOCAL_MASTER),
                "--staging-dir",
                str(LOCAL_STAGING),
            ],
            ("before", "after"),  # special: delta
        ),
        (
            "height_cm",
            [
                PY,
                "-u",
                str(ROOT / "scripts" / "project_height_cm_from_text.py"),
                "--db",
                str(LOCAL_MASTER),
                "--staging-dir",
                str(LOCAL_STAGING),
            ],
            ("before_filled", "after_filled"),
        ),
        (
            "height_bands",
            [
                PY,
                "-u",
                str(ROOT / "scripts" / "project_height_bands_from_text.py"),
                "--db",
                str(LOCAL_MASTER),
                "--staging-dir",
                str(LOCAL_STAGING),
            ],
            ("updated",),
        ),
        (
            "subtype_chem",
            [
                PY,
                "-u",
                str(ROOT / "scripts" / "project_subtype_chem_from_own_sources.py"),
                "--db",
                str(LOCAL_MASTER),
            ],
            ("filled_chem", "filled_bank_note"),
        ),
        (
            "nutrient_npk",
            [
                PY,
                "-u",
                str(ROOT / "scripts" / "project_nutrient_npk_from_payload.py"),
                "--db",
                str(LOCAL_MASTER),
            ],
            ("updated_npk", "updated_dose"),
        ),
        (
            "clean_merch",
            [
                PY,
                "-u",
                str(ROOT / "scripts" / "clean_merch_aliases.py"),
                "--db",
                str(LOCAL_MASTER),
            ],
            ("removed", "quarantined", "deleted"),
        ),
    ]

    rounds: list[dict] = []
    for rnd in range(1, max_rounds + 1):
        log(f"=== MATCH ROUND {rnd} ===")
        round_gain = 0
        round_detail = []
        snap0 = corpus_snapshot()
        for name, cmd, keys in projectors:
            script = Path(cmd[2]) if len(cmd) > 2 else None
            # cmd[2] is often script path after -u
            script_path = None
            for part in cmd:
                if part.endswith(".py") and "scripts" in part.replace("\\", "/"):
                    script_path = Path(part)
                    break
            if script_path and not script_path.exists():
                log(f"SKIP missing {script_path}")
                continue
            rc, out = run(cmd)
            js = last_json_object(out) or {}
            gain = 0
            if name == "observations":
                gain = int(js.get("after") or 0) - int(js.get("before") or 0)
            elif name == "height_cm":
                gain = int(js.get("after_filled") or 0) - int(js.get("before_filled") or 0)
            else:
                for k in keys:
                    v = js.get(k)
                    if isinstance(v, (int, float)) and k not in (
                        "science_alias_after",
                        "subtype_of_after",
                        "parent_of_after",
                        "unresolved_after",
                    ):
                        # prefer explicit fill counters
                        if k.endswith("_after"):
                            continue
                        gain += int(v)
            # Fallback: corpus delta for this step
            snap1 = corpus_snapshot()
            delta = {k: snap1[k] - snap0[k] for k in snap0}
            step_gain = gain
            if step_gain == 0:
                step_gain = sum(max(0, v) for v in delta.values())
            round_gain += max(0, step_gain)
            round_detail.append(
                {
                    "projector": name,
                    "rc": rc,
                    "gain": step_gain,
                    "json_keys": {k: js.get(k) for k in keys if k in js},
                    "corpus_delta": delta,
                }
            )
            snap0 = snap1
            log(f"ROUND{rnd} {name} gain={step_gain}")

        rounds.append({"round": rnd, "gain": round_gain, "steps": round_detail})
        log(f"ROUND{rnd} TOTAL_GAIN={round_gain}")
        if round_gain <= 0:
            log("SATURATED")
            break

    summary["match_rounds"] = rounds

    # --- Phase 4: link-only + indexes ---
    rc, out = run(
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
        ]
    )
    summary["phases"].append({"phase": "link_only", "rc": rc, "json": last_json_object(out)})

    rc, out = run(
        [
            PY,
            "-u",
            str(ROOT / "scripts" / "build_catalog_search_indexes.py"),
            "--db",
            str(LOCAL_MASTER),
        ]
    )
    summary["phases"].append({"phase": "ha_indexes", "rc": rc})

    # --- Phase 5: NAS copy-back ---
    bak_suffix = ".pre_match_continue" if args.match_only else ".pre_mass_merge_match"
    bak = Path(str(NAS_MASTER) + bak_suffix)
    if NAS_MASTER.exists():
        log(f"BAK {NAS_MASTER} -> {bak}")
        shutil.copy2(NAS_MASTER, bak)
    log(f"COPY_BACK {LOCAL_MASTER} -> {NAS_MASTER}")
    shutil.copy2(LOCAL_MASTER, NAS_MASTER)

    summary["after"] = corpus_snapshot()
    summary["finished_at"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    out_summary = (
        Path(r"C:\DSC\collation\_mass_merge_match_continue_summary.json")
        if args.match_only
        else SUMMARY
    )
    out_summary.write_text(json.dumps(summary, indent=2), encoding="utf-8")
    log(f"AFTER {json.dumps(summary['after'])}")
    log(f"SUMMARY {out_summary}")
    return 0


if __name__ == "__main__":
    # Ensure C: workset
    os.chdir(r"C:\DSC\collation")
    raise SystemExit(main())
