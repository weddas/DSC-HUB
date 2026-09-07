# brain/tests/test_cameras.py — cameras: records, capture policy, frames on disk, API.
from __future__ import annotations

import struct
import time
from pathlib import Path

import pytest

from dsc_brain import cameras
from dsc_brain.cameras import (
    CaptureError,
    assemble_timelapse,
    auto_assemble_due,
    camera_storage,
    capture_now,
    delete_camera,
    first_jpeg_frame,
    get_camera,
    get_status,
    jpeg_size,
    list_cameras,
    list_days,
    list_frames,
    password_for,
    poll_once,
    prune_frames,
    public_camera,
    should_capture,
    store_frame,
    upsert_camera,
    validate_source,
)


def fake_jpeg(width: int = 640, height: int = 480, payload: bytes = b"\x00" * 64) -> bytes:
    """SOI · APP0 · SOF0(w×h) · SOS · payload · EOI — enough for jpeg_size and the frame parser."""
    app0 = b"\xff\xe0" + struct.pack(">H", 16) + b"JFIF\x00" + b"\x01\x01\x00\x00\x01\x00\x01\x00\x00"
    sof = b"\xff\xc0" + struct.pack(">HBHHB", 11, 8, height, width, 1) + b"\x01\x11\x00"
    sos = b"\xff\xda" + struct.pack(">HB", 8, 1) + b"\x01\x00\x00\x3f\x00"
    return b"\xff\xd8" + app0 + sof + sos + payload + b"\xff\xd9"


