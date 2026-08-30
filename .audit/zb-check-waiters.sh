#!/bin/bash
pgrep -af 'zb-forever.run|zb-agent-watch.run' | grep -v 'bash -c' || true
echo ---
tail -5 /tmp/zb-agent-watch.log
echo ---
curl -s http://127.0.0.1:8787/ | grep -oE 'assets/index-[^"]+' | head -1
curl -s http://127.0.0.1:8787/settings/zigbee/health; echo
