#!/usr/bin/env python3
"""Process one Cannlytics state into staging (append). Usage: --state nv [--merge]"""
from __future__ import annotations

import argparse
import json
import sys
import traceback
import urllib.error
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "scripts"))

from import_lab_terpenes_cannlytics import (  # noqa: E402
    DATA,
    LICENSE,
    SOURCE_ID,
    merge_to_master,
    process_state,
)
from brain.dsc_brain.corpus import corpus_stats, ensure_source  # noqa: E402
from brain.dsc_brain.staging import connect_staging, init_staging  # noqa: E402


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--state", required=True)
    ap.add_argument("--merge", action="store_true")
    ap.add_argument("--force-download", action="store_true")
    args = ap.parse_args()
    state = args.state.lower().strip()

    init_staging(SOURCE_ID, note=f"expand state={state}")
    conn = connect_staging(SOURCE_ID)
    conn.commit()
    conn.execute("PRAGMA busy_timeout=180000")
    try:
        conn.execute("PRAGMA synchronous=NORMAL")
    except Exception:
        pass
    ensure_source(
        conn,
        SOURCE_ID,
        "Cannlytics HF expand",
        url="https://huggingface.co/datasets/cannlytics/cannabis_results",
        license=LICENSE,
        redistributable=True,
    )
    conn.commit()
    before = corpus_stats(conn)
    print(f"=== {state} (before chem={before.get('chemistry_profile')}) ===", flush=True)
    try:
        st = process_state(
            state,
            conn,
            max_rows=None,
            force_download=args.force_download,
            store_raw=False,
            stage_all_rows=False,
        )
    except urllib.error.HTTPError as exc:
        print(f"SKIP HTTP {exc.code}", flush=True)
        conn.close()
        return 0
    except Exception as exc:  # noqa: BLE001
        traceback.print_exc()
        print(f"ERR {exc}", flush=True)
        conn.close()
        return 1
    conn.commit()
    after = corpus_stats(conn)
    print(f"RESULT {json.dumps(st, default=str)}", flush=True)
    print(f"STAGING {json.dumps(after, default=str)}", flush=True)
    conn.close()

    if args.merge:
        print("Merging...", flush=True)
        delta = merge_to_master()
        print(f"MASTER {json.dumps(delta.get('delta'), default=str)}", flush=True)
        (DATA / "dsc_lab_terpenes_cannlytics_expand_report.json").write_text(
            json.dumps({"last_state": state, "state_result": st, "master": delta}, indent=2, default=str),
            encoding="utf-8",
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