@pytest.fixture()
def media(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> Path:
    monkeypatch.setenv("DSC_DATA", str(tmp_path))
    return tmp_path


# ---- JPEG helpers ---------------------------------------------------------------------


def test_jpeg_size_and_first_frame_from_mjpeg_stream() -> None:
    frame = fake_jpeg(1280, 720)
    assert jpeg_size(frame) == (1280, 720)
    assert jpeg_size(b"not a jpeg") is None
    boundary = b"--frame\r\nContent-Type: image/jpeg\r\nContent-Length: %d\r\n\r\n" % len(frame)
    stream = boundary + frame + b"\r\n" + boundary + fake_jpeg(320, 240) + b"\r\n"
    chunks = [stream[i : i + 7] for i in range(0, len(stream), 7)]
    assert first_jpeg_frame(chunks) == frame
    # A plain image body works the same way.
    assert first_jpeg_frame([frame]) == frame
    with pytest.raises(CaptureError):
        first_jpeg_frame([b"<html>not a camera</html>"])
    with pytest.raises(CaptureError):
        first_jpeg_frame([frame[:-2]])  # never reaches EOI


# ---- records ----------------------------------------------------------------------------


def test_upsert_validates_and_masks_password(tmp_path: Path, media: Path) -> None:
    db = tmp_path / "ops.sqlite3"
    cam = upsert_camera(
        "tent-cam",
        {"space_id": "4x8", "label": "4×8 corner", "source_kind": "snapshot", "source": "http://10.42.0.60/capture", "username": "grow", "password": "secret"},
        db_path=db,
        now=1000.0,
    )
    assert cam["camera_id"] == "tent-cam"
    assert cam["interval_s"] == 600 and cam["lights_on_only"] is True and cam["keep_days"] == 30
    assert password_for("tent-cam", db) == "secret"
    pub = public_camera(cam, db)
    assert pub["password_set"] is True
    assert "password" not in pub and "secret" not in str(pub)
    # Patch without a password keeps it; clear_password removes it.
    upsert_camera("tent-cam", {"interval_s": 120}, db_path=db)
    assert password_for("tent-cam", db) == "secret"
    assert get_camera("tent-cam", db)["interval_s"] == 120
    upsert_camera("tent-cam", {"clear_password": True}, db_path=db)
    assert password_for("tent-cam", db) == ""

    with pytest.raises(ValueError):
        upsert_camera("Bad Id", {"space_id": "4x8", "source_kind": "snapshot", "source": "http://x/"}, db_path=db)
    with pytest.raises(ValueError):
        upsert_camera("c2", {"space_id": "attic", "source_kind": "snapshot", "source": "http://x/"}, db_path=db)
    with pytest.raises(ValueError):
        upsert_camera("c2", {"space_id": "2x4", "source_kind": "webcam", "source": "http://x/"}, db_path=db)
    with pytest.raises(ValueError):
        upsert_camera("c2", {"space_id": "2x4", "source_kind": "rtsp", "source": "http://x/"}, db_path=db)
    with pytest.raises(ValueError):
        upsert_camera("c2", {"space_id": "2x4", "source_kind": "snapshot", "source": "http://x/", "interval_s": 5}, db_path=db)
    assert [c["camera_id"] for c in list_cameras(db)] == ["tent-cam"]
    assert delete_camera("tent-cam", db_path=db) is True
    assert list_cameras(db) == []


def test_source_kinds_normalise() -> None:
    assert validate_source("usb", "", {}) == "/dev/video0"
    with pytest.raises(ValueError):
        validate_source("usb", "COM3", {})
    extra: dict = {}
    assert validate_source("motioneye", "10.42.0.61", extra) == "10.42.0.61"
    assert extra["camera_no"] == 1
    with pytest.raises(ValueError):
        validate_source("motioneye", "http://10.42.0.61", {})
    assert cameras.motioneye_stream_url({"source": "10.42.0.61", "extra": {"camera_no": 2}}) == "http://10.42.0.61:8082/"
    assert cameras.motioneye_stream_url({"source": "pi-cam.local", "extra": {"camera_no": 1, "stream_port": 9000}}) == "http://pi-cam.local:9000/"
    assert validate_source("rtsp", "rtsp://10.42.0.62:554/stream1", {}) == "rtsp://10.42.0.62:554/stream1"
    with pytest.raises(ValueError):
        validate_source("mjpeg", "10.42.0.62/stream", {})


# ---- frames on disk ----------------------------------------------------------------------


def test_store_list_prune_frames(media: Path) -> None:
    day = 86400
    t0 = time.mktime(time.strptime("2026-09-01 10:00:00", "%Y-%m-%d %H:%M:%S"))
    for i in range(5):
        store_frame("cam", fake_jpeg(payload=b"\x00" * 1000), now=t0 + i * day)
    assert cameras.latest_frame_path("cam") is not None
    days = list_days("cam")
    assert [d["day"] for d in days] == ["2026-09-01", "2026-09-02", "2026-09-03", "2026-09-04", "2026-09-05"]
    frames = list_frames("cam")
    assert frames[0]["name"].startswith("2026-09-05/") and len(frames) == 5
    assert list_frames("cam", "2026-09-03")[0]["name"] == "2026-09-03/100000.jpg"
    assert cameras.frame_path("cam", "2026-09-03/100000.jpg") is not None
    assert cameras.frame_path("cam", "../latest.jpg") is None
    st = camera_storage("cam")
    assert st["frames"] == 5 and st["bytes"] > 5000

    # keep_days: at 2026-09-06 keep 2 days → 09-04 and 09-05 survive.
    res = prune_frames("cam", keep_days=2, cap_gb=0, now=t0 + 5 * day)
    assert res["deleted_days"] == ["2026-09-01", "2026-09-02", "2026-09-03"]
    assert [d["day"] for d in list_days("cam")] == ["2026-09-04", "2026-09-05"]
    # cap: a tiny cap drops the oldest day until it fits; latest.jpg is untouched.
    res = prune_frames("cam", keep_days=0, cap_gb=1500 / 1024**3, now=t0 + 5 * day)
    assert res["deleted_days"] == ["2026-09-04"]
    assert cameras.latest_frame_path("cam") is not None


# ---- capture policy -----------------------------------------------------------------------


def test_should_capture_gates() -> None:
    cam = {"enabled": True, "interval_s": 600, "lights_on_only": True, "space_id": "4x8"}
    assert should_capture(cam, {"last_attempt_at": None}, {"window_4x8_open": True}, 1000.0) == (True, "")
    assert should_capture(cam, {"last_attempt_at": 900.0}, {"window_4x8_open": True}, 1000.0) == (False, "waiting")
    assert should_capture(cam, {"last_attempt_at": 100.0}, {"window_4x8_open": False}, 1000.0) == (False, "lights off")
    assert should_capture(cam, {"last_attempt_at": 100.0}, {"window_4x8_open": "off"}, 1000.0) == (False, "lights off")
    go, reason = should_capture(cam, {"last_attempt_at": 100.0}, {}, 1000.0)
    assert go and "unknown" in reason
    assert should_capture({**cam, "lights_on_only": False}, {}, {"window_4x8_open": False}, 1000.0) == (True, "")
    assert should_capture({**cam, "enabled": False}, {}, None, 1000.0) == (False, "disabled")
    # The room has no window — lights-on-only cannot gate it, so it captures.
    assert should_capture({**cam, "space_id": "grow_room"}, {}, {}, 1000.0) == (True, "")


def test_capture_now_records_ok_and_failure(tmp_path: Path, media: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    db = tmp_path / "ops.sqlite3"
    upsert_camera("c1", {"space_id": "2x4", "source_kind": "mjpeg", "source": "http://10.42.0.61:8081/"}, db_path=db)
    monkeypatch.setattr(cameras, "capture_frame", lambda cam, pw, **kw: fake_jpeg(800, 600))
    res = capture_now("c1", db_path=db, now=5000.0)
    assert res["ok"] and res["width"] == 800
    st = get_status("c1", db)
    assert st["last_ok_at"] == 5000.0 and st["frames"] == 1 and st["last_error"] == ""
    assert cameras.latest_frame_path("c1") is not None

    def boom(cam, pw, **kw):
        raise CaptureError("cannot reach the camera")

    monkeypatch.setattr(cameras, "capture_frame", boom)
    res = capture_now("c1", db_path=db, now=6000.0)
    assert res == {"ok": False, "error": "cannot reach the camera"}
    st = get_status("c1", db)
    assert st["last_ok_at"] == 5000.0 and st["last_attempt_at"] == 6000.0
    assert st["consecutive_failures"] == 1 and st["last_error"] == "cannot reach the camera"
    with pytest.raises(KeyError):
        capture_now("nope", db_path=db)


def test_poll_once_respects_interval_and_lights(tmp_path: Path, media: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    db = tmp_path / "ops.sqlite3"
    upsert_camera("c1", {"space_id": "4x8", "source_kind": "snapshot", "source": "http://cam/capture", "interval_s": 60}, db_path=db)
    upsert_camera("c2", {"space_id": "2x4", "source_kind": "snapshot", "source": "http://cam2/capture", "interval_s": 60, "lights_on_only": False}, db_path=db)
    calls: list[str] = []

    def grab(cam, pw, **kw):
        calls.append(cam["camera_id"])
        return fake_jpeg()

    monkeypatch.setattr(cameras, "capture_frame", grab)
    hub = {"window_4x8_open": False, "window_2x4_open": False}
    ev = poll_once(hub, now=1000.0, db_path=db)
    assert calls == ["c2"]
    assert any(e["camera_id"] == "c1" and e["action"] == "skip" and e["reason"] == "lights off" for e in ev)
    assert get_status("c1", db)["skipped_reason"] == "lights off"
    # Lights come on: c1 captures; c2 waits for its interval.
    poll_once({"window_4x8_open": True}, now=1030.0, db_path=db)
    assert calls == ["c2", "c1"]
    poll_once({"window_4x8_open": True}, now=1100.0, db_path=db)
    assert calls == ["c2", "c1", "c2", "c1"]


def test_auto_assemble_due() -> None:
    now = time.mktime(time.strptime("2026-09-08 03:00:00", "%Y-%m-%d %H:%M:%S"))
    assert auto_assemble_due({"extra": {}}, {}, now) is None
    assert auto_assemble_due({"extra": {"assemble": "daily"}}, {"last_assemble_day": ""}, now) == ("2026-09-07", "2026-09-07")
    assert auto_assemble_due({"extra": {"assemble": "daily"}}, {"last_assemble_day": "2026-09-07"}, now) is None
    # 2026-09-07 is a Monday → the week that ended most recently is Mon 08-31 … Sun 09-06.
    assert auto_assemble_due({"extra": {"assemble": "weekly"}}, {"last_assemble_day": ""}, now) == ("2026-08-31", "2026-09-06")


def test_assemble_timelapse_needs_ffmpeg_and_frames(tmp_path: Path, media: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    db = tmp_path / "ops.sqlite3"
    upsert_camera("c1", {"space_id": "4x8", "source_kind": "snapshot", "source": "http://cam/capture"}, db_path=db)
    monkeypatch.setattr(cameras, "ffmpeg_bin", lambda db_path=None: None)
    with pytest.raises(CaptureError, match="ffmpeg"):
        assemble_timelapse("c1", "2026-09-01", "2026-09-01", db_path=db)
    monkeypatch.setattr(cameras, "ffmpeg_bin", lambda db_path=None: "/usr/bin/ffmpeg")
    with pytest.raises(CaptureError, match="fewer than two"):
        assemble_timelapse("c1", "2026-09-01", "2026-09-01", db_path=db)
    with pytest.raises(CaptureError):
        assemble_timelapse("c1", "2026-09-02", "2026-09-01", db_path=db)


# ---- API ----------------------------------------------------------------------------------


def test_cameras_api(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    from dsc_brain import space_journal, space_model

    for mod in (space_journal, space_model):
        monkeypatch.setattr(mod, "DEFAULT_DB", temp_db, raising=False)
    monkeypatch.setattr(cameras, "capture_frame", lambda cam, pw, **kw: fake_jpeg(1024, 768))
    from fastapi.testclient import TestClient

    from dsc_brain.api import app, is_api_path

    assert is_api_path("cameras/c1/latest.jpg")
    client = TestClient(app)

    r = client.get("/cameras")
    assert r.status_code == 200
    body = r.json()
    assert body["cameras"] == [] and [k["id"] for k in body["source_kinds"]] == list(cameras.SOURCE_KINDS)

    r = client.put("/cameras/tent-4x8", json={"space_id": "4x8", "label": "4×8", "source_kind": "motioneye", "source": "10.42.0.61", "extra": {"camera_no": 1}, "password": "pw"})
    assert r.status_code == 200, r.text
    cam = r.json()
    assert cam["stream_url"] == "http://10.42.0.61:8081/" and cam["password_set"] is True and cam["has_latest"] is False

    r = client.put("/cameras/tent-4x8", json={"space_id": "loft"})
    assert r.status_code == 400 and "unknown zone" in r.text

    assert client.get("/cameras/tent-4x8/latest.jpg").status_code == 404

    r = client.post("/cameras/tent-4x8/capture")
    assert r.status_code == 200 and r.json()["ok"] is True
    r = client.get("/cameras/tent-4x8/latest.jpg")
    assert r.status_code == 200 and r.headers["content-type"] == "image/jpeg"
    assert r.headers["cache-control"] == "no-store"
    assert jpeg_size(r.content) == (1024, 768)

    r = client.get("/cameras/tent-4x8/frames")
    assert r.status_code == 200 and len(r.json()["frames"]) == 1
    name = r.json()["frames"][0]["name"]
    assert client.get(f"/cameras/tent-4x8/frames/{name}").status_code == 200
    assert client.get("/cameras/tent-4x8/frames/%2e%2e/latest.jpg").status_code in (400, 404)

    r = client.get("/spaces")
    space = next(s for s in r.json()["spaces"] if s["space_id"] == "4x8")
    assert space["cameras"][0]["camera_id"] == "tent-4x8" and space["cameras"][0]["has_latest"] is True

    r = client.post("/cameras/test", json={"source_kind": "snapshot", "source": "http://cam/capture"})
    assert r.status_code == 200 and r.json()["preview"].startswith("data:image/jpeg;base64,")

    r = client.get("/cameras/storage")
    assert r.status_code == 200 and r.json()["total_bytes"] > 0

    r = client.delete("/cameras/tent-4x8", params={"delete_media": "true"})
    assert r.status_code == 200 and r.json()["deleted"] is True
    assert client.get("/cameras/tent-4x8/latest.jpg").status_code == 404
    assert client.get("/cameras").json()["cameras"] == []
