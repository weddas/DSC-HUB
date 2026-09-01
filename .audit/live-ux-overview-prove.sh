#!/bin/bash
# Live UX Overview Pass 3 — remote SPA hotpatch + HTTP health/rooms/journals/fleet (runs on Pi)
set -euo pipefail

PASS="${DSC_SUDO_PASS:-Digital}"
EVID="/tmp/live-ux-overview-prove-evidence.json"
BASE="http://127.0.0.1:8787"

mkdir -p /tmp/live-ux-overview-spa
tar -xzf /tmp/live-ux-overview-spa.tgz -C /tmp/live-ux-overview-spa

LOCAL_JS=$(grep -oE 'assets/index-[^"]+\.js' /tmp/live-ux-overview-spa/index.html | head -1)
echo "local_bundle=$LOCAL_JS"

echo "$PASS" | sudo -S docker cp /tmp/live-ux-overview-spa/. dsc-hub-brain:/app/static/
# SPA static only — no brain restart required for index/assets swap
sleep 2

LIVE_JS=$(curl -sf "$BASE/" | grep -oE 'assets/index-[^"]+\.js' | head -1 || true)
echo "live_bundle=$LIVE_JS"

python3 - <<'PY'
import hashlib, json, time, urllib.error, urllib.request

BASE = "http://127.0.0.1:8787"
out = {"ts": time.time(), "gates": {}, "errors": [], "restore": {}, "snapshot": {}}

def req(method, path, body=None, query=""):
    url = BASE + path + (("?" + query) if query else "")
    data = None
    headers = {}
    if body is not None:
        data = json.dumps(body).encode()
        headers["Content-Type"] = "application/json"
    r = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(r, timeout=30) as resp:
            raw = resp.read().decode() or "{}"
            try:
                return resp.status, json.loads(raw)
            except Exception:
                return resp.status, {"raw": raw[:500]}
    except urllib.error.HTTPError as e:
        raw = e.read().decode() if e.fp else ""
        try:
            payload = json.loads(raw) if raw else {}
        except Exception:
            payload = {"raw": raw}
        return e.code, payload
    except Exception as e:
        return 0, {"error": str(e)}

def ok(name, cond, detail=None):
    out["gates"][name] = {"ok": bool(cond), "detail": detail}

# G0: index hash match
local_html = open("/tmp/live-ux-overview-spa/index.html", "rb").read()
local_sha = hashlib.sha256(local_html).hexdigest()
try:
    with urllib.request.urlopen(BASE + "/", timeout=15) as resp:
        live_html = resp.read()
except Exception as e:
    live_html = b""
    out["errors"].append(f"index_fetch:{e}")
live_sha = hashlib.sha256(live_html).hexdigest() if live_html else ""
local_js = ""
live_js = ""
try:
    import re
    m = re.search(rb'assets/index-[^"]+\.js', local_html)
    local_js = m.group(0).decode() if m else ""
    m = re.search(rb'assets/index-[^"]+\.js', live_html)
    live_js = m.group(0).decode() if m else ""
except Exception:
    pass
ok("G0_index_bundle", local_js and local_js == live_js, {
    "local": local_js, "live": live_js,
    "local_sha256": local_sha, "live_sha256": live_sha,
})

st, health = req("GET", "/health")
ok("HTTP_health", st == 200 and isinstance(health, dict), {
    "status": st,
    "keys": list(health.keys())[:12] if isinstance(health, dict) else type(health).__name__,
})

st, rooms = req("GET", "/rooms")
rooms_list = rooms if isinstance(rooms, list) else (rooms.get("rooms") if isinstance(rooms, dict) else None)
room_ids = []
if isinstance(rooms_list, list):
    for r in rooms_list:
        if isinstance(r, dict):
            room_ids.append(r.get("id") or r.get("room_id") or r.get("name"))
        elif isinstance(r, str):
            room_ids.append(r)
elif isinstance(rooms, dict):
    room_ids = list(rooms.keys())
has_grow = any(str(x) == "grow_room" for x in room_ids if x is not None)
ok("HTTP_rooms_grow_room", st == 200 and has_grow, {
    "status": st, "room_ids": room_ids[:20], "raw_type": type(rooms).__name__,
})

st, jr = req("GET", "/journal/room/grow_room")
jr_ok = st == 200 and isinstance(jr, (dict, list))
ok("HTTP_journal_room_grow_room", jr_ok, {
    "status": st,
    "type": type(jr).__name__,
    "keys": list(jr.keys())[:10] if isinstance(jr, dict) else None,
    "len": len(jr) if isinstance(jr, list) else (len(jr.get("entries") or jr.get("items") or []) if isinstance(jr, dict) else None),
})

st, jc = req("GET", "/journal/core")
jc_ok = st == 200 and isinstance(jc, (dict, list))
ok("HTTP_journal_core", jc_ok, {
    "status": st,
    "type": type(jc).__name__,
    "keys": list(jc.keys())[:10] if isinstance(jc, dict) else None,
    "len": len(jc) if isinstance(jc, list) else (len(jc.get("entries") or jc.get("items") or []) if isinstance(jc, dict) else None),
})

st, fleet = req("GET", "/fleet")
ok("HTTP_fleet", st == 200 and isinstance(fleet, dict), {
    "keys": list(fleet.keys())[:12] if isinstance(fleet, dict) else type(fleet).__name__,
})

