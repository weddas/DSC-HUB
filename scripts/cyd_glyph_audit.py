#!/usr/bin/env python3
"""cyd_glyph_audit.py — catch the "missing LVGL glyph" class of bug before flash.

Background: dsc-control-common.yaml's text fonts (f_title/f_big/f_med/f_body/
f_small) only bake the codepoints listed in cyd_glyphs.yaml. Any character used
on-screen that is *not* in that list draws as an empty box in LVGL — this has
already happened twice in this repo (see cyd_glyphs.yaml's own changelog: the
v4.0.2 em-dash bug and the v4.0.3 ellipsis/en-dash/arrow bug it documents).
This script is the regression gate for that class of bug.

What it checks
---------------
Parses firmware/v4/dsc-control-common.yaml as YAML (tags like !lambda/!include/
!secret are accepted as opaque scalars — we don't need their real behaviour,
just the string content) and walks every string value in the resulting tree:

  * Plain string values (any YAML scalar not under a `lambda:` key) are
    scanned character-by-character — this is what LVGL will draw verbatim,
    e.g. `text: "starting..."`.
  * Values under a `lambda:` key are treated as embedded C++: C++ comments
    (`//...`, `/*...*/`) are stripped first (comment text is never drawn),
    then every double-quoted C++ string literal is extracted (this is what
    covers snprintf format strings and plain string literals/assignments)
    and scanned the same way.

A character passes if it is:
  * ASCII (codepoint < 128), or
  * present in firmware/v4/cyd_glyphs.yaml (the shared text-font glyph set), or
  * an MDI icon codepoint — Material Design Icons live in the Supplementary
    Private Use Area (codepoint >= U+F0000, written in the YAML as a
    `\\U000Fxxxxxx`-style escape). Those glyphs are declared directly in the
    mdi_16/mdi_22 font blocks in dsc-control-common.yaml, not in
    cyd_glyphs.yaml, so this script allowlists the whole PUA-A range rather
    than cross-checking against that separate list (v1 heuristic — see
    scripts/README / task notes).

Anything else is a real, reproducible missing-glyph bug: exit 1 with a report
of every offending character, its codepoints, and where it was found.

Fix options when this fails: add the character to cyd_glyphs.yaml (if it's a
deliberate, meaningful glyph — e.g. a genuine em dash/range separator), or
replace it with an ASCII equivalent in dsc-control-common.yaml (e.g. "..." for
an ellipsis, "->" for an arrow). Either is acceptable; do whichever keeps the
UI honest without silently blanking a status line.
"""
import re
import sys
from pathlib import Path

import yaml

REPO_ROOT = Path(__file__).resolve().parent.parent
CONTROL_YAML = REPO_ROOT / "firmware" / "v4" / "dsc-control-common.yaml"
GLYPHS_YAML = REPO_ROOT / "firmware" / "v4" / "cyd_glyphs.yaml"

# Material Design Icons occupy the Supplementary Private Use Area-A
# (U+F0000-U+FFFFD) by convention (see dsc-control-common.yaml's font:
# section header comment: "Codepoints verified against @mdi/font"). Any
# character in this range is an icon glyph, not body text, and is declared
# directly in the mdi_16/mdi_22 `glyphs:` lists rather than cyd_glyphs.yaml.
MDI_PUA_START = 0xF0000

_CPP_COMMENT_RE = re.compile(r"//.*?$|/\*.*?\*/", re.MULTILINE | re.DOTALL)
_CPP_STRING_LITERAL_RE = re.compile(r'"((?:[^"\\]|\\.)*)"')


class _PermissiveLoader(yaml.SafeLoader):
    """Loads ESPHome YAML for *content*, not for ESPHome semantics.

    ESPHome files use custom tags (!lambda, !include, !secret, ...) that
    PyYAML doesn't know. We only need the string payload each tag wraps, so
    every unknown tag is treated as a transparent pass-through: scalars stay
    scalars, sequences stay sequences, mappings stay mappings. Anchors/
    aliases (&name / *name) are native YAML and PyYAML already handles them.
    """


