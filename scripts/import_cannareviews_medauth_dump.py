#!/usr/bin/env python3
"""Import medauth browser-tab review dump → master review table.

Usage:
  python scripts/import_cannareviews_medauth_dump.py --db C:\\DSC\\collation\\dsc_brain.sqlite3
"""

from __future__ import annotations

import argparse
import json
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from brain.dsc_brain.corpus import add_review, connect, ensure_source, name_norm  # noqa: E402

DATA = ROOT / "homeassistant" / "data"
DUMP = DATA / "dsc_reviews_cannareviews_medauth.json"


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--db", type=Path, default=Path(r"C:\DSC\collation\dsc_brain.sqlite3"))
    ap.add_argument("--dump", type=Path, default=DUMP)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args(argv)

    if not args.dump.exists():
        print(json.dumps({"error": "missing_dump", "path": str(args.dump)}))
        return 2
    doc = json.loads(args.dump.read_text(encoding="utf-8"))
    items = [i for i in (doc.get("items") or []) if isinstance(i, dict)]
    bodies = [
        i
        for i in items
        if isinstance(i.get("body"), str) and len(i["body"].strip()) >= 20 and not i.get("login_gated")
    ]
    print(json.dumps({"dump_items": len(items), "with_body": len(bodies), "db": str(args.db)}))
    if args.dry_run or not bodies:
        return 0
    if not args.db.exists():
        print(json.dumps({"error": "missing_db"}))
        return 2

    con = connect(args.db)
    ensure_source(
        con,
        "cannareviews",
        "CannaReviews AU medical",
        redistributable=False,
        note="medauth browser-tab review bodies",
    )
    written = 0
    for i, rev in enumerate(bodies, 1):
        body = rev["body"].strip()
        product_url = str(rev.get("product_url") or "")
        slug = product_url.rstrip("/").split("/")[-1] if product_url else f"row-{i}"
        add_review(
            con,
            name_norm_key=slug,
            source_id="cannareviews",
            body_text=body,
            title=rev.get("title"),
            rating=float(rev["rating"]) if rev.get("rating") is not None else None,
            reviewer=rev.get("author") or rev.get("reviewer"),
            payload={
                "product_url": product_url,
                "auth": rev.get("auth"),
                "imported_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            },
        )
        written += 1
        if i % 50 == 0:
            con.commit()
    con.commit()
    n = con.execute("SELECT COUNT(*) FROM review").fetchone()[0]
    print(json.dumps({"written": written, "review_table": n}))
    con.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
