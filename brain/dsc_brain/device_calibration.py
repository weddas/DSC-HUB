"""Device calibration persistence (CFM curves, light PAR, etc.)."""

from __future__ import annotations

import time
from pathlib import Path
from typing import Any

from .settings import connect

CAL_TYPES = frozenset({"fan_cfm", "light_par"})


def _row_to_dict(row: Any) -> dict[str, Any]:
    return {
        "device_id": row["device_id"],
        "cal_type": row["cal_type"],
        "step_key": row["step_key"],
        "measured_value": float(row["measured_value"]),
        "unit": row["unit"] or "",
        "created_at": float(row["created_at"]),
    }


def get_calibration(
    device_id: str,
    cal_type: str | None = None,
    db_path: Path | None = None,
) -> list[dict[str, Any]]:
    conn = connect(db_path)
    if cal_type:
        rows = conn.execute(
            """
            SELECT device_id, cal_type, step_key, measured_value, unit, created_at
            FROM device_calibration
            WHERE device_id=? AND cal_type=?
            ORDER BY CAST(step_key AS REAL), step_key
            """,
            (device_id, cal_type),
        ).fetchall()
    else:
        rows = conn.execute(
            """
            SELECT device_id, cal_type, step_key, measured_value, unit, created_at
            FROM device_calibration
            WHERE device_id=?
            ORDER BY cal_type, CAST(step_key AS REAL), step_key
            """,
            (device_id,),
        ).fetchall()
    conn.close()
    return [_row_to_dict(r) for r in rows]


def set_calibration_step(
    device_id: str,
    cal_type: str,
    step_key: str,
    measured_value: float,
    unit: str = "",
    db_path: Path | None = None,
) -> dict[str, Any]:
    if cal_type not in CAL_TYPES:
        raise ValueError(f"unsupported cal_type {cal_type}")
    now = time.time()
    conn = connect(db_path)
    conn.execute(
        """
        INSERT INTO device_calibration(device_id, cal_type, step_key, measured_value, unit, created_at)
        VALUES(?, ?, ?, ?, ?, ?)
        ON CONFLICT(device_id, cal_type, step_key) DO UPDATE SET
          measured_value=excluded.measured_value,
          unit=excluded.unit,
          created_at=excluded.created_at
        """,
        (device_id, cal_type, str(step_key), float(measured_value), unit, now),
    )
    conn.commit()
    row = conn.execute(
        """
        SELECT device_id, cal_type, step_key, measured_value, unit, created_at
        FROM device_calibration
        WHERE device_id=? AND cal_type=? AND step_key=?
        """,
        (device_id, cal_type, str(step_key)),
    ).fetchone()
    conn.close()
    if not row:
        raise RuntimeError("calibration write failed")
    return _row_to_dict(row)


def list_calibrations(
    device_id: str | None = None,
    cal_type: str | None = None,
    db_path: Path | None = None,
) -> list[dict[str, Any]]:
    conn = connect(db_path)
    clauses: list[str] = []
    params: list[Any] = []
    if device_id:
        clauses.append("device_id=?")
        params.append(device_id)
    if cal_type:
        clauses.append("cal_type=?")
        params.append(cal_type)
    where = f"WHERE {' AND '.join(clauses)}" if clauses else ""
    rows = conn.execute(
        f"""
        SELECT device_id, cal_type, step_key, measured_value, unit, created_at
        FROM device_calibration
        {where}
        ORDER BY device_id, cal_type, CAST(step_key AS REAL), step_key
        """,
        params,
    ).fetchall()
    conn.close()
    return [_row_to_dict(r) for r in rows]
