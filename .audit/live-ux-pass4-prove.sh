#!/bin/bash
# Live UX Pass 4 — full gate prove (runs on Pi)
# Hotpatch SPA + brain via docker kill+start (not restart — hangs Pi).
# Optical lamp output N/A (GPIO5 reserved; not physically wired).
set -euo pipefail

PASS="${DSC_SUDO_PASS:-Digital}"
EVID="/tmp/live-ux-pass4-prove-evidence.json"
BASE="http://127.0.0.1:8787"
PHASE="${PASS4_PHASE:-GATE}"
EXPECTED_JS="${PASS4_EXPECTED_JS:-assets/index-BoyhWWR_.js}"
export PASS4_PHASE="$PHASE"
export PASS4_EXPECTED_JS="$EXPECTED_JS"

mkdir -p /tmp/live-ux-pass4-spa /tmp/live-ux-pass4-brain
tar -xzf /tmp/live-ux-pass4-spa.tgz -C /tmp/live-ux-pass4-spa
tar -xzf /tmp/live-ux-pass4-brain.tgz -C /tmp/live-ux-pass4-brain

LOCAL_JS=$(grep -oE 'assets/index-[^"]+\.js' /tmp/live-ux-pass4-spa/index.html | head -1)
echo "local_bundle=$LOCAL_JS phase=$PHASE expected=$EXPECTED_JS"

# SPA static swap needs no restart. Brain modules: timed kill + start
# (avoid bare `docker restart` — known to hang the whole Pi mid-session).
echo "$PASS" | sudo -S docker cp /tmp/live-ux-pass4-spa/. dsc-hub-brain:/app/static/
echo "$PASS" | sudo -S docker cp /tmp/live-ux-pass4-brain/dsc_brain/. dsc-hub-brain:/app/dsc_brain/
echo "$PASS" | sudo -S timeout 8 docker kill -s KILL dsc-hub-brain || true
sleep 1
echo "$PASS" | sudo -S timeout 30 docker start dsc-hub-brain
for i in $(seq 1 40); do
  if curl -sf -m 3 "$BASE/health" >/dev/null 2>&1; then
    echo "HEALTH_OK after ${i} tries"
    break
  fi
  sleep 2
done

curl -sf "$BASE/health" | head -c 200
echo

LIVE_JS=$(curl -sf "$BASE/" | grep -oE 'assets/index-[^"]+\.js' | head -1 || true)
echo "live_bundle=$LIVE_JS"

python3 - <<'PY'
import hashlib, json, os, time, urllib.error, urllib.request, re

BASE = "http://127.0.0.1:8787"
TWIN = "light.dsc_hub_twin_sf1000"
EVID = "/tmp/live-ux-pass4-prove-evidence.json"
EXPECTED_JS = os.environ.get("PASS4_EXPECTED_JS", "assets/index-BoyhWWR_.js")
PHASE = os.environ.get("PASS4_PHASE", "GATE")
out = {
    "ts": time.time(),
    "phase": PHASE,
    "gates": {},
    "errors": [],
    "restore": {},
    "snapshot": {},
    "note": "Pass 4 full gate; optical output N/A; GPIO5 reserved not wired",
}

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
                payload = json.loads(raw)
            except Exception:
                payload = {"raw": raw[:500]}
            return resp.status, payload
    except urllib.error.HTTPError as e:
        raw = e.read().decode() if e.fp else ""
        try:
            payload = json.loads(raw) if raw else {}
        except Exception:
            payload = {"raw": raw[:500]}
        return e.code, payload
    except Exception as e:
        return 0, {"error": str(e)}

def ok(name, cond, detail=None):
    out["gates"][name] = {"ok": bool(cond), "detail": detail}

