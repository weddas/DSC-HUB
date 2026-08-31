#!/bin/bash
# UUID migrate smoke on Pi
python3 - <<'PY'
import json, urllib.request
f = json.load(urllib.request.urlopen("http://127.0.0.1:8787/fleet", timeout=15))
bad = []
for row in f.get("inventory") or []:
    aid = str((row.get("extra") or {}).get("assigned_plant_id") or "")
    if aid.startswith("slot:"):
        bad.append((row.get("seat_id"), aid))
    elif aid and not aid.startswith("plant:"):
        bad.append((row.get("seat_id"), f"non-plant:{aid}"))
print("inv_bad", bad or "none")
for pot in ("pot1", "pot2", "pot3", "pot4"):
    row = next((r for r in (f.get("inventory") or []) if r.get("seat_id") == pot), None)
    aid = str(((row or {}).get("extra") or {}).get("assigned_plant_id") or "") or "(empty)"
    print(pot, aid)
try:
    r = json.load(urllib.request.urlopen("http://127.0.0.1:8787/roster", timeout=15))
except Exception as e:
    print("roster_err", e)
    r = {}
print("roster_top_keys", list(r.keys())[:20] if isinstance(r, dict) else type(r))
slots = []
if isinstance(r, dict):
    slots = r.get("slots") or r.get("plants") or r.get("roster") or []
    if isinstance(r.get("summary"), dict):
        slots = slots or r["summary"].get("slots") or []
slot_bad = []
for s in slots if isinstance(slots, list) else []:
    if not isinstance(s, dict):
        continue
    for k, v in s.items():
        sv = str(v or "")
        if sv.startswith("slot:"):
            slot_bad.append((k, sv))
print("roster_slot_ids", slot_bad or "none")
print("OK" if not bad and not slot_bad else "FAIL")
PY
