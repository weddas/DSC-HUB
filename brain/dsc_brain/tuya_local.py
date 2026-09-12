"""Tuya (SmartLife) Wi-Fi devices over the LAN protocol — the second local device lane.

Sibling of ``zigbee_mqtt``: one worker thread per enabled device holds a persistent
socket to the unit (tinytuya, TCP 6668), pushed DPS updates are normalised through
the device's archetype map into the same datapoint rows the Zigbee lane produces,
and bound rows feed the shared role buckets (``zigbee_by_role``) so Climate,
Overview, the rule engine and recipes see one set of bound roles regardless of
radio (plan-tuya-local § 2.2).

Honesty vocabulary on every row:

* ``link``: ``live`` (a DPS report within LIVE_S) · ``stale`` (older) · ``offline``
  (socket down / unreachable) · ``key_changed`` (payload will not decrypt — re-import)
* ``write_state``: ``pending`` (commanded, echo not yet seen) · ``synced`` · ``differs``
  (the device reports something other than what was commanded — someone toggled it
  in the app) · ``failed``

The brain never contacts Tuya's cloud. Keys come from the operator's one-time
``tinytuya wizard`` run and never leave the Pi (masked in every GET).
"""

from __future__ import annotations

import json
import logging
import queue
import re
import threading
import time
from typing import Any, Callable

from .device_bindings import normalize_binding, role_conflicts
from .fleet_state import FleetState, get_fleet_state, update_fleet_state
from .fleet_state import fleet_state_lock
from .settings import get_setting, set_setting
from .tuya_catalog import (
    default_dps_map,
    default_scales,
    guess_type_from_dps,
    tuya_device_type,
)

_logger = logging.getLogger(__name__)

try:
    import tinytuya
except ImportError:  # pragma: no cover
    tinytuya = None  # type: ignore[assignment]

SETTING_DEVICES = "tuya_devices"
SETTING_BINDINGS = "tuya_device_bindings"

LIVE_S = 30.0
OFFLINE_S = 60.0
SOCKET_TIMEOUT_S = 2.0
HEARTBEAT_S = 9.0
FULL_STATUS_S = 30.0
BACKOFF_MIN_S = 5.0
BACKOFF_MAX_S = 60.0
_ERR_BAD_KEY = frozenset({"904", "914"})
_ERR_UNREACHABLE = frozenset({"901", "902", "905"})

_ID_RE = re.compile(r"^[A-Za-z0-9_\-]{6,64}$")
_VERSIONS = ("3.1", "3.2", "3.3", "3.4", "3.5")
_IP_RE = re.compile(r"^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$")

# Injectable device constructor — tests hand in a fake with the tinytuya surface.
_make_device: Callable[[dict[str, Any]], Any] | None = None


def _device_for(row: dict[str, Any]) -> Any:
    if _make_device is not None:
        return _make_device(row)
    if tinytuya is None:
        raise RuntimeError("tinytuya not installed")
    dev = tinytuya.Device(
        str(row["id"]),
        str(row["ip"]),
        str(row["local_key"]),
        version=float(row.get("version") or "3.3"),
    )
    return dev


# ---------------------------------------------------------------------------
# Device store (brain KV JSON, keyed by Tuya device id)
# ---------------------------------------------------------------------------


def _norm_dps_map(raw: Any, type_id: str) -> dict[str, int]:
    out = default_dps_map(type_id)
    if isinstance(raw, dict):
        custom: dict[str, int] = {}
        for k, v in raw.items():
            key = str(k or "").strip().lower()
            if not key:
                continue
            try:
                custom[key] = int(v)
            except (TypeError, ValueError):
                continue
        if custom:
            out = custom
    return out


def _norm_scales(raw: Any, type_id: str) -> dict[str, float]:
    out = default_scales(type_id)
    if isinstance(raw, dict):
        for k, v in raw.items():
            key = str(k or "").strip().lower()
            if not key:
                continue
            try:
                out[key] = float(v)
            except (TypeError, ValueError):
                continue
    return out


def _normalize_device(device_id: str, row: Any, *, strict: bool) -> dict[str, Any] | None:
    if not isinstance(row, dict):
        return None
    did = str(device_id or "").strip()
    if not _ID_RE.match(did):
        if strict:
            raise ValueError(f"invalid device id: {device_id!r}")
        return None
    type_id = str(row.get("type") or "").strip()
    if type_id and tuya_device_type(type_id) is None:
        if strict:
            raise ValueError(f"unknown device type: {type_id}")
        type_id = ""
    version = str(row.get("version") or "3.3").strip()
    if version not in _VERSIONS:
        if strict:
            raise ValueError(f"unsupported protocol version: {version}")
        version = "3.3"
    ip = str(row.get("ip") or "").strip()
    if ip and not _IP_RE.match(ip):
        if strict:
            raise ValueError(f"ip must be a dotted IPv4 address, got {ip!r}")
        ip = ""
    return {
        "id": did,
        "name": str(row.get("name") or did).strip() or did,
        "ip": ip,
        "local_key": str(row.get("local_key") or ""),
        "version": version,
        "type": type_id,
        "dps_map": _norm_dps_map(row.get("dps_map"), type_id) if type_id else {},
        "scales": _norm_scales(row.get("scales"), type_id) if type_id else {},
        "enabled": bool(row.get("enabled", True)),
        "added_at": float(row.get("added_at") or time.time()),
        "product_name": str(row.get("product_name") or ""),
        "mac": str(row.get("mac") or ""),
    }


