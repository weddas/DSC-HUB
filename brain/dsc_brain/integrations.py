"""Remote integrations: Ollama + CannaLib API."""

from __future__ import annotations

import os
import sqlite3
from typing import Any

import httpx

from .settings import get_setting
from .paths import resolve_cannalib_db


class CatalogSearchError(Exception):
    """Catalog unavailable — remote down and no honest local fallback."""

    def __init__(self, detail: str) -> None:
        super().__init__(detail)
        self.detail = detail


def cannalib_base_url() -> str:
    url = get_setting("cannalib_api_url", "").rstrip("/")
    if url:
        return url
    return os.environ.get("CANNALIB_API_URL", "").rstrip("/")


def cannalib_headers() -> dict[str, str]:
    headers: dict[str, str] = {}
    key = get_setting("cannalib_api_key", "")
    if key:
        headers["X-Cannalib-Key"] = key
    return headers


def _catalog_kind_paths(kind: str) -> tuple[str, str]:
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
    singular = {
        "strains": "strain",
        "mediums": "medium",
        "nutrients": "nutrient",
        "lights": "light",
    }.get(path_kind, kind.rstrip("s"))
    return singular, path_kind


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
    base = cannalib_base_url()
    if not base:
        return {"ok": False, "detail": "CannaLib API URL not configured"}
    headers = cannalib_headers()
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


async def _catalog_search_remote(
    base: str,
    headers: dict[str, str],
    kind: str,
    q: str,
    limit: int,
) -> list[dict[str, Any]]:
    _singular, path_kind = _catalog_kind_paths(kind)
    async with httpx.AsyncClient(timeout=20.0) as client:
        resp = await client.get(
            f"{base}/v1/catalogs/{path_kind}",
            params={"q": q, "limit": limit},
            headers=headers,
        )
        resp.raise_for_status()
        data = resp.json()
        if isinstance(data, dict):
            items = data.get("items")
            return items if isinstance(items, list) else []
        return data if isinstance(data, list) else []


def _escape_like(s: str) -> str:
    return s.replace("\\", "\\\\").replace("%", "").replace("_", "")


def _catalog_search_local(db_path: Any, kind: str, q: str, limit: int) -> list[dict[str, Any]]:
    singular, _path_kind = _catalog_kind_paths(kind)
    needle = " ".join((q or "").strip().lower().split())
    limit = max(1, min(int(limit), 100))
    conn = sqlite3.connect(f"file:{db_path.as_posix()}?mode=ro", uri=True)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA query_only=ON")
    try:
        if singular == "strain":
            if needle:
                like = f"%{_escape_like(needle)}%"
                rows = conn.execute(
                    """
                    SELECT name_norm, name, type FROM strain_canonical
                    WHERE lower(name) LIKE ? OR name_norm LIKE ?
                    ORDER BY curated DESC, length(name), name
                    LIMIT ?
                    """,
                    (like, f"%{needle.replace(' ', '_')}%", limit),
                ).fetchall()
            else:
                rows = conn.execute(
                    """
                    SELECT name_norm, name, type FROM strain_canonical
                    ORDER BY curated DESC, name
                    LIMIT ?
                    """,
                    (limit,),
                ).fetchall()
            return [
                {
                    "id": row["name_norm"],
                    "name": row["name"],
                    "kind": "strain",
                    "type": row["type"],
                    "source": "local_sqlite",
                }
                for row in rows
            ]

        table = {
            "nutrient": "nutrient_product",
            "medium": "medium_product",
            "light": "light_fixture",
        }.get(singular)
        if not table:
            raise CatalogSearchError(f"unknown catalog kind {kind}")

        if needle:
            like = f"%{_escape_like(needle)}%"
            rows = conn.execute(
                f"""
                SELECT id, name, brand FROM {table}
                WHERE lower(name) LIKE ? OR lower(COALESCE(brand,'')) LIKE ?
                ORDER BY name
                LIMIT ?
                """,
                (like, like, limit),
            ).fetchall()
        else:
            rows = conn.execute(
                f"SELECT id, name, brand FROM {table} ORDER BY name LIMIT ?",
                (limit,),
            ).fetchall()
        return [
            {
                "id": row["id"] or row["name"],
                "name": row["name"],
                "brand": row["brand"],
                "breeder": row["brand"],
                "kind": singular,
                "source": "local_sqlite",
            }
            for row in rows
        ]
    finally:
        conn.close()


async def catalog_search(kind: str, q: str = "", limit: int = 20) -> list[dict[str, Any]]:
    base = cannalib_base_url()
    headers = cannalib_headers()
    remote_err = "CannaLib API URL not configured"
    if base:
        try:
            return await _catalog_search_remote(base, headers, kind, q, limit)
        except Exception as exc:  # noqa: BLE001
            remote_err = str(exc)

    use_local = get_setting("cannalib_use_local_fallback", "true").lower() == "true"
    if not use_local:
        raise CatalogSearchError(
            f"Remote catalog failed ({remote_err}); local fallback disabled in Settings"
        )

    db_path = resolve_cannalib_db()
    if db_path is None:
        raise CatalogSearchError(
            f"Remote catalog failed ({remote_err}); no on-host corpus DB "
            "(expected CANNALIB_DB_PATH or dsc_brain.sqlite3 under cannalib/)"
        )

    return _catalog_search_local(db_path, kind, q, limit)


async def catalog_status() -> dict[str, Any]:
    """Report which catalog source would be used."""
    remote = await test_cannalib()
    use_local = get_setting("cannalib_use_local_fallback", "true").lower() == "true"
    local_db = resolve_cannalib_db()
    if remote.get("ok"):
        source = "remote_api"
        note = f"CannaLib API primary ({cannalib_base_url() or 'configured'})"
    elif use_local and local_db:
        source = "local_sqlite"
        note = f"Remote unreachable — on-Pi sqlite fallback ({local_db.name})"
    else:
        source = "slim_want"
        note = "Remote unreachable — slim Want catalog only (no invent)"
    return {
        "source": source,
        "note": note,
        "remote": remote,
        "local_fallback_enabled": use_local,
        "local_db_present": local_db is not None,
        "cannalib_api_url": cannalib_base_url(),
    }
