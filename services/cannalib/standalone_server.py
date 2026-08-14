#!/usr/bin/env python3
"""Cannalib standalone API — stdlib only (no pip). Full-corpus SQLite search.

Security posture (intentional):
- Read-only SQLite (uri mode=ro + PRAGMA query_only).
- GET/HEAD/OPTIONS only; no body parsers, no file serving, no SSRF surface.
- Catalog can be public; soft per-IP rate limits + bot UA blocks.
- /v1/metrics requires API key whenever CANNALIB_API_KEY is set (default deploy sets one).
- X-Forwarded-For / CF-Connecting-IP trusted only when CANNALIB_TRUST_PROXY=true
  (enable behind Cloudflare / NPM).
"""

from __future__ import annotations

import json
import os
import re
import secrets
import sqlite3
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, unquote, urlparse

VERSION = "0.2.1-stdlib"
DB_PATH = Path(os.environ.get("CANNALIB_DB_PATH", "/data/dsc_brain.sqlite3"))
HOST = os.environ.get("CANNALIB_HOST", "0.0.0.0")
PORT = int(os.environ.get("CANNALIB_PORT", "8790"))
REQUIRE_KEY = os.environ.get("CANNALIB_REQUIRE_API_KEY", "false").lower() in (
    "1",
    "true",
    "yes",
    "on",
)
API_KEY = os.environ.get("CANNALIB_API_KEY", "").strip()
API_KEY_HEADER = os.environ.get("CANNALIB_API_KEY_HEADER", "X-Cannalib-Key")
# Metrics always keyed when an API key exists (catalog may stay public).
METRICS_REQUIRE_KEY = os.environ.get("CANNALIB_METRICS_REQUIRE_KEY", "true").lower() in (
    "1",
    "true",
    "yes",
    "on",
)
TRUST_PROXY = os.environ.get("CANNALIB_TRUST_PROXY", "false").lower() in (
    "1",
    "true",
    "yes",
    "on",
)
RATE_RPM = float(os.environ.get("CANNALIB_RATE_LIMIT_RPM", "120"))
RATE_BURST = float(os.environ.get("CANNALIB_RATE_LIMIT_BURST", "40"))
COOL_BASE = float(os.environ.get("CANNALIB_COOLDOWN_BASE_S", "0.25"))
COOL_MAX = float(os.environ.get("CANNALIB_COOLDOWN_MAX_S", "8"))
COOL_429_AFTER = int(os.environ.get("CANNALIB_COOLDOWN_429_AFTER", "3"))
RATE_ENABLED = os.environ.get("CANNALIB_RATE_LIMIT_ENABLED", "true").lower() in (
    "1",
    "true",
    "yes",
    "on",
)
MAX_Q_LEN = int(os.environ.get("CANNALIB_MAX_Q_LEN", "120"))
MAX_PATH_ID_LEN = int(os.environ.get("CANNALIB_MAX_PATH_ID_LEN", "160"))
MAX_LIMIT = int(os.environ.get("CANNALIB_MAX_LIMIT", "50"))
REQUEST_TIMEOUT_S = float(os.environ.get("CANNALIB_REQUEST_TIMEOUT_S", "30"))
CORS_ORIGINS = [
    o.strip()
    for o in os.environ.get(
        "CANNALIB_CORS_ORIGINS",
        "*",  # browser cards on HA dashboards; API is cookieless GET
    ).split(",")
    if o.strip()
]
BUCKET_MAX = int(os.environ.get("CANNALIB_RATE_BUCKET_MAX", "20000"))

_SLUG_RE = re.compile(r"[^a-z0-9]+")
_SAFE_TABLES = frozenset(
    {
        "strain_canonical",
        "strain_variant",
        "science_alias",
        "chemistry_profile",
        "grow_trait",
        "nutrient_product",
        "medium_product",
        "light_fixture",
    }
)
AI_CRAWLERS = (
    "gptbot",
    "chatgpt",
    "ccbot",
    "anthropic",
    "claudebot",
    "google-extended",
    "bytespider",
    "perplexity",
    "amazonbot",
    "bingbot",
    "googlebot",
    "semrush",
    "ahrefs",
)
ALLOW_UA = (
    "homeassistant",
    "home-assistant",
    "hass.io",
    "dsc-hub",
    "cannalib-ha",
    "mozilla/",
    "chrome/",
    "safari/",
    "firefox/",
    "edg/",
)
ROBOTS = """User-agent: *
Disallow: /

User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: Google-Extended
Disallow: /
"""