def load_tuya_devices() -> dict[str, dict[str, Any]]:
    raw = get_setting(SETTING_DEVICES, "")
    out: dict[str, dict[str, Any]] = {}
    if not raw:
        return out
    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        return out
    if not isinstance(parsed, dict):
        return out
    for did, row in parsed.items():
        norm = _normalize_device(str(did), row, strict=False)
        if norm:
            out[norm["id"]] = norm
    return out


def _save_devices(devices: dict[str, dict[str, Any]]) -> None:
    set_setting(SETTING_DEVICES, json.dumps(devices))
    _lane.sync_workers()


def public_device(row: dict[str, Any]) -> dict[str, Any]:
    """API shape — the local key never leaves the Pi."""
    out = {k: v for k, v in row.items() if k != "local_key"}
    out["local_key_set"] = bool(row.get("local_key"))
    return out


def import_devices_json(entries: Any) -> dict[str, Any]:
    """Upsert from a ``tinytuya wizard`` ``devices.json`` (list of {id, name, key, ip?, version?, …}).

    Never overwrites an existing device's type / dps map / bindings; only fills or
    refreshes name, key, ip, version. Reports entries that still lack an IP — the
    brain sits on a bridge network and cannot discover them (plan § Part 1).
    """
    if isinstance(entries, dict) and isinstance(entries.get("devices"), list):
        entries = entries["devices"]
    if not isinstance(entries, list):
        raise ValueError("expected the devices.json list (or {\"devices\": [...]})")
    devices = load_tuya_devices()
    imported: list[str] = []
    skipped: list[dict[str, str]] = []
    missing_ip: list[str] = []
    for item in entries:
        if not isinstance(item, dict):
            continue
        did = str(item.get("id") or item.get("dev_id") or item.get("uuid") or "").strip()
        key = str(item.get("key") or item.get("local_key") or "").strip()
        if not _ID_RE.match(did):
            skipped.append({"id": did or "?", "reason": "no usable id"})
            continue
        if not key:
            skipped.append({"id": did, "reason": "no local key in this entry"})
            continue
        prev = devices.get(did) or {}
        ip = str(item.get("ip") or prev.get("ip") or "").strip()
        version = str(item.get("version") or item.get("ver") or prev.get("version") or "3.3").strip()
        merged = {
            **prev,
            "name": str(item.get("name") or prev.get("name") or did).strip(),
            "ip": ip if _IP_RE.match(ip) else "",
            "local_key": key,
            "version": version if version in _VERSIONS else str(prev.get("version") or "3.3"),
            "type": str(prev.get("type") or ""),
            "dps_map": prev.get("dps_map") or {},
            "scales": prev.get("scales") or {},
            "enabled": bool(prev.get("enabled", True)),
            "added_at": prev.get("added_at") or time.time(),
            "product_name": str(item.get("product_name") or prev.get("product_name") or ""),
            "mac": str(item.get("mac") or prev.get("mac") or ""),
        }
        norm = _normalize_device(did, merged, strict=False)
        if norm is None:
            skipped.append({"id": did, "reason": "entry did not normalise"})
            continue
        devices[did] = norm
        imported.append(did)
        if not norm["ip"]:
            missing_ip.append(did)
    _save_devices(devices)
    return {
        "imported": imported,
        "skipped": skipped,
        "missing_ip": missing_ip,
        "count": len(devices),
        "devices": [public_device(devices[d]) for d in imported],
    }


def update_tuya_device(device_id: str, patch: dict[str, Any]) -> dict[str, Any]:
    devices = load_tuya_devices()
    prev = devices.get(str(device_id))
    if prev is None:
        raise KeyError(device_id)
    merged = dict(prev)
    for key in ("name", "ip", "version", "type", "enabled", "product_name"):
        if key in patch and patch[key] is not None:
            merged[key] = patch[key]
    if patch.get("local_key"):
        merged["local_key"] = str(patch["local_key"])
    type_changed = "type" in patch and str(patch["type"] or "") != str(prev.get("type") or "")
    if "dps_map" in patch and patch["dps_map"] is not None:
        merged["dps_map"] = patch["dps_map"]
    elif type_changed:
        merged["dps_map"] = {}
    if "scales" in patch and patch["scales"] is not None:
        merged["scales"] = patch["scales"]
    elif type_changed:
        merged["scales"] = {}
    norm = _normalize_device(str(device_id), merged, strict=True)
    assert norm is not None
    devices[norm["id"]] = norm
    _save_devices(devices)
    _lane.reapply_bindings()
    return public_device(norm)


