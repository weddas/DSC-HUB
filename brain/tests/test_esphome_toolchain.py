"""ESPHome toolchain + job runner — the branches the v8 completion pass added.

Covers: venv `_run_job` argv/cwd/env/timeout, the dashboard WebSocket runner,
backend detection (venv / venv-host / dashboard / none), the host-helper update
handshake, rollback, the disk guard, PyPI-offline safety, and the canary rollout.
"""

from __future__ import annotations

import json
import os
import threading
import time
from pathlib import Path
from typing import Any

import pytest

from dsc_brain.settings import connect, get_setting


# --------------------------------------------------------------------------- #
# helpers
# --------------------------------------------------------------------------- #
class _FakeProc:
    """Minimal Popen stand-in: streams `lines`, exits `rc`."""

    def __init__(self, lines: list[str], rc: int = 0, hang: bool = False) -> None:
        self.stdout = iter(lines)
        self.returncode = rc
        self._hang = hang
        self.killed = False

    def wait(self, timeout: float | None = None) -> int:
        if self._hang:
            import subprocess

            raise subprocess.TimeoutExpired(cmd="esphome", timeout=timeout or 0)
        return self.returncode

    def kill(self) -> None:
        self.killed = True


def _seed_seat(db: Path, seat_id: str, host: str | None, in_service: bool = True) -> None:
    """Write the inventory row directly. `upsert_inventory` would also try to sync
    in_service to the live hub over the native API (21 s connect timeout each)."""
    conn = connect(db)
    conn.execute(
        "INSERT INTO fleet_inventory(seat_id, role, in_service, host, mac, api_key, extra_json) "
        "VALUES(?, ?, ?, ?, NULL, NULL, '{}') ON CONFLICT(seat_id) DO UPDATE SET "
        "role=excluded.role, in_service=excluded.in_service, host=excluded.host",
        (seat_id, "pot" if seat_id.startswith("pot") else seat_id, 1 if in_service else 0, host),
    )
    conn.commit()
    conn.close()


def _only_seats(db: Path, *rows: tuple[str, str | None, bool]) -> None:
    """Replace the seeded default fleet with exactly these (seat_id, host, in_service) rows."""
    conn = connect(db)
    conn.execute("DELETE FROM fleet_inventory")
    conn.commit()
    conn.close()
    for seat_id, host, in_service in rows:
        _seed_seat(db, seat_id, host, in_service)


# --------------------------------------------------------------------------- #
# venv job runner
# --------------------------------------------------------------------------- #
def test_venv_run_job_compile_argv_cwd_env(temp_db: Path, monkeypatch: pytest.MonkeyPatch, tmp_path: Path) -> None:
    from dsc_brain import esphome_jobs as ej

    seen: dict[str, Any] = {}

    def fake_popen(cmd, **kw):  # noqa: ANN001
        seen["cmd"] = cmd
        seen["cwd"] = kw.get("cwd")
        seen["env"] = kw.get("env") or {}
        return _FakeProc(["Compiling...\n", "Successfully created esp32 image.\n"], 0)

    monkeypatch.setattr(ej, "_local_esphome_available", lambda: True)
    monkeypatch.setattr(ej, "esphome_bin", lambda: "/opt/dsc-esphome-venv/bin/esphome")
    monkeypatch.setattr(ej, "project_dir", lambda: tmp_path)
    monkeypatch.setenv("PLATFORMIO_CORE_DIR", "/var/lib/dsc-hub/platformio")
    monkeypatch.setattr(ej.subprocess, "Popen", fake_popen)

    job = ej.queue_job("hub", "compile", temp_db)
    ej._run_job(job, temp_db)

    assert seen["cmd"] == ["/opt/dsc-esphome-venv/bin/esphome", "compile", "dsc-hub.yaml"]
    assert seen["cwd"] == str(tmp_path)
    assert seen["env"]["PLATFORMIO_CORE_DIR"] == "/var/lib/dsc-hub/platformio"
    done = ej.get_job(job["job_id"], temp_db)
    assert done["status"] == "done"
    assert "Successfully created" in done["detail"]


def test_venv_run_job_ota_uses_inventory_host_and_no_logs(
    temp_db: Path, monkeypatch: pytest.MonkeyPatch, tmp_path: Path
) -> None:
    from dsc_brain import esphome_jobs as ej

    _seed_seat(temp_db, "pot2", "10.42.0.22")
    seen: dict[str, Any] = {}

    def fake_popen(cmd, **kw):  # noqa: ANN001
        seen["cmd"] = cmd
        return _FakeProc(["OTA ok\n"], 0)

    monkeypatch.setattr(ej, "_local_esphome_available", lambda: True)
    monkeypatch.setattr(ej, "esphome_bin", lambda: "esphome")
    monkeypatch.setattr(ej, "project_dir", lambda: tmp_path)
    monkeypatch.setattr(ej.subprocess, "Popen", fake_popen)

    job = ej.queue_job("pot2", "ota", temp_db)
    ej._run_job(job, temp_db)
    # Probe YAMLs are dsc-potN.yaml on disk (DSC-ProbeN.yaml never existed).
    assert seen["cmd"] == ["esphome", "run", "dsc-pot2.yaml", "--device", "10.42.0.22", "--no-logs"]
    assert ej.get_job(job["job_id"], temp_db)["status"] == "done"


