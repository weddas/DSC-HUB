#!/usr/bin/env python3
"""cyd_layout_check.py — static heuristic for accidental LVGL widget overlap.

Parses the `lvgl:` section of firmware/v4/dsc-control-common.yaml and flags
sibling label widgets that sit at the exact same position within the same
parent container — the shape of bug fixed in this repo before (see the
Connections-screen `pad_top`/`pad_bottom` squeeze comment in
dsc-control-common.yaml, v4.0.2: a title label and its sub-line label ended
up overlapping because the row was too short for both fonts).

Scope of "same position", deliberately: siblings under the *same immediate
parent widget*, not "anywhere on the page". LVGL x/y (and align) are always
relative to the immediate parent, so two labels that happen to share the same
(align, x, y) inside two *different* parent rows (e.g. every link row on the
Connections screen re-uses x:36,y:0 for its title, because each row is its
own small container at a different page-absolute y) are not actually
overlapping on screen. Comparing globally would make this check permanently,
falsely red on that exact reusable-row pattern — which defeats the point of
a gate that's supposed to catch *real* overlaps. Comparing only within each
container's own widget list catches the real bug class (two labels placed
directly on top of each other in the same box) without that false-positive
noise.

Regions scanned:
  * every entry in `lvgl.pages` (by its `id`)
  * every direct, `id`-bearing child of `lvgl.top_layer.widgets` (tabbar,
    alert_screen, conn_screen, ...) — these are independent modal/overlay
    regions, not part of any one page's widget tree.

Exit behaviour (v1, intentionally lenient outside the two gated regions):
  * Any duplicate found anywhere is printed as a warning.
  * Exit 0 unless a duplicate was found in `page_boot` or the Connections
    region (`conn_screen`) — those two are hard-gated per the task spec,
    since a boot-screen or Connections-screen overlap is the most visible
    possible glass regression.
"""
import sys
from pathlib import Path

import yaml

REPO_ROOT = Path(__file__).resolve().parent.parent
CONTROL_YAML = REPO_ROOT / "firmware" / "v4" / "dsc-control-common.yaml"

# Regions where an exact overlap is a hard failure, not just a warning.
# conn_screen is displayed to the user as "Connections" (its on-glass title).
GATED_REGIONS = {"page_boot": "page_boot", "conn_screen": "Connections"}


class _PermissiveLoader(yaml.SafeLoader):
    pass


def _passthrough(loader, _tag_suffix, node):
    if isinstance(node, yaml.ScalarNode):
        return loader.construct_scalar(node)
    if isinstance(node, yaml.SequenceNode):
        return loader.construct_sequence(node)
    if isinstance(node, yaml.MappingNode):
        return loader.construct_mapping(node)
    return None


_PermissiveLoader.add_multi_constructor("!", _passthrough)


def _norm(v):
    """Normalize a position value (int, float, or !lambda string) for keying."""
    return str(v)


def scan_container(widgets, region: str, path: str, warnings: list):
    """Flag same-(align,x,y) sibling `label` widgets directly inside `widgets`.

    Recurses into every nested container's own `widgets:` list as an
    independent sibling scope (see module docstring for why).
    """
    if not isinstance(widgets, list):
        return
    seen: dict = {}
    for idx, item in enumerate(widgets):
        if not isinstance(item, dict):
            continue
        for wtype, cfg in item.items():
            if not isinstance(cfg, dict):
                continue
            wpath = f"{path}[{idx}].{wtype}"
            if wtype == "label" and "x" in cfg and "y" in cfg:
                key = (cfg.get("align"), _norm(cfg["x"]), _norm(cfg["y"]))
                seen.setdefault(key, []).append(
                    {"path": wpath, "id": cfg.get("id"), "text": cfg.get("text")}
                )
            nested = cfg.get("widgets")
            if isinstance(nested, list):
                scan_container(nested, region, f"{wpath}.widgets", warnings)

    for key, entries in seen.items():
        if len(entries) > 1:
            warnings.append({"region": region, "container": path, "key": key, "entries": entries})


def collect_regions(data: dict):
    """Yield (region_name, widgets_list, path) for every scannable region."""
    lvgl = data.get("lvgl") or {}
    for i, page in enumerate(lvgl.get("pages") or []):
        if isinstance(page, dict):
            yield page.get("id", f"page[{i}]"), page.get("widgets") or [], f".lvgl.pages[{i}].widgets"

    top_layer = lvgl.get("top_layer") or {}
    for i, item in enumerate(top_layer.get("widgets") or []):
        if not isinstance(item, dict):
            continue
        for wtype, cfg in item.items():
            if isinstance(cfg, dict) and cfg.get("id"):
                yield cfg["id"], cfg.get("widgets") or [], f".lvgl.top_layer.widgets[{i}].{wtype}.widgets"


def main() -> int:
    if not CONTROL_YAML.exists():
        print(f"ERROR: {CONTROL_YAML} not found", file=sys.stderr)
        return 1

    with CONTROL_YAML.open(encoding="utf-8") as f:
        data = yaml.load(f, Loader=_PermissiveLoader)

    warnings: list = []
    region_count = 0
    for region, widgets, path in collect_regions(data):
        region_count += 1
        scan_container(widgets, region, path, warnings)

    if not warnings:
        print(f"cyd_layout_check: OK - no same-position sibling labels found "
              f"across {region_count} region(s).")
        return 0

    gated_hit = False
    print(f"cyd_layout_check: {len(warnings)} same-position sibling label "
          f"group(s) found:\n")
    for w in warnings:
        align, x, y = w["key"]
        is_gated = w["region"] in GATED_REGIONS
        gated_hit = gated_hit or is_gated
        severity = "FAIL" if is_gated else "warn"
        region_label = GATED_REGIONS.get(w["region"], w["region"])
        print(f"  [{severity}] region={region_label!r} container={w['container']}")
        print(f"          align={align} x={x} y={y}")
        for e in w["entries"]:
            print(f"          - {e['path']} id={e['id']!r} text={e['text']!r}")
        print()

    if gated_hit:
        print("cyd_layout_check: FAIL - exact same (align,x,y) duplicate label(s) "
              "in page_boot or Connections (see [FAIL] above).")
        return 1

    print("cyd_layout_check: OK (warnings only, v1 - no gated region affected).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
