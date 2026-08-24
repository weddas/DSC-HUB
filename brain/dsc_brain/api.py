"""DSC Brain API — Pi Release 7.0.0-dev."""

from __future__ import annotations

import json
import os
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Any

from fastapi import FastAPI, File, HTTPException, Query, UploadFile, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, Response
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from . import __version__
from .backup_ops import export_backup_zip, import_backup_zip
from .catalog import get_strain, init_db, reload_catalogs, search
from .control_ops import call_service_proxy
from .history_ops import query_entity_history
from .decision_loop import decision_tick
from .appliance_driver import start_appliance_driver, stop_appliance_driver
from .esphome_client import start_esphome_ingest, stop_esphome_ingest
from .esphome_jobs import list_esphome_devices, list_jobs, queue_job
from .fleet_state import get_fleet_state
from .integrations import catalog_search, catalog_status, test_cannalib, test_ollama
from .network_apply import apply_network_configs, network_status
from .paths import EXPECTED_FIRMWARE, SURFACE_VERSION
from .settings import (
    get_all_settings,
    init_settings_db,
    list_inventory,
    list_learning,
    list_roster,
    set_setting,
    upsert_inventory,
    upsert_roster,
)
from .want import resolve_want
from .zigbee_mqtt import set_permit_join, start_zigbee_ingest, stop_zigbee_ingest

STATIC_DIR = Path(__file__).resolve().parent.parent / "static"
if not STATIC_DIR.exists():
    STATIC_DIR = Path("/app/static")


class TickBody(BaseModel):
    seat: str = "pot1"
    strain_id: str | None = "generic_photoperiod"
    stage: str = "veg"
    got: dict[str, float | None] = Field(default_factory=dict)
    custom_want: dict[str, Any] | None = None
    manual_takeover: bool = False
    emit: bool = False


class SettingsPatch(BaseModel):
    settings: dict[str, str] = Field(default_factory=dict)


class ServiceCallBody(BaseModel):
    domain: str
    service: str
    data: dict[str, Any] = Field(default_factory=dict)


class InventoryPatch(BaseModel):
    host: str | None = None
    mac: str | None = None
    api_key: str | None = None
    in_service: bool | None = None
    extra: dict[str, Any] | None = None


class RosterPatch(BaseModel):
    strain_id: str | None = None
    stage: str | None = None
    recipe: dict[str, Any] | None = None


class PermitJoinBody(BaseModel):
    enabled: bool = True
    duration_s: int = 120


class EsphomeJobBody(BaseModel):
    seat_id: str
    action: str = "ota"


@asynccontextmanager
async def lifespan(app: FastAPI):  # noqa: ARG001
    init_db()
    init_settings_db()
    reload_catalogs()
    start_esphome_ingest()
    start_appliance_driver()
    start_zigbee_ingest()
    yield
    await stop_appliance_driver()
    await stop_esphome_ingest()
    stop_zigbee_ingest()


