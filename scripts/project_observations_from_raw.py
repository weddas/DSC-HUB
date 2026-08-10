#!/usr/bin/env python3
"""Idempotent projector: staging raw notes → observation (copy, never move).

Master often has raw_record=0; read from local staging copies under --staging-dir.

Supports forum_* and bank/PDP families. Bank descriptions / grow_notes map to
kind=bank_note (never review). Forum bodies map to kind=forum_post.

Usage:
  python scripts/project_observations_from_raw.py --db C:\\DSC\\collation\\dsc_brain.sqlite3 \\
    --staging-dir C:\\DSC\\collation\\staging
  python scripts/project_observations_from_raw.py --db ... --staging-dir ... --glob "*.sqlite3"
  python scripts/project_observations_from_raw.py --db ... --staging-dir ... --source-id cannareviews
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

DEFAULT_GLOBS = (
    "forum_*.sqlite3",
    "cannareviews*.sqlite3",
    "bank_*.sqlite3",
    "allbud.sqlite3",
    "alchimia.sqlite3",
    "seedsman.sqlite3",
    "seedcity.sqlite3",
    "cannaconnection.sqlite3",
    "cropking.sqlite3",
    "hytiva.sqlite3",
    "dcseedexchange.sqlite3",
    "north_atlantic.sqlite3",
)

FORUM_BODY_KEYS = (
    "body",
    "body_text",
    "forum_body",
    "post_text",
    "text",
    "content",
    "page_text_excerpt",
)
BANK_NOTE_KEYS = (
    "description",
)
GROW_NOTE_KEYS = (
    "grow_notes",
    "grow_note",
)


def _kind_for_payload(stem: str, source_id: str, payload: dict) -> str:
    s = (source_id or stem or "").lower()
    if s.startswith("forum_") or "forum" in s:
        return "forum_post"
    # Prefer grow_note when grow diary fields present (even if description also exists).
    for k in GROW_NOTE_KEYS:
        v = payload.get(k)
        if isinstance(v, str) and v.strip():
            return "grow_note"
    return "bank_note"


def _title_from_payload(payload: dict) -> str | None:
    for k in ("thread_title", "title", "subject", "name"):
        if payload.get(k):
            return str(payload[k]).strip()
    return None


def _body_for_kind(payload: dict, kind: str) -> tuple[str | None, str | None]:
    """Return (title, body) for the observation kind."""
    title = _title_from_payload(payload)
    if kind == "grow_note":
        keys: tuple[str, ...] = GROW_NOTE_KEYS
    elif kind == "bank_note":
        keys = BANK_NOTE_KEYS
    else:
        keys = FORUM_BODY_KEYS + GROW_NOTE_KEYS + BANK_NOTE_KEYS
    for k in keys:
        v = payload.get(k)
        if isinstance(v, str) and v.strip():
            return title, v.strip()
    if kind == "forum_post":
        for nest in ("thread", "post", "op"):
            n = payload.get(nest)
            if isinstance(n, dict):
                t2, b2 = _body_for_kind(n, kind)
                if b2:
                    return title or t2, b2
        for k in FORUM_BODY_KEYS:
            v = payload.get(k)
            if isinstance(v, str) and v.strip():
                return title, v.strip()
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
    stats = {
        "file": staging_path.name,
        "scanned": 0,
        "written": 0,
        "skipped_empty": 0,
        "skipped_filter": 0,
        "by_kind": {},
    }
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
            stats["skipped_filter"] += 1
            continue
        try:
            payload = json.loads(row["payload_json"] or "{}")
        except json.JSONDecodeError:
            stats["skipped_empty"] += 1
            continue
        if not isinstance(payload, dict):
            stats["skipped_empty"] += 1
            continue
        kind = _kind_for_payload(staging_path.stem, source_id, payload)
        title, body = _body_for_kind(payload, kind)
        if not body:
            if kind == "forum_post":
                excerpt = json.dumps(
                    {k: payload[k] for k in list(payload)[:12]},
                    ensure_ascii=False,
                )
                if len(excerpt) < 40:
                    stats["skipped_empty"] += 1
                    continue
                body = excerpt
                title = title or payload.get("thread_title") or payload.get("name")
            else:
                stats["skipped_empty"] += 1
                continue
        key = row["name_norm"] or name_norm(str(payload.get("name") or title or ""))
        if not key:
            stats["skipped_empty"] += 1
            continue
        if dry_run:
            stats["written"] += 1
            stats["by_kind"][kind] = stats["by_kind"].get(kind, 0) + 1
            continue
        note = {
            "forum_post": "forum observation projector",
            "grow_note": "grow_note observation projector",
            "bank_note": "bank_note observation projector",
        }.get(kind, "observation projector")
        ensure_source(master, source_id, source_id, redistributable=False, note=note)
        oid = add_observation(
            master,
            name_norm_key=key,
            source_id=source_id,
            body_text=body,
            kind=kind,
            title=str(title).strip() if title else None,
            payload={"projected_from": staging_path.name, "kind": kind},
            raw_record_id=row["id"],
        )
        if oid:
            stats["written"] += 1
            stats["by_kind"][kind] = stats["by_kind"].get(kind, 0) + 1
    src.close()
    return stats


def _collect_files(staging_dir: Path, globs: list[str]) -> list[Path]:
    seen: set[Path] = set()
    out: list[Path] = []
    for pattern in globs:
        for f in sorted(staging_dir.glob(pattern)):
            if f in seen:
                continue
            seen.add(f)
            out.append(f)
    return out


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--db", type=Path, required=True)
    ap.add_argument("--staging-dir", type=Path, required=True)
    ap.add_argument("--source-id", type=str, default="")
    ap.add_argument(
        "--glob",
        action="append",
        default=[],
        help="Glob under staging-dir (repeatable). Default: forum + bank families.",
    )
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--limit", type=int, default=0, help="Max observations written per file (0=all)")
    args = ap.parse_args(argv)

    master = connect(args.db)
    globs = args.glob or list(DEFAULT_GLOBS)
    files = _collect_files(args.staging_dir, globs)
    if not files:
        print(json.dumps({"error": "no matching staging sqlite", "dir": str(args.staging_dir), "globs": globs}))
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
    by_kind = [
        {"kind": r[0], "c": r[1]}
        for r in master.execute("SELECT kind, COUNT(*) FROM observation GROUP BY kind ORDER BY 2 DESC")
    ]
    master.close()
    print(
        json.dumps(
            {
                "before": before,
                "after": after,
                "by_kind": by_kind,
                "dry_run": args.dry_run,
                "globs": globs,
                "families": all_stats,
                "built_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            },
            indent=2,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
