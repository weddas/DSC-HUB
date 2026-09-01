#!/bin/bash
# Live UX Light Pass 1 — remote SPA hotpatch + HTTP energy matrix (runs on Pi)
set -euo pipefail

PASS="${DSC_SUDO_PASS:-Digital}"
EVID="/tmp/live-ux-light-prove-evidence.json"
BASE="http://127.0.0.1:8787"

mkdir -p /tmp/live-ux-light-spa
tar -xzf /tmp/live-ux-light-spa.tgz -C /tmp/live-ux-light-spa

LOCAL_JS=$(grep -oE 'assets/index-[^"]+\.js' /tmp/live-ux-light-spa/index.html | head -1)
echo "local_bundle=$LOCAL_JS"

echo "$PASS" | sudo -S docker cp /tmp/live-ux-light-spa/. dsc-hub-brain:/app/static/
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
            return resp.status, json.loads(resp.read().decode() or "{}")
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
local_html = open("/tmp/live-ux-light-spa/index.html", "rb").read()
local_sha = hashlib.sha256(local_html).hexdigest()
st, _ = req("GET", "/")
# raw HTML for hash
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
ok("G0_index_bundle", local_js and local_js == live_js, {"local": local_js, "live": live_js, "local_sha256": local_sha, "live_sha256": live_sha})

st, health = req("GET", "/health")
ok("G0_health", st == 200, health)

st, fleet = req("GET", "/fleet/computed")
ok("G0_fleet", st == 200, {"keys": list(fleet.keys())[:8] if isinstance(fleet, dict) else type(fleet).__name__})

extras = (fleet.get("hass_extras") or {}) if isinstance(fleet, dict) else {}

def ent_state(eid):
    row = extras.get(eid) or {}
    return row.get("state") if isinstance(row, dict) else None

out["fleet_snapshot"] = {
    "want_4x8": ent_state("sensor.dsc_expected_light_hours"),
    "got_4x8": ent_state("sensor.dsc_lights_on_today_4x8"),
    "window_4x8": ent_state("binary_sensor.dsc_hub_4x8_window_open"),
    "want_2x4": ent_state("sensor.dsc_clone_expected_light_hours"),
    "got_2x4": ent_state("sensor.dsc_lights_on_today_2x4"),
    "window_2x4": ent_state("binary_sensor.dsc_hub_2x4_window_open"),
    "clone_photoperiod": ent_state("select.dsc_hub_clone_photoperiod"),
    "twin": ent_state("light.dsc_hub_twin_sf1000"),
    "sf1000": ent_state("light.dsc_hub_sf1000"),
    "dark_violation": ent_state("binary_sensor.dsc_dark_period_violation"),
    "manual_hold": ent_state("binary_sensor.dsc_brain_hub_override_active"),
    "auto_photoperiod": ent_state("binary_sensor.dsc_auto_photoperiod_active"),
    "lights_on_4x8": ent_state("time.dsc_hub_lights_on_time"),
    "lights_on_2x4": ent_state("time.dsc_hub_clone_lights_on_time"),
}

# Energy matrix both spaces (Task 1 params)
for sid in ("4x8", "2x4"):
    st, est = req("GET", "/energy/estimate", query=f"space_id={sid}&lights_on=06:00:00&want_hours=12")
    label = (est.get("estimate_label") or "") if isinstance(est, dict) else ""
    ok(f"E1_estimate_{sid}", st == 200 and est.get("ok") is True and "Estimate" in str(label), label)
    st, sug = req("GET", "/energy/suggestions", query=f"space_id={sid}&lights_on=06:00:00&want_hours=12")
    applies = [s.get("apply") for s in (sug.get("suggestions") or [])] if st == 200 else [True]
    ok(
        f"E1_suggestions_{sid}",
        st == 200 and sug.get("apply") is False and all(a is False for a in applies),
        {"apply": sug.get("apply"), "n": len(applies)},
    )
    st, bad = req("POST", "/energy/shift/plan", {
        "space_id": sid, "from_on": "06:00:00", "to_on": "08:00:00",
        "want_hours": 12, "policy": "pause", "confirm": False,
    })
    ok(f"E2_confirm_gate_{sid}", st == 400, bad)

