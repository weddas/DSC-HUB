"""Cameras — fixed-mount vision devices bound to a grow space (plan-settings § S7).

A camera is a brain-owned device record (`camera` table) with one of five sources:

* ``usb``       — a webcam plugged into the brain Pi (`/dev/videoN`, read with ffmpeg/v4l2)
* ``snapshot``  — an HTTP URL that answers with one JPEG (most IP cameras, motion's
                  ``/current``, ESP32-CAM ``/capture``)
* ``mjpeg``     — an HTTP multipart stream; the brain takes the first frame and hangs up
* ``rtsp``      — an RTSP stream, one frame grabbed with ffmpeg
* ``motioneye`` — a satellite Pi running motionEye with an old webcam: the camera's
                  motion stream port (8081 for camera 1, 8082 for 2 …) read as MJPEG

Capture is snapshot-based — the Pi 4/5 brain has no GPU, so the record is a frame every
``interval_s`` (default 10 min), lights-on only by default (the zone's photoperiod
window from the hub), kept on disk under ``DSC_DATA/media/camera/<id>/frames/<day>/``
with per-camera retention days and a GB cap. Nothing streams continuously; the SPA's
live view is ``latest.jpg`` refreshed on the operator's cadence.

Credentials never sit in the camera row: the password lives in the settings KV under
``camera_password:<id>`` and is reported only as ``password_set`` — the same rule as
``ap_psk``. Media stays local; it is never part of the setup-profile export.
"""

from __future__ import annotations

import base64
import json
import os
import re
import shutil
import sqlite3
import subprocess
import time
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any, Iterable, Iterator
from urllib.parse import urlsplit, urlunsplit

from .paths import DEFAULT_DB
from .settings import get_setting, set_setting
from .db import open_db, schema_once

SOURCE_KINDS: tuple[str, ...] = ("usb", "snapshot", "mjpeg", "rtsp", "motioneye")

SOURCE_KIND_LABELS: dict[str, str] = {
    "usb": "USB webcam on the brain",
    "snapshot": "HTTP snapshot URL",
    "mjpeg": "MJPEG stream URL",
    "rtsp": "RTSP stream",
    "motioneye": "motionEye satellite Pi",
}

# Which hub value says the zone's lights are on — the photoperiod window the hub reports.
SPACE_WINDOW_KEY: dict[str, str] = {"4x8": "window_4x8_open", "2x4": "window_2x4_open"}

ASSEMBLE_MODES: tuple[str, ...] = ("off", "daily", "weekly")

DEFAULT_INTERVAL_S = 600
MIN_INTERVAL_S = 30
DEFAULT_KEEP_DAYS = 30
DEFAULT_CAP_GB = 2.0
MAX_FRAME_BYTES = 12 * 1024 * 1024
CAPTURE_TIMEOUT_S = 20.0
MOTIONEYE_BASE_STREAM_PORT = 8080  # camera N streams on 8080 + N
ROTATE_CHOICES: tuple[int, ...] = (0, 90, 180, 270)
MAX_ZOOM = 8.0
MAX_WARMUP_FRAMES = 30
PASSWORD_KEY_PREFIX = "camera_password:"
CAMERA_ID_RE = re.compile(r"^[a-z0-9][a-z0-9_-]{0,39}$")
DAY_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")  # still the API's day format
# Frames written before the zone/name tree: frames/<day>/<HHMMSS>.jpg. Read, never written.
LEGACY_FRAME_NAME_RE = re.compile(r"^\d{4}-\d{2}-\d{2}/\d{6}\.jpg$")
TIMELAPSE_NAME_RE = re.compile(r"^[A-Za-z0-9_.-]+\.mp4$")


class CaptureError(RuntimeError):
    """A frame could not be captured; the message is operator-readable."""


# ---------------------------------------------------------------------------------------
# storage locations
# ---------------------------------------------------------------------------------------


# media_root lives in paths.py so cameras and journal photos cannot drift onto two
# different roots — re-exported here because callers already import it from this module.
from .paths import media_root  # noqa: E402


# Frames are laid out as <zone>/<name>/<yymmdd>/<HHMM>.jpg.
#
# Year first, deliberately. ddmmyy does not sort chronologically — 100926 (10 Sep) sorts
# before 110826 (11 Aug) — and browsing the stick in a file manager is exactly where that
# shows. yymmdd sorts correctly, is the same length and reads just as easily.
#
# The day is its own directory so no folder grows without bound: at the default 10-minute
# interval a flat camera folder gains ~4,400 files a month and ~53,000 a year, which is slow
# to open anywhere and worse on the FAT32 that most USB sticks are formatted as. A day holds
# 144.
#
# Two-digit years are ambiguous after 2068, where Python's strptime rolls %y back to 1969.
# Living with it: the alternative is four digits in every path for a problem four decades out.
FRAME_DAY_FMT = "%y%m%d"
FRAME_TIME_FMT = "%H%M"
FRAME_DAY_LEN = 6
FRAME_TIME_LEN = 4
# <yymmdd>/<HHMM>.jpg, or <yymmdd>/<HHMM>-2.jpg when two captures land in the same minute.
FRAME_NAME_RE = re.compile(r"^\d{6}/\d{4}(?:-\d+)?\.jpg$")

# FAT32-illegal characters, because these folders are meant to be read off a USB stick.
_FAT_ILLEGAL = re.compile(r'[<>:"/\\|?*\x00-\x1f]')
_DOS_RESERVED = {
    "CON", "PRN", "AUX", "NUL",
    *(f"COM{i}" for i in range(1, 10)),
    *(f"LPT{i}" for i in range(1, 10)),
}
_MAX_SEGMENT = 64


def safe_dir_segment(text: str, fallback: str = "unnamed") -> str:
    """One folder name that survives FAT32, a laptop file browser, and a rename.

    Frozen at camera creation, never recomputed: renaming a camera must not orphan or move
    recordings that are already on disk.
    """
    cleaned = _FAT_ILLEGAL.sub("", str(text or "")).strip()
    # FAT32 cannot represent a name ending in a dot or space; Windows silently drops them.
    cleaned = cleaned.rstrip(". ")
    cleaned = re.sub(r"\s+", " ", cleaned)[:_MAX_SEGMENT].rstrip(". ")
    if not cleaned:
        return fallback
    if cleaned.split(".")[0].upper() in _DOS_RESERVED:
        cleaned = f"{cleaned}_"
    return cleaned


def format_frame_day(ts: float) -> str:
    return datetime.fromtimestamp(max(0.0, ts)).strftime(FRAME_DAY_FMT)


def format_frame_time(ts: float) -> str:
    return datetime.fromtimestamp(max(0.0, ts)).strftime(FRAME_TIME_FMT)


def parse_frame_stamp(name: str) -> float | None:
    """The capture time back out of a ``yymmdd/HHMM.jpg`` name.

    The only reader of the two format constants. The day is a directory rather than part of
    the filename, so this is what listing, retention and timelapse ranges use instead of
    reading a date off a path they parsed by hand.
    """
    day, _, rest = str(name).partition("/")
    if not rest or len(day) != FRAME_DAY_LEN or not day.isdigit():
        return None
    stem = rest.split(".")[0].split("-")[0]
    if len(stem) != FRAME_TIME_LEN or not stem.isdigit():
        return None
    try:
        return datetime.strptime(day + stem, FRAME_DAY_FMT + FRAME_TIME_FMT).timestamp()
    except (ValueError, OverflowError, OSError):
        return None


def camera_tree_segments(cam: dict[str, Any] | None, camera_id: str) -> tuple[str, str] | None:
    """The frozen (zone, name) folder pair for a camera, or None if it predates the tree."""
    extra = (cam or {}).get("extra") or {}
    zone = str(extra.get("zone_dir") or "")
    name = str(extra.get("name_dir") or "")
    return (zone, name) if zone and name else None


def camera_dir(camera_id: str, db_path: Path | None = None) -> Path:
    """Where one camera's media lives: ``media/camera/<zone>/<name>/``.

    Falls back to the flat ``media/camera/<id>/`` for rows created before the tree existed,
    so old recordings stay readable instead of vanishing from the UI.
    """
    seg = camera_tree_segments(get_camera(camera_id, db_path), camera_id)
    base = media_root() / "camera"
    return base / seg[0] / seg[1] if seg else base / camera_id


def _connect(db_path: Path | None = None) -> sqlite3.Connection:
    if db_path is None:
        base = Path(os.environ.get("DSC_DATA", str(DEFAULT_DB.parent)))
        db_path = base / "dsc_ops.sqlite3"
    return open_db(db_path)


