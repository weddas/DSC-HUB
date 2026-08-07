#!/usr/bin/env python3
"""Peek one AllBud strain page for scrape field mapping."""

from __future__ import annotations

import json
import re
import ssl
from pathlib import Path
from urllib.request import Request, urlopen

UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)
CTX = ssl.create_default_context()
OUT = Path(__file__).resolve().parents[1] / "homeassistant" / "data" / "_allbud_sample.html"
URL = "https://www.allbud.com/marijuana-strains/hybrid/100-og"


def main() -> int:
    req = Request(URL, headers={"User-Agent": UA, "Accept": "text/html"})
    with urlopen(req, timeout=45, context=CTX) as resp:
        body = resp.read().decode("utf-8", "replace")
        status = resp.status
    OUT.write_text(body, encoding="utf-8")
    print(f"status={status} len={len(body)} saved={OUT}")

    title = re.search(r"<title[^>]*>(.*?)</title>", body, re.I | re.S)
    print("title:", re.sub(r"\s+", " ", title.group(1)).strip()[:200] if title else None)
    h1 = re.search(r"<h1[^>]*>(.*?)</h1>", body, re.I | re.S)
    print("h1:", re.sub(r"<[^>]+>", "", h1.group(1)).strip()[:200] if h1 else None)

    for i, m in enumerate(
        re.finditer(
            r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
            body,
            re.I | re.S,
        )
    ):
        raw = m.group(1).strip()
        print(f"ld+json[{i}] chars={len(raw)}")
        try:
            print(json.dumps(json.loads(raw), indent=2)[:1200])
        except Exception as exc:  # noqa: BLE001
            print("parse fail", exc, raw[:400])

    # class/id hints
    classes = sorted(set(re.findall(r'class=["\']([^"\']+)["\']', body)))
    interesting = [
        c
        for c in classes
        if re.search(r"effect|flavor|aroma|taste|thc|cbd|strain|symptom|percent|desc", c, re.I)
    ]
    print("interesting classes:", interesting[:40])

    # text snippets around THC / effects
    for label, pat in [
        ("THC%", r"(?i).{0,40}THC.{0,60}"),
        ("CBD%", r"(?i).{0,40}CBD.{0,60}"),
        ("Effects", r"(?i).{0,20}Effects?.{0,80}"),
        ("Flavors", r"(?i).{0,20}(?:Flavor|Taste|Aroma)s?.{0,80}"),
    ]:
        m = re.search(pat, re.sub(r"<[^>]+>", " ", body))
        if m:
            print(label, ":", re.sub(r"\s+", " ", m.group(0)).strip()[:160])

    # data attributes / json blobs
    for m in re.finditer(r"<script[^>]*>(.*?)</script>", body, re.I | re.S):
        chunk = m.group(1)
        if "thc" in chunk.lower() and ("strain" in chunk.lower() or "effect" in chunk.lower()):
            if len(chunk) < 8000:
                print("--- script blob ---")
                print(chunk[:2000])
            else:
                print(f"--- large script blob {len(chunk)} ---")
                # find object-ish
                for key in ("effects", "flavors", "thc", "cbd", "aromas", "tastes"):
                    idx = chunk.lower().find(key)
                    if idx >= 0:
                        print(key, chunk[max(0, idx - 40) : idx + 200])
            break
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