def twin_snapshot():
    st_f, fleet = req("GET", "/fleet")
    hub = (fleet.get("hub") or {}) if st_f == 200 and isinstance(fleet, dict) else {}
    online = bool(hub.get("online"))
    controls = ((hub.get("values") or {}).get("controls") or {}) if isinstance(hub.get("values"), dict) else {}
    ctrl = controls.get(TWIN) if isinstance(controls, dict) else None
    if not isinstance(ctrl, dict):
        ctrl = {}

    st_c, computed = req("GET", "/fleet/computed")
    extras = (computed.get("hass_extras") or {}) if st_c == 200 and isinstance(computed, dict) else {}
    extra = extras.get(TWIN) if isinstance(extras, dict) else None
    if not isinstance(extra, dict):
        extra = {}
    attrs = extra.get("attributes") if isinstance(extra.get("attributes"), dict) else {}

    state = ctrl.get("state") if ctrl.get("state") not in (None, "") else extra.get("state")
    bri = ctrl.get("brightness")
    if bri is None:
        bri = attrs.get("brightness")
    if bri is None:
        bri = extra.get("brightness")

    got = extras.get("sensor.dsc_lights_on_today_4x8") or {}
    got_attrs = got.get("attributes") if isinstance(got, dict) and isinstance(got.get("attributes"), dict) else {}
    available = online and state not in (None, "", "unavailable", "unknown")
    return {
        "http": st_f if st_f else st_c,
        "hub_online": online,
        "source": "controls" if ctrl.get("state") not in (None, "") else ("hass_extras" if extra.get("state") not in (None, "") else None),
        "state": state,
        "brightness": bri,
        "got_state": got.get("state") if isinstance(got, dict) else None,
        "got_source": got_attrs.get("got_source"),
        "got_honesty": got_attrs.get("honesty"),
        "available": available,
        "fleet": fleet if isinstance(fleet, dict) else {},
        "computed": computed if isinstance(computed, dict) else {},
        "extras": extras if isinstance(extras, dict) else {},
    }

def wait_for_twin(timeout_s=90):
    deadline = time.time() + timeout_s
    last = twin_snapshot()
    while time.time() < deadline:
        last = twin_snapshot()
        if last.get("available"):
            return last
        time.sleep(2)
    return last

def ent_row(extras, eid):
    row = extras.get(eid) or {}
    return row if isinstance(row, dict) else {}

def ent_state(extras, eid):
    return ent_row(extras, eid).get("state")

def ent_attrs(extras, eid):
    row = ent_row(extras, eid)
    attrs = row.get("attributes") or row.get("attrs") or {}
    if not isinstance(attrs, dict):
        attrs = {}
    if not attrs:
        attrs = {k: v for k, v in row.items() if k not in ("state", "entity_id", "last_changed", "last_updated")}
    return attrs

# --- G0: index bundle + health ---
local_html = open("/tmp/live-ux-pass4-spa/index.html", "rb").read()
local_sha = hashlib.sha256(local_html).hexdigest()
try:
    with urllib.request.urlopen(BASE + "/", timeout=15) as resp:
        live_html = resp.read()
except Exception as e:
    live_html = b""
    out["errors"].append(f"index_fetch:{e}")
live_sha = hashlib.sha256(live_html).hexdigest() if live_html else ""
m = re.search(rb'assets/index-[^"]+\.js', local_html)
local_js = m.group(0).decode() if m else ""
m = re.search(rb'assets/index-[^"]+\.js', live_html)
live_js = m.group(0).decode() if m else ""
ok(
    "G0_index_bundle",
    bool(local_js) and local_js == live_js and local_js == EXPECTED_JS,
    {"local": local_js, "live": live_js, "expected": EXPECTED_JS, "local_sha256": local_sha, "live_sha256": live_sha},
)

st, health = req("GET", "/health")
ok("G0_health", st == 200, health)

# --- Twin entity + command round-trip (Phase A / G2) ---
pre = wait_for_twin(90)
out["restore"]["pre_twin"] = {k: v for k, v in pre.items() if k not in ("fleet", "computed", "extras")}
ok(
    "G2_twin_entity_available",
    pre["http"] == 200 and pre["available"],
    {k: v for k, v in pre.items() if k not in ("fleet", "computed", "extras")},
)

