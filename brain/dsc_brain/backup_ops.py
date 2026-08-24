"""Backup export/import for Pi appliance ops data."""

from __future__ import annotations

import io
import json
import shutil
import zipfile
from pathlib import Path
from typing import Any

from .paths import BRAIN_DATA, DEFAULT_DB
from .settings import get_all_settings, list_inventory


def export_backup_zip() -> bytes:
    """Zip ops sqlite, settings, inventory snapshot."""
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        if DEFAULT_DB.is_file():
            zf.write(DEFAULT_DB, arcname="dsc_ops.sqlite3")
        payload: dict[str, Any] = {
            "settings": get_all_settings(),
            "inventory": list_inventory(),
        }
        zf.writestr("manifest.json", json.dumps(payload, indent=2))
        env_path = BRAIN_DATA.parent / ".env"
        if env_path.is_file():
            zf.write(env_path, arcname=".env")
        z2m = BRAIN_DATA.parent / "z2m"
        if z2m.is_dir():
            for path in z2m.rglob("*"):
                if path.is_file():
                    zf.write(path, arcname=f"z2m/{path.relative_to(z2m).as_posix()}")
    buf.seek(0)
    return buf.getvalue()


def import_backup_zip(data: bytes) -> dict[str, str]:
    """Restore ops sqlite from zip. Does not auto-restart services."""
    BRAIN_DATA.mkdir(parents=True, exist_ok=True)
    restored: list[str] = []
    with zipfile.ZipFile(io.BytesIO(data)) as zf:
        names = zf.namelist()
        if "dsc_ops.sqlite3" in names:
            target = DEFAULT_DB
            if target.is_file():
                shutil.copy2(target, target.with_suffix(".sqlite3.bak"))
            with zf.open("dsc_ops.sqlite3") as src, open(target, "wb") as dst:
                shutil.copyfileobj(src, dst)
            restored.append("dsc_ops.sqlite3")
        if ".env" in names:
            env_target = BRAIN_DATA.parent / ".env"
            with zf.open(".env") as src, open(env_target, "wb") as dst:
                shutil.copyfileobj(src, dst)
            restored.append(".env")
    return {"restored": ",".join(restored) or "none"}
