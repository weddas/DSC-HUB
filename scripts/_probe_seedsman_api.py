#!/usr/bin/env python3
"""Probe Seedsman ScandiPWA GraphQL / Magento REST for product payloads."""

from __future__ import annotations

import json
import ssl
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "homeassistant" / "data"
CTX = ssl.create_default_context()
UA = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept": "application/json, text/plain, */*",
    "Content-Type": "application/json",
    "Origin": "https://www.seedsman.com",
    "Referer": "https://www.seedsman.com/us-en/medicine-man-regular-seeds-18-mrnmm",
    "Store": "us",
}

SLUG = "medicine-man-regular-seeds-18-mrnmm"


def post_gql(query: str, variables: dict | None = None, store: str = "us") -> tuple[int | None, object]:
    headers = dict(UA)
    headers["Store"] = store
    body = json.dumps({"query": query, "variables": variables or {}}).encode()
    req = urllib.request.Request(
        "https://www.seedsman.com/graphql",
        data=body,
        headers=headers,
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=60, context=CTX) as r:
            return r.status, json.loads(r.read().decode("utf-8", "replace"))
    except urllib.error.HTTPError as e:
        raw = e.read().decode("utf-8", "replace") if e.fp else ""
        try:
            return e.code, json.loads(raw)
        except json.JSONDecodeError:
            return e.code, raw[:500]
    except Exception as exc:  # noqa: BLE001
        return None, str(exc)


def get(url: str) -> tuple[int | None, str]:
    req = urllib.request.Request(url, headers={k: v for k, v in UA.items() if k != "Content-Type"})
    try:
        with urllib.request.urlopen(req, timeout=60, context=CTX) as r:
            return r.status, r.read(200_000).decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        return e.code, (e.read(50_000).decode("utf-8", "replace") if e.fp else "")
    except Exception as exc:  # noqa: BLE001
        return None, str(exc)


def main() -> None:
    queries = [
        (
            "urlResolver",
            """
            query($url: String!) {
              urlResolver(url: $url) { id type sku relative_url }
            }
            """,
            {"url": f"{SLUG}"},
        ),
        (
            "urlResolver_path",
            """
            query($url: String!) {
              urlResolver(url: $url) { id type sku relative_url }
            }
            """,
            {"url": f"/us-en/{SLUG}"},
        ),
        (
            "products_url_key",
            """
            query($key: String!) {
              products(filter: { url_key: { eq: $key } }) {
                items {
                  id sku name url_key type_id
                  description { html }
                  short_description { html }
                  ... on ConfigurableProduct {
                    variants { product { sku name } }
                  }
                }
              }
            }
            """,
            {"key": SLUG},
        ),
        (
            "product_detail",
            """
            query($key: String!) {
              products(filter: { url_key: { eq: $key } }) {
                items {
                  id sku name url_key
                  meta_title meta_description
                  price_range { minimum_price { regular_price { value currency } } }
                  categories { name url_path }
                  media_gallery { url label }
                  description { html }
                  short_description { html }
                  attributes: custom_attributes { attribute_code value }
                }
              }
            }
            """,
            {"key": SLUG},
        ),
        (
            "scandi_product",
            """
            query Product($urlKey: String!) {
              product(url_key: $urlKey) {
                id sku name url_key
              }
            }
            """,
            {"urlKey": SLUG},
        ),
    ]

    results = {}
    for name, q, vars_ in queries:
        code, data = post_gql(q, vars_)
        print(f"\n=== {name} http={code}")
        print(json.dumps(data, ensure_ascii=False)[:1200])
        results[name] = {"http": code, "data": data}

    # Magento REST probes
    rest_urls = [
        f"https://www.seedsman.com/rest/us/V1/products/{SLUG}",
        f"https://www.seedsman.com/rest/V1/products/{SLUG}",
        f"https://www.seedsman.com/rest/us/V1/products?searchCriteria[filterGroups][0][filters][0][field]=url_key&searchCriteria[filterGroups][0][filters][0][value]={SLUG}&searchCriteria[filterGroups][0][filters][0][conditionType]=eq",
        "https://www.seedsman.com/graphql?query=%7B__typename%7D",
    ]
    for u in rest_urls:
        code, body = get(u)
        print(f"\n=== REST {code} {u[:100]}")
        print(body[:500])
        results[u[:80]] = {"http": code, "body": body[:2000]}

    out = DATA / "_probe_seedsman_api.json"
    out.write_text(json.dumps(results, ensure_ascii=False, indent=1, default=str), encoding="utf-8")
    print(f"\nwrote {out}")


if __name__ == "__main__":
    main()
