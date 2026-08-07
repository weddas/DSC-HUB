#!/usr/bin/env python3
"""Probe product-by-id APIs and Livewire hydrate for cannareviews."""
from __future__ import annotations

import json
import re
import ssl
import urllib.request
from pathlib import Path
from urllib.error import HTTPError

UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)
CTX = ssl.create_default_context()
CACHE = Path(__file__).resolve().parents[1] / "homeassistant" / "data" / "_cache_cannareviews"


def fetch(url: str, *, data: bytes | None = None, headers: dict | None = None, maxb: int = 50000) -> tuple[int, bytes]:
    h = {"User-Agent": UA, "Accept": "*/*", "Referer": "https://cannareviews.health/"}
    if headers:
        h.update(headers)
    req = urllib.request.Request(url, data=data, headers=h, method="POST" if data is not None else "GET")
    try:
        with urllib.request.urlopen(req, timeout=60, context=CTX) as r:
            return getattr(r, "status", 200), r.read(maxb)
    except HTTPError as e:
        return e.code, e.read(maxb)


def main() -> None:
    # get csrf + livewire token from product page
    st, body = fetch("https://cannareviews.health/product/antg-eve-cbd16-flower-10g", maxb=200000)
    text = body.decode("utf-8", "replace")
    csrf = re.search(r'name="csrf-token"\s+content="([^"]+)"', text)
    lw = re.search(r"livewire_token\s*=\s*'([^']+)'", text)
    csrf_v = csrf.group(1) if csrf else ""
    lw_v = lw.group(1) if lw else ""
    print("csrf", bool(csrf_v), "lw", bool(lw_v))

    urls = []
    for pid in [15, 1, 100, 1000]:
        urls.extend(
            [
                f"https://cannareviews.health/api/v5.2.1/products/{pid}",
                f"https://cannareviews.health/api/product/{pid}",
                f"https://cannareviews.health/api/products/{pid}",
                f"https://cannareviews.health/api/v5.2.1/product/{pid}",
                f"https://cannareviews.health/api/v5.2.1/products/{pid}/reviews",
                f"https://cannareviews.health/api/v5.2.1/reviews?product_id={pid}",
                f"https://cannareviews.health/api/v5.2.1/products/{pid}/export",
            ]
        )
    urls.extend(
        [
            "https://cannareviews.health/api/v5.2.1/brands",
            "https://cannareviews.health/api/v5.2.1/brands/1",
            "https://cannareviews.health/api/v5.2.1/pharmacies",
            "https://cannareviews.health/api/v5.2.1/categories",
            "https://cannareviews.health/livewire/message/product-detail",
        ]
    )
    out = {}
    for url in urls:
        if "livewire/message" in url:
            continue
        st, body = fetch(url)
        head = body[:180].decode("utf-8", "replace").replace("\n", " ")
        print(st, url, head[:120])
        out[url] = {"status": st, "head": head}

    # Livewire message attempt: request fingerprint from page
    wi = re.search(r'wire:initial-data="([^"]+)"', text)
    if wi and lw_v:
        import html as htmlmod

        initial = json.loads(htmlmod.unescape(wi.group(1)))
        payload = {
            "fingerprint": initial["fingerprint"],
            "serverMemo": initial["serverMemo"],
            "updates": [],
        }
        raw = json.dumps(payload).encode("utf-8")
        st, body = fetch(
            "https://cannareviews.health/livewire/message/product-detail",
            data=raw,
            headers={
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrf_v or lw_v,
                "X-Livewire": "true",
            },
            maxb=200000,
        )
        print("LIVEWIRE", st, body[:300])
        (CACHE / "livewire_product_detail.json").write_bytes(body)
        out["livewire"] = {"status": st, "bytes": len(body)}

    (CACHE / "id_api_probe.json").write_text(json.dumps(out, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
