#!/usr/bin/env python3
"""Idempotent projector: staging/raw forum notes → observation (copy, never move).

Master often has raw_record=0; read from local staging copies under --staging-dir.

Usage:
  python scripts/project_observations_from_raw.py --db C:\\DSC\\collation\\dsc_brain.sqlite3 \\
    --staging-dir C:\\DSC\\collation\\staging --source-id forum_rollitup
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

from brain.dsc_brain.corpus import add_observation, connect, ensure_source, name_norm  # noqa: E402

DEFAULT_FORUM_GLOBS = (
    "forum_*.sqlite3",
)


def _body_from_payload(payload: dict) -> tuple[str | None, str | None]:
    title = None
    for k in ("thread_title", "title", "subject", "name"):
        if payload.get(k):
            title = str(payload[k]).strip()
            break
    for k in (
        "body",
        "body_text",
        "forum_body",
        "post_text",
        "text",
        "content",
        "grow_notes",
        "description",
        "page_text_excerpt",
    ):
        v = payload.get(k)
        if isinstance(v, str) and v.strip():
            return title, v.strip()
    # Some forum rows stash OP text under nested keys
    for nest in ("thread", "post", "op"):
        n = payload.get(nest)
        if isinstance(n, dict):
            t2, b2 = _body_from_payload(n)
            if b2:
                return title or t2, b2
    return title, None


def project_one_staging(
    master,
    staging_path: Path,
    *,
    dry_run: bool,
    limit: int,
    source_filter: str | None,
) -> dict:
    src = sqlite3.connect(str(staging_path))
    src.row_factory = sqlite3.Row
    stats = {"file": staging_path.name, "scanned": 0, "written": 0, "skipped_empty": 0}
    try:
        rows = src.execute(
            "SELECT id, source_id, name_norm, entity_id, payload_json FROM raw_record"
        )
    except sqlite3.Error as exc:
        stats["error"] = str(exc)
        src.close()
        return stats

    for row in rows:
        stats["scanned"] += 1
        if limit and stats["written"] >= limit:
            break
        source_id = row["source_id"] or staging_path.stem
        if source_filter and source_id != source_filter and staging_path.stem != source_filter:
            continue
        try:
            payload = json.loads(row["payload_json"] or "{}")
        except json.JSONDecodeError:
            stats["skipped_empty"] += 1
            continue
        if not isinstance(payload, dict):
            stats["skipped_empty"] += 1
            continue
        title, body = _body_from_payload(payload)
        if not body:
            # Fall back: dump a compact JSON excerpt so the note is not lost
            excerpt = json.dumps(
                {k: payload[k] for k in list(payload)[:12]},
                ensure_ascii=False,
            )
            if len(excerpt) < 40:
                stats["skipped_empty"] += 1
                continue
            body = excerpt
            title = title or payload.get("thread_title") or payload.get("name")
        key = row["name_norm"] or name_norm(str(payload.get("name") or title or ""))
        if not key:
            stats["skipped_empty"] += 1
            continue
        if dry_run:
            stats["written"] += 1
            continue
        ensure_source(master, source_id, source_id, redistributable=False, note="forum observation projector")
        oid = add_observation(
            master,
            name_norm_key=key,
            source_id=source_id,
            body_text=body,
            kind="forum_post",
            title=str(title).strip() if title else None,
            payload={"projected_from": staging_path.name},
            raw_record_id=row["id"],
        )
        if oid:
            stats["written"] += 1
    src.close()
    return stats


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--db", type=Path, required=True)
    ap.add_argument("--staging-dir", type=Path, required=True)
    ap.add_argument("--source-id", type=str, default="")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--limit", type=int, default=0, help="Max observations written (0=all)")
    args = ap.parse_args(argv)

    master = connect(args.db)
    files = sorted(args.staging_dir.glob("forum_*.sqlite3"))
    if not files:
        print(json.dumps({"error": "no forum_*.sqlite3 in staging-dir", "dir": str(args.staging_dir)}))
        return 2
    all_stats = []
    before = master.execute("SELECT COUNT(*) FROM observation").fetchone()[0]
    for f in files:
        st = project_one_staging(
            master,
            f,
            dry_run=args.dry_run,
            limit=args.limit,
            source_filter=args.source_id or None,
        )
        all_stats.append(st)
        if not args.dry_run:
            master.commit()
            print(f"  done {f.name} {st}")
    after = master.execute("SELECT COUNT(*) FROM observation").fetchone()[0]
    master.close()
    print(
        json.dumps(
            {
                "before": before,
                "after": after,
                "dry_run": args.dry_run,
                "families": all_stats,
                "built_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            },
            indent=2,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
