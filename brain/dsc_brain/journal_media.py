"""Photos attached to journal entries — rows in SQLite, bytes on disk.

Pass S6 of the settings plan. The operator adds notes and images from the dash (or a phone)
at any point in a grow, and every entry already freezes a sensor snapshot, so an image is
the one thing a grow journal has that the kit cannot record for itself.

Two rules from the plan, both load-bearing:

* **Files live on disk under ``DSC_DATA/media/``, never in SQLite.** Images dwarf the
  journals — a single 4 MB photo outweighs years of text entries — and a bloated database
  file slows every unrelated query and every backup.
* **Images are downscaled on the way in**, so retention maths stays predictable and a phone
  upload does not park 12 MP on a Pi's SD card.

Resizing uses **ffmpeg**, which the brain container already ships for camera capture, rather
than adding Pillow to the image for one call. Same binary, same failure mode, no new
dependency to build for arm64.
"""

from __future__ import annotations

import hashlib
import shutil
import sqlite3
import subprocess
import time
from pathlib import Path
from typing import Any

from .db import schema_once
from .paths import media_root
from .settings import connect as _settings_connect

# The long edge every stored image is scaled down to. 1600 px keeps a canopy shot readable
# on a desk monitor and a phone alike; anything larger is storage the operator pays for and
# never sees. Images already smaller than this are left alone rather than upscaled.
MAX_LONG_EDGE_PX = 1600

# Refused before anything touches the disk. The resized file is far smaller; this cap is on
# what a client may send.
MAX_UPLOAD_BYTES = 4 * 1024 * 1024

# Deliberately narrow. Every one of these is something a phone camera or the dash produces,
# and each is a still image ffmpeg can decode without a container format.
ACCEPTED_TYPES: dict[str, str] = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/heic": ".heic",
    "image/heif": ".heic",
}

MEDIA_SCHEMA = """
CREATE TABLE IF NOT EXISTS journal_media (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  journal_kind TEXT NOT NULL,
  entry_id INTEGER NOT NULL,
  scope_id TEXT NOT NULL DEFAULT '',
  path TEXT NOT NULL,
  content_type TEXT NOT NULL DEFAULT 'image/jpeg',
  w INTEGER,
  h INTEGER,
  bytes INTEGER NOT NULL DEFAULT 0,
  caption TEXT NOT NULL DEFAULT '',
  created_at REAL NOT NULL
);
"""


class MediaError(ValueError):
    """Anything the operator can fix by choosing a different file."""


def _connect(db_path: Path | None = None) -> sqlite3.Connection:
    """settings.connect, NOT ``open_db(db_path or DEFAULT_DB)``.

    ``paths.DEFAULT_DB`` is computed at IMPORT time, so a module binding it opens whatever
    ``DSC_DATA`` said when it was first imported — under the test fixtures that is the
    developer's real ``brain/data`` database, while ``media_root()`` resolves per call and
    points at the scratch dir. Rows and files then land in different places. settings.connect
    resolves the same way media_root does, so the two always agree.
    """
    return _settings_connect(db_path)


def init_journal_media_tables(db_path: Path | None = None) -> None:
    with _connect(db_path) as conn:
        if not schema_once(conn, "journal_media"):
            return
        conn.executescript(MEDIA_SCHEMA)
        conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_journal_media_entry "
            "ON journal_media(journal_kind, entry_id)"
        )
        conn.commit()


def journal_media_dir(journal_kind: str, scope_id: str) -> Path:
    """``DSC_DATA/media/journal/<kind>/<scope>`` — mirrors camera_dir's shape."""
    safe_scope = "".join(ch if ch.isalnum() or ch in "-_" else "_" for ch in str(scope_id or "unscoped"))
    return media_root() / "journal" / str(journal_kind) / (safe_scope or "unscoped")


def _ffmpeg_bin() -> str | None:
    # Deliberately not importing cameras.ffmpeg_bin: that reads a brain setting and pulls in
    # the whole capture module. The setting exists for exotic hosts; a plain PATH lookup is
    # what this needs, and falling back to None is handled by the caller.
    return shutil.which("ffmpeg")


def _probe_size(path: Path) -> tuple[int | None, int | None]:
    """(width, height) via ffprobe, or (None, None) — dimensions are nice, not required."""
    probe = shutil.which("ffprobe")
    if not probe:
        return None, None
    try:
        out = subprocess.run(
            [probe, "-v", "error", "-select_streams", "v:0",
             "-show_entries", "stream=width,height", "-of", "csv=p=0:s=x", str(path)],
            capture_output=True, timeout=20, check=False,
        )
        text = (out.stdout or b"").decode("utf-8", "replace").strip().split("\n")[0]
        w, _, h = text.partition("x")
        return int(w), int(h)
    except (OSError, ValueError, subprocess.SubprocessError):
        return None, None


