#!/bin/bash
# SoftCal raw + ollama reachability from brain
curl -s -m 25 -w "\nHTTP:%{http_code}\n" -X POST http://127.0.0.1:8787/ai/soft-cal-advice \
  -H 'Content-Type: application/json' -d '{"seat_id":"pot1"}' | tail -c 800
echo
printf '%s\n' Digital | sudo -S docker exec dsc-hub-brain python3 -c "
from dsc_brain.soft_cal_ai import soft_cal_climate_advice
import asyncio
r=asyncio.run(soft_cal_climate_advice(seat_id='pot1'))
print('keys', list(r.keys()))
print('ok', r.get('ok'))
print('narr', (r.get('narrative') or '')[:160])
print('ollama', r.get('ollama'))
"