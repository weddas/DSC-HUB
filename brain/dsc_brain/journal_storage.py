"""Journals & storage (plan-settings S3, operator decision 6):

* per-journal retention in days (0 = indefinite, the default for every journal except the
  fleet history, which keeps its own setting), pruned best-effort and throttled;
* storage stats — database file size, free space on the card, and each journal's rows,
  oldest entry and estimated share of the file (SQLite here has no ``dbstat``, so the
  share is estimated from row lengths and scaled to the real file size);
* a preview of what a retention cut would delete, so the SPA can offer the download first;
* export of any journal as JSON or CSV, singly or as a zip bundle;
* ``plant_journal_archive`` — a plant's whole journal plus its tent's entries for the run,
  written when a roster slot is retired or harvested (or on demand), immune to retention,
  downloadable as one grow-record bundle.
"""

from __future__ import annotations

import csv
import io
import json
import logging
import os
import shutil
import time
import zipfile
from pathlib import Path
from typing import Any

from .paths import DEFAULT_DB
from .settings import connect, get_setting, set_setting
from .db import ensure_schema

_logger = logging.getLogger(__name__)

RETENTION_KEY = "journal_retention_json"
PRUNE_INTERVAL_SEC = 3600.0
_last_prune_ts = 0.0

ARCHIVE_SCHEMA = """
CREATE TABLE IF NOT EXISTS plant_journal_archive (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  plant_id TEXT NOT NULL,
  archived_at REAL NOT NULL,
  reason TEXT NOT NULL DEFAULT 'retired',
  header_json TEXT NOT NULL DEFAULT '{}',
  entries_json TEXT NOT NULL DEFAULT '[]',
  tent_entries_json TEXT NOT NULL DEFAULT '[]'
);
"""

# kind → table, timestamp column, scope column (None = whole table), label, description.
JOURNALS: dict[str, dict[str, Any]] = {
    "plant": {"table": "plant_journal", "ts": "occurred_at", "scope": "plant_id", "label": "Plant journals", "description": "Per-plant entries (operator notes, stage changes, flips) with their frozen sensor snapshot."},
    "space": {"table": "space_journal", "ts": "occurred_at", "scope": "space_id", "label": "Tent journals", "description": "Per-tent entries — role flips, schedule shifts, occupancy."},
    "room": {"table": "room_journal", "ts": "occurred_at", "scope": "room_id", "label": "Room journal", "description": "Room-level entries and the lung's own notes."},
    "core": {"table": "dsc_core_journal", "ts": "occurred_at", "scope": None, "label": "Facility journal", "description": "Facility-wide entries, including every settings change."},
    "grow_log": {"table": "grow_event_log", "ts": "ts", "scope": None, "label": "Grow log", "description": "What the hub did — demand changes, alerts, re-asserts. High volume."},
    "learning": {"table": "learning_log", "ts": "ts", "scope": "seat_id", "label": "Learning log", "description": "Energy / climate learning observations per seat."},
    "soft_cal": {"table": "soft_cal_sessions", "ts": "ts", "scope": "probe_n", "label": "SoftCal sessions", "description": "Probe calibration sessions and their payloads."},
}

# Rough bytes per row when a table has no text columns to measure (fleet_history).
FLEET_HISTORY_ROW_BYTES = 48


def _archive_ensure(conn) -> None:
    ensure_schema(conn, "journal_archive", ARCHIVE_SCHEMA)


# ---- retention ---------------------------------------------------------------------------


def get_retention() -> dict[str, int]:
    out = {kind: 0 for kind in JOURNALS}
    raw = get_setting(RETENTION_KEY, "")
    if not raw:
        return out
    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        return out
    if isinstance(parsed, dict):
        for kind, days in parsed.items():
            if kind in out:
                try:
                    out[kind] = max(0, min(3650, int(days)))
                except (TypeError, ValueError):
                    pass
    return out