def _downscale(raw: bytes, dest: Path) -> tuple[bool, str]:
    """Write ``raw`` to ``dest``, scaled so its long edge is at most MAX_LONG_EDGE_PX.

    Returns (resized, note). When ffmpeg is unavailable the ORIGINAL bytes are stored and
    the note says so — an un-resized photo the operator can see beats a lost one, and the
    4 MB cap already bounds the damage.
    """
    binary = _ffmpeg_bin()
    dest.parent.mkdir(parents=True, exist_ok=True)
    if not binary:
        dest.write_bytes(raw)
        return False, "stored at original size — ffmpeg is not installed on the brain host"

    src = dest.parent / f".incoming-{dest.name}"
    src.write_bytes(raw)
    try:
        # scale='if(gt(iw,ih),min(iw,MAX),-2)':'...' — only ever shrinks, never upscales, and
        # -2 keeps the other edge even (required by most encoders) while preserving aspect.
        vf = (
            f"scale='if(gt(iw,ih),min(iw,{MAX_LONG_EDGE_PX}),-2)'"
            f":'if(gt(iw,ih),-2,min(ih,{MAX_LONG_EDGE_PX}))'"
        )
        proc = subprocess.run(
            [binary, "-hide_banner", "-loglevel", "error", "-nostdin", "-y",
             "-i", str(src), "-vf", vf, "-frames:v", "1", "-q:v", "3", str(dest)],
            capture_output=True, timeout=60, check=False,
        )
        if proc.returncode != 0 or not dest.exists() or dest.stat().st_size == 0:
            detail = (proc.stderr or b"").decode("utf-8", "replace").strip().splitlines()
            dest.write_bytes(raw)
            return False, f"stored at original size — {detail[-1] if detail else 'ffmpeg could not read it'}"
        return True, ""
    except subprocess.SubprocessError as exc:
        dest.write_bytes(raw)
        return False, f"stored at original size — {exc}"
    finally:
        src.unlink(missing_ok=True)


