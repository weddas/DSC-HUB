#!/bin/bash
# Operator polish E2E smoke (Pi)
set -euo pipefail
BASE=http://127.0.0.1:8787
echo "== health =="
curl -sS -m 8 -o /dev/null -w "health=%{http_code}\n" "$BASE/health" || true
echo "== spa assets =="
html=$(curl -sS -m 8 "$BASE/")
echo "$html" | grep -oE 'assets/index-[^"]+\.js' | head -1
echo "== ppfd =="
for f in spider_farmer_sf1000.jpg spider_farmer_sf2000.jpg spider_farmer_se7000.jpg mars_hydro_ts1000.jpg manifest.json; do
  code=$(curl -sS -m 8 -o /dev/null -w "%{http_code}" "$BASE/dsc-catalog/ppfd/$f" || echo 000)
  echo "ppfd/$f $code"
done
echo "== calibrate chunk =="
cal=$(echo "$html" | grep -oE 'assets/calibrate-[^"]+\.js' | head -1 || true)
if [ -n "$cal" ]; then
  body=$(curl -sS -m 15 "$BASE/$cal")
  echo "$body" | grep -q 'SoftCal OK' && echo SoftCal_OK=yes || echo SoftCal_OK=no
  echo "$body" | grep -q 'holds live fans' && echo live_hold=yes || echo live_hold=no
  echo "$body" | grep -q 'What:' && echo outcome_strip=yes || echo outcome_strip=no
fi
echo "== catalog offset =="
python3 - <<'PY'
import json,urllib.request
def ids(off):
  u=f'http://127.0.0.1:8787/v1/catalogs/strains?q=&limit=5&offset={off}'
  d=json.load(urllib.request.urlopen(u,timeout=30))
  rows=d if isinstance(d,list) else d.get('items') or []
  return [r.get('id') or r.get('name') for r in rows]
a,b=ids(0),ids(5)
print('page0',a[:2])
print('page1',b[:2])
print('offset_ok', bool(a and b and a[0]!=b[0]))
PY
echo "== uuid =="
python3 - <<'PY'
import json,urllib.request
f=json.load(urllib.request.urlopen('http://127.0.0.1:8787/fleet',timeout=15))
bad=[]
for row in f.get('inventory') or []:
  aid=str((row.get('extra') or {}).get('assigned_plant_id') or '')
  if aid.startswith('slot:'): bad.append(aid)
print('slot_residual', bad or 'none')
print('pot1', next(((row.get('extra') or {}).get('assigned_plant_id') for row in (f.get('inventory') or []) if row.get('seat_id')=='pot1'),''))
PY
echo DONE
