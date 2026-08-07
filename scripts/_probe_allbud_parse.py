#!/usr/bin/env python3
"""Parse AllBud sample HTML for field extractors."""

from __future__ import annotations

import html as html_lib
import re
from pathlib import Path

BODY = Path(__file__).resolve().parents[1] / "homeassistant" / "data" / "_allbud_sample.html"


def strip_tags(s: str) -> str:
    t = re.sub(r"(?is)<script.*?</script>", " ", s or "")
    t = re.sub(r"(?is)<style.*?</style>", " ", t)
    t = re.sub(r"(?is)<[^>]+>", " ", t)
    return re.sub(r"\s+", " ", html_lib.unescape(t)).strip()


def main() -> int:
    body = BODY.read_text(encoding="utf-8")
    for sid in (
        "positive-effects",
        "negative-effects",
        "relieved",
        "flavors",
        "aromas",
        "symptoms",
        "strain-percentages",
        "description",
    ):
        print("id", sid, f'id="{sid}"' in body)

    m = re.search(r'class="[^"]*strain-percentages[^"]*".{0,2000}', body, re.I | re.S)
    if m:
        print("PERCENT:", strip_tags(m.group(0))[:400])

    for label in ("positive-effects", "negative-effects", "relieved", "flavors", "aromas"):
        m = re.search(rf'id="{label}"(.*?)(?=id="[a-z-]|"|$)', body, re.I | re.S)
        if not m:
            print(label, "MISSING")
            continue
        chunk = m.group(1)[:4000]
        links = re.findall(r">([A-Za-z][A-Za-z0-9 \-/&']{1,40})</a>", chunk)
        print(label, "->", links[:25])

    m = re.search(r'class="[^"]*panel-body[^"]*description[^"]*"[^>]*>(.*?)</div>', body, re.I | re.S)
    if m:
        print("DESC:", strip_tags(m.group(1))[:500])

    # variety-percentage
    for m in re.finditer(
        r'variety-percentage-wrap.*?percentage[^>]*>\s*(\d+)\s*%.*?>(Indica|Sativa|Ruderalis)',
        body,
        re.I | re.S,
    ):
        print("var_pct", m.group(2), m.group(1))

    # simpler: look near strain-properties
    m = re.search(r'class="[^"]*strain-properties[^"]*"(.*?)</aside>|class="[^"]*strain-properties[^"]*"(.*?)</div>\s*</div>\s*</div>', body, re.I | re.S)
    if m:
        chunk = m.group(1) or m.group(2) or ""
        print("PROPS:", strip_tags(chunk)[:600])

    # Find THC level text
    for m in re.finditer(r"(High|Medium|Low)\s+THC|THC\s+(High|Medium|Low)|THC\s*[:=]?\s*([\d.]+)\s*%", body, re.I):
        print("THC hit:", strip_tags(m.group(0)))

    # rating from ld+json already known
    # Find list links pattern for effects pages
    for m in re.finditer(
        r'href="(/marijuana-strains/(?:effect|symptom|aroma|taste)/[^"]+)"[^>]*>([^<]+)<',
        body,
        re.I,
    ):
        print("tax", m.group(1), "=>", m.group(2).strip())

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
