#!/usr/bin/env python3
"""Stage partial priority-bank dumps and print coverage summary."""

from __future__ import annotations

import json
import sqlite3
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "homeassistant" / "data"
ST = ROOT / "brain" / "data" / "staging"


def main() -> int:
    print("=== dumps ===")
    rows: list[tuple] = []
    for name in (
        "cropking",
        "dcseedexchange",
        "pacific",
        "truenorth",
        "ilgm",
        "seedsupreme",
        "zamnesia",
        "herbies",
        "rqs",
    ):
        p = DATA / f"dsc_strains_{name}.json"
        ck = DATA / f"dsc_strains_{name}.checkpoint.json"
        sm = DATA / f"dsc_strains_{name}.sitemap_urls.json"
        items = done = queued = errs = 0
        if p.exists():
            d = json.loads(p.read_text(encoding="utf-8"))
            items = int(d.get("count") or 0)
        if ck.exists():
            c = json.loads(ck.read_text(encoding="utf-8"))
            done = len(c.get("done") or [])
            errs = len(c.get("errors") or [])
        if sm.exists():
            queued = int(json.loads(sm.read_text(encoding="utf-8")).get("count") or 0)
        pct = (100.0 * done / queued) if queued else 0.0
        qlabel = str(queued) if queued else "?"
        status = "done" if queued and done >= queued else ("running" if items else "thin")
        print(f"{name:16} {done:5d}/{qlabel:<5} ({pct:5.1f}%) items={items} errs={errs} {status}")
        rows.append((name, items, done, queued, errs, status))

    to_stage = [
        name
        for name, items, done, queued, errs, status in rows
        if name
        in {
            "pacific",
            "truenorth",
            "ilgm",
            "seedsupreme",
            "cropking",
            "dcseedexchange",
        }
        and items >= 50
    ]
    print("staging", to_stage)
    for name in to_stage:
        if name in ("cropking", "dcseedexchange"):
            cmd = [sys.executable, "-u", "scripts/scrape_cropking_dcseed.py", "--bank", name, "--stage-only"]
        elif name == "pacific":
            cmd = [sys.executable, "-u", "scripts/scrape_wc_seed_banks.py", "--bank", name, "--stage-only"]
        else:
            cmd = [sys.executable, "-u", "scripts/scrape_bank_sitemaps.py", "--bank", name, "--stage-only"]
        print("RUN", " ".join(cmd))
        r = subprocess.run(cmd, cwd=str(ROOT), capture_output=True, text=True)
        out = (r.stdout or "")[-600:]
        err = (r.stderr or "")[-400:]
        if out:
            print(out)
        if r.returncode != 0:
            print("ERR", err)

    print("=== staging dbs ===")
    keys = (
        "cropking",
        "dcseed",
        "pacific",
        "truenorth",
        "ilgm",
        "seed_supreme",
        "zamnesia",
        "royal",
        "herbies",
        "multiverse",
        "weedseeds",
    )
    for h in sorted(ST.glob("*.sqlite3")):
        if not any(x in h.name for x in keys):
            continue
        try:
            con = sqlite3.connect(f"file:{h}?mode=ro", uri=True)
            n = con.execute("select count(*) from strain_canonical").fetchone()[0]
            con.close()
        except Exception:  # noqa: BLE001
            n = "?"
        print(f"{h.name:40} {h.stat().st_size / 1e6:6.1f}MB canonical={n}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
