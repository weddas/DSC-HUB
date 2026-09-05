"""DSC Brain API — Pi Release 8.0.0."""

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
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.types import Receive, Scope, Send
from pydantic import BaseModel, Field

from . import __version__
from .backup_ops import export_backup_zip, import_backup_zip
from .catalog import get_strain, init_db, reload_catalogs, search
from .computed_ops import build_computed_hass_states
from .control_ops import call_service_proxy, sync_inventory_in_service_to_hub
from .history_ops import ENTITY_METRIC_MAP, query_entity_history
from .event_log import list_grow_log
from .decision_loop import decision_tick
from .appliance_driver import start_appliance_driver, stop_appliance_driver
from .esphome_client import start_esphome_ingest, stop_esphome_ingest
from .esphome_jobs import list_esphome_devices, list_jobs, queue_job, start_esphome_worker, stop_esphome_worker
from .esphome_toolchain import (
    pending_fleet_rollout,
    start_fleet_rollout,
    status as esphome_toolchain_status,
    update_to_latest as esphome_toolchain_update,
)
from .fleet_state import get_fleet_state, merge_inventory_oos_seats
from .integrations import CatalogSearchError, catalog_search, catalog_status, catalog_strain_detail, test_cannalib, test_ollama
from .network_apply import apply_network_configs, network_status
from .kit_commission import (
    add_setup_debt,
    get_setup_state,
    mark_commissioned,
    set_setup_phase,
    setup_health,
)
from .usb_flash import (
    get_usb_flash_job,
    list_serial_ports,
    list_usb_flash_jobs,
    manifest_public,
    queue_usb_flash,
)
from .kit_update import start_full_update, update_status
from .paths import EXPECTED_FIRMWARE, SURFACE_VERSION
from .settings import (
    get_all_settings,
    init_settings_db,
    list_inventory,
    list_learning,
    list_roster,
    public_settings,
    set_setting,
    upsert_inventory,
    upsert_roster,
)
from .want import resolve_want
from .device_calibration import get_calibration, set_calibration_step
from .global_modifiers import get_global_modifiers, set_global_modifiers
from .soil_tests import (
    cancel_soil_test,
    confirm_soil_test,
    init_probe_station_defaults,
    list_probe_stations,
    list_soil_tests,
    patch_probe_station,
    poll_soil_test,
    start_soil_test,
)
from .root_steering import (
    build_root_steering_snapshot,
    is_root_steering_override,
    set_root_steering_override,
)
from .zigbee_mqtt import (
    get_zigbee_devices,
    get_zigbee_health,
    get_zigbee_role_catalog,
    load_zigbee_bindings,
    save_zigbee_bindings,
    set_permit_join,
    start_zigbee_ingest,
    stop_zigbee_ingest,
)
from .zigbee_policies import (
    get_recipe_catalog,
    load_zigbee_policies,
    save_zigbee_policies,
)

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


class DemandBody(BaseModel):
    """Convenience proxy for hub appliance demand switches."""

    seat: str = Field(..., description="heater | heatmat | humidifier | dehumidifier | ac | clone_humidifier")
    on: bool = True


SEAT_DEMAND_ENTITY: dict[str, str] = {
    "heater": "switch.dsc_hub_heater_demand",
    "heatmat": "switch.dsc_hub_grow_mat_demand",
    "humidifier": "switch.dsc_hub_humidifier_demand",
    "dehumidifier": "switch.dsc_hub_dehumidifier_demand",
    "ac": "switch.dsc_hub_ac_demand",
    "clone_humidifier": "switch.dsc_hub_clone_humidifier_demand",
}


class InventoryPatch(BaseModel):
    host: str | None = None
    mac: str | None = None
    api_key: str | None = None
    in_service: bool | None = None
    extra: dict[str, Any] | None = None


class InventoryCreate(BaseModel):
    seat_id: str = Field(..., min_length=1, max_length=64)
    role: str = "extra"
    host: str | None = None
    mac: str | None = None
    api_key: str | None = None
    in_service: bool = True
    extra: dict[str, Any] | None = None


class RosterPatch(BaseModel):
    strain_id: str | None = None
    stage: str | None = None
    recipe: dict[str, Any] | None = None
    tent: str | None = None
    sprout_date: str | None = None


class PermitJoinBody(BaseModel):
    enabled: bool = True
    duration_s: int = 254


class ZigbeeBindingsBody(BaseModel):
    bindings: dict[str, dict[str, Any]] = Field(default_factory=dict)


class ZigbeePoliciesBody(BaseModel):
    policies: dict[str, dict[str, Any]] = Field(default_factory=dict)


class EsphomeJobBody(BaseModel):
    seat_id: str
    action: str = "ota"


class EsphomeToolchainUpdateBody(BaseModel):
    target: str | None = None  # pin to an explicit version, else latest


class SetupPhaseBody(BaseModel):
    phase: str


class SetupCommissionBody(BaseModel):
    require_hub_online: bool = False


class SetupDebtBody(BaseModel):
    item: str


class UsbFlashJobBody(BaseModel):
    role: str
    port: str


class CalibrationStepBody(BaseModel):
    step_key: str
    measured_value: float
    unit: str = ""


class CalibrationWriteBody(BaseModel):
    cal_type: str = "fan_cfm"
    steps: list[CalibrationStepBody] = Field(default_factory=list)


class GlobalModifiersPatch(BaseModel):
    fan_demand_scale: float | None = None
    light_brightness_scale: float | None = None
    temp_offset_c: dict[str, float] | None = None
    rh_offset_pct: dict[str, float] | None = None


class ProbeStationPatch(BaseModel):
    idle_home_pot_id: str | None = None
    tent: str | None = None
    clear_role: bool | None = None


class PotPlantPatch(BaseModel):
    plant_name: str | None = None
    strain_display: str | None = None
    sprout_date: str | None = None
    growth_stage: str | None = None
    tent: str | None = None
    notes: str | None = None
    blend: str | None = None


class RosterAssignBody(BaseModel):
    slot: int
    pot: int


class RosterMoveBody(BaseModel):
    from_pot: int
    to_pot: int


class JournalEntryBody(BaseModel):
    note: str = ""
    occurred_at: float | None = None
    tags: list[str] | None = None


class JournalPatchBody(BaseModel):
    note: str | None = None
    tags: list[str] | None = None
    occurred_at: float | None = None