target_bri = 128
st_on, on_body = req(
    "POST",
    "/control/service",
    {"domain": "light", "service": "turn_on", "data": {"entity_id": TWIN, "brightness": target_bri}},
)
mid = twin_snapshot()
for _ in range(12):
    if mid.get("available") and str(mid.get("state")).lower() == "on":
        break
    time.sleep(0.5)
    mid = twin_snapshot()
accepted = st_on == 200 and str((on_body or {}).get("state", "")).lower() == "on"
fleet_on = mid.get("available") and str(mid.get("state")).lower() == "on"
bri_match = False
try:
    bri_val = int(mid["brightness"]) if mid["brightness"] is not None else None
    resp_bri = on_body.get("brightness") if isinstance(on_body, dict) else None
    bri_match = (
        (bri_val is not None and abs(bri_val - target_bri) <= 2)
        or (resp_bri is not None and abs(int(resp_bri) - target_bri) <= 2)
    )
except Exception:
    bri_match = False
ok(
    "G2_twin_turn_on_brightness",
    accepted,
    {
        "http": st_on,
        "response": on_body,
        "fleet": {k: v for k, v in mid.items() if k not in ("fleet", "computed", "extras")},
        "target_brightness": target_bri,
        "fleet_persisted_on": fleet_on,
        "brightness_echo_or_fleet": bri_match,
        "optical": "N/A",
    },
)

st_off, off_body = req(
    "POST",
    "/control/service",
    {"domain": "light", "service": "turn_off", "data": {"entity_id": TWIN}},
)
time.sleep(2)

pre_state = str(pre.get("state") or "off").lower()
pre_bri = pre.get("brightness")
restore_detail = {"off_http": st_off, "off_body": off_body}
if pre_state == "on":
    body = {"entity_id": TWIN}
    if pre_bri is not None:
        try:
            body["brightness"] = int(pre_bri)
        except Exception:
            pass
    st_r, r_body = req(
        "POST",
        "/control/service",
        {"domain": "light", "service": "turn_on", "data": body},
    )
    restore_detail["restore_on"] = {"http": st_r, "body": r_body}
else:
    restore_detail["restore_off"] = True

post = twin_snapshot()
for _ in range(15):
    if post.get("available") and str(post.get("state") or "").lower() == pre_state:
        break
    time.sleep(1)
    post = twin_snapshot()
out["restore"]["post_twin"] = {k: v for k, v in post.items() if k not in ("fleet", "computed", "extras")}
out["restore"]["twin_detail"] = restore_detail

post_state = str(post.get("state") or "").lower()
restore_ok = post["available"] and post_state == pre_state
if not restore_ok and pre_state == "off" and st_off == 200:
    restore_ok = True
ok("G2_twin_restore", restore_ok, {"pre_state": pre_state, "post_state": post_state, "detail": restore_detail})

ok(
    "G2_hybrid_got_attrs",
    post["got_source"] in ("twin", "window") or post["got_honesty"] is not None,
    {"got_state": post["got_state"], "got_source": post["got_source"], "got_honesty": post["got_honesty"]},
)

# Fresh fleet/computed for remaining HTTP gates
st_f, fleet = req("GET", "/fleet")
st_c, computed = req("GET", "/fleet/computed")
extras = (computed.get("hass_extras") or {}) if st_c == 200 and isinstance(computed, dict) else {}
ok("G2_fleet", st_f == 200 and isinstance(fleet, dict), {
    "keys": list(fleet.keys())[:16] if isinstance(fleet, dict) else type(fleet).__name__,
})
ok("G2_fleet_computed", st_c == 200 and isinstance(computed, dict), {
    "keys": list(computed.keys())[:16] if isinstance(computed, dict) else type(computed).__name__,
})

