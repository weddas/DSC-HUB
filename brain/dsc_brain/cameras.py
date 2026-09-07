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
PASSWORD_KEY_PREFIX = "camera_password:"
CAMERA_ID_RE = re.compile(r"^[a-z0-9][a-z0-9_-]{0,39}$")
DAY_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
FRAME_NAME_RE = re.compile(r"^\d{4}-\d{2}-\d{2}/\d{6}\.jpg$")
TIMELAPSE_NAME_RE = re.compile(r"^[A-Za-z0-9_.-]+\.mp4$")


class CaptureError(RuntimeError):
    """A frame could not be captured; the message is operator-readable."""


# ---------------------------------------------------------------------------------------
# storage locations
# ---------------------------------------------------------------------------------------


def media_root() -> Path:
    """`DSC_DATA/media` resolved at call time (tests point DSC_DATA at a temp dir)."""
    base = Path(os.environ.get("DSC_DATA", str(DEFAULT_DB.parent)))
    return base / "media"


def camera_dir(camera_id: str) -> Path:
    return media_root() / "camera" / camera_id


def _connect(db_path: Path | None = None) -> sqlite3.Connection:
    if db_path is None:
        base = Path(os.environ.get("DSC_DATA", str(DEFAULT_DB.parent)))
        db_path = base / "dsc_ops.sqlite3"
    db_path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(db_path))
    conn.row_factory = sqlite3.Row
    return conn


def init_camera_tables(db_path: Path | None = None) -> None:
    with _connect(db_path) as conn:
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
        if not src.startswith("/dev/video"):
            raise ValueError("a USB webcam is a /dev/videoN device on the brain Pi")
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

    if merged["space_id"] not in _valid_space_ids(db_path):
        raise ValueError(f"unknown zone {merged['space_id'] or '(none)'}")
    merged["source"] = validate_source(merged["source_kind"], merged["source"], extra)
    merged["source_kind"] = str(merged["source_kind"]).strip().lower()
    if not merged["label"]:
        merged["label"] = cid
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


