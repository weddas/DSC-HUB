#!/bin/bash
set -e
PW=Digital
cd /tmp && tar -xzf dsc_brain_hot.tgz
echo "$PW" | sudo -S docker cp /tmp/dsc_brain/. dsc-hub-brain:/app/dsc_brain/
# soft restart brain
echo "$PW" | sudo -S timeout 8 docker kill -s KILL dsc-hub-brain || true
sleep 1
echo "$PW" | sudo -S timeout 20 docker start dsc-hub-brain
# stop z2m restart hammer while HOST_FATAL (policy B flash needed)
echo "$PW" | sudo -S timeout 8 docker stop dsc-hub-z2m || echo "$PW" | sudo -S timeout 8 docker kill -s KILL dsc-hub-z2m || true
sleep 8
for i in 1 2 3 4 5 6 7 8 9 10; do
  code=$(curl -s -o /dev/null -w '%{http_code}' -m 3 http://127.0.0.1:8787/health || echo 000)
  echo health_try_$i=$code
  [ "$code" = "200" ] && break
  sleep 2
done
curl -s -m 5 http://127.0.0.1:8787/settings/zigbee/roles | head -c 200; echo
curl -s -m 5 http://127.0.0.1:8787/settings/zigbee/bindings | head -c 200; echo
python3 - <<'PY'
import urllib.request,json
print(json.load(urllib.request.urlopen('http://127.0.0.1:8787/health', timeout=5)).get('zigbee'))
PY
which universal-silabs-flasher || pip3 show universal-silabs-flasher 2>/dev/null | head -2 || echo 'no_silabs_flasher'
ls -l /dev/ttyACM* 2>/dev/null || echo no_acm