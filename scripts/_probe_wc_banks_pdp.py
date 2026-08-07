#!/usr/bin/env python3
"""Probe Multiverse Beans + Weed Seeds Express sitemaps and sample PDPs."""

from __future__ import annotations

import json
import re
import ssl
import urllib.request
from pathlib import Path

UA = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )
}
CTX = ssl.create_default_context()
OUT = Path(__file__).resolve().parents[1] / "homeassistant" / "data" / "_probe_wc_banks_pdp.json"


def grab(url: str, n: int = 3_000_000) -> tuple[int | None, str, str]:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=45, context=CTX) as r:
        return r.status, r.geturl(), r.read(n).decode("utf-8", "replace")


def locs(body: str) -> list[str]:
    return re.findall(r"<loc>([^<]+)</loc>", body or "")


def clean(html: str) -> str:
    t = re.sub(r"(?is)<script.*?</script>", " ", html or "")
    t = re.sub(r"(?is)<style.*?</style>", " ", t)
    t = re.sub(r"(?is)<[^>]+>", " ", t)
    return re.sub(r"\s+", " ", t).strip()


def extract_json_ld(html: str) -> list[dict]:
    out: list[dict] = []
    for m in re.finditer(
        r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
        html or "",
        re.I | re.S,
    ):
        try:
            doc = json.loads(m.group(1))
        except json.JSONDecodeError:
            continue
        if isinstance(doc, list):
            out.extend(x for x in doc if isinstance(x, dict))
        elif isinstance(doc, dict):
            out.append(doc)
    return out


def attrs(html: str) -> list[dict]:
    found = []
    for m in re.finditer(
        r'woocommerce-product-attributes-item--([a-z0-9\-]+)[^>]*>'
        r".*?<th[^>]*>(.*?)</th>.*?<td[^>]*>(.*?)</td>",
        html or "",
        re.I | re.S,
    ):
        found.append(
            {
                "key": m.group(1),
                "label": clean(m.group(2)),
                "value": clean(m.group(3))[:300],
            }
        )
    return found


def main() -> int:
    report: dict = {"banks": {}}

    # --- Multiverse ---
    st, fin, body = grab("https://multiversebeans.com/sitemap_index.xml")
    idx = locs(body)
    mv_prods: set[str] = set()
    mv_sitemaps = []
    for u in idx:
        if "product-sitemap" not in u:
            continue
        try:
            _, _, b = grab(u)
            ps = [x.rstrip("/") for x in locs(b) if "/product/" in x]
            mv_prods.update(ps)
            mv_sitemaps.append({"url": u, "products": len(ps)})
        except Exception as exc:  # noqa: BLE001
            mv_sitemaps.append({"url": u, "error": str(exc)})
    report["banks"]["multiverse"] = {
        "index_status": st,
        "index_final": fin,
        "product_sitemaps": mv_sitemaps,
        "unique_products": len(mv_prods),
        "sample": sorted(mv_prods)[:5],
    }

    # --- WSE ---
    wse = {}
    for label, url in [
        ("en", "https://weedseedsexpress.com/sitemap-en.xml"),
        ("us", "https://weedseedsexpress.com/us/sitemap-us.xml"),
        ("au", "https://weedseedsexpress.com/au/sitemap-au.xml"),
        ("root", "https://weedseedsexpress.com/sitemap.xml"),
    ]:
        try:
            st2, fin2, b2 = grab(url)
            all_locs = locs(b2)
            ps = [x.rstrip("/") for x in all_locs if "/product/" in x]
            wse[label] = {
                "status": st2,
                "final": fin2,
                "locs": len(all_locs),
                "products": len(ps),
                "sample": ps[:5],
            }
        except Exception as exc:  # noqa: BLE001
            wse[label] = {"error": str(exc)}
    report["banks"]["weedseedsexpress"] = wse

    # PDP samples
    samples = {}
    for label, url in [
        (
            "multiverse",
            "https://multiversebeans.com/product/in-house-genetics-platinum-float-strain-fem-photo/",
        ),
        ("wse", "https://weedseedsexpress.com/product/ak-47-autoflower-seeds"),
    ]:
        st3, fin3, html = grab(url, n=500_000)
        products = [
            b
            for b in extract_json_ld(html)
            if "Product" in str(b.get("@type"))
        ]
        samples[label] = {
            "status": st3,
            "final": fin3,
            "html_len": len(html),
            "h1": (re.search(r"<h1[^>]*>(.*?)</h1>", html, re.I | re.S) or [None, ""])[1][:200]
            if False
            else clean((re.search(r"<h1[^>]*>(.*?)</h1>", html, re.I | re.S) or type("X", (), {"group": lambda s, n: ""})()).group(1) if re.search(r"<h1[^>]*>(.*?)</h1>", html, re.I | re.S) else ""),
            "json_ld_product_count": len(products),
            "product_name": products[0].get("name") if products else None,
            "brand": products[0].get("brand") if products else None,
            "sku": products[0].get("sku") if products else None,
            "description_excerpt": str((products[0].get("description") if products else "") or "")[:400],
            "attrs": attrs(html)[:20],
            "has_woocommerce": "woocommerce" in html.lower(),
            "text_excerpt": clean(html)[:800],
        }
        # fix h1 properly
        m = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.I | re.S)
        samples[label]["h1"] = clean(m.group(1)) if m else None
        # categories
        cats = re.findall(
            r'href=["\'][^"\']*product[_-](?:cat|category|tag)[^"\']*["\'][^>]*>([^<]+)<',
            html,
            re.I,
        )
        samples[label]["category_labels"] = [clean(c) for c in cats][:20]
        # variation / form data
        samples[label]["has_variations"] = "product_variations" in html or "data-product_variations" in html
        vm = re.search(r'data-product_variations="([^"]+)"', html)
        if vm:
            try:
                import html as html_lib

                raw = html_lib.unescape(vm.group(1))
                vars_ = json.loads(raw)
                samples[label]["variation_count"] = len(vars_) if isinstance(vars_, list) else None
                if isinstance(vars_, list) and vars_:
                    samples[label]["variation_sample_keys"] = sorted(vars_[0].keys())[:30]
            except Exception as exc:  # noqa: BLE001
                samples[label]["variation_parse_error"] = str(exc)

    report["samples"] = samples
    OUT.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(json.dumps(
        {
            "mv_unique": report["banks"]["multiverse"]["unique_products"],
            "mv_sitemaps": report["banks"]["multiverse"]["product_sitemaps"],
            "wse": {k: {kk: vv for kk, vv in v.items() if kk != "sample"} for k, v in wse.items()},
            "sample_names": {k: v.get("product_name") or v.get("h1") for k, v in samples.items()},
            "sample_attr_counts": {k: len(v.get("attrs") or []) for k, v in samples.items()},
            "out": str(OUT),
        },
        indent=2,
    ))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
