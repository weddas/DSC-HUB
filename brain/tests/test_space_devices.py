"""Adding, removing, and tiering the devices in a space.

`plan-spatial-layout-2026-09-10.md` S3, and §2's rule: **a device the brain can place is
not necessarily one it can drive.** The hub has a fixed number of PWM channels and relays;
past those a fan is on a smart plug (on/off, sometimes with real metering) or simply
present. All three cost power and move air, and only one has a control.

The tier is the thing that keeps that honest, so what these tests mostly pin is the pair
that cannot be fudged: a driven or switched device is defined by having something to drive,
a known one by having nothing.
"""

from __future__ import annotations

import pytest

from dsc_brain.space_model import (
    DEVICE_KINDS,
    DEVICE_TIERS,
    delete_space_device,
    device_controllable,
    ensure_kit_spaces,
    list_space_devices,
    normalise_device,
    upsert_space_device,
)


@pytest.fixture()
def spaces(tmp_path, monkeypatch):
    monkeypatch.setenv("DSC_DATA", str(tmp_path))
    ensure_kit_spaces()
    return None


def _devices(space_id: str = "4x8") -> list[dict]:
    return list_space_devices(space_id)


# --------------------------------------------------------------------------------------
# The tier/binding pair
# --------------------------------------------------------------------------------------


def test_the_three_tiers_are_the_three_tiers() -> None:
    assert DEVICE_TIERS == ("driven", "switched", "known")


def test_a_driven_device_needs_something_to_drive() -> None:
    with pytest.raises(ValueError, match="needs a binding"):
        normalise_device({"kind": "fan", "tier": "driven", "binding": ""})


def test_a_switched_device_needs_something_to_switch() -> None:
    with pytest.raises(ValueError, match="needs a binding"):
        normalise_device({"kind": "fan", "tier": "switched"})


def test_a_known_device_must_not_claim_a_binding() -> None:
    """Otherwise the row asserts a control it does not have — the thing tiers exist to stop."""
    with pytest.raises(ValueError, match="not controlled by anything"):
        normalise_device({"kind": "fan", "tier": "known", "binding": "fan.dsc_hub_something"})


def test_an_invented_tier_is_refused() -> None:
    with pytest.raises(ValueError, match="unknown device tier"):
        normalise_device({"tier": "sort_of"})


def test_an_invented_kind_is_refused() -> None:
    with pytest.raises(ValueError, match="unknown device kind"):
        normalise_device({"kind": "spaceship"})


def test_fan_and_light_are_kinds() -> None:
    assert "fan" in DEVICE_KINDS
    assert "light" in DEVICE_KINDS


# --------------------------------------------------------------------------------------
# What the UI is allowed to render a control for
# --------------------------------------------------------------------------------------


def test_a_known_device_is_never_controllable() -> None:
    assert device_controllable({"extra": {"tier": "known", "binding": ""}}) is False


def test_a_device_that_never_said_what_it_is_is_not_controllable() -> None:
    """The safe direction: no tier means no control, not a control that does nothing."""
    assert device_controllable({"extra": {}}) is False
    assert device_controllable({}) is False


def test_driven_and_switched_are_controllable() -> None:
    assert device_controllable({"extra": {"tier": "driven", "binding": "fan.x"}}) is True
    assert device_controllable({"extra": {"tier": "switched", "binding": "tuya:abc"}}) is True


# --------------------------------------------------------------------------------------
# Adding and removing
# --------------------------------------------------------------------------------------


def test_a_space_can_hold_a_second_fan(spaces) -> None:  # noqa: ANN001
    """The whole point of S3: many rows may share a kind and a role."""
    for dev_id, binding in (("osc_fan_a", "tuya:aaa"), ("osc_fan_b", "tuya:bbb")):
        upsert_space_device(
            "4x8",
            {
                "device_id": dev_id,
                "label": dev_id,
                "watts": 25.0,
                "duty_source": "always_on",
                "extra": {"kind": "fan", "role": "circulation", "tier": "switched", "binding": binding},
            },
        )
    fans = [d for d in _devices() if (d["extra"] or {}).get("role") == "circulation"]
    assert len(fans) == 2
    assert {d["device_id"] for d in fans} == {"osc_fan_a", "osc_fan_b"}


def test_an_uncontrolled_fan_can_be_added_and_still_costs_power(spaces) -> None:  # noqa: ANN001
    """An oscillating fan plugged into the wall: no control, real watts."""
    upsert_space_device(
        "4x8",
        {
            "device_id": "corner_fan",
            "label": "Corner oscillating fan",
            "watts": 35.0,
            "duty_source": "always_on",
            "extra": {"kind": "fan", "role": "circulation", "tier": "known", "binding": ""},
        },
    )
    dev = next(d for d in _devices() if d["device_id"] == "corner_fan")
    assert dev["watts"] == 35.0
    assert dev["enabled"] is True
    assert device_controllable(dev) is False


def test_a_bad_tier_never_reaches_the_store(spaces) -> None:  # noqa: ANN001
    with pytest.raises(ValueError):
        upsert_space_device(
            "4x8",
            {"device_id": "bad", "extra": {"kind": "fan", "tier": "driven", "binding": ""}},
        )
    assert not [d for d in _devices() if d["device_id"] == "bad"]


