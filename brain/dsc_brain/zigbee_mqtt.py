"""Zigbee2MQTT canopy / extra plug ingest."""

from __future__ import annotations

import json
import logging
import os
import re
import threading
import time
from typing import Any, Callable

from .fleet_state import FleetState, get_fleet_state, update_fleet_state
from .settings import get_setting, list_inventory, set_setting

_logger = logging.getLogger(__name__)

try:
    import paho.mqtt.client as mqtt
except ImportError:  # pragma: no cover
    mqtt = None  # type: ignore[assignment]

_permit_timer: threading.Timer | None = None
_permit_lock = threading.Lock()

# Role catalog — consume=True means Brain routes climate state into fleet slots.
ZIGBEE_ROLE_CATALOG: list[dict[str, Any]] = [
    {"id": "unbound", "label": "Unbound", "consume": False, "kind": "none"},
    {"id": "canopy_4x8", "label": "Canopy 4×8", "consume": True, "kind": "climate"},
    {"id": "canopy_2x4", "label": "Canopy 2×4", "consume": True, "kind": "climate"},
    {"id": "intake", "label": "Intake", "consume": True, "kind": "climate"},
    {"id": "exhaust", "label": "Exhaust", "consume": True, "kind": "climate"},
    {"id": "room", "label": "Room / ambient", "consume": True, "kind": "climate"},
    {"id": "clone_dome", "label": "Clone dome", "consume": True, "kind": "climate"},
    {"id": "plug_pump", "label": "Pump plug", "consume": False, "kind": "plug"},
    {"id": "plug_dosing", "label": "Dosing plug", "consume": False, "kind": "plug"},
    {"id": "plug_backup_dehum", "label": "Backup dehumidifier", "consume": False, "kind": "plug"},
    {"id": "plug_fan_aux", "label": "Aux fan plug", "consume": False, "kind": "plug"},
    {"id": "meter_wall", "label": "Power meter", "consume": False, "kind": "meter"},
    {"id": "button_override", "label": "Override button", "consume": False, "kind": "button"},
    {"id": "co2_tent", "label": "CO₂", "consume": False, "kind": "gas"},
    {"id": "lux_canopy", "label": "Lux / illuminance", "consume": False, "kind": "light"},
    {"id": "leak_floor", "label": "Water leak (floor)", "consume": False, "kind": "safety"},
    {"id": "leak_floor_room", "label": "Water leak (floor · room)", "consume": False, "kind": "safety"},
    {"id": "leak_floor_4x8", "label": "Water leak (floor · 4×8)", "consume": False, "kind": "safety"},
    {"id": "leak_floor_2x4", "label": "Water leak (floor · 2×4)", "consume": False, "kind": "safety"},
    {"id": "leak_tank", "label": "Tank / reservoir leak", "consume": True, "kind": "safety"},
    {"id": "door_tent", "label": "Tent door", "consume": False, "kind": "safety"},
]

_BASE_ROLE_IDS = frozenset(str(r["id"]) for r in ZIGBEE_ROLE_CATALOG)
_CANOPY_ROLES = ("canopy_4x8", "canopy_2x4")
_VALID_ZONES = frozenset({"4x8", "2x4", "room", "shared"})

# Operator-defined roles (Phase 4). Roles are pure routing labels — a custom
# role only needs a `kind` to slot into climate / safety fleet handling; it wires
# no new Python behaviour. Stored as a JSON list of {id,label,kind,consume}.
_CUSTOM_ROLES_SETTING = "zigbee_custom_roles"
_CUSTOM_ROLE_KINDS = frozenset(
    {"climate", "safety", "plug", "meter", "gas", "light", "button", "other"}
)
_ROLE_ID_RE = re.compile(r"^[a-z][a-z0-9_]{1,47}$")


def load_custom_roles() -> list[dict[str, Any]]:
    """Operator-added roles from settings — validated shape, base ids filtered out."""
    raw = get_setting(_CUSTOM_ROLES_SETTING, "")
    if not raw:
        return []
    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        return []
    out: list[dict[str, Any]] = []
    if isinstance(parsed, list):
        for row in parsed:
            if not isinstance(row, dict):
                continue
            rid = str(row.get("id") or "").strip().lower()
            if not rid or rid in _BASE_ROLE_IDS:
                continue
            kind = str(row.get("kind") or "other").strip().lower()
            if kind not in _CUSTOM_ROLE_KINDS:
                kind = "other"
            out.append(
                {
                    "id": rid,
                    "label": str(row.get("label") or rid),
                    "kind": kind,
                    "consume": bool(row.get("consume", kind == "climate")),
                    "custom": True,
                }
            )
    return out


def save_custom_roles(roles: Any) -> list[dict[str, Any]]:
    """Validate + persist the operator role overlay. Returns the normalized list."""
    if not isinstance(roles, list):
        raise ValueError("roles must be a list")
    cleaned: list[dict[str, Any]] = []
    seen: set[str] = set()
    for row in roles:
        if not isinstance(row, dict):
            raise ValueError("each role must be an object")
        rid = str(row.get("id") or "").strip().lower()
        if not _ROLE_ID_RE.match(rid):
            raise ValueError(f"invalid role id {rid!r} — slug, lowercase, 2–48 chars")
        if rid in _BASE_ROLE_IDS:
            raise ValueError(f"'{rid}' is a built-in role")
        if rid in seen:
            raise ValueError(f"duplicate role id: {rid}")
        seen.add(rid)
        kind = str(row.get("kind") or "other").strip().lower()
        if kind not in _CUSTOM_ROLE_KINDS:
            raise ValueError(f"invalid kind {kind!r}")
        cleaned.append(
            {
                "id": rid,
                "label": (str(row.get("label") or rid).strip() or rid)[:60],
                "kind": kind,
                "consume": bool(row.get("consume", kind == "climate")),
            }
        )
    set_setting(_CUSTOM_ROLES_SETTING, json.dumps(cleaned))
    return cleaned


