"""Local energy learning — outliers vs sticky norm; never auto-applies schedules."""

from __future__ import annotations

import json
import sqlite3
import time
from pathlib import Path
from typing import Any

from .paths import DEFAULT_DB

DEFAULT_OUTLIER_DAYS = 2
DEFAULT_NORM_DAYS = 5


def _connect(db_path: Path | None = None) -> sqlite3.Connection:
    path = db_path or DEFAULT_DB
    path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(path))
    conn.row_factory = sqlite3.Row
    return conn


def init_learning_tables(db_path: Path | None = None) -> None:
    with _connect(db_path) as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS energy_learning_sample (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              space_id TEXT NOT NULL,
              profile_id TEXT NOT NULL,
              day_key TEXT NOT NULL,
              estimated_cost REAL NOT NULL,
              heater_duty_h REAL NOT NULL DEFAULT 0,
              light_duty_h REAL NOT NULL DEFAULT 0,
              proxy_cost REAL NOT NULL DEFAULT 0,
              created_at REAL NOT NULL,
              UNIQUE(space_id, profile_id, day_key)
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS energy_learning_settings (
              key TEXT PRIMARY KEY,
              value TEXT NOT NULL
            )
            """
        )
        conn.commit()


def get_learning_settings(db_path: Path | None = None) -> dict[str, Any]:
    init_learning_tables(db_path)
    defaults = {
        "enabled": "1",
        "prefer_growth_outliers": "1",
        "outlier_days": str(DEFAULT_OUTLIER_DAYS),
        "norm_days": str(DEFAULT_NORM_DAYS),
    }
    with _connect(db_path) as conn:
        rows = conn.execute("SELECT key, value FROM energy_learning_settings").fetchall()
    out = dict(defaults)
    for r in rows:
        out[str(r["key"])] = str(r["value"])
    return {
        "enabled": out.get("enabled", "1") == "1",
        "prefer_growth_outliers": out.get("prefer_growth_outliers", "1") == "1",
        "outlier_days": int(out.get("outlier_days") or DEFAULT_OUTLIER_DAYS),
        "norm_days": int(out.get("norm_days") or DEFAULT_NORM_DAYS),
    }


def set_learning_settings(patch: dict[str, Any], *, db_path: Path | None = None) -> dict[str, Any]:
    init_learning_tables(db_path)
    cur = get_learning_settings(db_path)
    if "enabled" in patch:
        cur["enabled"] = bool(patch["enabled"])
    if "prefer_growth_outliers" in patch:
        cur["prefer_growth_outliers"] = bool(patch["prefer_growth_outliers"])
    if "outlier_days" in patch:
        cur["outlier_days"] = int(patch["outlier_days"])
    if "norm_days" in patch:
        cur["norm_days"] = int(patch["norm_days"])
    with _connect(db_path) as conn:
        for k, v in (
            ("enabled", "1" if cur["enabled"] else "0"),
            ("prefer_growth_outliers", "1" if cur["prefer_growth_outliers"] else "0"),
            ("outlier_days", str(cur["outlier_days"])),
            ("norm_days", str(cur["norm_days"])),
        ):
            conn.execute(
                """
                INSERT INTO energy_learning_settings(key, value) VALUES(?, ?)
                ON CONFLICT(key) DO UPDATE SET value=excluded.value
                """,
                (k, v),
            )
        conn.commit()
    return get_learning_settings(db_path)


def record_sample(
    space_id: str,
    profile_id: str,
    *,
    day_key: str,
    estimated_cost: float,
    heater_duty_h: float = 0.0,
    light_duty_h: float = 0.0,
    heater_rate_per_kwh: float = 0.28,
    db_path: Path | None = None,
) -> dict[str, Any]:
    init_learning_tables(db_path)
    # Proxy: estimated lighting cost + heater duty * assumed kW * rate (honest label elsewhere)
    proxy = float(estimated_cost) + float(heater_duty_h) * 1.0 * float(heater_rate_per_kwh)
    now = time.time()
    with _connect(db_path) as conn:
        conn.execute(
            """
            INSERT INTO energy_learning_sample(
              space_id, profile_id, day_key, estimated_cost, heater_duty_h, light_duty_h, proxy_cost, created_at
            ) VALUES(?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(space_id, profile_id, day_key) DO UPDATE SET
              estimated_cost=excluded.estimated_cost,
              heater_duty_h=excluded.heater_duty_h,
              light_duty_h=excluded.light_duty_h,
              proxy_cost=excluded.proxy_cost,
              created_at=excluded.created_at
            """,
            (
                str(space_id),
                str(profile_id),
                str(day_key),
                float(estimated_cost),
                float(heater_duty_h),
                float(light_duty_h),
                proxy,
                now,
            ),
        )
        conn.commit()
    return {
        "space_id": space_id,
        "profile_id": profile_id,
        "day_key": day_key,
        "proxy_cost": proxy,
    }


def planning_signal(
    space_id: str,
    profile_id: str,
    *,
    baseline_profile_id: str = "current",
    db_path: Path | None = None,
) -> dict[str, Any]:
    """True when sticky underperformance vs baseline — not for 1–2 day outliers."""
    settings = get_learning_settings(db_path)
    if not settings["enabled"]:
        return {"planning_signal": False, "reason": "learning disabled", "apply": False}
    init_learning_tables(db_path)
    with _connect(db_path) as conn:
        rows = conn.execute(
            """
            SELECT day_key, proxy_cost FROM energy_learning_sample
            WHERE space_id=? AND profile_id=?
            ORDER BY day_key DESC LIMIT ?
            """,
            (str(space_id), str(profile_id), max(settings["norm_days"] + 2, 10)),
        ).fetchall()
        base = conn.execute(
            """
            SELECT day_key, proxy_cost FROM energy_learning_sample
            WHERE space_id=? AND profile_id=?
            ORDER BY day_key DESC LIMIT ?
            """,
            (str(space_id), str(baseline_profile_id), max(settings["norm_days"] + 2, 10)),
        ).fetchall()
    if len(rows) <= settings["outlier_days"]:
        return {
            "planning_signal": False,
            "reason": "within outlier window — prefer growth over $",
            "days": len(rows),
            "apply": False,
        }
    if len(rows) < settings["norm_days"]:
        return {
            "planning_signal": False,
            "reason": "not enough days for sticky norm",
            "days": len(rows),
            "apply": False,
        }
    recent = rows[: settings["norm_days"]]
    avg = sum(float(r["proxy_cost"]) for r in recent) / len(recent)
    base_avg = None
    if base:
        b = base[: settings["norm_days"]]
        base_avg = sum(float(r["proxy_cost"]) for r in b) / len(b)
    worse = base_avg is not None and avg > base_avg * 1.15
    return {
        "planning_signal": bool(worse),
        "reason": (
            "sticky higher proxy cost vs baseline — review alternatives when ready"
            if worse
            else "profile ok vs baseline"
        ),
        "avg_proxy_cost": round(avg, 4),
        "baseline_avg_proxy_cost": round(base_avg, 4) if base_avg is not None else None,
        "apply": False,
        "honesty": "Learned from duty-hour proxies + tariff — not a utility bill",
    }
