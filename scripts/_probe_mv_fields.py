#!/usr/bin/env python3
"""Extract structured fields from Multiverse sample HTML."""

from __future__ import annotations

import html as html_lib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "homeassistant" / "data" / "_probe_mv_sample.html").read_text(encoding="utf-8")


def clean(s: str) -> str:
    t = re.sub(r"(?is)<[^>]+>", " ", s or "")
    return re.sub(r"\s+", " ", html_lib.unescape(t)).strip()


def main() -> int:
    out: dict = {}
    products = []
    for m in re.finditer(
        r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
        HTML,
        re.I | re.S,
    ):
        try:
            doc = json.loads(m.group(1))
        except json.JSONDecodeError:
            continue
        docs = doc if isinstance(doc, list) else [doc]
        for d in docs:
            if isinstance(d, dict) and "Product" in str(d.get("@type")):
                products.append(d)
            elif isinstance(d, dict) and "@graph" in d:
                for g in d["@graph"]:
                    if isinstance(g, dict) and "Product" in str(g.get("@type")):
                        products.append(g)
    out["product_count"] = len(products)
    if products:
        p = products[0]
        out["product"] = {
            k: p.get(k)
            for k in (
                "name",
                "sku",
                "brand",
                "description",
                "category",
                "gtin13",
                "mpn",
                "image",
            )
        }
        offers = p.get("offers")
        if isinstance(offers, dict):
            out["offers"] = {k: offers.get(k) for k in ("price", "priceCurrency", "availability", "url")}
        elif isinstance(offers, list) and offers:
            out["offers"] = offers[0]

    m = re.search(
        r'class=["\'][^"\']*product_title[^"\']*["\'][^>]*>(.*?)</h1>',
        HTML,
        re.I | re.S,
    )
    out["h1"] = clean(m.group(1)) if m else None

    m = re.search(
        r'class=["\'][^"\']*woocommerce-product-details__short-description[^"\']*["\'][^>]*>(.*?)</div>',
        HTML,
        re.I | re.S,
    )
    out["short"] = clean(m.group(1))[:800] if m else None

    cats = re.findall(
        r'href=["\']([^"\']*product-category[^"\']*)["\'][^>]*>([^<]+)<',
        HTML,
        re.I,
    )
    out["cats"] = [(a, b.strip()) for a, b in cats][:30]

    attrs = []
    for m in re.finditer(
        r'<tr[^>]*class=["\'][^"\']*woocommerce-product-attributes-item[^"\']*["\'][^>]*>(.*?)</tr>',
        HTML,
        re.I | re.S,
    ):
        row = m.group(1)
        th = re.search(r"<th[^>]*>(.*?)</th>", row, re.I | re.S)
        td = re.search(r"<td[^>]*>(.*?)</td>", row, re.I | re.S)
        if th and td:
            attrs.append({"label": clean(th.group(1)), "value": clean(td.group(1))[:300]})
    out["attrs"] = attrs

    m = re.search(r'id=["\']tab-description["\'][^>]*>(.*?)</div>\s*(?:<div|</)', HTML, re.I | re.S)
    out["desc"] = clean(m.group(1))[:1000] if m else None

    # variations
    vm = re.search(r"data-product_variations=(['\"])(.*?)\1", HTML, re.I | re.S)
    if vm:
        try:
            vars_ = json.loads(html_lib.unescape(vm.group(2)))
            out["variation_count"] = len(vars_) if isinstance(vars_, list) else None
            if isinstance(vars_, list) and vars_:
                out["variation0_keys"] = sorted(vars_[0].keys())
                out["variation0"] = {
                    k: vars_[0].get(k)
                    for k in ("sku", "display_price", "attributes", "is_in_stock", "variation_id")
                }
        except Exception as exc:  # noqa: BLE001
            out["variation_error"] = str(exc)

    path = ROOT / "homeassistant" / "data" / "_probe_mv_fields.json"
    path.write_text(json.dumps(out, indent=2), encoding="utf-8")
    print(json.dumps(out, indent=2)[:4000])
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