def rules_referencing(device_id: str) -> list[str]:
    """Names of automation rules whose action targets this device."""
    try:
        from .automation_rules import load_automation_rules

        rules = load_automation_rules()
    except Exception:  # noqa: BLE001 - never block a delete on a rules-store hiccup
        return []
    out: list[str] = []
    for rule in rules:
        action = rule.get("action") if isinstance(rule, dict) else None
        if not isinstance(action, dict) or action.get("type") != "tuya_switch":
            continue
        params = action.get("params") if isinstance(action.get("params"), dict) else {}
        if str(params.get("device_id") or "") == str(device_id):
            out.append(str(rule.get("name") or rule.get("id") or "?"))
    return out


def delete_tuya_device(device_id: str) -> None:
    devices = load_tuya_devices()
    if str(device_id) not in devices:
        raise KeyError(device_id)
    refs = rules_referencing(device_id)
    if refs:
        raise ValueError(f"still targeted by rule(s): {', '.join(refs)} — change those rules first")
    devices.pop(str(device_id))
    _save_devices(devices)
    bindings = load_tuya_bindings()
    if str(device_id) in bindings:
        bindings.pop(str(device_id))
        set_setting(SETTING_BINDINGS, json.dumps(bindings))
    try:
        from .zigbee_policies import load_zigbee_policies, save_zigbee_policies

        policies = load_zigbee_policies()
        if str(device_id) in policies:
            policies.pop(str(device_id))
            save_zigbee_policies(policies)
    except Exception as exc:  # noqa: BLE001
        _logger.debug("tuya policy cleanup skipped: %s", exc)
    _lane.forget(str(device_id))
    _lane.reapply_bindings()


# ---------------------------------------------------------------------------
# Bindings (same shape and validators as the Zigbee lane)
# ---------------------------------------------------------------------------


def _valid_roles() -> frozenset[str]:
    from .zigbee_mqtt import _valid_roles as zigbee_valid_roles

    return zigbee_valid_roles()


def load_tuya_bindings() -> dict[str, dict[str, Any]]:
    raw = get_setting(SETTING_BINDINGS, "")
    out: dict[str, dict[str, Any]] = {}
    if not raw:
        return out
    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        return out
    if not isinstance(parsed, dict):
        return out
    valid = _valid_roles()
    for did, row in parsed.items():
        if not did:
            continue
        binding = normalize_binding(row, valid, strict=False)
        if binding is not None:
            out[str(did)] = binding
    return out


def save_tuya_bindings(bindings: Any) -> dict[str, dict[str, Any]]:
    if not isinstance(bindings, dict):
        raise ValueError("bindings must be an object keyed by device id")
    valid = _valid_roles()
    devices = load_tuya_devices()
    cleaned: dict[str, dict[str, Any]] = {}
    for did, row in bindings.items():
        if not did:
            continue
        binding = normalize_binding(row, valid, strict=True)
        if binding is None:
            continue
        if not binding.get("friendly_name"):
            binding["friendly_name"] = str((devices.get(str(did)) or {}).get("name") or did)
        cleaned[str(did)] = binding
    set_setting(SETTING_BINDINGS, json.dumps(cleaned))
    _lane.reapply_bindings()
    return cleaned


def tuya_role_conflicts() -> dict[str, list[str]]:
    """Cross-lane: a role claimed by more than one device, Zigbee or Tuya."""
    from .zigbee_mqtt import load_zigbee_bindings

    return role_conflicts(load_zigbee_bindings(), load_tuya_bindings())


# ---------------------------------------------------------------------------
# Normalisation
# ---------------------------------------------------------------------------


def normalize_dps(row: dict[str, Any], dps: dict[str, Any]) -> dict[str, Any]:
    """Raw DPS {"1": true, "19": 123} → datapoint keys through the device's map + scales."""
    out: dict[str, Any] = {}
    scales = row.get("scales") or {}
    for key, index in (row.get("dps_map") or {}).items():
        raw = dps.get(str(index))
        if raw is None:
            continue
        if isinstance(raw, bool):
            out[key] = raw
        elif isinstance(raw, (int, float)):
            scale = scales.get(key)
            value = float(raw) * float(scale) if scale not in (None, 0, 1, 1.0) else raw
            out[key] = round(float(value), 4) if isinstance(value, float) else value
        elif isinstance(raw, str):
            out[key] = raw
    return out


