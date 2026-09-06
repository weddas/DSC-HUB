"""Panel plant names: `set_helper(text.dsc_probe{n}_plant_name)` must push to the
hub's `set_plant_name` native-API action (replacing the retired ha_plant_* feed)."""

import dsc_brain.compose_store as compose_store
import dsc_brain.hub_native as hub_native


def test_mirror_only_fires_for_probe_plant_name(monkeypatch):
    calls: list[tuple[int, str]] = []
    monkeypatch.setattr(hub_native, "push_plant_name_bg", lambda n, v: calls.append((n, v)))

    compose_store._mirror_plant_name_to_hub("text.dsc_probe3_plant_name", "Blue Dream")
    compose_store._mirror_plant_name_to_hub("select.dsc_probe3_growth_stage", "veg")
    compose_store._mirror_plant_name_to_hub("text.dsc_probe9_plant_name", "nope")
    compose_store._mirror_plant_name_to_hub("input_text.dsc_build_strain", "x")

    assert calls == [(3, "Blue Dream")]


def test_mirror_coerces_none_to_empty(monkeypatch):
    calls: list[tuple[int, str]] = []
    monkeypatch.setattr(hub_native, "push_plant_name_bg", lambda n, v: calls.append((n, v)))

    compose_store._mirror_plant_name_to_hub("text.dsc_probe1_plant_name", None)

    assert calls == [(1, "")]


def test_set_helper_triggers_push(tmp_path, monkeypatch):
    monkeypatch.setenv("DSC_DATA", str(tmp_path))
    calls: list[tuple[int, str]] = []
    monkeypatch.setattr(hub_native, "push_plant_name_bg", lambda n, v: calls.append((n, v)))

    compose_store.set_helper("text.dsc_probe2_plant_name", "Widow")

    assert calls == [(2, "Widow")]
    assert compose_store.get_helper("text.dsc_probe2_plant_name") == "Widow"


def test_push_bg_is_noop_in_demo_mode(monkeypatch):
    monkeypatch.setenv("DSC_DEMO_MODE", "1")
    called = []
    monkeypatch.setattr(hub_native, "push_plant_name_sync", lambda n, v: called.append((n, v)))

    hub_native.push_plant_name_bg(1, "Widow")

    assert called == []


def test_push_plant_name_fails_closed_without_hub(tmp_path, monkeypatch):
    monkeypatch.setenv("DSC_DATA", str(tmp_path))
    monkeypatch.setattr(hub_native, "list_inventory", lambda: [])

    res = hub_native.push_plant_name_sync(1, "Widow")

    assert res["ok"] is False


def test_push_plant_name_rejects_bad_pot(monkeypatch):
    monkeypatch.setattr(hub_native, "list_inventory", lambda: [{"role": "hub", "in_service": True, "host": "h"}])

    res = hub_native.push_plant_name_sync(7, "Widow")

    assert res["ok"] is False
    assert "range" in res["detail"]