def init_camera_tables(db_path: Path | None = None) -> None:
    with _connect(db_path) as conn:
        if not schema_once(conn, "cameras"):
            return
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS camera (
              camera_id TEXT PRIMARY KEY,
              space_id TEXT NOT NULL,
              label TEXT NOT NULL DEFAULT '',
              source_kind TEXT NOT NULL,
              source TEXT NOT NULL DEFAULT '',
              username TEXT NOT NULL DEFAULT '',
              enabled INTEGER NOT NULL DEFAULT 1,
              interval_s INTEGER NOT NULL DEFAULT 600,
              lights_on_only INTEGER NOT NULL DEFAULT 1,
              keep_days INTEGER NOT NULL DEFAULT 30,
              cap_gb REAL NOT NULL DEFAULT 2.0,
              extra_json TEXT NOT NULL DEFAULT '{}',
              created_at REAL NOT NULL,
              updated_at REAL NOT NULL
            );
            CREATE TABLE IF NOT EXISTS camera_status (
              camera_id TEXT PRIMARY KEY,
              last_attempt_at REAL,
              last_ok_at REAL,
              last_error TEXT NOT NULL DEFAULT '',
              last_bytes INTEGER NOT NULL DEFAULT 0,
              width INTEGER,
              height INTEGER,
              frames INTEGER NOT NULL DEFAULT 0,
              consecutive_failures INTEGER NOT NULL DEFAULT 0,
              skipped_reason TEXT NOT NULL DEFAULT '',
              last_prune_at REAL,
              last_assemble_day TEXT NOT NULL DEFAULT ''
            );
            """
        )
        conn.commit()


# ---------------------------------------------------------------------------------------
# camera records
# ---------------------------------------------------------------------------------------


def _row_to_camera(r: sqlite3.Row) -> dict[str, Any]:
    try:
        extra = json.loads(r["extra_json"] or "{}")
    except json.JSONDecodeError:
        extra = {}
    return {
        "camera_id": r["camera_id"],
        "space_id": r["space_id"],
        "label": r["label"],
        "source_kind": r["source_kind"],
        "source": r["source"],
        "username": r["username"],
        "enabled": bool(r["enabled"]),
        "interval_s": int(r["interval_s"]),
        "lights_on_only": bool(r["lights_on_only"]),
        "keep_days": int(r["keep_days"]),
        "cap_gb": float(r["cap_gb"]),
        "extra": extra if isinstance(extra, dict) else {},
        "created_at": r["created_at"],
        "updated_at": r["updated_at"],
    }


def list_cameras(db_path: Path | None = None) -> list[dict[str, Any]]:
    init_camera_tables(db_path)
    with _connect(db_path) as conn:
        rows = conn.execute("SELECT * FROM camera ORDER BY space_id, camera_id").fetchall()
    return [_row_to_camera(r) for r in rows]


def get_camera(camera_id: str, db_path: Path | None = None) -> dict[str, Any] | None:
    init_camera_tables(db_path)
    with _connect(db_path) as conn:
        r = conn.execute("SELECT * FROM camera WHERE camera_id=?", (camera_id,)).fetchone()
    return _row_to_camera(r) if r else None


def password_for(camera_id: str, db_path: Path | None = None) -> str:
    return get_setting(PASSWORD_KEY_PREFIX + camera_id, "", db_path)


def _space_label(space_id: str, db_path: Path | None) -> str:
    """The zone's human name, for the folder.

    A space row has no `label` — the readable name is `size_label` plus `kind`, which is how
    the SPA renders "4×8 tent". Falls back to the id, which is always present and readable
    enough ("4x8"), so a missing row costs a nicer folder name and nothing else.
    """
    try:
        from .space_model import list_spaces

        for sp in list_spaces(db_path):
            if str(sp.get("space_id")) != str(space_id):
                continue
            size = str(sp.get("size_label") or "").strip()
            kind = str(sp.get("kind") or "").strip()
            name = " ".join(part for part in (size, kind) if part)
            return name or str(space_id)
    except Exception:
        pass
    return str(space_id)


def _valid_space_ids(db_path: Path | None) -> set[str]:
    from .space_model import KIT_SPACES, list_spaces

    ids = {str(s["space_id"]) for s in KIT_SPACES}
    ids.update(str(s["space_id"]) for s in list_spaces(db_path))
    ids.add("grow_room")
    return ids


def _norm_int(value: Any, default: int, lo: int, hi: int, name: str) -> int:
    if value is None or value == "":
        return default
    try:
        v = int(float(value))
    except (TypeError, ValueError) as exc:
        raise ValueError(f"{name} must be a whole number") from exc
    if v < lo or v > hi:
        raise ValueError(f"{name} must be between {lo} and {hi}")
    return v


def _norm_float(value: Any, default: float, lo: float, hi: float, name: str) -> float:
    if value is None or value == "":
        return default
    try:
        v = float(value)
    except (TypeError, ValueError) as exc:
        raise ValueError(f"{name} must be a number") from exc
    if v < lo or v > hi:
        raise ValueError(f"{name} must be between {lo:g} and {hi:g}")
    return v


def validate_source(source_kind: str, source: str, extra: dict[str, Any]) -> str:
    """Normalise the locator for a kind; raise ValueError with an operator-readable reason."""
    kind = str(source_kind or "").strip().lower()
    if kind not in SOURCE_KINDS:
        raise ValueError(f"source_kind must be one of {', '.join(SOURCE_KINDS)}")
    src = str(source or "").strip()
    if kind == "usb":
        if not src:
            src = "/dev/video0"
        # by-id is preferred where it exists: /dev/videoN is assigned in probe order and
        # two identical cameras can swap numbers across a reboot or a replug, which would
        # silently point a tent's camera at the other tent.
        if not (src.startswith("/dev/video") or src.startswith("/dev/v4l/by-id/")):
            raise ValueError(
                "a USB webcam is a /dev/videoN device on the brain Pi "
                "(or its stable /dev/v4l/by-id/... path)"
            )
        # Blank means "largest mode the camera reports", resolved at capture time. Pinning
        # is for the case where the biggest mode is too slow or the framing is cropped.
        if extra.get("width") in (None, "") or extra.get("height") in (None, ""):
            extra.pop("width", None)
            extra.pop("height", None)
        else:
            extra["width"] = _norm_int(extra.get("width"), 1920, 160, 4096, "width")
            extra["height"] = _norm_int(extra.get("height"), 1080, 120, 4096, "height")
        return src
    if kind == "motioneye":
        if not src:
            raise ValueError("motionEye needs the satellite Pi's host or IP")
        if "://" in src:
            raise ValueError("motionEye host only — no scheme; the stream port comes from the camera number")
        camera_no = _norm_int(extra.get("camera_no"), 1, 1, 32, "camera_no")
        extra["camera_no"] = camera_no
        if extra.get("stream_port") not in (None, ""):
            extra["stream_port"] = _norm_int(extra.get("stream_port"), 0, 1, 65535, "stream_port")
        return src
    if not src:
        raise ValueError("a source URL is required")
    parts = urlsplit(src)
    if kind == "rtsp":
        if parts.scheme.lower() not in ("rtsp", "rtsps"):
            raise ValueError("an RTSP source starts with rtsp://")
    elif parts.scheme.lower() not in ("http", "https"):
        raise ValueError("a snapshot or MJPEG source starts with http:// or https://")
    if not parts.netloc:
        raise ValueError("the source URL has no host")
    return src


def upsert_camera(
    camera_id: str,
    patch: dict[str, Any],
    *,
    db_path: Path | None = None,
    now: float | None = None,
) -> dict[str, Any]:
    """Create or update a camera. `password` in the patch is stored in the settings KV;
    an empty/missing password keeps the existing one, `clear_password` removes it."""
    init_camera_tables(db_path)
    cid = str(camera_id or "").strip().lower()
    if not CAMERA_ID_RE.match(cid):
        raise ValueError("camera id: lowercase letters, digits, '-' or '_' (max 40)")
    ts = time.time() if now is None else now
    existing = get_camera(cid, db_path)
    base: dict[str, Any] = existing or {
        "space_id": "",
        "label": "",
        "source_kind": "",
        "source": "",
        "username": "",
        "enabled": True,
        "interval_s": DEFAULT_INTERVAL_S,
        "lights_on_only": True,
        "keep_days": DEFAULT_KEEP_DAYS,
        "cap_gb": DEFAULT_CAP_GB,
        "extra": {},
        "created_at": ts,
    }
    merged = dict(base)
    for key in ("space_id", "label", "source_kind", "source", "username"):
        if key in patch and patch[key] is not None:
            merged[key] = str(patch[key]).strip()
    for key in ("enabled", "lights_on_only"):
        if key in patch and patch[key] is not None:
            merged[key] = bool(patch[key])
    if "interval_s" in patch:
        merged["interval_s"] = _norm_int(patch["interval_s"], DEFAULT_INTERVAL_S, MIN_INTERVAL_S, 86400, "interval_s")
    if "keep_days" in patch:
        merged["keep_days"] = _norm_int(patch["keep_days"], DEFAULT_KEEP_DAYS, 0, 3650, "keep_days")
    if "cap_gb" in patch:
        merged["cap_gb"] = _norm_float(patch["cap_gb"], DEFAULT_CAP_GB, 0.0, 512.0, "cap_gb")
    extra = dict(merged.get("extra") or {})
    if isinstance(patch.get("extra"), dict):
        extra.update(patch["extra"])
    if extra.get("assemble") not in (None, ""):
        if extra["assemble"] not in ASSEMBLE_MODES:
            raise ValueError(f"assemble must be one of {', '.join(ASSEMBLE_MODES)}")
    if extra.get("fps") not in (None, ""):
        extra["fps"] = _norm_int(extra.get("fps"), 12, 1, 60, "fps")
    if extra.get("auth") not in (None, "", "basic", "digest"):
        raise ValueError("auth must be basic or digest")
    normalise_framing(extra)
    normalise_controls(extra)

    if merged["space_id"] not in _valid_space_ids(db_path):
        raise ValueError(f"unknown zone {merged['space_id'] or '(none)'}")
    merged["source"] = validate_source(merged["source_kind"], merged["source"], extra)
    merged["source_kind"] = str(merged["source_kind"]).strip().lower()
    if not merged["label"]:
        merged["label"] = cid

    # Folder names are frozen the first time a camera is written, and never recomputed.
    # Renaming a camera afterwards must not move or orphan recordings already on disk, so
    # the tree keeps the name it was created under. That is the operator's call (2026-09-10)
    # and it is the only version of this that cannot break history.
    if not (extra.get("zone_dir") and extra.get("name_dir")):
        zone_label = _space_label(merged["space_id"], db_path) or merged["space_id"]
        extra["zone_dir"] = safe_dir_segment(zone_label, merged["space_id"] or "zone")
        extra["name_dir"] = safe_dir_segment(merged["label"], cid)
        # Two cameras whose labels sanitise to the same folder would write into each other.
        taken = {
            (str((c.get("extra") or {}).get("zone_dir") or ""), str((c.get("extra") or {}).get("name_dir") or ""))
            for c in list_cameras(db_path)
            if c["camera_id"] != cid
        }
        if (extra["zone_dir"], extra["name_dir"]) in taken:
            extra["name_dir"] = safe_dir_segment(f"{extra['name_dir']} ({cid})", cid)
    merged["extra"] = extra

    with _connect(db_path) as conn:
        conn.execute(
            """
            INSERT INTO camera(camera_id, space_id, label, source_kind, source, username, enabled,
                               interval_s, lights_on_only, keep_days, cap_gb, extra_json, created_at, updated_at)
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(camera_id) DO UPDATE SET
              space_id=excluded.space_id, label=excluded.label, source_kind=excluded.source_kind,
              source=excluded.source, username=excluded.username, enabled=excluded.enabled,
              interval_s=excluded.interval_s, lights_on_only=excluded.lights_on_only,
              keep_days=excluded.keep_days, cap_gb=excluded.cap_gb, extra_json=excluded.extra_json,
              updated_at=excluded.updated_at
            """,
            (
                cid,
                merged["space_id"],
                merged["label"],
                merged["source_kind"],
                merged["source"],
                merged["username"],
                1 if merged["enabled"] else 0,
                int(merged["interval_s"]),
                1 if merged["lights_on_only"] else 0,
                int(merged["keep_days"]),
                float(merged["cap_gb"]),
                json.dumps(extra, separators=(",", ":")),
                float(merged["created_at"]),
                ts,
            ),
        )
        conn.execute("INSERT OR IGNORE INTO camera_status(camera_id) VALUES(?)", (cid,))
        conn.commit()

    if patch.get("clear_password"):
        set_setting(PASSWORD_KEY_PREFIX + cid, "", db_path)
    elif patch.get("password"):
        set_setting(PASSWORD_KEY_PREFIX + cid, str(patch["password"]), db_path)
    cam = get_camera(cid, db_path)
    assert cam is not None
    return cam


def delete_camera(camera_id: str, *, delete_media: bool = False, db_path: Path | None = None) -> bool:
    init_camera_tables(db_path)
    with _connect(db_path) as conn:
        cur = conn.execute("DELETE FROM camera WHERE camera_id=?", (camera_id,))
        conn.execute("DELETE FROM camera_status WHERE camera_id=?", (camera_id,))
        conn.commit()
    set_setting(PASSWORD_KEY_PREFIX + camera_id, "", db_path)
    if delete_media:
        shutil.rmtree(camera_dir(camera_id), ignore_errors=True)
    return cur.rowcount > 0


# ---------------------------------------------------------------------------------------
# status
# ---------------------------------------------------------------------------------------


def get_status(camera_id: str, db_path: Path | None = None) -> dict[str, Any]:
    init_camera_tables(db_path)
    with _connect(db_path) as conn:
        r = conn.execute("SELECT * FROM camera_status WHERE camera_id=?", (camera_id,)).fetchone()
    if not r:
        return {
            "last_attempt_at": None,
            "last_ok_at": None,
            "last_error": "",
            "last_bytes": 0,
            "width": None,
            "height": None,
            "frames": 0,
            "consecutive_failures": 0,
            "skipped_reason": "",
            "last_prune_at": None,
            "last_assemble_day": "",
        }
    return {k: r[k] for k in r.keys() if k != "camera_id"}


def _patch_status(camera_id: str, patch: dict[str, Any], db_path: Path | None = None) -> None:
    init_camera_tables(db_path)
    cols = ", ".join(f"{k}=?" for k in patch)
    with _connect(db_path) as conn:
        conn.execute("INSERT OR IGNORE INTO camera_status(camera_id) VALUES(?)", (camera_id,))
        conn.execute(f"UPDATE camera_status SET {cols} WHERE camera_id=?", (*patch.values(), camera_id))
        conn.commit()


# ---------------------------------------------------------------------------------------
# JPEG helpers
# ---------------------------------------------------------------------------------------

_SOI = b"\xff\xd8"
_EOI = b"\xff\xd9"
_SOF_MARKERS = {0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7, 0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF}


def is_jpeg(data: bytes) -> bool:
    return len(data) > 4 and data[:2] == _SOI


def jpeg_size(data: bytes) -> tuple[int, int] | None:
    """(width, height) from the first SOF segment, or None when the stream is not a JPEG."""
    if not is_jpeg(data):
        return None
    i = 2
    n = len(data)
    while i + 4 <= n:
        if data[i] != 0xFF:
            i += 1
            continue
        marker = data[i + 1]
        if marker == 0xFF:
            i += 1
            continue
        if marker in (0xD8, 0x01) or 0xD0 <= marker <= 0xD7:
            i += 2
            continue
        if i + 4 > n:
            break
        seg_len = (data[i + 2] << 8) | data[i + 3]
        if marker in _SOF_MARKERS:
            if i + 9 > n:
                return None
            height = (data[i + 5] << 8) | data[i + 6]
            width = (data[i + 7] << 8) | data[i + 8]
            return (width, height)
        if marker == 0xDA:  # start of scan — SOF must have come before
            return None
        i += 2 + seg_len
    return None


def first_jpeg_frame(chunks: Iterable[bytes], *, max_bytes: int = MAX_FRAME_BYTES) -> bytes:
    """Pull the first complete JPEG (SOI…EOI) out of a byte stream — an MJPEG multipart
    stream, or a plain image body. Raises CaptureError when none arrives within max_bytes."""
    buf = bytearray()
    start = -1
    for chunk in chunks:
        if not chunk:
            continue
        buf += chunk
        if start < 0:
            start = buf.find(_SOI)
            if start < 0:
                if len(buf) > 64 * 1024:
                    del buf[:-2]
                continue
        end = buf.find(_EOI, start + 2)
        if end >= 0:
            return bytes(buf[start : end + 2])
        if len(buf) - start > max_bytes:
            raise CaptureError("frame larger than the 12 MB limit — lower the camera's resolution")
    if start >= 0:
        raise CaptureError("stream ended before a complete frame arrived")
    raise CaptureError("no JPEG data in the response — is this a snapshot or MJPEG URL?")


# ---------------------------------------------------------------------------------------
# capture back-ends
# ---------------------------------------------------------------------------------------


def ffmpeg_bin(db_path: Path | None = None) -> str | None:
    configured = get_setting("ffmpeg_bin", "", db_path).strip()
    return shutil.which(configured or "ffmpeg")


def _http_auth(cam: dict[str, Any], password: str) -> Any:
    user = str(cam.get("username") or "")
    if not user and not password:
        return None
    import httpx

    if (cam.get("extra") or {}).get("auth") == "digest":
        return httpx.DigestAuth(user, password)
    return httpx.BasicAuth(user, password)


def _http_fetch_frame(url: str, auth: Any, timeout: float) -> bytes:
    import httpx

    def _iter(resp: httpx.Response) -> Iterator[bytes]:
        for chunk in resp.iter_bytes(chunk_size=64 * 1024):
            yield chunk

    try:
        with httpx.Client(timeout=httpx.Timeout(timeout, connect=min(timeout, 8.0)), follow_redirects=True) as client:
            with client.stream("GET", url, auth=auth) as resp:
                if resp.status_code == 401:
                    raise CaptureError("camera rejected the credentials (HTTP 401)")
                if resp.status_code >= 400:
                    raise CaptureError(f"camera answered HTTP {resp.status_code}")
                return first_jpeg_frame(_iter(resp))
    except httpx.ConnectError as exc:
        raise CaptureError(f"cannot reach the camera: {exc}") from exc
    except httpx.TimeoutException as exc:
        raise CaptureError(f"camera did not answer within {timeout:g} s") from exc
    except httpx.HTTPError as exc:
        raise CaptureError(f"HTTP error: {exc}") from exc


# ---------------------------------------------------------------------------------------
# framing — mirror, flip, rotate, digital zoom
# ---------------------------------------------------------------------------------------

# A fixed-mount camera is rarely mounted the way the operator wants to look at it: it hangs
# off a tent bar upside down, or it is a webcam whose driver mirrors the frame because it
# was built for video calls, or it sees the whole tent when what matters is one plant.
#
# The transform is baked into the stored frame rather than applied in the browser, because
# the frame on disk IS the record - the timelapse, the journal attachment and (next pass)
# the plant regions all read it. A view-only flip would leave every one of those disagreeing
# with what the operator sees on the card.
#
# The cost of that choice: changing the framing re-frames the record from that moment on.
# Yesterday's frames keep the old geometry, so a timelapse spanning the change jumps. The
# drawer says so; re-framing a camera is the operator's call and there is no version of this
# that could rewrite frames already taken.


def normalise_framing(extra: dict[str, Any]) -> dict[str, Any]:
    """Validate the framing keys in ``extra``, in place. Raises ValueError, operator-readable.

    Each key is dropped rather than stored at its no-op value, so ``extra`` stays a record of
    what the operator actually changed and :func:`has_transform` is a truthiness test rather
    than a comparison against defaults.
    """
    for key in ("flip_h", "flip_v"):
        if extra.get(key) in (None, "", False, 0):
            extra.pop(key, None)
        else:
            extra[key] = True
    if extra.get("rotate") in (None, "", 0):
        extra.pop("rotate", None)
    else:
        rot = _norm_int(extra.get("rotate"), 0, 0, 360, "rotate")
        if rot not in ROTATE_CHOICES:
            raise ValueError("rotate must be 0, 90, 180 or 270")
        extra["rotate"] = rot
    if extra.get("zoom") in (None, ""):
        extra.pop("zoom", None)
    else:
        zoom = _norm_float(extra.get("zoom"), 1.0, 1.0, MAX_ZOOM, "zoom")
        if zoom <= 1.0:
            extra.pop("zoom", None)
        else:
            extra["zoom"] = round(zoom, 2)
    if "zoom" in extra:
        # Where the crop window sits, as a percentage of the travel it has. 50/50 is the
        # middle; a tent camera framing one plant is usually nowhere near the middle.
        extra["zoom_x"] = round(_norm_float(extra.get("zoom_x"), 50.0, 0.0, 100.0, "zoom_x"), 1)
        extra["zoom_y"] = round(_norm_float(extra.get("zoom_y"), 50.0, 0.0, 100.0, "zoom_y"), 1)
    else:
        extra.pop("zoom_x", None)
        extra.pop("zoom_y", None)
    if extra.get("warmup_frames") in (None, "", 0):
        extra.pop("warmup_frames", None)
    else:
        extra["warmup_frames"] = _norm_int(
            extra.get("warmup_frames"), 0, 1, MAX_WARMUP_FRAMES, "warmup_frames"
        )
    return extra


def has_transform(extra: dict[str, Any] | None) -> bool:
    e = extra or {}
    return bool(e.get("flip_h") or e.get("flip_v") or e.get("rotate") or float(e.get("zoom") or 1.0) > 1.0)


def build_video_filters(extra: dict[str, Any] | None) -> list[str]:
    """The ``-vf`` chain for a camera's framing, in the order that keeps it cheap and sane.

    Crop first: everything after it then works on fewer pixels, and the crop window is the
    one thing the operator picked in terms of the *sensor's* frame, so it has to be applied
    before anything moves the pixels around. Rotate next, mirror last - the mirror is what
    the operator is looking at in the preview, so it reads as the outermost operation.

    The crop is written as ffmpeg expressions rather than pixel numbers because the input
    size is not known here: a USB camera resolves its mode at capture time, and an IP camera
    can change resolution without telling anybody.
    """
    e = extra or {}
    filters: list[str] = []
    zoom = float(e.get("zoom") or 1.0)
    if zoom > 1.0:
        fx = max(0.0, min(1.0, float(e.get("zoom_x", 50.0) or 0.0) / 100.0))
        fy = max(0.0, min(1.0, float(e.get("zoom_y", 50.0) or 0.0) / 100.0))
        # trunc(.../2)*2 keeps the crop even on both axes. An odd width or height is refused
        # by the yuv420p encoder the timelapse uses, and discovering that a month later when
        # the first assembly runs is exactly the delayed failure worth two expressions here.
        filters.append(
            f"crop=trunc(iw/{zoom:g}/2)*2:trunc(ih/{zoom:g}/2)*2:"
            f"trunc((iw-iw/{zoom:g})*{fx:g}/2)*2:trunc((ih-ih/{zoom:g})*{fy:g}/2)*2"
        )
    rot = int(e.get("rotate") or 0)
    if rot == 90:
        filters.append("transpose=1")  # clockwise
    elif rot == 270:
        filters.append("transpose=2")  # counter-clockwise
    elif rot == 180:
        filters.append("transpose=1,transpose=1")
    if e.get("flip_h"):
        filters.append("hflip")
    if e.get("flip_v"):
        filters.append("vflip")
    return filters


def warmup_filters(extra: dict[str, Any] | None) -> list[str]:
    """Throw away the first N frames of a live capture before keeping one.

    Auto exposure and auto focus do not converge on frame 1. A UVC camera opened cold hands
    out a dark, hunting frame and settles a few frames later - invisible on a video call, but
    this rig opens the camera once every ten minutes and keeps exactly one frame, so the
    hunting frame IS the record. Discarding a handful costs a second of wall clock and is the
    difference between a usable auto mode and a timelapse that flickers.
    """
    n = int((extra or {}).get("warmup_frames") or 0)
    return [f"select=gte(n\\,{n})"] if n > 0 else []


def _transform_jpeg(data: bytes, extra: dict[str, Any], timeout: float, db_path: Path | None) -> bytes:
    """Apply the framing to a frame that arrived over HTTP as a finished JPEG.

    USB and RTSP get the filters for free inside the capture, because ffmpeg is already
    decoding there. A snapshot, MJPEG or motionEye source hands us a JPEG, so one decode and
    re-encode of a single still is the price of a mirror or a crop - and only when a
    transform is actually configured, which is why the untouched path stays byte-exact.

    With no ffmpeg the capture FAILS rather than storing the frame untransformed. A gap in the
    record is recoverable; a run where half the frames are mirrored and half are not cannot be
    told apart afterwards, and it breaks both the timelapse and the pixel regions that read it.
    """
    filters = build_video_filters(extra)
    if not filters:
        return data
    if not ffmpeg_bin(db_path):
        raise CaptureError(
            "this camera has a mirror, rotation or zoom set, and an HTTP source needs ffmpeg on "
            "the brain to apply it (apt install ffmpeg). Clear the framing to capture untouched "
            "frames instead."
        )
    return _ffmpeg_frame(["-f", "image2pipe", "-i", "pipe:0"], timeout, db_path, vf=filters, stdin=data)


def _explain_capture_failure(line: str, input_args: list[str]) -> str:
    """Turn ffmpeg's bare errno text into something the operator can act on.

    "Inappropriate ioctl for device" is ENOTTY, and it means the thing at that path is not
    a video-capture device at all. Verbatim it sounds like an ffmpeg bug; it is nearly
    always one of three fixable situations, so say which ones.
    """
    if not line:
        return "ffmpeg produced no frame"
    if "Inappropriate ioctl for device" not in line:
        return line
    device = ""
    if "-i" in input_args:
        idx = input_args.index("-i")
        if idx + 1 < len(input_args):
            device = input_args[idx + 1]
    where = device or "that device"
    cap = query_v4l2_capability(device) if device else None
    if cap is None:
        return (
            f"{where} is not a video device. Inside the brain container this path is "
            "whatever compose mapped there — with no camera configured it maps /dev/null. "
            "Set DSC_CAMERA_DEVICE in the brain .env to the camera's "
            "/dev/v4l/by-id/... path and recreate the container."
        )
    if not cap["is_capture"]:
        return (
            f"{where} is a {cap['card'] or 'v4l2'} node, but it carries no video-capture "
            "capability — v4l2 exposes a metadata node alongside each camera and they look "
            "alike in a list. Pick the camera's capture node instead."
        )
    return line


def _ffmpeg_frame(
    input_args: list[str],
    timeout: float,
    db_path: Path | None = None,
    *,
    vf: list[str] | None = None,
    stdin: bytes | None = None,
) -> bytes:
    """One JPEG out of ffmpeg. ``vf`` is the filter chain (framing, warm-up discard); ``stdin``
    feeds it a frame we already hold, which is how an HTTP source gets mirrored."""
    binary = ffmpeg_bin(db_path)
    if not binary:
        raise CaptureError("ffmpeg is not installed on the brain host (apt install ffmpeg)")
    cmd = [
        binary,
        "-hide_banner",
        "-loglevel",
        "error",
        # -nostdin stops ffmpeg eating the parent's stdin; it has to go when stdin IS the frame.
        *([] if stdin is not None else ["-nostdin"]),
        *input_args,
        *(["-vf", ",".join(vf)] if vf else []),
        "-frames:v",
        "1",
        "-f",
        "image2",
        "-vcodec",
        "mjpeg",
        "-q:v",
        "3",
        "pipe:1",
    ]
    try:
        proc = subprocess.run(cmd, input=stdin, capture_output=True, timeout=timeout, check=False)
    except subprocess.TimeoutExpired as exc:
        raise CaptureError(f"ffmpeg gave no frame within {timeout:g} s") from exc
    except OSError as exc:
        raise CaptureError(f"ffmpeg could not start: {exc}") from exc
    if proc.returncode != 0 or not is_jpeg(proc.stdout):
        err = (proc.stderr or b"").decode("utf-8", "replace").strip().splitlines()
        raise CaptureError(_explain_capture_failure(err[-1] if err else "", input_args))
    return proc.stdout


def _url_with_credentials(url: str, user: str, password: str) -> str:
    if not user and not password:
        return url
    parts = urlsplit(url)
    host = parts.hostname or ""
    if parts.port:
        host = f"{host}:{parts.port}"
    from urllib.parse import quote

    netloc = f"{quote(user, safe='')}:{quote(password, safe='')}@{host}"
    return urlunsplit((parts.scheme, netloc, parts.path, parts.query, parts.fragment))


def motioneye_stream_url(cam: dict[str, Any]) -> str:
    extra = cam.get("extra") or {}
    host = str(cam.get("source") or "").strip()
    port = extra.get("stream_port") or (MOTIONEYE_BASE_STREAM_PORT + int(extra.get("camera_no") or 1))
    return f"http://{host}:{int(port)}/"


def resolve_stream_url(cam: dict[str, Any]) -> str | None:
    """The URL a browser could open for a live stream, when the source has one."""
    kind = cam.get("source_kind")
    if kind == "mjpeg":
        return str(cam.get("source"))
    if kind == "motioneye":
        return motioneye_stream_url(cam)
    return None


def _usb_frame(src: str, extra: dict[str, Any], timeout: float, db_path: Path | None) -> bytes:
    """One frame from a webcam, at the best resolution it offers rather than its default.

    ffmpeg given only `-f v4l2 -i /dev/videoN` takes the driver's default format, which on
    a UVC camera is pixel format index 0 at its default size — YUYV 640x480 on the Brio
    500s here, from a sensor that does 1920x1080. For a canopy timelapse that difference is
    the whole point of the camera, so we ask for the largest MJPG mode unless the operator
    pinned one.

    If that negotiation fails we retry bare. A camera that only yields its default size is
    worth far more than no camera at all, and the alternative is a grow log that silently
    stops recording because a mode was refused.
    """
    # Controls are re-applied before every capture rather than once at save. ffmpeg opens
    # the device fresh each time, the container can be recreated under a camera that stayed
    # plugged in, and a replug resets a UVC device to its defaults - so "set it once" quietly
    # decays into a camera that is no longer on the settings the operator chose. A dozen
    # ioctls cost under a millisecond and make the configured state true every time.
    controls = extra.get("controls")
    if isinstance(controls, dict) and controls:
        apply_v4l2_controls(src, controls)

    vf = warmup_filters(extra) + build_video_filters(extra)
    want: tuple[int, int] | None = None
    pinned = extra.get("width"), extra.get("height")
    if all(v not in (None, "") for v in pinned):
        try:
            want = (int(pinned[0]), int(pinned[1]))
        except (TypeError, ValueError):
            want = None
    if want is None:
        want = best_usb_frame_size(src)
    if want:
        sized = [
            "-f", "v4l2",
            "-input_format", str(extra.get("input_format") or "mjpeg"),
            "-video_size", f"{want[0]}x{want[1]}",
            "-i", src,
        ]
        try:
            return _ffmpeg_frame(sized, timeout, db_path, vf=vf)
        except CaptureError:
            pass
    return _ffmpeg_frame(["-f", "v4l2", "-i", src], timeout, db_path, vf=vf)


def capture_frame(cam: dict[str, Any], password: str, *, timeout: float = CAPTURE_TIMEOUT_S, db_path: Path | None = None) -> bytes:
    """One JPEG from the camera's source. Raises CaptureError with the reason."""
    kind = cam.get("source_kind")
    src = str(cam.get("source") or "")
    extra = dict(cam.get("extra") or {})
    if kind == "usb":
        return _usb_frame(src, extra, timeout, db_path)
    if kind == "rtsp":
        url = _url_with_credentials(src, str(cam.get("username") or ""), password)
        vf = warmup_filters(extra) + build_video_filters(extra)
        return _ffmpeg_frame(["-rtsp_transport", "tcp", "-i", url], timeout, db_path, vf=vf)
    if kind in ("snapshot", "mjpeg"):
        return _transform_jpeg(_http_fetch_frame(src, _http_auth(cam, password), timeout), extra, timeout, db_path)
    if kind == "motioneye":
        data = _http_fetch_frame(motioneye_stream_url(cam), _http_auth(cam, password), timeout)
        return _transform_jpeg(data, extra, timeout, db_path)
    raise CaptureError(f"unknown source kind {kind!r}")


