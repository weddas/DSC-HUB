#!/bin/sh
set -e
REG=/config/.storage/core.entity_registry
echo "build/roster/blend input_text in registry:"
jq -r '.data.entities[].entity_id | select(test("input_text\\.dsc_(build|plant_roster|blend)"))' "$REG" | head -50
echo "count dsc input_text:"
jq -r '.data.entities[].entity_id | select(startswith("input_text.dsc_"))' "$REG" | wc -l
echo "nutrient_1:"
jq -r '.data.entities[] | select(.entity_id=="input_text.dsc_nutrient_1_name") | {entity_id,disabled_by,platform,config_entry_id}' "$REG"
echo "input_text domain entries total:"
jq -r '.data.entities[].entity_id | select(startswith("input_text."))' "$REG" | wc -l
