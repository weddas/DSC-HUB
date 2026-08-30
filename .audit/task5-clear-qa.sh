#!/bin/bash
set -euo pipefail
BASE=http://127.0.0.1:8787
python3 <<'PY'
import json, urllib.request
base = "http://127.0.0.1:8787"
qa = "0xqa_task5_inactive"
for path, key in [("/settings/zigbee/policies", "policies"), ("/settings/zigbee/bindings", "bindings")]:
    d = json.load(urllib.request.urlopen(base + path))
    obj = dict(d.get(key) or {})
    obj.pop(qa, None)
    body = json.dumps({key: obj}).encode()
    r = urllib.request.Request(
        base + path, data=body, method="PUT", headers={"Content-Type": "application/json"}
    )
    print(path, urllib.request.urlopen(r).status)
b = json.load(urllib.request.urlopen(base + "/settings/zigbee/bindings"))["bindings"]
p = json.load(urllib.request.urlopen(base + "/settings/zigbee/policies"))["policies"]
print("qa_gone", qa not in b and qa not in p)
print("live_tank", b.get("0xa4c138b9e2b9b690"))
print("live_policy", p.get("0xa4c138b9e2b9b690"))
PY
