#!/usr/bin/env python3
"""Local CORS ingest + URL feed for in-browser CannaReviews medauth scrape.

HttpOnly session cookies stay in the browser tab; this server only feeds URLs
and receives parsed review payloads.

Usage:
  python -u scripts/_cannareviews_medauth_ingest_server.py
"""

from __future__ import annotations

import json
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "homeassistant" / "data"
PRODUCTS = DATA / "dsc_products_cannareviews.json"
OUT_REVIEWS = DATA / "dsc_reviews_cannareviews_medauth.json"
OUT_PROGRESS = DATA / "_cannareviews_medauth_progress.json"
HOST = "127.0.0.1"
PORT = 8765

_lock = threading.Lock()
_state: dict = {
    "urls": [],
    "cursor": 0,
    "batch_size": 3,
    "reviews": [],
    "seen": set(),
    "errors": [],
    "started_at": None,
    "done": False,
}


def load_urls() -> list[str]:
    doc = json.loads(PRODUCTS.read_text(encoding="utf-8"))
    items = [i for i in (doc.get("items") or []) if isinstance(i, dict)]

    def rc(i: dict) -> int:
        try:
            return int(i.get("review_count") or 0)
        except (TypeError, ValueError):
            return 0

    items_sorted = sorted(items, key=rc, reverse=True)
    urls: list[str] = []
    seen: set[str] = set()
    for i in items_sorted:
        u = i.get("url") or i.get("product_url")
        if isinstance(u, str) and "/product/" in u:
            u = u.split("?")[0].rstrip("/")
            if u not in seen:
                seen.add(u)
                urls.append(u)
    return urls


def save_progress() -> None:
    with _lock:
        payload = {
            "updated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "cursor": _state["cursor"],
            "total": len(_state["urls"]),
            "review_count": len(_state["reviews"]),
            "error_count": len(_state["errors"]),
            "done": _state["done"],
            "started_at": _state["started_at"],
        }
        reviews = list(_state["reviews"])
    OUT_PROGRESS.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    OUT_REVIEWS.write_text(
        json.dumps(
            {
                "schema_version": 1,
                "kind": "reviews",
                "source": "cannareviews",
                "auth": "medauth_browser_tab",
                "imported_at": payload["updated_at"],
                "count": len(reviews),
                "items": reviews,
            },
            ensure_ascii=False,
            indent=1,
        ),
        encoding="utf-8",
    )


def restore_progress(urls: list[str]) -> None:
    reviews: list[dict] = []
    cursor = 0
    started_at = None
    if OUT_REVIEWS.exists():
        try:
            doc = json.loads(OUT_REVIEWS.read_text(encoding="utf-8"))
            reviews = [i for i in (doc.get("items") or []) if isinstance(i, dict)]
        except (OSError, json.JSONDecodeError):
            reviews = []
    if OUT_PROGRESS.exists():
        try:
            prog = json.loads(OUT_PROGRESS.read_text(encoding="utf-8"))
            cursor = int(prog.get("cursor") or 0)
            started_at = prog.get("started_at")
        except (OSError, json.JSONDecodeError, TypeError, ValueError):
            cursor = 0
    # On restart with reordered priority list, skip URLs already harvested.
    harvested = {str(r.get("product_url") or "") for r in reviews}
    remaining = [u for u in urls if u not in harvested]
    ordered = [u for u in urls if u in harvested] + remaining
    cursor = len(urls) - len(remaining)  # start after harvested set in new order
    # Safer: always resume at start of remaining priority queue
    ordered = remaining  # only unfinished; harvested reviews already saved
    cursor = 0
    seen: set = set()
    for rev in reviews:
        key = (
            str(rev.get("product_url") or ""),
            str(rev.get("body") or "")[:80],
            str(rev.get("author") or ""),
        )
        seen.add(key)
    with _lock:
        _state["urls"] = ordered
        _state["cursor"] = cursor
        _state["reviews"] = reviews
        _state["seen"] = seen
        _state["errors"] = []
        _state["done"] = len(ordered) == 0
        _state["started_at"] = started_at
    print(
        json.dumps(
            {
                "restored": True,
                "remaining": len(ordered),
                "review_count": len(reviews),
                "harvested_urls": len(harvested),
            }
        ),
        flush=True,
    )


