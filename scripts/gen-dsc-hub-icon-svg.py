"""Generate frontend/src/iconSvg.ts from www/assets SVGs."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(r"Y:\Digital Stealth Care\Projects\DSC-HUB")
ASSETS = ROOT / "homeassistant/custom_components/dsc_hub/www/assets"
OUT = ROOT / "homeassistant/custom_components/dsc_hub/frontend/src/iconSvg.ts"

ICONS = {
    "live": "icons/dsc-icon-ops.svg",
    "grow": "icons/dsc-icon-plant.svg",
    "tune": "icons/dsc-icon-advanced.svg",
    "fleet": "icons/dsc-icon-system.svg",
    "mission": "icons/dsc-icon-home.svg",
    "twin": "icons/dsc-icon-dash.svg",
    "climate": "icons/dsc-icon-climate.svg",
    "root": "icons/dsc-icon-root.svg",
    "lighting": "icons/dsc-icon-lighting.svg",
    "tent": "icons/dsc-icon-tent.svg",
    "clone": "icons/dsc-icon-clone.svg",
    "tank": "icons/dsc-icon-tank.svg",
    "seat": "icons/dsc-icon-seat.svg",
    "compose": "icons/dsc-icon-build.svg",
    "research": "icons/dsc-icon-catalog.svg",
    "roster": "icons/dsc-icon-strains.svg",
    "nutrient": "icons/dsc-icon-nutrient.svg",
    "learning": "icons/dsc-icon-learning.svg",
    "analytics": "icons/dsc-icon-trends.svg",
    "history": "icons/dsc-icon-history.svg",
    "alert": "icons/dsc-icon-alert.svg",
    "ok": "icons/dsc-icon-ok.svg",
    "settings": "icons/dsc-icon-settings.svg",
    "brand": "brand/dsc-brand-mark.svg",
    "wordmark": "brand/dsc-brand-wordmark.svg",
    "gauge": "gauges/dsc-gauge-arc.svg",
    "more": "icons/dsc-icon-more.svg",
    "search": "icons/dsc-icon-search.svg",
    "close": "icons/dsc-icon-close.svg",
    "ops": "icons/dsc-icon-ops.svg",
    "plant": "icons/dsc-icon-plant.svg",
    "advanced": "icons/dsc-icon-advanced.svg",
    "system": "icons/dsc-icon-system.svg",
    "home": "icons/dsc-icon-home.svg",
    "dash": "icons/dsc-icon-dash.svg",
    "build": "icons/dsc-icon-build.svg",
    "catalog": "icons/dsc-icon-catalog.svg",
    "strains": "icons/dsc-icon-strains.svg",
    "trends": "icons/dsc-icon-trends.svg",
}


def normalize(svg: str) -> str:
    svg = svg.lstrip("\ufeff").strip()

    def fix_root(match: re.Match[str]) -> str:
        tag = match.group(0)
        # Only root SVG width/height — never stroke-width / child attrs.
        if re.search(r'(?<![-\w])width="', tag):
            tag = re.sub(r'(?<![-\w])width="[^"]*"', 'width="100%"', tag, count=1)
        else:
            tag = tag[:-1] + ' width="100%"' + ">"
        if re.search(r'(?<![-\w])height="', tag):
            tag = re.sub(r'(?<![-\w])height="[^"]*"', 'height="100%"', tag, count=1)
        else:
            tag = tag[:-1] + ' height="100%"' + ">"
        return tag

    svg = re.sub(r"<svg\b[^>]*>", fix_root, svg, count=1)
    return svg


def main() -> None:
    lines = [
        "/** Auto-generated inline SVG bodies for panel icons (no /dsc_hub/assets fetch). */",
        "/* eslint-disable */",
        "export const ICON_SVG = {",
    ]
    for name, rel in ICONS.items():
        path = ASSETS / rel
        if not path.exists():
            raise SystemExit(f"missing {path}")
        raw = normalize(path.read_text(encoding="utf-8"))
        if 'stroke-width="100%"' in raw:
            raise SystemExit(f"mangled stroke-width in {name}")
        if re.search(r'<(rect|path|circle)[^>]*\bwidth="100%"', raw):
            raise SystemExit(f"mangled child width in {name}")
        lines.append(f"  {json.dumps(name)}: {json.dumps(raw)},")
    lines.append("} as const;")
    lines.append("")
    lines.append("export type IconName = keyof typeof ICON_SVG;")
    lines.append("")
    OUT.write_text("\n".join(lines) + "\n", encoding="utf-8")
    live = normalize((ASSETS / ICONS["live"]).read_text(encoding="utf-8"))
    print(f"wrote {OUT} ({OUT.stat().st_size} bytes, {len(ICONS)} icons)")
    print("live root:", live.split(">", 1)[0] + ">")
    print("has stroke-width 1.75:", 'stroke-width="1.75"' in live)


if __name__ == "__main__":
    main()
