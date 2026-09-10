"""Where media is saved, and moving it to a drive you can carry away.

Two jobs the operator asked for (2026-09-10):

* **Choose the save location** — the OS drive, an SD card, a USB stick. One root covers
  *all* media (camera frames, timelapses, journal photos), so there is one place to look and
  one thing to back up.
* **Copy or Move existing recordings onto an external drive** — insert a drive, pick it,
  and the whole media folder is transferred.

Two rules run through this module.

**Only ever offer a location the brain can actually write.** The brain runs in a container;
a drive mounted on the host is invisible here unless it was bind-mounted in. Listing a path
we cannot write would produce a picker full of choices that fail on use, so a candidate that
fails its write probe is returned *with the reason* rather than silently dropped — "why
isn't my stick here" needs an answer on screen.

**A Move never deletes anything it has not verified it copied.** Move is copy, then compare
sizes, then delete — never `os.rename` across devices, and never a delete on faith. A
half-moved grow log is worse than a move that failed cleanly.
"""

from __future__ import annotations

import os
import shutil
import threading
import time
import uuid
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

from .paths import default_media_root, media_root
from .settings import get_setting, set_setting

SETTING_MEDIA_ROOT = "media_root"

# Where a removable drive shows up once something mounts it. The brain sees these only if
# compose bind-mounted them in; that is deliberate, see the module docstring.
EXTERNAL_MOUNT_ROOTS = ("/media", "/mnt", "/run/media")

# Pseudo-filesystems that are never somewhere to keep a grow log.
_SKIP_FSTYPES = {
    "proc", "sysfs", "devtmpfs", "devpts", "cgroup", "cgroup2", "securityfs",
    "debugfs", "tracefs", "fusectl", "configfs", "pstore", "bpf", "mqueue",
    "hugetlbfs", "squashfs", "overlay", "tmpfs", "ramfs", "autofs", "binfmt_misc",
    "nsfs", "efivarfs",
}


# ---------------------------------------------------------------------------------------
# locations
# ---------------------------------------------------------------------------------------


def _fs_for(path: Path) -> str:
    """The filesystem type at a path, best effort. Empty when it cannot be determined."""
    try:
        with open("/proc/mounts", encoding="utf-8", errors="replace") as fh:
            mounts = [ln.split() for ln in fh if len(ln.split()) >= 3]
    except OSError:
        return ""
    best = ""
    best_len = -1
    target = str(path.resolve())
    for parts in mounts:
        mount_point, fstype = parts[1], parts[2]
        if (target == mount_point or target.startswith(mount_point.rstrip("/") + "/")) and len(mount_point) > best_len:
            best, best_len = fstype, len(mount_point)
    return best


def _is_removable(path: Path) -> bool:
    """True when the path sits on a mount root that only ever holds removable media.

    Deliberately shallow: mapping a path back to a block device and reading
    /sys/block/<dev>/removable is not possible from inside the container, where the device
    tree is not mapped. Being wrong here only mislabels a chip in the UI.
    """
    target = str(path.resolve())
    return any(target == r or target.startswith(r.rstrip("/") + "/") for r in EXTERNAL_MOUNT_ROOTS)


def _probe_writable(path: Path) -> str:
    """"" if the brain can write here, else the reason it cannot.

    An actual write, not an `os.access` check: a read-only bind mount, a full disk and a
    FAT32 stick with a stale lock all pass access() and fail on use.
    """
    try:
        path.mkdir(parents=True, exist_ok=True)
    except OSError as exc:
        return f"cannot create the folder ({exc.strerror or exc})"
    probe = path / f".dsc-write-test-{os.getpid()}"
    try:
        probe.write_bytes(b"dsc")
        probe.unlink()
    except OSError as exc:
        return f"not writable ({exc.strerror or exc})"
    return ""


def describe_location(path: Path, *, current: Path | None = None) -> dict[str, Any]:
    resolved = Path(path)
    try:
        usage = shutil.disk_usage(resolved if resolved.exists() else resolved.parent)
        total, free = usage.total, usage.free
    except OSError:
        total, free = 0, 0
    return {
        "path": str(resolved),
        "label": resolved.name or str(resolved),
        "fstype": _fs_for(resolved),
        "removable": _is_removable(resolved),
        "total_bytes": total,
        "free_bytes": free,
        "is_current": current is not None and str(resolved) == str(current),
        "writable": False,
        "reason": "",
    }