def _ffmpeg_frame(input_args: list[str], timeout: float, db_path: Path | None = None) -> bytes:
    binary = ffmpeg_bin(db_path)
    if not binary:
        raise CaptureError("ffmpeg is not installed on the brain host (apt install ffmpeg)")
    cmd = [
        binary,
        "-hide_banner",
        "-loglevel",
        "error",
        "-nostdin",
        *input_args,
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
        proc = subprocess.run(cmd, capture_output=True, timeout=timeout, check=False)
    except subprocess.TimeoutExpired as exc:
        raise CaptureError(f"ffmpeg gave no frame within {timeout:g} s") from exc
    except OSError as exc:
        raise CaptureError(f"ffmpeg could not start: {exc}") from exc
    if proc.returncode != 0 or not is_jpeg(proc.stdout):
        err = (proc.stderr or b"").decode("utf-8", "replace").strip().splitlines()
        raise CaptureError(err[-1] if err else "ffmpeg produced no frame")
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


def capture_frame(cam: dict[str, Any], password: str, *, timeout: float = CAPTURE_TIMEOUT_S, db_path: Path | None = None) -> bytes:
    """One JPEG from the camera's source. Raises CaptureError with the reason."""
    kind = cam.get("source_kind")
    src = str(cam.get("source") or "")
    if kind == "usb":
        return _ffmpeg_frame(["-f", "v4l2", "-i", src], timeout, db_path)
    if kind == "rtsp":
        url = _url_with_credentials(src, str(cam.get("username") or ""), password)
        return _ffmpeg_frame(["-rtsp_transport", "tcp", "-i", url], timeout, db_path)
    if kind in ("snapshot", "mjpeg"):
        return _http_fetch_frame(src, _http_auth(cam, password), timeout)
    if kind == "motioneye":
        return _http_fetch_frame(motioneye_stream_url(cam), _http_auth(cam, password), timeout)
    raise CaptureError(f"unknown source kind {kind!r}")


# ---------------------------------------------------------------------------------------
# frames on disk
# ---------------------------------------------------------------------------------------


def _day_of(ts: float) -> str:
    # Windows refuses negative timestamps; a retention cutoff before the epoch is "keep all".
    return datetime.fromtimestamp(max(0.0, ts)).strftime("%Y-%m-%d")


def store_frame(camera_id: str, data: bytes, *, now: float | None = None) -> dict[str, Any]:
    ts = time.time() if now is None else now
    root = camera_dir(camera_id)
    day = _day_of(ts)
    day_dir = root / "frames" / day
    day_dir.mkdir(parents=True, exist_ok=True)
    name = datetime.fromtimestamp(ts).strftime("%H%M%S") + ".jpg"
    path = day_dir / name
    path.write_bytes(data)
    latest = root / "latest.jpg"
    tmp = root / "latest.jpg.tmp"
    tmp.write_bytes(data)
    os.replace(tmp, latest)
    return {"name": f"{day}/{name}", "path": path, "bytes": len(data), "at": ts}


def latest_frame_path(camera_id: str) -> Path | None:
    p = camera_dir(camera_id) / "latest.jpg"
    return p if p.is_file() else None


def frame_path(camera_id: str, name: str) -> Path | None:
    if not FRAME_NAME_RE.match(name):
        return None
    p = camera_dir(camera_id) / "frames" / name
    return p if p.is_file() else None


def list_days(camera_id: str) -> list[dict[str, Any]]:
    root = camera_dir(camera_id) / "frames"
    if not root.is_dir():
        return []
    out: list[dict[str, Any]] = []
    for d in sorted(root.iterdir()):
        if not d.is_dir() or not DAY_RE.match(d.name):
            continue
        files = [f for f in d.iterdir() if f.suffix == ".jpg"]
        if not files:
            continue
        out.append({"day": d.name, "frames": len(files), "bytes": sum(f.stat().st_size for f in files)})
    return out


def list_frames(camera_id: str, day: str | None = None, *, limit: int = 500) -> list[dict[str, Any]]:
    root = camera_dir(camera_id) / "frames"
    if not root.is_dir():
        return []
    days = [day] if day else [d["day"] for d in list_days(camera_id)]
    out: list[dict[str, Any]] = []
    for d in reversed(days):
        if not DAY_RE.match(d):
            continue
        day_dir = root / d
        if not day_dir.is_dir():
            continue
        for f in sorted(day_dir.iterdir(), reverse=True):
            if f.suffix != ".jpg":
                continue
            try:
                at = datetime.strptime(f"{d} {f.stem}", "%Y-%m-%d %H%M%S").timestamp()
            except ValueError:
                continue
            out.append({"name": f"{d}/{f.name}", "at": at, "bytes": f.stat().st_size})
            if len(out) >= limit:
                return out
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
    days = list_days(camera_id)
    deleted_days: list[str] = []
    freed = 0
    root = camera_dir(camera_id) / "frames"
    if keep_days > 0:
        cutoff = _day_of(ts - keep_days * 86400)
        for d in list(days):
            if d["day"] < cutoff:
                shutil.rmtree(root / d["day"], ignore_errors=True)
                deleted_days.append(d["day"])
                freed += d["bytes"]
                days.remove(d)
    if cap_gb > 0:
        cap = cap_gb * 1024**3
        total = sum(d["bytes"] for d in days)
        while days and total > cap:
            d = days.pop(0)
            shutil.rmtree(root / d["day"], ignore_errors=True)
            deleted_days.append(d["day"])
            freed += d["bytes"]
            total -= d["bytes"]
    return {"deleted_days": deleted_days, "freed_bytes": freed}


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


def list_usb_video_devices() -> list[dict[str, str]]:
    """`/dev/videoN` nodes with the kernel's name — empty off-Linux. Metadata nodes are
    listed too (v4l2 exposes one per camera); the operator picks the one that answers."""
    sys_root = Path("/sys/class/video4linux")
    out: list[dict[str, str]] = []
    if not sys_root.is_dir():
        return out
    for node in sorted(sys_root.iterdir(), key=lambda p: p.name):
        dev = Path("/dev") / node.name
        if not dev.exists():
            continue
        try:
            name = (node / "name").read_text(encoding="utf-8", errors="replace").strip()
        except OSError:
            name = ""
        out.append({"device": str(dev), "name": name})
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
    root = camera_dir(camera_id) / "frames"
    frames: list[Path] = []
    for d in list_days(camera_id):
        if day_from <= d["day"] <= day_to:
            frames.extend(sorted(p for p in (root / d["day"]).iterdir() if p.suffix == ".jpg"))
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
