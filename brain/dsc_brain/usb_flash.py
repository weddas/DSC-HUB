"""USB kit flash jobs — baked binaries + host esptool (not docker ESPHome OTA)."""

from __future__ import annotations

import json
import subprocess
import threading
import time
import uuid
from pathlib import Path
from typing import Any

from .paths import REPO_ROOT
from .settings import connect
from .db import ensure_schema

try:
    from serial.tools import list_ports as _serial_list_ports
except ImportError:  # optional on Windows CI without pyserial
    _serial_list_ports = None

JOB_SCHEMA = """
CREATE TABLE IF NOT EXISTS usb_flash_jobs (
  job_id TEXT PRIMARY KEY,
  role TEXT NOT NULL,
  port TEXT NOT NULL,
  status TEXT NOT NULL,
  detail TEXT NOT NULL DEFAULT '',
  created_at REAL NOT NULL,
  updated_at REAL NOT NULL
);
"""

# Kit default order (pot3/4 not kit defaults). `bridge` (WT32-ETH01) is retired from the
# bake — bake-firmware.sh excludes it — so it is no longer offered: a role whose binary is
# never produced only ever ends in "Missing firmware binary".
KIT_ROLES: tuple[str, ...] = (
    "hub",
    "control",
    "pot1",
    "pot2",
    "heater",
    "heatmat",
    "humidifier",
    "dehumidifier",
)

_DEFAULT_MANIFEST: dict[str, dict[str, Any]] = {
    "hub": {
        "binary": "hub.bin",
        "chip": "esp32",
        "offset": "0x0",
        "boot_mode_note": "Hold BOOT if auto-reset fails.",
    },
    "control": {
        "binary": "control.bin",
        "chip": "esp32",
        "offset": "0x0",
        "boot_mode_note": "Hold BOOT if auto-reset fails.",
    },
    "pot1": {
        "binary": "pot1.bin",
        "chip": "esp32",
        "offset": "0x0",
        "boot_mode_note": "Hold BOOT if auto-reset fails.",
    },
    "pot2": {
        "binary": "pot2.bin",
        "chip": "esp32",
        "offset": "0x0",
        "boot_mode_note": "Hold BOOT if auto-reset fails.",
    },
    "heater": {
        "binary": "heater.bin",
        "chip": "esp8266",
        "offset": "0x0",
        "boot_mode_note": "Sonoff: open case, hold button for serial bootloader before flash.",
    },
    "heatmat": {
        "binary": "heatmat.bin",
        "chip": "esp8266",
        "offset": "0x0",
        "boot_mode_note": "Sonoff: open case, hold button for serial bootloader before flash.",
    },
    "humidifier": {
        "binary": "humidifier.bin",
        "chip": "esp8266",
        "offset": "0x0",
        "boot_mode_note": "Sonoff: open case, hold button for serial bootloader before flash.",
    },
    "dehumidifier": {
        "binary": "dehumidifier.bin",
        "chip": "esp8266",
        "offset": "0x0",
        "boot_mode_note": "Sonoff: open case, hold button for serial bootloader before flash.",
    },
}

_worker_lock = threading.Lock()
_worker_thread: threading.Thread | None = None


IMAGE_FIRMWARE_DIR = Path("/opt/dsc-hub/firmware/kit")


def firmware_dir() -> Path:
    """Where kit binaries are expected. A pure read: the old fallback ran mkdir() and then
    reported the empty directory it had just created as authoritative."""
    if IMAGE_FIRMWARE_DIR.is_dir():
        return IMAGE_FIRMWARE_DIR
    return REPO_ROOT / "services" / "dsc-hub" / "firmware" / "kit"


# ESP flash images start with the 0xE9 image header. ESP8266 and the RISC-V/S3 parts put it
# at offset 0; classic ESP32 merged images pad the first 0x1000 bytes and the bootloader's
# header sits at 0x1000. Accept either — reject anything that has neither.
_ESP_IMAGE_MAGIC = 0xE9
_ESP32_BOOTLOADER_OFFSET = 0x1000


