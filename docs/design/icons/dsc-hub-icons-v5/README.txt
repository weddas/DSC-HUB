Cultivation Icon Set — DSC-HUB
================================
165 icons across 11 categories: Device, Environment, Value, Unit, Measurement,
Plant, Growth, Science, Tool, Place, UI.

Folders:
  svg-24/    24x24 SVG source, stroke="currentColor" (recolor by wrapping in
             an element with a CSS `color` set — these adapt to any theme).
  svg-256/   256x256 SVG masters, same currentColor convention.
  png-256-black-for-light-bg/   256x256 transparent PNG, black strokes — use
             on light backgrounds.
  png-256-white-for-dark-bg/    256x256 transparent PNG, white strokes — use
             on dark backgrounds.

If you're inlining SVGs directly into HTML/React/etc., use the svg-24 or
svg-256 files as-is — currentColor means you never need the black/white PNG
split; the icon just inherits whatever CSS color is set on its container or
an ancestor, light or dark theme included.

Full browsable reference with copy-to-clipboard: see the published gallery
artifact (link provided in chat).
