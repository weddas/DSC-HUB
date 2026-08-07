#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
q = json.loads((ROOT / "homeassistant/data/_breeder_scrape_queue_1482.json").read_text(encoding="utf-8"))
a, b = q["partitions"]["tier_B_second_half"]["slice"]
part = q["tiers"]["B"][a:b]
part_names = [x["name"] for x in part]

r = json.loads((ROOT / "homeassistant/data/_tier_b_second_half_results.json").read_text(encoding="utf-8"))
done = {x.get("name") for x in r["results"]}
missing = [n for n in part_names if n not in done]
print("PARTITION", len(part_names))
print("ATTEMPTED", r["attempted"], "OK", r["ok"], "ITEMS", r["items_total"])
print("BY", r["by_status"])
print("MISSING_FROM_RESULTS", missing)
print()
print("=== OK ===")
for x in r["results"]:
    if x.get("status") == "ok":
        st = x.get("staging") or {}
        print(
            f"  {x['name']}: {x.get('items')} via {x.get('method')} "
            f"staged={st.get('count')} err={x.get('staging_error')}"
        )
print()
print("=== SKIPPED / EMPTY ===")
for x in r["results"]:
    if x.get("status") != "ok":
        print(f"  {x.get('status')}: {x.get('name')} — {x.get('note')}")

print()
print("=== ARTIFACT CHECK ===")
DATA = ROOT / "homeassistant" / "data"
ST = ROOT / "brain" / "data" / "staging"
for x in r["results"]:
    if x.get("status") != "ok":
        continue
    bank = x["bank"]
    dump = DATA / f"dsc_strains_{bank}.json"
    stage = ST / f"{bank}.sqlite3"
    ds = dump.stat().st_size if dump.exists() else 0
    ss = stage.stat().st_size if stage.exists() else 0
    print(f"  {bank}: dump={dump.exists()} ({ds}) staging={stage.exists()} ({ss})")
