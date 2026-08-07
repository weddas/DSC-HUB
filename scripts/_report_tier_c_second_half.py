#!/usr/bin/env python3
import json
from pathlib import Path

DATA = Path("homeassistant/data")
res = json.loads((DATA / "_tier_c_second_half_results.json").read_text(encoding="utf-8"))
prog = json.loads((DATA / "_tier_c_second_half_progress.json").read_text(encoding="utf-8"))
print("finished_at", res.get("finished_at"))
print("owner", res.get("owner"), "half", res.get("half"))
print("slice_n", prog.get("slice_n"), "todo_n", prog.get("todo_n"))
print("attempted", res["attempted"], "ok", res["ok"], "items_total", res["items_total"])
print("by_status", json.dumps(res["by_status"], indent=2))
print("--- OK banks ---")
for r in res["results"]:
    if r.get("status") == "ok":
        st = r.get("staging") or {}
        print(
            f"  {r.get('name')}: items={r.get('items')} method={r.get('method')} "
            f"staging_count={st.get('count')} db={st.get('staging_db')}"
        )
print("pre_skipped_claimed_approx", (prog.get("slice_n") or 310) - res["attempted"])
ok_banks = [r.get("bank") for r in res["results"] if r.get("status") == "ok"]
for b in ok_banks:
    dump = DATA / f"dsc_strains_{b}.json"
    stage = Path("brain/data/staging") / f"{b}.sqlite3"
    print(
        f"  dump={dump.exists()} dsize={dump.stat().st_size if dump.exists() else 0} "
        f"staging={stage.exists()} ssize={stage.stat().st_size if stage.exists() else 0} bank={b}"
    )
