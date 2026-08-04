# Anemometer CFM curves (Learning)

Plumbing is live in `dsc_v4_device_cal.yaml` + Learning view. Curves stay **unset (0)** until you measure — no invented points in git.

## Operator steps

1. Open **DSC-HUB Pro → Learning**.
2. Check `sensor.dsc_cfm_curves_status` — expect `nameplate_only` until done.
3. For each duct (**OUT**, **RECIRC**, **intake main**, **intake clone**):
   - Set fan to 25 / 50 / 75 / 100% via hub / Control.
   - Hold anemometer in duct centerline; enter m/s into the wizard (or compute CFM and write `input_number.dsc_cal_cfm_*_{25,50,75,100}`).
   - Need **≥2 points** per duct for `sensor.dsc_cfm_*` to leave nameplate-proxy mode.
4. Confirm status → `all_curves` or `partial N/4`.
5. Climate / The Dash allocated CFM then uses curve-backed values when hub fans are online.

## Blocked if

- Hub offline (fan % / CFM consumers unavailable)
- No anemometer on site — leave zeros; honesty attributes stay nameplate