# ---------------------------------------------------------------------------
# Lane runtime
# ---------------------------------------------------------------------------


class _Worker(threading.Thread):
    """One persistent socket per device: pushed DPS in, queued writes out."""

    def __init__(self, lane: "TuyaLane", row: dict[str, Any]) -> None:
        super().__init__(daemon=True, name=f"tuya-{row['id']}")
        self.lane = lane
        self.row = dict(row)
        self.device_id = str(row["id"])
        self.commands: queue.Queue[tuple[int, Any]] = queue.Queue()
        self._stop = threading.Event()
        self.signature = _worker_signature(row)

    def stop(self) -> None:
        self._stop.set()

    def run(self) -> None:  # pragma: no cover - exercised on the Pi, unit tests drive ingest()
        backoff = BACKOFF_MIN_S
        while not self._stop.is_set():
            dev = None
            try:
                dev = _device_for(self.row)
                # Our own reconnect backoff owns retries; tinytuya's inner retry loop stays short.
                for name, args in (("set_socketPersistent", (True,)), ("set_socketTimeout", (SOCKET_TIMEOUT_S,)), ("set_socketRetryLimit", (1,))):
                    fn = getattr(dev, name, None)
                    if callable(fn):
                        fn(*args)
                first = dev.status()
                if not self._handle_payload(first):
                    raise _LinkError(_err_code(first))
                backoff = BACKOFF_MIN_S
                last_hb = time.time()
                last_full = last_hb
                errors = 0
                while not self._stop.is_set():
                    self._drain_commands(dev)
                    data = dev.receive()
                    now = time.time()
                    if data:
                        if self._handle_payload(data):
                            errors = 0
                        else:
                            errors += 1
                            code = _err_code(data)
                            if code in _ERR_BAD_KEY:
                                raise _LinkError(code)
                            if errors >= 3:
                                raise _LinkError(code)
                    if now - last_hb >= HEARTBEAT_S:
                        hb = getattr(dev, "heartbeat", None)
                        if callable(hb):
                            hb(True)
                        last_hb = now
                    if now - last_full >= FULL_STATUS_S:
                        st = getattr(dev, "status", None)
                        if callable(st):
                            st(True)
                        last_full = now
            except _LinkError as exc:
                self.lane.mark_link(self.device_id, "key_changed" if exc.code in _ERR_BAD_KEY else "offline", exc.code)
            except Exception as exc:  # noqa: BLE001 - a worker must never die silently
                _logger.debug("tuya worker %s: %s", self.device_id, exc)
                self.lane.mark_link(self.device_id, "offline", None)
            finally:
                close = getattr(dev, "close", None) if dev is not None else None
                if callable(close):
                    try:
                        close()
                    except Exception:  # noqa: BLE001
                        pass
            if self._stop.wait(backoff):
                break
            backoff = min(BACKOFF_MAX_S, backoff * 2)

    def _drain_commands(self, dev: Any) -> None:
        while True:
            try:
                index, value = self.commands.get_nowait()
            except queue.Empty:
                return
            try:
                resp = dev.set_value(index, value)
            except Exception as exc:  # noqa: BLE001
                self.lane.mark_write(self.device_id, "failed", str(exc))
                continue
            if isinstance(resp, dict) and "Err" in resp:
                self.lane.mark_write(self.device_id, "failed", str(resp.get("Error") or resp.get("Err")))
            else:
                self._handle_payload(resp)

    def _handle_payload(self, data: Any) -> bool:
        """True when the payload carried DPS (or was benign), False on a Tuya error dict."""
        if not isinstance(data, dict):
            return True
        if "Err" in data:
            return False
        dps = data.get("dps")
        if isinstance(dps, dict):
            self.lane.ingest(self.device_id, dps)
        return True


class _LinkError(Exception):
    def __init__(self, code: str | None) -> None:
        super().__init__(code or "link")
        self.code = code


def _err_code(data: Any) -> str | None:
    if isinstance(data, dict) and data.get("Err") is not None:
        return str(data.get("Err"))
    return None


def _worker_signature(row: dict[str, Any]) -> tuple[Any, ...]:
    return (row.get("ip"), row.get("local_key"), row.get("version"), row.get("type"), json.dumps(row.get("dps_map") or {}, sort_keys=True), json.dumps(row.get("scales") or {}, sort_keys=True))


def _runnable(row: dict[str, Any]) -> bool:
    return bool(row.get("enabled", True) and row.get("ip") and row.get("local_key") and row.get("type"))