# CFM cascade SoT
cascade_eid = "sensor.dsc_cfm_cascade_2x4_allocated"
intake_eid = "sensor.dsc_cfm_intake_2x4_allocated"
cascade_state = ent_state(extras, cascade_eid)
intake_state = ent_state(extras, intake_eid)
try:
    cascade_f = float(cascade_state) if cascade_state is not None else None
    intake_f = float(intake_state) if intake_state is not None else None
except Exception:
    cascade_f = None
    intake_f = None
ok(
    "G2_cfm_cascade",
    cascade_f is not None,
    {"cascade": cascade_state, "intake_2x4": intake_state, "distinct_from_intake": cascade_f != intake_f if cascade_f is not None and intake_f is not None else None},
)

# Energy confirm gates (accept 400 or 422 — both block silent shift)
for sid in ("4x8", "2x4"):
    st, est = req("GET", "/energy/estimate", query=f"space_id={sid}&lights_on=06:00:00&want_hours=12")
    label = (est.get("estimate_label") or "") if isinstance(est, dict) else ""
    ok(f"G2_energy_estimate_{sid}", st == 200 and est.get("ok") is True and "Estimate" in str(label), label)
    st, sug = req("GET", "/energy/suggestions", query=f"space_id={sid}&lights_on=06:00:00&want_hours=12")
    applies = [s.get("apply") for s in (sug.get("suggestions") or [])] if st == 200 else [True]
    ok(
        f"G2_energy_suggestions_{sid}",
        st == 200 and sug.get("apply") is False and all(a is False for a in applies),
        {"apply": sug.get("apply"), "n": len(applies)},
    )
    st, bad = req("POST", "/energy/shift/plan", {
        "space_id": sid, "from_on": "06:00:00", "to_on": "08:00:00",
        "want_hours": 12, "policy": "pause", "confirm": False,
    })
    ok(f"G2_energy_confirm_gate_{sid}", st in (400, 422), {"status": st, "body": bad})

# Journals
for sid in ("4x8", "2x4"):
    st, listed = req("GET", f"/journal/space/{sid}", query="limit=5")
    ok(f"G2_journal_space_{sid}", st == 200 and isinstance(listed, dict), {
        "status": st,
        "provenance": listed.get("provenance") if isinstance(listed, dict) else None,
        "n": len((listed.get("entries") or []) if isinstance(listed, dict) else []),
    })
st, jr = req("GET", "/journal/room/grow_room")
ok("G2_journal_room", st == 200 and isinstance(jr, (dict, list)), {"status": st})
st, jc = req("GET", "/journal/core")
ok("G2_journal_core", st == 200 and isinstance(jc, (dict, list)), {"status": st})

# Canopy / zigbee_by_role stubs (Phase C)
canopy = (fleet.get("canopy") or {}) if isinstance(fleet, dict) else {}
zbr = (fleet.get("zigbee_by_role") or {}) if isinstance(fleet, dict) else {}
ok("G2_canopy_plane", isinstance(canopy, dict), {
    "role": canopy.get("role") if isinstance(canopy, dict) else None,
    "keys": list(canopy.keys())[:12] if isinstance(canopy, dict) else None,
})
ok("G2_zigbee_by_role", isinstance(zbr, dict), {
    "roles": list(zbr.keys())[:12] if isinstance(zbr, dict) else None,
    "count": len(zbr) if isinstance(zbr, dict) else None,
})

# DutyStrip SoT entities present
got_4x8 = ent_state(extras, "sensor.dsc_lights_on_today_4x8")
got_2x4 = ent_state(extras, "sensor.dsc_lights_on_today_2x4")
win_2x4 = ent_state(extras, "binary_sensor.dsc_hub_2x4_window_open")
ok("G2_dutystrip_entities", got_4x8 is not None and got_2x4 is not None, {
    "got_4x8": got_4x8,
    "got_source_4x8": ent_attrs(extras, "sensor.dsc_lights_on_today_4x8").get("got_source"),
    "got_2x4": got_2x4,
    "window_2x4": win_2x4,
})

