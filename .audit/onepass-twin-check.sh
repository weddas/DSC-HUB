#!/bin/bash
# Twin SF1000 entity check
curl -s http://127.0.0.1:8787/fleet -o /tmp/fleet.json
python3 <<'PY'
import json,re
s=open("/tmp/fleet.json").read()
for m in re.findall(r'.{0,40}twin_sf1000.{0,80}', s, re.I):
    print("hit", m[:120])
d=json.load(open("/tmp/fleet.json"))
# lights / entities common paths
for k in ("lights","entities","esphome","hub"):
    v=d.get(k)
    if v: print(k, str(v)[:200])
sys=d.get("system")or{}
for k in ("lights","twin","esphome_entities"):
    if k in sys: print("system."+k, str(sys[k])[:200])
# hass-style in computed
extras=d.get("hass_extras") or sys.get("hass_extras") or {}
if isinstance(extras,dict):
    for k,v in extras.items():
        if "twin" in k.lower() or "sf1000" in str(v).lower():
            print("extra",k,v)
PY
# direct entity state if exposed
for p in /control/lights /lights /esphome/entities; do
  code=$(curl -s -o /tmp/ep.json -w '%{http_code}' http://127.0.0.1:8787$p || true)
  echo "$p -> $code"
done