def set_retention(patch: dict[str, Any]) -> dict[str, int]:
    current = get_retention()
    for kind, days in patch.items():
        if kind not in JOURNALS:
            raise ValueError(f"unknown journal {kind!r}")
        try:
            d = int(days)
        except (TypeError, ValueError) as exc:
            raise ValueError(f"{kind}: retention must be a whole number of days") from exc
        if d < 0 or d > 3650:
            raise ValueError(f"{kind}: retention must be 0 (keep forever) or 1–3650 days")
        current[kind] = d
    set_setting(RETENTION_KEY, json.dumps(current, separators=(",", ":"), sort_keys=True))
    return current


def _archived_plant_ids(conn) -> set[str]:
    _archive_ensure(conn)
    return {str(r["plant_id"]) for r in conn.execute("SELECT DISTINCT plant_id FROM plant_journal_archive")}


def _ts_cutoff(days: int, now: float | None = None) -> float:
    return (now or time.time()) - days * 86400.0


def preview_retention(kind: str, days: int, *, now: float | None = None, db_path: Path | None = None) -> dict[str, Any]:
    """How many rows a retention of `days` would delete right now (0 = none)."""
    if kind not in JOURNALS:
        raise ValueError(f"unknown journal {kind!r}")
    if days <= 0:
        return {"kind": kind, "days": 0, "would_delete": 0, "oldest_ts": None, "cutoff_ts": None}
    spec = JOURNALS[kind]
    cutoff = _ts_cutoff(days, now)
    conn = connect(db_path)
    try:
        sql = f"SELECT COUNT(*) AS n, MIN({spec['ts']}) AS oldest FROM {spec['table']} WHERE {spec['ts']} < ?"
        params: list[Any] = [cutoff]
        if kind == "plant":
            archived = _archived_plant_ids(conn)
            if archived:
                sql += f" AND plant_id NOT IN ({','.join('?' for _ in archived)})"
                params.extend(sorted(archived))
        row = conn.execute(sql, params).fetchone()
    finally:
        conn.close()
    return {
        "kind": kind,
        "days": days,
        "would_delete": int(row["n"] or 0),
        "oldest_ts": float(row["oldest"]) if row["oldest"] is not None else None,
        "cutoff_ts": cutoff,
    }


def prune_journals(*, now: float | None = None, db_path: Path | None = None, kinds: list[str] | None = None) -> dict[str, int]:
    """Delete rows older than each journal's retention. Archived plants are never pruned."""
    retention = get_retention()
    removed: dict[str, int] = {}
    doomed: dict[str, list[int]] = {}
    conn = connect(db_path)
    try:
        archived = _archived_plant_ids(conn)
        for kind, days in retention.items():
            if kinds and kind not in kinds:
                continue
            if days <= 0:
                continue
            spec = JOURNALS[kind]
            where = f"{spec['ts']} < ?"
            params: list[Any] = [_ts_cutoff(days, now)]
            if kind == "plant" and archived:
                where += f" AND plant_id NOT IN ({','.join('?' for _ in archived)})"
                params.extend(sorted(archived))
            try:
                # Collect the ids FIRST so the media files can go with them. Deleting the
                # rows alone would orphan photos on disk: nothing would reference them, and
                # the storage card would keep counting bytes the operator cannot reach.
                doomed[kind] = [int(r["id"]) for r in conn.execute(
                    f"SELECT id FROM {spec['table']} WHERE {where}", params
                )]
                cur = conn.execute(f"DELETE FROM {spec['table']} WHERE {where}", params)
                removed[kind] = int(cur.rowcount or 0)
            except Exception as exc:  # noqa: BLE001 — a missing table is not fatal
                _logger.debug("prune %s skipped: %s", kind, exc)
        conn.commit()
    finally:
        conn.close()
    # Media goes AFTER the commit and after this connection is closed. delete_entry_media
    # opens its own connection, and doing that while the DELETE above was still an open
    # write transaction made it block on the lock until the busy timeout — the failure was
    # then swallowed by the best-effort guard and the photos silently survived their entries.
    for kind, ids in doomed.items():
        _prune_media_for(kind, ids, db_path)
    return removed


