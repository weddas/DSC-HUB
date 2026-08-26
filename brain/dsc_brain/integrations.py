"""Remote integrations: Ollama + CannaLib API."""

from __future__ import annotations

from typing import Any

import httpx

from .settings import get_setting
from .paths import CANNALIB_DB, DEFAULT_DB


async def test_ollama() -> dict[str, Any]:
    base = get_setting("ollama_base_url", "").rstrip("/")
    if not base:
        return {"ok": False, "detail": "Ollama URL not configured"}
    url = f"{base}/api/tags"
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url)
            resp.raise_for_status()
            data = resp.json()
            models = [m.get("name") for m in data.get("models", [])]
            return {"ok": True, "models": models[:10]}
    except Exception as exc:  # noqa: BLE001
        return {"ok": False, "detail": str(exc)}


async def test_cannalib() -> dict[str, Any]:
    base = get_setting("cannalib_api_url", "").rstrip("/")
    if not base:
        return {"ok": False, "detail": "CannaLib API URL not configured"}
    headers: dict[str, str] = {}
    key = get_setting("cannalib_api_key", "")
    if key:
        headers["X-Cannalib-Key"] = key
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            health = await client.get(f"{base}/health", headers=headers)
            health.raise_for_status()
            search = await client.get(
                f"{base}/v1/catalogs/strains",
                params={"q": "og", "limit": 1},
                headers=headers,
            )
            search.raise_for_status()
            rows = search.json()
            if isinstance(rows, dict):
                rows = rows.get("items") or []
            return {"ok": True, "health": health.json(), "sample_count": len(rows)}
    except Exception as exc:  # noqa: BLE001
        return {"ok": False, "detail": str(exc)}


async def catalog_search(kind: str, q: str = "", limit: int = 20) -> list[dict[str, Any]]:
    base = get_setting("cannalib_api_url", "").rstrip("/")
    if not base:
        return []
    headers: dict[str, str] = {}
    key = get_setting("cannalib_api_key", "")
    if key:
        headers["X-Cannalib-Key"] = key
    plural = {
        "strain": "strains",
        "strains": "strains",
        "medium": "mediums",
        "mediums": "mediums",
        "nutrient": "nutrients",
        "nutrients": "nutrients",
        "light": "lights",
        "lights": "lights",
    }
    path_kind = plural.get(kind, f"{kind}s")
    async with httpx.AsyncClient(timeout=20.0) as client:
        resp = await client.get(
            f"{base}/v1/catalogs/{path_kind}",
            params={"q": q, "limit": limit},
            headers=headers,
        )
        resp.raise_for_status()
        data = resp.json()
        # CannaLib wraps hits in an envelope ({kind, q, count, items}); the
        # brain contract is a bare list — unwrap or the /v1 proxy 500s on
        # response validation.
        if isinstance(data, dict):
            items = data.get("items")
            return items if isinstance(items, list) else []
        return data if isinstance(data, list) else []


async def catalog_status() -> dict[str, Any]:
    """Report which catalog source would be used."""
    remote = await test_cannalib()
    use_local = get_setting("cannalib_use_local_fallback", "true").lower() == "true"
    local_db = CANNALIB_DB.is_file() or (DEFAULT_DB.parent / "cannalib" / "dsc_brain.sqlite3").is_file()
    if remote.get("ok"):
        source = "remote_api"
        note = "CannaLib API primary"
    elif use_local and local_db:
        source = "local_sqlite"
        note = "Remote unreachable — on-Pi sqlite fallback"
    else:
        source = "slim_want"
        note = "Remote unreachable — slim Want catalog only (no invent)"
    return {
        "source": source,
        "note": note,
        "remote": remote,
        "local_fallback_enabled": use_local,
        "local_db_present": local_db,
    }
