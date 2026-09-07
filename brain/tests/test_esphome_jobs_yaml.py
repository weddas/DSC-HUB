"""ESPHome job runner: every seat maps to a yaml that really exists in firmware/v4."""

from __future__ import annotations

import tempfile
from pathlib import Path

import pytest

from dsc_brain.paths import REPO_ROOT
from dsc_brain.settings import init_settings_db


@pytest.fixture()
def temp_db(monkeypatch: pytest.MonkeyPatch) -> Path:
    with tempfile.TemporaryDirectory() as tmp:
        db = Path(tmp) / "dsc_ops.sqlite3"
        monkeypatch.setenv("DSC_DATA", str(Path(tmp)))
        monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", db)
        init_settings_db(db)
        yield db


def test_every_seat_yaml_exists_in_firmware_tree() -> None:
    from dsc_brain.esphome_jobs import SEAT_YAML

    fw = REPO_ROOT / "firmware" / "v4"
    if not fw.is_dir():
        pytest.skip("firmware/v4 not in this checkout")
    missing = {seat: name for seat, name in SEAT_YAML.items() if not (fw / name).is_file()}
    assert not missing, f"SEAT_YAML points at files that do not exist: {missing}"


def test_queue_refuses_missing_yaml_at_the_button(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    from dsc_brain import esphome_jobs as ej

    with tempfile.TemporaryDirectory() as tmp:
        monkeypatch.setattr(ej, "project_dir", lambda: Path(tmp))
        (Path(tmp) / "dsc-hub.yaml").write_text("esphome:\n", encoding="utf-8")
        monkeypatch.setitem(ej.SEAT_YAML, "pot2", "DSC-Probe2.yaml")
        with pytest.raises(ValueError, match="DSC-Probe2.yaml not found"):
            ej.queue_job("pot2", "compile", temp_db)
        # a seat whose file exists still queues
        job = ej.queue_job("hub", "compile", temp_db)
        assert job["yaml_name"] == "dsc-hub.yaml" and job["status"] == "queued"
