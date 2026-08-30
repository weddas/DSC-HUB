#!/bin/bash
# Bind the newly joined device as canopy_4x8 (skip broken rename).
set -euo pipefail
python3 <<'PY'
import json, urllib.request, time

BASE = "http://127.0.0.1:8787"

def get(path):
    return json.loads(urllib.request.urlopen(BASE + path, timeout=10).read())

def put(path, body):
    req = urllib.request.Request(
        BASE + path,
        data=json.dumps(body).encode(),
        headers={"Content-Type": "application/json"},
        method="PUT",
    )
    return json.loads(urllib.request.urlopen(req, timeout=15).read())

devices = get("/settings/zigbee/devices")
ends = []
for d in (devices.get("devices") or []):
    if d.get("type") == "Coordinator":
        continue
    ieee = str(d.get("ieee_address") or "").lower()
    fn = str(d.get("friendly_name") or "").lower()
    if ieee.startswith("0xqa") or ieee.startswith("0xsim") or fn.startswith("qa_"):
        continue
    ends.append(d)
print("ends", [(e.get("ieee_address"), e.get("friendly_name"), e.get("type"), e.get("model")) for e in ends])
if not ends:
    raise SystemExit("no real end device")

d = ends[0]
ieee = str(d["ieee_address"])
fn = str(d.get("friendly_name") or ieee)

existing = get("/settings/zigbee/bindings").get("bindings") or {}
merged = {
    k: v
    for k, v in existing.items()
    if not str(k).lower().startswith("0xqa") and str(k) != ieee
}
merged[ieee] = {
    "role": "canopy_4x8",
    "zone": "4x8",
    "enabled": True,
    "friendly_name": fn,
    "alias": "paired",
}
print("bind", put("/settings/zigbee/bindings", {"bindings": merged}))

for i in range(36):
    f = get("/fleet")
    canopy = f.get("canopy") or {}
    by_role = (f.get("system") or {}).get("zigbee_by_role") or {}
    print(
        f"t+{i*5}s temp={canopy.get('temp_c')} rh={canopy.get('rh_pct') or canopy.get('humidity')} "
        f"role={canopy.get('role')} fn={canopy.get('friendly_name')} by_role={list(by_role.keys())}"
    )
    if (
        canopy.get("role") == "canopy_4x8"
        and canopy.get("friendly_name")
        and not str(canopy.get("friendly_name")).startswith("qa_")
        and canopy.get("temp_c") is not None
    ):
        print("INTEGRATE_OK", ieee, canopy)
        raise SystemExit(0)
    time.sleep(5)

devs = get("/settings/zigbee/devices")
print("devices_final", json.dumps(devs, indent=2)[:2000])
print("BOUND_WAITING_TELEMETRY", ieee, fn)
raise SystemExit(2)
PY
