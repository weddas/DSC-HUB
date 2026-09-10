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
    # zone/name/yymmdd/HHMM.jpg — day is a folder, and both levels sort chronologically.
    assert frames[0]["name"] == "260905/1000.jpg" and len(frames) == 5
    assert list_frames("cam", "2026-09-03")[0]["name"] == "260903/1000.jpg"
    assert cameras.frame_path("cam", "260903/1000.jpg") is not None
    assert cameras.frame_path("cam", "../../etc/passwd") is None
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


# ---------------------------------------------------------------------------------------
# USB discovery — the picker must only offer nodes that can actually deliver a frame.
#
# The live rig found this the hard way: the brain container mapped /dev/null onto
# /dev/video0 (compose's "no camera attached" placeholder), and discovery read the node's
# NAME out of the host's /sys, which is bind-mounted and numbered independently of the
# container's /dev. So the picker confidently offered "/dev/video0 — Brio 500" for a
# /dev/null, and testing it failed with ffmpeg's bare "Inappropriate ioctl for device".
# ---------------------------------------------------------------------------------------


def _fake_cap(card: str, bus_info: str, *, capture: bool) -> dict[str, object]:
    return {
        "driver": "uvcvideo",
        "card": card,
        "bus_info": bus_info,
        "capabilities": 0x84A00001,
        "device_caps": 0x04200001 if capture else 0x04A00000,
        "is_capture": capture,
    }


def test_usb_discovery_lists_only_usb_capture_nodes(monkeypatch: pytest.MonkeyPatch, tmp_path: Path) -> None:
    """Metadata nodes, the Pi's own ISP nodes and a /dev/null placeholder are all excluded.

    Mirrors the real rig: two Brio 500s, each with a capture node and a metadata node, plus
    the bcm2835 ISP nodes the Pi always has. Only video0 and video2 can yield frames.
    """
    dev = tmp_path / "dev"
    dev.mkdir()
    for n in (0, 1, 2, 3, 14, 99):
        (dev / f"video{n}").write_bytes(b"")
    (dev / "videoX").write_bytes(b"")  # not a numbered node; must not be probed

    caps = {
        str(dev / "video0"): _fake_cap("Brio 500", "usb-xhci-hcd.1-1.2", capture=True),
        str(dev / "video1"): _fake_cap("Brio 500", "usb-xhci-hcd.1-1.2", capture=False),
        str(dev / "video2"): _fake_cap("Brio 500", "usb-xhci-hcd.1-1.4", capture=True),
        str(dev / "video3"): _fake_cap("Brio 500", "usb-xhci-hcd.1-1.4", capture=False),
        str(dev / "video14"): _fake_cap("bcm2835-isp", "platform:bcm2835-isp", capture=True),
        str(dev / "video99"): None,  # the /dev/null placeholder: ENOTTY, not a v4l2 node
    }
    monkeypatch.setattr(cameras, "query_v4l2_capability", lambda d: caps.get(d))
    monkeypatch.setattr(
        cameras,
        "_by_id_index",
        lambda: {
            str(dev / "video0"): "usb-046d_Brio_500_2234LZ50XG38-video-index0",
            str(dev / "video1"): "usb-046d_Brio_500_2234LZ50XG38-video-index1",
            str(dev / "video2"): "usb-046d_Brio_500_2234LZ52FKD8-video-index0",
        },
    )

    got = cameras.list_usb_video_devices(dev_root=dev)
    assert [d["device"] for d in got] == [str(dev / "video0"), str(dev / "video2")]
    # Two identical cameras must be tellable apart, so the serial has to reach the label.
    assert got[0]["serial"] == "2234LZ50XG38"
    assert got[1]["serial"] == "2234LZ52FKD8"
    assert got[0]["label"] != got[1]["label"]
    assert got[0]["by_id"].endswith("usb-046d_Brio_500_2234LZ50XG38-video-index0")


def test_enotty_is_explained_not_parroted(monkeypatch: pytest.MonkeyPatch) -> None:
    """ffmpeg's bare errno text is useless on its own; the operator gets the actual cause."""
    monkeypatch.setattr(cameras, "query_v4l2_capability", lambda d: None)
    msg = cameras._explain_capture_failure(
        "/dev/video0: Inappropriate ioctl for device", ["-f", "v4l2", "-i", "/dev/video0"]
    )
    assert "DSC_CAMERA_DEVICE" in msg and "/dev/video0" in msg

    # A metadata node IS a v4l2 device, so it gets the other explanation.
    monkeypatch.setattr(
        cameras,
        "query_v4l2_capability",
        lambda d: _fake_cap("Brio 500", "usb-xhci-hcd.1-1.2", capture=False),
    )
    msg2 = cameras._explain_capture_failure(
        "Inappropriate ioctl for device", ["-f", "v4l2", "-i", "/dev/video1"]
    )
    assert "metadata" in msg2

    # Anything unrelated is passed through untouched.
    assert cameras._explain_capture_failure("No such file or directory", ["-i", "/dev/video9"]) == (
        "No such file or directory"
    )