def _effective_role_catalog() -> list[dict[str, Any]]:
    return [*ZIGBEE_ROLE_CATALOG, *load_custom_roles()]


def _valid_roles() -> frozenset[str]:
    return frozenset(str(r["id"]) for r in _effective_role_catalog())


def get_zigbee_role_catalog() -> list[dict[str, Any]]:
    return list(_effective_role_catalog())


_CLASS_ROLE_KINDS: dict[str, frozenset[str]] = {
    "climate": frozenset({"climate"}),
    "liquid": frozenset({"safety"}),
    "plug": frozenset({"plug"}),
    "motion": frozenset(),
    "other": frozenset(),
}

_STATE_META_KEYS = frozenset(
    {"friendly_name", "updated_at", "role", "zone", "active", "wet", "linkquality", "last_seen"}
)


def _expose_properties_from_exposes(exposes: Any) -> set[str]:
    """Extract property names from a Z2M definition exposes list."""
    out: set[str] = set()
    if not isinstance(exposes, list):
        return out
    for item in exposes:
        if not isinstance(item, dict):
            continue
        prop = item.get("property")
        if prop:
            out.add(str(prop).lower())
        features = item.get("features")
        if isinstance(features, list):
            out.update(_expose_properties_from_exposes(features))
    return out


def infer_capability_class(
    exposes_props: set[str] | None = None,
    state_keys: set[str] | None = None,
) -> str:
    keys = {*(exposes_props or set()), *(state_keys or set())}
    keys = {str(k).lower() for k in keys}
    if keys & {"water_leak", "leak", "moisture"}:
        return "liquid"
    if keys & {"temperature", "humidity"}:
        return "climate"
    if keys & {"state"} and not (keys & {"temperature", "humidity"}):
        # weak plug hint — refine with device type if needed
        pass
    if "occupancy" in keys and not (keys & {"water_leak", "temperature"}):
        return "motion"
    return "other"


def filter_roles_for_class(capability_class: str, roles: list[dict[str, Any]]) -> list[dict[str, Any]]:
    allowed_kinds = _CLASS_ROLE_KINDS.get(str(capability_class).lower(), frozenset())
    out: list[dict[str, Any]] = []
    for role in roles:
        kind = str(role.get("kind") or "none")
        role_id = str(role.get("id") or "")
        if role_id == "unbound" or kind in allowed_kinds:
            out.append(role)
    return out