class TuyaLane:
    def __init__(self) -> None:
        self._lock = threading.RLock()
        self._workers: dict[str, _Worker] = {}
        self._raw: dict[str, dict[str, Any]] = {}
        self._values: dict[str, dict[str, Any]] = {}
        self._updated_at: dict[str, float] = {}
        self._link: dict[str, str] = {}
        self._link_reason: dict[str, str | None] = {}
        self._link_at: dict[str, float] = {}
        self._commanded: dict[str, bool] = {}
        self._write_state: dict[str, str] = {}
        self._write_error: dict[str, str | None] = {}
        self._by_role: dict[str, dict[str, Any]] = {}
        self._running = False

    # -- lifecycle ---------------------------------------------------------

    def start(self) -> None:
        self._running = True
        if tinytuya is None and _make_device is None:
            _logger.warning("tinytuya not installed — Tuya lane idle")
        self.sync_workers()
        self.reapply_bindings()

    def stop(self, *, timeout: float = 2.0) -> None:
        self._running = False
        with self._lock:
            workers = list(self._workers.values())
            self._workers.clear()
        for w in workers:
            w.stop()
        for w in workers:
            if w.is_alive() and w is not threading.current_thread():
                w.join(timeout=timeout)

    def sync_workers(self) -> None:
        """Start / restart / stop workers to match the device store. No-op unless running."""
        if not self._running:
            return
        devices = load_tuya_devices()
        with self._lock:
            for did, w in list(self._workers.items()):
                row = devices.get(did)
                if row is None or not _runnable(row) or _worker_signature(row) != w.signature:
                    w.stop()
                    self._workers.pop(did, None)
                    if row is None or not _runnable(row):
                        self._link[did] = "offline"
                        self._link_reason[did] = "disabled" if row is not None else None
            for did, row in devices.items():
                if _runnable(row) and did not in self._workers:
                    w = _Worker(self, row)
                    self._workers[did] = w
                    self._link.setdefault(did, "offline")
                    w.start()

    def forget(self, device_id: str) -> None:
        with self._lock:
            w = self._workers.pop(device_id, None)
            for bucket in (self._raw, self._values, self._updated_at, self._link, self._link_reason, self._link_at, self._commanded, self._write_state, self._write_error):
                bucket.pop(device_id, None)  # type: ignore[arg-type]
        if w is not None:
            w.stop()

    # -- ingest ------------------------------------------------------------

    def ingest(self, device_id: str, dps: dict[str, Any]) -> None:
        """A DPS report (pushed, polled, or a write echo) for one device."""
        devices = load_tuya_devices()
        row = devices.get(str(device_id))
        if row is None:
            return
        now = time.time()
        with self._lock:
            raw = dict(self._raw.get(device_id) or {})
            raw.update({str(k): v for k, v in dps.items()})
            self._raw[device_id] = raw
            values = normalize_dps(row, raw)
            self._values[device_id] = values
            self._updated_at[device_id] = now
            self._link[device_id] = "live"
            self._link_reason[device_id] = None
            self._link_at[device_id] = now
            if "state" in values and device_id in self._commanded:
                got = bool(values["state"])
                self._write_state[device_id] = "synced" if got == self._commanded[device_id] else "differs"
        self._publish()
        self._evaluate_policies(device_id, row)

    def mark_link(self, device_id: str, link: str, reason: str | None) -> None:
        with self._lock:
            self._link[device_id] = link
            self._link_reason[device_id] = reason
            self._link_at[device_id] = time.time()
            if link != "live" and self._write_state.get(device_id) == "pending":
                self._write_state[device_id] = "failed"
                self._write_error[device_id] = "device went offline before it confirmed"
        self._publish()

    def mark_write(self, device_id: str, state: str, error: str | None = None) -> None:
        with self._lock:
            self._write_state[device_id] = state
            self._write_error[device_id] = error
        self._publish()

    # -- writes ------------------------------------------------------------

    def set_state(self, device_id: str, on: bool) -> dict[str, Any]:
        devices = load_tuya_devices()
        row = devices.get(str(device_id))
        if row is None:
            return {"ok": False, "error": "unknown device", "device_id": device_id}
        index = (row.get("dps_map") or {}).get("state")
        if index is None:
            return {"ok": False, "error": "device type has no switch datapoint", "device_id": device_id}
        with self._lock:
            self._commanded[device_id] = bool(on)
            self._write_state[device_id] = "pending"
            self._write_error[device_id] = None
            worker = self._workers.get(device_id)
        if worker is not None and worker.is_alive():
            worker.commands.put((int(index), bool(on)))
            self._publish()
            return {"ok": True, "device_id": device_id, "state": "ON" if on else "OFF", "queued": True}
        # No live worker (lane not running / device disabled): one-shot write.
        try:
            dev = _device_for(row)
            resp = dev.set_value(int(index), bool(on))
            close = getattr(dev, "close", None)
            if callable(close):
                close()
        except Exception as exc:  # noqa: BLE001
            self.mark_write(device_id, "failed", str(exc))
            return {"ok": False, "error": str(exc), "device_id": device_id}
        if isinstance(resp, dict) and "Err" in resp:
            self.mark_write(device_id, "failed", str(resp.get("Error") or resp.get("Err")))
            return {"ok": False, "error": str(resp.get("Error") or resp.get("Err")), "device_id": device_id}
        if isinstance(resp, dict) and isinstance(resp.get("dps"), dict):
            self.ingest(device_id, resp["dps"])
        return {"ok": True, "device_id": device_id, "state": "ON" if on else "OFF", "queued": False}

    def set_raw_dp(self, device_id: str, index: int, value: Any) -> dict[str, Any]:
        """Write one datapoint by index, without touching the switch's commanded/write state.

        For datapoints that are not the relay — today only the plug's own countdown timer,
        which `light_plug` refreshes as a dead-man's switch. Deliberately does NOT set
        ``_commanded`` / ``_write_state``: those describe whether the device agrees with the
        state we asked it to hold, and a countdown refresh is not a state command. Folding it
        in would make a healthy device read as PENDING forever.
        """
        devices = load_tuya_devices()
        row = devices.get(str(device_id))
        if row is None:
            return {"ok": False, "error": "unknown device", "device_id": device_id}
        with self._lock:
            worker = self._workers.get(device_id)
        if worker is not None and worker.is_alive():
            worker.commands.put((int(index), value))
            return {"ok": True, "device_id": device_id, "dp": int(index), "queued": True}
        try:
            dev = _device_for(row)
            resp = dev.set_value(int(index), value)
            close = getattr(dev, "close", None)
            if callable(close):
                close()
        except Exception as exc:  # noqa: BLE001
            return {"ok": False, "error": str(exc), "device_id": device_id}
        if isinstance(resp, dict) and "Err" in resp:
            return {"ok": False, "error": str(resp.get("Error") or resp.get("Err")), "device_id": device_id}
        return {"ok": True, "device_id": device_id, "dp": int(index), "queued": False}

    # -- views -------------------------------------------------------------

    def _link_for(self, device_id: str, now: float) -> str:
        link = self._link.get(device_id, "offline")
        if link == "live":
            age = now - self._updated_at.get(device_id, 0.0)
            if age > OFFLINE_S:
                return "offline"
            if age > LIVE_S:
                return "stale"
        return link

    def device_state(self, device_id: str, row: dict[str, Any], binding: dict[str, Any] | None, now: float | None = None) -> dict[str, Any]:
        now = now if now is not None else time.time()
        with self._lock:
            values = dict(self._values.get(device_id) or {})
            state: dict[str, Any] = {
                "friendly_name": (binding or {}).get("alias") or row.get("name") or device_id,
                "device_id": device_id,
                "lane": "tuya",
                "updated_at": self._updated_at.get(device_id),
                "link": self._link_for(device_id, now),
                "link_reason": self._link_reason.get(device_id),
                "write_state": self._write_state.get(device_id),
                "write_error": self._write_error.get(device_id),
                "commanded": self._commanded.get(device_id),
                "role": str((binding or {}).get("role") or "unbound"),
                "zone": str((binding or {}).get("zone") or "shared"),
                **values,
            }
        return state

    def device_states(self) -> dict[str, dict[str, Any]]:
        devices = load_tuya_devices()
        bindings = load_tuya_bindings()
        now = time.time()
        return {did: self.device_state(did, row, bindings.get(did), now) for did, row in devices.items()}

    def role_rows(self) -> dict[str, dict[str, Any]]:
        """Bound, enabled rows keyed by role — what the shared role buckets merge in."""
        from .zigbee_mqtt import _fleet_role_kinds, _role_kind

        bindings = load_tuya_bindings()
        if not bindings:
            with self._lock:
                self._by_role = {}
            return {}
        devices = load_tuya_devices()
        fleet_roles = _fleet_role_kinds()
        now = time.time()
        out: dict[str, dict[str, Any]] = {}
        for did, binding in bindings.items():
            row = devices.get(did)
            if row is None or not bool(binding.get("enabled", True)):
                continue
            role = str(binding.get("role") or "unbound")
            if role == "unbound" or role not in fleet_roles:
                continue
            state = self.device_state(did, row, binding, now)
            state["kind"] = _role_kind(role)
            if state.get("updated_at") is None:
                state["bound_stub"] = True
            out[role] = state
        with self._lock:
            self._by_role = out
        return out

    def health(self) -> dict[str, Any]:
        devices = load_tuya_devices()
        now = time.time()
        counts = {"live": 0, "stale": 0, "offline": 0, "key_changed": 0}
        enabled = 0
        for did, row in devices.items():
            if not _runnable(row):
                continue
            enabled += 1
            counts[self._link_for(did, now)] = counts.get(self._link_for(did, now), 0) + 1
        available = tinytuya is not None or _make_device is not None
        if not available:
            note = "tinytuya is not installed in the brain image — no Tuya device can connect"
        elif not devices:
            note = "No Tuya devices registered"
        elif enabled == 0:
            note = "Devices registered but none is enabled with an IP, key and type"
        elif counts["key_changed"]:
            note = f"{counts['key_changed']} device(s) will not decrypt — re-paired in SmartLife? Re-run the wizard and import again"
        elif counts["offline"]:
            note = f"{counts['offline']} of {enabled} unreachable — check power, DHCP reservation and that the SmartLife app is closed"
        elif counts["stale"]:
            note = f"{counts['stale']} of {enabled} silent for over {int(LIVE_S)} s"
        else:
            note = f"{enabled} device(s) live on the LAN"
        return {
            "available": available,
            "running": self._running,
            "device_count": len(devices),
            "enabled_count": enabled,
            "live": counts["live"],
            "stale": counts["stale"],
            "offline": counts["offline"],
            "key_changed": counts["key_changed"],
            "note": note,
        }

    # -- fleet + policies ---------------------------------------------------

    def reapply_bindings(self) -> None:
        self._publish()

    def _publish(self) -> None:
        try:
            from .zigbee_mqtt import stamp_role_buckets

            with fleet_state_lock():
                fleet = get_fleet_state()
                apply_tuya_cache_to_state(fleet)
                stamp_role_buckets(fleet)
                update_fleet_state(fleet)
        except Exception as exc:  # noqa: BLE001
            _logger.debug("tuya publish skipped: %s", exc)

    def _evaluate_policies(self, device_id: str, row: dict[str, Any]) -> None:
        try:
            from .zigbee_policies import evaluate_device_policies

            binding = load_tuya_bindings().get(device_id)
            payload = dict(self._values.get(device_id) or {})
            evaluate_device_policies(
                ieee=device_id,
                friendly_name=str((binding or {}).get("alias") or row.get("name") or device_id),
                payload=payload,
            )
        except Exception as exc:  # noqa: BLE001
            _logger.debug("tuya policy eval skipped: %s", exc)


