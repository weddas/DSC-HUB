#!/usr/bin/env python3
"""Merge cannlytics_expand via local master copy to avoid NAS lock-kill."""
from __future__ import annotations

import json
import shutil
import sqlite3
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(r"y:\Digital Stealth Care\Projects\DSC-HUB")
NAS_MASTER = ROOT / "brain" / "data" / "dsc_brain.sqlite3"
NAS_STAGING = ROOT / "brain" / "data" / "staging" / "cannlytics_expand.sqlite3"
LOCAL_DIR = Path(r"C:\Users\cmgwe\AppData\Local\Temp\dsc_ce_merge")
LOCAL_MASTER = LOCAL_DIR / "master.sqlite3"
LOCAL_STAGING_DIR = LOCAL_DIR / "staging"
LOCAL_STAGING = LOCAL_STAGING_DIR / "cannlytics_expand.sqlite3"
LIVE = ROOT / "brain" / "data" / "_ce_merge_live.txt"
DONE = ROOT / "brain" / "data" / "_ce_merge_done.txt"
OUT = ROOT / "brain" / "data" / "_ce_merge_stdout.txt"
HB = ROOT / "brain" / "data" / "_ce_merge_hb.txt"
LOG = LOCAL_DIR / "local_merge_log.txt"
PY = r"C:\Program Files\Python314\python.exe"
MAX_ATTEMPTS = 15
SLEEP_SEC = 20


def log(msg: str) -> None:
    line = msg.rstrip() + "\n"
    with LOG.open("a", encoding="utf-8") as f:
        f.write(line)
    with LIVE.open("a", encoding="utf-8") as f:
        f.write(line)


def hb(msg: str) -> None:
    HB.write_text(msg + "\n", encoding="utf-8")


def wait_nas_unlocked(tag: str, attempts: int = MAX_ATTEMPTS) -> bool:
    for i in range(1, attempts + 1):
        hb(f"{tag} probe {i}/{attempts}")
        try:
            c = sqlite3.connect(str(NAS_MASTER), timeout=2)
            c.execute("BEGIN IMMEDIATE")
            c.rollback()
            c.close()
            log(f"[{time.strftime('%H:%M:%S')}] {tag}: NAS unlocked")
            return True
        except Exception as e:  # noqa: BLE001
            log(f"[{time.strftime('%H:%M:%S')}] {tag}: BUSY {e}; sleep {SLEEP_SEC}s ({i}/{attempts})")
            for s in range(0, SLEEP_SEC, 5):
                hb(f"{tag} sleep {i} +{s}s")
                time.sleep(5)
    return False


def corpus_quick(db: Path) -> dict:
    c = sqlite3.connect(str(db), timeout=30)
    out = {}
    for table, sql in [
        ("strain_canonical", "SELECT COUNT(*) FROM strain_canonical"),
        ("chemistry_profile", "SELECT COUNT(*) FROM chemistry_profile"),
        ("strain_variant", "SELECT COUNT(*) FROM strain_variant"),
        ("unique_names", "SELECT COUNT(DISTINCT name_norm) FROM strain_canonical"),
    ]:
        try:
            out[table] = c.execute(sql).fetchone()[0]
        except Exception as e:  # noqa: BLE001
            out[table] = f"ERR {e}"
    c.close()
    return out


def main() -> int:
    LOG.write_text("", encoding="utf-8")
    LIVE.write_text(
        f"=== cannlytics_expand LOCAL-COPY merge {time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} ===\n",
        encoding="utf-8",
    )
    DONE.write_text("running\n", encoding="utf-8")
    LOCAL_STAGING_DIR.mkdir(parents=True, exist_ok=True)

    if not wait_nas_unlocked("copy_out"):
        DONE.write_text("exhausted\n", encoding="utf-8")
        log("EXHAUSTED waiting for copy-out unlock")
        return 2

    log(f"copy master {NAS_MASTER.stat().st_size} -> {LOCAL_MASTER}")
    hb("copy master out")
    shutil.copy2(NAS_MASTER, LOCAL_MASTER)
    log(f"copy staging {NAS_STAGING.stat().st_size} -> {LOCAL_STAGING}")
    hb("copy staging")
    shutil.copy2(NAS_STAGING, LOCAL_STAGING)

    before = corpus_quick(LOCAL_MASTER)
    log(f"before={json.dumps(before)}")

    hb("local merge")
    log(f"[{time.strftime('%H:%M:%S')}] running local merge...")
    p = subprocess.run(
        [
            PY, "-u", str(ROOT / "scripts" / "merge_staging_to_master.py"),
            "--master", str(LOCAL_MASTER),
            "--staging-dir", str(LOCAL_STAGING_DIR),
            "--only", "cannlytics_expand",
        ],
        cwd=str(ROOT),
        capture_output=True,
        text=True,
    )
    log(f"merge exit={p.returncode}")
    if p.stdout:
        log(p.stdout.rstrip())
    if p.stderr:
        log("STDERR: " + p.stderr.rstrip())
    if p.returncode != 0:
        DONE.write_text(f"fail:merge:{p.returncode}\n", encoding="utf-8")
        return p.returncode or 1

    after = corpus_quick(LOCAL_MASTER)
    delta = {
        k: (after[k] - before[k])
        for k in before
        if isinstance(before.get(k), int) and isinstance(after.get(k), int)
    }
    log(f"after={json.dumps(after)}")
    log(f"delta={json.dumps(delta)}")

    if not wait_nas_unlocked("copy_back"):
        DONE.write_text("fail:copy_back_locked\n", encoding="utf-8")
        log("LOCAL MERGE OK but could not copy back (NAS locked). Local master at: " + str(LOCAL_MASTER))
        summary = {
            "status": "local_ok_copy_back_failed",
            "before": before,
            "after": after,
            "delta": delta,
            "local_master": str(LOCAL_MASTER),
        }
        OUT.write_text(json.dumps(summary, indent=2), encoding="utf-8")
        return 3

    # Backup NAS then replace
    bak = NAS_MASTER.with_suffix(".sqlite3.pre_ce_bak")
    hb("backup nas")
    log(f"backup NAS -> {bak}")
    try:
        if bak.exists():
            bak.unlink()
        shutil.copy2(NAS_MASTER, bak)
    except Exception as e:  # noqa: BLE001
        log(f"backup warn: {e}")

    hb("copy master back")
    log(f"copy local master -> NAS ({LOCAL_MASTER.stat().st_size} bytes)")
    tmp = NAS_MASTER.with_suffix(".sqlite3.ce_new")
    shutil.copy2(LOCAL_MASTER, tmp)
    tmp.replace(NAS_MASTER)
    log("NAS master replaced")

    result = {
        "status": "ok",
        "family": "cannlytics_expand",
        "before": before,
        "after": after,
        "delta": delta,
        "merge_stdout_tail": (p.stdout or "")[-4000:],
        "built_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }
    text = json.dumps(result, indent=2)
    OUT.write_text(text, encoding="utf-8")
    log(text)
    DONE.write_text("ok\n", encoding="utf-8")
    log("SUCCESS")
    hb("done ok")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
