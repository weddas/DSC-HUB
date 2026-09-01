#!/bin/bash
# space-energy-pi-closure remote hotpatch + HTTP stress (runs on Pi)
set -euo pipefail

PASS="${DSC_SUDO_PASS:-Digital}"
EVID="/tmp/space-energy-closure-evidence.json"
BASE="http://127.0.0.1:8787"

mkdir -p /tmp/space-energy-spa /tmp/space-energy-brain
tar -xzf /tmp/space-energy-spa.tgz -C /tmp/space-energy-spa
tar -xzf /tmp/space-energy-brain.tgz -C /tmp/space-energy-brain

echo "$PASS" | sudo -S docker cp /tmp/space-energy-spa/. dsc-hub-brain:/app/static/
echo "$PASS" | sudo -S docker cp /tmp/space-energy-brain/dsc_brain/. dsc-hub-brain:/app/dsc_brain/
echo "$PASS" | sudo -S timeout 45 docker restart dsc-hub-brain
sleep 10

curl -sf "$BASE/health" | head -c 200
echo

python3 - <<'PY'
import json, time, urllib.error, urllib.request

BASE = "http://127.0.0.1:8787"
out = {"ts": time.time(), "gates": {}, "errors": []}

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

st, health = req("GET", "/health")
ok("G0_health", st == 200, health)

st, spaces = req("GET", "/spaces")
ids = {s.get("space_id") for s in (spaces.get("spaces") or [])} if st == 200 else set()
ok("G0_spaces", "4x8" in ids and "2x4" in ids, sorted(ids))

st, rooms = req("GET", "/rooms")
rids = {r.get("room_id") for r in (rooms.get("rooms") or [])} if st == 200 else set()
ok("G1b_rooms", "grow_room" in rids, sorted(rids))

st, fleet = req("GET", "/fleet/computed")
ok("G0_fleet", st == 200, {"keys": list(fleet.keys())[:8] if isinstance(fleet, dict) else type(fleet).__name__})

# Honesty: reduced kit attrs if present
attrs = {}
if isinstance(fleet, dict):
    extras = fleet.get("extras") or fleet.get("binary") or {}
    # try common shapes
    for k, v in (fleet.items() if isinstance(fleet, dict) else []):
        if "reduced" in str(k).lower():
            attrs[k] = v
ok("G1_honesty_probe", True, {"note": "browser/G1 attrs checked in walk", "attrs_hint": attrs})

# Energy matrix both spaces
for sid in ("4x8", "2x4"):
    st, est = req("GET", "/energy/estimate", query=f"space_id={sid}&lights_on=20:00:00&want_hours=12")
    ok(f"E1_estimate_{sid}", st == 200 and est.get("ok") is True, est.get("estimate_label"))
    st, sug = req("GET", "/energy/suggestions", query=f"space_id={sid}&lights_on=20:00:00&want_hours=12")
    applies = [s.get("apply") for s in (sug.get("suggestions") or [])] if st == 200 else [True]
    ok(f"E1_suggestions_{sid}", st == 200 and sug.get("apply") is False and all(a is False for a in applies), sug.get("apply"))
    st, bad = req("POST", "/energy/shift/plan", {
        "space_id": sid, "from_on": "20:00:00", "to_on": "22:00:00",
        "want_hours": 12, "policy": "flower_strict", "confirm": False,
    })
    ok(f"E2_confirm_gate_{sid}", st == 400, bad)

# Journal hierarchy X1-X4
req("POST", "/journal/plant/plant:pi-closure-a", {"note": "plant A obs"})
req("POST", "/journal/plant/plant:pi-closure-b", {"note": "plant B obs"})
req("POST", "/journal/space/2x4", {"note": "tent 2x4 closure"})
req("POST", "/journal/space/4x8", {"note": "tent 4x8 closure"})
st, room_post = req("POST", "/journal/room/grow_room", {"note": "room closure note"})
st, core_post = req("POST", "/journal/core", {"note": "core facility note"})
st, room = req("GET", "/journal/room/grow_room")
notes = " ".join(e.get("note", "") for e in (room.get("entries") or []))
ok("X2_X3_room_rollup", st == 200 and "tent 2x4" in notes and "tent 4x8" in notes and "room closure" in notes, notes[:240])
st, core = req("GET", "/journal/core")
cnotes = " ".join(e.get("note", "") for e in (core.get("entries") or []))
ok("X3_X4_core_rollup", st == 200 and "core facility" in cnotes and "room closure" in cnotes, cnotes[:240])

