"""Generate host AP/DHCP config from brain settings (Pi host apply)."""

from __future__ import annotations

import ipaddress
import shutil
import socket
import struct
import subprocess
import threading
import time
from pathlib import Path
from typing import Any, Literal

try:
    import fcntl
except ImportError:  # Windows / non-Linux
    fcntl = None  # type: ignore[assignment]

from .paths import BRAIN_DATA
from .settings import get_all_settings, get_setting, list_inventory, set_setting

ALLOWED_CHANNELS = {"1", "6", "11"}
SYSTEM_ETC = Path("/etc/dsc-hub")
SOFTAP_SPA_URL = "http://10.42.0.1:8787"
ETH_IFACE = "eth0"

OperatorMode = Literal["ethernet", "softap"]


def operator_mode_for_carrier(eth_carrier: bool) -> OperatorMode:
    """Ethernet carrier up → LAN/mDNS SPA; else Pi SoftAP for operator Setup."""
    return "ethernet" if eth_carrier else "softap"


def eth_carrier_up(iface: str = ETH_IFACE) -> bool:
    """Read sysfs carrier; False when iface missing (e.g. Windows unit tests)."""
    path = Path(f"/sys/class/net/{iface}/carrier")
    try:
        return path.read_text(encoding="utf-8").strip() == "1"
    except OSError:
        return False


def _primary_ipv4(iface: str = ETH_IFACE) -> str | None:
    """Best-effort IPv4 for spa_urls; None if unavailable."""
    if fcntl is None:
        return None
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        try:
            packed = struct.pack("256s", iface.encode("utf-8")[:15])
            info = fcntl.ioctl(sock.fileno(), 0x8915, packed)  # SIOCGIFADDR
            return socket.inet_ntoa(info[20:24])
        finally:
            sock.close()
    except Exception:  # noqa: BLE001
        return None


def spa_urls_for_mode(mode: OperatorMode, eth_ip: str | None = None) -> list[str]:
    if mode == "softap":
        return [SOFTAP_SPA_URL]
    urls = ["http://dsc-brain.local:8787"]
    if eth_ip:
        urls.insert(0, f"http://{eth_ip}:8787")
    return urls


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
    carrier = eth_carrier_up()
    mode = operator_mode_for_carrier(carrier)
    eth_ip = _primary_ipv4() if carrier else None
    return {
        "ap_ssid": settings.get("ap_ssid", "DSC-Brain"),
        "ap_channel": settings.get("ap_channel", "6"),
        "ap_psk_set": bool(settings.get("ap_psk")),
        "allowed_channels": sorted(ALLOWED_CHANNELS),
        "dhcp_map": dhcp_map,
        "eth_uplink": ETH_IFACE,
        "eth_carrier": carrier,
        "eth": eth_config(),
        "internet": internet_reachable(),
        "internet_check_host": settings.get("internet_check_host", _DEFAULT_CHECK_HOST),
        "operator_mode": mode,
        "spa_urls": spa_urls_for_mode(mode, eth_ip),
        "note": (
            "Ethernet carrier → Pi SoftAP off, SPA on LAN/mDNS. "
            "No Ethernet → start dsc-hub-ap for operator Setup. "
            "Apply writes configs to data dir; net-policy owns SoftAP lifecycle."
        ),
    }


# --------------------------------------------------------------- internet check

_DEFAULT_CHECK_HOST = "1.1.1.1:443"
_INET_TTL = 30.0
_inet_cache: dict[str, Any] = {"reachable": None, "dns_ok": None, "checked_at": 0.0, "error": None}
_inet_lock = threading.Lock()


def _check_host_parts() -> tuple[str, int]:
    raw = str(get_setting("internet_check_host", _DEFAULT_CHECK_HOST)).strip() or _DEFAULT_CHECK_HOST
    host, _, port = raw.partition(":")
    try:
        p = int(port) if port else 443
    except ValueError:
        p = 443
    return host or "1.1.1.1", p


def internet_reachable(*, force: bool = False) -> dict[str, Any]:
    """Best-effort internet check: a TCP connect to the configured host plus a DNS
    resolve. Cached ~30 s, never raises."""
    now = time.time()
    with _inet_lock:
        if not force and _inet_cache["checked_at"] and now - _inet_cache["checked_at"] < _INET_TTL:
            return dict(_inet_cache)

    host, port = _check_host_parts()
    reachable = False
    dns_ok = False
    error: str | None = None
    try:
        with socket.create_connection((host, port), timeout=2.5):
            reachable = True
    except OSError as exc:
        error = f"{host}:{port} unreachable: {exc}"
    try:
        socket.getaddrinfo("github.com", 443)
        dns_ok = True
    except OSError as exc:
        if error is None:
            error = f"DNS resolve failed: {exc}"

    result = {
        "reachable": reachable,
        "dns_ok": dns_ok,
        "host": f"{host}:{port}",
        "checked_at": now,
        "error": None if (reachable and dns_ok) else error,
    }
    with _inet_lock:
        _inet_cache.update(result)
    return result


# ------------------------------------------------------------- ethernet (LAN)

EthMode = Literal["auto", "static"]


def eth_config() -> dict[str, Any]:
    mode = str(get_setting("eth_mode", "auto")).strip().lower()
    if mode not in ("auto", "static"):
        mode = "auto"
    return {
        "iface": ETH_IFACE,
        "mode": mode,
        "static_ip": get_setting("eth_static_ip", ""),  # CIDR, e.g. 192.168.1.50/24
        "gateway": get_setting("eth_gateway", ""),
        "dns": get_setting("eth_dns", ""),  # space/comma separated
        "carrier": eth_carrier_up(),
        "current_ip": _primary_ipv4(),
    }


