"""Generate host AP/DHCP config from brain settings (Pi host apply)."""

from __future__ import annotations

from pathlib import Path
from typing import Any

from .paths import BRAIN_DATA
from .settings import get_all_settings, list_inventory

ALLOWED_CHANNELS = {"1", "6", "11"}


def network_status() -> dict[str, Any]:
    settings = get_all_settings()
    inventory = list_inventory()
    dhcp_map = [
        {
            "seat_id": r["seat_id"],
            "host": r.get("host"),
            "mac": r.get("mac"),
            "role": r.get("role"),
        }
        for r in inventory
        if r.get("host")
    ]
    return {
        "ap_ssid": settings.get("ap_ssid", "DSC-Brain"),
        "ap_channel": settings.get("ap_channel", "6"),
        "ap_psk_set": bool(settings.get("ap_psk")),
        "allowed_channels": sorted(ALLOWED_CHANNELS),
        "dhcp_map": dhcp_map,
        "eth_uplink": "eth0",
        "note": "Apply writes configs to data dir; restart dsc-hub-ap.service on the Pi host.",
    }


def render_hostapd_conf(settings: dict[str, str]) -> str:
    ssid = settings.get("ap_ssid", "DSC-Brain")
    psk = settings.get("ap_psk") or settings.get("DSC_AP_PSK", "changeme-dsc-brain")
    channel = settings.get("ap_channel", "6")
    if channel not in ALLOWED_CHANNELS:
        channel = "6"
    return f"""interface=wlan0
driver=nl80211
ssid={ssid}
hw_mode=g
channel={channel}
country_code=AU
ieee80211n=1
wmm_enabled=1
auth_algs=1
wpa=2
wpa_key_mgmt=WPA-PSK
wpa_passphrase={psk}
rsn_pairwise=CCMP
"""


def render_dnsmasq_conf(settings: dict[str, str], inventory: list[dict[str, Any]]) -> str:
    lines = [
        "interface=wlan0",
        "bind-interfaces",
        "dhcp-range=10.42.0.50,10.42.0.200,12h",
        "dhcp-option=option:router,10.42.0.1",
        "dhcp-option=option:dns-server,10.42.0.1",
        "domain=dsc-brain.local",
        "address=/dsc-brain.local/10.42.0.1",
    ]
    for row in inventory:
        host = row.get("host")
        mac = row.get("mac")
        seat = row.get("seat_id")
        if host and mac:
            lines.append(f"dhcp-host={mac},{host},{seat}")
        elif host and seat:
            lines.append(f"dhcp-host={host},{seat}")
    return "\n".join(lines) + "\n"


def apply_network_configs() -> dict[str, str]:
    """Write rendered configs under DSC_DATA/network for host copy/restart."""
    settings = get_all_settings()
    inventory = list_inventory()
    out_dir = BRAIN_DATA / "network"
    out_dir.mkdir(parents=True, exist_ok=True)
    hostapd_path = out_dir / "hostapd.conf"
    dnsmasq_path = out_dir / "dnsmasq.conf"
    hostapd_path.write_text(render_hostapd_conf(settings), encoding="utf-8")
    dnsmasq_path.write_text(render_dnsmasq_conf(settings, inventory), encoding="utf-8")
    return {
        "hostapd": str(hostapd_path),
        "dnsmasq": str(dnsmasq_path),
        "restart": "sudo systemctl restart dsc-hub-ap.service",
        "warning": "Fleet Wi-Fi will reconnect after AP restart.",
    }