# ---------------------------------------------------------------------------------------
# frames on disk
# ---------------------------------------------------------------------------------------


def _day_of(ts: float) -> str:
    # Windows refuses negative timestamps; a retention cutoff before the epoch is "keep all".
    return datetime.fromtimestamp(max(0.0, ts)).strftime("%Y-%m-%d")


def store_frame(camera_id: str, data: bytes, *, now: float | None = None) -> dict[str, Any]:
    """One frame onto disk as ``<zone>/<name>/ddmmyyHHMM.jpg``.

    The stamp has minute resolution, so two captures in the same minute would collide — the
    interval makes that rare but *Capture now* can do it. A suffix is appended rather than
    overwriting: losing a frame the operator deliberately asked for is worse than an odd
    filename.
    """
    ts = time.time() if now is None else now
    root = camera_dir(camera_id)
    day = format_frame_day(ts)
    day_dir = root / day
    day_dir.mkdir(parents=True, exist_ok=True)
    stamp = format_frame_time(ts)
    name = f"{day}/{stamp}.jpg"
    path = day_dir / f"{stamp}.jpg"
    seq = 2
    while path.exists():
        name = f"{day}/{stamp}-{seq}.jpg"
        path = day_dir / f"{stamp}-{seq}.jpg"
        seq += 1
    path.write_bytes(data)
    latest = root / "latest.jpg"
    tmp = root / "latest.jpg.tmp"
    tmp.write_bytes(data)
    os.replace(tmp, latest)
    return {"name": name, "path": path, "bytes": len(data), "at": ts}


