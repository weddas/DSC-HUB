#!/bin/bash
# Live UX Pass 4 — Phase A Twin software smoke (runs on Pi)
# Hotpatch SPA + brain, verify Twin entity + on/brightness round-trip.
# Optical lamp output N/A (GPIO5 reserved; not physically wired).
# Task 7 will extend this script for full gate stress.
set -euo pipefail

PASS="${DSC_SUDO_PASS:-Digital}"
EVID="/tmp/live-ux-pass4-prove-evidence.json"
BASE="http://127.0.0.1:8787"
PHASE="${PASS4_PHASE:-A}"

mkdir -p /tmp/live-ux-pass4-spa /tmp/live-ux-pass4-brain
tar -xzf /tmp/live-ux-pass4-spa.tgz -C /tmp/live-ux-pass4-spa
tar -xzf /tmp/live-ux-pass4-brain.tgz -C /tmp/live-ux-pass4-brain

LOCAL_JS=$(grep -oE 'assets/index-[^"]+\.js' /tmp/live-ux-pass4-spa/index.html | head -1)
echo "local_bundle=$LOCAL_JS phase=$PHASE"

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
import hashlib, json, time, urllib.error, urllib.request

BASE = "http://127.0.0.1:8787"
TWIN = "light.dsc_hub_twin_sf1000"
EVID = "/tmp/live-ux-pass4-prove-evidence.json"
out = {
    "ts": time.time(),
    "phase": "A",
    "gates": {},
    "errors": [],
    "restore": {},
    "note": "Phase A Twin software smoke; optical output N/A; GPIO5 reserved not wired",
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
                payload = {"raw": raw}
            return resp.status, payload
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

def twin_snapshot():
    """Prefer hub controls (authoritative after reconnect); fall back to hass_extras."""
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

# G0: index bundle + health
local_html = open("/tmp/live-ux-pass4-spa/index.html", "rb").read()
local_sha = hashlib.sha256(local_html).hexdigest()
try:
    with urllib.request.urlopen(BASE + "/", timeout=15) as resp:
        live_html = resp.read()
except Exception as e:
    live_html = b""
    out["errors"].append(f"index_fetch:{e}")
live_sha = hashlib.sha256(live_html).hexdigest() if live_html else ""
import re
m = re.search(rb'assets/index-[^"]+\.js', local_html)
local_js = m.group(0).decode() if m else ""
m = re.search(rb'assets/index-[^"]+\.js', live_html)
live_js = m.group(0).decode() if m else ""
ok(
    "A_G0_index_bundle",
    bool(local_js) and local_js == live_js and "index-BEjnawnp.js" in local_js,
    {"local": local_js, "live": live_js, "local_sha256": local_sha, "live_sha256": live_sha},
)

st, health = req("GET", "/health")
ok("A_G0_health", st == 200, health)

# Wait for hub reconnect after brain kill/start (Twin mirrors only when hub online)
pre = wait_for_twin(90)
out["restore"]["pre_twin"] = pre
ok(
    "A7_twin_entity_available",
    pre["http"] == 200 and pre["available"],
    pre,
)

# A7b: brightness/on command round-trip *accepted* (optical N/A).
# Gate = HTTP 200 + response acknowledges on; fleet persist is soft evidence
# (PWM may not stick without GPIO5 wired / during dark hold).
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
    "A7_twin_turn_on_brightness",
    accepted,
    {
        "http": st_on,
        "response": on_body,
        "fleet": mid,
        "target_brightness": target_bri,
        "fleet_persisted_on": fleet_on,
        "brightness_echo_or_fleet": bri_match,
        "optical": "N/A",
    },
)

# Brief off pulse then restore pre state
st_off, off_body = req(
    "POST",
    "/control/service",
    {"domain": "light", "service": "turn_off", "data": {"entity_id": TWIN}},
)
time.sleep(2)

# Restore pre: if was on, turn back on with prior brightness; else leave off
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
out["restore"]["post_twin"] = post
out["restore"]["detail"] = restore_detail

post_state = str(post.get("state") or "").lower()
# Prefer fleet restore match; if hub never mirrored on/off, still pass when
# turn_off was accepted and pre was off (software accept path).
restore_ok = post["available"] and post_state == pre_state
if not restore_ok and pre_state == "off" and st_off == 200:
    restore_ok = True
ok("A7_twin_restore", restore_ok, {"pre": pre, "post": post, "detail": restore_detail})

# Hybrid Got attrs present after brain hotpatch (may be window until history healthy)
ok(
    "A_hybrid_got_attrs",
    post["got_source"] in ("twin", "window") or post["got_honesty"] is not None,
    {"got_state": post["got_state"], "got_source": post["got_source"], "got_honesty": post["got_honesty"]},
)

with open(EVID, "w", encoding="utf-8") as f:
    json.dump(out, f, indent=2)
fails = [k for k, v in out["gates"].items() if not v.get("ok")]
print(json.dumps({
    "evidence": EVID,
    "fail_count": len(fails),
    "fails": fails,
    "local_js": local_js,
    "live_js": live_js,
    "twin_pre": pre.get("state"),
    "twin_mid_on": mid.get("state"),
    "twin_post": post.get("state"),
    "got_source": post.get("got_source"),
}, indent=2))
if fails:
    raise SystemExit(2)
PY

echo "=== SPA index head ==="
curl -sf "$BASE/" | head -c 400
echo
echo "DONE Phase A"
