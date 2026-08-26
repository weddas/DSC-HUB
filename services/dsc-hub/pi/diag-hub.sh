#!/bin/bash
set -eu
echo "=== ping hub ==="
ping -c 3 10.42.0.10 || true
echo "=== nc 6053 ==="
nc -z -w 2 10.42.0.10 6053 && echo api_port_open || echo api_port_closed
echo "=== hostapd hub events ==="
echo Digital | sudo -S journalctl -u dsc-hub-ap -n 50 --no-pager | grep -iE '84:1f|deauth|disassoc|auth fail|handshake' || true
echo "=== brain hub link ==="
curl -s http://127.0.0.1:8787/fleet | python3 -c "import sys,json; d=json.load(sys.stdin); h=d.get('hub',{}); print('hub online',h.get('online'),'fw',h.get('firmware'),'host',h.get('values',{}).get('host'))" 2>/dev/null || true