def _journal_mutation_http(exc: Exception) -> None:
    from .journal_snapshot import JournalForbiddenError

    if isinstance(exc, JournalForbiddenError):
        raise HTTPException(403, str(exc) or "system journal rows are read-only") from exc
    if isinstance(exc, ValueError):
        raise HTTPException(404, str(exc) or "journal entry not found") from exc
    raise exc


class SpaceDeviceBody(BaseModel):
    label: str | None = None
    watts: float | None = None
    duty_source: str | None = None
    enabled: bool | None = None
    extra: dict[str, Any] | None = None


class TariffBandBody(BaseModel):
    band_id: str
    label: str | None = None
    start_min: int | None = None
    end_min: int | None = None
    rate_per_kwh: float | None = None


class EnergyLearningPatch(BaseModel):
    enabled: bool | None = None
    prefer_growth_outliers: bool | None = None
    outlier_days: int | None = None
    norm_days: int | None = None


class ShiftPlanBody(BaseModel):
    space_id: str
    from_on: str
    to_on: str
    want_hours: float = 12.0
    policy: str = "veg_style"
    confirm: bool = False


class FlipRequestBody(BaseModel):
    space_id: str
    plant_id: str | None = None
    from_hours: float
    to_hours: float
    note: str = ""


class FlipResolveBody(BaseModel):
    approve: bool


class SoilTestStartBody(BaseModel):
    probe_seat_id: str
    target_pot_id: str
    roster_seat_id: str | None = None
    plant_label: str = ""
    mode: str = "roster"
    timing_note: str = "adhoc"
    notes: str = ""
    tent: str | None = None


def _demo_mode() -> bool:
    from .demo_mode import is_demo_mode

    return is_demo_mode()


def _demo_forbidden() -> None:
    raise HTTPException(403, detail=demo_blocked_detail())


def demo_blocked_detail() -> str:
    return "demo_simulation — blocked (software only, no hardware/network apply)"


@asynccontextmanager
async def lifespan(app: FastAPI):  # noqa: ARG001
    from .demo_mode import assert_demo_safe_config, is_demo_mode, prepare_demo_settings
    from .demo_simulator import start_demo_simulator, stop_demo_simulator
    from .follow_plants_job import start_follow_plants_job, stop_follow_plants_job

    init_db()
    init_settings_db()
    init_probe_station_defaults()
    from .soft_cal_history import init_soft_cal_history

    init_soft_cal_history()
    try:
        from .energy_model import ensure_default_tariff
        from .room_model import ensure_kit_rooms
        from .space_model import ensure_kit_spaces

        ensure_kit_spaces()
        ensure_kit_rooms()
        ensure_default_tariff()
    except Exception:  # noqa: BLE001
        pass
    reload_catalogs()
    try:
        from .plant_probe import migrate_legacy_plant_ids

        migrate_legacy_plant_ids()
    except Exception:  # noqa: BLE001
        pass
    if is_demo_mode():
        prepare_demo_settings()
        assert_demo_safe_config()
        start_demo_simulator()
    else:
        start_esphome_ingest()
        start_esphome_worker()
        start_appliance_driver()
        start_zigbee_ingest()
        start_follow_plants_job()
    yield
    if is_demo_mode():
        await stop_demo_simulator()
    else:
        await stop_follow_plants_job()
        await stop_appliance_driver()
        await stop_esphome_ingest()
        stop_esphome_worker()
        stop_zigbee_ingest()


app = FastAPI(title="DSC Brain", version=__version__, lifespan=lifespan)


class _DemoEmbedHeadersMiddleware(BaseHTTPMiddleware):
    """Allow PD site to iframe the public demo origin."""

    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        if not _demo_mode():
            return response
        response.headers["Content-Security-Policy"] = (
            "frame-ancestors 'self' https://plausible-deniability.net https://www.plausible-deniability.net"
        )
        if "x-frame-options" in response.headers:
            del response.headers["x-frame-options"]
        return response