def add_media(
    journal_kind: str,
    entry_id: int,
    raw: bytes,
    *,
    content_type: str,
    scope_id: str = "",
    caption: str = "",
    filename: str = "",
    db_path: Path | None = None,
) -> dict[str, Any]:
    """Store one image against a journal entry. Raises MediaError on anything refusable."""
    if not raw:
        raise MediaError("the uploaded file was empty")
    if len(raw) > MAX_UPLOAD_BYTES:
        raise MediaError(
            f"image is {len(raw) / 1_048_576:.1f} MB — the limit is "
            f"{MAX_UPLOAD_BYTES // 1_048_576} MB. Take the photo at a lower resolution."
        )
    ctype = str(content_type or "").split(";")[0].strip().lower()
    if ctype not in ACCEPTED_TYPES:
        raise MediaError(
            f"{ctype or 'that file type'} is not an image this journal accepts "
            f"({', '.join(sorted(set(ACCEPTED_TYPES)))})"
        )

    init_journal_media_tables(db_path)
    # Content hash, not the client's filename: two uploads of the same photo land on one
    # file, and a hostile or accidental "../" in a filename can never reach the path.
    digest = hashlib.sha256(raw).hexdigest()[:32]
    # Everything is re-encoded to JPEG by the downscale step; keep .jpg unless it is stored
    # verbatim, in which case the original extension is the honest one.
    directory = journal_media_dir(journal_kind, scope_id)
    dest = directory / f"{digest}.jpg"
    resized, note = _downscale(raw, dest)
    if not resized:
        original_ext = ACCEPTED_TYPES.get(ctype, ".jpg")
        if original_ext != ".jpg":
            verbatim = directory / f"{digest}{original_ext}"
            dest.rename(verbatim)
            dest = verbatim

    w, h = _probe_size(dest)
    size = dest.stat().st_size
    now = time.time()
    with _connect(db_path) as conn:
        cur = conn.execute(
            """
            INSERT INTO journal_media(journal_kind, entry_id, scope_id, path, content_type,
                                      w, h, bytes, caption, created_at)
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (str(journal_kind), int(entry_id), str(scope_id or ""), str(dest),
             "image/jpeg" if dest.suffix == ".jpg" else ctype, w, h, size,
             str(caption or "")[:500], now),
        )
        conn.commit()
        media_id = int(cur.lastrowid or 0)

    return {
        "id": media_id,
        "journal_kind": str(journal_kind),
        "entry_id": int(entry_id),
        "bytes": size,
        "w": w,
        "h": h,
        "caption": str(caption or "")[:500],
        "created_at": now,
        "original_name": str(filename or ""),
        "note": note,
    }


def list_media(
    journal_kind: str, entry_ids: list[int], *, db_path: Path | None = None
) -> dict[int, list[dict[str, Any]]]:
    """Media for a batch of entries, keyed by entry id — one query per journal render."""
    if not entry_ids:
        return {}
    init_journal_media_tables(db_path)
    placeholders = ",".join("?" * len(entry_ids))
    out: dict[int, list[dict[str, Any]]] = {}
    conn = _connect(db_path)
    try:
        rows = conn.execute(
            f"""
            SELECT id, entry_id, bytes, w, h, caption, created_at
            FROM journal_media
            WHERE journal_kind = ? AND entry_id IN ({placeholders})
            ORDER BY id
            """,
            (str(journal_kind), *[int(e) for e in entry_ids]),
        ).fetchall()
    finally:
        conn.close()
    for r in rows:
        out.setdefault(int(r["entry_id"]), []).append({
            "id": int(r["id"]),
            "bytes": int(r["bytes"] or 0),
            "w": r["w"],
            "h": r["h"],
            "caption": r["caption"] or "",
            "created_at": float(r["created_at"]),
        })
    return out


def read_media(media_id: int, *, db_path: Path | None = None) -> tuple[Path, str] | None:
    """(path, content_type) for serving, or None when the row or its file is gone."""
    init_journal_media_tables(db_path)
    conn = _connect(db_path)
    try:
        row = conn.execute(
            "SELECT path, content_type FROM journal_media WHERE id = ?", (int(media_id),)
        ).fetchone()
    finally:
        conn.close()
    if not row:
        return None
    path = Path(row["path"])
    if not path.exists():
        return None
    return path, str(row["content_type"] or "image/jpeg")


def delete_media(media_id: int, *, db_path: Path | None = None) -> bool:
    """Remove a row and its file. The file goes only if no other row still points at it."""
    init_journal_media_tables(db_path)
    with _connect(db_path) as conn:
        row = conn.execute(
            "SELECT path FROM journal_media WHERE id = ?", (int(media_id),)
        ).fetchone()
        if not row:
            return False
        path = Path(row["path"])
        conn.execute("DELETE FROM journal_media WHERE id = ?", (int(media_id),))
        others = conn.execute(
            "SELECT COUNT(*) AS n FROM journal_media WHERE path = ?", (str(path),)
        ).fetchone()
        conn.commit()
    # Deduplication by content hash means one file can back several entries; deleting the
    # bytes while another entry still shows it would blank that entry's photo.
    if int(others["n"] or 0) == 0:
        path.unlink(missing_ok=True)
    return True


def delete_entry_media(
    journal_kind: str, entry_ids: list[int], *, db_path: Path | None = None
) -> int:
    """Drop every image belonging to these entries — used when entries are pruned."""
    if not entry_ids:
        return 0
    init_journal_media_tables(db_path)
    conn = _connect(db_path)
    try:
        placeholders = ",".join("?" * len(entry_ids))
        ids = [int(r["id"]) for r in conn.execute(
            f"SELECT id FROM journal_media WHERE journal_kind = ? AND entry_id IN ({placeholders})",
            (str(journal_kind), *[int(e) for e in entry_ids]),
        )]
    finally:
        conn.close()
    for mid in ids:
        delete_media(mid, db_path=db_path)
    return len(ids)


def media_stats(db_path: Path | None = None) -> dict[str, Any]:
    """Bytes and counts for the storage card — measured on disk, not estimated."""
    init_journal_media_tables(db_path)
    conn = _connect(db_path)
    try:
        row = conn.execute(
            "SELECT COUNT(*) AS n, COALESCE(SUM(bytes), 0) AS b FROM journal_media"
        ).fetchone()
        by_kind = [
            {"kind": r["journal_kind"], "files": int(r["n"]), "bytes": int(r["b"] or 0)}
            for r in conn.execute(
                "SELECT journal_kind, COUNT(*) AS n, COALESCE(SUM(bytes),0) AS b "
                "FROM journal_media GROUP BY journal_kind ORDER BY b DESC"
            )
        ]
    finally:
        conn.close()
    return {
        "files": int(row["n"] or 0),
        "bytes": int(row["b"] or 0),
        "by_kind": by_kind,
        "root": str(media_root() / "journal"),
    }