def test_seat_yaml_files_exist_in_firmware_tree() -> None:
    from dsc_brain.esphome_jobs import SEAT_YAML
    from dsc_brain.paths import REPO_ROOT

    fw = REPO_ROOT / "firmware" / "v4"
    missing = [y for y in SEAT_YAML.values() if not (fw / y).is_file()]
    assert not missing, f"SEAT_YAML points at YAML that is not in firmware/v4: {missing}"


def test_venv_run_job_ota_without_host_fails_clean(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    from dsc_brain import esphome_jobs as ej

    _seed_seat(temp_db, "pot1", None)
    monkeypatch.setattr(ej, "_local_esphome_available", lambda: True)
    called = {"popen": False}
    monkeypatch.setattr(ej.subprocess, "Popen", lambda *a, **k: called.__setitem__("popen", True))
    job = ej.queue_job("pot1", "ota", temp_db)
    ej._run_job(job, temp_db)
    row = ej.get_job(job["job_id"], temp_db)
    assert row["status"] == "failed"
    assert "No host configured" in row["detail"]
    assert called["popen"] is False


def test_venv_run_job_timeout_kills_and_fails(temp_db: Path, monkeypatch: pytest.MonkeyPatch, tmp_path: Path) -> None:
    from dsc_brain import esphome_jobs as ej

    proc = _FakeProc([], 0, hang=True)
    monkeypatch.setattr(ej, "_local_esphome_available", lambda: True)
    monkeypatch.setattr(ej, "project_dir", lambda: tmp_path)
    monkeypatch.setattr(ej.subprocess, "Popen", lambda *a, **k: proc)
    job = ej.queue_job("hub", "compile", temp_db)
    ej._run_job(job, temp_db)
    assert proc.killed is True
    assert "timed out" in ej.get_job(job["job_id"], temp_db)["detail"]


# --------------------------------------------------------------------------- #
# dashboard WebSocket runner
# --------------------------------------------------------------------------- #
class _FakeWs:
    def __init__(self, events: list[dict[str, Any]]) -> None:
        self._events = list(events)
        self.sent: list[str] = []

    def __enter__(self) -> "_FakeWs":
        return self

    def __exit__(self, *a: object) -> None:
        return None

    def send(self, raw: str) -> None:
        self.sent.append(raw)

    def recv(self, timeout: float | None = None) -> str:
        if not self._events:
            raise TimeoutError
        return json.dumps(self._events.pop(0))


seen_url: dict[str, str] = {}


def _install_fake_ws(monkeypatch: pytest.MonkeyPatch, ws: _FakeWs) -> None:
    import sys
    import types

    client = types.ModuleType("websockets.sync.client")

    def _connect(url: str, **kw: Any) -> _FakeWs:
        seen_url["url"] = url
        return ws

    client.connect = _connect  # type: ignore[attr-defined]
    sync = types.ModuleType("websockets.sync")
    sync.client = client  # type: ignore[attr-defined]
    root = types.ModuleType("websockets")
    root.sync = sync  # type: ignore[attr-defined]
    monkeypatch.setitem(sys.modules, "websockets", root)
    monkeypatch.setitem(sys.modules, "websockets.sync", sync)
    monkeypatch.setitem(sys.modules, "websockets.sync.client", client)


def test_dashboard_ws_upload_streams_and_succeeds(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    from dsc_brain import esphome_jobs as ej

    ws = _FakeWs([{"event": "line", "data": "Uploading...\n"}, {"event": "exit", "code": 0}])
    _install_fake_ws(monkeypatch, ws)
    monkeypatch.setattr(ej, "dashboard_api", lambda: "http://host.docker.internal:6052")
    job = {"job_id": "j-ws", "seat_id": "pot2", "action": "ota", "yaml_name": "dsc-pot2.yaml"}
    conn = ej.connect(temp_db)
    ej._ensure_jobs(conn)
    conn.execute(
        "INSERT INTO esphome_jobs(job_id, seat_id, action, yaml_name, status, detail, created_at, updated_at) "
        "VALUES('j-ws','pot2','ota','dsc-pot2.yaml','queued','',0,0)"
    )
    conn.commit()
    conn.close()

    ej._run_job_via_dashboard(job, temp_db)

    spawn = json.loads(ws.sent[0])
    assert spawn == {"type": "spawn", "configuration": "dsc-pot2.yaml", "port": "OTA"}
    assert seen_url["url"].endswith("/run")  # compile + upload, never bare /upload
    row = ej.get_job("j-ws", temp_db)
    assert row["status"] == "done"
    assert "Uploading" in row["detail"]


def test_dashboard_ws_too_old_hint(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    from dsc_brain import esphome_jobs as ej

    ws = _FakeWs(
        [{"event": "line", "data": "Your ESPHome version is too old. Please update to at least 2026.6.5\n"}, {"event": "exit", "code": 1}]
    )
    _install_fake_ws(monkeypatch, ws)
    monkeypatch.setattr(ej, "dashboard_api", lambda: "http://host.docker.internal:6052")
    conn = ej.connect(temp_db)
    ej._ensure_jobs(conn)
    conn.execute(
        "INSERT INTO esphome_jobs(job_id, seat_id, action, yaml_name, status, detail, created_at, updated_at) "
        "VALUES('j-old','hub','compile','dsc-hub.yaml','queued','',0,0)"
    )
    conn.commit()
    conn.close()
    ej._run_job_via_dashboard({"job_id": "j-old", "seat_id": "hub", "action": "compile", "yaml_name": "dsc-hub.yaml"}, temp_db)
    row = ej.get_job("j-old", temp_db)
    assert row["status"] == "failed"
    assert "below the pinned min_version" in row["detail"]


# --------------------------------------------------------------------------- #
# backend detection
# --------------------------------------------------------------------------- #
def _no_local_cli(monkeypatch: pytest.MonkeyPatch, tc: Any) -> None:
    monkeypatch.setattr(tc, "esphome_bin", lambda: "/nope/esphome")
    monkeypatch.setattr(tc.shutil, "which", lambda _n: None)


def test_backend_none_when_nothing_answers(monkeypatch: pytest.MonkeyPatch, tmp_path: Path) -> None:
    from dsc_brain import esphome_toolchain as tc

    _no_local_cli(monkeypatch, tc)
    monkeypatch.setenv("DSC_ESPHOME_HOST_DIR", str(tmp_path / "esphome-host"))
    monkeypatch.setattr(tc, "_dash_get_one", lambda base, path, timeout: None)
    assert tc.build_backend() == "none"


def test_backend_venv_host_when_helper_published(monkeypatch: pytest.MonkeyPatch, tmp_path: Path) -> None:
    from dsc_brain import esphome_toolchain as tc

    _no_local_cli(monkeypatch, tc)
    hd = tmp_path / "esphome-host"
    hd.mkdir()
    (hd / "capabilities.json").write_text(
        json.dumps({"helper": True, "esphome_version": "2026.6.5", "secrets_present": True, "disk_free_bytes": 8_000_000_000}),
        encoding="utf-8",
    )
    monkeypatch.setenv("DSC_ESPHOME_HOST_DIR", str(hd))
    monkeypatch.setattr(tc, "dashboard_api", lambda: "http://host.docker.internal:6052")
    monkeypatch.setattr(
        tc, "_dash_get_one", lambda base, path, timeout: {"version": "2026.6.5"} if "host.docker" in base else None
    )
    assert tc.build_backend() == "venv-host"
    assert tc.dashboard_is_legacy() is False
    assert tc.secrets_present() is True
    assert tc.disk_free_bytes() == 8_000_000_000


def test_backend_dashboard_legacy_when_only_container_name_answers(
    monkeypatch: pytest.MonkeyPatch, tmp_path: Path
) -> None:
    from dsc_brain import esphome_toolchain as tc

    _no_local_cli(monkeypatch, tc)
    monkeypatch.setenv("DSC_ESPHOME_HOST_DIR", str(tmp_path / "esphome-host"))
    monkeypatch.setattr(tc, "dashboard_api", lambda: "http://host.docker.internal:6052")
    monkeypatch.setattr(
        tc, "_dash_get_one", lambda base, path, timeout: {"version": "2025.12.4"} if base == tc._LEGACY_DASHBOARD_API else None
    )
    assert tc.build_backend() == "dashboard"
    assert tc.dashboard_is_legacy() is True


def test_backend_dashboard_without_helper_refuses_update_with_hint(
    temp_db: Path, monkeypatch: pytest.MonkeyPatch, tmp_path: Path
) -> None:
    """Host unit answers but the helper was never installed → tell the operator how."""
    from dsc_brain import esphome_toolchain as tc

    _no_local_cli(monkeypatch, tc)
    monkeypatch.setenv("DSC_ESPHOME_HOST_DIR", str(tmp_path / "esphome-host"))
    monkeypatch.setattr(tc, "dashboard_api", lambda: "http://host.docker.internal:6052")
    monkeypatch.setattr(tc, "_dash_get_one", lambda base, path, timeout: {"version": "2026.6.5"} if "host.docker" in base else None)
    monkeypatch.setattr(tc, "eth_carrier_up", lambda: True)
    with pytest.raises(RuntimeError, match="dsc-esphome-update.path"):
        tc.update_to_latest(target="2026.8.2", db_path=temp_db)


# --------------------------------------------------------------------------- #
# host-helper update handshake
# --------------------------------------------------------------------------- #
def _host_env(monkeypatch: pytest.MonkeyPatch, tc: Any, tmp_path: Path, installed: str = "2026.6.5") -> Path:
    hd = tmp_path / "esphome-host"
    hd.mkdir(exist_ok=True)
    (hd / "capabilities.json").write_text(
        json.dumps({"helper": True, "esphome_version": installed, "secrets_present": True, "disk_free_bytes": 8_000_000_000}),
        encoding="utf-8",
    )
    monkeypatch.setenv("DSC_ESPHOME_HOST_DIR", str(hd))
    monkeypatch.setenv("DSC_ESPHOME_HOST_POLL", "0.02")
    monkeypatch.setattr(tc, "build_backend", lambda: "venv-host")
    monkeypatch.setattr(tc, "eth_carrier_up", lambda: True)
    monkeypatch.setattr(tc, "installed", lambda: installed)
    return hd


def test_host_update_writes_request_and_consumes_result(
    temp_db: Path, monkeypatch: pytest.MonkeyPatch, tmp_path: Path
) -> None:
    from dsc_brain import esphome_toolchain as tc

    hd = _host_env(monkeypatch, tc, tmp_path)
    monkeypatch.setattr(tc, "latest", lambda *, force=False: {"version": "2026.7.4", "ok": True, "eth_up": True})

    # Fake helper: wait for request.json, stream progress, drop result.json, remove request.
    def helper() -> None:
        req = hd / "request.json"
        for _ in range(500):
            if req.exists():
                break
            time.sleep(0.01)
        body = json.loads(req.read_text(encoding="utf-8"))
        (hd / "progress.log").write_text("Collecting esphome==2026.7.4\n", encoding="utf-8")
        time.sleep(0.05)
        (hd / "result.json").write_text(
            json.dumps({"job_id": body["job_id"], "ok": True, "from": "2026.6.5", "to": "2026.7.4", "exit_code": 0,
                        "message": "ESPHome 2026.6.5 -> 2026.7.4; dashboard restarted", "log_tail": "Successfully installed esphome-2026.7.4"}),
            encoding="utf-8",
        )
        req.unlink()

    t = threading.Thread(target=helper, daemon=True)
    t.start()
    out = tc.update_to_latest(db_path=temp_db)
    assert out["mode"] == "host" and out["target"] == "2026.7.4" and out["action"] == "update"
    t.join(timeout=5)
    for _ in range(300):
        job = tc.latest_update_job(temp_db)
        if job and job["status"] in {"done", "failed"}:
            break
        time.sleep(0.02)
    assert job is not None and job["status"] == "done", job
    assert job["from_version"] == "2026.6.5" and job["to_version"] == "2026.7.4"
    assert "dashboard restarted" in job["detail"]
    assert not (hd / "request.json").exists()
    assert not (hd / "result.json").exists()
    assert tc._update_running is False


def test_host_update_helper_failure_marks_job_failed(
    temp_db: Path, monkeypatch: pytest.MonkeyPatch, tmp_path: Path
) -> None:
    from dsc_brain import esphome_toolchain as tc

    hd = _host_env(monkeypatch, tc, tmp_path)

    def helper() -> None:
        req = hd / "request.json"
        for _ in range(500):
            if req.exists():
                break
            time.sleep(0.01)
        body = json.loads(req.read_text(encoding="utf-8"))
        (hd / "result.json").write_text(
            json.dumps({"job_id": body["job_id"], "ok": False, "from": "2026.6.5", "to": "2026.6.5", "exit_code": 4,
                        "message": "refusing: only 900 MiB free", "log_tail": ""}),
            encoding="utf-8",
        )
        req.unlink()

    threading.Thread(target=helper, daemon=True).start()
    tc.update_to_latest(target="2026.7.4", db_path=temp_db)
    for _ in range(300):
        job = tc.latest_update_job(temp_db)
        if job and job["status"] in {"done", "failed"}:
            break
        time.sleep(0.02)
    assert job["status"] == "failed"
    assert "900 MiB" in job["detail"]


def test_update_refuses_when_disk_is_short(temp_db: Path, monkeypatch: pytest.MonkeyPatch, tmp_path: Path) -> None:
    from dsc_brain import esphome_toolchain as tc

    hd = _host_env(monkeypatch, tc, tmp_path)
    (hd / "capabilities.json").write_text(
        json.dumps({"helper": True, "disk_free_bytes": 500_000_000}), encoding="utf-8"
    )
    with pytest.raises(RuntimeError, match="MiB free"):
        tc.update_to_latest(target="2026.7.4", db_path=temp_db)
    assert tc._update_running is False


def test_update_refuses_downgrade_unless_rollback(temp_db: Path, monkeypatch: pytest.MonkeyPatch, tmp_path: Path) -> None:
    from dsc_brain import esphome_toolchain as tc

    _host_env(monkeypatch, tc, tmp_path, installed="2026.8.2")
    with pytest.raises(RuntimeError, match="rollback"):
        tc.update_to_latest(target="2026.6.5", db_path=temp_db)
    with pytest.raises(RuntimeError, match="already installed"):
        tc.update_to_latest(target="2026.8.2", db_path=temp_db)


def test_rollback_target_and_rollback_action(temp_db: Path, monkeypatch: pytest.MonkeyPatch, tmp_path: Path) -> None:
    from dsc_brain import esphome_toolchain as tc

    _host_env(monkeypatch, tc, tmp_path, installed="2026.8.2")
    # A completed update 2026.6.5 -> 2026.8.2 on record.
    job_id = tc._new_toolchain_job("host-update", "2026.8.2", temp_db)
    tc._set_toolchain_job_versions(job_id, "2026.6.5", "2026.8.2", temp_db)
    tc._update_job_row(job_id, "done", "ok", temp_db)
    assert tc.rollback_target(temp_db, inst="2026.8.2") == "2026.6.5"

    started: dict[str, Any] = {}

    def fake_runner(job_id: str, action: str, target: str | None, db_path: Path | None = None) -> None:
        started.update(action=action, target=target)
        with tc._update_lock:
            tc._update_running = False

    monkeypatch.setattr(tc, "_run_host_update", fake_runner)
    out = tc.rollback_toolchain(db_path=temp_db)
    assert out["action"] == "rollback" and out["target"] == "2026.6.5"
    for _ in range(100):
        if started:
            break
        time.sleep(0.01)
    assert started == {"action": "rollback", "target": "2026.6.5"}


def test_rollback_with_nothing_on_record(temp_db: Path, monkeypatch: pytest.MonkeyPatch, tmp_path: Path) -> None:
    from dsc_brain import esphome_toolchain as tc

    _host_env(monkeypatch, tc, tmp_path)
    with pytest.raises(ValueError, match="nothing to roll back"):
        tc.rollback_toolchain(db_path=temp_db)


def test_rollback_target_never_below_min(temp_db: Path) -> None:
    from dsc_brain import esphome_toolchain as tc

    job_id = tc._new_toolchain_job("host-update", "2026.6.5", temp_db)
    tc._set_toolchain_job_versions(job_id, "2025.12.4", "2026.6.5", temp_db)
    tc._update_job_row(job_id, "done", "ok", temp_db)
    assert tc.rollback_target(temp_db, inst="2026.6.5") is None


# --------------------------------------------------------------------------- #
# PyPI offline safety
# --------------------------------------------------------------------------- #
def test_latest_offline_returns_not_ok_without_raising(monkeypatch: pytest.MonkeyPatch) -> None:
    from dsc_brain import esphome_toolchain as tc

    monkeypatch.setattr(tc, "eth_carrier_up", lambda: True)

    def boom(*a: object, **k: object) -> None:
        raise OSError("dns down")

    monkeypatch.setattr(tc.urllib.request, "urlopen", boom)
    with tc._latest_lock:
        tc._latest_cache.update(version=None, checked_at=0.0, ok=False)
    out = tc.latest(force=True)
    assert out["ok"] is False and out["version"] is None
    assert "pypi lookup failed" in out["error"]
    # Second call inside the fail window is served from cache (no second urlopen).
    monkeypatch.setattr(tc.urllib.request, "urlopen", lambda *a, **k: (_ for _ in ()).throw(AssertionError("hit pypi")))
    again = tc.latest()
    assert again["ok"] is False


# --------------------------------------------------------------------------- #
# rollout: OOS / hostless skip, prompt flag, canary
# --------------------------------------------------------------------------- #
def _fleet(monkeypatch: pytest.MonkeyPatch, tc: Any, installed: str, running: dict[str, str | None]) -> None:
    monkeypatch.setattr(tc, "installed", lambda: installed)
    monkeypatch.setattr(
        tc,
        "device_versions",
        lambda: [
            {"seat_id": s, "online": v is not None, "running": v, "deployed": None,
             "matches_installed": bool(v and tc._vtuple(v) == tc._vtuple(installed))}
            for s, v in running.items()
        ],
    )


def test_rollout_skips_oos_and_hostless_and_honours_prompt(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    from dsc_brain import esphome_toolchain as tc
    from dsc_brain.settings import set_setting

    _fleet(monkeypatch, tc, "2026.8.2", {})
    _only_seats(
        temp_db,
        ("hub", "10.42.0.10", True),
        ("control", "10.42.0.11", True),
        ("pot1", "10.42.0.21", True),
        ("pot2", "10.42.0.22", True),
        ("pot3", "10.42.0.23", False),  # retired → skipped
        ("heater", None, True),  # no host yet → skipped
        ("tank", None, True),  # not an ESPHome seat → skipped
    )
    set_setting("esphome_fleet_ota_prompt", "false", temp_db)

    plan = tc.pending_fleet_rollout(temp_db)
    ids = [s["seat_id"] for s in plan["seats"]]
    assert ids == ["control", "pot1", "pot2", "hub"]  # alphabetical, hub last
    assert plan["prompt_enabled"] is False
    assert plan["canary_seat"] == "pot2"
    assert [s["seat_id"] for s in plan["rest"]] == ["control", "pot1", "hub"]


def test_canary_then_rest(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    from dsc_brain import esphome_toolchain as tc
    from dsc_brain.esphome_jobs import list_jobs, _update_job

    _fleet(monkeypatch, tc, "2026.8.2", {"pot2": "2026.6.5", "pot1": "2026.6.5", "hub": "2026.6.5"})
    _only_seats(temp_db, ("hub", "10.42.0.10", True), ("pot1", "10.42.0.21", True), ("pot2", "10.42.0.22", True))

    out = tc.start_fleet_rollout(temp_db, mode="canary")
    assert out == {"queued": ["pot2"], "errors": [], "built_against": "2026.8.2", "mode": "canary"}
    assert get_setting("last_built_esphome", "", temp_db) == ""  # rollout not done yet
    plan = tc.pending_fleet_rollout(temp_db)
    assert plan["needed"] is True
    assert plan["canary"]["seat"] == "pot2"
    assert plan["canary"]["job_status"] == "queued"
    assert plan["canary"]["ok"] is False

    # Worker finishes the canary; the probe comes back on the new ESPHome.
    job_id = plan["canary"]["job_id"]
    _update_job(job_id, "done", "OTA ok", temp_db)
    _fleet(monkeypatch, tc, "2026.8.2", {"pot2": "2026.8.2", "pot1": "2026.6.5", "hub": "2026.6.5"})
    plan = tc.pending_fleet_rollout(temp_db)
    assert plan["canary"]["ok"] is True and plan["canary"]["running"] == "2026.8.2"

    out = tc.start_fleet_rollout(temp_db, mode="rest")
    assert out["queued"] == ["pot1", "hub"]  # canary excluded, hub last
    assert get_setting("last_built_esphome", "", temp_db) == "2026.8.2"
    assert tc.pending_fleet_rollout(temp_db)["canary"] is None
    queued = [j["seat_id"] for j in list_jobs(limit=10, db_path=temp_db)]
    assert sorted(queued) == ["hub", "pot1", "pot2"]


def test_default_fleet_rollout_order_hub_last(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    """Seeded kit inventory: every in-service ESPHome seat, alphabetical, hub last;
    pot3/pot4 (retired) and ac/mister/tank (not ESPHome) excluded."""
    from dsc_brain import esphome_toolchain as tc

    _fleet(monkeypatch, tc, "2026.8.2", {})
    plan = tc.pending_fleet_rollout(temp_db)
    ids = [s["seat_id"] for s in plan["seats"]]
    assert ids == ["control", "dehumidifier", "heater", "heatmat", "humidifier", "pot1", "pot2", "hub"]
    assert plan["canary_seat"] == "pot2"


def test_canary_state_discarded_when_toolchain_moves_again(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    from dsc_brain import esphome_toolchain as tc

    _fleet(monkeypatch, tc, "2026.8.2", {"pot2": "2026.6.5"})
    _only_seats(temp_db, ("pot2", "10.42.0.22", True))
    tc.start_fleet_rollout(temp_db, mode="canary")
    _fleet(monkeypatch, tc, "2026.9.0", {"pot2": "2026.8.2"})
    assert tc.pending_fleet_rollout(temp_db)["canary"] is None


def test_canary_without_probe_raises(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    from dsc_brain import esphome_toolchain as tc

    _fleet(monkeypatch, tc, "2026.8.2", {})
    _only_seats(temp_db, ("hub", "10.42.0.10", True))
    plan = tc.pending_fleet_rollout(temp_db)
    assert plan["canary_seat"] is None
    with pytest.raises(ValueError, match="canary"):
        tc.start_fleet_rollout(temp_db, mode="canary")


def test_rollout_unknown_mode(temp_db: Path) -> None:
    from dsc_brain import esphome_toolchain as tc

    with pytest.raises(ValueError, match="unknown rollout mode"):
        tc.start_fleet_rollout(temp_db, mode="yolo")


# --------------------------------------------------------------------------- #
# status shape on the shipping topology
# --------------------------------------------------------------------------- #
def test_status_reports_host_helper_fields(temp_db: Path, monkeypatch: pytest.MonkeyPatch, tmp_path: Path) -> None:
    from dsc_brain import esphome_toolchain as tc

    hd = tmp_path / "esphome-host"
    hd.mkdir()
    (hd / "capabilities.json").write_text(
        json.dumps({"helper": True, "esphome_version": "2026.6.5", "secrets_present": False,
                    "disk_free_bytes": 2_147_483_648, "project_dir": "/opt/dsc-hub/firmware/v4", "written_at": "2026-09-06T00:00:00Z"}),
        encoding="utf-8",
    )
    monkeypatch.setenv("DSC_ESPHOME_HOST_DIR", str(hd))
    monkeypatch.setattr(tc, "installed", lambda: "2026.6.5")
    monkeypatch.setattr(tc, "latest", lambda *, force=False: {"version": "2026.8.2", "ok": True, "eth_up": True})
    monkeypatch.setattr(tc, "device_versions", lambda: [])
    monkeypatch.setattr(tc, "build_backend", lambda: "venv-host")
    st = tc.status()
    assert st["build_backend"] == "venv-host"
    assert st["host_helper"] is True
    assert st["secrets_present"] is False
    assert st["disk_free_gb"] == 2.0 and st["disk_free_ok"] is True
    assert st["project_dir"] == "/opt/dsc-hub/firmware/v4"
    assert st["dashboard_legacy"] is False
    assert st["rollback_target"] is None
    assert st["canary"] is None
    assert "compose_file" in st and st["compose_file"] is None


# --------------------------------------------------------------------------- #
# per-seat running ESPHome version must come from the ESPHome sensor, not the product train
# --------------------------------------------------------------------------- #
def test_device_versions_ignore_product_firmware_train(monkeypatch: pytest.MonkeyPatch) -> None:
    from dsc_brain import esphome_toolchain as tc

    class _F:
        def to_dict(self) -> dict[str, Any]:
            return {
                "hub": {"online": True, "firmware": "8.0.0.0", "values": {"esphome_version": "2026.6.5 (Sep  6 2026, 21:00:00)"}},
                "panel": {"online": True, "firmware": "8.0.0.0", "values": {}},
                "pots": {"pot2": {"online": True, "firmware": "2026.6.5", "values": {}}},
                "sonoffs": {"heater": {"online": False, "firmware": "7.0.0.0", "values": {}}},
            }

    monkeypatch.setattr(tc, "get_fleet_state", lambda: _F())
    monkeypatch.setattr(tc, "installed", lambda: "2026.6.5")
    monkeypatch.setattr(tc, "dashboard_devices", lambda: [])
    by = {d["seat_id"]: d for d in tc.device_versions()}
    assert by["hub"]["running"] == "2026.6.5 (Sep  6 2026, 21:00:00)" and by["hub"]["matches_installed"] is True
    assert by["hub"]["product_firmware"] == "8.0.0.0"
    assert by["control"]["running"] is None and by["control"]["matches_installed"] is False
    assert by["pot2"]["running"] == "2026.6.5" and by["pot2"]["matches_installed"] is True
    assert by["heater"]["running"] is None  # 7.0.0.0 is the product train, not an ESPHome release


def test_run_job_routes_to_dashboard_on_venv_host(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    """The shipping topology: no local CLI, host venv dashboard + helper → WebSocket path,
    never the subprocess path (which fails with 'esphome CLI not found' in the container)."""
    from dsc_brain import esphome_jobs as ej

    monkeypatch.setattr(ej, "_local_esphome_available", lambda: False)
    monkeypatch.setattr(ej, "build_backend", lambda: "venv-host")
    seen: dict[str, Any] = {}
    monkeypatch.setattr(ej, "_run_job_via_dashboard", lambda job, db=None: seen.update(job))
    monkeypatch.setattr(ej.subprocess, "Popen", lambda *a, **k: (_ for _ in ()).throw(AssertionError("subprocess path used")))
    ej._run_job({"job_id": "j-vh", "seat_id": "pot2", "action": "compile", "yaml_name": "dsc-pot2.yaml"}, temp_db)
    assert seen.get("yaml_name") == "dsc-pot2.yaml"


def test_backend_venv_host_survives_dashboard_down(monkeypatch: pytest.MonkeyPatch, tmp_path: Path) -> None:
    """A bad ESPHome bump can take :6052 down; the helper must still be usable for rollback."""
    from dsc_brain import esphome_toolchain as tc

    _no_local_cli(monkeypatch, tc)
    hd = tmp_path / "esphome-host"
    hd.mkdir()
    (hd / "capabilities.json").write_text(json.dumps({"helper": True, "esphome_version": "2026.8.2"}), encoding="utf-8")
    monkeypatch.setenv("DSC_ESPHOME_HOST_DIR", str(hd))
    monkeypatch.setattr(tc, "_dash_get_one", lambda base, path, timeout: None)
    assert tc.build_backend() == "venv-host"
    assert tc.installed() == "2026.8.2"  # from the helper, not the (dead) dashboard


# --------------------------------------------------------------------------- #
# ESPHome 2026.8 removed the built-in dashboard — the toolchain must not cross it
# --------------------------------------------------------------------------- #
def test_latest_supported_stops_below_dashboard_removal(monkeypatch: pytest.MonkeyPatch, tmp_path: Path) -> None:
    from dsc_brain import esphome_toolchain as tc

    monkeypatch.setenv("DSC_ESPHOME_HOST_DIR", str(tmp_path / "none"))  # no helper -> no device builder
    releases = {"2026.7.4": [{"yanked": False}], "2026.8.0": [{"yanked": False}], "2026.8.2": [{"yanked": False}],
                "2026.7.5": [{"yanked": True}], "2026.6.5": [{"yanked": False}], "1.20.4": [{"yanked": False}]}
    assert tc._latest_supported_from_releases(releases, "2026.8.2") == "2026.7.4"
    hd = tmp_path / "esphome-host"
    hd.mkdir()
    (hd / "capabilities.json").write_text(json.dumps({"helper": True, "device_builder": True}), encoding="utf-8")
    monkeypatch.setenv("DSC_ESPHOME_HOST_DIR", str(hd))
    assert tc._latest_supported_from_releases(releases, "2026.8.2") == "2026.8.2"


def test_update_refuses_past_dashboard_removal(temp_db: Path, monkeypatch: pytest.MonkeyPatch, tmp_path: Path) -> None:
    from dsc_brain import esphome_toolchain as tc

    _host_env(monkeypatch, tc, tmp_path)
    with pytest.raises(RuntimeError, match="Device Builder"):
        tc.update_to_latest(target="2026.8.2", db_path=temp_db)
    assert tc._update_running is False
    # default target follows the supported latest, not PyPI's newest
    monkeypatch.setattr(tc, "latest", lambda *, force=False: {"version": "2026.8.2", "supported": "2026.7.4", "ok": True, "eth_up": True})
    started: dict[str, Any] = {}

    def fake_runner(job_id: str, action: str, target: str | None, db_path: Path | None = None) -> None:
        started.update(target=target)
        with tc._update_lock:
            tc._update_running = False

    monkeypatch.setattr(tc, "_run_host_update", fake_runner)
    out = tc.update_to_latest(db_path=temp_db)
    assert out["target"] == "2026.7.4"


def test_status_reports_blocked_latest(temp_db: Path, monkeypatch: pytest.MonkeyPatch, tmp_path: Path) -> None:
    from dsc_brain import esphome_toolchain as tc

    monkeypatch.setenv("DSC_ESPHOME_HOST_DIR", str(tmp_path / "none"))
    monkeypatch.setattr(tc, "installed", lambda: "2026.6.5")
    monkeypatch.setattr(tc, "latest", lambda *, force=False: {"version": "2026.8.2", "supported": "2026.7.4", "ok": True, "eth_up": True})
    monkeypatch.setattr(tc, "device_versions", lambda: [])
    monkeypatch.setattr(tc, "build_backend", lambda: "venv-host")
    st = tc.status()
    assert st["latest"] == "2026.8.2" and st["latest_supported"] == "2026.7.4"
    assert st["update_available"] is True
    assert "Device Builder" in st["latest_blocked_reason"]


def test_rollback_target_offered_when_failed_job_still_moved_the_venv(temp_db: Path, monkeypatch: pytest.MonkeyPatch, tmp_path: Path) -> None:
    from dsc_brain import esphome_toolchain as tc

    _host_env(monkeypatch, tc, tmp_path, installed="2026.8.2")
    job_id = tc._new_toolchain_job("host-update", "2026.8.2", temp_db)
    tc._set_toolchain_job_versions(job_id, "2026.6.5", "2026.8.2", temp_db)
    tc._update_job_row(job_id, "failed", "dashboard restart died", temp_db)
    assert tc.rollback_target(temp_db, inst="2026.8.2") == "2026.6.5"


def test_queue_job_allows_a_fleet_behind_a_running_job(temp_db: Path) -> None:
    """Bulk rollout: the first job goes `running` immediately; the rest must still queue."""
    from dsc_brain import esphome_jobs as ej

    first = ej.queue_job("control", "ota", temp_db)
    ej._update_job(first["job_id"], "running", "flashing", temp_db)
    for seat in ("heater", "heatmat", "humidifier", "pot1", "hub"):
        ej.queue_job(seat, "ota", temp_db)
    with pytest.raises(RuntimeError, match="already queued or running for heater"):
        ej.queue_job("heater", "ota", temp_db)
    ej.queue_job("heater", "compile", temp_db)  # a different action for the same seat is fine
    statuses = {(j["seat_id"], j["action"]): j["status"] for j in ej.list_jobs(limit=20, db_path=temp_db)}
    assert statuses[("hub", "ota")] == "queued" and statuses[("control", "ota")] == "running"


def test_rollback_target_never_offers_a_dashboardless_release(temp_db: Path, monkeypatch: pytest.MonkeyPatch, tmp_path: Path) -> None:
    """After rolling 2026.8.2 -> 2026.6.5 the last done job's from_version is 2026.8.2 - not an offer."""
    from dsc_brain import esphome_toolchain as tc

    _host_env(monkeypatch, tc, tmp_path, installed="2026.6.5")
    job_id = tc._new_toolchain_job("host-rollback", "2026.6.5", temp_db)
    tc._set_toolchain_job_versions(job_id, "2026.8.2", "2026.6.5", temp_db)
    tc._update_job_row(job_id, "done", "ok", temp_db)
    assert tc.rollback_target(temp_db, inst="2026.6.5") is None