app.add_middleware(_DemoEmbedHeadersMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class _SpaCacheStaticFiles(StaticFiles):
    """Hashed bundles are immutable; avoid stale index.html caching old hashes."""

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        async def send_wrapper(message: dict) -> None:
            if message["type"] == "http.response.start":
                headers = list(message.get("headers", []))
                headers = [(k, v) for k, v in headers if k.lower() != b"cache-control"]
                headers.append((b"cache-control", b"public, max-age=31536000, immutable"))
                message = {**message, "headers": headers}
            await send(message)

        await super().__call__(scope, receive, send_wrapper)


def _spa_index_response(index: Path) -> FileResponse:
    return FileResponse(
        index,
        headers={"Cache-Control": "no-cache, no-store, must-revalidate"},
    )


# Mount each SPA dir only when it actually exists. `brain/static/index.html` is
# tracked but the built `assets/` bundle is not (Docker frontend stage / deploy),
# so brain-only checkouts (CI) must import the API without it.
_assets_dir = STATIC_DIR / "assets"
if _assets_dir.is_dir():
    app.mount("/assets", _SpaCacheStaticFiles(directory=str(_assets_dir)), name="assets")
_vendor_dir = STATIC_DIR / "vendor"
if _vendor_dir.is_dir():
    app.mount("/vendor", _SpaCacheStaticFiles(directory=str(_vendor_dir)), name="vendor")


@app.get("/health")
def health() -> dict[str, Any]:
    payload: dict[str, Any] = {
        "status": "ok",
        "version": __version__,
        "surface": SURFACE_VERSION,
        "expected_firmware": EXPECTED_FIRMWARE,
        "mode": "demo" if _demo_mode() else "live",
    }
    if _demo_mode():
        payload["simulation"] = True
        payload["detail"] = "Software simulation only — no hardware connected"
    else:
        payload["zigbee"] = get_zigbee_health()
    return payload


@app.get("/setup/state")
def setup_state() -> dict[str, Any]:
    return get_setup_state()


@app.get("/setup/health")
def setup_health_route() -> dict[str, Any]:
    return setup_health()


@app.post("/setup/phase")
def setup_phase(body: SetupPhaseBody) -> dict[str, Any]:
    if _demo_mode():
        _demo_forbidden()
    try:
        return set_setup_phase(body.phase)
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc


@app.post("/setup/debt")
def setup_debt(body: SetupDebtBody) -> dict[str, Any]:
    if _demo_mode():
        _demo_forbidden()
    return add_setup_debt(body.item.strip())


@app.post("/setup/commission")
def setup_commission(body: SetupCommissionBody | None = None) -> dict[str, Any]:
    if _demo_mode():
        _demo_forbidden()
    req_hub = bool(body.require_hub_online) if body else False
    try:
        return mark_commissioned(require_hub_online=req_hub)
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc


@app.get("/fleet")
def fleet(
    include_hass: bool = Query(False, alias="include_hass"),
    include_computed: bool = Query(False, alias="include_computed"),
) -> dict[str, Any]:
    state = get_fleet_state()
    inventory = list_inventory()
    payload = state.to_dict()
    merge_inventory_oos_seats(payload, inventory)
    payload["inventory"] = inventory
    lights_on = False
    hub_vals = (payload.get("hub") or {}).get("values") or {}
    twin = hub_vals.get("twin_sf1000_on")
    sf = hub_vals.get("sf1000_on")
    # Prefer explicit light state from hass_states when present
    hass = state.to_hass_states(inventory)
    twin_st = (hass.get("light.dsc_hub_twin_sf1000") or {}).get("state")
    sf_st = (hass.get("light.dsc_hub_sf1000_dimmer") or {}).get("state")
    win = (hass.get("binary_sensor.dsc_hub_4x8_window_open") or {}).get("state")
    if twin_st == "on" or sf_st == "on" or win == "on":
        lights_on = True
    elif twin is True or sf is True:
        lights_on = True
    reading_ok: dict[str, bool] = {}
    for pot_id, pot in (payload.get("pots") or {}).items():
        vals = (pot or {}).get("values") or {}
        reading_ok[str(pot_id)] = bool(pot.get("online")) and not bool(vals.get("sensor_fault"))
    payload["root_steering"] = build_root_steering_snapshot(
        state.pots,
        lights_on=lights_on,
        reading_ok_by_pot=reading_ok,
    )
    if include_computed:
        payload["hass_extras"] = build_computed_hass_states(state, inventory)
    if include_hass:
        payload["hass_states"] = hass
    return payload


class RootSteeringOverrideBody(BaseModel):
    enabled: bool = True


@app.get("/control/root-steering")
def control_root_steering_get() -> dict[str, Any]:
    return fleet().get("root_steering") or {}


@app.post("/control/root-steering/override")
def control_root_steering_override(body: RootSteeringOverrideBody) -> dict[str, Any]:
    if _demo_mode():
        _demo_forbidden()
    set_root_steering_override(body.enabled)
    return {"override": is_root_steering_override(), "root_steering": control_root_steering_get()}


@app.post("/control/irrigation/shot")
def control_irrigation_shot(body: dict[str, Any] | None = None) -> dict[str, Any]:
    """IrrigAct: Zigbee plug_pump shot when bound; honest OOS otherwise."""
    if _demo_mode():
        _demo_forbidden()
    from .irrigact import irrigation_shot

    b = body or {}
    pot_id = str(b.get("pot_id") or "")
    duration_s = float(b.get("duration_s") or 2.0)
    return irrigation_shot(pot_id=pot_id, duration_s=duration_s)

@app.get("/fleet/computed")
def fleet_computed() -> dict[str, Any]:
    """Computed dash helpers (CFM, alerts, fleet chip) — off the native /fleet hot path."""
    state = get_fleet_state()
    inventory = list_inventory()
    return {"hass_extras": build_computed_hass_states(state, inventory)}


@app.websocket("/ws/fleet")
async def fleet_ws(websocket: WebSocket) -> None:
    await websocket.accept()
    try:
        while True:
            st = get_fleet_state()
            inv = list_inventory()
            ws_payload = st.to_dict()
            merge_inventory_oos_seats(ws_payload, inv)
            ws_payload["inventory"] = inv
            await websocket.send_json(ws_payload)
            import asyncio

            await asyncio.sleep(2.0)
    except WebSocketDisconnect:
        pass


@app.get("/settings")
def settings_get() -> dict[str, Any]:
    return {"settings": public_settings(), "inventory": list_inventory()}


@app.patch("/settings")
def settings_patch(body: SettingsPatch) -> dict[str, Any]:
    for key, value in body.settings.items():
        set_setting(key, value)
    return public_settings()


@app.patch("/settings/inventory/{seat_id}")
async def inventory_patch(seat_id: str, body: InventoryPatch) -> dict[str, Any]:
    try:
        patch = body.model_dump(exclude_none=True)
        result = upsert_inventory(seat_id, patch)
        if "in_service" in patch:
            if not _demo_mode():
                try:
                    await sync_inventory_in_service_to_hub(seat_id, bool(result["in_service"]))
                except Exception as exc:
                    import logging

                    logging.getLogger(__name__).warning(
                        "inventory hub in_service sync failed for %s: %s", seat_id, exc
                    )
        return result
    except KeyError as exc:
        raise HTTPException(404, f"unknown seat {seat_id}") from exc


@app.post("/settings/inventory")
def inventory_create(body: InventoryCreate) -> dict[str, Any]:
    patch = body.model_dump(exclude={"seat_id"}, exclude_none=True)
    return upsert_inventory(body.seat_id, patch, create=True)


@app.post("/settings/inventory/create-extra-seat")
def inventory_create_extra_seat(body: InventoryCreate) -> dict[str, Any]:
    """Add a user-defined inventory seat (Zigbee sensor, extra appliance, …)."""
    patch = body.model_dump(exclude={"seat_id"}, exclude_none=True)
    return upsert_inventory(body.seat_id, patch, create=True)


@app.post("/control/service")
async def control_service(body: ServiceCallBody) -> dict[str, Any]:
    try:
        return await call_service_proxy(body.domain, body.service, body.data)
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(503, str(exc)) from exc
    except Exception as exc:
        raise HTTPException(503, f"control failed: {exc}") from exc


@app.post("/control/demand")
async def control_demand(body: DemandBody) -> dict[str, Any]:
    """Toggle hub appliance demand (heater, humidifier, …) without HA entity ceremony."""
    entity_id = SEAT_DEMAND_ENTITY.get(body.seat)
    if not entity_id:
        raise HTTPException(400, f"unknown demand seat {body.seat}")
    service = "turn_on" if body.on else "turn_off"
    try:
        return await call_service_proxy("switch", service, {"entity_id": entity_id})
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(503, str(exc)) from exc
    except Exception as exc:
        raise HTTPException(503, f"demand failed: {exc}") from exc


@app.get("/history")
def history_get(
    entity_id: str = Query(..., min_length=3),
    hours: float = Query(6.0, ge=0.25, le=168.0),
) -> dict[str, Any]:
    tracked = entity_id in ENTITY_METRIC_MAP
    if not tracked:
        import logging

        logging.getLogger(__name__).debug(
            "GET /history requested for unmapped entity_id=%s — not in ENTITY_METRIC_MAP", entity_id
        )
    points = query_entity_history(entity_id, hours)
    # Distinguishes "recorder never heard of this entity" from "tracked but genuinely
    # empty in range" — both otherwise looked identical as points: [].
    return {"entity_id": entity_id, "hours": hours, "points": points, "tracked": tracked}


@app.get("/grow-log")
def grow_log_get(
    hours: float = Query(24.0, ge=1.0, le=168.0),
    limit: int = Query(100, ge=1, le=500),
) -> dict[str, Any]:
    events = list_grow_log(hours=hours, limit=limit)
    return {"hours": hours, "events": events}


@app.get("/roster")
def roster_get() -> dict[str, Any]:
    return {"roster": list_roster()}


@app.patch("/roster/{seat_id}")
def roster_patch(seat_id: str, body: RosterPatch) -> dict[str, Any]:
    from .compose_ops import derived_stage_for
    from .stage_model import stage_family, tent_id

    patch = body.model_dump(exclude_none=True)
    tent = patch.pop("tent", None)
    sprout = patch.pop("sprout_date", None)
    recipe = dict(patch.get("recipe") or {})
    if tent is not None:
        recipe["tent"] = tent_id(str(tent))
    if sprout is not None:
        recipe["sprout_date"] = str(sprout)[:10]
        stage = derived_stage_for(str(sprout), str(patch.get("strain_id") or ""))
        if stage:
            recipe["growth_stage"] = stage
            patch["stage"] = stage_family(stage) or "veg"
    if recipe:
        patch["recipe"] = recipe
    return upsert_roster(seat_id, patch)


@app.patch("/roster/pots/{pot_n}")
def roster_pot_patch(pot_n: int, body: PotPlantPatch) -> dict[str, Any]:
    """Full plant edit on an occupied pot (name, strain, sprout, stage, tent, notes, blend)."""
    from .compose_ops import update_pot_recipe

    if pot_n < 1 or pot_n > 4:
        raise HTTPException(400, "pot must be 1–4")
    try:
        return update_pot_recipe(pot_n, body.model_dump(exclude_none=True))
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc


@app.post("/roster/slots/{slot_n}/retire")
def roster_slot_retire(slot_n: int) -> dict[str, Any]:
    """Retire a roster slot by number (stock, detached, or probe-assigned)."""
    from .compose_ops import retire_roster_slot

    from .compose_store import ROSTER_SLOT_COUNT

    if slot_n < 1 or slot_n > ROSTER_SLOT_COUNT:
        raise HTTPException(400, f"slot must be 1–{ROSTER_SLOT_COUNT}")
    try:
        return retire_roster_slot(slot_n)
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc


@app.post("/roster/detach/{pot_n}")
def roster_detach(pot_n: int) -> dict[str, Any]:
    """Detach plant from probe; keep roster slot (not retire)."""
    from .plant_probe import detach_plant_from_probe

    if pot_n < 1 or pot_n > 4:
        raise HTTPException(400, "pot must be 1–4")
    try:
        return detach_plant_from_probe(pot_n)
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc


@app.post("/roster/assign")
def roster_assign(body: RosterAssignBody) -> dict[str, Any]:
    from .plant_probe import assign_plant_to_probe

    try:
        return assign_plant_to_probe(body.slot, body.pot)
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc


@app.post("/roster/move")
def roster_move(body: RosterMoveBody) -> dict[str, Any]:
    from .plant_probe import move_plant

    try:
        return move_plant(body.from_pot, body.to_pot)
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc


@app.get("/learning")
def learning_get(limit: int = Query(50, ge=1, le=500)) -> dict[str, Any]:
    return {"events": list_learning(limit=limit)}


@app.post("/settings/integrations/test-ollama")
async def integrations_test_ollama() -> dict[str, Any]:
    if _demo_mode():
        return {"ok": False, "mode": "demo_simulation", "detail": "Ollama disabled in demo"}
    return await test_ollama()


@app.post("/settings/integrations/test-cannalib")
async def integrations_test_cannalib() -> dict[str, Any]:
    if _demo_mode():
        return {"ok": True, "mode": "demo_simulation", "detail": "Local catalog fallback only"}
    return await test_cannalib()


@app.post("/settings/zigbee/permit-join")
def zigbee_permit_join(body: PermitJoinBody) -> dict[str, Any]:
    if _demo_mode():
        _demo_forbidden()
    set_permit_join(body.enabled, body.duration_s)
    set_setting("zigbee_permit_join", "true" if body.enabled else "false")
    return {"permit_join": body.enabled, "duration_s": body.duration_s if body.enabled else 0}


@app.get("/settings/zigbee/devices")
def settings_zigbee_devices() -> dict[str, Any]:
    return {"devices": get_zigbee_devices()}


@app.get("/settings/zigbee/roles")
def settings_zigbee_roles() -> dict[str, Any]:
    return {"roles": get_zigbee_role_catalog()}


@app.get("/settings/zigbee/bindings")
def settings_zigbee_bindings_get() -> dict[str, Any]:
    return {"bindings": load_zigbee_bindings()}


@app.put("/settings/zigbee/bindings")
def settings_zigbee_bindings_put(body: ZigbeeBindingsBody) -> dict[str, Any]:
    if _demo_mode():
        _demo_forbidden()
    try:
        cleaned = save_zigbee_bindings(body.bindings)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return {"bindings": cleaned}


@app.get("/settings/zigbee/recipes")
def settings_zigbee_recipes() -> dict[str, Any]:
    return {"recipes": get_recipe_catalog()}


@app.get("/settings/zigbee/policies")
def settings_zigbee_policies_get() -> dict[str, Any]:
    return {"policies": load_zigbee_policies()}


@app.put("/settings/zigbee/policies")
def settings_zigbee_policies_put(body: ZigbeePoliciesBody) -> dict[str, Any]:
    if _demo_mode():
        _demo_forbidden()
    try:
        cleaned = save_zigbee_policies(body.policies)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return {"policies": cleaned}


@app.get("/settings/zigbee/health")
def settings_zigbee_health() -> dict[str, Any]:
    return get_zigbee_health()


@app.get("/settings/global-modifiers")
def settings_global_modifiers_get() -> dict[str, Any]:
    return {"modifiers": get_global_modifiers()}


@app.patch("/settings/global-modifiers")
def settings_global_modifiers_patch(body: GlobalModifiersPatch) -> dict[str, Any]:
    patch = body.model_dump(exclude_none=True)
    return {"modifiers": set_global_modifiers(patch)}


@app.get("/settings/probe-stations")
def settings_probe_stations_get() -> dict[str, Any]:
    return {"stations": list_probe_stations()}


@app.patch("/settings/probe-stations/{seat_id}")
def settings_probe_stations_patch(seat_id: str, body: ProbeStationPatch) -> dict[str, Any]:
    try:
        return patch_probe_station(seat_id, body.model_dump(exclude_none=True))
    except KeyError as exc:
        raise HTTPException(404, f"unknown seat {seat_id}") from exc


@app.post("/soil-tests/start")
def soil_tests_start(body: SoilTestStartBody) -> dict[str, Any]:
    try:
        return start_soil_test(body.model_dump())
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc


@app.get("/soil-tests/{test_id}")
def soil_tests_get(test_id: str) -> dict[str, Any]:
    try:
        return poll_soil_test(test_id)
    except KeyError as exc:
        raise HTTPException(404, "unknown test") from exc


@app.post("/soil-tests/{test_id}/confirm")
def soil_tests_confirm(test_id: str) -> dict[str, Any]:
    try:
        return confirm_soil_test(test_id)
    except KeyError as exc:
        raise HTTPException(404, "unknown test") from exc
    except ValueError as exc:
        raise HTTPException(409, str(exc)) from exc


@app.post("/soil-tests/{test_id}/cancel")
def soil_tests_cancel(test_id: str) -> dict[str, Any]:
    return cancel_soil_test(test_id)


@app.get("/soil-tests")
def soil_tests_list(
    roster_seat_id: str | None = Query(None),
    limit: int = Query(50, ge=1, le=200),
) -> dict[str, Any]:
    return {"tests": list_soil_tests(roster_seat_id=roster_seat_id, limit=limit)}


@app.post("/ai/soft-cal-advice")
async def ai_soft_cal_advice(body: dict[str, Any] | None = None) -> dict[str, Any]:
    """SoftCal + climate-mode AI: narrative + guardrailed actions (no invent actuators)."""
    from .soft_cal_ai import soft_cal_climate_advice

    b = body or {}
    return await soft_cal_climate_advice(
        seat=str(b.get("seat") or "pot1"),
        strain_id=b.get("strain_id"),
        stage=str(b.get("stage") or "veg"),
        got=b.get("got") if isinstance(b.get("got"), dict) else None,
        soft_cal=b.get("soft_cal") if isinstance(b.get("soft_cal"), dict) else None,
        manual_takeover=bool(b.get("manual_takeover")),
    )


@app.get("/soft-cal/sessions")
def soft_cal_sessions_list(
    probe_n: int | None = Query(None),
    limit: int = Query(50, ge=1, le=200),
) -> dict[str, Any]:
    from .soft_cal_history import list_soft_cal_sessions

    return {"sessions": list_soft_cal_sessions(probe_n=probe_n, limit=limit)}


@app.post("/soft-cal/sessions")
def soft_cal_session_record(body: dict[str, Any]) -> dict[str, Any]:
    from .soft_cal_history import record_soft_cal_session

    probe_n = int(body.get("probe_n") or 0)
    phase = str(body.get("phase") or "")
    payload = body.get("payload") if isinstance(body.get("payload"), dict) else {}
    if probe_n < 1 or probe_n > 4 or not phase:
        raise HTTPException(status_code=400, detail="probe_n 1-4 and phase required")
    return record_soft_cal_session(probe_n, phase, payload)


@app.get("/settings/calibration/{device_id}")
def settings_calibration_get(
    device_id: str,
    cal_type: str | None = Query(None),
) -> dict[str, Any]:
    rows = get_calibration(device_id, cal_type)
    return {"device_id": device_id, "calibrations": rows}


@app.post("/settings/calibration/{device_id}")
def settings_calibration_post(device_id: str, body: CalibrationWriteBody) -> dict[str, Any]:
    saved: list[dict[str, Any]] = []
    try:
        for step in body.steps:
            saved.append(
                set_calibration_step(
                    device_id,
                    body.cal_type,
                    step.step_key,
                    step.measured_value,
                    step.unit,
                )
            )
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc
    return {"device_id": device_id, "cal_type": body.cal_type, "calibrations": saved}


@app.get("/settings/network")
def settings_network() -> dict[str, Any]:
    return network_status()


@app.post("/settings/network/apply")
def settings_network_apply() -> dict[str, Any]:
    if _demo_mode():
        _demo_forbidden()
    return apply_network_configs(restart_ap=True)


@app.get("/settings/catalog/status")
async def settings_catalog_status() -> dict[str, Any]:
    return await catalog_status()


# Inventory seat_id → fleet_state key (control panel is stored as panel).
_FLEET_SEAT_ALIAS: dict[str, str] = {"control": "panel"}


def _merge_fleet_device_status(dev: dict[str, Any], fleet: dict[str, Any]) -> None:
    seat = str(dev["seat_id"])
    fleet_key = _FLEET_SEAT_ALIAS.get(seat, seat)
    if fleet_key in fleet.get("pots", {}):
        pot = fleet["pots"][fleet_key]
        dev["last_firmware"] = pot.get("firmware")
        dev["online"] = pot.get("online")
    elif fleet_key == "hub":
        dev["last_firmware"] = fleet.get("hub", {}).get("firmware")
        dev["online"] = fleet.get("hub", {}).get("online")
    elif fleet_key == "panel":
        dev["last_firmware"] = fleet.get("panel", {}).get("firmware")
        dev["online"] = fleet.get("panel", {}).get("online")
    elif fleet_key in fleet.get("sonoffs", {}):
        son = fleet["sonoffs"][fleet_key]
        dev["last_firmware"] = son.get("firmware")
        dev["online"] = son.get("online")


@app.get("/settings/esphome/devices")
def settings_esphome_devices() -> dict[str, Any]:
    fleet = get_fleet_state().to_dict()
    devices = list_esphome_devices()
    for dev in devices:
        _merge_fleet_device_status(dev, fleet)
    return {"expected_firmware": EXPECTED_FIRMWARE, "devices": devices}


@app.get("/settings/usb-flash/ports")
def settings_usb_flash_ports() -> dict[str, Any]:
    return {"ports": list_serial_ports()}


@app.get("/settings/update")
def settings_update_status() -> dict[str, Any]:
    return update_status()


@app.post("/settings/update/pull")
def settings_update_pull() -> dict[str, Any]:
    if _demo_mode():
        _demo_forbidden()
    try:
        return start_full_update()
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc


@app.get("/settings/usb-flash/manifest")
def settings_usb_flash_manifest() -> dict[str, Any]:
    return manifest_public()


@app.get("/settings/usb-flash/jobs")
def settings_usb_flash_jobs(limit: int = Query(20, ge=1, le=100)) -> dict[str, Any]:
    return {"jobs": list_usb_flash_jobs(limit=limit)}


@app.get("/settings/usb-flash/jobs/{job_id}")
def settings_usb_flash_job(job_id: str) -> dict[str, Any]:
    job = get_usb_flash_job(job_id)
    if not job:
        raise HTTPException(404, "job not found")
    return job


@app.post("/settings/usb-flash/jobs")
def settings_usb_flash_queue(body: UsbFlashJobBody) -> dict[str, Any]:
    if _demo_mode():
        _demo_forbidden()
    try:
        return queue_usb_flash(body.role, body.port)
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(409, str(exc)) from exc


@app.get("/settings/esphome/jobs")
def settings_esphome_jobs(limit: int = Query(20, ge=1, le=100)) -> dict[str, Any]:
    return {"jobs": list_jobs(limit=limit)}


@app.post("/settings/esphome/jobs")
def settings_esphome_queue(body: EsphomeJobBody) -> dict[str, Any]:
    if _demo_mode():
        _demo_forbidden()
    try:
        return queue_job(body.seat_id, body.action)
    except KeyError as exc:
        raise HTTPException(404, f"unknown seat {body.seat_id}") from exc
    except RuntimeError as exc:
        raise HTTPException(409, str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc


@app.get("/settings/esphome/toolchain")
def settings_esphome_toolchain(refresh: bool = Query(False)) -> dict[str, Any]:
    """Installed vs latest (PyPI) vs pinned min_version, plus per-seat drift."""
    return esphome_toolchain_status(force_latest=refresh)


@app.post("/settings/esphome/toolchain/update")
def settings_esphome_toolchain_update(body: EsphomeToolchainUpdateBody) -> dict[str, Any]:
    """`pip install -U esphome` in the Pi venv. Ethernet-gated, one at a time."""
    if _demo_mode():
        _demo_forbidden()
    try:
        return esphome_toolchain_update(target=body.target)
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(409, str(exc)) from exc


@app.get("/settings/esphome/rollout")
def settings_esphome_rollout() -> dict[str, Any]:
    """Seats that would be reflashed if the operator confirms a post-upgrade rollout."""
    return pending_fleet_rollout()


@app.post("/settings/esphome/rollout")
def settings_esphome_rollout_start() -> dict[str, Any]:
    """One confirm click: enqueue an OTA per in-service seat, hub last."""
    if _demo_mode():
        _demo_forbidden()
    return start_fleet_rollout()


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
    if _demo_mode():
        _demo_forbidden()
    raw = await file.read()
    if not raw:
        raise HTTPException(400, "empty upload")
    return import_backup_zip(raw)


@app.get("/v1/catalogs/{kind}")
async def catalogs_proxy(
    kind: str,
    q: str = Query(""),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0, le=500_000),
) -> list[dict]:
    """Prefer remote CannaLib API; fall back to on-host corpus sqlite; then slim Want."""
    try:
        rows = await catalog_search(kind, q, limit, offset)
        if rows:
            return rows
    except CatalogSearchError as exc:
        raise HTTPException(503, exc.detail) from exc
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


@app.get("/v1/catalogs/strains/{strain_id}")
async def strain_detail_proxy(strain_id: str) -> dict[str, Any]:
    """Live CannaLib strain_tree hydrate (licensed media when present)."""
    try:
        detail = await catalog_strain_detail(strain_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(502, f"CannaLib strain hydrate failed: {exc}") from exc
    if not detail:
        raise HTTPException(404, "strain not found")
    return detail


@app.get("/v1/media/assets/{asset_id}")
async def media_asset_proxy(asset_id: str) -> Response:
    """Proxy CannaLib licensed strain media for Pi same-origin Research cards."""
    from .integrations import catalog_media_asset

    try:
        got = await catalog_media_asset(asset_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(502, f"CannaLib media proxy failed: {exc}") from exc
    if not got:
        raise HTTPException(404, "media not found")
    data, mime = got
    return Response(content=data, media_type=mime)


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


# --- Space energy / journals (approve-only schedule) ---


@app.get("/journal/plant/{plant_id}")
def journal_plant_get(
    plant_id: str,
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
) -> dict[str, Any]:
    from .plant_journal import count_plant_journal, list_plant_journal

    return {
        "plant_id": plant_id,
        "entries": list_plant_journal(plant_id, limit=limit, offset=offset),
        "total": count_plant_journal(plant_id),
        "limit": limit,
        "offset": offset,
    }


@app.post("/journal/plant/{plant_id}")
def journal_plant_post(plant_id: str, body: JournalEntryBody) -> dict[str, Any]:
    from .plant_journal import add_plant_entry

    try:
        return add_plant_entry(
            plant_id,
            body.occurred_at,
            body.note,
            source="operator",
            tags=body.tags,
        )
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc


@app.patch("/journal/plant/{plant_id}/{entry_id}")
def journal_plant_patch(plant_id: str, entry_id: int, body: JournalPatchBody) -> dict[str, Any]:
    from .plant_journal import update_plant_entry

    try:
        return update_plant_entry(
            plant_id,
            entry_id,
            note=body.note,
            tags=body.tags,
            occurred_at=body.occurred_at,
        )
    except (ValueError, Exception) as exc:
        _journal_mutation_http(exc)
        raise  # pragma: no cover


@app.delete("/journal/plant/{plant_id}/{entry_id}")
def journal_plant_delete(plant_id: str, entry_id: int) -> dict[str, Any]:
    from .plant_journal import delete_plant_entry

    try:
        delete_plant_entry(plant_id, entry_id)
    except (ValueError, Exception) as exc:
        _journal_mutation_http(exc)
    return {"ok": True, "deleted_id": entry_id}


@app.get("/journal/space/{space_id}")
def journal_space_get(
    space_id: str,
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
) -> dict[str, Any]:
    from .space_journal import count_space_journal, list_space_journal
    from .space_occupants import occupant_plant_ids_for_space

    return {
        "space_id": space_id,
        "entries": list_space_journal(
            space_id,
            limit=limit,
            offset=offset,
            resolve_occupants=occupant_plant_ids_for_space,
        ),
        "total": count_space_journal(space_id, resolve_occupants=occupant_plant_ids_for_space),
        "limit": limit,
        "offset": offset,
    }


@app.post("/journal/space/{space_id}")
def journal_space_post(space_id: str, body: JournalEntryBody) -> dict[str, Any]:
    from .space_journal import add_space_entry

    try:
        return add_space_entry(
            space_id,
            body.occurred_at,
            body.note,
            source="operator",
            tags=body.tags,
        )
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc


@app.patch("/journal/space/{space_id}/{entry_id}")
def journal_space_patch(space_id: str, entry_id: int, body: JournalPatchBody) -> dict[str, Any]:
    from .space_journal import update_space_entry

    try:
        return update_space_entry(
            space_id, entry_id, note=body.note, tags=body.tags, occurred_at=body.occurred_at
        )
    except (ValueError, Exception) as exc:
        _journal_mutation_http(exc)
        raise  # pragma: no cover


@app.delete("/journal/space/{space_id}/{entry_id}")
def journal_space_delete(space_id: str, entry_id: int) -> dict[str, Any]:
    from .space_journal import delete_space_entry

    try:
        delete_space_entry(space_id, entry_id)
    except (ValueError, Exception) as exc:
        _journal_mutation_http(exc)
    return {"ok": True, "deleted_id": entry_id}


@app.get("/spaces")
def spaces_get() -> dict[str, Any]:
    from .space_model import ensure_kit_spaces, list_space_devices, list_spaces

    spaces = ensure_kit_spaces()
    return {
        "spaces": [
            {**s, "devices": list_space_devices(s["space_id"])} for s in spaces
        ]
    }


@app.post("/spaces")
def spaces_ensure() -> dict[str, Any]:
    return spaces_get()


@app.put("/spaces/{space_id}/devices/{device_id}")
def spaces_device_put(space_id: str, device_id: str, body: SpaceDeviceBody) -> dict[str, Any]:
    from .space_model import upsert_space_device

    patch = body.model_dump(exclude_none=True)
    patch["device_id"] = device_id
    try:
        return upsert_space_device(space_id, patch)
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc


@app.get("/energy/estimate")
def energy_estimate(
    space_id: str = Query(...),
    lights_on: str = Query(""),
    want_hours: float = Query(12.0, ge=0.0, le=24.0),
) -> dict[str, Any]:
    from .energy_model import estimate_space_day

    return estimate_space_day(space_id, lights_on=lights_on, want_hours=want_hours)


@app.get("/energy/suggestions")
def energy_suggestions(
    space_id: str = Query(...),
    lights_on: str = Query(""),
    want_hours: float = Query(12.0, ge=0.0, le=24.0),
) -> dict[str, Any]:
    from .energy_learning import planning_signal
    from .energy_model import suggest_slides

    items = suggest_slides(space_id, current_on=lights_on, want_hours=want_hours)
    enriched = []
    for s in items:
        sig = planning_signal(space_id, str(s.get("id") or ""), db_path=None)
        enriched.append({**s, "apply": False, "learning": sig})
    return {"space_id": space_id, "suggestions": enriched, "apply": False}


@app.get("/energy/tariff")
def energy_tariff_get() -> dict[str, Any]:
    from .energy_model import ensure_default_tariff, list_tariff

    ensure_default_tariff()
    return {"bands": list_tariff()}


@app.put("/energy/tariff")
def energy_tariff_put(body: TariffBandBody) -> dict[str, Any]:
    from .energy_model import upsert_tariff_band

    try:
        return upsert_tariff_band(body.model_dump(exclude_none=True))
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc


@app.get("/energy/learning")
def energy_learning_get() -> dict[str, Any]:
    from .energy_learning import get_learning_settings

    return get_learning_settings()


@app.patch("/energy/learning")
def energy_learning_patch(body: EnergyLearningPatch) -> dict[str, Any]:
    from .energy_learning import set_learning_settings

    return set_learning_settings(body.model_dump(exclude_none=True))


@app.post("/energy/shift/plan")
def energy_shift_plan(body: ShiftPlanBody) -> dict[str, Any]:
    from .schedule_shift import create_shift_plan

    try:
        return create_shift_plan(
            body.space_id,
            from_on=body.from_on,
            to_on=body.to_on,
            want_hours=body.want_hours,
            policy=body.policy,
            confirm=body.confirm,
        )
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc


@app.post("/energy/shift/{plan_id}/cancel")
def energy_shift_cancel(plan_id: int) -> dict[str, Any]:
    from .schedule_shift import cancel_shift_plan

    try:
        return cancel_shift_plan(plan_id)
    except KeyError as exc:
        raise HTTPException(404, str(exc)) from exc


@app.get("/energy/shift/pending-flips")
def energy_pending_flips() -> dict[str, Any]:
    from .schedule_shift import list_pending_flips

    return {"flips": list_pending_flips()}


@app.post("/energy/flip/request")
def energy_flip_request(body: FlipRequestBody) -> dict[str, Any]:
    from .schedule_shift import request_flip

    return request_flip(
        body.space_id,
        plant_id=body.plant_id,
        from_hours=body.from_hours,
        to_hours=body.to_hours,
        note=body.note,
    )


@app.post("/energy/flip/{req_id}/resolve")
def energy_flip_resolve(req_id: int, body: FlipResolveBody) -> dict[str, Any]:
    from .schedule_shift import resolve_flip

    try:
        return resolve_flip(req_id, approve=body.approve)
    except KeyError as exc:
        raise HTTPException(404, str(exc)) from exc


@app.get("/energy/conflicts")
def energy_conflicts(
    space_id: str = Query(...),
    plant_id: str | None = Query(None),
    plant_want_hours: float | None = Query(None),
    space_want_hours: float | None = Query(None),
) -> dict[str, Any]:
    from .photoperiod_conflict import space_conflict_banners
    from .schedule_shift import list_pending_flips
    from .space_occupants import occupant_plant_ids_for_space

    mates = occupant_plant_ids_for_space(space_id)
    mate_count = max(0, len(mates) - (1 if plant_id and plant_id in mates else 0))
    banners = space_conflict_banners(
        space_id,
        plant_id=plant_id,
        plant_want_hours=plant_want_hours,
        space_want_hours=space_want_hours,
        mate_count=mate_count if mate_count else len(mates),
    )
    return {
        "space_id": space_id,
        "banners": banners,
        "pending_flips": [f for f in list_pending_flips() if f.get("space_id") == space_id],
        "auto_apply": False,
    }


@app.get("/rooms")
def rooms_get() -> dict[str, Any]:
    from .room_model import ensure_kit_rooms

    return {"rooms": ensure_kit_rooms()}


@app.get("/journal/room/{room_id}")
def journal_room_get(
    room_id: str,
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
) -> dict[str, Any]:
    from .room_journal import count_room_journal, list_room_journal
    from .room_model import ensure_kit_rooms

    ensure_kit_rooms()
    return {
        "room_id": room_id,
        "entries": list_room_journal(room_id, limit=limit, offset=offset),
        "total": count_room_journal(room_id),
        "limit": limit,
        "offset": offset,
    }


@app.post("/journal/room/{room_id}")
def journal_room_post(room_id: str, body: JournalEntryBody) -> dict[str, Any]:
    from .room_journal import add_room_entry

    try:
        return add_room_entry(room_id, body.occurred_at, body.note, source="operator", tags=body.tags)
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc


@app.patch("/journal/room/{room_id}/{entry_id}")
def journal_room_patch(room_id: str, entry_id: int, body: JournalPatchBody) -> dict[str, Any]:
    from .room_journal import update_room_entry

    try:
        return update_room_entry(
            room_id, entry_id, note=body.note, tags=body.tags, occurred_at=body.occurred_at
        )
    except (ValueError, Exception) as exc:
        _journal_mutation_http(exc)
        raise  # pragma: no cover


@app.delete("/journal/room/{room_id}/{entry_id}")
def journal_room_delete(room_id: str, entry_id: int) -> dict[str, Any]:
    from .room_journal import delete_room_entry

    try:
        delete_room_entry(room_id, entry_id)
    except (ValueError, Exception) as exc:
        _journal_mutation_http(exc)
    return {"ok": True, "deleted_id": entry_id}


@app.get("/journal/core")
@app.get("/journal/dsc-core")
def journal_core_get(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
) -> dict[str, Any]:
    from .dsc_core_journal import count_core_journal, list_core_journal
    from .room_model import ensure_kit_rooms

    ensure_kit_rooms()
    return {
        "entries": list_core_journal(limit=limit, offset=offset),
        "total": count_core_journal(),
        "limit": limit,
        "offset": offset,
    }


@app.post("/journal/core")
@app.post("/journal/dsc-core")
def journal_core_post(body: JournalEntryBody) -> dict[str, Any]:
    from .dsc_core_journal import add_core_entry

    return add_core_entry(body.occurred_at, body.note, source="operator", tags=body.tags)


@app.patch("/journal/core/{entry_id}")
@app.patch("/journal/dsc-core/{entry_id}")
def journal_core_patch(entry_id: int, body: JournalPatchBody) -> dict[str, Any]:
    from .dsc_core_journal import update_core_entry

    try:
        return update_core_entry(entry_id, note=body.note, tags=body.tags, occurred_at=body.occurred_at)
    except (ValueError, Exception) as exc:
        _journal_mutation_http(exc)
        raise  # pragma: no cover


@app.delete("/journal/core/{entry_id}")
@app.delete("/journal/dsc-core/{entry_id}")
def journal_core_delete(entry_id: int) -> dict[str, Any]:
    from .dsc_core_journal import delete_core_entry

    try:
        delete_core_entry(entry_id)
    except (ValueError, Exception) as exc:
        _journal_mutation_http(exc)
    return {"ok": True, "deleted_id": entry_id}


@app.post("/journal/admin/backfill-snapshots")
def journal_admin_backfill_snapshots(
    scope: str = Query(..., min_length=3),
    scope_id: str | None = Query(None, alias="id"),
    limit: int = Query(100, ge=1, le=1000),
) -> dict[str, Any]:
    """Operator-only maintenance: backfill historical operator journal snapshots.

    For rows where snapshot_json is empty or missing sensor keys, sample
    fleet_history nearest to occurred_at (±30 min). Not exposed in operator SPA.

    Example: POST /journal/admin/backfill-snapshots?scope=space&id=4x8&limit=100
    """
    from .journal_snapshot import backfill_journal_snapshots

    try:
        return backfill_journal_snapshots(scope, scope_id, limit)
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc


@app.get("/")
def spa_index() -> FileResponse:
    index = STATIC_DIR / "index.html"
    if not index.exists():
        raise HTTPException(503, "SPA not built — run npm run build:spa")
    return _spa_index_response(index)


@app.get("/{full_path:path}")
def spa_fallback(full_path: str) -> FileResponse:
    if full_path.startswith("api") or full_path.startswith("v1"):
        raise HTTPException(404)
    file_path = STATIC_DIR / full_path
    if file_path.is_file():
        if full_path.endswith(".html"):
            return _spa_index_response(file_path)
        return FileResponse(file_path, headers={"Cache-Control": "public, max-age=31536000, immutable"})
    index = STATIC_DIR / "index.html"
    if index.exists():
        return _spa_index_response(index)
    raise HTTPException(404)


def main() -> None:
    import uvicorn

    uvicorn.run("dsc_brain.api:app", host="0.0.0.0", port=8787, reload=False)


if __name__ == "__main__":
    main()
