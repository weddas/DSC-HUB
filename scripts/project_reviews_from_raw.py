#!/usr/bin/env python3
"""Idempotent projector: review-shaped raw payloads → review table (copy only).

Does not promote effects scores into reviews. Prefer cannareviews staging.
Refuses description-only / login_gated marketing copy — those are observations.

Usage:
  python scripts/project_reviews_from_raw.py --db C:\\DSC\\collation\\dsc_brain.sqlite3 \\
    --staging-dir C:\\DSC\\collation\\staging --source-id cannareviews
"""

from __future__ import annotations

import argparse
import json
import sqlite3
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from brain.dsc_brain.corpus import add_review, connect, ensure_source, name_norm  # noqa: E402


def _extract_reviews(payload: dict) -> tuple[list[dict], str | None]:
    """Return (reviews, skip_reason). skip_reason set when no real review bodies."""
    out: list[dict] = []
    for key in ("reviews", "user_reviews", "review_list"):
        block = payload.get(key)
        if isinstance(block, list):
            for item in block:
                if not isinstance(item, dict):
                    continue
                body = item.get("body") or item.get("text") or item.get("content") or item.get("review")
                if isinstance(body, str) and body.strip():
                    out.append(
                        {
                            "body": body.strip(),
                            "title": item.get("title"),
                            "rating": item.get("rating") or item.get("score"),
                            "reviewer": item.get("reviewer") or item.get("author") or item.get("user"),
                            "observed_at": item.get("date") or item.get("created_at"),
                        }
                    )
    for key in ("review_body", "review_text", "customer_review"):
        body = payload.get(key)
        if isinstance(body, str) and body.strip():
            out.append(
                {
                    "body": body.strip(),
                    "title": payload.get("title") or payload.get("name"),
                    "rating": payload.get("rating"),
                    "reviewer": payload.get("reviewer"),
                    "observed_at": payload.get("reviewed_at") or payload.get("date"),
                }
            )
    if out:
        return out, None

    # Honesty: do not treat marketing description as a review.
    status = str(payload.get("status") or payload.get("scrape_status") or "").lower()
    lg = payload.get("login_gated")
    login_gated = (
        lg is True
        or str(lg).lower() in ("1", "true", "yes")
        or "login" in status
        or status == "login_gated"
    )
    desc = payload.get("description")
    has_desc = isinstance(desc, str) and bool(desc.strip())
    if login_gated:
        return [], "skipped_login_gated"
    if has_desc:
        return [], "skipped_description_only"
    if payload.get("review_count") not in (None, "", 0, "0"):
        return [], "skipped_description_only"
    return [], "skipped_no_review_body"


def project_file(
    master,
    path: Path,
    *,
    dry_run: bool,
    limit: int,
    source_filter: str | None,
) -> dict:
    src = sqlite3.connect(str(path))
    src.row_factory = sqlite3.Row
    stats = {
        "file": path.name,
        "scanned": 0,
        "written": 0,
        "skipped_login_gated": 0,
        "skipped_description_only": 0,
        "skipped_no_review_body": 0,
        "skipped_empty_key": 0,
        "skipped_bad_json": 0,
        "skipped_filter": 0,
    }
    try:
        cur = src.execute(
            "SELECT id, source_id, name_norm, payload_json FROM raw_record"
        )
    except sqlite3.Error as exc:
        stats["error"] = str(exc)
        src.close()
        return stats
    for row in cur:
        stats["scanned"] += 1
        if limit and stats["written"] >= limit:
            break
        source_id = row["source_id"] or path.stem
        if source_filter and source_id != source_filter and path.stem != source_filter:
            stats["skipped_filter"] += 1
            continue
        try:
            payload = json.loads(row["payload_json"] or "{}")
        except json.JSONDecodeError:
            stats["skipped_bad_json"] += 1
            continue
        if not isinstance(payload, dict):
            stats["skipped_bad_json"] += 1
            continue
        reviews, skip_reason = _extract_reviews(payload)
        if not reviews:
            stats[skip_reason or "skipped_no_review_body"] += 1
            continue
        key = row["name_norm"] or name_norm(str(payload.get("name") or payload.get("strain") or ""))
        if not key:
            stats["skipped_empty_key"] += 1
            continue
        for rev in reviews:
            if dry_run:
                stats["written"] += 1
                continue
            ensure_source(master, source_id, source_id, redistributable=False, note="review projector")
            rating = rev.get("rating")
            try:
                rating_f = float(rating) if rating not in (None, "") else None
            except (TypeError, ValueError):
                rating_f = None
            rid = add_review(
                master,
                name_norm_key=key,
                source_id=source_id,
                body_text=str(rev["body"]),
                title=str(rev["title"]).strip() if rev.get("title") else None,
                rating=rating_f,
                reviewer=str(rev["reviewer"]).strip() if rev.get("reviewer") else None,
                observed_at=str(rev["observed_at"]).strip() if rev.get("observed_at") else None,
                payload={"projected_from": path.name},
                raw_record_id=row["id"],
            )
            if rid:
                stats["written"] += 1
    src.close()
    return stats


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--db", type=Path, required=True)
    ap.add_argument("--staging-dir", type=Path, required=True)
    ap.add_argument("--source-id", type=str, default="cannareviews")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--limit", type=int, default=0)
    args = ap.parse_args(argv)

    master = connect(args.db)
    candidates = list(args.staging_dir.glob("cannareviews*.sqlite3"))
    if args.source_id and args.source_id != "cannareviews":
        candidates = list(args.staging_dir.glob(f"{args.source_id}*.sqlite3")) or candidates
    if not candidates:
        print(json.dumps({"error": "no matching staging sqlite", "dir": str(args.staging_dir)}))
        return 2
    before = master.execute("SELECT COUNT(*) FROM review").fetchone()[0]
    stats = []
    for f in candidates:
        st = project_file(
            master,
            f,
            dry_run=args.dry_run,
            limit=args.limit,
            source_filter=args.source_id or None,
        )
        stats.append(st)
        if not args.dry_run:
            master.commit()
            print(f"  done {f.name} {st}")
    after = master.execute("SELECT COUNT(*) FROM review").fetchone()[0]
    master.close()
    print(
        json.dumps(
            {
                "before": before,
                "after": after,
                "dry_run": args.dry_run,
                "families": stats,
                "built_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            },
            indent=2,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
