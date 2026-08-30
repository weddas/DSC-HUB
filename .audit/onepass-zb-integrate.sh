#!/bin/bash
# Strengthen integrate: bind canopy_4x8, drop QA, rename friendly in z2m, wait telemetry.
set -euo pipefail
python3 <<'PY'
import json, urllib.request, time, subprocess

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
    return json.loads(urllib.request.urlopen(req, timeout=10).read())

devices = get("/settings/zigbee/devices")
ends = []
for d in (devices.get("devices") or []):
    if d.get("type") == "Coordinator":
        continue
    ieee = str(d.get("ieee_address") or "").lower()
    fn = str(d.get("friendly_name") or "").lower()
    if ieee.startswith("0xqa") or ieee.startswith("0xsim") or fn.startswith("qa_"):
        print("skip_fake", d.get("ieee_address"), d.get("friendly_name"))
        continue
    ends.append(d)
print("ends", [(e.get("ieee_address"), e.get("friendly_name"), e.get("model")) for e in ends])
if not ends:
    raise SystemExit("no real end device yet")

d = ends[0]
ieee = str(d["ieee_address"])
fn = str(d.get("friendly_name") or ieee)
# Prefer a stable canopy name when still ieee/hex-ish
new_fn = "canopy_4x8_main"
if fn.startswith("0x") or fn == ieee:
    # Best-effort rename via mosquitto inside compose network
    payload = json.dumps({"from": fn, "to": new_fn, "homeassistant_rename": True})
    cmd = [
        "docker", "exec", "dsc-hub-mosquitto",
        "mosquitto_pub", "-h", "127.0.0.1",
        "-t", "zigbee2mqtt/bridge/request/device/rename",
        "-m", payload,
    ]
    try:
        # Pass JSON via stdin to mosquitto_pub -m to avoid shell-quote breakage on ieee.
        subprocess.run(
            [
                "bash",
                "-lc",
                "echo Digital | sudo -S docker exec -i dsc-hub-mosquitto "
                "mosquitto_pub -h 127.0.0.1 "
                "-t zigbee2mqtt/bridge/request/device/rename -l",
            ],
            input=(payload + "\n").encode(),
            check=False,
            timeout=10,
        )
        print("rename_requested", fn, "->", new_fn)
        fn = new_fn
        time.sleep(2)
    except Exception as e:
        print("rename_skip", e)

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

for i in range(24):
    f = get("/fleet")
    canopy = f.get("canopy") or {}
    by_role = (f.get("system") or {}).get("zigbee_by_role") or {}
    print(
        f"t+{i*5}s canopy_temp={canopy.get('temp_c')} role={canopy.get('role')} "
        f"fn={canopy.get('friendly_name')} by_role={list(by_role.keys())}"
    )
    if (
        canopy.get("role") == "canopy_4x8"
        and canopy.get("friendly_name")
        and not str(canopy.get("friendly_name")).startswith("qa_")
        and canopy.get("temp_c") is not None
    ):
        print("INTEGRATE_OK", ieee, canopy.get("friendly_name"))
        raise SystemExit(0)
    if canopy.get("role") == "canopy_4x8" and canopy.get("friendly_name") == fn:
        print("BOUND_WAITING_TELEMETRY", ieee, fn)
    time.sleep(5)

print("BOUND_WAITING_TELEMETRY", ieee, fn)
raise SystemExit(2)
PY