def _validate_static(ip_cidr: str, gateway: str, dns: str) -> None:
    s = ip_cidr.strip()
    if "/" not in s:
        raise ValueError("static_ip must include a prefix, e.g. 192.168.1.50/24")
    try:
        iface = ipaddress.ip_interface(s)
    except ValueError as exc:
        raise ValueError(f"static_ip must be CIDR (e.g. 192.168.1.50/24): {exc}") from exc
    if gateway.strip():
        try:
            gw = ipaddress.ip_address(gateway.strip())
        except ValueError as exc:
            raise ValueError(f"gateway must be an IP: {exc}") from exc
        if gw not in iface.network:
            raise ValueError(f"gateway {gw} is not on {iface.network}")
    for d in dns.replace(",", " ").split():
        try:
            ipaddress.ip_address(d)
        except ValueError as exc:
            raise ValueError(f"dns entry {d!r} is not an IP: {exc}") from exc


def render_eth_dhcpcd(cfg: dict[str, Any]) -> str:
    if cfg["mode"] != "static":
        return f"# {ETH_IFACE}: DHCP (auto). No static block.\n"
    dns = cfg["dns"].replace(",", " ").split()
    lines = [f"interface {ETH_IFACE}", f"static ip_address={cfg['static_ip'].strip()}"]
    if cfg["gateway"].strip():
        lines.append(f"static routers={cfg['gateway'].strip()}")
    if dns:
        lines.append(f"static domain_name_servers={' '.join(dns)}")
    return "\n".join(lines) + "\n"


def save_eth_config(mode: str, static_ip: str = "", gateway: str = "", dns: str = "") -> dict[str, Any]:
    """Persist ethernet settings + render a dhcpcd drop-in. Does NOT restart
    networking — a bad static config can lock out a headless Pi; the operator
    applies it explicitly."""
    mode = str(mode).strip().lower()
    if mode not in ("auto", "static"):
        raise ValueError("mode must be 'auto' or 'static'")
    if mode == "static":
        if not static_ip.strip():
            raise ValueError("static mode needs static_ip (CIDR)")
        _validate_static(static_ip, gateway, dns)

    set_setting("eth_mode", mode)
    set_setting("eth_static_ip", static_ip.strip())
    set_setting("eth_gateway", gateway.strip())
    set_setting("eth_dns", dns.strip())

    cfg = eth_config()
    out_dir = BRAIN_DATA / "network"
    out_dir.mkdir(parents=True, exist_ok=True)
    conf_path = out_dir / "eth0-dhcpcd.conf"
    conf_path.write_text(render_eth_dhcpcd(cfg), encoding="utf-8")
    return {
        "eth": cfg,
        "rendered": str(conf_path),
        "apply": (
            "auto (DHCP): remove any static block for eth0 from /etc/dhcpcd.conf, then "
            "`sudo systemctl restart dhcpcd`."
            if mode == "auto"
            else (
                f"static: append {conf_path} to /etc/dhcpcd.conf (or drop into "
                "/etc/dhcpcd.d/), then `sudo systemctl restart dhcpcd` — or reboot. "
                "Verify you can still reach the Pi before disconnecting."
            )
        ),
    }


def render_hostapd_conf(settings: dict[str, str]) -> str:
    ssid = settings.get("ap_ssid", "DSC-Brain")
    psk = settings.get("ap_psk") or settings.get("DSC_AP_PSK", "Digital1")
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
max_num_sta=32
macaddr_acl=0
deny_mac_file=/etc/dsc-hub/hostapd.deny
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


def apply_network_configs(restart_ap: bool = True) -> dict[str, Any]:
    """Write rendered configs under DSC_DATA/network; copy to /etc and restart AP on Pi."""
    settings = get_all_settings()
    inventory = list_inventory()
    out_dir = BRAIN_DATA / "network"
    out_dir.mkdir(parents=True, exist_ok=True)
    hostapd_path = out_dir / "hostapd.conf"
    dnsmasq_path = out_dir / "dnsmasq.conf"
    deny_path = out_dir / "hostapd.deny"
    hostapd_path.write_text(render_hostapd_conf(settings), encoding="utf-8")
    dnsmasq_path.write_text(render_dnsmasq_conf(settings, inventory), encoding="utf-8")
    if not deny_path.is_file():
        deny_path.write_text("34:6f:24:da:41:77\n", encoding="utf-8")
    result: dict[str, Any] = {
        "hostapd": str(hostapd_path),
        "dnsmasq": str(dnsmasq_path),
        "hostapd_deny": str(deny_path),
        "restart": "sudo systemctl restart dsc-hub-ap.service",
        "warning": "Fleet Wi-Fi will reconnect after AP restart.",
    }
    if restart_ap:
        SYSTEM_ETC.mkdir(parents=True, exist_ok=True)
        shutil.copy2(hostapd_path, SYSTEM_ETC / "hostapd.conf")
        shutil.copy2(dnsmasq_path, SYSTEM_ETC / "dnsmasq.conf")
        shutil.copy2(deny_path, SYSTEM_ETC / "hostapd.deny")
        result["copied_to"] = str(SYSTEM_ETC)
        try:
            proc = subprocess.run(
                ["sudo", "systemctl", "restart", "dsc-hub-ap.service"],
                capture_output=True,
                text=True,
                timeout=60,
                check=False,
            )
            result["ap_restarted"] = proc.returncode == 0
            if proc.returncode != 0:
                result["restart_error"] = (proc.stderr or proc.stdout or "").strip()[:500]
        except Exception as exc:  # noqa: BLE001
            result["ap_restarted"] = False
            result["restart_error"] = str(exc)
    return result