def binary_status(path: Path, chip: str = "esp32") -> dict[str, Any]:
    """exists / size / sha256 / mtime / valid / reason for one kit binary — what the manifest
    used to omit, which is why nine 0-byte images shipped in 8.0.0 undetected."""
    out: dict[str, Any] = {"path": str(path), "exists": False, "size": 0, "sha256": None, "mtime": None, "valid": False, "reason": "missing"}
    try:
        st = path.stat()
    except OSError:
        return out
    if not path.is_file():
        return out
    out["exists"] = True
    out["size"] = int(st.st_size)
    out["mtime"] = float(st.st_mtime)
    if st.st_size == 0:
        out["reason"] = "zero-byte file"
        return out
    try:
        import hashlib

        h = hashlib.sha256()
        with path.open("rb") as fh:
            head = fh.read(_ESP32_BOOTLOADER_OFFSET + 16)
            h.update(head)
            for chunk in iter(lambda: fh.read(1 << 20), b""):
                h.update(chunk)
        out["sha256"] = h.hexdigest()
    except OSError as exc:
        out["reason"] = f"unreadable: {exc}"
        return out
    magic_at_0 = len(head) > 0 and head[0] == _ESP_IMAGE_MAGIC
    magic_at_boot = len(head) > _ESP32_BOOTLOADER_OFFSET and head[_ESP32_BOOTLOADER_OFFSET] == _ESP_IMAGE_MAGIC
    if not (magic_at_0 or (chip.startswith("esp32") and magic_at_boot)):
        out["reason"] = "not an ESP image (no 0xE9 header at 0x0 or 0x1000)"
        return out
    out["valid"] = True
    out["reason"] = ""
    return out


# Serial devices that must never be offered as a flash target. /dev/ttyUSB0 on the Pi is the
# SkyConnect Zigbee coordinator; writing ESP firmware to it destroys the Zigbee network.
COORDINATOR_PATTERNS: tuple[str, ...] = (
    "skyconnect",
    "nabu_casa",
    "nabu casa",
    "zigbee",
    "zbdongle",
    "conbee",
    "sonoff_zigbee",
    "zb-gw",
    "cc2652",
    "ezsp",
)


def coordinator_reason(*names: str) -> str | None:
    blob = " ".join(n for n in names if n).lower()
    for pat in COORDINATOR_PATTERNS:
        if pat in blob:
            return f"Zigbee coordinator ({pat}) — never a flash target"
    try:
        from .settings import get_setting

        pinned = (get_setting("zigbee_serial_port", "") or "").strip()
    except Exception:  # noqa: BLE001
        pinned = ""
    if pinned and any(pinned == n for n in names if n):
        return "Zigbee coordinator (zigbee_serial_port setting) — never a flash target"
    return None


def load_manifest() -> dict[str, Any]:
    path = firmware_dir().parent / "kit-manifest.json"
    alt = REPO_ROOT / "services" / "dsc-hub" / "firmware" / "kit-manifest.json"
    for candidate in (path, alt):
        if candidate.is_file():
            data = json.loads(candidate.read_text(encoding="utf-8"))
            roles = data.get("roles") if isinstance(data, dict) else None
            if isinstance(roles, dict):
                return roles
    return dict(_DEFAULT_MANIFEST)


def list_serial_ports() -> list[dict[str, Any]]:
    """Enumerate serial ports; prefer /dev/serial/by-id when present."""
    ports: list[dict[str, Any]] = []
    by_id = Path("/dev/serial/by-id")
    if by_id.is_dir():
        for link in sorted(by_id.iterdir()):
            try:
                target = link.resolve()
            except OSError:
                continue
            reason = coordinator_reason(str(link), str(target))
            ports.append(
                {
                    "device": str(target),
                    "by_id": str(link),
                    "vid_pid": "",
                    "chip_hint": link.name,
                    "flashable": reason is None,
                    "note": reason or "",
                }
            )
        if ports:
            return ports
    try:
        if _serial_list_ports is None:
            return ports
        for info in _serial_list_ports.comports():
            reason = coordinator_reason(info.device, info.description or "", getattr(info, "manufacturer", "") or "")
            ports.append(
                {
                    "device": info.device,
                    "by_id": info.device,
                    "vid_pid": f"{info.vid or ''}:{info.pid or ''}",
                    "chip_hint": info.description or "",
                    "flashable": reason is None,
                    "note": reason or "",
                }
            )
    except Exception:  # noqa: BLE001
        pass
    return ports


def flash_targets() -> dict[str, list[dict[str, Any]]]:
    """Ports split into the ones a flash may target and the ones it never may."""
    allp = list_serial_ports()
    return {
        "ports": [p for p in allp if p.get("flashable", True)],
        "excluded": [p for p in allp if not p.get("flashable", True)],
    }


