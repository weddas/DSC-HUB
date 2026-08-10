#!/usr/bin/env python3
"""Shared catalog fetch kit: delay, checkpoint/resume, dump schema v2."""

from __future__ import annotations

import argparse
import json
import time
from pathlib import Path
from typing import Any, Callable, Iterable

from catalog_common import DATA, UA, fetch_bytes, fetch_text, polite_get, write_dump

__all__ = [
    "DATA",
    "UA",
    "Checkpoint",
    "fetch_bytes",
    "fetch_text",
    "polite_get",
    "write_dump",
    "run_paginated",
]


class Checkpoint:
    def __init__(self, path: Path):
        self.path = path
        self.data: dict[str, Any] = {"done": [], "cursor": None, "errors": []}
        if path.exists():
            try:
                self.data = json.loads(path.read_text(encoding="utf-8"))
            except json.JSONDecodeError:
                pass

    def mark_done(self, key: str) -> None:
        done = set(self.data.get("done") or [])
        done.add(key)
        self.data["done"] = sorted(done)
        self.save()

    def is_done(self, key: str) -> bool:
        return key in set(self.data.get("done") or [])

    def set_cursor(self, cursor: Any) -> None:
        self.data["cursor"] = cursor
        self.save()

    def note_error(self, msg: str) -> None:
        errs = list(self.data.get("errors") or [])
        errs.append({"at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), "msg": msg})
        self.data["errors"] = errs[-200:]
        self.save()

    def save(self) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        payload = json.dumps(self.data, indent=2)
        tmp = self.path.with_suffix(self.path.suffix + ".tmp")
        tmp.write_text(payload, encoding="utf-8")
        try:
            tmp.replace(self.path)
        except OSError:
            # NAS/SMB often denies atomic replace while another handle is open.
            self.path.write_text(payload, encoding="utf-8")
            try:
                tmp.unlink(missing_ok=True)
            except OSError:
                pass


def run_paginated(
    urls: Iterable[str],
    parse_page: Callable[[str, str], list[dict]],
    *,
    checkpoint: Checkpoint,
    delay: float = 0.75,
    limit: int | None = None,
) -> list[dict]:
    items: list[dict] = []
    for url in urls:
        if checkpoint.is_done(url):
            continue
        try:
            html = polite_get(url, delay=delay)
            batch = parse_page(html, url)
            items.extend(batch)
            checkpoint.mark_done(url)
            if limit is not None and len(items) >= limit:
                return items[:limit]
        except Exception as exc:  # noqa: BLE001
            checkpoint.note_error(f"{url}: {exc}")
    return items


def main() -> int:
    p = argparse.ArgumentParser(description="catalog_fetch smoke / helpers")
    p.add_argument("--ping", help="GET a URL and print length")
    args = p.parse_args()
    if args.ping:
        text = fetch_text(args.ping)
        print(json.dumps({"url": args.ping, "bytes": len(text)}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
