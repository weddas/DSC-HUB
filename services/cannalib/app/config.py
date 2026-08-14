"""Cannalib runtime settings (env-driven; flip public → keyed without redeploying cards)."""

from __future__ import annotations

import os
from pathlib import Path


def _bool(name: str, default: bool) -> bool:
    raw = os.environ.get(name)
    if raw is None:
        return default
    return raw.strip().lower() in ("1", "true", "yes", "on")


def _float(name: str, default: float) -> float:
    raw = os.environ.get(name)
    if raw is None or raw.strip() == "":
        return default
    try:
        return float(raw)
    except ValueError:
        return default


def _int(name: str, default: int) -> int:
    return int(_float(name, float(default)))


class Settings:
    def __init__(self) -> None:
        self.db_path = Path(
            os.environ.get("CANNALIB_DB_PATH", "/data/dsc_brain.sqlite3")
        )
        self.host = os.environ.get("CANNALIB_HOST", "0.0.0.0")
        self.port = _int("CANNALIB_PORT", 8790)
        self.public_base_url = os.environ.get(
            "CANNALIB_PUBLIC_BASE_URL", "https://cannalib.plausible-deniability.net"
        )
        self.require_api_key = _bool("CANNALIB_REQUIRE_API_KEY", False)
        self.api_key = os.environ.get("CANNALIB_API_KEY", "")
        self.api_key_header = os.environ.get("CANNALIB_API_KEY_HEADER", "X-Cannalib-Key")
        self.rate_limit_enabled = _bool("CANNALIB_RATE_LIMIT_ENABLED", True)
        self.rate_limit_rpm = _int("CANNALIB_RATE_LIMIT_RPM", 120)
        self.rate_limit_burst = _int("CANNALIB_RATE_LIMIT_BURST", 40)
        self.cooldown_base_s = _float("CANNALIB_COOLDOWN_BASE_S", 0.25)
        self.cooldown_max_s = _float("CANNALIB_COOLDOWN_MAX_S", 8.0)
        self.cooldown_429_after = _int("CANNALIB_COOLDOWN_429_AFTER", 3)
        self.metrics_path = os.environ.get("CANNALIB_METRICS_PATH", "/v1/metrics")
        self.metrics_bypass_rate_limit = _bool("CANNALIB_METRICS_BYPASS_RATE_LIMIT", True)
        self.cors_origins = os.environ.get("CANNALIB_CORS_ORIGINS", "*")


settings = Settings()
