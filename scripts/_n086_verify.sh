#!/bin/sh
echo "surface_pkg=$(grep -m1 'state: \"5' /config/packages/dsc_v4_version.yaml)"
echo "fixtures=$(grep -c fixtures /config/packages/dsc_v4_light_catalog.yaml)"
echo "want_bands=$(grep -c want_bands /config/packages/dsc_v4_strain_catalog.yaml)"
echo "build_bytes=$(wc -c </config/packages/dsc_v4_build_plant.yaml)"
ha addons info df65166e_dsc_hub_sync 2>/dev/null | grep -E '^(state|boot|version):' | head -10
grep -n 'show_in_sidebar\|title: DSC' /config/configuration.yaml | head -10