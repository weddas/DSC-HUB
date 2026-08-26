from dsc_brain.esphome_client import _finalize_hub_binaries
from dsc_brain.fleet_state import get_fleet_state

s = get_fleet_state()
print("before", len(s.hub.values.get("binaries") or {}), s.hub.values.get("binaries"))
print("pots", list(s.pots.keys()))
_finalize_hub_binaries(s)
print("after", s.hub.values.get("binaries"))
