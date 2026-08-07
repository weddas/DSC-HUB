#!/usr/bin/env python3
"""Final Tier C first-half report."""
from __future__ import annotations

import json
import sys
from collections import Counter
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(ROOT))

from scrape_breeder_tier_c import (  # noqa: E402
    bank_slug,
    claim_path,
    load_queue_slice,
    source_id_for,
)

DATA = ROOT / "homeassistant" / "data"
STAGING = ROOT / "brain" / "data" / "staging"
RESULTS = DATA / "_tier_c_first_half_results.json"


def main() -> int:
    s = json.loads(RESULTS.read_text(encoding="utf-8"))
    r = list(s.get("results") or [])
    _d, sl = load_queue_slice(half="first")
    owner = "tier_c_first_half"
    claimed: list[dict] = []
    done_slugs = {x.get("slug") for x in r}
    for e in sl:
        slug = bank_slug(e)
        if slug in done_slugs:
            continue
        bank = source_id_for(e)
        for key in (slug, bank):
            cp = claim_path(key)
            if not cp.exists():
                continue
            doc = json.loads(cp.read_text(encoding="utf-8"))
            if doc.get("owner") and doc.get("owner") != owner:
                claimed.append(
                    {
                        "name": e.get("name"),
                        "slug": slug,
                        "status": "skipped_claimed_by_ab",
                        "owner": doc.get("owner"),
                        "items": 0,
                    }
                )
                break

    by = Counter(str(x.get("status") or "?") for x in r)
    for c in claimed:
        by[c["status"]] += 1

    ok = [x for x in r if x.get("status") == "ok"]
    skipped = sum(v for k, v in by.items() if k != "ok")
    report = {
        "partition": "tier_C_first_half",
        "slice": len(sl),
        "attempted": len(r),
        "claimed_by_AB_not_run": len(claimed),
        "partition_accounted": len(r) + len(claimed),
        "succeeded": len(ok),
        "skipped": skipped,
        "items_total": sum(int(x.get("items") or 0) for x in ok),
        "by_status": dict(by),
        "ok_banks": [],
    }
    staging_ok = 0
    for x in ok:
        bank = x.get("bank") or f"bank_{x.get('slug')}"
        db = STAGING / f"{bank}.sqlite3"
        dump = DATA / f"dsc_strains_{bank}.json"
        st = db.exists()
        if st:
            staging_ok += 1
        report["ok_banks"].append(
            {
                "name": x.get("name"),
                "items": x.get("items"),
                "method": x.get("method"),
                "dump": dump.exists(),
                "staging": st,
                "bank": bank,
            }
        )
    report["staging_dbs_ok"] = staging_ok
    out = DATA / "_tier_c_first_half_report.json"
    out.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    print(json.dumps({k: report[k] for k in report if k != "ok_banks"}, indent=2))
    print("\nOK banks:")
    for b in report["ok_banks"]:
        print(
            f"  {b['name']}: items={b['items']} method={b['method']} "
            f"dump={b['dump']} staging={b['staging']}"
        )
    print(f"\nwrote {out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