def test_delete_removes_the_device(spaces) -> None:  # noqa: ANN001
    upsert_space_device(
        "4x8",
        {"device_id": "temp_fan", "watts": 10.0, "extra": {"kind": "fan", "tier": "known"}},
    )
    assert any(d["device_id"] == "temp_fan" for d in _devices())
    assert delete_space_device("4x8", "temp_fan") is True
    assert not any(d["device_id"] == "temp_fan" for d in _devices())


def test_deleting_something_that_is_not_there_says_so(spaces) -> None:  # noqa: ANN001
    assert delete_space_device("4x8", "never_existed") is False


def test_delete_only_touches_the_named_space(spaces) -> None:  # noqa: ANN001
    for space in ("4x8", "2x4"):
        upsert_space_device(space, {"device_id": "shared_name", "watts": 5.0})
    assert delete_space_device("4x8", "shared_name") is True
    assert any(d["device_id"] == "shared_name" for d in list_space_devices("2x4"))


# --------------------------------------------------------------------------------------
# The seeded kit describes itself
# --------------------------------------------------------------------------------------


def test_the_seeded_lamp_is_driven_and_the_nameplate_fixture_is_not(spaces) -> None:  # noqa: ANN001
    """The 4x8 fixture is a nameplate entry the brain drives no part of — the case the
    `known` tier exists for — while the 2x4's SF1000 is on a hub dimmer."""
    sf1000 = next(d for d in list_space_devices("2x4") if d["device_id"] == "sf1000")
    assert (sf1000["extra"] or {}).get("tier") == "driven"
    assert device_controllable(sf1000) is True

    fixture = next(d for d in _devices() if d["device_id"] == "main_fixture")
    assert (fixture["extra"] or {}).get("tier") == "known"
    assert device_controllable(fixture) is False
    assert fixture["watts"] == 480.0  # still costs money


def test_the_lamp_keeps_its_catalog_binding(spaces) -> None:  # noqa: ANN001
    """Adding tier fields must not have displaced catalog_id in the same extra blob."""
    sf1000 = next(d for d in list_space_devices("2x4") if d["device_id"] == "sf1000")
    assert (sf1000["extra"] or {}).get("catalog_id") == "spider_farmer_sf1000"


def test_kit_devices_predating_tiers_are_backfilled(spaces) -> None:  # noqa: ANN001
    """An install from before tiers existed would show "tier not set" for kit we know.

    ensure_kit_spaces only INSERTed when a device was absent, so the defaults never reached
    an existing row. It now fills in the missing keys — and only the missing ones.
    """
    # Simulate the old shape: catalog_id only, no instance fields, and an operator's watts.
    upsert_space_device(
        "2x4",
        {"device_id": "sf1000", "label": "SF1000", "watts": 111.0,
         "extra": {"catalog_id": "spider_farmer_sf1000"}},
    )
    ensure_kit_spaces()

    sf1000 = next(d for d in list_space_devices("2x4") if d["device_id"] == "sf1000")
    assert (sf1000["extra"] or {}).get("tier") == "driven"
    assert (sf1000["extra"] or {}).get("catalog_id") == "spider_farmer_sf1000"
    assert sf1000["watts"] == 111.0, "an operator's watts must survive the backfill"


def test_the_backfill_never_overrides_an_operator_choice(spaces) -> None:  # noqa: ANN001
    """If they have said a device is `known`, re-seeding must not promote it to `driven`."""
    upsert_space_device(
        "2x4",
        {"device_id": "sf1000", "watts": 100.0,
         "extra": {"kind": "light", "tier": "known", "binding": ""}},
    )
    ensure_kit_spaces()
    sf1000 = next(d for d in list_space_devices("2x4") if d["device_id"] == "sf1000")
    assert (sf1000["extra"] or {}).get("tier") == "known"


def test_changing_one_field_does_not_wipe_the_others(spaces) -> None:  # noqa: ANN001
    """The device editor PATCHes a single field, and this used to be a full replace.

    Found in the browser, not the tests: promoting a 35 W fan from `known` to `switched`
    sent only {tier, binding} and its wattage came back 0.
    """
    upsert_space_device(
        "4x8",
        {
            "device_id": "corner_fan",
            "label": "Corner oscillating fan",
            "watts": 35.0,
            "duty_source": "always_on",
            "extra": {"kind": "fan", "role": "circulation", "tier": "known", "binding": ""},
        },
    )
    # ...now change only the tier and binding, as the desk does.
    upsert_space_device(
        "4x8",
        {
            "device_id": "corner_fan",
            "extra": {"kind": "fan", "role": "circulation", "tier": "switched", "binding": "tuya:plug"},
        },
    )
    dev = next(d for d in _devices() if d["device_id"] == "corner_fan")
    assert dev["watts"] == 35.0, "wattage must survive a tier change"
    assert dev["label"] == "Corner oscillating fan"
    assert dev["duty_source"] == "always_on"
    assert (dev["extra"] or {}).get("tier") == "switched"


def test_a_field_can_still_be_set_to_zero(spaces) -> None:  # noqa: ANN001
    """Merging must not make 0 unreachable — an explicit 0 W is a real value."""
    upsert_space_device("4x8", {"device_id": "z", "watts": 20.0})
    upsert_space_device("4x8", {"device_id": "z", "watts": 0.0})
    assert next(d for d in _devices() if d["device_id"] == "z")["watts"] == 0.0