def filter_recipes_for_class(
    capability_class: str,
    recipes: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    cap = str(capability_class).lower()
    out: list[dict[str, Any]] = []
    for recipe in recipes:
        recipe_id = str(recipe.get("id") or "")
        if recipe_id == "none":
            out.append(recipe)
            continue
        device_classes = recipe.get("device_classes")
        if isinstance(device_classes, list) and cap in {str(c).lower() for c in device_classes}:
            out.append(recipe)
    return out


def _device_state_signal_keys(friendly_name: str) -> set[str]:
    state = _ingest._device_states.get(friendly_name) or {}
    if not isinstance(state, dict):
        return set()
    return {str(k).lower() for k in state if str(k).lower() not in _STATE_META_KEYS}


def _device_expose_props(device: dict[str, Any]) -> set[str]:
    cached = device.get("expose_props")
    if isinstance(cached, list):
        return {str(p).lower() for p in cached if p}
    definition = device.get("definition")
    if isinstance(definition, dict):
        return _expose_properties_from_exposes(definition.get("exposes"))
    return set()


def _resolve_device_capability_class(
    device: dict[str, Any],
    binding: dict[str, Any] | None,
) -> tuple[str, str | None]:
    override = None
    if binding and binding.get("capability_override"):
        override = str(binding["capability_override"]).lower()
        return override, override
    friendly_name = str(device.get("friendly_name") or "")
    expose_props = _device_expose_props(device)
    state_keys = _device_state_signal_keys(friendly_name) if friendly_name else set()
    inferred = infer_capability_class(expose_props, state_keys)
    return inferred, None


def _placement_map() -> dict[str, str]:
    """Legacy friendly_name → placement label (settings JSON + inventory extras)."""
    out: dict[str, str] = {}
    raw = get_setting("zigbee_placements", "")
    if raw:
        try:
            parsed = json.loads(raw)
            if isinstance(parsed, dict):
                for k, v in parsed.items():
                    if k and v:
                        out[str(k)] = str(v)
        except json.JSONDecodeError:
            pass
    for row in list_inventory():
        extra = row.get("extra") or {}
        if not isinstance(extra, dict):
            continue
        fname = extra.get("zigbee_friendly_name") or extra.get("friendly_name")
        placement = extra.get("placement")
        if fname and placement:
            out[str(fname)] = str(placement)
    return out


def _legacy_label_to_role(label: str) -> str:
    key = label.strip().lower().replace(" ", "_").replace("/", "_")
    if key in _valid_roles() and key != "unbound":
        return key
    if "canopy" in key and ("2x4" in key or "clone" in key):
        return "canopy_2x4"
    if "canopy" in key:
        return "canopy_4x8"
    if "intake" in key:
        return "intake"
    if "exhaust" in key:
        return "exhaust"
    if "clone" in key or "dome" in key:
        return "clone_dome"
    if "room" in key or "ambient" in key:
        return "room"
    return "unbound"


def _legacy_label_to_zone(label: str) -> str:
    key = label.strip().lower()
    if "2x4" in key or "clone" in key:
        return "2x4"
    if "room" in key:
        return "room"
    if "4x8" in key or "main" in key or "canopy" in key:
        return "4x8"
    return "shared"


def load_zigbee_bindings() -> dict[str, dict[str, Any]]:
    """ieee → binding dict."""
    out: dict[str, dict[str, Any]] = {}
    raw = get_setting("zigbee_device_bindings", "")
    if raw:
        valid_roles = _valid_roles()
        try:
            parsed = json.loads(raw)
            if isinstance(parsed, dict):
                for ieee, row in parsed.items():
                    if not ieee or not isinstance(row, dict):
                        continue
                    role = str(row.get("role") or "unbound")
                    if role not in valid_roles:
                        role = "unbound"
                    zone = str(row.get("zone") or "shared")
                    if zone not in _VALID_ZONES:
                        zone = "shared"
                    binding: dict[str, Any] = {
                        "role": role,
                        "zone": zone,
                        "alias": str(row.get("alias") or ""),
                        "enabled": bool(row.get("enabled", True)),
                        "friendly_name": str(row.get("friendly_name") or ""),
                    }
                    override = row.get("capability_override")
                    if override:
                        cap = str(override).lower()
                        if cap in _CLASS_ROLE_KINDS:
                            binding["capability_override"] = cap
                    out[str(ieee)] = binding
        except json.JSONDecodeError:
            pass
    return out


def save_zigbee_bindings(bindings: dict[str, Any]) -> dict[str, dict[str, Any]]:
    """Validate and persist ieee-keyed bindings. Returns normalized map.

    Immediately re-routes cached MQTT device states into by_role / canopy so
    Climate/Overview update on Save without waiting for the next payload.
    """
    cleaned: dict[str, dict[str, Any]] = {}
    if not isinstance(bindings, dict):
        raise ValueError("bindings must be an object keyed by ieee")
    valid_roles = _valid_roles()
    for ieee, row in bindings.items():
        if not ieee or not isinstance(row, dict):
            continue
        role = str(row.get("role") or "unbound")
        if role not in valid_roles:
            raise ValueError(f"invalid role: {role}")
        zone = str(row.get("zone") or "shared")
        if zone not in _VALID_ZONES:
            raise ValueError(f"invalid zone: {zone}")
        binding: dict[str, Any] = {
            "role": role,
            "zone": zone,
            "alias": str(row.get("alias") or ""),
            "enabled": bool(row.get("enabled", True)),
            "friendly_name": str(row.get("friendly_name") or ""),
        }
        override = row.get("capability_override")
        if override is not None and override != "":
            cap = str(override).lower()
            if cap not in _CLASS_ROLE_KINDS:
                raise ValueError(f"invalid capability_override: {override}")
            binding["capability_override"] = cap
        cleaned[str(ieee)] = binding
    set_setting("zigbee_device_bindings", json.dumps(cleaned))
    _reapply_bindings_to_fleet()
    return cleaned


def _fleet_role_kinds() -> frozenset[str]:
    """Roles that populate zigbee_by_role for Climate (climate + safety Wet/Dry)."""
    return frozenset(
        str(r["id"]) for r in _effective_role_catalog() if r.get("kind") in ("climate", "safety")
    )


def _reapply_bindings_to_fleet() -> None:
    """Rebuild zigbee_by_role + canopy from cached device states using current bindings.

    Includes safety leak roles (Wet/Dry). Seeds bound-role stubs from bindings when
    MQTT has not yet delivered a state, so Climate/Overview surfaces stay visible.
    """
    fleet_roles = _fleet_role_kinds()
    by_role: dict[str, dict[str, Any]] = {}
    by_placement: dict[str, dict[str, Any]] = {}
    for friendly_name, state_row in list(_ingest._device_states.items()):
        if not isinstance(state_row, dict):
            continue
        binding = _binding_for_friendly(str(friendly_name), _ingest._devices)
        role = str(binding.get("role") or "unbound") if binding else "unbound"
        zone = str(binding.get("zone") or "shared") if binding else "shared"
        enabled = bool(binding.get("enabled", True)) if binding else False
        updated = dict(state_row)
        updated["role"] = role
        updated["zone"] = zone
        updated["friendly_name"] = friendly_name
        _ingest._device_states[friendly_name] = updated
        if enabled and role != "unbound" and role in fleet_roles:
            if role in {str(r["id"]) for r in _effective_role_catalog() if r.get("kind") == "safety"}:
                from .zigbee_policies import normalize_binary_active

                wet = normalize_binary_active(updated)
                safety_row = dict(updated)
                if wet is not None:
                    safety_row["active"] = wet
                    safety_row["wet"] = wet
                by_role[role] = safety_row
                by_placement[role] = safety_row
            else:
                by_role[role] = dict(updated)
                by_placement[role] = dict(updated)
    # Binding stubs: role bound but no live MQTT row yet (or ieee/friendly mismatch).
    for ieee, binding in load_zigbee_bindings().items():
        if not isinstance(binding, dict):
            continue
        role = str(binding.get("role") or "unbound")
        if role == "unbound" or not bool(binding.get("enabled", True)):
            continue
        if role not in fleet_roles or role in by_role:
            continue
        stub = {
            "role": role,
            "zone": str(binding.get("zone") or "shared"),
            "friendly_name": str(binding.get("friendly_name") or ieee),
            "ieee": str(ieee),
            "bound_stub": True,
        }
        by_role[role] = stub
        by_placement[role] = stub
    _ingest._by_role = by_role
    _ingest._by_placement = by_placement
    _ingest._canopy = _recompute_canopy(by_role)
    fleet_state = get_fleet_state()
    fleet_state.canopy = dict(_ingest._canopy)
    fleet_state.system = dict(fleet_state.system)
    fleet_state.system["zigbee_device_states"] = dict(_ingest._device_states)
    fleet_state.system["zigbee_by_placement"] = dict(_ingest._by_placement)
    fleet_state.system["zigbee_by_role"] = dict(_ingest._by_role)
    fleet_state.system["zigbee_placements"] = _placement_map()
    fleet_state.system["zigbee_device_bindings"] = load_zigbee_bindings()
    # Seed policies so Climate Problem/Clear can resolve recipe_id without waiting for MQTT.
    # policy_state.problem still only appears after evaluate_device_policies (never inferred from wet).
    try:
        from .zigbee_policies import load_zigbee_policies

        fleet_state.system["zigbee_device_policies"] = load_zigbee_policies()
    except Exception as exc:  # noqa: BLE001
        _logger.debug("zigbee policy seed on reapply skipped: %s", exc)
    update_fleet_state(fleet_state)


def _binding_for_friendly(
    friendly_name: str, devices: list[dict[str, Any]] | None = None
) -> dict[str, Any] | None:
    """Resolve binding for a MQTT friendly_name (prefer ieee match)."""
    bindings = load_zigbee_bindings()
    device_list = devices if devices is not None else []
    ieee: str | None = None
    for d in device_list:
        if str(d.get("friendly_name") or "") == friendly_name:
            ieee = str(d.get("ieee_address") or "") or None
            break
    if ieee and ieee in bindings:
        return {"ieee": ieee, **bindings[ieee]}
    for ieee_key, row in bindings.items():
        if str(row.get("friendly_name") or "") == friendly_name:
            return {"ieee": ieee_key, **row}
    label = _placement_map().get(friendly_name)
    if label:
        role = _legacy_label_to_role(label)
        if role == "unbound":
            return None
        return {
            "ieee": ieee or "",
            "role": role,
            "zone": _legacy_label_to_zone(label),
            "alias": "",
            "enabled": True,
            "friendly_name": friendly_name,
            "legacy_placement": label,
        }
    return None


def _role_conflict_map(bindings: dict[str, dict[str, Any]]) -> dict[str, list[str]]:
    claimed: dict[str, list[str]] = {}
    for ieee, row in bindings.items():
        role = str(row.get("role") or "unbound")
        if role == "unbound" or not row.get("enabled", True):
            continue
        claimed.setdefault(role, []).append(ieee)
    return {role: ieees for role, ieees in claimed.items() if len(ieees) > 1}


def _recompute_canopy(by_role: dict[str, dict[str, Any]]) -> dict[str, Any]:
    """Only canopy roles fill fleet.canopy; prefer 4x8 over 2x4.

    Bound canopy without live temp/RH still sets role so Overview/Climate
    show Canopy ← role instead of unbound theater.
    """
    canopy: dict[str, Any] = {}
    for role in _CANOPY_ROLES:
        row = by_role.get(role)
        if not isinstance(row, dict):
            continue
        if row.get("temperature") is not None:
            canopy["temp_c"] = row.get("temperature")
        if row.get("humidity") is not None:
            canopy["rh_pct"] = row.get("humidity")
        canopy["role"] = role
        canopy["updated_at"] = row.get("updated_at")
        canopy["friendly_name"] = row.get("friendly_name")
        if row.get("bound_stub"):
            canopy["bound_stub"] = True
        break
    return canopy


def _clear_permit_join_flag() -> None:
    set_setting("zigbee_permit_join", "false")
    _ingest._permit_join_live = False
    _ingest._permit_join_end = None


def _schedule_permit_join_expiry(duration_s: int) -> None:
    global _permit_timer
    with _permit_lock:
        if _permit_timer is not None:
            _permit_timer.cancel()
        _permit_timer = threading.Timer(float(duration_s), _clear_permit_join_flag)
        _permit_timer.daemon = True
        _permit_timer.start()


def _permit_end_still_open(end: float | None, now: float | None = None) -> bool:
    """True when permit_join_end is in the future (seconds or ms epoch)."""
    if end is None:
        return False
    try:
        end_s = float(end)
    except (TypeError, ValueError):
        return False
    if end_s > 1e12:  # epoch ms
        end_s /= 1000.0
    return end_s > float(now if now is not None else time.time())


def _cancel_permit_join_expiry() -> None:
    global _permit_timer
    with _permit_lock:
        if _permit_timer is not None:
            _permit_timer.cancel()
            _permit_timer = None


class ZigbeeMqttIngest:
    def __init__(self) -> None:
        self._thread: threading.Thread | None = None
        self._client: Any = None
        self._running = False
        self._mqtt_connected = False
        self._canopy: dict[str, Any] = {}
        self._devices: list[dict[str, Any]] = []
        self._devices_updated_at: float | None = None
        self._device_states: dict[str, dict[str, Any]] = {}
        self._by_placement: dict[str, dict[str, Any]] = {}
        self._by_role: dict[str, dict[str, Any]] = {}
        self._bridge_state: str | None = None
        self._bridge_state_updated_at: float | None = None
        # Live z2m permit_join (from bridge/info or response) — SoT for JOIN OPEN chip.
        self._permit_join_live: bool | None = None
        self._permit_join_end: float | None = None

    def start(self) -> None:
        if mqtt is None:
            _logger.warning("paho-mqtt not installed")
            return
        if self._thread and self._thread.is_alive():
            return
        self._running = True
        self._thread = threading.Thread(target=self._run, daemon=True)
        self._thread.start()

    def stop(self, *, timeout: float = 2.0) -> None:
        self._running = False
        self._mqtt_connected = False
        client = self._client
        if client is not None:
            # paho-mqtt's Client shape has shifted across major versions (loop_stop has been
            # observed missing under some installed versions) — teardown must never raise.
            # disconnect() first so paho stops its own reconnect + winds the loop down
            # cleanly; loop_stop() after is the belt-and-braces stop.
            for name in ("disconnect", "loop_stop"):
                fn = getattr(client, name, None)
                if callable(fn):
                    try:
                        fn()
                    except Exception:  # noqa: BLE001 — teardown is best-effort
                        _logger.debug("zigbee mqtt %s() during stop raised", name, exc_info=True)
        # Join the ingest thread so stop() is synchronous — a lingering daemon thread
        # processing one last message was the source of pytest teardown flakiness.
        thread = self._thread
        if thread is not None and thread.is_alive() and thread is not threading.current_thread():
            thread.join(timeout=timeout)
        self._thread = None
        self._client = None

    def _run(self) -> None:
        host = os.environ.get("MQTT_HOST", "mosquitto")
        port = int(os.environ.get("MQTT_PORT", "1883"))
        client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
        client.on_message = self._on_message

        def on_connect(_c: Any, _u: Any, _f: Any, reason_code: Any, _p: Any = None) -> None:
            if reason_code == 0 or str(reason_code) == "Success":
                self._mqtt_connected = True
                client.subscribe("zigbee2mqtt/+")
                client.subscribe("zigbee2mqtt/bridge/devices")
                client.subscribe("zigbee2mqtt/bridge/state")
                client.subscribe("zigbee2mqtt/bridge/info")
                client.subscribe("zigbee2mqtt/bridge/response/permit_join")
                client.subscribe("zigbee2mqtt/bridge/event")
            else:
                self._mqtt_connected = False

        def on_disconnect(_c: Any, _u: Any, _f: Any, reason_code: Any, _p: Any = None) -> None:
            self._mqtt_connected = False

        client.on_connect = on_connect
        client.on_disconnect = on_disconnect
        try:
            client.connect(host, port, 60)
            self._client = client
            client.loop_start()
            while self._running:
                time.sleep(1.0)
        except Exception as exc:  # noqa: BLE001
            self._mqtt_connected = False
            _logger.warning("Zigbee MQTT connect failed: %s", exc)

    def _on_message(self, _client: Any, _userdata: Any, msg: Any) -> None:
        topic = msg.topic or ""
        try:
            payload = json.loads(msg.payload.decode("utf-8"))
        except (json.JSONDecodeError, UnicodeDecodeError):
            return
        if topic == "zigbee2mqtt/bridge/devices":
            self._update_devices(payload)
            return
        if topic == "zigbee2mqtt/bridge/state":
            self._update_bridge_state(payload)
            return
        if topic == "zigbee2mqtt/bridge/info":
            self._update_permit_join_from_bridge(payload)
            return
        if topic == "zigbee2mqtt/bridge/response/permit_join":
            data = payload.get("data") if isinstance(payload, dict) else None
            self._update_permit_join_from_bridge(data if isinstance(data, dict) else payload)
            return
        if topic == "zigbee2mqtt/bridge/event" and isinstance(payload, dict):
            self._handle_bridge_event(payload)
            return
        if not isinstance(payload, dict):
            return
        if not topic.startswith("zigbee2mqtt/"):
            return
        friendly_name = topic.split("/", 1)[1]
        if friendly_name.startswith("bridge"):
            return

        now = time.time()
        binding = _binding_for_friendly(friendly_name, self._devices)
        role = str(binding.get("role") or "unbound") if binding else "unbound"
        zone = str(binding.get("zone") or "shared") if binding else "shared"
        enabled = bool(binding.get("enabled", True)) if binding else False
        payload_work = dict(payload)
        if "temperature" in payload_work or "humidity" in payload_work:
            from .global_modifiers import apply_temp_rh_offsets

            temp_adj, rh_adj, _ = apply_temp_rh_offsets(
                payload_work.get("temperature"),
                payload_work.get("humidity"),
                "main"
                if zone == "4x8"
                else "clone"
                if zone == "2x4"
                else "room",
            )
            if temp_adj is not None:
                payload_work["temperature"] = temp_adj
            if rh_adj is not None:
                payload_work["humidity"] = rh_adj

        state_row = {
            "friendly_name": friendly_name,
            "updated_at": now,
            "role": role,
            "zone": zone,
            **payload_work,
        }
        self._device_states[friendly_name] = state_row

        if enabled and role != "unbound" and role in {
            str(r["id"]) for r in _effective_role_catalog() if r.get("kind") == "climate"
        }:
            self._by_role[role] = dict(state_row)
            # Keep placement alias for older SPA/tests
            self._by_placement[role] = dict(state_row)
        elif enabled and role != "unbound" and role in {
            str(r["id"]) for r in _effective_role_catalog() if r.get("kind") == "safety"
        }:
            from .zigbee_policies import normalize_binary_active

            wet = normalize_binary_active(payload_work)
            safety_row = dict(state_row)
            if wet is not None:
                safety_row["active"] = wet
                safety_row["wet"] = wet
            self._by_role[role] = safety_row
            self._by_placement[role] = safety_row

        # Canopy only from canopy roles — never first-sensor-wins
        self._canopy = _recompute_canopy(self._by_role)
        if self._canopy:
            self._canopy["last_topic"] = topic

        fleet_state = get_fleet_state()
        fleet_state.canopy = dict(self._canopy)
        fleet_state.system = dict(fleet_state.system)
        fleet_state.system["zigbee_device_states"] = dict(self._device_states)
        fleet_state.system["zigbee_by_placement"] = dict(self._by_placement)
        fleet_state.system["zigbee_by_role"] = dict(self._by_role)
        fleet_state.system["zigbee_placements"] = _placement_map()
        fleet_state.system["zigbee_device_bindings"] = load_zigbee_bindings()
        update_fleet_state(fleet_state)

        # Universal device→task path (any ieee with a recipe)
        ieee: str | None = None
        if isinstance(binding, dict):
            ieee = str(binding.get("ieee") or binding.get("ieee_address") or "") or None
        if not ieee:
            for d in self._devices:
                if str(d.get("friendly_name") or "") == friendly_name:
                    ieee = str(d.get("ieee_address") or "") or None
                    break
        try:
            from .zigbee_policies import evaluate_device_policies

            evaluate_device_policies(ieee=ieee, friendly_name=friendly_name, payload=payload_work)
        except Exception as exc:  # noqa: BLE001
            _logger.debug("zigbee policy eval skipped: %s", exc)

    def _update_devices(self, payload: Any) -> None:
        if not isinstance(payload, list):
            return
        devices: list[dict[str, Any]] = []
        for item in payload:
            if not isinstance(item, dict):
                continue
            definition = item.get("definition") if isinstance(item.get("definition"), dict) else {}
            expose_props = sorted(_expose_properties_from_exposes(definition.get("exposes")))
            devices.append(
                {
                    "ieee_address": item.get("ieee_address") or item.get("ieeeAddress"),
                    "friendly_name": item.get("friendly_name") or item.get("friendlyName"),
                    "type": item.get("type"),
                    "model": definition.get("model") or item.get("model"),
                    "vendor": definition.get("vendor") or item.get("vendor"),
                    "supported": item.get("supported"),
                    "disabled": item.get("disabled"),
                    "definition": definition or None,
                    "expose_props": expose_props or None,
                }
            )
        self._devices = devices
        self._devices_updated_at = time.time()
        state = get_fleet_state()
        state.system = dict(state.system)
        state.system["zigbee_devices"] = devices
        state.system["zigbee_devices_updated_at"] = self._devices_updated_at
        update_fleet_state(state)
        # Devices list arrived — re-route bindings into by_role / canopy (stubs ok).
        try:
            _reapply_bindings_to_fleet()
        except Exception as exc:  # noqa: BLE001
            _logger.debug("zigbee reapply after devices update skipped: %s", exc)

    def _update_bridge_state(self, payload: Any) -> None:
        state_val: str | None = None
        if isinstance(payload, dict):
            raw = payload.get("state")
            if raw is not None:
                state_val = str(raw).lower()
        elif isinstance(payload, str):
            state_val = payload.strip().lower()
        if state_val not in ("online", "offline"):
            return
        self._bridge_state = state_val
        self._bridge_state_updated_at = time.time()
        fleet = get_fleet_state()
        fleet.system = dict(fleet.system)
        fleet.system["zigbee_bridge_state"] = state_val
        fleet.system["zigbee_bridge_state_updated_at"] = self._bridge_state_updated_at
        update_fleet_state(fleet)

    def _update_permit_join_from_bridge(self, payload: Any) -> None:
        """Track live z2m permit_join from bridge/info or response/permit_join."""
        if not isinstance(payload, dict):
            return
        if "permit_join" not in payload and "time" not in payload:
            return
        if "time" in payload and "permit_join" not in payload:
            try:
                seconds = int(payload.get("time") or 0)
            except (TypeError, ValueError):
                return
            self._permit_join_live = seconds > 0
            if seconds > 0:
                self._permit_join_end = time.time() + float(seconds)
            else:
                self._permit_join_end = None
        elif "permit_join" in payload:
            live = bool(payload.get("permit_join"))
            # Ignore brief bridge/info false while our end window is still open
            # (renewal race / multi-publisher flaps).
            if (not live) and _permit_end_still_open(self._permit_join_end):
                live = True
            self._permit_join_live = live
            if not live:
                self._permit_join_end = None
        end = payload.get("permit_join_end")
        if end is not None:
            try:
                self._permit_join_end = float(end)
            except (TypeError, ValueError):
                pass
        set_setting("zigbee_permit_join", "true" if self._permit_join_live else "false")

    def _handle_bridge_event(self, payload: dict[str, Any]) -> None:
        """Optimistic end-device row on join so Settings Unbound appears before full interview."""
        ev = str(payload.get("type") or "")
        data = payload.get("data") if isinstance(payload.get("data"), dict) else {}
        ieee = str(data.get("ieee_address") or "").strip()
        fn = str(data.get("friendly_name") or ieee).strip()
        _logger.info("zigbee bridge event %s ieee=%s fn=%s", ev, ieee, fn)
        if not ieee:
            return
        if ev == "device_leave":
            self._devices = [d for d in self._devices if str(d.get("ieee_address")) != ieee]
            self._devices_updated_at = time.time()
            state = get_fleet_state()
            state.system = dict(state.system)
            state.system["zigbee_devices"] = list(self._devices)
            state.system["zigbee_devices_updated_at"] = self._devices_updated_at
            update_fleet_state(state)
            return
        if ev not in ("device_joined", "device_announce", "device_interview"):
            return
        existing = next((d for d in self._devices if str(d.get("ieee_address")) == ieee), None)
        model = None
        vendor = None
        supported = None
        definition: dict[str, Any] = {}
        expose_props: list[str] | None = None
        if ev == "device_interview" and data.get("status") == "successful":
            definition = data.get("definition") if isinstance(data.get("definition"), dict) else {}
            model = definition.get("model")
            vendor = definition.get("vendor")
            supported = data.get("supported")
            props = sorted(_expose_properties_from_exposes(definition.get("exposes")))
            expose_props = props or None
        if existing is None:
            row: dict[str, Any] = {
                "ieee_address": ieee,
                "friendly_name": fn or ieee,
                "type": "EndDevice",
                "model": model,
                "vendor": vendor,
                "supported": supported,
                "disabled": False,
            }
            if definition:
                row["definition"] = definition
            if expose_props:
                row["expose_props"] = expose_props
            self._devices = list(self._devices) + [row]
        else:
            if fn:
                existing["friendly_name"] = fn
            if model is not None:
                existing["model"] = model
            if vendor is not None:
                existing["vendor"] = vendor
            if supported is not None:
                existing["supported"] = supported
            if definition:
                existing["definition"] = definition
            if expose_props:
                existing["expose_props"] = expose_props
        self._devices_updated_at = time.time()
        state = get_fleet_state()
        state.system = dict(state.system)
        state.system["zigbee_devices"] = list(self._devices)
        state.system["zigbee_devices_updated_at"] = self._devices_updated_at
        update_fleet_state(state)


_ingest = ZigbeeMqttIngest()


def start_zigbee_ingest() -> None:
    _ingest.start()


def stop_zigbee_ingest() -> None:
    _cancel_permit_join_expiry()
    _ingest.stop()


def get_zigbee_devices() -> list[dict[str, Any]]:
    bindings = load_zigbee_bindings()
    conflicts = _role_conflict_map(bindings)
    out: list[dict[str, Any]] = []
    for d in _ingest._devices:
        row = dict(d)
        ieee = str(row.get("ieee_address") or "")
        binding = bindings.get(ieee)
        if binding is None and row.get("friendly_name"):
            binding = _binding_for_friendly(str(row.get("friendly_name")), _ingest._devices)
            if binding and binding.get("ieee"):
                # strip helper keys for API
                binding = {
                    k: v
                    for k, v in binding.items()
                    if k in ("role", "zone", "alias", "enabled", "friendly_name", "capability_override")
                }
        role = str((binding or {}).get("role") or "unbound")
        status = "unbound"
        if binding and role != "unbound" and binding.get("enabled", True):
            status = "conflict" if role in conflicts else "bound"
        capability_class, capability_override = _resolve_device_capability_class(row, binding)
        row["binding"] = binding
        row["status"] = status
        row["capability_class"] = capability_class
        if capability_override:
            row["capability_override"] = capability_override
        # Per-device health already lives in _device_states (raw Z2M state payload merged
        # in on every message) but was never surfaced — only aggregate bridge health was.
        live_state = _ingest._device_states.get(str(row.get("friendly_name") or ""))
        if live_state:
            row["battery"] = live_state.get("battery")
            row["linkquality"] = live_state.get("linkquality")
            row["last_seen"] = live_state.get("last_seen") or live_state.get("updated_at")
        out.append(row)
    return out


def get_zigbee_device_states() -> dict[str, dict[str, Any]]:
    return dict(_ingest._device_states)


def get_zigbee_by_placement() -> dict[str, dict[str, Any]]:
    return dict(_ingest._by_placement)


def get_zigbee_by_role() -> dict[str, dict[str, Any]]:
    return dict(_ingest._by_role)


def apply_zigbee_cache_to_state(state: FleetState) -> None:
    """Stamp Zigbee ingest cache onto a fleet snapshot.

    ESPHome polls copy fleet at start and write back after multi-second awaits;
    without this, those writes clobber canopy / zigbee_* system keys mid-flight.
    Also preserve Zigbee *policy* keys (banners / policy_state) that may have been
    written by MQTT evaluate while the ESPHome poll was in flight.

    When bindings exist but by_role is empty (restart / no MQTT yet), seed stubs
    so Climate Wet/Dry and canopy role chips are not silently omitted.
    """
    live_sys = dict(get_fleet_state().system or {})
    bindings = load_zigbee_bindings()
    if bindings and not _ingest._by_role:
        try:
            _reapply_bindings_to_fleet()
        except Exception as exc:  # noqa: BLE001
            _logger.debug("zigbee stub reapply skipped: %s", exc)
    state.canopy = dict(_ingest._canopy)
    state.system = dict(state.system)
    state.system["zigbee_device_states"] = dict(_ingest._device_states)
    state.system["zigbee_by_placement"] = dict(_ingest._by_placement)
    state.system["zigbee_by_role"] = dict(_ingest._by_role)
    state.system["zigbee_placements"] = _placement_map()
    state.system["zigbee_device_bindings"] = bindings
    if _ingest._devices:
        state.system["zigbee_devices"] = list(_ingest._devices)
    if _ingest._devices_updated_at is not None:
        state.system["zigbee_devices_updated_at"] = _ingest._devices_updated_at
    if _ingest._bridge_state is not None:
        state.system["zigbee_bridge_state"] = _ingest._bridge_state
    if _ingest._bridge_state_updated_at is not None:
        state.system["zigbee_bridge_state_updated_at"] = _ingest._bridge_state_updated_at
    for key in ("critical_banners", "zigbee_policy_state", "zigbee_device_policies"):
        if key in live_sys:
            state.system[key] = live_sys[key]
    # Always prefer persisted policies so SPA recipe_id is available before first MQTT evaluate.
    try:
        from .zigbee_policies import load_zigbee_policies

        state.system["zigbee_device_policies"] = load_zigbee_policies()
    except Exception as exc:  # noqa: BLE001
        _logger.debug("zigbee policy seed on apply_cache skipped: %s", exc)

def get_zigbee_health() -> dict[str, Any]:
    if _permit_end_still_open(_ingest._permit_join_end):
        permit_join = True
    elif _ingest._permit_join_live is not None:
        permit_join = bool(_ingest._permit_join_live)
    else:
        permit_join = get_setting("zigbee_permit_join", "false").lower() == "true"
    end_devices = [d for d in _ingest._devices if d.get("type") != "Coordinator"]
    bridge_state = _ingest._bridge_state
    radio_up = bridge_state == "online"
    if bridge_state is None and not _ingest._mqtt_connected:
        radio_note = "MQTT offline — brain cannot reach zigbee2mqtt"
    elif bridge_state == "offline":
        radio_note = "Coordinator offline — check USB stick and dsc-hub-z2m logs"
    elif bridge_state is None:
        radio_note = "Coordinator state unknown — z2m has not published bridge/state yet"
    elif radio_up:
        radio_note = "Coordinator online"
    else:
        radio_note = f"Coordinator state: {bridge_state}"
    return {
        "mqtt_connected": _ingest._mqtt_connected,
        "bridge_state": bridge_state,
        "bridge_state_updated_at": _ingest._bridge_state_updated_at,
        "radio_up": radio_up,
        "radio_note": radio_note,
        "device_count": len(_ingest._devices),
        "end_device_count": len(end_devices),
        "devices_updated_at": _ingest._devices_updated_at,
        "canopy_updated_at": _ingest._canopy.get("updated_at"),
        "permit_join": permit_join,
        "permit_join_end": _ingest._permit_join_end,
    }


def set_permit_join(
    enabled: bool,
    duration_s: int = 120,
    callback: Callable[[bool], None] | None = None,
) -> None:
    """Publish zigbee2mqtt bridge permit_join (best-effort). z2m 2.x expects {"time": N}."""
    if enabled:
        seconds = max(1, min(int(duration_s), 254))
        _schedule_permit_join_expiry(seconds)
        _ingest._permit_join_live = True
        _ingest._permit_join_end = time.time() + float(seconds)
        set_setting("zigbee_permit_join", "true")
    else:
        seconds = 0
        _cancel_permit_join_expiry()
        _ingest._permit_join_live = False
        _ingest._permit_join_end = None
        set_setting("zigbee_permit_join", "false")
    if mqtt is None or _ingest._client is None:
        return
    payload = json.dumps({"time": seconds})
    _ingest._client.publish("zigbee2mqtt/bridge/request/permit_join", payload)
    if callback:
        callback(enabled)


def actuatable_zigbee_devices() -> list[dict[str, Any]]:
    """Bound devices whose role kind is actuatable (plug) — the pickable targets
    for a `zigbee_switch` automation action."""
    from .zigbee_catalog import ACTUATABLE_ROLE_KINDS

    role_kind = {str(r["id"]): str(r.get("kind") or "") for r in _effective_role_catalog()}
    bindings = load_zigbee_bindings()
    out: list[dict[str, Any]] = []
    for ieee, b in bindings.items():
        role = str(b.get("role") or "unbound")
        if role_kind.get(role) not in ACTUATABLE_ROLE_KINDS:
            continue
        fn = str(b.get("friendly_name") or "")
        out.append(
            {
                "ieee": ieee,
                "friendly_name": fn,
                "alias": str(b.get("alias") or ""),
                "role": role,
            }
        )
    return out


def set_zigbee_state(friendly_name: str, on: bool) -> dict[str, Any]:
    """Publish an ON/OFF set to a Zigbee switch/plug. Best-effort — returns a
    status dict, never raises."""
    fn = str(friendly_name or "").strip()
    if not fn:
        return {"ok": False, "error": "no friendly_name"}
    if mqtt is None or _ingest._client is None:
        return {"ok": False, "error": "mqtt not connected", "friendly_name": fn}
    try:
        _ingest._client.publish(
            f"zigbee2mqtt/{fn}/set", json.dumps({"state": "ON" if on else "OFF"})
        )
        return {"ok": True, "friendly_name": fn, "state": "ON" if on else "OFF"}
    except Exception as exc:  # noqa: BLE001
        return {"ok": False, "error": str(exc), "friendly_name": fn}
