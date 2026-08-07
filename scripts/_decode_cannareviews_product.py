#!/usr/bin/env python3
"""Decode Livewire initial-data + JSON-LD from product sample."""
from __future__ import annotations

import html
import json
import re
from pathlib import Path

CACHE = Path(__file__).resolve().parents[1] / "homeassistant" / "data" / "_cache_cannareviews"
t = (CACHE / "product_sample.html").read_text(encoding="utf-8", errors="replace")

# JSON-LD Product blocks
for i, m in enumerate(re.finditer(r"<script[^>]*ld\+json[^>]*>(.*?)</script>", t, re.I | re.S)):
    raw = html.unescape(m.group(1).strip())
    try:
        data = json.loads(raw)
    except Exception as exc:
        print("jsonld fail", i, exc)
        continue
    path = CACHE / f"product_sample_jsonld_{i}.json"
    path.write_text(json.dumps(data, indent=2), encoding="utf-8")
    print("JSONLD", i, "type", data.get("@type") if isinstance(data, dict) else type(data), "->", path)
    if isinstance(data, dict) and data.get("@type") == "Product":
        print(" keys", list(data.keys()))
        print(" name", data.get("name"), "brand", data.get("brand"))
        print(" offers", data.get("offers"))
        print(" aggregateRating", data.get("aggregateRating"))
        print(" review count", len(data.get("review") or []) if isinstance(data.get("review"), list) else data.get("review"))

# wire initial
wi = re.search(r'wire:initial-data="([^"]+)"', t)
if wi:
    raw = html.unescape(wi.group(1))
    try:
        data = json.loads(raw)
    except Exception:
        # sometimes HTML entities double-encoded
        raw2 = html.unescape(raw)
        data = json.loads(raw2)
    (CACHE / "product_sample_wire.json").write_text(json.dumps(data, indent=2), encoding="utf-8")
    print("WIRE keys", list(data.keys()) if isinstance(data, dict) else type(data))
    # dive
    server = data.get("serverMemo") or data.get("memo") or {}
    print("serverMemo keys", list(server.keys()) if isinstance(server, dict) else None)
    data_memo = server.get("data") if isinstance(server, dict) else None
    if isinstance(data_memo, dict):
        print("data keys", list(data_memo.keys())[:40])
        for k in list(data_memo.keys())[:40]:
            v = data_memo[k]
            if isinstance(v, (dict, list)):
                print(f"  {k}: {type(v).__name__} len={len(v)}")
            else:
                print(f"  {k}: {v!r}"[:120])

# review blocks in HTML
reviews = re.findall(r'(?:reviewer|reviewed|patient)[^<]{0,80}', t, re.I)[:20]
print("review snippets", reviews[:10])
# stars
print("star svg", len(re.findall(r"star", t, re.I)))
