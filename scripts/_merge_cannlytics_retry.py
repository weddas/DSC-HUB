#!/usr/bin/env python3
"""Retry merge of cannlytics_expand until master lock clears."""
from __future__ import annotations

import json
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "scripts"))

from brain.dsc_brain.corpus import connect, corpus_stats, init_corpus, link_science_to_seed, rebuild_search_docs  # noqa: E402
from brain.dsc_brain.paths import DEFAULT_DB  # noqa: E402
import merge_staging_to_master as msm  # noqa: E402

STG = ROOT / "brain" / "data" / "staging" / "cannlytics_expand.sqlite3"


def main() -> int:
    init_corpus(DEFAULT_DB)
    for attempt in range(1, 31):
        try:
            master = connect(DEFAULT_DB)
            master.execute("PRAGMA busy_timeout=60000")
            before = corpus_stats(master)
            print(f"attempt {attempt} before={before.get('chemistry_profile')}", flush=True)
            st = msm.merge_one(master, STG, include_raw=False)
            master.commit()
            links = link_science_to_seed(master)
            docs = rebuild_search_docs(master)
            master.commit()
            after = corpus_stats(master)
            delta = {
                k: after.get(k, 0) - before.get(k, 0)
                for k in sorted(set(before) | set(after))
            }
            out = {
                "merge": st,
                "links": links,
                "search_docs": docs,
                "before": before,
                "after": after,
                "delta": delta,
            }
            print(json.dumps(out, indent=2, default=str), flush=True)
            Path(r"C:\Users\cmgwe\AppData\Local\Temp\cannlytics_merge_result.json").write_text(
                json.dumps(out, indent=2, default=str), encoding="utf-8"
            )
            master.close()
            return 0
        except Exception as exc:  # noqa: BLE001
            print(f"attempt {attempt} err: {exc}", flush=True)
            time.sleep(10)
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
