# Assist / MCP exposure (I-25)

The React panel `/dsc-hub` is an operator surface. **Do not silently expose the house** to HA Assist, Voice, or MCP live context.

## How to expose (opt-in)

1. In Home Assistant: **Settings → Voice assistants → Expose**.
2. Expose **only** the DSC entities an operator wants in chat (`sensor.dsc_*`, `binary_sensor.dsc_hub_link`, selected `input_boolean.dsc_*` kit gates).
3. Leave room/house entities, cameras, locks, and non-DSC helpers unexposed.
4. MCP / Assist live context uses that expose list. A Cursor MCP Home Assistant server will see whatever HA already exposes — DSC-HUB does not auto-register entities into Assist.

## What this repo does **not** do

- No `conversation.expose` / default_config dump of every `dsc_*` id.
- No MCP tool that lists unpublished house state.