_lane = TuyaLane()


def _register_role_provider() -> None:
    from .zigbee_mqtt import register_role_provider

    register_role_provider(_lane.role_rows)


_register_role_provider()


def apply_tuya_cache_to_state(state: FleetState) -> None:
    """Stamp the Tuya lane onto a fleet snapshot (ESPHome polls copy fleet and write back)."""
    state.system = dict(state.system)
    state.system["tuya_device_states"] = _lane.device_states()
    state.system["tuya_device_bindings"] = load_tuya_bindings()
    state.system["tuya_health"] = _lane.health()


def start_tuya_lane() -> None:
    _lane.start()


def stop_tuya_lane() -> None:
    _lane.stop()


def tuya_role_rows() -> dict[str, dict[str, Any]]:
    return _lane.role_rows()


def get_tuya_health() -> dict[str, Any]:
    return _lane.health()


def set_tuya_state(device_id: str, on: bool) -> dict[str, Any]:
    """ON/OFF write to a Tuya switch/plug. Best-effort — returns a status dict, never raises."""
    try:
        return _lane.set_state(str(device_id), bool(on))
    except Exception as exc:  # noqa: BLE001
        return {"ok": False, "error": str(exc), "device_id": device_id}


def set_tuya_dp(device_id: str, index: int, value: Any) -> dict[str, Any]:
    """Write one non-relay datapoint by index. Best-effort — returns a status dict, never raises."""
    try:
        return _lane.set_raw_dp(str(device_id), int(index), value)
    except Exception as exc:  # noqa: BLE001
        return {"ok": False, "error": str(exc), "device_id": device_id}


