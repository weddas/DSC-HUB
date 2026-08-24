$HostKey = "SHA256:4XD2kIJ5qNCnULKNmo/L9mvzLbmZdURLwLW7Utt9NJs"
$plink = "plink -batch -hostkey `"$HostKey`" -pw Digital dsc@10.42.0.1"
$remote = "curl -s http://127.0.0.1:8787/health; echo; echo Digital | sudo -S docker exec dsc-hub-brain python -c 'import dsc_brain.appliance_driver as a; print(list(a.DEMAND_TO_SEAT.keys()))'; echo Digital | sudo -S docker logs dsc-hub-brain --tail 10"
Invoke-Expression "$plink `"$remote`""
