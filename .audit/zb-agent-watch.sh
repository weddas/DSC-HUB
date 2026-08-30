#!/bin/bash
# Wake agent when a real Zigbee end device appears
LOG=/tmp/zb-agent-watch.log
echo "watch_start $(date -Is)" | tee -a "$LOG"
while true; do
  h=$(curl -s -m 5 http://127.0.0.1:8787/settings/zigbee/health || echo '{}')
  n=$(python3 -c "import json,sys; print(json.loads(sys.argv[1] or '{}').get('end_device_count',0))" "$h" 2>/dev/null || echo 0)
  pj=$(python3 -c "import json,sys; print(json.loads(sys.argv[1] or '{}').get('permit_join'))" "$h" 2>/dev/null || echo '?')
  echo "$(date -Is) end=$n permit=$pj" | tee -a "$LOG"
  if [ "$n" != "0" ] && [ "$n" != "" ]; then
    echo "AGENT_LOOP_TICK_zbjoin {\"prompt\":\"Zigbee end device joined on DSC Pi — run /tmp/zb-integrate.run, verify Settings Unbound→Bound and Climate canopy is non-qa, update FOLLOWUPS, continue goal audit.\"}"
    curl -s http://127.0.0.1:8787/settings/zigbee/devices | tee -a "$LOG"
    bash /tmp/zb-integrate.run 2>&1 | tee -a "$LOG" || true
    exit 0
  fi
  # keep join open without spamming every loop if already true
  if [ "$pj" != "True" ] && [ "$pj" != "true" ]; then
    curl -s -m 5 -X POST http://127.0.0.1:8787/settings/zigbee/permit-join \
      -H 'Content-Type: application/json' -d '{"enabled":true,"duration_s":254}' >/dev/null || true
  fi
  sleep 45
done
