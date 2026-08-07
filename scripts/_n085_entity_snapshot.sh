#!/bin/sh
# Dump key N-085 entities via Supervisor API
set -e
EIDS="text.dsc_pot3_plant_name input_select.dsc_pot3_strain select.dsc_pot3_strain input_datetime.dsc_pot3_sprout_date sensor.dsc_ha_surface_version sensor.dsc_mix_calculator sensor.dsc_plant_roster_summary input_text.dsc_custom_strain_1_name number.dsc_hub_target_temp number.dsc_hub_rh_target_min number.dsc_hub_rh_target_max input_number.dsc_custom_strain_1_temp_min sensor.dsc_light_ppfd_map input_select.dsc_light_fixture"
OUT=/tmp/n085_snapshot.json
echo '{' > "$OUT"
first=1
for e in $EIDS; do
  code=$(curl -s -o /tmp/ent.json -w "%{http_code}" -H "Authorization: Bearer ${SUPERVISOR_TOKEN}" "http://supervisor/core/api/states/$e")
  if [ "$first" = 1 ]; then first=0; else echo ',' >> "$OUT"; fi
  echo "\"$e\":" >> "$OUT"
  if [ "$code" = "200" ]; then cat /tmp/ent.json >> "$OUT"; else echo "{\"error\":$code}" >> "$OUT"; fi
done
echo '}' >> "$OUT"
cat "$OUT"