_lock = threading.Lock()
_metrics = {
    "started_at": time.time(),
    "hits_total": 0,
    "hits_blocked_bot": 0,
    "hits_rate_limited": 0,
    "hits_unauthorized": 0,
    "bytes_in": 0,
    "bytes_out": 0,
    "search_total": 0,
    "hydrate_total": 0,
}
_counts_cache: dict[str, int] | None = None
_conn: sqlite3.Connection | None = None
_buckets: dict[str, dict] = {}


def slug(*parts: str) -> str:
    s = _SLUG_RE.sub("_", "_".join(parts).lower()).strip("_")
    return s[:80] or "unknown"


def connect() -> sqlite3.Connection:
    global _conn
    if _conn is not None:
        return _conn
    if not DB_PATH.exists():
        raise FileNotFoundError("DB missing")
    conn = sqlite3.connect(
        f"file:{DB_PATH.as_posix()}?mode=ro", uri=True, check_same_thread=False
    )
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA query_only=ON")
    conn.execute("PRAGMA busy_timeout=30000")
    _conn = conn
    return conn


def corpus_counts() -> dict[str, int]:
    global _counts_cache
    if _counts_cache is not None:
        return dict(_counts_cache)
    c = connect()
    out: dict[str, int] = {}
    for table, key in (
        ("strain_canonical", "strains"),
        ("strain_variant", "variants"),
        ("science_alias", "aliases"),
        ("chemistry_profile", "chemistry"),
        ("grow_trait", "grow_traits"),
        ("nutrient_product", "nutrients"),
        ("medium_product", "mediums"),
        ("light_fixture", "lights"),
    ):
        if table not in _SAFE_TABLES:
            out[key] = 0
            continue
        try:
            out[key] = int(c.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0])
        except sqlite3.Error:
            out[key] = 0
    _counts_cache = dict(out)
    return out


def _escape_like(s: str) -> str:
    return s.replace("\\", "\\\\").replace("%", "").replace("_", "")


def _norm_q(q: str) -> str:
    return " ".join((q or "").strip().lower().split())[:MAX_Q_LEN]


def _clamp_limit(raw) -> int:
    try:
        n = int(raw)
    except (TypeError, ValueError):
        n = 20
    return max(1, min(n, MAX_LIMIT))