def test_usb_source_accepts_stable_by_id_path() -> None:
    by_id = "/dev/v4l/by-id/usb-046d_Brio_500_2234LZ50XG38-video-index0"
    assert cameras.validate_source("usb", by_id, {}) == by_id
    with pytest.raises(ValueError):
        cameras.validate_source("usb", "/etc/passwd", {})


def test_query_capability_reads_device_caps_not_capabilities(
    monkeypatch: pytest.MonkeyPatch, tmp_path: Path
) -> None:
    """The capture node and the metadata node of one webcam are told apart ONLY by device_caps.

    These are the exact numbers the live Brio 500 reports. Both nodes advertise the same
    `capabilities` word — 0x84a00001, VIDEO_CAPTURE and META_CAPTURE together — because
    `capabilities` is the union across every node of the physical device. Reading it
    instead of `device_caps` marks the metadata node as a camera, and picking that node is
    what makes ffmpeg answer "Inappropriate ioctl for device".
    """
    import sys
    import types

    node = tmp_path / "video0"
    node.write_bytes(b"")

    def _payload(caps: int, device_caps: int) -> bytes:
        return struct.pack(
            "<16s32s32sIII",
            b"uvcvideo",
            b"Brio 500",
            b"usb-xhci-hcd.1-1.2",
            0,
            caps,
            device_caps,
        ) + b"\0" * 12

    cases = {
        "capture": (0x84A00001, 0x04200001, True),
        "metadata": (0x84A00001, 0x04A00000, False),
    }
    for label, (caps, dcaps, want_capture) in cases.items():
        fake = types.ModuleType("fcntl")
        fake.ioctl = lambda fd, req, buf: _payload(caps, dcaps)  # type: ignore[attr-defined]
        monkeypatch.setitem(sys.modules, "fcntl", fake)
        got = cameras.query_v4l2_capability(str(node))
        assert got is not None, label
        assert got["card"] == "Brio 500"
        assert got["is_capture"] is want_capture, f"{label}: device_caps must decide"

    # A node that is not v4l2 at all (the /dev/null placeholder) reports ENOTTY.
    fake = types.ModuleType("fcntl")

    def _enotty(fd: int, req: int, buf: bytes) -> bytes:
        raise OSError(25, "Inappropriate ioctl for device")

    fake.ioctl = _enotty  # type: ignore[attr-defined]
    monkeypatch.setitem(sys.modules, "fcntl", fake)
    assert cameras.query_v4l2_capability(str(node)) is None


# ---------------------------------------------------------------------------------------
# Capture resolution. ffmpeg told nothing takes the driver's DEFAULT format — pixel format
# index 0 at its default size, which on these Brio 500s is YUYV 640x480 from a sensor that
# does 1920x1080. A canopy timelapse at 0.3 MP is most of the camera thrown away.
# ---------------------------------------------------------------------------------------


def test_usb_capture_asks_for_the_largest_mjpg_mode(monkeypatch: pytest.MonkeyPatch) -> None:
    calls: list[list[str]] = []

    def _fake_ffmpeg(args, timeout, db_path=None):  # type: ignore[no-untyped-def]
        calls.append(list(args))
        return b"\xff\xd8\xff\xd9"

    monkeypatch.setattr(cameras, "_ffmpeg_frame", _fake_ffmpeg)
    monkeypatch.setattr(cameras, "best_usb_frame_size", lambda d: (1920, 1080))

    cameras.capture_frame({"source_kind": "usb", "source": "/dev/video0"}, "")
    assert calls[0] == [
        "-f", "v4l2",
        "-input_format", "mjpeg",
        "-video_size", "1920x1080",
        "-i", "/dev/video0",
    ]


def test_usb_capture_honours_a_pinned_size(monkeypatch: pytest.MonkeyPatch) -> None:
    calls: list[list[str]] = []
    monkeypatch.setattr(
        cameras, "_ffmpeg_frame",
        lambda args, timeout, db_path=None: (calls.append(list(args)), b"\xff\xd8\xff\xd9")[1],
    )
    monkeypatch.setattr(cameras, "best_usb_frame_size", lambda d: (1920, 1080))
    cameras.capture_frame(
        {"source_kind": "usb", "source": "/dev/video0", "extra": {"width": 1280, "height": 720}}, ""
    )
    assert "1280x720" in calls[0]