def refuse_if_coordinator(port: str) -> None:
    """Raise before a job is even queued when `port` is (or resolves to) the Zigbee radio."""
    names = [port]
    for p in list_serial_ports():
        if port in (p.get("device"), p.get("by_id")):
            names += [str(p.get("by_id") or ""), str(p.get("device") or ""), str(p.get("chip_hint") or "")]
            if not p.get("flashable", True):
                raise ValueError(f"refusing to flash {port}: {p.get('note') or 'excluded port'}")
    reason = coordinator_reason(*names)
    if reason:
        raise ValueError(f"refusing to flash {port}: {reason}")


def _ensure(conn) -> None:
    ensure_schema(conn, "usb_flash", JOB_SCHEMA)


def _update(job_id: str, status: str, detail: str, db_path: Path | None = None) -> None:
    conn = connect(db_path)
    _ensure(conn)
    conn.execute(
        "UPDATE usb_flash_jobs SET status=?, detail=?, updated_at=? WHERE job_id=?",
        (status, detail[:4000], time.time(), job_id),
    )
    conn.commit()
    conn.close()


def _running_job(db_path: Path | None = None) -> str | None:
    conn = connect(db_path)
    _ensure(conn)
    row = conn.execute(
        "SELECT job_id FROM usb_flash_jobs WHERE status IN ('queued','running') LIMIT 1"
    ).fetchone()
    conn.close()
    return str(row["job_id"]) if row else None


def _esptool_cmd(role: str, port: str, manifest: dict[str, Any]) -> list[str]:
    meta = manifest[role]
    binary = firmware_dir() / str(meta["binary"])
    chip = str(meta.get("chip") or "esp32")
    offset = str(meta.get("offset") or "0x0")
    return [
        "esptool.py",
        "--chip",
        chip,
        "--port",
        port,
        "write_flash",
        offset,
        str(binary),
    ]


def _run_job(job_id: str, role: str, port: str, db_path: Path | None = None) -> None:
    manifest = load_manifest()
    meta = manifest.get(role) or {}
    binary = firmware_dir() / str(meta.get("binary") or "")
    _update(job_id, "running", f"Flashing {role} on {port}…", db_path)
    if not binary.is_file():
        _update(
            job_id,
            "failed",
            f"Missing firmware binary for {role}: {binary}. Bake kit binaries into the image.",
            db_path,
        )
        return
    status = binary_status(binary, str(meta.get("chip") or "esp32"))
    if not status["valid"]:
        # "Never green on fail": a 0-byte or non-ESP file used to go straight to esptool.
        _update(job_id, "failed", f"Refusing to flash {role}: {binary.name} is {status['reason']} ({status['size']} bytes).", db_path)
        return
    try:
        refuse_if_coordinator(port)
    except ValueError as exc:
        _update(job_id, "failed", str(exc), db_path)
        return
    chip = str(meta.get("chip") or "esp32")
    try:
        # Positive handshake first: the chip must identify itself on this port before a
        # single byte is written. A wrong port, a device not in bootloader mode, or a
        # radio that is not an ESP all fail here, not half-way through a write.
        probe = subprocess.run(
            ["esptool.py", "--chip", chip, "--port", port, "chip_id"],
            capture_output=True,
            text=True,
            timeout=90,
            check=False,
        )
        if probe.returncode != 0:
            tail = ((probe.stdout or "") + "\n" + (probe.stderr or "")).strip()[-1500:]
            note = str(meta.get("boot_mode_note") or "")
            _update(job_id, "failed", f"No {chip} answered on {port} — not flashing.\n{tail}\n{note}".strip(), db_path)
            return
    except FileNotFoundError:
        _update(job_id, "failed", "esptool.py not found on PATH — install esptool on the Pi host", db_path)
        return
    except Exception as exc:  # noqa: BLE001
        _update(job_id, "failed", f"chip probe failed: {str(exc)[:1500]}", db_path)
        return
    cmd = _esptool_cmd(role, port, manifest)
    try:
        proc = subprocess.run(cmd, capture_output=True, text=True, timeout=600, check=False)
        tail = ((proc.stdout or "") + "\n" + (proc.stderr or "")).strip()[-2000:]
        if proc.returncode == 0:
            _update(job_id, "done", tail or f"{role} flash completed", db_path)
        else:
            note = str(meta.get("boot_mode_note") or "")
            detail = tail or f"esptool exit {proc.returncode}"
            if note:
                detail = f"{detail}\n{note}"
            _update(job_id, "failed", detail, db_path)
    except FileNotFoundError:
        _update(job_id, "failed", "esptool.py not found on PATH — install esptool on the Pi host", db_path)
    except Exception as exc:  # noqa: BLE001
        _update(job_id, "failed", str(exc)[:2000], db_path)