def latest_frame_path(camera_id: str) -> Path | None:
    p = camera_dir(camera_id) / "latest.jpg"
    return p if p.is_file() else None


def frame_path(camera_id: str, name: str) -> Path | None:
    root = camera_dir(camera_id)
    if FRAME_NAME_RE.match(name):
        p = root / name
    elif LEGACY_FRAME_NAME_RE.match(name):
        p = root / "frames" / name
    else:
        return None
    return p if p.is_file() else None


def _frame_files(camera_id: str) -> list[tuple[float, Path, str]]:
    """Every stored frame as (capture time, path, api name), oldest first.

    Days used to be a directory level; now they are read back out of the filename, so this
    is the one scan that listing, retention and timelapse ranges all share.

    Frames written before the tree change still live under ``frames/<day>/<HHMMSS>.jpg`` and
    are included, keyed by the day directory they sit in. A kit that has been recording for
    months must not watch its history disappear because the layout improved.
    """
    root = camera_dir(camera_id)
    if not root.is_dir():
        return []
    out: list[tuple[float, Path, str]] = []
    for day_dir in root.iterdir():
        if not day_dir.is_dir() or len(day_dir.name) != FRAME_DAY_LEN or not day_dir.name.isdigit():
            continue
        for f in day_dir.iterdir():
            if not f.is_file():
                continue
            rel = f"{day_dir.name}/{f.name}"
            if not FRAME_NAME_RE.match(rel):
                continue
            at = parse_frame_stamp(rel)
            if at is not None:
                out.append((at, f, rel))
    legacy = root / "frames"
    if legacy.is_dir():
        for day_dir in legacy.iterdir():
            if not day_dir.is_dir() or not DAY_RE.match(day_dir.name):
                continue
            for f in day_dir.iterdir():
                if not f.is_file() or f.suffix != ".jpg":
                    continue
                try:
                    at = datetime.strptime(f"{day_dir.name} {f.stem}", "%Y-%m-%d %H%M%S").timestamp()
                except ValueError:
                    continue
                out.append((at, f, f"{day_dir.name}/{f.name}"))
    out.sort(key=lambda triple: (triple[0], triple[2]))
    return out