def list_locations(db_path: Path | None = None) -> dict[str, Any]:
    """Every place the brain could save media, each with whether it can actually write there."""
    current = media_root()
    seen: dict[str, dict[str, Any]] = {}

    def _add(p: Path) -> None:
        entry = describe_location(p, current=current)
        if entry["path"] in seen:
            return
        reason = _probe_writable(Path(entry["path"]))
        entry["writable"] = not reason
        entry["reason"] = reason
        seen[entry["path"]] = entry

    _add(default_media_root())
    if str(current) != str(default_media_root()):
        _add(current)
    for root in EXTERNAL_MOUNT_ROOTS:
        base = Path(root)
        if not base.is_dir():
            continue
        for child in sorted(base.iterdir()):
            if child.is_dir():
                _add(child / "dsc-hub-media")
    return {
        "current": str(current),
        "default": str(default_media_root()),
        "locations": list(seen.values()),
        # The picker needs to distinguish "no drive plugged in" from "we cannot see drives
        # at all", because the fix is different: insert one, versus bind-mount /media.
        "external_visible": any(Path(r).is_dir() for r in EXTERNAL_MOUNT_ROOTS),
    }


def set_media_root(path: str, db_path: Path | None = None) -> dict[str, Any]:
    """Point media at another location. Existing media is NOT moved — use a transfer for that.

    Recording continues immediately at the new root, so this is safe to do at any time; the
    old root keeps whatever is already there until it is explicitly moved or deleted.
    """
    target = str(path or "").strip()
    if not target:
        set_setting(SETTING_MEDIA_ROOT, "", db_path)
        return {"media_root": str(media_root()), "reset": True}
    resolved = Path(target)
    reason = _probe_writable(resolved)
    if reason:
        raise ValueError(f"{resolved}: {reason}")
    set_setting(SETTING_MEDIA_ROOT, str(resolved), db_path)
    return {"media_root": str(resolved), "reset": False}


# ---------------------------------------------------------------------------------------
# transfers
# ---------------------------------------------------------------------------------------


@dataclass
class Transfer:
    job_id: str
    mode: str
    source: str
    dest: str
    state: str = "running"  # running | done | failed | cancelled
    files_total: int = 0
    files_done: int = 0
    bytes_total: int = 0
    bytes_done: int = 0
    current: str = ""
    error: str = ""
    started_at: float = field(default_factory=time.time)
    finished_at: float | None = None
    deleted: int = 0

    def public(self) -> dict[str, Any]:
        return {
            "job_id": self.job_id,
            "mode": self.mode,
            "source": self.source,
            "dest": self.dest,
            "state": self.state,
            "files_total": self.files_total,
            "files_done": self.files_done,
            "bytes_total": self.bytes_total,
            "bytes_done": self.bytes_done,
            "current": self.current,
            "error": self.error,
            "started_at": self.started_at,
            "finished_at": self.finished_at,
            "deleted": self.deleted,
        }


_TRANSFERS: dict[str, Transfer] = {}
_TRANSFER_LOCK = threading.Lock()
_CANCEL: set[str] = set()


def get_transfer(job_id: str) -> dict[str, Any] | None:
    with _TRANSFER_LOCK:
        job = _TRANSFERS.get(job_id)
        return job.public() if job else None


def list_transfers() -> list[dict[str, Any]]:
    with _TRANSFER_LOCK:
        return [j.public() for j in sorted(_TRANSFERS.values(), key=lambda j: j.started_at, reverse=True)]


def cancel_transfer(job_id: str) -> bool:
    with _TRANSFER_LOCK:
        if job_id not in _TRANSFERS or _TRANSFERS[job_id].state != "running":
            return False
        _CANCEL.add(job_id)
        return True


def _walk(source: Path) -> tuple[list[Path], int]:
    files: list[Path] = []
    total = 0
    for p in source.rglob("*"):
        if p.is_file() and not p.is_symlink():
            files.append(p)
            try:
                total += p.stat().st_size
            except OSError:
                pass
    return files, total