def _prune_media_for(kind: str, entry_ids: list[int], db_path: Path | None) -> None:
    """Best effort: a journal prune must not fail because a photo could not be removed."""
    if not entry_ids:
        return
    try:
        from .journal_media import delete_entry_media

        delete_entry_media(kind, entry_ids, db_path=db_path)
    except Exception as exc:  # noqa: BLE001
        _logger.debug("media prune for %s skipped: %s", kind, exc)


def maybe_prune_journals(*, now: float | None = None) -> dict[str, int] | None:
    """Throttled prune for the ingest loop — at most once an hour, never raises."""
    global _last_prune_ts
    ts = now or time.time()
    if ts - _last_prune_ts < PRUNE_INTERVAL_SEC:
        return None
    _last_prune_ts = ts
    try:
        return prune_journals(now=ts)
    except Exception as exc:  # noqa: BLE001
        _logger.warning("journal prune failed: %s", exc)
        return None


# ---- storage stats ----------------------------------------------------------------------------


def _table_exists(conn, table: str) -> bool:
    return conn.execute("SELECT 1 FROM sqlite_master WHERE type='table' AND name=?", (table,)).fetchone() is not None


def _text_columns(conn, table: str) -> list[str]:
    cols = conn.execute(f"PRAGMA table_info({table})").fetchall()
    return [str(c["name"]) for c in cols if str(c["type"] or "").upper() in ("TEXT", "", "BLOB")]


def storage_stats(db_path: Path | None = None) -> dict[str, Any]:
    path = db_path or (Path(os.environ.get("DSC_DATA", str(DEFAULT_DB.parent))) / "dsc_ops.sqlite3")
    file_bytes = path.stat().st_size if path.exists() else 0
    try:
        usage = shutil.disk_usage(str(path.parent))
        free_bytes, total_bytes = int(usage.free), int(usage.total)
    except OSError:
        free_bytes, total_bytes = 0, 0
    retention = get_retention()
    try:
        from .journal_media import media_stats

        media = media_stats(db_path)
    except Exception:  # noqa: BLE001 — the storage card must render without media
        media = {"files": 0, "bytes": 0, "by_kind": [], "root": ""}
    conn = connect(db_path)
    journals: list[dict[str, Any]] = []
    est_total = 0.0
    try:
        archived = _archived_plant_ids(conn)
        for kind, spec in JOURNALS.items():
            table, ts = spec["table"], spec["ts"]
            if not _table_exists(conn, table):
                journals.append({"kind": kind, "label": spec["label"], "description": spec["description"], "rows": 0, "oldest_ts": None, "newest_ts": None, "estimated_bytes": 0, "retention_days": retention[kind], "present": False})
                continue
            cols = _text_columns(conn, table)
            length_expr = " + ".join(f"COALESCE(LENGTH({c}),0)" for c in cols) if cols else "0"
            row = conn.execute(f"SELECT COUNT(*) AS n, MIN({ts}) AS oldest, MAX({ts}) AS newest, COALESCE(SUM({length_expr}),0) AS bytes FROM {table}").fetchone()
            rows = int(row["n"] or 0)
            est = float(row["bytes"] or 0) + rows * 40  # + per-row overhead (ids, timestamps, page slack)
            est_total += est
            journals.append({
                "kind": kind,
                "label": spec["label"],
                "description": spec["description"],
                "rows": rows,
                "oldest_ts": float(row["oldest"]) if row["oldest"] is not None else None,
                "newest_ts": float(row["newest"]) if row["newest"] is not None else None,
                "estimated_bytes": est,
                "retention_days": retention[kind],
                "present": True,
                "archived_plants": len(archived) if kind == "plant" else None,
            })
        # Fleet history — its own retention setting, listed for the total.
        fh = conn.execute("SELECT COUNT(*) AS n, MIN(ts) AS oldest, MAX(ts) AS newest FROM fleet_history").fetchone()
        fh_rows = int(fh["n"] or 0)
        fh_est = fh_rows * FLEET_HISTORY_ROW_BYTES
        est_total += fh_est
        ar = conn.execute("SELECT COUNT(*) AS n, COALESCE(SUM(LENGTH(entries_json)+LENGTH(tent_entries_json)+LENGTH(header_json)),0) AS bytes FROM plant_journal_archive").fetchone()
        ar_est = float(ar["bytes"] or 0) + int(ar["n"] or 0) * 40
        est_total += ar_est
    finally:
        conn.close()
    # Scale estimates to the real file so the shares add up to what is on the card.
    scale = (file_bytes / est_total) if est_total > 0 and file_bytes > 0 else 1.0
    for j in journals:
        j["share_bytes"] = int(j["estimated_bytes"] * scale)
    return {
        "db_path": str(path),
        "db_bytes": file_bytes,
        "free_bytes": free_bytes,
        "total_bytes": total_bytes,
        "journals": journals,
        "fleet_history": {"rows": fh_rows, "oldest_ts": float(fh["oldest"]) if fh["oldest"] is not None else None, "newest_ts": float(fh["newest"]) if fh["newest"] is not None else None, "share_bytes": int(fh_est * scale), "retention_days": int(get_setting("fleet_history_retention_days", "45") or 45)},
        "archive": {"count": int(ar["n"] or 0), "share_bytes": int(ar_est * scale)},
        # Media is MEASURED, not estimated: the bytes come from the files on disk, and it
        # sits outside the database file, so it is deliberately not folded into the scaled
        # per-journal shares above. A single photo outweighs years of text entries, so
        # showing it inside the db-size pie would misreport both halves.
        "media": media,
        "estimate_note": "Per-journal sizes are estimated from row lengths and scaled to the database file size; SQLite here has no dbstat. Media bytes are measured on disk and sit outside the database file.",
    }