def list_days(camera_id: str) -> list[dict[str, Any]]:
    """Days that have frames, grouped from filenames rather than directories.

    The API still speaks YYYY-MM-DD — only the on-disk layout changed — so the SPA's day
    browser and the timelapse range picker keep working unaltered.
    """
    buckets: dict[str, dict[str, Any]] = {}
    for at, f, _name in _frame_files(camera_id):
        day = _day_of(at)
        b = buckets.setdefault(day, {"day": day, "frames": 0, "bytes": 0})
        b["frames"] += 1
        b["bytes"] += f.stat().st_size
    return [buckets[k] for k in sorted(buckets)]


def list_frames(camera_id: str, day: str | None = None, *, limit: int = 500) -> list[dict[str, Any]]:
    out: list[dict[str, Any]] = []
    for at, f, name in reversed(_frame_files(camera_id)):
        if day and _day_of(at) != day:
            continue
        out.append({"name": name, "at": at, "bytes": f.stat().st_size})
        if len(out) >= limit:
            break
    return out


def camera_storage(camera_id: str) -> dict[str, Any]:
    root = camera_dir(camera_id)
    frames_b = 0
    frames_n = 0
    oldest: float | None = None
    for d in list_days(camera_id):
        frames_b += d["bytes"]
        frames_n += d["frames"]
        try:
            day_ts = datetime.strptime(d["day"], "%Y-%m-%d").timestamp()
        except ValueError:
            continue
        oldest = day_ts if oldest is None else min(oldest, day_ts)
    tl_b = 0
    tl_n = 0
    tl_dir = root / "timelapse"
    if tl_dir.is_dir():
        for f in tl_dir.iterdir():
            if f.suffix == ".mp4":
                tl_b += f.stat().st_size
                tl_n += 1
    return {
        "frames": frames_n,
        "frame_bytes": frames_b,
        "timelapses": tl_n,
        "timelapse_bytes": tl_b,
        "bytes": frames_b + tl_b,
        "oldest_day_at": oldest,
    }


def prune_frames(camera_id: str, keep_days: int, cap_gb: float, *, now: float | None = None) -> dict[str, Any]:
    """Delete frame days older than keep_days (0 = keep all), then oldest days until the
    frames fit under cap_gb (0 = no cap). `latest.jpg` and timelapses are never touched."""
    ts = time.time() if now is None else now
    files = [(at, f) for at, f, _n in _frame_files(camera_id)]
    sizes = {f: f.stat().st_size for _at, f in files}
    deleted_days: set[str] = set()
    freed = 0

    def _drop(at: float, f: Path) -> int:
        size = sizes.get(f, 0)
        try:
            f.unlink()
        except OSError:
            return 0
        deleted_days.add(_day_of(at))
        return size

    if keep_days > 0:
        # Whole days, as before: a retention window that cut mid-day would leave a partial
        # day that reads as a gap in the record rather than an expiry.
        cutoff = _day_of(ts - keep_days * 86400)
        remaining: list[tuple[float, Path]] = []
        for at, f in files:
            if _day_of(at) < cutoff:
                freed += _drop(at, f)
            else:
                remaining.append((at, f))
        files = remaining
    if cap_gb > 0:
        cap = cap_gb * 1024**3
        total = sum(sizes.get(f, 0) for _at, f in files)
        idx = 0
        while idx < len(files) and total > cap:
            at, f = files[idx]
            size = sizes.get(f, 0)
            if _drop(at, f):
                total -= size
                freed += size
            idx += 1
    # Sweep day folders the deletions emptied. Left behind they would accumulate as one
    # empty directory per retired day, which is what the day level was meant to avoid.
    root = camera_dir(camera_id)
    if root.is_dir():
        for day_dir in root.iterdir():
            if day_dir.is_dir() and len(day_dir.name) == FRAME_DAY_LEN and day_dir.name.isdigit():
                try:
                    day_dir.rmdir()
                except OSError:
                    pass  # not empty: still has frames
    return {"deleted_days": sorted(deleted_days), "freed_bytes": freed}


# ---------------------------------------------------------------------------------------
# capture policy + capture-now
# ---------------------------------------------------------------------------------------


def lights_on_for(space_id: str, hub_values: dict[str, Any] | None) -> bool | None:
    """True/False from the hub's photoperiod window; None when the hub does not say."""
    key = SPACE_WINDOW_KEY.get(space_id)
    if not key or not hub_values:
        return None
    v = hub_values.get(key)
    if v is None:
        return None
    if isinstance(v, str):
        return v.strip().lower() in ("on", "true", "1", "open")
    return bool(v)


def should_capture(cam: dict[str, Any], status: dict[str, Any], hub_values: dict[str, Any] | None, now: float) -> tuple[bool, str]:
    """(capture?, reason). The reason is what the status row shows when a tick is skipped."""
    if not cam.get("enabled"):
        return False, "disabled"
    last = status.get("last_attempt_at")
    interval = max(MIN_INTERVAL_S, int(cam.get("interval_s") or DEFAULT_INTERVAL_S))
    if last is not None and now - float(last) < interval:
        return False, "waiting"
    if cam.get("lights_on_only"):
        on = lights_on_for(str(cam.get("space_id")), hub_values)
        if on is False:
            return False, "lights off"
        if on is None and cam.get("space_id") in SPACE_WINDOW_KEY:
            return True, "window unknown — captured anyway"
    return True, ""


def capture_now(camera_id: str, *, db_path: Path | None = None, now: float | None = None, note: str = "") -> dict[str, Any]:
    """Capture, store, and update the status row. Errors land in the status, not raised —
    the poller and the button both want the same honest record."""
    ts = time.time() if now is None else now
    cam = get_camera(camera_id, db_path)
    if cam is None:
        raise KeyError(camera_id)
    status = get_status(camera_id, db_path)
    try:
        data = capture_frame(cam, password_for(camera_id, db_path), db_path=db_path)
        if not is_jpeg(data):
            raise CaptureError("the source did not return a JPEG")
        stored = store_frame(camera_id, data, now=ts)
        size = jpeg_size(data)
        _patch_status(
            camera_id,
            {
                "last_attempt_at": ts,
                "last_ok_at": ts,
                "last_error": "",
                "last_bytes": stored["bytes"],
                "width": size[0] if size else None,
                "height": size[1] if size else None,
                "frames": int(status.get("frames") or 0) + 1,
                "consecutive_failures": 0,
                "skipped_reason": note,
            },
            db_path,
        )
        return {"ok": True, "frame": stored["name"], "bytes": stored["bytes"], "width": size[0] if size else None, "height": size[1] if size else None}
    except CaptureError as exc:
        _patch_status(
            camera_id,
            {
                "last_attempt_at": ts,
                "last_error": str(exc),
                "consecutive_failures": int(status.get("consecutive_failures") or 0) + 1,
                "skipped_reason": note,
            },
            db_path,
        )
        return {"ok": False, "error": str(exc)}


def test_source(spec: dict[str, Any], password: str, *, db_path: Path | None = None) -> dict[str, Any]:
    """Capture one frame from an unsaved spec (the drawer's Test button). Nothing is stored;
    the preview goes back as a data URL so the operator sees the framing before Save."""
    extra = dict(spec.get("extra") or {}) if isinstance(spec.get("extra"), dict) else {}
    cam = {
        "source_kind": str(spec.get("source_kind") or "").strip().lower(),
        "source": "",
        "username": str(spec.get("username") or ""),
        "extra": extra,
    }
    cam["source"] = validate_source(cam["source_kind"], str(spec.get("source") or ""), extra)
    # Test has to go through the same normalisation as Save, or the preview is of a framing
    # the saved camera will not have.
    normalise_framing(extra)
    normalise_controls(extra)
    t0 = time.monotonic()
    data = capture_frame(cam, password, db_path=db_path)
    if not is_jpeg(data):
        raise CaptureError("the source did not return a JPEG")
    size = jpeg_size(data)
    return {
        "ok": True,
        "ms": int((time.monotonic() - t0) * 1000),
        "bytes": len(data),
        "width": size[0] if size else None,
        "height": size[1] if size else None,
        "preview": "data:image/jpeg;base64," + base64.b64encode(data).decode("ascii"),
        "stream_url": resolve_stream_url(cam),
    }


# ---------------------------------------------------------------------------------------
# USB discovery (brain host only)
# ---------------------------------------------------------------------------------------


# v4l2 capability probe. We ask each NODE what it is instead of reading the name out of
# /sys that happens to share its number, because those two can describe different things:
# the brain runs in a container whose /dev holds only the devices compose mapped in, while
# /sys is bind-mounted from the host and lists every node the host has. Joining them by
# number is what produced the picker entry "/dev/video0 — Brio 500" for a /dev/video0 that
# was really /dev/null — a name borrowed from the host describing a device that could not
# possibly answer. Whatever QUERYCAP says came from the node ffmpeg will actually open.
_VIDIOC_QUERYCAP = 0x80685600  # _IOR('V', 0, struct v4l2_capability); the struct is 104 bytes
_V4L2_CAP_VIDEO_CAPTURE = 0x00000001
_V4L2_CAP_VIDEO_CAPTURE_MPLANE = 0x00001000
_V4L2_CAP_DEVICE_CAPS = 0x80000000