# Record lights-on before any schedule stress
pre_on = {
    "4x8": ent_state("time.dsc_hub_lights_on_time"),
    "2x4": ent_state("time.dsc_hub_clone_lights_on_time"),
}
out["restore"]["pre_lights_on"] = pre_on

# E3 pause + cancel both tents (no lights-on mutate)
cancelled = []
for sid in ("4x8", "2x4"):
    st, plan = req("POST", "/energy/shift/plan", {
        "space_id": sid, "from_on": "06:00:00", "to_on": "08:00:00",
        "want_hours": 12, "policy": "pause", "confirm": True,
    })
    pid = plan.get("id") if st == 200 else None
    ok(f"E3_pause_{sid}", st == 200 and plan.get("status") == "paused", plan)
    if pid:
        st2, cancelled_plan = req("POST", f"/energy/shift/{pid}/cancel")
        cancelled_ok = st2 == 200 and str(cancelled_plan.get("status", "")).lower() == "cancelled"
        ok(f"E3_cancel_{sid}", cancelled_ok, cancelled_plan)
        cancelled.append({"id": pid, "status": cancelled_plan.get("status")})
    else:
        ok(f"E3_cancel_{sid}", False, {"error": "no plan id"})

# Journal provenance smoke both tents
for sid in ("4x8", "2x4"):
    note = f"live-ux-light-prove {sid}"
    st, posted = req("POST", f"/journal/space/{sid}", {"note": note})
    ok(f"J1_post_{sid}", st == 200 and posted.get("provenance") == "space", posted)
    st, listed = req("GET", f"/journal/space/{sid}", query="limit=20")
    entries = listed.get("entries") or [] if st == 200 else []
    hit = any(e.get("note") == note and e.get("provenance") == "space" for e in entries)
    ok(f"J1_list_{sid}", st == 200 and hit, {"n": len(entries)})

# G8: cancelled plans + no pending flips; lights-on unchanged (pause path)
st, flips = req("GET", "/energy/shift/pending-flips")
pending = flips.get("flips") or [] if st == 200 else ["error"]
# Re-fetch fleet for post lights-on
st_f, fleet2 = req("GET", "/fleet/computed")
extras2 = (fleet2.get("hass_extras") or {}) if st_f == 200 and isinstance(fleet2, dict) else {}
def ent2(eid):
    row = extras2.get(eid) or {}
    return row.get("state") if isinstance(row, dict) else None
post_on = {
    "4x8": ent2("time.dsc_hub_lights_on_time"),
    "2x4": ent2("time.dsc_hub_clone_lights_on_time"),
}
lights_ok = post_on.get("4x8") == pre_on.get("4x8") and post_on.get("2x4") == pre_on.get("2x4")
cancels_ok = all(c.get("status") == "cancelled" for c in cancelled) and len(cancelled) == 2
ok("G8_restore", cancels_ok and lights_ok and st == 200 and len(pending) == 0, {
    "cancelled": cancelled,
    "pending_flips": pending,
    "pre": pre_on,
    "post": post_on,
})

out["restore"].update({
    "post_lights_on": post_on,
    "cancelled_plans": cancelled,
    "pending_flips": pending,
    "note": "E3 pause/cancel only; lights-on must match pre. No force-tick in this prove.",
})

path = "/tmp/live-ux-light-prove-evidence.json"
with open(path, "w", encoding="utf-8") as f:
    json.dump(out, f, indent=2)
fails = [k for k, v in out["gates"].items() if not v.get("ok")]
print(json.dumps({"evidence": path, "fail_count": len(fails), "fails": fails, "local_js": local_js, "live_js": live_js}, indent=2))
if fails:
    raise SystemExit(2)
PY

echo "=== SPA index head ==="
curl -sf "$BASE/" | head -c 400
echo
echo "DONE"
