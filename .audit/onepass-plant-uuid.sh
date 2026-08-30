#!/bin/bash
# Evidence: plant UUID + roster
python3 <<'PY'
import json,urllib.request
B='http://127.0.0.1:8787'
def get(p):
  return json.loads(urllib.request.urlopen(B+p,timeout=10).read())
f=get('/fleet')
# roster paths vary
for key in ('roster','plants','plant_roster'):
  v=f.get(key)
  if v: print(key, type(v), str(v)[:400])
sys=f.get('system') or {}
for key in ('roster','plants','plant_roster','helpers'):
  v=sys.get(key)
  if v: print('system.'+key, type(v), str(v)[:400])
# try dedicated endpoints
for p in ('/plants','/roster','/settings/plants','/control/plants'):
  try:
    r=urllib.request.urlopen(B+p,timeout=5)
    print(p, r.status, r.read()[:200])
  except Exception as e:
    print(p, e)
# inventory plant fields
for i in f.get('inventory') or []:
  if not isinstance(i,dict): continue
  if 'pot' in str(i.get('seat_id') or '') or 'probe' in str(i.get('role') or ''):
    print('inv', {k:i.get(k) for k in ('seat_id','assigned_plant_id','plant_id','in_service','idle_home')})
PY
