"""Hub datetime (type: time) ingest into controls for light_loop schedule honesty."""

from types import SimpleNamespace

from dsc_brain.esphome_client import _hub_controls_from_states
from dsc_brain.hub_controls import HUB_TIME_OID_TO_ENTITY


def test_hub_time_oid_maps_lights_on():
    assert HUB_TIME_OID_TO_ENTITY["lights_on_time"] == "time.dsc_hub_lights_on_time"
    assert HUB_TIME_OID_TO_ENTITY["clone_lights_on_time"] == "time.dsc_hub_clone_lights_on_time"


def test_hub_controls_ingest_time_state():
    key = 42
    st = SimpleNamespace(hour=6, minute=30, second=0, missing_state=False)
    controls = _hub_controls_from_states(
        {key: st},
        {key: "lights_on_time"},
        entities=[],
    )
    assert controls["time.dsc_hub_lights_on_time"]["state"] == "06:30:00"


def test_hub_controls_missing_time_is_empty():
    key = 7
    st = SimpleNamespace(hour=0, minute=0, second=0, missing_state=True)
    controls = _hub_controls_from_states(
        {key: st},
        {key: "lights_on_time"},
        entities=[],
    )
    assert controls["time.dsc_hub_lights_on_time"]["state"] == ""
