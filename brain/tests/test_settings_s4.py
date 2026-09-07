"""Settings Pass S4: time card, failover state, route health, setup profile, factory reset."""

from __future__ import annotations

import json
from pathlib import Path

import pytest


@pytest.fixture()
def db(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> Path:
    monkeypatch.setenv("DSC_DATA", str(tmp_path))
    path = tmp_path / "dsc_ops.sqlite3"
    from dsc_brain import dsc_core_journal, journal_snapshot, plant_journal, room_model, settings, space_journal, space_model

    for mod in (settings, dsc_core_journal, journal_snapshot, plant_journal, space_journal, space_model, room_model):
        monkeypatch.setattr(mod, "DEFAULT_DB", path, raising=False)
    settings.init_settings_db(path)
    return path


def _client():
    from fastapi.testclient import TestClient

    from dsc_brain.api import app

    return TestClient(app)


def test_time_info_reports_both_clocks_and_never_invents_drift(db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    from dsc_brain import fleet_state, system_info

    st = fleet_state.FleetState()
    st.hub.online = True
    st.hub.values = {"uptime": 120}
    monkeypatch.setattr(fleet_state, "_fleet", st)
    info = system_info.time_info(now=1_800_000_000.0)
    assert info["brain"]["timezone"] == "Australia/Sydney"
    assert info["hub"]["drift_s"] is None
    assert "does not publish its clock" in info["hub"]["note"]

    st.hub.values = {"uptime": 120, "hub_clock_epoch": "1800000012", "clock_valid": True}
    st.hub.last_seen = 1_800_000_000.0
    info = system_info.time_info(now=1_800_000_005.0)
    assert info["hub"]["valid"] is True
    assert info["hub"]["drift_s"] == pytest.approx(12.0)
    assert info["hub"]["note"] is None

    st.hub.values = {"hub_clock_epoch": "unsynced"}
    info = system_info.time_info(now=1_800_000_005.0)
    assert info["hub"]["drift_s"] is None and info["hub"]["note"] == "hub clock not synced yet"


def test_failover_and_routes_via_api(db: Path) -> None:
    from dsc_brain.hub_failover import reset_override

    reset_override()
    c = _client()
    f = c.get("/system/failover").json()
    assert f["ttl_sec"] == 900.0 and f["active"] is False and f["pending_reassert"] is False
    r = c.get("/system/routes").json()
    paths = {row["path"] for row in r["routes"]}
    assert "/system/time" in paths and "/settings/profile" in paths
    optional = {o["path"]: o["served"] for o in r["optional"]}
    assert optional["/settings/alerts"] is True and optional["/system/time"] is True
    t = c.get("/system/time").json()
    assert t["brain"]["timezone"] == "Australia/Sydney" and "ntp" in t


def test_setup_profile_export_diff_apply(db: Path) -> None:
    from dsc_brain.alert_prefs import get_alert_prefs
    from dsc_brain.global_modifiers import get_global_modifiers
    from dsc_brain.setup_profile import apply_profile, diff_profile, export_profile
    from dsc_brain.stage_rail import list_stage_rail

    prof = export_profile(db)
    assert prof["kind"] == "dsc-hub-setup-profile"
    assert "network" in prof["excluded"] and "ap_psk" not in json.dumps(prof)
    # An unchanged profile diffs to nothing.
    assert diff_profile(prof, db)["total"] == 0

    prof["sections"]["global_modifiers"]["fan_demand_scale"] = 1.2
    prof["sections"]["stage_rail"]["Flowering"]["temp"] = 23.5
    prof["sections"]["alert_prefs"]["alerts"] = {"binary_sensor.dsc_hub_aux_sensor_fault": {"enabled": False}}
    prof["sections"]["alert_prefs"]["quiet_hours"] = {"start": "22:00", "end": "07:00"}
    prof["sections"]["journal_retention"]["core"] = 90
    prof["sections"]["automation_defaults"]["debounce_s"] = 30

    preview = apply_profile(prof, confirm=False, db_path=db)
    assert preview["applied"] is False and preview["diff"]["total"] == 6
    assert get_global_modifiers()["fan_demand_scale"] == 1.0  # nothing applied yet

    res = apply_profile(prof, confirm=True, db_path=db)
    assert res["applied"] is True
    assert get_global_modifiers()["fan_demand_scale"] == pytest.approx(1.2)
    assert next(r for r in list_stage_rail(db) if r["stage"] == "Flowering")["temp"] == pytest.approx(23.5)
    assert get_alert_prefs()["alerts"]["binary_sensor.dsc_hub_aux_sensor_fault"] == {"enabled": False}
    assert get_alert_prefs()["quiet_hours"] == {"start": "22:00", "end": "07:00"}
    assert diff_profile(prof, db)["total"] == 0

    with pytest.raises(ValueError):
        diff_profile({"kind": "something-else"}, db)


def test_profile_api_roundtrip(db: Path) -> None:
    c = _client()
    prof = c.get("/settings/profile").json()
    prof["sections"]["automation_defaults"]["release_s"] = 15
    r = c.post("/settings/profile/import", json={"profile": prof, "confirm": False}).json()
    assert r["applied"] is False and r["diff"]["automation_defaults"]["changes"][0]["to"] == 15
    r = c.post("/settings/profile/import", json={"profile": prof, "confirm": True}).json()
    assert r["applied"] is True and r["results"]["automation_defaults"] == 1
    assert c.get("/settings/automation-defaults").json()["defaults"]["release_s"] == 15
    assert c.post("/settings/profile/import", json={"profile": {"kind": "x"}, "confirm": False}).status_code == 400


def test_factory_reset_backs_up_moves_aside_and_reinits(db: Path, tmp_path: Path) -> None:
    from dsc_brain.factory_reset import expected_confirm_text, factory_reset
    from dsc_brain.settings import get_setting, set_setting

    set_setting("ollama_model", "marker-before-reset")
    with pytest.raises(ValueError):
        factory_reset("wrong", restart=False)
    out = factory_reset(expected_confirm_text(), restart=False)
    assert out["ok"] is True and Path(out["backup"]).is_file() and out["restart"]["status"] == "skipped"
    assert any("dsc_ops.sqlite3" in name for name in out["moved"])
    assert get_setting("ollama_model", "") == ""  # defaults again
    assert db.is_file()