def query_v4l2_capability(device: str) -> dict[str, Any] | None:
    """One node's `VIDIOC_QUERYCAP`, or None if it is not a v4l2 device at all.

    The returned ``device_caps`` is the per-NODE capability set. ``capabilities`` is the
    union across every node of the same physical device, so a UVC webcam reports
    VIDEO_CAPTURE there even on its metadata node — only ``device_caps`` separates the node
    that yields frames from the one that answers ffmpeg with ENOTTY. Always read
    ``device_caps`` (falling back only on pre-3.3 kernels that do not set DEVICE_CAPS).
    """
    try:
        import fcntl  # POSIX only; absent on Windows, where there are no v4l2 nodes anyway
    except ImportError:
        return None
    try:
        fd = os.open(device, os.O_RDONLY | getattr(os, "O_NONBLOCK", 0))
    except OSError:
        return None
    try:
        raw = fcntl.ioctl(fd, _VIDIOC_QUERYCAP, b"\0" * 104)
    except OSError:
        return None  # ENOTTY: a real file or a placeholder mapping, not a v4l2 node
    finally:
        os.close(fd)
    import struct

    driver, card, bus_info, _version, caps, device_caps = struct.unpack("<16s32s32sIII", raw[:92])

    def _text(b: bytes) -> str:
        return b.split(b"\0")[0].decode("utf-8", "replace").strip()

    effective = device_caps if caps & _V4L2_CAP_DEVICE_CAPS else caps
    return {
        "driver": _text(driver),
        "card": _text(card),
        "bus_info": _text(bus_info),
        "capabilities": caps,
        "device_caps": effective,
        "is_capture": bool(effective & (_V4L2_CAP_VIDEO_CAPTURE | _V4L2_CAP_VIDEO_CAPTURE_MPLANE)),
    }


_VIDIOC_ENUM_FRAMESIZES = 0xC02C564A  # _IOWR('V', 74, struct v4l2_frmsizeenum), 44 bytes
_V4L2_FRMSIZE_TYPE_DISCRETE = 1
_FOURCC_MJPG = 0x47504A4D  # 'MJPG'


def usb_frame_sizes(device: str, fourcc: int = _FOURCC_MJPG) -> list[tuple[int, int]]:
    """Discrete frame sizes the node offers for one pixel format, largest first.

    Needed because ffmpeg, told nothing, takes the driver's DEFAULT format — which for a
    UVC webcam is pixel format index 0 at its default size. On the Brio 500 that is YUYV
    640x480, so a 1080p camera was being logged at 0.3 MP. We ask what it can do instead of
    accepting what it happens to start with.
    """
    try:
        import fcntl
    except ImportError:
        return []
    try:
        fd = os.open(device, os.O_RDONLY | getattr(os, "O_NONBLOCK", 0))
    except OSError:
        return []
    import struct

    sizes: list[tuple[int, int]] = []
    try:
        for index in range(64):  # UVC devices list well under this; the bound stops a bad driver
            payload = struct.pack("<III", index, fourcc, 0) + bytes(32)
            try:
                raw = fcntl.ioctl(fd, _VIDIOC_ENUM_FRAMESIZES, payload)
            except OSError:
                break  # EINVAL marks the end of the list
            _idx, _fmt, kind, width, height = struct.unpack("<IIIII", raw[:20])
            if kind != _V4L2_FRMSIZE_TYPE_DISCRETE:
                break  # stepwise/continuous: no discrete list to walk
            if width and height:
                sizes.append((width, height))
    finally:
        os.close(fd)
    return sorted(set(sizes), key=lambda wh: (wh[0] * wh[1], wh), reverse=True)


def best_usb_frame_size(device: str) -> tuple[int, int] | None:
    """The largest MJPG mode, or None to let the driver decide.

    MJPG rather than the absolute largest mode of any format: it is already JPEG, so a
    still costs one decode instead of a full uncompressed transfer, and on this rig it is
    the only format that reaches 1080p within USB 2.0's budget.
    """
    sizes = usb_frame_sizes(device)
    return sizes[0] if sizes else None


# ---------------------------------------------------------------------------------------
# v4l2 controls — auto focus, auto exposure, and the manual settings underneath them
# ---------------------------------------------------------------------------------------

# The camera's own knobs, read and written through the same ioctl door as QUERYCAP above
# rather than by shelling out to v4l2-ctl: v4l-utils is not in either brain image, and the
# whole point of the container mapping is that the node we probe is the node ffmpeg opens.
#
# Why an operator wants these on a grow camera, in order of how much they matter:
#
# * Auto exposure hunting is what makes a timelapse strobe. A tent goes from 900 umol to
#   black in one second at lights-off, and a camera left on auto re-meters every capture, so
#   a month of frames pulses. Manual exposure + manual white balance is the difference
#   between a timelapse and a stroboscope.
# * Auto focus hunts on leaves - a moving canopy under a fan is exactly the subject
#   continuous AF is worst at. Focus once, lock it, and every frame lands the same.
# * Anti-flicker (power line frequency) against LED drivers: wrong setting, rolling bands.
# * The rest - brightness, contrast, saturation, sharpness, gain, backlight compensation -
#   are the manual settings a webcam ships neutral and a grow tent is not neutral for.
#
# Every value here is the camera's, not ours: ranges, steps and defaults come from
# QUERYCTRL on the node itself, and anything a camera does not implement simply does not
# appear. A $15 webcam reports three of these; a Brio reports all of them.

_VIDIOC_QUERYCTRL = 0xC0445624  # _IOWR('V', 36, struct v4l2_queryctrl), 68 bytes
_VIDIOC_QUERYMENU = 0xC02C5625  # _IOWR('V', 37, struct v4l2_querymenu), 44 bytes, packed
_VIDIOC_G_CTRL = 0xC008561B  # _IOWR('V', 27, struct v4l2_control), 8 bytes
_VIDIOC_S_CTRL = 0xC008561C  # _IOWR('V', 28, struct v4l2_control), 8 bytes

_V4L2_CTRL_TYPE_INTEGER = 1
_V4L2_CTRL_TYPE_BOOLEAN = 2
_V4L2_CTRL_TYPE_MENU = 3
_V4L2_CTRL_FLAG_DISABLED = 0x0001
_V4L2_CTRL_FLAG_READ_ONLY = 0x0004
_V4L2_CTRL_FLAG_INACTIVE = 0x0010

_CTRL_TYPE_NAMES = {
    _V4L2_CTRL_TYPE_INTEGER: "int",
    _V4L2_CTRL_TYPE_BOOLEAN: "bool",
    _V4L2_CTRL_TYPE_MENU: "menu",
}

# The controls worth an operator's time, in the order they must be WRITTEN.
#
# That order is not cosmetic. A UVC driver refuses `exposure_time_absolute` while
# `auto_exposure` is still in aperture-priority, and refuses `focus_absolute` while
# continuous AF owns the lens - so each auto switch is written before the manual value it
# gates, and `gated_by` says which state the gate has to be in for the manual value to take.
V4L2_CONTROLS: tuple[dict[str, Any], ...] = (
    {
        "key": "power_line_frequency",
        "id": 0x00980918,
        "label": "Anti-flicker",
        "group": "exposure",
        "help": "Match the mains frequency the grow light runs on (50 Hz here) or a fast exposure picks up rolling bands from the LED driver.",
    },
    {
        "key": "auto_exposure",
        "id": 0x009A0901,
        "label": "Exposure mode",
        "group": "exposure",
        "help": "Manual holds every frame at the same brightness, which is what a timelapse needs; auto re-meters each capture and makes the run pulse.",
    },
    {
        "key": "exposure_time_absolute",
        "id": 0x009A0902,
        "label": "Exposure time",
        "group": "exposure",
        "gated_by": ("auto_exposure", 1),  # 1 = V4L2_EXPOSURE_MANUAL
        "help": "In 100 us units. Only settable with the exposure mode on manual.",
    },
    {
        "key": "gain",
        "id": 0x00980913,
        "label": "Gain",
        "group": "exposure",
        "help": "Sensor gain. Raising it brightens a dark frame and adds noise with it.",
    },
    {
        "key": "focus_automatic_continuous",
        "id": 0x009A090C,
        "label": "Auto focus",
        "group": "focus",
        "help": "Continuous AF hunts on a canopy moving under a fan. Focus once with it on, then turn it off to lock the lens where it landed.",
    },
    {
        "key": "focus_absolute",
        "id": 0x009A090A,
        "label": "Focus",
        "group": "focus",
        "gated_by": ("focus_automatic_continuous", 0),
        "help": "Manual focus position. Only settable with auto focus off.",
    },
    {
        "key": "white_balance_automatic",
        "id": 0x0098090C,
        "label": "Auto white balance",
        "group": "colour",
        "help": "Auto white balance drifts as the canopy fills the frame, so leaf colour in the record tracks the algorithm instead of the plant.",
    },
    {
        "key": "white_balance_temperature",
        "id": 0x0098091A,
        "label": "White balance",
        "group": "colour",
        "gated_by": ("white_balance_automatic", 0),
        "help": "Kelvin. Only settable with auto white balance off.",
    },
    {
        "key": "brightness",
        "id": 0x00980900,
        "label": "Brightness",
        "group": "image",
    },
    {
        "key": "contrast",
        "id": 0x00980901,
        "label": "Contrast",
        "group": "image",
    },
    {
        "key": "saturation",
        "id": 0x00980902,
        "label": "Saturation",
        "group": "image",
    },
    {
        "key": "sharpness",
        "id": 0x0098091B,
        "label": "Sharpness",
        "group": "image",
    },
    {
        "key": "backlight_compensation",
        "id": 0x0098091C,
        "label": "Backlight compensation",
        "group": "image",
        "help": "Lifts a subject shot against a bright background - a plant under a lamp pointed at the lens.",
    },
    {
        "key": "zoom_absolute",
        "id": 0x009A090D,
        "label": "Camera zoom",
        "group": "framing",
        "help": "The camera's own zoom, where it has one. Unlike the digital zoom above, it is applied before the frame reaches the brain, so what it costs in pixels is the camera's business.",
    },
    {
        "key": "pan_absolute",
        "id": 0x009A0908,
        "label": "Pan",
        "group": "framing",
        "help": "Where the camera's zoom window sits. Most webcams only move this while zoomed in.",
    },
    {
        "key": "tilt_absolute",
        "id": 0x009A0909,
        "label": "Tilt",
        "group": "framing",
    },
)

CONTROLS_BY_KEY: dict[str, dict[str, Any]] = {c["key"]: c for c in V4L2_CONTROLS}


def _open_video_node(device: str, *, write: bool) -> int | None:
    flags = (os.O_RDWR if write else os.O_RDONLY) | getattr(os, "O_NONBLOCK", 0)
    try:
        return os.open(device, flags)
    except OSError:
        return None


