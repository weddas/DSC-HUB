#!/bin/bash
set -e
echo Digital | sudo -S rm -rf /tmp/dsc-spa-unpack
echo Digital | sudo -S mkdir -p /tmp/dsc-spa-unpack
echo Digital | sudo -S tar -xzf /tmp/dsc-spa-hotpatch.tgz -C /tmp/dsc-spa-unpack
echo Digital | sudo -S mkdir -p /opt/dsc-hub-repo/brain/static
echo Digital | sudo -S rsync -a --delete /tmp/dsc-spa-unpack/ /opt/dsc-hub-repo/brain/static/
echo Digital | sudo -S docker cp /opt/dsc-hub-repo/brain/static/. dsc-hub-brain:/app/static/
echo Digital | sudo -S grep -oE 'assets/index-[^"]+' /opt/dsc-hub-repo/brain/static/index.html | head -1