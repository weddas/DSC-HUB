"""Internet check + ethernet (LAN) config."""

from __future__ import annotations

from pathlib import Path

import pytest


def test_internet_reachable_shape(monkeypatch: pytest.MonkeyPatch) -> None:
    from dsc_brain import network_apply

    network_apply._inet_cache.update(checked_at=0.0)
    r = network_apply.internet_reachable(force=True)
    assert set(r) >= {"reachable", "dns_ok", "host", "checked_at", "error"}
    assert isinstance(r["reachable"], bool)
    assert isinstance(r["dns_ok"], bool)


def test_eth_config_defaults(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", temp_db)
    from dsc_brain.network_apply import eth_config

    c = eth_config()
    assert c["iface"] == "eth0"
    assert c["mode"] == "auto"
    assert c["static_ip"] == ""


def test_save_eth_config_validation(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", temp_db)
    from dsc_brain.network_apply import save_eth_config

    with pytest.raises(ValueError):
        save_eth_config("static", static_ip="")  # missing
    with pytest.raises(ValueError):
        save_eth_config("static", static_ip="192.168.1.50")  # not CIDR
    with pytest.raises(ValueError):
        save_eth_config("static", static_ip="192.168.1.50/24", gateway="10.0.0.1")  # off subnet
    with pytest.raises(ValueError):
        save_eth_config("static", static_ip="192.168.1.50/24", dns="not-an-ip")


def test_save_eth_config_static_persists_and_renders(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", temp_db)
    from dsc_brain.network_apply import eth_config, save_eth_config

    out = save_eth_config(
        "static", static_ip="192.168.1.50/24", gateway="192.168.1.1", dns="1.1.1.1 9.9.9.9"
    )
    assert eth_config()["mode"] == "static"
    assert eth_config()["static_ip"] == "192.168.1.50/24"
    rendered = Path(out["rendered"]).read_text(encoding="utf-8")
    assert "interface eth0" in rendered
    assert "static ip_address=192.168.1.50/24" in rendered
    assert "static routers=192.168.1.1" in rendered
    assert "1.1.1.1 9.9.9.9" in rendered
    assert "dhcpcd" in out["apply"]

    back = save_eth_config("auto")
    assert eth_config()["mode"] == "auto"
    assert "DHCP" in Path(back["rendered"]).read_text(encoding="utf-8")
