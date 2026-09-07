"""Factory reset of the brain's own data (plan-settings S4 › Reset).

Typed confirm: the operator must type the kit's AP SSID exactly. A full backup zip plus a
raw copy of the database are written under ``DSC_DATA/backups`` first, then every table is
dropped in place and the schema re-created with defaults (nothing is unlinked). The running process still holds
module caches (hub tunables, override state, fleet snapshot), so the caller restarts the
brain through the same power action the System page already uses; on a host that cannot
run it the response says so and the operator restarts by hand.
"""

from __future__ import annotations

import os
import time
from pathlib import Path
from typing import Any

from .paths import _default_brain


def _data_dir() -> Path:
    return Path(os.environ.get("DSC_DATA", str(_default_brain)))


def _db_path() -> Path:
    return _data_dir() / "dsc_ops.sqlite3"


def expected_confirm_text() -> str:
    from .settings import get_setting

    return str(get_setting("ap_ssid", "") or "DSC-Brain")


def _backup_zip(db: Path) -> bytes:
    """Zip the live ops database plus a readable settings/inventory manifest (env-path aware,
    unlike backup_ops which binds the path at import)."""
    import io
    import json
    import zipfile

    from .settings import get_all_settings, list_inventory

    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        if db.is_file():
            zf.write(db, arcname="dsc_ops.sqlite3")
        zf.writestr("manifest.json", json.dumps({"settings": get_all_settings(), "inventory": list_inventory()}, indent=2, default=str))
    return buf.getvalue()


def factory_reset(confirm_text: str, *, restart: bool = True) -> dict[str, Any]:
    want = expected_confirm_text()
    if str(confirm_text or "").strip() != want:
        raise ValueError(f"type the kit's AP SSID exactly ({want!r}) to confirm")

    stamp = time.strftime("%Y%m%d-%H%M%S")
    backups = _data_dir() / "backups"
    backups.mkdir(parents=True, exist_ok=True)
    backup = backups / f"pre-factory-reset-{stamp}.zip"
    db = _db_path()
    backup.write_bytes(_backup_zip(db))

    # Keep a raw copy of the file next to the zip, then wipe the tables in place. A rename
    # would fail on hosts where another connection holds the file open (Windows), and an
    # in-place wipe keeps every path the running process already resolved valid.
    import shutil
    import sqlite3

    moved: list[str] = []
    if db.exists():
        target = backups / f"{db.name}.{stamp}"
        shutil.copy2(db, target)
        moved.append(str(target))
        conn = sqlite3.connect(db)
        try:
            names = [r[0] for r in conn.execute("SELECT name FROM sqlite_master WHERE type IN ('table','view') AND name NOT LIKE 'sqlite_%'")]
            for name in names:
                conn.execute(f'DROP TABLE IF EXISTS "{name}"')
            conn.commit()
            conn.execute("VACUUM")
        finally:
            conn.close()

    from .settings import init_settings_db

    init_settings_db(db)

    from .settings_journal import journal_setting_change

    journal_setting_change("Factory reset", "previous data copied aside", f"backup {backup.name}", domain="system", source="operator")

    out: dict[str, Any] = {"ok": True, "backup": str(backup), "moved": moved, "db": str(db)}
    if restart:
        from .system_ops import power_action

        try:
            out["restart"] = power_action("restart-brain")
        except Exception as exc:  # noqa: BLE001
            out["restart"] = {"status": "failed", "detail": str(exc)}
    else:
        out["restart"] = {"status": "skipped"}
    return out
