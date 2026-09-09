"""The SPA's entity-id maps must stay generated from the Python tables.

Home Assistant is gone but the ``<domain>.dsc_<thing>_<metric>`` dialect is
still the control surface. Before codegen, ~660 of these ids were hand-synced
across Python and TypeScript, and a rename on one side failed *silently* on the
Pi: the SPA asked for an id nothing emitted, the dial went blank, and actuation
quietly stopped. This test is where that failure now lands instead — loudly, in
CI, before anything reaches the grow.

If it fails: run ``python brain/scripts/gen_entity_maps.py`` and commit the
regenerated frontend/src/lib/generated/*.gen.ts.
"""

from __future__ import annotations

import importlib.util
import sys
from pathlib import Path

import pytest

from dsc_brain import entity_tables

REPO_ROOT = Path(__file__).resolve().parents[2]
GEN_SCRIPT = REPO_ROOT / "brain" / "scripts" / "gen_entity_maps.py"


def _load_generator():
    spec = importlib.util.spec_from_file_location("_dsc_gen_entity_maps", GEN_SCRIPT)
    assert spec and spec.loader
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


def test_generator_script_exists() -> None:
    assert GEN_SCRIPT.is_file(), f"missing entity-map generator at {GEN_SCRIPT}"


def test_generated_typescript_matches_python_tables() -> None:
    """Check mode: the committed .gen.ts must equal a fresh render."""
    gen = _load_generator()
    problems = gen.check()
    if problems:
        pytest.fail(
            "frontend/src/lib/generated/*.gen.ts has drifted from "
            "brain/dsc_brain/entity_tables.py.\n"
            "Run `python brain/scripts/gen_entity_maps.py` and commit the result.\n\n"
            + "\n".join(problems),
            pytrace=False,
        )


def test_check_mode_catches_a_renamed_entity_id(tmp_path: Path) -> None:
    """A one-sided rename has to be caught — prove check mode actually bites."""
    gen = _load_generator()
    target = gen.GEN_DIR / "entityFleetMap.gen.ts"
    original = target.read_text(encoding="utf-8")
    assert "sensor.dsc_hub_tent_temperature" in original
    try:
        target.write_text(
            original.replace("sensor.dsc_hub_tent_temperature", "sensor.dsc_hub_tent_temp"),
            encoding="utf-8",
            newline="\n",
        )
        problems = gen.check()
        assert problems, "check mode did not notice a renamed entity id"
        assert any("entityFleetMap.gen.ts" in p for p in problems)
    finally:
        target.write_text(original, encoding="utf-8", newline="\n")
    assert not gen.check(), "check mode left the tree dirty"


def test_check_mode_tolerates_crlf_checkouts() -> None:
    """core.autocrlf=true hands Windows a CRLF checkout — that is not drift."""
    gen = _load_generator()
    target = gen.GEN_DIR / "kitProbes.gen.ts"
    original = target.read_bytes()
    try:
        target.write_bytes(original.replace(b"\r\n", b"\n").replace(b"\n", b"\r\n"))
        assert not gen.check(), "check mode mistook CRLF line endings for drift"
    finally:
        target.write_bytes(original)


def test_brain_uses_the_shared_tables() -> None:
    """fleet_state must read the SoT tables, not a private copy of them."""
    from dsc_brain import fleet_state

    assert fleet_state._SONOFF_RELAY is entity_tables.SONOFF_RELAY
    assert fleet_state._SONOFF_FW is entity_tables.SONOFF_FW
    assert fleet_state._IN_SERVICE_ENTITIES is entity_tables.IN_SERVICE_ENTITIES


def test_entity_table_rows_are_well_formed() -> None:
    """Cheap shape guard so a typo in the SoT is caught at the source."""
    for entity_id, ref in entity_tables.ENTITY_FLEET_MAP.items():
        assert entity_id.count(".") == 1, entity_id
        domain, object_id = entity_id.split(".")
        assert domain in {"sensor", "binary_sensor", "switch", "input_boolean"}, entity_id
        assert object_id.startswith("dsc_"), entity_id
        assert set(ref) <= {"seat_id", "metric", "binary", "text"}, entity_id
        assert ref["seat_id"] and ref["metric"], entity_id
        assert not (ref.get("binary") and ref.get("text")), entity_id

    seen: set[str] = set()
    for row in entity_tables.KIT_DEFS:
        assert row["id"] not in seen, f"duplicate kit def {row['id']}"
        seen.add(row["id"])
        assert row["label"], row["id"]
