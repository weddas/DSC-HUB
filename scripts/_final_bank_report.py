#!/usr/bin/env python3
"""Final stage + report for priority bank scrape pass."""

from __future__ import annotations

import json
import sqlite3
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "homeassistant" / "data"
ST = ROOT / "brain" / "data" / "staging"
CREATE_NO_WINDOW = 0x08000000

BANKS = {
    "rqs": ("scripts/scrape_seed_banks.py", "bank_royal_queen"),
    "ilgm": ("scripts/scrape_bank_sitemaps.py", "bank_ilgm"),
    "seedsupreme": ("scripts/scrape_bank_sitemaps.py", "bank_seed_supreme"),
    "pacific": ("scripts/scrape_wc_seed_banks.py", "bank_pacific"),
    "truenorth": ("scripts/scrape_bank_sitemaps.py", "bank_truenorth"),
    "cropking": ("scripts/scrape_cropking_dcseed.py", "cropking"),
    "dcseedexchange": ("scripts/scrape_cropking_dcseed.py", "dcseedexchange"),
    "zamnesia": ("scripts/scrape_seed_banks.py", "bank_zamnesia"),
    "herbies": ("scripts/scrape_seed_banks.py", "bank_herbies"),
    "fastbuds": ("scripts/scrape_bank_sitemaps.py", "bank_fastbuds"),
    "barneys": ("scripts/scrape_bank_sitemaps.py", "bank_barneys"),
    "greenhouse": ("scripts/scrape_bank_sitemaps.py", "bank_greenhouse"),
    "mephisto": ("scripts/scrape_bank_sitemaps.py", "bank_mephisto"),
    "dna": ("scripts/scrape_bank_sitemaps.py", "bank_dna"),
    "dutchpassion": ("scripts/scrape_bank_sitemaps.py", "bank_dutchpassion"),
}


def dump_stats(bank: str) -> dict:
    p = DATA / f"dsc_strains_{bank}.json"
    ck = DATA / f"dsc_strains_{bank}.checkpoint.json"
    sm = DATA / f"dsc_strains_{bank}.sitemap_urls.json"
    out = {"items": 0, "done": 0, "queued": 0, "errs": 0}
    if p.exists():
        out["items"] = int(json.loads(p.read_text(encoding="utf-8")).get("count") or 0)
    if ck.exists():
        c = json.loads(ck.read_text(encoding="utf-8"))
        out["done"] = len(c.get("done") or [])
        out["errs"] = len(c.get("errors") or [])
    if sm.exists():
        out["queued"] = int(json.loads(sm.read_text(encoding="utf-8")).get("count") or 0)
    return out


def stage(bank: str, script: str) -> None:
    if "cropking_dcseed" in script:
        cmd = [sys.executable, "-u", str(ROOT / script), "--bank", bank, "--stage-only"]
    else:
        cmd = [sys.executable, "-u", str(ROOT / script), "--bank", bank, "--stage-only"]
    print(f"staging {bank}...", flush=True)
    r = subprocess.run(cmd, cwd=str(ROOT), capture_output=True, text=True, creationflags=CREATE_NO_WINDOW)
    if r.returncode != 0:
        print(f"  stage warn {bank}: {(r.stderr or r.stdout or '')[-200:]}", flush=True)


def canonical(family: str) -> int | None:
    db = ST / f"{family}.sqlite3"
    if not db.exists():
        return None
    try:
        con = sqlite3.connect(f"file:{db}?mode=ro", uri=True)
        n = con.execute("select count(*) from strain_canonical").fetchone()[0]
        raw = con.execute("select count(*) from raw_record").fetchone()[0]
        con.close()
        return n, raw, db.stat().st_size
    except Exception as exc:  # noqa: BLE001
        print(f"  staging read fail {family}: {exc}", flush=True)
        return None


def main() -> int:
    rows = []
    for bank, (script, family) in BANKS.items():
        st = dump_stats(bank)
        if st["items"] >= 20:
            stage(bank, script)
        can = canonical(family)
        if isinstance(can, tuple):
            can_n, raw_n, size = can
        else:
            can_n = raw_n = size = None
        if bank == "pacific":
            state = "HARD_BLOCK_429"
        elif st["queued"] and st["done"] >= st["queued"]:
            state = "DONE"
        else:
            state = "PARTIAL"
        row = {
            "bank": bank,
            "state": state,
            "dump_items": st["items"],
            "done": st["done"],
            "queued": st["queued"],
            "errs": st["errs"],
            "staging_family": family,
            "staging_canonical": can_n,
            "staging_raw": raw_n,
            "staging_bytes": size,
            "staging_db": str(ST / f"{family}.sqlite3"),
        }
        rows.append(row)
        print(
            f"{bank:16} {state:14} dump={st['items']:5} done={st['done']}/{st['queued'] or '?'} "
            f"errs={st['errs']} staging_can={can_n} raw={raw_n}",
            flush=True,
        )

    out = DATA / "_bank_scrape_logs" / "final_report.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps({"banks": rows}, indent=2), encoding="utf-8")
    print(f"wrote {out}", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
