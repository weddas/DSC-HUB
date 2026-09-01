#!/bin/bash
# Live UX Climate Pass 2 — remote SPA hotpatch + HTTP reduced_kit/canopy/CFM (runs on Pi)
set -euo pipefail

PASS="${DSC_SUDO_PASS:-Digital}"
EVID="/tmp/live-ux-climate-prove-evidence.json"
BASE="http://127.0.0.1:8787"

mkdir -p /tmp/live-ux-climate-spa
tar -xzf /tmp/live-ux-climate-spa.tgz -C /tmp/live-ux-climate-spa

LOCAL_JS=$(grep -oE 'assets/index-[^"]+\.js' /tmp/live-ux-climate-spa/index.html | head -1)
echo "local_bundle=$LOCAL_JS"

echo "$PASS" | sudo -S docker cp /tmp/live-ux-climate-spa/. dsc-hub-brain:/app/static/
# SPA static only — no brain restart required for index/assets swap
sleep 2

LIVE_JS=$(curl -sf "$BASE/" | grep -oE 'assets/index-[^"]+\.js' | head -1 || true)
echo "live_bundle=$LIVE_JS"

python3 - <<'PY'
import hashlib, json, time, urllib.error, urllib.request

BASE = "http://127.0.0.1:8787"
out = {"ts": time.time(), "gates": {}, "errors": [], "restore": {}}

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
local_html = open("/tmp/live-ux-climate-spa/index.html", "rb").read()
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
ok("G0_health", st == 200, health)

st, fleet = req("GET", "/fleet")
ok("G0_fleet", st == 200 and isinstance(fleet, dict), {
    "keys": list(fleet.keys())[:12] if isinstance(fleet, dict) else type(fleet).__name__,
})

st, computed = req("GET", "/fleet/computed")
ok("G0_fleet_computed", st == 200 and isinstance(computed, dict), {
    "keys": list(computed.keys())[:8] if isinstance(computed, dict) else type(computed).__name__,
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
    return attrs if isinstance(attrs, dict) else {}

# --- HTTP: reduced_kit ---
rk_eid = "binary_sensor.dsc_reduced_kit"
rk_state = ent_state(rk_eid)
rk_attrs = ent_attrs(rk_eid)
# Some buses flatten attrs onto the row; merge common keys
if not rk_attrs:
    rk_attrs = {k: v for k, v in ent_row(rk_eid).items() if k not in ("state", "entity_id", "last_changed", "last_updated")}
planned = str(rk_attrs.get("planned_oos") or "")
offline = str(rk_attrs.get("offline") or "")
# pot3/4 must be planned_oos only, never offline lead
pot34_planned = ("POT3" in planned.upper() or "POT3" in planned) and ("POT4" in planned.upper() or "POT4" in planned)
# tolerate case variants
planned_u = planned.upper()
offline_u = offline.upper()
pot34_planned = "POT3" in planned_u and "POT4" in planned_u
pot34_not_offline_lead = "POT3" not in offline_u and "POT4" not in offline_u
ok("HTTP_reduced_kit_present", rk_state is not None, {
    "state": rk_state, "attrs_keys": sorted(rk_attrs.keys())[:20],
    "planned_oos": planned, "offline": offline,
})
ok("HTTP_reduced_kit_pot34_planned", pot34_planned and pot34_not_offline_lead, {
    "planned_oos": planned, "offline": offline, "state": rk_state,
})

# --- HTTP: canopy via /fleet ---
canopy = (fleet.get("canopy") or {}) if isinstance(fleet, dict) else {}
canopy_ok = isinstance(canopy, dict)
role = canopy.get("role") if canopy_ok else None
# Bound: expect role + temp/rh; unbound: empty / no fake fills — either honest
if role:
    temp_ok = canopy.get("temp_c") is not None or canopy.get("temperature") is not None
    rh_ok = canopy.get("rh_pct") is not None or canopy.get("humidity") is not None
    canopy_honest = bool(temp_ok or rh_ok or canopy.get("friendly_name"))
else:
    # Unbound: no role — T/RH may be absent; empty dict or role-less is honest
    canopy_honest = True
ok("HTTP_canopy_fields", canopy_ok and canopy_honest, {
    "canopy": {k: canopy.get(k) for k in ("role", "friendly_name", "temp_c", "rh_pct", "ieee", "updated_at") if isinstance(canopy, dict)},
})

# --- HTTP: CFM sensors present ---
cfm_ids = [
    "sensor.dsc_cfm_exhaust_out_allocated",
    "sensor.dsc_cfm_exhaust_recirc_allocated",
    "sensor.dsc_cfm_intake_main_allocated",
    "sensor.dsc_cfm_intake_2x4_allocated",
    "sensor.dsc_cfm_cascade_2x4_allocated",
]
cfm_snapshot = {}
cfm_present = 0
for eid in cfm_ids:
    st_val = ent_state(eid)
    cfm_snapshot[eid] = st_val
    if st_val is not None and str(st_val).lower() not in ("unavailable", "unknown", ""):
        cfm_present += 1
# Prefer allocated CFM; cascade + at least 2 exhaust/intake
ok("HTTP_cfm_sensors", cfm_present >= 3, {
    "present_count": cfm_present, "states": cfm_snapshot,
})

# Mass balance SoT (SPA gates chip — live may be off; just record)
mass_ok = ent_state("binary_sensor.dsc_flow_mass_balance_ok")
out["fleet_snapshot"] = {
    "reduced_kit": {"state": rk_state, "planned_oos": planned, "offline": offline},
    "full_auto": ent_state("switch.dsc_hub_tent_full_auto_mode"),
    "clone_mode": ent_state("select.dsc_hub_clone_mode"),
    "clone_photoperiod": ent_state("select.dsc_hub_clone_photoperiod"),
    "canopy": canopy if isinstance(canopy, dict) else {},
    "cfm": cfm_snapshot,
    "mass_balance_ok": mass_ok,
    "want_temp_4x8": ent_state("number.dsc_hub_tent_want_temp"),
    "want_rh_4x8": ent_state("number.dsc_hub_tent_want_rh"),
    "want_temp_2x4": ent_state("number.dsc_hub_clone_want_temp"),
    "want_rh_2x4": ent_state("number.dsc_hub_clone_want_rh"),
}

# G9 restore: Climate prove is read-only HTTP — no levers mutated
out["restore"] = {
    "note": "HTTP-only Climate prove; no Climate Want / Mode / Full Auto mutations.",
    "levers_stressed": False,
}

path = "/tmp/live-ux-climate-prove-evidence.json"
with open(path, "w", encoding="utf-8") as f:
    json.dump(out, f, indent=2)
fails = [k for k, v in out["gates"].items() if not v.get("ok")]
print(json.dumps({
    "evidence": path,
    "fail_count": len(fails),
    "fails": fails,
    "local_js": local_js,
    "live_js": live_js,
    "reduced_kit": rk_state,
    "canopy_role": role,
    "cfm_present": cfm_present,
}, indent=2))
if fails:
    raise SystemExit(2)
PY

echo "=== SPA index head ==="
curl -sf "$BASE/" | head -c 400
echo
echo "DONE"