# ---- export ----------------------------------------------------------------------------------


def _rows(kind: str, scope_id: str | None, *, db_path: Path | None = None) -> list[dict[str, Any]]:
    spec = JOURNALS[kind]
    conn = connect(db_path)
    try:
        if not _table_exists(conn, spec["table"]):
            return []
        sql = f"SELECT * FROM {spec['table']}"
        params: list[Any] = []
        if scope_id and spec["scope"]:
            sql += f" WHERE {spec['scope']} = ?"
            params.append(scope_id)
        sql += f" ORDER BY {spec['ts']} ASC, id ASC"
        rows = [dict(r) for r in conn.execute(sql, params)]
    finally:
        conn.close()
    for r in rows:
        for key in ("tags_json", "snapshot_json", "payload_json", "payload"):
            if key in r and isinstance(r[key], str):
                try:
                    r[key.replace("_json", "")] = json.loads(r[key]) if r[key] else ([] if key == "tags_json" else {})
                except json.JSONDecodeError:
                    r[key.replace("_json", "")] = r[key]
                if key.endswith("_json"):
                    del r[key]
    return rows


def export_journal(kind: str, scope_id: str | None = None, fmt: str = "json", *, db_path: Path | None = None) -> tuple[str, str, bytes]:
    """Return (filename, content_type, body) for one journal."""
    if kind not in JOURNALS:
        raise ValueError(f"unknown journal {kind!r}")
    rows = _rows(kind, scope_id, db_path=db_path)
    stamp = time.strftime("%Y%m%d-%H%M")
    base = f"dsc-{kind}{('-' + scope_id.replace(':', '_')) if scope_id else ''}-{stamp}"
    if fmt == "csv":
        return f"{base}.csv", "text/csv; charset=utf-8", _to_csv(rows).encode("utf-8")
    payload = {"kind": kind, "scope_id": scope_id, "exported_at": time.time(), "count": len(rows), "entries": rows}
    return f"{base}.json", "application/json", json.dumps(payload, indent=2, default=str).encode("utf-8")


