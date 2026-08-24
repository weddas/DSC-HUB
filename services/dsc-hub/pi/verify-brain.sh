curl -s http://127.0.0.1:8787/health
echo
echo Digital | sudo -S docker exec dsc-hub-brain python -c "import dsc_brain.appliance_driver as a; print('driver', list(a.DEMAND_TO_SEAT.keys()))"
echo Digital | sudo -S docker logs dsc-hub-brain --tail 15
