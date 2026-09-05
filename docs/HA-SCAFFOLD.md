# Home Assistant lab — retired

**Status:** Retired 2026-09. DSC-HUB is a **Pi-only** product (DSC-Brain + SPA on `:8787`).

HA packages, HACS `dist/`, Lovelace cards, Sync add-on (`dsc-hub-sync`), and the
HA custom panel build were removed from the tree. Do not reintroduce them as SoT.

What remains (and is intentional):

- **HA-shaped entity IDs and `call_service` domains** — implemented by the Pi brain
  (`hass_states`, `/control/service`), consumed by the SPA. This is an API dialect,
  not a Home Assistant dependency.
- Historical research under `docs/superpowers/research/*ha*` may still cite old
  package paths for archaeology.

Product docs: [`SETUP.md`](../SETUP.md), [`docs/DSC-BRAIN.md`](DSC-BRAIN.md), root [`README.md`](../README.md).