def _to_csv(rows: list[dict[str, Any]]) -> str:
    if not rows:
        return ""
    keys: list[str] = []
    for r in rows:
        for k in r:
            if k not in keys:
                keys.append(k)
    buf = io.StringIO()
    w = csv.DictWriter(buf, fieldnames=keys, extrasaction="ignore")
    w.writeheader()
    for r in rows:
        w.writerow({k: (json.dumps(v, default=str) if isinstance(v, (dict, list)) else v) for k, v in r.items()})
    return buf.getvalue()


def export_bundle(kinds: list[str], *, db_path: Path | None = None) -> tuple[str, bytes]:
    """Zip of JSON + CSV for each requested journal (the download-before-delete bundle)."""
    stamp = time.strftime("%Y%m%d-%H%M")
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as z:
        for kind in kinds:
            if kind not in JOURNALS:
                continue
            for fmt in ("json", "csv"):
                name, _ctype, body = export_journal(kind, None, fmt, db_path=db_path)
                z.writestr(name, body)
    return f"dsc-journals-{stamp}.zip", buf.getvalue()


# ---- archive ---------------------------------------------------------------------------------


def archive_plant(
    plant_id: str,
    *,
    reason: str = "retired",
    header: dict[str, Any] | None = None,
    tent_id: str | None = None,
    since_ts: float | None = None,
    db_path: Path | None = None,
) -> dict[str, Any]:
    """Freeze a plant's journal (and its tent's entries for the run) into the archive."""
    pid = str(plant_id or "").strip()
    if not pid:
        raise ValueError("plant_id required")
    entries = _rows("plant", pid, db_path=db_path)
    tent_entries: list[dict[str, Any]] = []
    if tent_id:
        tent_entries = [r for r in _rows("space", tent_id, db_path=db_path) if since_ts is None or float(r.get("occurred_at") or 0) >= since_ts]
    head = {
        "plant_id": pid,
        "reason": reason,
        "archived_at": time.time(),
        "tent_id": tent_id,
        "since_ts": since_ts,
        "entry_count": len(entries),
        "tent_entry_count": len(tent_entries),
        **(header or {}),
    }
    conn = connect(db_path)
    try:
        _archive_ensure(conn)
        cur = conn.execute(
            "INSERT INTO plant_journal_archive(plant_id, archived_at, reason, header_json, entries_json, tent_entries_json) VALUES(?,?,?,?,?,?)",
            (pid, head["archived_at"], reason, json.dumps(head, default=str), json.dumps(entries, default=str), json.dumps(tent_entries, default=str)),
        )
        conn.commit()
        archive_id = int(cur.lastrowid or 0)
    finally:
        conn.close()
    try:
        from .dsc_core_journal import add_core_entry

        label = str(head.get("nickname") or head.get("strain") or pid)
        add_core_entry(None, f"Archived grow record for {label} ({reason}): {len(entries)} entries, {len(tent_entries)} tent entries", source="system", tags=["journal", "archive"])
    except Exception:  # noqa: BLE001
        _logger.debug("archive journal note failed", exc_info=True)
    return {"id": archive_id, **head}


def list_archives(*, db_path: Path | None = None) -> list[dict[str, Any]]:
    conn = connect(db_path)
    try:
        _archive_ensure(conn)
        rows = conn.execute("SELECT id, plant_id, archived_at, reason, header_json FROM plant_journal_archive ORDER BY archived_at DESC").fetchall()
    finally:
        conn.close()
    out = []
    for r in rows:
        try:
            head = json.loads(r["header_json"] or "{}")
        except json.JSONDecodeError:
            head = {}
        out.append({"id": int(r["id"]), "plant_id": r["plant_id"], "archived_at": float(r["archived_at"]), "reason": r["reason"], **head})
    return out