def _worker_loop(db_path: Path | None = None) -> None:
    while True:
        conn = connect(db_path)
        _ensure(conn)
        row = conn.execute(
            "SELECT job_id, role, port FROM usb_flash_jobs WHERE status='queued' ORDER BY created_at ASC LIMIT 1"
        ).fetchone()
        conn.close()
        if not row:
            break
        _run_job(str(row["job_id"]), str(row["role"]), str(row["port"]), db_path)


def _ensure_worker(db_path: Path | None = None) -> None:
    global _worker_thread
    with _worker_lock:
        if _worker_thread and _worker_thread.is_alive():
            return
        _worker_thread = threading.Thread(target=_worker_loop, args=(db_path,), daemon=True)
        _worker_thread.start()


def queue_usb_flash(role: str, port: str, db_path: Path | None = None) -> dict[str, Any]:
    role = (role or "").strip()
    port = (port or "").strip()
    if role not in KIT_ROLES:
        raise ValueError(f"unknown role {role!r}; expected one of {KIT_ROLES}")
    if not port:
        raise ValueError("port is required")
    refuse_if_coordinator(port)
    manifest = load_manifest()
    if role not in manifest:
        raise ValueError(f"role {role!r} missing from kit manifest")
    running = _running_job(db_path)
    if running:
        raise RuntimeError(f"usb flash job already in progress: {running}")
    job_id = str(uuid.uuid4())
    now = time.time()
    conn = connect(db_path)
    _ensure(conn)
    conn.execute(
        """
        INSERT INTO usb_flash_jobs(job_id, role, port, status, detail, created_at, updated_at)
        VALUES(?,?,?,?,?,?,?)
        """,
        (job_id, role, port, "queued", "queued", now, now),
    )
    conn.commit()
    conn.close()
    _ensure_worker(db_path)
    return get_usb_flash_job(job_id, db_path) or {"job_id": job_id, "status": "queued"}


def get_usb_flash_job(job_id: str, db_path: Path | None = None) -> dict[str, Any] | None:
    conn = connect(db_path)
    _ensure(conn)
    row = conn.execute(
        "SELECT job_id, role, port, status, detail, created_at, updated_at FROM usb_flash_jobs WHERE job_id=?",
        (job_id,),
    ).fetchone()
    conn.close()
    if not row:
        return None
    return dict(row)


def list_usb_flash_jobs(limit: int = 20, db_path: Path | None = None) -> list[dict[str, Any]]:
    conn = connect(db_path)
    _ensure(conn)
    rows = conn.execute(
        """
        SELECT job_id, role, port, status, detail, created_at, updated_at
        FROM usb_flash_jobs ORDER BY created_at DESC LIMIT ?
        """,
        (max(1, min(int(limit), 100)),),
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def manifest_public() -> dict[str, Any]:
    """The role table plus what is actually on disk for each role — the manifest used to be a
    static list that named nine binaries whether the directory held good images, empty
    images, or nothing at all."""
    roles = load_manifest()
    fw_dir = firmware_dir()
    out_roles: dict[str, dict[str, Any]] = {}
    for k, v in roles.items():
        if k not in KIT_ROLES:
            continue
        chip = str(v.get("chip") or "esp32")
        status = binary_status(fw_dir / str(v.get("binary") or ""), chip)
        out_roles[k] = {
            "binary": v.get("binary"),
            "chip": chip,
            "boot_mode_note": v.get("boot_mode_note", ""),
            "exists": status["exists"],
            "size": status["size"],
            "sha256": status["sha256"],
            "mtime": status["mtime"],
            "valid": status["valid"],
            "reason": status["reason"],
        }
    return {
        "kit_roles": list(KIT_ROLES),
        "roles": out_roles,
        "available_roles": [k for k, v in out_roles.items() if v["valid"]],
        "firmware_dir": str(fw_dir),
        "firmware_dir_exists": fw_dir.is_dir(),
    }