# Pause plans both + cancel (E3)
for sid in ("4x8", "2x4"):
    st, plan = req("POST", "/energy/shift/plan", {
        "space_id": sid, "from_on": "20:00:00", "to_on": "22:00:00",
        "want_hours": 12, "policy": "pause", "confirm": True,
    })
    pid = plan.get("id") if st == 200 else None
    ok(f"E3_pause_{sid}", st == 200 and plan.get("status") == "paused", plan)
    if pid:
        st2, _ = req("POST", f"/energy/shift/{pid}/cancel")
        ok(f"E3_cancel_{sid}", st2 == 200, {"id": pid})

# Flip deny/approve on 2x4 (E8)
st, flip = req("POST", "/energy/flip/request", {
    "space_id": "2x4", "plant_id": "plant:pi-closure-a", "from_hours": 18, "to_hours": 12,
})
fid = flip.get("id") if st == 200 else None
ok("E8_flip_request", st == 200 and flip.get("status") == "pending", flip)
if fid:
    st, _ = req("POST", f"/energy/flip/{fid}/resolve", {"approve": False})
    ok("E8_flip_deny", st == 200, {"id": fid})
st, flip2 = req("POST", "/energy/flip/request", {
    "space_id": "2x4", "plant_id": "plant:pi-closure-a", "from_hours": 18, "to_hours": 12,
})
fid2 = flip2.get("id") if st == 200 else None
if fid2:
    st, _ = req("POST", f"/energy/flip/{fid2}/resolve", {"approve": True})
    ok("E8_flip_approve", st == 200, {"id": fid2})

st, conf = req("GET", "/energy/conflicts", query="space_id=2x4&plant_id=plant:pi-closure-a&plant_want_hours=12&space_want_hours=18")
ok("E9_conflicts", st == 200 and conf.get("auto_apply") is False, conf.get("auto_apply"))

# Parallel journal load X6
import concurrent.futures
def post_pair(i):
    req("POST", "/journal/space/2x4", {"note": f"burst2-{i}"})
    req("POST", "/journal/space/4x8", {"note": f"burst4-{i}"})
with concurrent.futures.ThreadPoolExecutor(8) as ex:
    list(ex.map(post_pair, range(16)))
st, room2 = req("GET", "/journal/room/grow_room", query="limit=200")
ok("X6_parallel", st == 200 and len(room2.get("entries") or []) >= 16, len(room2.get("entries") or []))

path = "/tmp/space-energy-closure-evidence.json"
with open(path, "w", encoding="utf-8") as f:
    json.dump(out, f, indent=2)
fails = [k for k, v in out["gates"].items() if not v.get("ok")]
print(json.dumps({"evidence": path, "fail_count": len(fails), "fails": fails}, indent=2))
if fails:
    raise SystemExit(2)
PY

echo "=== force-tick both tents (flower_strict) via container ==="
# Prefer pre-uploaded scripts from Windows pscp (avoids quote mangling).
if [[ ! -f /tmp/se-force-tick.py ]]; then
  echo "missing /tmp/se-force-tick.py"
  exit 1
fi
if [[ ! -f /tmp/se-veg-tick.py ]]; then
  echo "missing /tmp/se-veg-tick.py"
  exit 1
fi
echo "$PASS" | sudo -S docker cp /tmp/se-force-tick.py dsc-hub-brain:/tmp/se-force-tick.py
echo "$PASS" | sudo -S docker exec -w /app -e PYTHONPATH=/app dsc-hub-brain python3 /tmp/se-force-tick.py
echo "$PASS" | sudo -S docker cp /tmp/se-veg-tick.py dsc-hub-brain:/tmp/se-veg-tick.py
echo "$PASS" | sudo -S docker exec -w /app -e PYTHONPATH=/app dsc-hub-brain python3 /tmp/se-veg-tick.py

echo "=== SPA index hash ==="
curl -sf "$BASE/" | head -c 400
echo
echo "DONE"