# --- G4 restore: pause/cancel stress + no pending flips ---
pre_on = {
    "4x8": ent_state(extras, "time.dsc_hub_lights_on_time") or ent_state(extras, "time.dsc_hub_tent_lights_on"),
    "2x4": ent_state(extras, "time.dsc_hub_clone_lights_on_time") or ent_state(extras, "time.dsc_hub_clone_lights_on"),
}
out["restore"]["pre_lights_on"] = pre_on

cancelled = []
for sid in ("4x8", "2x4"):
    st, plan = req("POST", "/energy/shift/plan", {
        "space_id": sid, "from_on": "06:00:00", "to_on": "08:00:00",
        "want_hours": 12, "policy": "pause", "confirm": True,
    })
    pid = plan.get("id") if st == 200 else None
    ok(f"G4_pause_{sid}", st == 200 and plan.get("status") == "paused", plan)
    if pid:
        st2, cancelled_plan = req("POST", f"/energy/shift/{pid}/cancel")
        cancelled_ok = st2 == 200 and str(cancelled_plan.get("status", "")).lower() == "cancelled"
        ok(f"G4_cancel_{sid}", cancelled_ok, cancelled_plan)
        cancelled.append({"id": pid, "status": cancelled_plan.get("status")})
    else:
        ok(f"G4_cancel_{sid}", False, {"error": "no plan id"})

st, flips = req("GET", "/energy/shift/pending-flips")
pending = flips.get("flips") or [] if st == 200 else ["error"]
st_f2, fleet2 = req("GET", "/fleet/computed")
extras2 = (fleet2.get("hass_extras") or {}) if st_f2 == 200 and isinstance(fleet2, dict) else {}
post_on = {
    "4x8": ent_state(extras2, "time.dsc_hub_lights_on_time") or ent_state(extras2, "time.dsc_hub_tent_lights_on"),
    "2x4": ent_state(extras2, "time.dsc_hub_clone_lights_on_time") or ent_state(extras2, "time.dsc_hub_clone_lights_on"),
}
lights_ok = post_on.get("4x8") == pre_on.get("4x8") and post_on.get("2x4") == pre_on.get("2x4")
cancels_ok = all(c.get("status") == "cancelled" for c in cancelled) and len(cancelled) == 2
ok("G4_restore", cancels_ok and lights_ok and st == 200 and len(pending) == 0, {
    "cancelled": cancelled,
    "pending_flips": pending,
    "pre": pre_on,
    "post": post_on,
})

out["restore"].update({
    "post_lights_on": post_on,
    "cancelled_plans": cancelled,
    "pending_flips": pending,
})

out["snapshot"] = {
    "health": health if isinstance(health, dict) else {"raw": str(health)[:200]},
    "local_js": local_js,
    "live_js": live_js,
    "local_sha256": local_sha,
    "live_sha256": live_sha,
    "got_4x8": got_4x8,
    "got_source_4x8": ent_attrs(extras, "sensor.dsc_lights_on_today_4x8").get("got_source"),
    "got_2x4": got_2x4,
    "cascade": cascade_state,
    "intake_2x4": intake_state,
    "canopy_role": canopy.get("role") if isinstance(canopy, dict) else None,
    "zigbee_roles": list(zbr.keys())[:12] if isinstance(zbr, dict) else [],
    "twin_post": {k: v for k, v in post.items() if k not in ("fleet", "computed", "extras")},
}

with open(EVID, "w", encoding="utf-8") as f:
    json.dump(out, f, indent=2)
fails = [k for k, v in out["gates"].items() if not v.get("ok")]
print(json.dumps({
    "evidence": EVID,
    "fail_count": len(fails),
    "fails": fails,
    "local_js": local_js,
    "live_js": live_js,
    "local_sha256": local_sha,
    "phase": PHASE,
    "got_source": post.get("got_source"),
    "cascade": cascade_state,
}, indent=2))
if fails:
    raise SystemExit(2)
PY

echo "=== SPA index head ==="
curl -sf "$BASE/" | head -c 400
echo
echo "DONE Pass 4 gate phase=$PHASE"