def get_tuya_devices() -> list[dict[str, Any]]:
    """Registered devices with binding, live state, status and masked key — the Settings rows."""
    devices = load_tuya_devices()
    bindings = load_tuya_bindings()
    conflicts = tuya_role_conflicts()
    now = time.time()
    out: list[dict[str, Any]] = []
    for did, row in devices.items():
        binding = bindings.get(did)
        role = str((binding or {}).get("role") or "unbound")
        status = "unbound"
        if binding and role != "unbound" and binding.get("enabled", True):
            status = "conflict" if role in conflicts else "bound"
        dtype = tuya_device_type(str(row.get("type") or ""))
        item = public_device(row)
        item["binding"] = binding
        item["status"] = status
        item["capability_class"] = str(dtype.get("capability_class") if dtype else "other")
        if binding and binding.get("capability_override"):
            item["capability_override"] = binding["capability_override"]
        item["type_label"] = str(dtype.get("label")) if dtype else ""
        item["can_actuate"] = bool(dtype.get("can_actuate")) if dtype else False
        item["state"] = _lane.device_state(did, row, binding, now)
        item["runnable"] = _runnable(row)
        with _lane._lock:
            item["raw_dps"] = dict(_lane._raw.get(did) or {})
        out.append(item)
    return out


def actuatable_tuya_devices() -> list[dict[str, Any]]:
    """Bound plug/switch devices — pickable targets for a ``tuya_switch`` rule."""
    from .zigbee_catalog import ACTUATABLE_ROLE_KINDS
    from .zigbee_mqtt import _role_kind

    devices = load_tuya_devices()
    out: list[dict[str, Any]] = []
    for did, binding in load_tuya_bindings().items():
        row = devices.get(did)
        if row is None:
            continue
        dtype = tuya_device_type(str(row.get("type") or ""))
        if not dtype or not dtype.get("can_actuate"):
            continue
        role = str(binding.get("role") or "unbound")
        if _role_kind(role) not in ACTUATABLE_ROLE_KINDS:
            continue
        out.append(
            {
                "lane": "tuya",
                "id": did,
                "device_id": did,
                "friendly_name": str(binding.get("alias") or row.get("name") or did),
                "alias": str(binding.get("alias") or ""),
                "role": role,
            }
        )
    return out