class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt: str, *args) -> None:  # noqa: A003
        print(f"[ingest] {self.address_string()} {fmt % args}", flush=True)

    def _cors(self) -> None:
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def _json(self, code: int, body: dict) -> None:
        raw = json.dumps(body).encode("utf-8")
        self.send_response(code)
        self._cors()
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(raw)))
        self.end_headers()
        self.wfile.write(raw)

    def do_OPTIONS(self) -> None:  # noqa: N802
        self.send_response(204)
        self._cors()
        self.end_headers()

    def do_GET(self) -> None:  # noqa: N802
        path = urlparse(self.path).path
        if path in ("/", "/status"):
            with _lock:
                body = {
                    "ok": True,
                    "cursor": _state["cursor"],
                    "total": len(_state["urls"]),
                    "review_count": len(_state["reviews"]),
                    "error_count": len(_state["errors"]),
                    "done": _state["done"],
                    "batch_size": _state["batch_size"],
                    "next": _state["urls"][_state["cursor"] : _state["cursor"] + 3],
                }
            self._json(200, body)
            return
        if path == "/next":
            with _lock:
                if _state["started_at"] is None:
                    _state["started_at"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
                i = _state["cursor"]
                n = _state["batch_size"]
                batch = _state["urls"][i : i + n]
                _state["cursor"] = min(len(_state["urls"]), i + n)
                body = {
                    "urls": batch,
                    "cursor": _state["cursor"],
                    "total": len(_state["urls"]),
                    "done": _state["cursor"] >= len(_state["urls"]) and not batch,
                }
            self._json(200, body)
            return
        if path == "/set-cursor":
            qs = parse_qs(urlparse(self.path).query)
            n = int((qs.get("n") or ["0"])[0])
            with _lock:
                _state["cursor"] = max(0, min(n, len(_state["urls"])))
                body = {"ok": True, "cursor": _state["cursor"], "total": len(_state["urls"])}
            save_progress()
            self._json(200, body)
            return
        self._json(404, {"error": "not_found"})

    def do_POST(self) -> None:  # noqa: N802
        path = urlparse(self.path).path
        length = int(self.headers.get("Content-Length") or 0)
        raw_in = self.rfile.read(length) if length else b"{}"
        try:
            data = json.loads(raw_in.decode("utf-8", "replace"))
        except json.JSONDecodeError:
            data = {}
        if path != "/ingest":
            self._json(404, {"error": "not_found"})
            return
        added = 0
        with _lock:
            for rev in data.get("reviews") or []:
                if not isinstance(rev, dict):
                    continue
                key = (
                    str(rev.get("product_url") or ""),
                    str(rev.get("body") or "")[:80],
                    str(rev.get("author") or ""),
                )
                if key in _state["seen"] or not (rev.get("body") or "").strip():
                    continue
                _state["seen"].add(key)
                _state["reviews"].append(rev)
                added += 1
            for err in data.get("errors") or []:
                _state["errors"].append(err)
                if len(_state["errors"]) > 500:
                    _state["errors"] = _state["errors"][-500:]
            if data.get("finished"):
                _state["done"] = True
            rc = len(_state["reviews"])
            cur = _state["cursor"]
            total = len(_state["urls"])
        save_progress()
        self._json(200, {"ok": True, "added": added, "review_count": rc, "cursor": cur, "total": total})


def main() -> int:
    urls = load_urls()
    DATA.mkdir(parents=True, exist_ok=True)
    restore_progress(urls)
    save_progress()
    httpd = ThreadingHTTPServer((HOST, PORT), Handler)
    print(json.dumps({"listening": f"http://{HOST}:{PORT}", "urls": len(urls)}), flush=True)
    httpd.serve_forever()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