def _hydrate(name_norms: list[str], matched: dict[str, str]) -> list[dict]:
    if not name_norms:
        return []
    c = connect()
    ph = ",".join("?" * len(name_norms))
    sql = f"""
    WITH chem AS (
      SELECT name_norm, thc_min, thc_max, cbd_min, cbd_max, top_terpenes_json,
             ROW_NUMBER() OVER (
               PARTITION BY name_norm
               ORDER BY (top_terpenes_json IS NOT NULL) DESC, id
             ) AS rn
      FROM chemistry_profile WHERE name_norm IN ({ph})
    ),
    grow AS (
      SELECT name_norm, height_cm_min, height_cm_max, flowering_days_min, flowering_days_max,
             payload_json,
             ROW_NUMBER() OVER (PARTITION BY name_norm ORDER BY id) AS rn
      FROM grow_trait WHERE name_norm IN ({ph})
    ),
    variant AS (
      SELECT name_norm, breeder,
             ROW_NUMBER() OVER (PARTITION BY name_norm ORDER BY id) AS rn
      FROM strain_variant WHERE name_norm IN ({ph})
    )
    SELECT c.name_norm, c.name, c.type, c.summary_json, c.curated,
           ch.thc_min, ch.thc_max, ch.cbd_min, ch.cbd_max, ch.top_terpenes_json,
           g.height_cm_min, g.height_cm_max, g.flowering_days_min, g.flowering_days_max,
           g.payload_json AS grow_payload_json, v.breeder
    FROM strain_canonical c
    LEFT JOIN chem ch ON ch.name_norm = c.name_norm AND ch.rn = 1
    LEFT JOIN grow g ON g.name_norm = c.name_norm AND g.rn = 1
    LEFT JOIN variant v ON v.name_norm = c.name_norm AND v.rn = 1
    WHERE c.name_norm IN ({ph})
    """
    args = (*name_norms, *name_norms, *name_norms, *name_norms)
    by = {r["name_norm"]: r for r in c.execute(sql, args)}
    out = []
    for nn in name_norms:
        row = by.get(nn)
        if not row:
            continue
        summary = {}
        try:
            summary = json.loads(row["summary_json"] or "{}")
        except json.JSONDecodeError:
            summary = {}
        thc = cbd = None
        tops: list = []
        if row["thc_min"] is not None and row["thc_max"] is not None:
            thc = [row["thc_min"], row["thc_max"]]
        if row["cbd_min"] is not None and row["cbd_max"] is not None:
            cbd = [row["cbd_min"], row["cbd_max"]]
        if row["top_terpenes_json"]:
            try:
                tops = json.loads(row["top_terpenes_json"]) or []
            except json.JSONDecodeError:
                tops = []
        height = flowering = height_band = None
        if row["height_cm_min"] is not None:
            if row["height_cm_max"] is not None and row["height_cm_max"] != row["height_cm_min"]:
                height = [row["height_cm_min"], row["height_cm_max"]]
            else:
                height = row["height_cm_min"]
        grow_payload = {}
        if row["grow_payload_json"]:
            try:
                grow_payload = json.loads(row["grow_payload_json"]) or {}
            except json.JSONDecodeError:
                grow_payload = {}
        if isinstance(grow_payload, dict):
            band = grow_payload.get("height_band")
            if isinstance(band, str) and band.strip():
                height_band = band.strip()
        if row["flowering_days_min"] is not None:
            if (
                row["flowering_days_max"] is not None
                and row["flowering_days_max"] != row["flowering_days_min"]
            ):
                flowering = [int(row["flowering_days_min"]), int(row["flowering_days_max"])]
            else:
                flowering = int(row["flowering_days_min"])
        name = row["name"]
        out.append(
            {
                "id": slug("strain", name),
                "name_norm": row["name_norm"],
                "name": name,
                "type": row["type"] or summary.get("type"),
                "breeder": row["breeder"],
                "source": "sqlite",
                "has_chemistry": bool(tops or thc or cbd),
                "top_terpenes": tops[:3] if isinstance(tops, list) else [],
                "thc_range": thc,
                "cbd_range": cbd,
                "want": summary.get("want") if isinstance(summary.get("want"), dict) else None,
                "height_cm": height,
                "height_band": height_band,
                "flowering_days": flowering,
                "curated": bool(row["curated"]),
                "matched_via": matched.get(nn, "name"),
            }
        )
    return out


def search_strains(q: str, limit: int = 20) -> list[dict]:
    c = connect()
    limit = _clamp_limit(limit)
    needle = _norm_q(q)
    matched: dict[str, str] = {}
    norms: list[str] = []

    def add(nn: str, via: str) -> bool:
        if not nn or nn in matched:
            return False
        matched[nn] = via
        norms.append(nn)
        return len(norms) >= limit

    if not needle:
        for r in c.execute(
            "SELECT name_norm FROM strain_canonical ORDER BY curated DESC, name LIMIT ?",
            (limit,),
        ):
            add(r["name_norm"], "curated")
        return _hydrate(norms, matched)

    safe = _escape_like(needle)
    like = f"%{safe}%"
    prefix = f"{safe}%"
    norm_prefix = prefix.replace(" ", "_")
    norm_eq = safe.replace(" ", "_")

    for r in c.execute(
        """
        SELECT name_norm FROM strain_canonical
        WHERE name_norm = ? OR name_norm LIKE ? OR lower(name) LIKE ?
        ORDER BY
          CASE WHEN name_norm = ? OR lower(name) = ? THEN 0
               WHEN name_norm LIKE ? OR lower(name) LIKE ? THEN 1 ELSE 2 END,
          curated DESC, length(name), name
        LIMIT ?
        """,
        (norm_eq, norm_prefix, prefix, norm_eq, safe, norm_prefix, prefix, limit),
    ):
        if add(r["name_norm"], "name"):
            return _hydrate(norms, matched)

    for r in c.execute(
        """
        SELECT DISTINCT name_norm FROM science_alias
        WHERE name_norm IS NOT NULL AND name_norm != ''
          AND (alias_norm = ? OR alias_norm LIKE ? OR lower(alias) = ? OR lower(alias) LIKE ?)
        LIMIT ?
        """,
        (norm_eq, norm_prefix, safe, prefix, limit),
    ):
        if add(r["name_norm"], "alias"):
            return _hydrate(norms, matched)

    remain = limit - len(norms)
    if remain > 0:
        for r in c.execute(
            """
            SELECT name_norm FROM strain_canonical
            WHERE lower(name) LIKE ? OR name_norm LIKE ?
            ORDER BY curated DESC, length(name), name LIMIT ?
            """,
            (like, f"%{norm_eq}%", remain + 30),
        ):
            if add(r["name_norm"], "name"):
                break
    return _hydrate(norms[:limit], matched)


