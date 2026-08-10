#!/usr/bin/env python3
"""Exact science_alias harvest: bank name ↔ URL-derived slug.

Unique exact only; skip collisions; no fuzzy; no canonical deletes.

Usage:
  python scripts/harvest_bank_aliases.py --db C:\\DSC\\collation\\dsc_brain.sqlite3 \\
    --staging-dir C:\\DSC\\collation\\staging
"""

from __future__ import annotations

import argparse
import json
import re
import sqlite3
import sys
import time
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from brain.dsc_brain.corpus import connect, name_norm  # noqa: E402

# Skip merch/SKU URL noise at harvest time (same family as clean_merch_aliases).
MERCH_RE = re.compile(
    r"\b("
    r"cartridge|battery|threaded|preroll|pre roll|pre-roll|hashole|hashhole|"
    r"thcp|gummy|donut flame|care package|510\b|\b\d+g\b|2x2|"
    r"disposable|vape|wax pen|dab|concentrate cart|premium thcp"
    r")\b",
    re.I,
)

SLUG_FROM_URL = (
    # Herbies: /cannabis-seeds/{slug}
    re.compile(r"/cannabis-seeds/([^/?#]+)/?", re.I),
    # Zamnesia-ish: /1234-some-slug.html
    re.compile(r"/(\d+)-([a-z0-9][a-z0-9\-]+)\.html?", re.I),
    # Seedsman / generic product slug last path segment
    re.compile(r"/([a-z0-9][a-z0-9\-_]{2,})/?$", re.I),
)


def slug_from_url(url: str) -> str | None:
    if not url or not isinstance(url, str):
        return None
    path = unquote(urlparse(url).path or "")
    if not path or path == "/":
        return None
    for i, rx in enumerate(SLUG_FROM_URL):
        m = rx.search(path)
        if not m:
            continue
        if i == 1:
            raw = m.group(2)
        else:
            raw = m.group(1)
        raw = raw.strip("-_")
        if raw.lower() in ("html", "php", "index", "product", "products", "seeds"):
            continue
        if len(raw) < 3:
            continue
        return raw
    return None


def slug_to_norm(slug: str) -> str:
    return name_norm(slug.replace("-", " ").replace("_", " "))


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--db", type=Path, required=True)
    ap.add_argument("--staging-dir", type=Path, required=True)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args(argv)

    con = connect(args.db)
    canonical = {r[0] for r in con.execute("SELECT name_norm FROM strain_canonical")}
    # alias_norm -> set of target name_norms seen this pass
    candidates: dict[str, set[str]] = {}
    display: dict[str, str] = {}
    sources: dict[str, str] = {}

    files = sorted(args.staging_dir.glob("bank_*.sqlite3"))
    files += sorted(args.staging_dir.glob("seedsman.sqlite3"))
    files += sorted(args.staging_dir.glob("seedcity.sqlite3"))
    files += sorted(args.staging_dir.glob("herbies*.sqlite3"))
    files += sorted(args.staging_dir.glob("zamnesia*.sqlite3"))
    seen_files: set[Path] = set()
    scanned = 0
    for path in files:
        if path in seen_files:
            continue
        seen_files.add(path)
        try:
            src = sqlite3.connect(f"file:{path}?mode=ro", uri=True)
        except sqlite3.Error:
            continue
        try:
            rows = src.execute("SELECT payload_json FROM raw_record")
        except sqlite3.Error:
            src.close()
            continue
        for (blob,) in rows:
            scanned += 1
            try:
                p = json.loads(blob or "{}")
            except json.JSONDecodeError:
                continue
            if not isinstance(p, dict):
                continue
            name = str(p.get("name") or "").strip()
            if not name:
                continue
            nn = name_norm(name)
            if not nn:
                continue
            if MERCH_RE.search(name) or MERCH_RE.search(nn):
                continue
            slug = p.get("slug")
            if not isinstance(slug, str) or not slug.strip():
                slug = slug_from_url(str(p.get("url") or p.get("product_url") or ""))
            if not slug:
                continue
            sn = slug_to_norm(slug)
            if not sn or sn == nn:
                continue
            if MERCH_RE.search(sn) or MERCH_RE.search(slug):
                continue
            # Prefer mapping slug alias → named canonical when name exists as canonical
            target = nn if nn in canonical else None
            if target is None:
                continue
            candidates.setdefault(sn, set()).add(target)
            display[sn] = slug.replace("-", " ")
            sources[sn] = path.stem
        src.close()

    promoted = 0
    skipped_collision = 0
    skipped_exists = 0
    samples: list[dict] = []
    for alias_n, targets in candidates.items():
        if len(targets) != 1:
            skipped_collision += 1
            continue
        target = next(iter(targets))
        if alias_n in canonical and alias_n != target:
            # alias string is itself a different canonical — still OK as alias toward denser? skip to avoid redirecting identity
            skipped_collision += 1
            continue
        existing = con.execute(
            "SELECT name_norm FROM science_alias WHERE alias_norm=?", (alias_n,)
        ).fetchone()
        if existing:
            skipped_exists += 1
            continue
        if len(samples) < 15:
            samples.append(
                {"alias_norm": alias_n, "target": target, "source": sources.get(alias_n)}
            )
        if args.dry_run:
            promoted += 1
            continue
        con.execute(
            "INSERT OR IGNORE INTO science_alias(alias_norm, alias, name_norm, source_id) VALUES(?,?,?,?)",
            (alias_n, display.get(alias_n, alias_n), target, f"bank_slug_alias:{sources.get(alias_n, 'bank')}"),
        )
        if con.execute("SELECT changes()").fetchone()[0]:
            promoted += 1

    if not args.dry_run:
        con.commit()
    after = con.execute("SELECT COUNT(*) FROM science_alias").fetchone()[0]
    con.close()
    print(
        json.dumps(
            {
                "scanned_raw": scanned,
                "candidate_aliases": len(candidates),
                "promoted": promoted,
                "skipped_collision": skipped_collision,
                "skipped_exists": skipped_exists,
                "science_alias_after": after,
                "samples": samples,
                "dry_run": args.dry_run,
                "built_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            },
            indent=2,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
