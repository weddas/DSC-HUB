"""Every hub entity the brain writes must name an object_id the firmware actually publishes.

ESPHome derives object_id from `name:` (lowercase, spaces -> _, other chars -> _), not from
`id:`. test_hub_time_ingest hand-fed `lights_on_time` — the id spelling the hub never
publishes — and three green tests sat on a write path that had never reached the device.
This test reads the names out of the hub's own YAML (dsc-hub-v4_0 plus its packages), so a
brain map that drifts from the firmware fails here instead of on a flowering tent.
"""

from __future__ import annotations

import glob
import re
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]


def _firmware_slugs() -> set[str]:
    slugs: set[str] = set()
    files = glob.glob(str(REPO / "firmware" / "v4" / "dsc-hub*.yaml")) + glob.glob(str(REPO / "firmware" / "v4" / "dsc-*common*.yaml"))
    assert files, "firmware/v4 hub YAML not found"
    for f in files:
        txt = Path(f).read_text(encoding="utf-8", errors="ignore")
        names = (
            re.findall(r'^\s*name:\s*"([^"]+)"', txt, re.M)
            + re.findall(r"^\s*name:\s*'([^']+)'", txt, re.M)
            + re.findall(r"^\s*name:\s*([A-Za-z][^\n#]*?)\s*$", txt, re.M)
        )
        for n in names:
            s = n.strip().lower().replace(" ", "_")
            slugs.add(re.sub(r"[^a-z0-9_-]", "_", s))
    return slugs


def _aliases(entity_id: str, primary: str, oid_to_entity: dict[str, str]) -> set[str]:
    return {primary} | {o for o, e in oid_to_entity.items() if e == entity_id}


def test_every_written_hub_entity_names_a_real_object_id():
    from dsc_brain import control_ops as co
    from dsc_brain import hub_controls as hc

    slugs = _firmware_slugs()
    maps = [
        ("switch", hc.HUB_SWITCH_ENTITY_TO_OID, hc.HUB_SWITCH_OID_TO_ENTITY),
        ("select", hc.HUB_SELECT_ENTITY_TO_OID, hc.HUB_SELECT_OID_TO_ENTITY),
        ("time", hc.HUB_TIME_ENTITY_TO_OID, hc.HUB_TIME_OID_TO_ENTITY),
        ("fan", hc.HUB_FAN_ENTITY_TO_OID, hc.HUB_FAN_OID_TO_ENTITY),
        ("light", hc.HUB_LIGHT_ENTITY_TO_OID, hc.HUB_LIGHT_OID_TO_ENTITY),
        ("number", co._NUMBER_ENTITY_TO_OID, hc.HUB_NUMBER_OID_TO_ENTITY),
    ]
    missing: list[str] = []
    for kind, e2o, o2e in maps:
        for eid, oid in e2o.items():
            if eid.startswith("datetime."):
                continue  # HA-shape alias of the time.* entity; same device object
            if not (_aliases(eid, oid, o2e) & slugs):
                missing.append(f"{kind}: {eid} -> {sorted(_aliases(eid, oid, o2e))}")
    assert not missing, "brain maps name object_ids the firmware never publishes:\n" + "\n".join(missing)


def test_the_write_path_requests_an_alias_the_firmware_has():
    """_hub_time resolves across aliases; the primary spelling alone is not enough."""
    from dsc_brain import hub_controls as hc

    slugs = _firmware_slugs()
    assert "lights-on_time" in slugs and "lights_on_time" not in slugs
    assert hc.HUB_TIME_OID_TO_ENTITY["lights-on_time"] == "time.dsc_hub_lights_on_time"