def get_strain(strain_id: str) -> dict | None:
    c = connect()
    sid = (strain_id or "").strip()[:MAX_PATH_ID_LEN]
    if not sid:
        return None
    row = c.execute(
        "SELECT name_norm FROM strain_canonical WHERE name_norm = ? LIMIT 1", (sid,)
    ).fetchone()
    if row:
        items = _hydrate([row["name_norm"]], {row["name_norm"]: "id"})
        return items[0] if items else None
    needle = sid[7:] if sid.startswith("strain_") else sid
    needle = needle.replace("_", " ")
    safe = _escape_like(needle)[:MAX_Q_LEN]
    like = f"%{safe}%"
    for r in c.execute(
        "SELECT name_norm, name FROM strain_canonical WHERE lower(name) LIKE ? OR name_norm LIKE ? LIMIT 80",
        (like, f"%{safe.replace(' ', '_')}%"),
    ):
        if slug("strain", r["name"]) == sid or r["name_norm"] == sid:
            items = _hydrate([r["name_norm"]], {r["name_norm"]: "id"})
            return items[0] if items else None
    return None


def search_products(kind: str, q: str, limit: int = 20) -> list[dict]:
    table = {
        "nutrients": "nutrient_product",
        "nutrient": "nutrient_product",
        "mediums": "medium_product",
        "medium": "medium_product",
        "lights": "light_fixture",
        "light": "light_fixture",
    }.get(kind)
    if not table or table not in _SAFE_TABLES:
        raise ValueError("unknown kind")
    c = connect()
    limit = _clamp_limit(limit)
    needle = _norm_q(q)
    if not needle:
        rows = c.execute(
            f"SELECT id, name, brand FROM {table} ORDER BY name LIMIT ?", (limit,)
        ).fetchall()
    else:
        like = f"%{_escape_like(needle)}%"
        rows = c.execute(
            f"""
            SELECT id, name, brand FROM {table}
            WHERE lower(name) LIKE ? OR lower(COALESCE(brand,'')) LIKE ?
            ORDER BY name LIMIT ?
            """,
            (like, like, limit),
        ).fetchall()
    return [
        {
            "id": r["id"] or slug(kind, r["name"] or ""),
            "name": r["name"],
            "brand": r["brand"],
            "breeder": r["brand"],
            "source": "sqlite",
        }
        for r in rows
    ]


def rate_gate(client: str) -> tuple[bool, int, float]:
    """Return (allowed, retry_after_s, sleep_s). Never sleeps while holding the lock."""
    if not RATE_ENABLED:
        return True, 0, 0.0
    now = time.monotonic()
    sleep_s = 0.0
    with _lock:
        # Bound memory if many spoofed IPs appear.
        if client not in _buckets and len(_buckets) >= BUCKET_MAX:
            oldest = min(_buckets.items(), key=lambda kv: kv[1].get("updated", 0.0))[0]
            _buckets.pop(oldest, None)
        b = _buckets.get(client)
        if b is None:
            b = {"tokens": RATE_BURST, "updated": now, "streak": 0}
            _buckets[client] = b
        rate = RATE_RPM / 60.0
        elapsed = max(0.0, now - b["updated"])
        b["tokens"] = min(RATE_BURST, b["tokens"] + elapsed * rate)
        b["updated"] = now
        if b["tokens"] >= 1.0:
            b["tokens"] -= 1.0
            b["streak"] = 0
            return True, 0, 0.0
        b["streak"] += 1
        deficit = 1.0 - b["tokens"]
        cool = min(COOL_MAX, COOL_BASE * (1.0 + deficit + 0.5 * (b["streak"] - 1)))
        b["tokens"] = max(0.0, b["tokens"] - 0.25)
        if b["streak"] >= COOL_429_AFTER:
            return False, max(1, int(round(cool * 2))), 0.0
        sleep_s = cool
        return True, 0, sleep_s


def blocked_bot(ua: str | None, catalog: bool) -> bool:
    # UA checks are soft; real protection is rate limits + Cloudflare.
    u = (ua or "").strip().lower()
    if any(a in u for a in ALLOW_UA):
        return False
    if any(n in u for n in AI_CRAWLERS):
        return True
    if not catalog:
        return False
    if not u:
        return True
    return "bot" in u or "spider" in u or "crawl" in u