st, computed = req("GET", "/fleet/computed")
ok("HTTP_fleet_computed", st == 200 and isinstance(computed, dict), {
    "keys": list(computed.keys())[:12] if isinstance(computed, dict) else type(computed).__name__,
})

extras = (computed.get("hass_extras") or {}) if isinstance(computed, dict) else {}

def ent_row(eid):
    row = extras.get(eid) or {}
    return row if isinstance(row, dict) else {}

def ent_state(eid):
    return ent_row(eid).get("state")

def ent_attrs(eid):
    row = ent_row(eid)
    attrs = row.get("attributes") or row.get("attrs") or {}
    if not isinstance(attrs, dict):
        attrs = {}
    if not attrs:
        attrs = {k: v for k, v in row.items() if k not in ("state", "entity_id", "last_changed", "last_updated")}
    return attrs

# KIT HONEST / reduced_kit
rk_eid = "binary_sensor.dsc_reduced_kit"
rk_state = ent_state(rk_eid)
rk_attrs = ent_attrs(rk_eid)
planned = str(rk_attrs.get("planned_oos") or "")
offline = str(rk_attrs.get("offline") or "")
planned_u = planned.upper()
offline_u = offline.upper()
pot34_planned = "POT3" in planned_u and "POT4" in planned_u
pot34_not_offline = "POT3" not in offline_u and "POT4" not in offline_u
ok("HTTP_kit_honest_reduced_kit", rk_state is not None and pot34_planned and pot34_not_offline, {
    "state": rk_state, "planned_oos": planned, "offline": offline,
})

# Hub online from fleet
hub = (fleet.get("hub") or {}) if isinstance(fleet, dict) else {}
hub_online = hub.get("online") if isinstance(hub, dict) else None
ok("HTTP_hub_online", hub_online is True, {"hub": hub if isinstance(hub, dict) else hub})

# Canopy
canopy = (fleet.get("canopy") or {}) if isinstance(fleet, dict) else {}
role = canopy.get("role") if isinstance(canopy, dict) else None
ok("HTTP_canopy_fields", isinstance(canopy, dict), {
    "role": role,
    "canopy": {k: canopy.get(k) for k in ("role", "friendly_name", "temp_c", "rh_pct", "ieee") if isinstance(canopy, dict)},
})

# Critical banners (live policy) — present as list (may be empty)
system = (fleet.get("system") or {}) if isinstance(fleet, dict) else {}
banners = system.get("critical_banners") if isinstance(system, dict) else None
if banners is None and isinstance(computed, dict):
    banners = (computed.get("system") or {}).get("critical_banners") if isinstance(computed.get("system"), dict) else computed.get("critical_banners")
ok("HTTP_critical_banners", isinstance(banners, list), {
    "count": len(banners) if isinstance(banners, list) else None,
    "sample": (banners[:3] if isinstance(banners, list) else banners),
})

# Photoperiod SoT snapshot for cross-desk (both tents)
photo = {
    "lights_on_4x8": ent_state("time.dsc_hub_tent_lights_on"),
    "lights_off_4x8": ent_state("time.dsc_hub_tent_lights_off"),
    "lights_on_2x4": ent_state("time.dsc_hub_clone_lights_on"),
    "lights_off_2x4": ent_state("time.dsc_hub_clone_lights_off"),
    "clone_photoperiod": ent_state("select.dsc_hub_clone_photoperiod"),
    "sf1000": ent_state("switch.dsc_hub_sf1000"),
    "sf1000_clone": ent_state("switch.dsc_hub_sf1000_clone"),
}
ok("HTTP_photoperiod_sot_present", any(v is not None for v in photo.values()), photo)

out["snapshot"] = {
    "health": health if isinstance(health, dict) else {"raw": str(health)[:200]},
    "rooms": room_ids,
    "hub_online": hub_online,
    "reduced_kit": {"state": rk_state, "planned_oos": planned, "offline": offline},
    "canopy": canopy if isinstance(canopy, dict) else {},
    "critical_banners": banners if isinstance(banners, list) else banners,
    "photoperiod": photo,
    "journal_room": out["gates"].get("HTTP_journal_room_grow_room", {}).get("detail"),
    "journal_core": out["gates"].get("HTTP_journal_core", {}).get("detail"),
}

# G9 restore: Overview prove is read-only — no levers mutated
out["restore"] = {
    "note": "HTTP-only Overview prove; no schedule/climate/journal mutations.",
    "levers_stressed": False,
}

path = "/tmp/live-ux-overview-prove-evidence.json"
with open(path, "w", encoding="utf-8") as f:
    json.dump(out, f, indent=2)
fails = [k for k, v in out["gates"].items() if not v.get("ok")]
print(json.dumps({
    "evidence": path,
    "fail_count": len(fails),
    "fails": fails,
    "local_js": local_js,
    "live_js": live_js,
    "hub_online": hub_online,
    "reduced_kit": rk_state,
    "canopy_role": role,
    "banners": len(banners) if isinstance(banners, list) else None,
    "photoperiod": photo,
}, indent=2))
if fails:
    raise SystemExit(2)
PY

echo "=== SPA index head ==="
curl -sf "$BASE/" | head -c 400
echo
echo "DONE"