app = FastAPI(title="DSC Brain", version=__version__, lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if STATIC_DIR.is_dir():
    app.mount("/assets", StaticFiles(directory=str(STATIC_DIR / "assets")), name="assets")


@app.get("/health")
def health() -> dict[str, Any]:
    return {
        "status": "ok",
        "version": __version__,
        "surface": SURFACE_VERSION,
        "expected_firmware": EXPECTED_FIRMWARE,
    }


@app.get("/fleet")
def fleet(include_hass: bool = Query(False, alias="include_hass")) -> dict[str, Any]:
    state = get_fleet_state()
    inventory = list_inventory()
    payload = state.to_dict()
    payload["inventory"] = inventory
    if include_hass:
        payload["hass_states"] = state.to_hass_states(inventory)
    return payload


@app.websocket("/ws/fleet")
async def fleet_ws(websocket: WebSocket) -> None:
    await websocket.accept()
    try:
        while True:
            st = get_fleet_state()
            inv = list_inventory()
            ws_payload = st.to_dict()
            ws_payload["inventory"] = inv
            await websocket.send_json(ws_payload)
            import asyncio

            await asyncio.sleep(2.0)
    except WebSocketDisconnect:
        pass


@app.get("/settings")
def settings_get() -> dict[str, Any]:
    return {"settings": get_all_settings(), "inventory": list_inventory()}


@app.patch("/settings")
def settings_patch(body: SettingsPatch) -> dict[str, str]:
    for key, value in body.settings.items():
        set_setting(key, value)
    return get_all_settings()


@app.patch("/settings/inventory/{seat_id}")
def inventory_patch(seat_id: str, body: InventoryPatch) -> dict[str, Any]:
    try:
        patch = body.model_dump(exclude_none=True)
        return upsert_inventory(seat_id, patch)
    except KeyError as exc:
        raise HTTPException(404, f"unknown seat {seat_id}") from exc


@app.post("/control/service")
async def control_service(body: ServiceCallBody) -> dict[str, Any]:
    try:
        return await call_service_proxy(body.domain, body.service, body.data)
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(503, str(exc)) from exc


@app.get("/history")
def history_get(
    entity_id: str = Query(..., min_length=3),
    hours: float = Query(6.0, ge=0.25, le=168.0),
) -> dict[str, Any]:
    points = query_entity_history(entity_id, hours)
    return {"entity_id": entity_id, "hours": hours, "points": points}


@app.get("/roster")
def roster_get() -> dict[str, Any]:
    return {"roster": list_roster()}


@app.patch("/roster/{seat_id}")
def roster_patch(seat_id: str, body: RosterPatch) -> dict[str, Any]:
    patch = body.model_dump(exclude_none=True)
    return upsert_roster(seat_id, patch)


@app.get("/learning")
def learning_get(limit: int = Query(50, ge=1, le=500)) -> dict[str, Any]:
    return {"events": list_learning(limit=limit)}


@app.post("/settings/integrations/test-ollama")
async def integrations_test_ollama() -> dict[str, Any]:
    return await test_ollama()


@app.post("/settings/integrations/test-cannalib")
async def integrations_test_cannalib() -> dict[str, Any]:
    return await test_cannalib()


@app.post("/settings/zigbee/permit-join")
def zigbee_permit_join(body: PermitJoinBody) -> dict[str, bool]:
    set_permit_join(body.enabled)
    set_setting("zigbee_permit_join", "true" if body.enabled else "false")
    return {"permit_join": body.enabled}


@app.get("/settings/network")
def settings_network() -> dict[str, Any]:
    return network_status()


@app.post("/settings/network/apply")
def settings_network_apply() -> dict[str, str]:
    return apply_network_configs()


@app.get("/settings/catalog/status")
async def settings_catalog_status() -> dict[str, Any]:
    return await catalog_status()


@app.get("/settings/esphome/devices")
def settings_esphome_devices() -> dict[str, Any]:
    fleet = get_fleet_state().to_dict()
    devices = list_esphome_devices()
    for dev in devices:
        seat = dev["seat_id"]
        if seat in fleet.get("pots", {}):
            dev["last_firmware"] = fleet["pots"][seat].get("firmware")
            dev["online"] = fleet["pots"][seat].get("online")
        elif seat == "hub":
            dev["last_firmware"] = fleet.get("hub", {}).get("firmware")
            dev["online"] = fleet.get("hub", {}).get("online")
    return {"expected_firmware": EXPECTED_FIRMWARE, "devices": devices}


@app.get("/settings/esphome/jobs")
def settings_esphome_jobs(limit: int = Query(20, ge=1, le=100)) -> dict[str, Any]:
    return {"jobs": list_jobs(limit=limit)}


@app.post("/settings/esphome/jobs")
def settings_esphome_queue(body: EsphomeJobBody) -> dict[str, Any]:
    try:
        return queue_job(body.seat_id, body.action)
    except KeyError as exc:
        raise HTTPException(404, f"unknown seat {body.seat_id}") from exc
    except RuntimeError as exc:
        raise HTTPException(409, str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc


@app.get("/settings/backup/export")
def settings_backup_export() -> Response:
    data = export_backup_zip()
    return Response(
        content=data,
        media_type="application/zip",
        headers={"Content-Disposition": 'attachment; filename="dsc-hub-backup.zip"'},
    )


@app.post("/settings/backup/import")
async def settings_backup_import(file: UploadFile = File(...)) -> dict[str, str]:
    raw = await file.read()
    if not raw:
        raise HTTPException(400, "empty upload")
    return import_backup_zip(raw)


@app.get("/v1/catalogs/{kind}")
async def catalogs_proxy(kind: str, q: str = Query(""), limit: int = Query(20, ge=1, le=100)) -> list[dict]:
    """Prefer remote CannaLib API; fall back to local slim catalog."""
    try:
        rows = await catalog_search(kind, q, limit)
        if rows:
            return rows
    except Exception:
        pass
    mapping = {
        "strains": "strain",
        "strain": "strain",
        "nutrients": "nutrient",
        "nutrient": "nutrient",
        "mediums": "medium",
        "medium": "medium",
        "lights": "light",
        "light": "light",
    }
    key = mapping.get(kind)
    if not key:
        raise HTTPException(400, f"unknown kind {kind}")
    return search(key, q, limit=limit)


@app.post("/admin/reload-catalogs")
def admin_reload() -> dict[str, int]:
    return reload_catalogs()


@app.get("/catalogs/{kind}")
def catalogs_local(kind: str, q: str = Query(""), limit: int = Query(20, ge=1, le=100)) -> list[dict]:
    mapping = {
        "strains": "strain",
        "strain": "strain",
        "nutrients": "nutrient",
        "nutrient": "nutrient",
        "mediums": "medium",
        "medium": "medium",
        "lights": "light",
        "light": "light",
    }
    key = mapping.get(kind)
    if not key:
        raise HTTPException(400, f"unknown kind {kind}")
    return search(key, q, limit=limit)


@app.get("/want/{strain_id}")
def want(strain_id: str, stage: str = "veg") -> dict[str, Any]:
    if not get_strain(strain_id):
        raise HTTPException(404, "strain not found")
    return resolve_want(strain_id=strain_id, stage=stage)


@app.post("/decision/tick")
def tick(body: TickBody) -> dict[str, Any]:
    return decision_tick(
        seat=body.seat,
        strain_id=body.strain_id,
        stage=body.stage,
        got=body.got,
        custom_want=body.custom_want,
        manual_takeover=body.manual_takeover,
        emit=body.emit,
    )


@app.get("/")
def spa_index() -> FileResponse:
    index = STATIC_DIR / "index.html"
    if not index.exists():
        raise HTTPException(503, "SPA not built — run npm run build:spa")
    return FileResponse(index)


@app.get("/{full_path:path}")
def spa_fallback(full_path: str) -> FileResponse:
    if full_path.startswith("api") or full_path.startswith("v1"):
        raise HTTPException(404)
    file_path = STATIC_DIR / full_path
    if file_path.is_file():
        return FileResponse(file_path)
    index = STATIC_DIR / "index.html"
    if index.exists():
        return FileResponse(index)
    raise HTTPException(404)


def main() -> None:
    import uvicorn

    uvicorn.run("dsc_brain.api:app", host="0.0.0.0", port=8787, reload=False)


if __name__ == "__main__":
    main()