def record(**kw) -> None:
    with _lock:
        _metrics["hits_total"] += 1
        for k, v in kw.items():
            if k in _metrics and isinstance(v, (int, float)):
                _metrics[k] += int(v)


def _api_key_ok(headers) -> bool:
    if not API_KEY:
        return False
    got = (headers.get(API_KEY_HEADER) or "").strip()
    auth = headers.get("Authorization") or ""
    bearer = auth[7:].strip() if auth.lower().startswith("bearer ") else ""
    # Constant-time compare when lengths match; reject otherwise.
    if got and secrets.compare_digest(got, API_KEY):
        return True
    if bearer and secrets.compare_digest(bearer, API_KEY):
        return True
    return False


def _client_ip(handler: BaseHTTPRequestHandler) -> str:
    peer = handler.client_address[0] if handler.client_address else "unknown"
    if not TRUST_PROXY:
        return peer
    fwd = handler.headers.get("CF-Connecting-IP") or handler.headers.get("X-Forwarded-For")
    if not fwd:
        return peer
    return fwd.split(",")[0].strip() or peer


class Handler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"
    timeout = REQUEST_TIMEOUT_S

    def log_message(self, fmt: str, *args) -> None:  # noqa: A003
        return

    def _cors(self) -> None:
        origin = (self.headers.get("Origin") or "").strip()
        if "*" in CORS_ORIGINS:
            self.send_header("Access-Control-Allow-Origin", "*")
        elif origin and origin in CORS_ORIGINS:
            self.send_header("Access-Control-Allow-Origin", origin)
            self.send_header("Vary", "Origin")
        self.send_header("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS")
        self.send_header(
            "Access-Control-Allow-Headers",
            f"{API_KEY_HEADER}, Authorization, Content-Type",
        )

    def _send(self, code: int, body: bytes, content_type: str = "application/json") -> None:
        self.send_response(code)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header(
            "X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet, noai, noimageai"
        )
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "no-referrer")
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Cannalib-Version", VERSION)
        self._cors()
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)
        record(bytes_out=len(body))

    def _json(self, code: int, obj) -> None:
        self._send(code, json.dumps(obj, separators=(",", ":")).encode("utf-8"))

    def do_OPTIONS(self) -> None:  # noqa: N802
        self._send(204, b"")

    def do_HEAD(self) -> None:  # noqa: N802
        self.do_GET()

    def do_POST(self) -> None:  # noqa: N802
        self._json(405, {"detail": "method not allowed"})

    def do_PUT(self) -> None:  # noqa: N802
        self._json(405, {"detail": "method not allowed"})

    def do_DELETE(self) -> None:  # noqa: N802
        self._json(405, {"detail": "method not allowed"})

    def do_PATCH(self) -> None:  # noqa: N802
        self._json(405, {"detail": "method not allowed"})

    def do_GET(self) -> None:  # noqa: N802
        parsed = urlparse(self.path)
        path = parsed.path or "/"
        qs = parse_qs(parsed.query, keep_blank_values=False)
        ua = self.headers.get("User-Agent")
        # Ignore spoofed Content-Length on GET; do not read a body.
        record(bytes_in=0)

        if path in ("/robots.txt", "/ai.txt", "/llms.txt"):
            self._send(200, ROBOTS.encode("utf-8"), "text/plain; charset=utf-8")
            return

        catalog = path.startswith("/v1/catalogs")
        if catalog and blocked_bot(ua, True):
            record(hits_blocked_bot=1)
            self._json(403, {"detail": "crawlers not permitted"})
            return

        needs_key = False
        if path.startswith("/v1/") and REQUIRE_KEY:
            needs_key = True
        if path in ("/v1/metrics", "/metrics") and METRICS_REQUIRE_KEY and API_KEY:
            needs_key = True
        if needs_key and not _api_key_ok(self.headers):
            record(hits_unauthorized=1)
            self._json(401, {"detail": "api key required"})
            return

        # Rate-limit catalog + corpus; health stays free for probes.
        bypass = path in ("/health", "/v1/health", "/robots.txt", "/ai.txt", "/llms.txt")
        if path.startswith("/v1/") and not bypass:
            client = _client_ip(self)
            ok, retry, sleep_s = rate_gate(client)
            if sleep_s > 0:
                time.sleep(min(sleep_s, COOL_MAX))
            if not ok:
                record(hits_rate_limited=1)
                body = b'{"detail":"rate limited - cooldown; retry later"}'
                self.send_response(429)
                self.send_header("Content-Type", "application/json")
                self.send_header("Content-Length", str(len(body)))
                self.send_header("Retry-After", str(retry))
                self.send_header("X-Content-Type-Options", "nosniff")
                self._cors()
                self.end_headers()
                self.wfile.write(body)
                record(bytes_out=len(body))
                return

        try:
            if path in ("/",):
                self._json(
                    200,
                    {
                        "service": "cannalib",
                        "version": VERSION,
                        "docs": "none - use /v1/catalogs/strains?q=",
                    },
                )
                return
            if path in ("/health", "/v1/health"):
                self._json(
                    200,
                    {
                        "status": "ok",
                        "service": "cannalib",
                        "version": VERSION,
                        "auth": "key" if REQUIRE_KEY else "public",
                        "db_exists": DB_PATH.exists(),
                        "trust_proxy": TRUST_PROXY,
                    },
                )
                return
            if path in ("/v1/metrics", "/metrics"):
                with _lock:
                    snap = dict(_metrics)
                snap["uptime_s"] = round(time.time() - snap.pop("started_at"), 1)
                snap["bytes_in_mb"] = round(snap["bytes_in"] / 1e6, 3)
                snap["bytes_out_mb"] = round(snap["bytes_out"] / 1e6, 3)
                snap["service"] = "cannalib"
                snap["version"] = VERSION
                snap["auth_mode"] = "key" if REQUIRE_KEY else "public"
                try:
                    snap["corpus"] = corpus_counts()
                except Exception:  # noqa: BLE001
                    snap["corpus"] = {"error": "unavailable"}
                self._json(200, snap)
                return
            if path == "/v1/corpus":
                self._json(
                    200,
                    {"schema": "research_corpus", "counts": corpus_counts(), "capped": False},
                )
                return

            m = re.match(r"^/v1/catalogs/strains/([^/]+)$", path)
            if m:
                record(hydrate_total=1)
                sid = unquote(m.group(1))[:MAX_PATH_ID_LEN]
                item = get_strain(sid)
                if not item:
                    self._json(404, {"detail": "strain not found"})
                    return
                self._json(200, item)
                return

            m = re.match(r"^/v1/catalogs/([^/]+)$", path)
            if m:
                kind = m.group(1).lower()
                q = (qs.get("q") or [""])[0][:MAX_Q_LEN]
                limit = _clamp_limit((qs.get("limit") or ["20"])[0])
                record(search_total=1)
                if kind in ("strains", "strain"):
                    items = search_strains(q, limit)
                    self._json(
                        200,
                        {
                            "kind": "strains",
                            "q": q,
                            "count": len(items),
                            "capped": False,
                            "items": items,
                        },
                    )
                    return
                if kind in ("nutrients", "nutrient", "mediums", "medium", "lights", "light"):
                    items = search_products(kind, q, limit)
                    self._json(
                        200,
                        {
                            "kind": kind if kind.endswith("s") else kind + "s",
                            "q": q,
                            "count": len(items),
                            "capped": False,
                            "items": items,
                        },
                    )
                    return
                self._json(400, {"detail": "unknown kind"})
                return

            self._json(404, {"detail": "not found"})
        except Exception:  # noqa: BLE001
            self._json(500, {"detail": "internal error"})


def main() -> None:
    print(
        f"cannalib {VERSION} starting db_exists={DB_PATH.exists()} "
        f"require_key={REQUIRE_KEY} metrics_keyed={bool(METRICS_REQUIRE_KEY and API_KEY)} "
        f"trust_proxy={TRUST_PROXY}",
        flush=True,
    )

    def _warm() -> None:
        try:
            corpus_counts()
            print(f"corpus ready: {_counts_cache}", flush=True)
        except Exception as exc:  # noqa: BLE001
            print(f"corpus warm deferred: {type(exc).__name__}", flush=True)

    threading.Thread(target=_warm, name="corpus-warm", daemon=True).start()
    httpd = ThreadingHTTPServer((HOST, PORT), Handler)
    httpd.daemon_threads = True
    print(f"cannalib {VERSION} listening on {HOST}:{PORT}", flush=True)
    httpd.serve_forever()


if __name__ == "__main__":
    main()