def get_archive(archive_id: int, *, db_path: Path | None = None) -> dict[str, Any] | None:
    conn = connect(db_path)
    try:
        _archive_ensure(conn)
        r = conn.execute("SELECT * FROM plant_journal_archive WHERE id=?", (int(archive_id),)).fetchone()
    finally:
        conn.close()
    if r is None:
        return None
    return {
        "id": int(r["id"]),
        "plant_id": r["plant_id"],
        "archived_at": float(r["archived_at"]),
        "reason": r["reason"],
        "header": json.loads(r["header_json"] or "{}"),
        "entries": json.loads(r["entries_json"] or "[]"),
        "tent_entries": json.loads(r["tent_entries_json"] or "[]"),
    }


def export_archive(archive_id: int, fmt: str = "zip", *, db_path: Path | None = None) -> tuple[str, str, bytes]:
    a = get_archive(archive_id, db_path=db_path)
    if a is None:
        raise ValueError("no such archive")
    label = str(a["header"].get("nickname") or a["header"].get("strain") or a["plant_id"]).replace(":", "_").replace(" ", "-")
    stamp = time.strftime("%Y%m%d", time.localtime(a["archived_at"]))
    base = f"dsc-grow-record-{label}-{stamp}"
    if fmt == "json":
        return f"{base}.json", "application/json", json.dumps(a, indent=2, default=str).encode("utf-8")
    if fmt == "csv":
        return f"{base}.csv", "text/csv; charset=utf-8", _to_csv(a["entries"]).encode("utf-8")
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("grow-record.json", json.dumps(a, indent=2, default=str))
        z.writestr("plant-journal.csv", _to_csv(a["entries"]))
        z.writestr("tent-journal.csv", _to_csv(a["tent_entries"]))
        z.writestr("header.json", json.dumps(a["header"], indent=2, default=str))
        # The grow record is visual as well as numeric — a retired plant's photos travel
        # with it, otherwise the archive outlives the images and the record is half a story.
        try:
            from .journal_media import list_media, read_media

            by_entry = list_media("plant", [int(e["id"]) for e in a["entries"] if e.get("id")], db_path=db_path)
            for entry_id, items in by_entry.items():
                for item in items:
                    found = read_media(int(item["id"]), db_path=db_path)
                    if not found:
                        continue
                    path, _ctype = found
                    z.write(path, arcname=f"media/{entry_id}/{path.name}")
        except Exception as exc:  # noqa: BLE001 — a missing photo must not void the record
            _logger.debug("archive media skipped: %s", exc)
    return f"{base}.zip", "application/zip", buf.getvalue()


def archive_roster_slot(slot: dict[str, Any], *, reason: str = "retired", db_path: Path | None = None) -> dict[str, Any] | None:
    """Archive the plant in a roster slot before it is cleared. Never raises."""
    try:
        pid = str(slot.get("plant_uuid") or "").strip()
        if not pid:
            return None
        sprout = str(slot.get("sprout") or "")
        since_ts: float | None = None
        if sprout:
            try:
                since_ts = time.mktime(time.strptime(sprout[:10], "%Y-%m-%d"))
            except ValueError:
                since_ts = None
        tent = str(slot.get("tent") or "") or None
        header = {
            "nickname": slot.get("nickname") or "",
            "strain": slot.get("strain") or "",
            "sprout_date": sprout,
            "tent": tent,
            "pot": slot.get("pot") or "",
            "slot": slot.get("slot"),
            "notes": slot.get("notes") or "",
        }
        return archive_plant(pid, reason=reason, header=header, tent_id=tent, since_ts=since_ts, db_path=db_path)
    except Exception as exc:  # noqa: BLE001 — archiving must never block a retire
        _logger.warning("plant archive on %s failed: %s", reason, exc)
        return None
