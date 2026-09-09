"""Guards for three ways the brain used to hand the operator something untrue.

Each of these was a value or a line that looked authoritative and was not: a CO2 ppm
derived from an unconnected pin, a one-time migration advisory re-announced as an ALERT on
every restart, and internal task jargon written into the operator's own history.
"""

from __future__ import annotations

from pathlib import Path

import pytest


# --- CO2: a computed value that looks like a reading -----------------------------------


def test_unbound_co2_publishes_no_ppm() -> None:
    """0.142 V is a floating pin. The hub still turns it into a confident 172.87 ppm."""
    from dsc_brain.esphome_client import _scrub_unbound_co2

    values = {"co2_sensor_voltage": 0.142, "dynamic_co2_ppm": 172.87}
    _scrub_unbound_co2(values)

    assert values["dynamic_co2_ppm"] is None, "an unbound CO2 pin must not publish a ppm"
    assert values["co2_bound"] is False
    # The voltage is a real measurement of the pin and is the evidence for the absence.
    assert values["co2_sensor_voltage"] == 0.142


def test_bound_co2_passes_through() -> None:
    from dsc_brain.esphome_client import _scrub_unbound_co2

    values = {"co2_sensor_voltage": 1.85, "dynamic_co2_ppm": 431.0}
    _scrub_unbound_co2(values)

    assert values["dynamic_co2_ppm"] == 431.0
    assert values["co2_bound"] is True


def test_co2_scrub_is_inert_when_the_hub_reports_no_co2_fields() -> None:
    from dsc_brain.esphome_client import _scrub_unbound_co2

    values: dict[str, object] = {"temp_c": 24.6}
    _scrub_unbound_co2(values)

    assert "co2_bound" not in values
    assert values == {"temp_c": 24.6}


def test_missing_voltage_is_treated_as_unbound() -> None:
    """No voltage at all is not evidence of a sensor — never guess a ppm is real."""
    from dsc_brain.esphome_client import _scrub_unbound_co2

    values = {"dynamic_co2_ppm": 172.87}
    _scrub_unbound_co2(values)

    assert values["dynamic_co2_ppm"] is None
    assert values["co2_bound"] is False


# --- The leaf-VPD advisory: announced once, ever ----------------------------------------


def test_leaf_vpd_advisory_is_announced_once_per_database(
    temp_db: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    """It used to re-stamp the journal on every brain restart — 5 times in 30 minutes,
    because both the module guard and record_grow_log's dedupe are process-scoped."""
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))

    import dsc_brain.climate_math as cm
    from dsc_brain.event_log import list_grow_log

    def announce_as_a_fresh_process() -> None:
        cm._LEAF_VPD_REBASE_NOTED = False  # what a restart resets
        cm._note_leaf_vpd_rebase()

    announce_as_a_fresh_process()
    announce_as_a_fresh_process()
    announce_as_a_fresh_process()

    hits = [e for e in list_grow_log(hours=24.0, limit=500) if "leaf VPD definition" in e["message"]]
    assert len(hits) == 1, f"advisory announced {len(hits)} times across restarts"


def test_leaf_vpd_advisory_does_not_outrank_real_alerts() -> None:
    """The SPA tagged it ALERT purely because the text contains 'VPD'. The prefix is the
    contract that keeps an informational notice out of the alert lane."""
    import dsc_brain.climate_math as cm

    assert cm._LEAF_VPD_REBASE_MSG.lower().startswith("advisory:")


# --- Zigbee tasks: the operator's history is not a debug channel ------------------------


def test_zigbee_policy_journal_lines_carry_no_internal_jargon() -> None:
    """'zigbee task CLEAR banner only seat=… ieee=0x… (OOS not policy-owned)' appeared in
    the operator's 24 h history about 7 times a day. ieee addresses and phrases like
    'policy-owned' are developer language for a no-op."""
    import inspect

    from dsc_brain import zigbee_policies

    source = inspect.getsource(zigbee_policies)
    journal_lines = [
        line for line in source.splitlines() if "record_grow_log(" in line and "def " not in line
    ]
    assert journal_lines, "expected the policy module to journal something"

    for line in journal_lines:
        assert "ieee=" not in line, f"raw ieee address in an operator journal line: {line.strip()}"
        assert "zigbee task" not in line, f"internal task jargon in a journal line: {line.strip()}"
        assert "policy-owned" not in line, f"internal phrasing in a journal line: {line.strip()}"
