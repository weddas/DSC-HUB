set -e
mkdir -p /tmp/bar2-spa /tmp/bar2-brain
rm -rf /tmp/bar2-spa/* /tmp/bar2-brain/*
tar -xzf /tmp/bar2-spa.tgz -C /tmp/bar2-spa
tar -xzf /tmp/bar2-brain.tgz -C /tmp/bar2-brain
mkdir -p /opt/dsc-hub-repo/brain/static
rsync -a --delete /tmp/bar2-spa/ /opt/dsc-hub-repo/brain/static/
docker cp /opt/dsc-hub-repo/brain/static/. dsc-hub-brain:/app/static/
docker cp /tmp/bar2-brain/dsc_brain/plant_probe.py dsc-hub-brain:/app/dsc_brain/plant_probe.py
docker cp /tmp/bar2-brain/dsc_brain/compose_ops.py dsc-hub-brain:/app/dsc_brain/compose_ops.py
docker cp /tmp/bar2-brain/dsc_brain/api.py dsc-hub-brain:/app/dsc_brain/api.py
docker cp /tmp/bar2-brain/dsc_brain/control_ops.py dsc-hub-brain:/app/dsc_brain/control_ops.py
docker cp /tmp/bar2-brain/dsc_brain/computed_ops.py dsc-hub-brain:/app/dsc_brain/computed_ops.py
timeout 45 docker restart dsc-hub-brain || (docker kill dsc-hub-brain; sleep 2; docker start dsc-hub-brain)
sleep 8
curl -sS -o /dev/null -w http=%{http_code} http://127.0.0.1:8787/
echo
python3 -c 'import re; print(re.findall(r"assets/index-[^\"]+\.js", open("/opt/dsc-hub-repo/brain/static/index.html").read())[0])'
