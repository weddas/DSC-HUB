#!/usr/bin/env python3
"""Idempotent projector: staging raw notes → observation (copy, never move).

Master often has raw_record=0; read from local staging copies under --staging-dir.

Supports forum_* and bank/PDP families. Bank descriptions / grow_notes map to
kind=bank_note or grow_note (never review). Forum bodies map to kind=forum_post;
forum grow_notes fields also emit grow_note. Herbies/Zamnesia may use filtered
page_text_excerpt → bank_note (excerpt_filtered=1).

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
    "wikileaf.sqlite3",
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
    "info",
    "more_info",
    "about_info",
)
GROW_NOTE_KEYS = (
    "grow_notes",
    "grow_note",
)
EXCERPT_ALLOW_STEMS = frozenset(
    {
        "bank_herbies",
        "bank_zamnesia",
        "herbies",
        "zamnesia",
        "bank_royal_queen",
        "royal_queen",
    }
)
_EXCERPT_NOISE = (
    "add to cart",
    "cookie",
    "javascript",
    "sign in",
    "log in",
    "newsletter",
    "privacy policy",
    "shipping information",
    "wishlist",
)


def _is_forum(stem: str, source_id: str) -> bool:
    s = (source_id or stem or "").lower()
    return s.startswith("forum_") or "forum" in s


def _kind_for_payload(stem: str, source_id: str, payload: dict) -> str:
    # Prefer grow_note when grow diary fields present (forums and banks).
    for k in GROW_NOTE_KEYS:
        v = payload.get(k)
        if isinstance(v, str) and v.strip():
            return "grow_note"
    if _is_forum(stem, source_id):
        return "forum_post"
    return "bank_note"


def _title_from_payload(payload: dict) -> str | None:
    for k in ("thread_title", "title", "subject", "name"):
        if payload.get(k):
            return str(payload[k]).strip()
    return None


def _filter_excerpt(text: str) -> str | None:
    """Keep substantive PDP excerpts; reject nav/menu noise."""
    body = " ".join((text or "").split())
    if len(body) < 180:
        return None
    low = body.lower()
    noise_hits = sum(1 for n in _EXCERPT_NOISE if n in low)
    if noise_hits >= 3 and len(body) < 600:
        return None
    # Too many short tokens → menu soup
    words = body.split()
    if len(words) >= 40:
        short = sum(1 for w in words[:80] if len(w) <= 2)
        if short / min(len(words), 80) > 0.35:
            return None
    return body[:8000]


def _body_for_kind(
    payload: dict, kind: str, *, stem: str = "", allow_excerpt: bool = False
) -> tuple[str | None, str | None, dict]:
    """Return (title, body, extra_payload_flags)."""
    title = _title_from_payload(payload)
    flags: dict = {}
    if kind == "grow_note":
        keys: tuple[str, ...] = GROW_NOTE_KEYS
    elif kind == "bank_note":
        keys = BANK_NOTE_KEYS
    else:
        keys = FORUM_BODY_KEYS + GROW_NOTE_KEYS + BANK_NOTE_KEYS
    for k in keys:
        v = payload.get(k)
        if isinstance(v, str) and v.strip():
            return title, v.strip(), flags
    if kind == "bank_note" and allow_excerpt:
        excerpt = payload.get("page_text_excerpt")
        if isinstance(excerpt, str) and excerpt.strip():
            filtered = _filter_excerpt(excerpt)
            if filtered:
                flags["excerpt_filtered"] = 1
                flags["excerpt_stem"] = stem
                return title, filtered, flags
    if kind == "forum_post":
        for nest in ("thread", "post", "op"):
            n = payload.get(nest)
            if isinstance(n, dict):
                t2, b2, f2 = _body_for_kind(n, kind, stem=stem, allow_excerpt=False)
                if b2:
                    return title or t2, b2, f2
        for k in FORUM_BODY_KEYS:
            v = payload.get(k)
            if isinstance(v, str) and v.strip():
                return title, v.strip(), flags
    return title, None, flags


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
        # Forums: emit grow_note when diary field present, else forum_post body.
        # Banks: bank_note (description) or filtered excerpt for Herbies/Zamnesia.
        kinds_to_write: list[str] = []
        grow_present = any(
            isinstance(payload.get(k), str) and payload.get(k).strip() for k in GROW_NOTE_KEYS
        )
        if grow_present:
            kinds_to_write.append("grow_note")
        if _is_forum(staging_path.stem, source_id):
            kinds_to_write.append("forum_post")
        else:
            kinds_to_write.append("bank_note")
        # de-dupe while preserving order
        seen_k: set[str] = set()
        ordered: list[str] = []
        for k in kinds_to_write:
            if k not in seen_k:
                seen_k.add(k)
                ordered.append(k)

        allow_excerpt = staging_path.stem.lower() in EXCERPT_ALLOW_STEMS or (
            (source_id or "").lower() in EXCERPT_ALLOW_STEMS
        )
        wrote_any = False
        for kind in ordered:
            title, body, flags = _body_for_kind(
                payload, kind, stem=staging_path.stem, allow_excerpt=allow_excerpt
            )
            if not body:
                if kind == "forum_post":
                    excerpt = json.dumps(
                        {k: payload[k] for k in list(payload)[:12]},
                        ensure_ascii=False,
                    )
                    if len(excerpt) < 40:
                        continue
                    body = excerpt
                    title = title or payload.get("thread_title") or payload.get("name")
                else:
                    continue
            key = row["name_norm"] or name_norm(str(payload.get("name") or title or ""))
            if not key:
                continue
            if dry_run:
                stats["written"] += 1
                stats["by_kind"][kind] = stats["by_kind"].get(kind, 0) + 1
                wrote_any = True
                continue
            note = {
                "forum_post": "forum observation projector",
                "grow_note": "grow_note observation projector",
                "bank_note": "bank_note observation projector",
            }.get(kind, "observation projector")
            ensure_source(master, source_id, source_id, redistributable=False, note=note)
            payload_meta = {"projected_from": staging_path.name, "kind": kind, **flags}
            oid = add_observation(
                master,
                name_norm_key=key,
                source_id=source_id,
                body_text=body,
                kind=kind,
                title=str(title).strip() if title else None,
                payload=payload_meta,
                raw_record_id=row["id"],
            )
            if oid:
                stats["written"] += 1
                stats["by_kind"][kind] = stats["by_kind"].get(kind, 0) + 1
                wrote_any = True
        if not wrote_any:
            stats["skipped_empty"] += 1
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