def test_usb_capture_falls_back_when_the_mode_is_refused(monkeypatch: pytest.MonkeyPatch) -> None:
    """A camera stuck at its default size still beats a grow log that stops recording."""
    calls: list[list[str]] = []

    def _fake_ffmpeg(args, timeout, db_path=None):  # type: ignore[no-untyped-def]
        calls.append(list(args))
        if "-video_size" in args:
            raise cameras.CaptureError("Device or resource busy")
        return b"\xff\xd8\xff\xd9"

    monkeypatch.setattr(cameras, "_ffmpeg_frame", _fake_ffmpeg)
    monkeypatch.setattr(cameras, "best_usb_frame_size", lambda d: (1920, 1080))

    got = cameras.capture_frame({"source_kind": "usb", "source": "/dev/video0"}, "")
    assert got == b"\xff\xd8\xff\xd9"
    assert len(calls) == 2
    assert calls[1] == ["-f", "v4l2", "-i", "/dev/video0"]


def test_frame_sizes_decode_and_sort(monkeypatch: pytest.MonkeyPatch, tmp_path: Path) -> None:
    """ENUM_FRAMESIZES walks by index until EINVAL, and the largest mode comes first."""
    import sys
    import types

    node = tmp_path / "video0"
    node.write_bytes(b"")
    modes = [(640, 480), (1920, 1080), (1280, 720)]

    def _ioctl(fd: int, req: int, buf: bytes) -> bytes:
        index = struct.unpack("<I", buf[:4])[0]
        if index >= len(modes):
            raise OSError(22, "Invalid argument")  # EINVAL ends the list
        w, h = modes[index]
        return struct.pack("<IIIII", index, cameras._FOURCC_MJPG, 1, w, h) + bytes(24)

    fake = types.ModuleType("fcntl")
    fake.ioctl = _ioctl  # type: ignore[attr-defined]
    monkeypatch.setitem(sys.modules, "fcntl", fake)

    assert cameras.usb_frame_sizes(str(node)) == [(1920, 1080), (1280, 720), (640, 480)]
    assert cameras.best_usb_frame_size(str(node)) == (1920, 1080)


def test_frame_tree_sorts_chronologically_and_bounds_folder_size(media: Path) -> None:
    """Both reasons the layout is yymmdd/HHMM rather than a flat ddmmyyHHMM.

    Sorting: a file manager orders by name, so a run spanning a month boundary must still
    come out in date order — ddmmyy put 11 Aug after 10 Sep.
    Bounding: a day is its own folder, so no directory grows past a day's worth of frames
    however long the camera runs.
    """
    aug = time.mktime(time.strptime("2026-08-11 23:50:00", "%Y-%m-%d %H:%M:%S"))
    sep = time.mktime(time.strptime("2026-09-10 00:10:00", "%Y-%m-%d %H:%M:%S"))
    store_frame("cam", fake_jpeg(payload=b"\x00" * 10), now=aug)
    for i in range(3):
        store_frame("cam", fake_jpeg(payload=b"\x00" * 10), now=sep + i * 600)

    names = [f["name"] for f in list_frames("cam")]
    assert names == sorted(names, reverse=True), "newest first, and name order IS date order"
    assert names[-1].startswith("260811/"), "August sorts before September"

    root = cameras.camera_dir("cam")
    day_dirs = sorted(d.name for d in root.iterdir() if d.is_dir())
    assert day_dirs == ["260811", "260910"]
    assert len(list((root / "260910").iterdir())) == 3, "a day folder holds only that day"
    # latest.jpg sits beside the day folders, never inside one, so it is never a frame.
    assert (root / "latest.jpg").is_file()
    assert all(not (root / d / "latest.jpg").exists() for d in day_dirs)


def test_prune_removes_emptied_day_folders(media: Path) -> None:
    """Retention must not leave one empty directory per retired day behind."""
    t0 = time.mktime(time.strptime("2026-09-01 10:00:00", "%Y-%m-%d %H:%M:%S"))
    for i in range(4):
        store_frame("cam", fake_jpeg(payload=b"\x00" * 10), now=t0 + i * 86400)
    root = cameras.camera_dir("cam")
    assert len([d for d in root.iterdir() if d.is_dir()]) == 4

    # keep_days=2 cuts at "older than now - 2 days", so 09-01 goes and three remain.
    cameras.prune_frames("cam", keep_days=2, cap_gb=0, now=t0 + 3 * 86400)
    left = sorted(d.name for d in root.iterdir() if d.is_dir())
    assert left == ["260902", "260903", "260904"], left
    assert not (root / "260901").exists(), "the emptied day folder must be swept, not left behind"