def _query_ctrl(fd: int, ctrl_id: int) -> dict[str, Any] | None:
    """QUERYCTRL for one control, or None when this camera does not implement it."""
    try:
        import fcntl
    except ImportError:
        return None
    import struct

    payload = struct.pack("<II32siiiiIII", ctrl_id, 0, b"", 0, 0, 0, 0, 0, 0, 0)
    try:
        raw = fcntl.ioctl(fd, _VIDIOC_QUERYCTRL, payload)
    except OSError:
        return None  # EINVAL: the control does not exist on this device
    _id, ctype, name, lo, hi, step, default, flags, _r0, _r1 = struct.unpack("<II32siiiiIII", raw)
    if flags & _V4L2_CTRL_FLAG_DISABLED:
        return None
    return {
        "name": name.split(b"\0")[0].decode("utf-8", "replace").strip(),
        "type": _CTRL_TYPE_NAMES.get(ctype, "int"),
        "min": lo,
        "max": hi,
        "step": step or 1,
        "default": default,
        "read_only": bool(flags & _V4L2_CTRL_FLAG_READ_ONLY),
        "inactive": bool(flags & _V4L2_CTRL_FLAG_INACTIVE),
    }


def _query_menu(fd: int, ctrl_id: int, lo: int, hi: int) -> list[dict[str, Any]]:
    """The menu entries a control offers, by their driver names.

    Asking rather than hardcoding: "1 = Manual Mode, 3 = Aperture Priority Mode" is UVC's
    numbering for auto_exposure and reads like nonsense in a dropdown until the driver's own
    label is next to it.
    """
    try:
        import fcntl
    except ImportError:
        return []
    import struct

    out: list[dict[str, Any]] = []
    for index in range(max(0, lo), min(hi, lo + 32) + 1):
        payload = struct.pack("<II32sI", ctrl_id, index, b"", 0)
        try:
            raw = fcntl.ioctl(fd, _VIDIOC_QUERYMENU, payload)
        except OSError:
            continue  # EINVAL: this slot of the range is not a valid choice
        _id, idx, name, _res = struct.unpack("<II32sI", raw)
        label = name.split(b"\0")[0].decode("utf-8", "replace").strip()
        out.append({"value": int(idx), "label": label or str(idx)})
    return out


def _get_ctrl(fd: int, ctrl_id: int) -> int | None:
    try:
        import fcntl
    except ImportError:
        return None
    import struct

    try:
        raw = fcntl.ioctl(fd, _VIDIOC_G_CTRL, struct.pack("<Ii", ctrl_id, 0))
    except OSError:
        return None
    return int(struct.unpack("<Ii", raw)[1])


def _set_ctrl(fd: int, ctrl_id: int, value: int) -> str:
    """Write one control. Returns "" on success, else the errno text, operator-readable."""
    try:
        import fcntl
    except ImportError:
        return "v4l2 controls need a Linux brain"
    import struct

    try:
        fcntl.ioctl(fd, _VIDIOC_S_CTRL, struct.pack("<Ii", ctrl_id, int(value)))
    except OSError as exc:
        return f"{exc.strerror or exc} (errno {exc.errno})"
    return ""


def list_v4l2_controls(device: str) -> list[dict[str, Any]]:
    """Every control from :data:`V4L2_CONTROLS` this node actually implements, with its own
    range and its current live value.

    Live value rather than what we stored: the camera is the source of truth for its own
    state, and the two can differ - a replug resets a UVC device to defaults, and nothing
    stops a second tool on the Pi from moving them.
    """
    fd = _open_video_node(device, write=False)
    if fd is None:
        return []
    out: list[dict[str, Any]] = []
    try:
        for spec in V4L2_CONTROLS:
            info = _query_ctrl(fd, int(spec["id"]))
            if info is None:
                continue
            entry: dict[str, Any] = {
                "key": spec["key"],
                "label": spec["label"],
                "group": spec["group"],
                "help": spec.get("help", ""),
                "driver_name": info["name"],
                "type": info["type"],
                "min": info["min"],
                "max": info["max"],
                "step": info["step"],
                "default": info["default"],
                "value": _get_ctrl(fd, int(spec["id"])),
                "read_only": info["read_only"],
                "inactive": info["inactive"],
                "options": _query_menu(fd, int(spec["id"]), info["min"], info["max"])
                if info["type"] == "menu"
                else [],
            }
            gate = spec.get("gated_by")
            if gate:
                entry["gated_by"] = {"key": gate[0], "value": gate[1]}
            out.append(entry)
    finally:
        os.close(fd)
    return out


def normalise_controls(extra: dict[str, Any]) -> dict[str, Any]:
    """Keep ``extra['controls']`` to known keys with integer values, in place.

    Ranges are deliberately NOT checked here: the camera owns them, they differ per model,
    and the brain has to be able to save a camera's settings while the device is unplugged or
    while the SPA is talking to a dev brain with no camera at all. A value the driver refuses
    comes back as a per-control error from :func:`apply_v4l2_controls`, which is where the
    device is actually present to have an opinion.
    """
    raw = extra.get("controls")
    if raw in (None, "", {}):
        extra.pop("controls", None)
        return extra
    if not isinstance(raw, dict):
        raise ValueError("controls must be an object of control name to value")
    clean: dict[str, int] = {}
    for key, value in raw.items():
        if key not in CONTROLS_BY_KEY:
            continue  # a control we do not expose, or a typo: dropped rather than stored
        if value in (None, ""):
            continue
        try:
            clean[key] = int(float(value))
        except (TypeError, ValueError) as exc:
            raise ValueError(f"{key} must be a whole number") from exc
    if clean:
        extra["controls"] = clean
    else:
        extra.pop("controls", None)
    return extra


def apply_v4l2_controls(device: str, controls: dict[str, Any]) -> list[dict[str, Any]]:
    """Write the operator's controls onto the camera. Never raises - returns what happened.

    A control that will not take is not worth losing a frame over: the capture is the point,
    and the drawer shows the live values afterwards so a refusal is visible rather than
    silent. Written in :data:`V4L2_CONTROLS` order so each auto switch lands before the
    manual value it gates.
    """
    results: list[dict[str, Any]] = []
    fd = _open_video_node(device, write=True)
    if fd is None:
        return [{"key": k, "value": v, "error": f"cannot open {device} for writing"} for k, v in controls.items()]
    try:
        for spec in V4L2_CONTROLS:
            key = spec["key"]
            if key not in controls:
                continue
            try:
                value = int(float(controls[key]))
            except (TypeError, ValueError):
                results.append({"key": key, "value": controls[key], "error": "not a number"})
                continue
            gate = spec.get("gated_by")
            if gate:
                gate_key, gate_want = gate
                gate_spec = CONTROLS_BY_KEY[gate_key]
                # What the gate will BE after this pass: the requested value if the operator
                # set one (it was written above, in table order), otherwise whatever the
                # camera currently holds.
                gate_now = controls.get(gate_key)
                if gate_now is None:
                    gate_now = _get_ctrl(fd, int(gate_spec["id"]))
                if gate_now is not None and int(gate_now) != int(gate_want):
                    results.append(
                        {"key": key, "value": value, "error": f"skipped while {gate_spec['label'].lower()} is on"}
                    )
                    continue
            results.append({"key": key, "value": value, "error": _set_ctrl(fd, int(spec["id"]), value)})
    except OSError as exc:  # a device yanked mid-apply; the capture still gets its try
        results.append({"key": "", "value": None, "error": str(exc)})
    finally:
        os.close(fd)
    return results


def _by_id_index() -> dict[str, str]:
    """`/dev/v4l/by-id` symlink -> node, so an entry can carry the camera's serial. Host
    only: inside the container the by-id tree is not mapped, and that is fine — it is a
    label, never the thing we probe."""
    out: dict[str, str] = {}
    root = Path("/dev/v4l/by-id")
    if not root.is_dir():
        return out
    for link in root.iterdir():
        try:
            out.setdefault(str(link.resolve()), link.name)
        except OSError:
            continue
    return out


def list_usb_video_devices(dev_root: Path | str | None = None) -> list[dict[str, str]]:
    """The nodes on the brain host that can actually hand ffmpeg a frame.

    Restricted to USB video-capture nodes, which is exactly what the "USB webcam on the
    brain" source kind means. Three things are deliberately left out, because offering any
    of them only buys the operator a Test that fails with "Inappropriate ioctl for device":

    * metadata nodes — v4l2 exposes one per camera, adjacent in numbering and identically
      named, so they are indistinguishable in a picker that reads only the name;
    * the Pi's own bcm2835 ISP and codec nodes, which are capture-capable but are not
      cameras;
    * a placeholder mapping (compose maps /dev/null when no camera is configured).

    Each entry carries ``bus_info``, and ``serial`` when /dev/v4l/by-id can supply one, so
    two identical cameras are tellable apart — this rig has two Brio 500s.
    """
    out: list[dict[str, str]] = []
    root = Path(dev_root) if dev_root is not None else Path("/dev")
    if not root.is_dir():
        return out
    by_id = _by_id_index()
    nodes = sorted(
        (p for p in root.glob("video*") if re.fullmatch(r"video\d+", p.name)),
        key=lambda p: int(p.name[5:]),
    )
    for node in nodes:
        cap = query_v4l2_capability(str(node))
        if cap is None or not cap["is_capture"]:
            continue
        if not cap["bus_info"].startswith("usb-"):
            continue  # platform: the Pi's ISP/codec nodes, not a webcam
        link = by_id.get(str(node), "")
        serial = ""
        m = re.match(r"usb-[0-9a-fA-F]{4}_(?:.*?)_([A-Za-z0-9]+)-video-index\d+$", link)
        if m:
            serial = m.group(1)
        name = cap["card"] or "unnamed"
        sizes = usb_frame_sizes(str(node))
        entry = {
            "device": str(node),
            "name": name,
            "bus_info": cap["bus_info"],
            "serial": serial,
            "by_id": f"/dev/v4l/by-id/{link}" if link else "",
            # What the picker should show. Two Brio 500s are the same word twice without it.
            "label": f"{name} · {serial}" if serial else f"{name} · {cap['bus_info']}",
            # MJPG modes, largest first, so the drawer can offer a real choice instead of
            # leaving the operator to discover that a 1080p camera records at 640x480.
            "sizes": [f"{w}x{h}" for w, h in sizes],
            "best_size": f"{sizes[0][0]}x{sizes[0][1]}" if sizes else "",
        }
        out.append(entry)
    return out


# ---------------------------------------------------------------------------------------
# timelapse assembly (ffmpeg, on demand or daily/weekly from the poller)
# ---------------------------------------------------------------------------------------


