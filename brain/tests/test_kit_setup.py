"""Kit SD installer / setup health tests (8.0.0)."""

from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from dsc_brain.kit_commission import (
    get_setup_state,
    mark_commissioned,
    set_setup_phase,
    setup_health,
)
from dsc_brain.network_apply import operator_mode_for_carrier, spa_urls_for_mode
from dsc_brain.settings import init_settings_db


@pytest.fixture()
def temp_db(monkeypatch: pytest.MonkeyPatch, tmp_path: Path) -> Path:
    db = tmp_path / "dsc_ops.sqlite3"
    monkeypatch.setenv("DSC_DATA", str(tmp_path))
    init_settings_db(db)
    return db


def test_setup_health_catalog_is_thin_non_blocking() -> None:
    h = setup_health(
        fleet_online=False,
        zigbee_up=False,
        eth_up=False,
        cannalib_remote_ok=False,
    )
    assert h["catalog"]["mode"] == "thin_local"
    assert h["catalog"]["blocking"] is False


def test_operator_mode_from_carrier() -> None:
    assert operator_mode_for_carrier(True) == "ethernet"
    assert operator_mode_for_carrier(False) == "softap"


def test_spa_urls_for_mode() -> None:
    assert spa_urls_for_mode("softap") == ["http://10.42.0.1:8787"]
    eth = spa_urls_for_mode("ethernet", "192.168.86.48")
    assert eth[0] == "http://192.168.86.48:8787"
    assert "http://dsc-brain.local:8787" in eth


def test_setup_phase_and_state(temp_db: Path) -> None:
    st = get_setup_state(temp_db)
    assert st["commissioned"] is False
    assert st["phase"] == "welcome"
    st2 = set_setup_phase("usb_flash", temp_db)
    assert st2["phase"] == "usb_flash"


def test_cannot_commission_when_brain_unhealthy(temp_db: Path) -> None:
    bad = setup_health(fleet_online=False, zigbee_up=True, eth_up=False)
    bad["brain_ok"] = False
    bad["mosquitto_ok"] = True
    bad["z2m_ok"] = True
    with pytest.raises(ValueError, match="brain"):
        mark_commissioned(health=bad, db_path=temp_db)


def test_commission_succeeds_when_gates_ok(temp_db: Path) -> None:
    ok = {
        "brain_ok": True,
        "mosquitto_ok": True,
        "z2m_ok": True,
        "fleet_online": False,
        "catalog": {"mode": "thin_local", "blocking": False},
    }
    st = mark_commissioned(require_hub_online=False, health=ok, db_path=temp_db)
    assert st["commissioned"] is True


def test_setup_api_routes(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DEMO_MODE", "0")
    from dsc_brain.api import app

    client = TestClient(app)
    r = client.get("/setup/state")
    assert r.status_code == 200
    assert r.json()["commissioned"] is False
    r2 = client.post("/setup/phase", json={"phase": "fleet_join"})
    assert r2.status_code == 200
    assert r2.json()["phase"] == "fleet_join"
    r3 = client.get("/setup/health")
    assert r3.status_code == 200
    assert r3.json()["catalog"]["blocking"] is False


def test_usb_flash_unknown_role(temp_db: Path) -> None:
    from dsc_brain.usb_flash import queue_usb_flash

    with pytest.raises(ValueError, match="unknown role"):
        queue_usb_flash("nope", "/dev/ttyUSB0", temp_db)


def test_usb_flash_second_queue_conflicts(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    from dsc_brain import usb_flash

    monkeypatch.setattr(usb_flash, "_ensure_worker", lambda db_path=None: None)
    j1 = usb_flash.queue_usb_flash("hub", "/dev/ttyUSB0", temp_db)
    assert j1["status"] == "queued"
    with pytest.raises(RuntimeError, match="in progress"):
        usb_flash.queue_usb_flash("pot1", "/dev/ttyUSB1", temp_db)


def test_usb_flash_failed_missing_binary(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    from dsc_brain import usb_flash

    monkeypatch.setattr(usb_flash, "firmware_dir", lambda: temp_db.parent / "empty_fw")
    (temp_db.parent / "empty_fw").mkdir(exist_ok=True)
    job = usb_flash.queue_usb_flash("hub", "/dev/ttyUSB0", temp_db)
    # Worker runs in thread — drive job synchronously
    usb_flash._run_job(job["job_id"], "hub", "/dev/ttyUSB0", temp_db)
    done = usb_flash.get_usb_flash_job(job["job_id"], temp_db)
    assert done is not None
    assert done["status"] == "failed"
    assert "Missing firmware" in done["detail"]


def test_full_update_rejected_without_ethernet() -> None:
    from dsc_brain.kit_update import start_full_update

    with pytest.raises(ValueError, match="ethernet"):
        start_full_update(eth_up=False)


def test_full_update_accepted_with_ethernet() -> None:
    from dsc_brain.kit_update import start_full_update

    out = start_full_update(eth_up=True)
    assert out["status"] == "accepted"
    assert out["can_full_pull"] is True
