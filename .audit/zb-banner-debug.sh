#!/bin/bash
set -euo pipefail
echo Digital | sudo -S docker exec -i dsc-hub-brain python3 <<'PY'
from dsc_brain.fleet_state import get_fleet_state, update_fleet_state
from dsc_brain.zigbee_policies import evaluate_device_policies, save_zigbee_policies

f = get_fleet_state()
f.system = dict(f.system)
f.system["zigbee_policy_state"] = {}
f.system["critical_banners"] = []
update_fleet_state(f)

save_zigbee_policies(
    {
        "0xqa_tank_leak": {
            "recipe_id": "tank_full_appliance",
            "enabled": True,
            "params": {},
        }
    }
)
out = evaluate_device_policies(
    ieee="0xqa_tank_leak",
    friendly_name="qa_tank_leak",
    payload={"water_leak": True},
)
print("out", out)
print("banners", get_fleet_state().system.get("critical_banners"))
print("params path ok")
PY
