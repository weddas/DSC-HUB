"""ESPHome toolchain status must stay bounded when the network is dark.

Live finding 2026-09-06: GET /settings/esphome/toolchain blocked >30 s on the Pi
with no route out — urllib's timeout does not cover DNS, and status() chained
several lookups. Every probe now runs on a bounded worker thread and the
dashboard /version probe is memoised.
"""

from __future__ import annotations

import tempfile
import time
from pathlib import Path

import pytest

from dsc_brain.settings import init_settings_db


@pytest.fixture()
def temp_db(monkeypatch: pytest.MonkeyPatch) -> Path:
    with tempfile.TemporaryDirectory() as tmp:
        db = Path(tmp) / "dsc_ops.sqlite3"
        monkeypatch.setenv("DSC_DATA", str(Path(tmp)))
        monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", db)
        init_settings_db(db)
        yield db


def _slow_urlopen(sleep_s: float):
    def _open(_req, timeout=None):  # noqa: ANN001
        time.sleep(sleep_s)
        raise OSError("late answer")

    return _open


def test_dash_get_is_bounded_when_name_resolution_hangs(monkeypatch: pytest.MonkeyPatch) -> None:
    from dsc_brain import esphome_toolchain as tc

    tc.reset_dashboard_probe_cache()
    monkeypatch.setattr(tc.urllib.request, "urlopen", _slow_urlopen(6.0))
    monkeypatch.setattr(tc, "dashboard_api", lambda: "http://host.docker.internal:6052")

    t0 = time.monotonic()
    out = tc._dash_get("/version", timeout=1.0)
    dt = time.monotonic() - t0

    assert out is None
    # primary (1.0 + 0.5 join slack) + legacy (min(1.0, 2.0) + 0.5) — never the 6 s the socket would take
    assert dt < 4.0, dt


def test_dash_version_probe_is_memoised_while_down(monkeypatch: pytest.MonkeyPatch) -> None:
    from dsc_brain import esphome_toolchain as tc

    tc.reset_dashboard_probe_cache()
    calls: list[str] = []

    def fake_fetch(url: str, timeout: float) -> dict:
        calls.append(url)
        return {"error": OSError("down")}

    monkeypatch.setattr(tc, "fetch_json_bounded", fake_fetch)
    assert tc._dash_get("/version") is None
    assert tc._dash_get("/version") is None
    assert tc._dash_get("/version") is None
    # one round of probes (primary + legacy), then served from the down-cache
    assert len(calls) <= 2, calls


def test_latest_is_bounded_when_pypi_hangs(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    from dsc_brain import esphome_toolchain as tc

    monkeypatch.setattr(tc, "eth_carrier_up", lambda: True)
    monkeypatch.setattr(tc, "_PYPI_TIMEOUT", 1.0)
    monkeypatch.setattr(tc.urllib.request, "urlopen", _slow_urlopen(6.0))

    t0 = time.monotonic()
    res = tc.latest(force=True)
    dt = time.monotonic() - t0

    assert res["ok"] is False
    assert "did not answer" in str(res["error"])
    assert dt < 3.0, dt


def test_status_probes_dashboard_once_and_stays_fast(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    from dsc_brain import esphome_toolchain as tc

    tc.reset_dashboard_probe_cache()
    calls: list[str] = []

    def fake_fetch(url: str, timeout: float) -> dict:
        calls.append(url)
        return {"error": OSError("down")}

    monkeypatch.setattr(tc, "fetch_json_bounded", fake_fetch)
    monkeypatch.setattr(tc, "esphome_bin", lambda: str(Path(tempfile.gettempdir()) / "no-such-esphome-bin"))
    monkeypatch.setattr(tc, "eth_carrier_up", lambda: False)
    monkeypatch.setattr(tc, "device_versions", lambda: [])

    t0 = time.monotonic()
    st = tc.status()
    dt = time.monotonic() - t0

    version_probes = [u for u in calls if u.endswith("/version")]
    assert len(version_probes) <= 2, version_probes  # installed() + build_backend() share one probe round
    assert st["installed"] is None
    assert st["build_backend"] == "none"
    assert dt < 2.0, dt