def list_timelapses(camera_id: str) -> list[dict[str, Any]]:
    tl_dir = camera_dir(camera_id) / "timelapse"
    if not tl_dir.is_dir():
        return []
    out: list[dict[str, Any]] = []
    for f in sorted(tl_dir.iterdir(), reverse=True):
        if f.suffix != ".mp4":
            continue
        meta_path = f.with_suffix(".json")
        meta: dict[str, Any] = {}
        if meta_path.is_file():
            try:
                meta = json.loads(meta_path.read_text(encoding="utf-8"))
            except (OSError, json.JSONDecodeError):
                meta = {}
        out.append({"name": f.name, "bytes": f.stat().st_size, "at": f.stat().st_mtime, **meta})
    return out


def timelapse_path(camera_id: str, name: str) -> Path | None:
    if not TIMELAPSE_NAME_RE.match(name):
        return None
    p = camera_dir(camera_id) / "timelapse" / name
    return p if p.is_file() else None


def assemble_timelapse(
    camera_id: str,
    day_from: str,
    day_to: str,
    *,
    fps: int = 12,
    height: int = 720,
    db_path: Path | None = None,
    journal: bool = True,
) -> dict[str, Any]:
    """Frames between two days (inclusive) → one H.264 mp4. Raises CaptureError with the
    reason (no ffmpeg, no frames, encoder failure)."""
    if not (DAY_RE.match(day_from) and DAY_RE.match(day_to)) or day_from > day_to:
        raise CaptureError("give a day range as YYYY-MM-DD, from ≤ to")
    binary = ffmpeg_bin(db_path)
    if not binary:
        raise CaptureError("ffmpeg is not installed on the brain host (apt install ffmpeg)")
    # Chronological by CAPTURE TIME, not by filename: ddmmyyHHMM does not sort into date
    # order, so sorting names here would shuffle the timelapse into nonsense.
    frames = [f for at, f, _n in _frame_files(camera_id) if day_from <= _day_of(at) <= day_to]
    if len(frames) < 2:
        raise CaptureError("fewer than two frames in that range")
    fps = max(1, min(60, int(fps)))
    height = max(144, min(2160, int(height)))
    tl_dir = camera_dir(camera_id) / "timelapse"
    tl_dir.mkdir(parents=True, exist_ok=True)
    name = f"{day_from}_{day_to}.mp4" if day_from != day_to else f"{day_from}.mp4"
    out = tl_dir / name
    list_file = tl_dir / f".{name}.txt"
    list_file.write_text("".join(f"file '{p.as_posix()}'\n" for p in frames), encoding="utf-8")
    cmd = [
        binary, "-hide_banner", "-loglevel", "error", "-nostdin", "-y",
        "-r", str(fps), "-f", "concat", "-safe", "0", "-i", str(list_file),
        "-vf", f"scale=-2:{height}", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "veryfast", "-crf", "23",
        "-movflags", "+faststart", str(out),
    ]
    t0 = time.monotonic()
    try:
        proc = subprocess.run(cmd, capture_output=True, timeout=900, check=False)
    except subprocess.TimeoutExpired as exc:
        raise CaptureError("ffmpeg did not finish the timelapse within 15 min") from exc
    finally:
        try:
            list_file.unlink()
        except OSError:
            pass
    if proc.returncode != 0 or not out.is_file():
        err = (proc.stderr or b"").decode("utf-8", "replace").strip().splitlines()
        raise CaptureError(err[-1] if err else "ffmpeg failed to assemble the timelapse")
    meta = {
        "day_from": day_from,
        "day_to": day_to,
        "frames": len(frames),
        "fps": fps,
        "height": height,
        "seconds": round(len(frames) / fps, 1),
        "encode_ms": int((time.monotonic() - t0) * 1000),
    }
    out.with_suffix(".json").write_text(json.dumps(meta), encoding="utf-8")
    if journal:
        _journal_timelapse(camera_id, name, meta, db_path)
    return {"name": name, "bytes": out.stat().st_size, "at": out.stat().st_mtime, **meta}


def _journal_timelapse(camera_id: str, name: str, meta: dict[str, Any], db_path: Path | None) -> None:
    cam = get_camera(camera_id, db_path)
    if not cam or cam["space_id"] not in SPACE_WINDOW_KEY:
        return
    try:
        from .space_journal import add_space_entry

        span = meta["day_from"] if meta["day_from"] == meta["day_to"] else f"{meta['day_from']} → {meta['day_to']}"
        add_space_entry(
            cam["space_id"],
            None,
            f"Timelapse assembled from {cam['label']}: {meta['frames']} frames, {span} ({meta['seconds']} s at {meta['fps']} fps) — /cameras/{camera_id}/timelapses/{name}",
            source="system",
            tags=["camera", "timelapse", camera_id],
            db_path=db_path,
        )
    except Exception:  # noqa: BLE001 — a journal hiccup must not fail the assembly
        pass


def auto_assemble_due(cam: dict[str, Any], status: dict[str, Any], now: float) -> tuple[str, str] | None:
    """(day_from, day_to) for a daily/weekly assembly that has not run yet, else None."""
    mode = (cam.get("extra") or {}).get("assemble") or "off"
    if mode == "off":
        return None
    yesterday = datetime.fromtimestamp(now) - timedelta(days=1)
    if mode == "daily":
        day = yesterday.strftime("%Y-%m-%d")
        if status.get("last_assemble_day") == day:
            return None
        return day, day
    if mode == "weekly":
        # Monday → Sunday of the week that ended most recently.
        end = yesterday - timedelta(days=(yesterday.weekday() + 1) % 7) if yesterday.weekday() != 6 else yesterday
        start = end - timedelta(days=6)
        key = end.strftime("%Y-%m-%d")
        if status.get("last_assemble_day") == key:
            return None
        return start.strftime("%Y-%m-%d"), key
    return None


# ---------------------------------------------------------------------------------------
# public shape
# ---------------------------------------------------------------------------------------


def public_camera(cam: dict[str, Any], db_path: Path | None = None) -> dict[str, Any]:
    status = get_status(cam["camera_id"], db_path)
    storage = camera_storage(cam["camera_id"])
    latest = latest_frame_path(cam["camera_id"])
    return {
        **cam,
        "password_set": bool(password_for(cam["camera_id"], db_path)),
        "stream_url": resolve_stream_url(cam),
        "status": status,
        "storage": storage,
        "has_latest": latest is not None,
        "latest_at": latest.stat().st_mtime if latest else None,
        "kind_label": SOURCE_KIND_LABELS.get(cam["source_kind"], cam["source_kind"]),
    }


def cameras_summary(db_path: Path | None = None) -> dict[str, Any]:
    cams = [public_camera(c, db_path) for c in list_cameras(db_path)]
    return {
        "cameras": cams,
        "source_kinds": [{"id": k, "label": SOURCE_KIND_LABELS[k]} for k in SOURCE_KINDS],
        "ffmpeg": ffmpeg_bin(db_path) is not None,
        "usb_devices": list_usb_video_devices(),
        "media_root": str(media_root()),
        "total_bytes": sum(c["storage"]["bytes"] for c in cams),
    }


def cameras_for_space(space_id: str, db_path: Path | None = None) -> list[dict[str, Any]]:
    """Compact per-space list for `/spaces` — id, label, freshness — so the zone card can
    show a thumbnail without loading the whole cameras page."""
    out: list[dict[str, Any]] = []
    for cam in list_cameras(db_path):
        if cam["space_id"] != space_id:
            continue
        status = get_status(cam["camera_id"], db_path)
        latest = latest_frame_path(cam["camera_id"])
        out.append(
            {
                "camera_id": cam["camera_id"],
                "label": cam["label"],
                "enabled": cam["enabled"],
                "source_kind": cam["source_kind"],
                "has_latest": latest is not None,
                "latest_at": latest.stat().st_mtime if latest else None,
                "last_error": status.get("last_error") or "",
                "interval_s": cam["interval_s"],
            }
        )
    return out


# ---------------------------------------------------------------------------------------
# poller — brain-owned cadence, independent of any browser
# ---------------------------------------------------------------------------------------

_TASK = None
TICK_S = 15.0
PRUNE_EVERY_S = 3600.0


def poll_once(hub_values: dict[str, Any] | None, *, now: float | None = None, db_path: Path | None = None) -> list[dict[str, Any]]:
    """One synchronous pass over every camera: capture when due, prune hourly, assemble
    when a daily/weekly timelapse is owed. Returns what happened, for logs and tests."""
    ts = time.time() if now is None else now
    done: list[dict[str, Any]] = []
    for cam in list_cameras(db_path):
        cid = cam["camera_id"]
        status = get_status(cid, db_path)
        go, reason = should_capture(cam, status, hub_values, ts)
        if go:
            res = capture_now(cid, db_path=db_path, now=ts, note=reason)
            done.append({"camera_id": cid, "action": "capture", **res})
        elif reason not in ("waiting", "") and status.get("skipped_reason") != reason:
            _patch_status(cid, {"skipped_reason": reason}, db_path)
            done.append({"camera_id": cid, "action": "skip", "reason": reason})
        last_prune = status.get("last_prune_at")
        if last_prune is None or ts - float(last_prune) >= PRUNE_EVERY_S:
            pr = prune_frames(cid, cam["keep_days"], cam["cap_gb"], now=ts)
            _patch_status(cid, {"last_prune_at": ts}, db_path)
            if pr["deleted_days"]:
                done.append({"camera_id": cid, "action": "prune", **pr})
        if cam.get("enabled"):
            due = auto_assemble_due(cam, status, ts)
            if due:
                try:
                    res = assemble_timelapse(cid, due[0], due[1], fps=int((cam.get("extra") or {}).get("fps") or 12), db_path=db_path)
                    done.append({"camera_id": cid, "action": "assemble", **res})
                except CaptureError as exc:
                    done.append({"camera_id": cid, "action": "assemble", "ok": False, "error": str(exc)})
                # Either way, do not retry every tick — the next window will try again.
                _patch_status(cid, {"last_assemble_day": due[1]}, db_path)
    return done


async def _poll_loop() -> None:
    import asyncio
    import logging

    from .fleet_state import get_fleet_state

    log = logging.getLogger(__name__)
    while True:
        try:
            fleet = get_fleet_state()
            hub_values = dict(fleet.hub.values) if fleet and fleet.hub else None
            if list_cameras():
                events = await asyncio.to_thread(poll_once, hub_values)
                for ev in events:
                    if ev.get("action") == "capture" and not ev.get("ok"):
                        log.warning("camera %s: %s", ev.get("camera_id"), ev.get("error"))
                    elif ev.get("action") in ("prune", "assemble"):
                        log.info("camera %s: %s %s", ev.get("camera_id"), ev.get("action"), ev)
        except Exception as exc:  # noqa: BLE001
            log.warning("camera poll tick failed: %s", exc)
        await asyncio.sleep(TICK_S)


def start_camera_poller() -> None:
    global _TASK
    import asyncio

    if _TASK is not None and not _TASK.done():
        return
    _TASK = asyncio.get_event_loop().create_task(_poll_loop())


def stop_camera_poller() -> None:
    global _TASK
    if _TASK is not None:
        _TASK.cancel()
        _TASK = None
