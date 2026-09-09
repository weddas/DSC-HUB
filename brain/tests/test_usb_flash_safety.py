"""USB flash: the coordinator is never a target, hollow images never reach esptool,
the manifest says what is on disk, and the getter creates nothing."""

from __future__ import annotations

from pathlib import Path

import pytest

from dsc_brain import usb_flash


def test_bridge_is_not_offered() -> None:
    assert "bridge" not in usb_flash.KIT_ROLES
    assert "bridge" not in usb_flash.manifest_public()["roles"]


def test_firmware_dir_is_a_pure_read(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(usb_flash, "IMAGE_FIRMWARE_DIR", tmp_path / "nope")
    monkeypatch.setattr(usb_flash, "REPO_ROOT", tmp_path / "repo")
    d = usb_flash.firmware_dir()
    assert not d.exists()  # the old fallback mkdir'ed the empty dir it then reported


def test_binary_status_flags_hollow_and_foreign_files(tmp_path: Path) -> None:
    empty = tmp_path / "hub.bin"
    empty.write_bytes(b"")
    st = usb_flash.binary_status(empty, "esp32")
    assert st["exists"] and st["size"] == 0 and st["valid"] is False and "zero-byte" in st["reason"]

    text = tmp_path / "pot1.bin"
    text.write_bytes(b"<!DOCTYPE html>" * 100)
    st = usb_flash.binary_status(text, "esp32")
    assert st["valid"] is False and "0xE9" in st["reason"]

    esp8266 = tmp_path / "heater.bin"
    esp8266.write_bytes(bytes([0xE9]) + b"\x00" * 64)
    assert usb_flash.binary_status(esp8266, "esp8266")["valid"] is True

    esp32_merged = tmp_path / "hub2.bin"
    esp32_merged.write_bytes(b"\xff" * 0x1000 + bytes([0xE9]) + b"\x00" * 64)
    assert usb_flash.binary_status(esp32_merged, "esp32")["valid"] is True
    assert usb_flash.binary_status(esp32_merged, "esp8266")["valid"] is False


def test_manifest_reports_disk_truth(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(usb_flash, "firmware_dir", lambda: tmp_path)
    (tmp_path / "hub.bin").write_bytes(bytes([0xE9]) + b"\x00" * 10)
    (tmp_path / "pot1.bin").write_bytes(b"")
    m = usb_flash.manifest_public()
    assert m["firmware_dir_exists"] is True
    assert m["roles"]["hub"]["valid"] is True and m["roles"]["hub"]["sha256"]
    assert m["roles"]["pot1"]["valid"] is False and m["roles"]["pot1"]["reason"] == "zero-byte file"
    assert m["roles"]["heater"]["exists"] is False
    assert m["available_roles"] == ["hub"]


def test_coordinator_ports_are_excluded_and_refused(monkeypatch: pytest.MonkeyPatch) -> None:
    fake = [
        {"device": "/dev/ttyUSB0", "by_id": "/dev/serial/by-id/usb-Nabu_Casa_SkyConnect_v1.0_9e2adbd-if00-port0", "chip_hint": "", "flashable": False, "note": "Zigbee coordinator (skyconnect) — never a flash target"},
        {"device": "/dev/ttyUSB1", "by_id": "/dev/serial/by-id/usb-Silicon_Labs_CP2102-if00-port0", "chip_hint": "", "flashable": True, "note": ""},
    ]
    monkeypatch.setattr(usb_flash, "list_serial_ports", lambda: fake)
    t = usb_flash.flash_targets()
    assert [p["device"] for p in t["ports"]] == ["/dev/ttyUSB1"]
    assert [p["device"] for p in t["excluded"]] == ["/dev/ttyUSB0"]
    with pytest.raises(ValueError, match="refusing to flash"):
        usb_flash.refuse_if_coordinator("/dev/ttyUSB0")
    with pytest.raises(ValueError, match="refusing to flash"):
        usb_flash.refuse_if_coordinator("/dev/serial/by-id/usb-Nabu_Casa_SkyConnect_v1.0_9e2adbd-if00-port0")
    usb_flash.refuse_if_coordinator("/dev/ttyUSB1")  # fine


def test_coordinator_reason_by_name() -> None:
    assert usb_flash.coordinator_reason("/dev/serial/by-id/usb-ITead_Sonoff_Zigbee_3.0_USB_Dongle_Plus-if00") is not None
    assert usb_flash.coordinator_reason("/dev/serial/by-id/usb-Silicon_Labs_CP2102N-if00-port0") is None


def test_run_job_refuses_zero_byte_before_esptool(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    fw = temp_db.parent / "fw"
    fw.mkdir(exist_ok=True)
    (fw / "hub.bin").write_bytes(b"")
    monkeypatch.setattr(usb_flash, "firmware_dir", lambda: fw)
    monkeypatch.setattr(usb_flash, "_ensure_worker", lambda db_path=None: None)
    called: list[list[str]] = []

    def no_subprocess(cmd, **_kw):  # pragma: no cover - must not run
        called.append(cmd)
        raise AssertionError("esptool must not be invoked for a hollow image")

    monkeypatch.setattr(usb_flash.subprocess, "run", no_subprocess)
    job = usb_flash.queue_usb_flash("hub", "/dev/ttyUSB1", temp_db)
    usb_flash._run_job(job["job_id"], "hub", "/dev/ttyUSB1", temp_db)
    done = usb_flash.get_usb_flash_job(job["job_id"], temp_db)
    assert done and done["status"] == "failed" and "zero-byte" in done["detail"]
    assert called == []
