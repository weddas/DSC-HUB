# Changelog

## v5.1.2 — 2026-08-02

- DSC-CONTROL **5.1.2**: kill `lv_draw_unit_draw_letter` crash-loop (core 1 /
  Fault-Unknown) seen on 5.1.0–5.1.1 after wake / unlock / lock.
- Keep `panel_sleeping` through wake defer; coalesce paints with `ui_dirty` +
  200 ms drain; `touch_guard` blocks tab `refresh_ui` under active indev.
- No full `refresh_ui` on wake, unlock/lock commit, or ESP-NOW confirm.
- Hold HUD show deferred off the press callback; lock row icons `mdi_22`.

## v5.1.1 — 2026-08-01

- DSC-CONTROL glass: **instant** grey pending on every +/- and toggle; neon when
  hub ESP-NOW echoes (HA colours unchanged). Multi-tap accumulates from pending.
- Kill freezes: defer overlay hide / `refresh_ui` after wake, unlock, lock commit;
  bar-only hold HUD; lock only from dedicated hit / Settings row (no page hold).
- Idle sleep reuses lock overlay (tap to wake); 12% backlight for 5 min then off.
- Harder LVGL scroll (`scroll_limit` 40); multi-alert list from bell/strip.
- Lean: drop dead `saver` overlay; paint alert rows in-place (no string buffer);
  remove plant/sky HUD + `mdi_grow` font.
- Panel project **5.1.1**.

## v5.1.0 — 2026-08-01

- Force **5.1.0** across lab + kit firmwares, Sonoffs, Sync add-on, stubs, docs.
- Learn **Phase B** (opt-in): rate-limited HA→hub ladder wait bases only.
- Learning UI refresh (A+B), fleet version-status chip, coldest/hottest root sensors.
- Optional Learning **device cal**: L×W×H→m³ Apply helpers, multi-point fan CFM /
  SF1000 PPFD curves (`dsc_v4_device_cal`); live sensors stay % × nameplate until ≥2 points.
- Sync harden: `sync_esphome` default true, atomic stage + rollback, version/SHA marker,
  broader reloads, restart hint for new helpers.
- Notify via `input_text.dsc_notify_service`; door magnet UX; dead-demand / NO ACTUATOR cues.
- DSC-HUB Pro only (`dsc-hub-pro`); push updates all Sync-equipped HAOS (firmware still manual).

## v5.0.0

- First major cut: HAOS Sync add-on, automations package, YAML Lovelace `dsc-hub-pro`,
  hub firmware **5.0.0**, kit SoftAP path.
