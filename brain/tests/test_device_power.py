"""Per-device wattage, and who owns the value.

The precedence is the whole feature: a device matched to a catalogue product takes that
product's nameplate and the field goes read-only. Everything else is typed in. A value
nobody supplied stays None, never 0 — "this heater draws nothing" is a claim, absence is not.
"""

from __future__ import annotations

from pathlib import Path

import pytest


def test_catalog_wins_and_locks(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.device_power import resolve

    row = {"seat_id": "heater", "extra": {"catalog_id": "vevor_1500w", "watts": 900}}
    out = resolve(row, catalog_watts=1500.0)

    assert out["watts"] == 1500.0, "the catalogue nameplate must win"
    assert out["source"] == "catalog"
    assert out["locked"] is True
    assert "product database" in out["note"]
    # The operator's own figure is preserved, just not effective while the match stands.
    assert out["operator_watts"] == 900.0


def test_an_unmatched_device_uses_the_operator_value(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.device_power import resolve

    out = resolve({"seat_id": "heater", "extra": {"watts": 900}}, catalog_watts=None)
    assert out["watts"] == 900.0
    assert out["source"] == "operator"
    assert out["locked"] is False


def test_a_match_without_a_published_wattage_stays_editable(
    temp_db: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    """Being matched is not the same as the product publishing a figure."""
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.device_power import resolve

    out = resolve({"seat_id": "ac", "extra": {"catalog_id": "some_ac", "watts": 750}}, catalog_watts=None)
    assert out["locked"] is False
    assert out["watts"] == 750.0
    assert "does not publish a wattage" in out["note"]


def test_unset_is_none_not_zero(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.device_power import resolve

    out = resolve({"seat_id": "ac", "extra": {}}, catalog_watts=None)
    assert out["watts"] is None, "absent must not become 0 W"
    assert out["source"] == "unset"
    assert "rather than counted as zero" in out["note"]


def test_writing_a_locked_device_is_refused(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.device_power import PowerLockedError, set_device_watts
    from dsc_brain.settings import upsert_inventory

    upsert_inventory("heater", {"extra": {"catalog_id": "vevor_1500w"}})
    with pytest.raises(PowerLockedError, match="product database"):
        set_device_watts("heater", 900, catalog_watts=1500.0)


def test_writing_an_unlocked_device_round_trips(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.device_power import set_device_watts
    from dsc_brain.settings import list_inventory

    out = set_device_watts("dehumidifier", 320, catalog_watts=None)
    assert out["watts"] == 320.0 and out["source"] == "operator"

    row = next(r for r in list_inventory() if r["seat_id"] == "dehumidifier")
    assert (row.get("extra") or {}).get("watts") == 320.0


def test_clearing_a_value_returns_it_to_unset(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.device_power import set_device_watts

    set_device_watts("humidifier", 45, catalog_watts=None)
    out = set_device_watts("humidifier", None, catalog_watts=None)
    assert out["watts"] is None and out["source"] == "unset"


def test_nonsense_values_are_refused(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.device_power import MAX_WATTS, coerce_watts, set_device_watts

    with pytest.raises(ValueError, match="negative"):
        coerce_watts(-5)
    with pytest.raises(ValueError, match="ceiling"):
        coerce_watts(MAX_WATTS + 1)
    with pytest.raises(ValueError, match="must be a number"):
        coerce_watts("loads")
    with pytest.raises(ValueError, match="not a powered seat"):
        set_device_watts("twin_sf1000", 100, catalog_watts=None)


def test_every_appliance_the_operator_named_is_covered() -> None:
    from dsc_brain.device_power import POWERED_SEATS

    for seat in ("heater", "heatmat", "humidifier", "dehumidifier", "ac"):
        assert seat in POWERED_SEATS


# --- the other two device shapes --------------------------------------------------------


def test_a_fan_watt_round_trips_through_its_own_map(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    """Fans are hub entities, not seats or space devices, so they get their own store."""
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.device_power import get_fan_watts, set_device_watts

    out = set_device_watts("fan.dsc_hub_6_inch_exhaust_room", 65, catalog_watts=None)
    assert out["watts"] == 65.0 and out["source"] == "operator"
    assert get_fan_watts()["fan.dsc_hub_6_inch_exhaust_room"] == 65.0

    # Clearing removes the key rather than storing 0 W.
    set_device_watts("fan.dsc_hub_6_inch_exhaust_room", None, catalog_watts=None)
    assert "fan.dsc_hub_6_inch_exhaust_room" not in get_fan_watts()


def test_a_light_writes_the_column_the_energy_estimate_reads(
    temp_db: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.device_power import set_device_watts
    from dsc_brain.space_model import list_space_devices, upsert_space_device

    upsert_space_device("2x4", {"device_id": "sf1000", "label": "SF1000", "watts": 100.0})
    set_device_watts("space:2x4:sf1000", 135, catalog_watts=None)

    row = next(d for d in list_space_devices("2x4") if d["device_id"] == "sf1000")
    assert row["watts"] == 135.0, "the energy estimate reads this column, so it must be what changed"


def test_a_matched_light_is_locked_too(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    """The lock is not appliance-only — a light matched to a catalogue product is a fact
    about the hardware just the same."""
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.device_power import PowerLockedError, set_device_watts
    from dsc_brain.space_model import upsert_space_device

    upsert_space_device(
        "2x4",
        {"device_id": "sf1000", "label": "SF1000", "watts": 100.0,
         "extra": {"catalog_id": "spider_farmer_sf1000"}},
    )
    with pytest.raises(PowerLockedError, match="product database"):
        set_device_watts("space:2x4:sf1000", 135, catalog_watts=100.0)


def test_an_unknown_device_id_is_refused(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.device_power import set_device_watts

    with pytest.raises(ValueError, match="no device"):
        set_device_watts("space:2x4:not_a_light", 100, catalog_watts=None)
    with pytest.raises(ValueError, match="not a powered seat"):
        set_device_watts("fan.dsc_hub_imaginary", 100, catalog_watts=None)
