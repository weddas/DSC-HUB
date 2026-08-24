"""ESPHome Native API client factory (no fleet imports — safe for appliance_driver)."""

from __future__ import annotations


def make_api_client(host: str, api_key: str = ""):
    """ESPHome 2026+ expects noise_psk; legacy password auth is not used."""
    from aioesphomeapi import APIClient

    if api_key:
        return APIClient(host, 6053, noise_psk=api_key)
    return APIClient(host, 6053)