def probe_tuya_device(device_id: str | None = None, *, ip: str = "", local_key: str = "", version: str = "3.3") -> dict[str, Any]:
    """One-shot status() — proves ip + key + version before anything is bound.

    A device with a live worker is *not* opened a second time (Tuya firmware holds one
    local socket): its cached raw DPS is returned instead.
    """
    row: dict[str, Any] | None = None
    if device_id:
        row = load_tuya_devices().get(str(device_id))
        if row is None:
            return {"ok": False, "error": "unknown device", "hint": "Import it first."}
        with _lane._lock:
            worker = _lane._workers.get(str(device_id))
            cached = dict(_lane._raw.get(str(device_id)) or {})
            link = _lane._link_for(str(device_id), time.time())
        if worker is not None and worker.is_alive():
            if cached and link in ("live", "stale"):
                return {"ok": True, "source": "live", "dps": cached, "link": link, "guess_type": guess_type_from_dps(cached)}
            return {
                "ok": False,
                "source": "live",
                "link": link,
                "error": _lane._link_reason.get(str(device_id)) or "worker connected but no report yet",
                "hint": _hint_for(_lane._link_reason.get(str(device_id))),
            }
        probe = dict(row)
        if ip:
            probe["ip"] = ip
        if local_key:
            probe["local_key"] = local_key
        if version:
            probe["version"] = version
    else:
        probe = {"id": "probe", "ip": ip, "local_key": local_key, "version": version}
    if not probe.get("ip") or not probe.get("local_key"):
        return {"ok": False, "error": "ip and local key are required", "hint": "Give the device a DHCP reservation and paste the key from devices.json."}
    try:
        dev = _device_for(probe)
        # One attempt, five seconds: a probe answers quickly or says why, never hangs
        # the drawer behind tinytuya's default five connect retries.
        for name, args in (("set_socketTimeout", (5.0,)), ("set_socketRetryLimit", (1,))):
            fn = getattr(dev, name, None)
            if callable(fn):
                fn(*args)
        data = dev.status()
        close = getattr(dev, "close", None)
        if callable(close):
            close()
    except Exception as exc:  # noqa: BLE001
        return {"ok": False, "error": str(exc), "hint": _hint_for(None)}
    if isinstance(data, dict) and "Err" in data:
        code = str(data.get("Err"))
        return {"ok": False, "error": str(data.get("Error") or code), "err_code": code, "hint": _hint_for(code)}
    dps = data.get("dps") if isinstance(data, dict) else None
    if not isinstance(dps, dict):
        return {"ok": False, "error": "device answered without DPS", "hint": "Try protocol version 3.4 or 3.5."}
    dps = {str(k): v for k, v in dps.items()}
    if device_id and row is not None:
        _lane.ingest(str(device_id), dps)
    return {"ok": True, "source": "probe", "dps": dps, "guess_type": guess_type_from_dps(dps)}


def _hint_for(code: str | None) -> str:
    if code in _ERR_BAD_KEY:
        return "The local key or protocol version is wrong. Re-run the wizard (keys rotate when a device is re-paired) and try 3.3 / 3.4 / 3.5."
    if code in _ERR_UNREACHABLE:
        return "No answer on port 6668. Check the IP (DHCP reservation), that the device is powered, and close the SmartLife app — Tuya devices accept one local connection at a time."
    if code == "disabled":
        return "Device is disabled."
    return "Check IP, key and version; close the SmartLife app while the brain connects."