def _passthrough(loader, _tag_suffix, node):
    if isinstance(node, yaml.ScalarNode):
        return loader.construct_scalar(node)
    if isinstance(node, yaml.SequenceNode):
        return loader.construct_sequence(node)
    if isinstance(node, yaml.MappingNode):
        return loader.construct_mapping(node)
    return None


_PermissiveLoader.add_multi_constructor("!", _passthrough)


def load_allowed_glyphs(path: Path) -> set:
    with path.open(encoding="utf-8") as f:
        glyphs = yaml.safe_load(f) or []
    allowed = set()
    for entry in glyphs:
        if not isinstance(entry, str) or len(entry) != 1:
            raise ValueError(
                f"{path}: expected a flat list of single-character strings, "
                f"got {entry!r}"
            )
        allowed.add(entry)
    for cp in range(128):
        allowed.add(chr(cp))
    return allowed


def cpp_string_literals(code: str):
    """Double-quoted C++ string literals in `code`, with comments stripped."""
    code_no_comments = _CPP_COMMENT_RE.sub("", code)
    return _CPP_STRING_LITERAL_RE.findall(code_no_comments)


def is_allowed(ch: str, allowed_glyphs: set) -> bool:
    if ch in allowed_glyphs:
        return True
    return ord(ch) >= MDI_PUA_START


def scan_string(s: str, ctx: str, allowed_glyphs: set, findings: dict):
    for ch in s:
        if is_allowed(ch, allowed_glyphs):
            continue
        findings.setdefault(ch, set()).add(ctx)


def walk(node, allowed_glyphs: set, findings: dict, parent_key=None, path=""):
    if isinstance(node, dict):
        for key, value in node.items():
            walk(value, allowed_glyphs, findings, key, f"{path}.{key}")
    elif isinstance(node, list):
        for i, value in enumerate(node):
            walk(value, allowed_glyphs, findings, parent_key, f"{path}[{i}]")
    elif isinstance(node, str):
        if parent_key == "lambda":
            for literal in cpp_string_literals(node):
                scan_string(literal, f"{path} (lambda string literal)", allowed_glyphs, findings)
        else:
            scan_string(node, path, allowed_glyphs, findings)


def main() -> int:
    if not CONTROL_YAML.exists():
        print(f"ERROR: {CONTROL_YAML} not found", file=sys.stderr)
        return 1
    if not GLYPHS_YAML.exists():
        print(f"ERROR: {GLYPHS_YAML} not found", file=sys.stderr)
        return 1

    allowed_glyphs = load_allowed_glyphs(GLYPHS_YAML)

    with CONTROL_YAML.open(encoding="utf-8") as f:
        data = yaml.load(f, Loader=_PermissiveLoader)

    findings: dict = {}
    walk(data, allowed_glyphs, findings)

    if not findings:
        print(f"cyd_glyph_audit: OK - every character in {CONTROL_YAML.name} "
              f"is ASCII, an MDI icon escape, or declared in {GLYPHS_YAML.name}.")
        return 0

    print(f"cyd_glyph_audit: FAIL - {len(findings)} character(s) missing from "
          f"{GLYPHS_YAML.name} (would draw as an empty LVGL box):\n")
    for ch, contexts in sorted(findings.items(), key=lambda kv: -len(kv[1])):
        # ascii()-style escape, not repr() — some terminals (Windows cp1252)
        # cannot print the raw offending character even to report it.
        safe_ch = ch.encode("unicode_escape").decode("ascii")
        print(f"  U+{ord(ch):04X} '{safe_ch}'  ({len(contexts)} occurrence(s))")
        for ctx in sorted(contexts)[:6]:
            print(f"      {ctx}")
        if len(contexts) > 6:
            print(f"      ... and {len(contexts) - 6} more")
    print(
        f"\nFix: add the missing character(s) to {GLYPHS_YAML.name} if they are "
        f"deliberate UI glyphs, or replace them with an ASCII equivalent in "
        f"{CONTROL_YAML.name} (e.g. \"...\" for an ellipsis, \"->\" for an arrow)."
    )
    return 1


if __name__ == "__main__":
    sys.exit(main())