def run_transfer(job: Transfer) -> None:
    """Copy every file, then — only for a move — delete the ones that verifiably arrived.

    The two phases are deliberately separate. Deleting as we go would mean a failure halfway
    leaves the recordings split across two drives with no single complete copy; this way the
    source stays whole until the entire copy has been checked.
    """
    source = Path(job.source)
    dest = Path(job.dest)
    try:
        if not source.is_dir():
            raise OSError(f"{source} does not exist")
        files, total = _walk(source)
        with _TRANSFER_LOCK:
            job.files_total = len(files)
            job.bytes_total = total
        free = shutil.disk_usage(dest if dest.exists() else dest.parent).free
        if total > free:
            raise OSError(
                f"needs {total / 1024**3:.1f} GB, the destination has {free / 1024**3:.1f} GB free"
            )

        copied: list[tuple[Path, Path]] = []
        for src_file in files:
            if job.job_id in _CANCEL:
                with _TRANSFER_LOCK:
                    job.state = "cancelled"
                    job.finished_at = time.time()
                return
            rel = src_file.relative_to(source)
            out = dest / rel
            out.parent.mkdir(parents=True, exist_ok=True)
            with _TRANSFER_LOCK:
                job.current = str(rel)
            shutil.copy2(src_file, out)
            copied.append((src_file, out))
            with _TRANSFER_LOCK:
                job.files_done += 1
                try:
                    job.bytes_done += out.stat().st_size
                except OSError:
                    pass

        if job.mode == "move":
            removed = 0
            for src_file, out in copied:
                try:
                    # Size equality is the check. A full hash of tens of GB would double the
                    # IO of every move; a truncated copy — the realistic failure on a stick
                    # pulled early or a full disk — changes the size.
                    if out.is_file() and out.stat().st_size == src_file.stat().st_size:
                        src_file.unlink()
                        removed += 1
                except OSError:
                    continue
            with _TRANSFER_LOCK:
                job.deleted = removed
            # Prune directories the move emptied, but never the media root itself.
            for d in sorted((p for p in source.rglob("*") if p.is_dir()), key=lambda p: len(p.parts), reverse=True):
                try:
                    d.rmdir()
                except OSError:
                    pass
        with _TRANSFER_LOCK:
            job.state = "done"
            job.current = ""
            job.finished_at = time.time()
    except Exception as exc:  # noqa: BLE001 — the reason belongs on screen, whatever it is
        with _TRANSFER_LOCK:
            job.state = "failed"
            job.error = str(exc)
            job.finished_at = time.time()
    finally:
        _CANCEL.discard(job.job_id)


def start_transfer(dest: str, mode: str = "copy", *, source: str | None = None) -> dict[str, Any]:
    """Begin a copy/move of the media folder. Returns immediately with a job id."""
    if mode not in ("copy", "move"):
        raise ValueError("mode must be copy or move")
    src = Path(source) if source else media_root()
    target = Path(str(dest or "").strip())
    if not str(target):
        raise ValueError("a destination is required")
    if not src.is_dir():
        raise ValueError(f"nothing to transfer: {src} does not exist")
    reason = _probe_writable(target)
    if reason:
        raise ValueError(f"{target}: {reason}")
    resolved_src, resolved_dst = src.resolve(), target.resolve()
    if resolved_dst == resolved_src:
        raise ValueError("the destination is the current media folder")
    if str(resolved_dst).startswith(str(resolved_src).rstrip("/") + os.sep):
        # Copying a folder into itself walks its own output forever.
        raise ValueError("the destination is inside the media folder")

    job = Transfer(job_id=uuid.uuid4().hex[:12], mode=mode, source=str(src), dest=str(target))
    with _TRANSFER_LOCK:
        _TRANSFERS[job.job_id] = job
        for old in [j for j in _TRANSFERS.values() if j.state != "running"][:-20]:
            _TRANSFERS.pop(old.job_id, None)
    threading.Thread(target=run_transfer, args=(job,), name=f"dsc-transfer-{job.job_id}", daemon=True).start()
    return job.public()
