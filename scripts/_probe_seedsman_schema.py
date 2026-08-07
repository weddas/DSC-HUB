#!/usr/bin/env python3
"""Map Seedsman GraphQL product schema + correct product fetch path."""

from __future__ import annotations

import json
import ssl
import urllib.error
import urllib.request
from pathlib import Path

CTX = ssl.create_default_context()
DATA = Path(__file__).resolve().parents[1] / "homeassistant" / "data"
UA = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Origin": "https://www.seedsman.com",
    "Referer": "https://www.seedsman.com/us-en/",
    "Store": "us",
}

SLUG = "medicine-man-regular-seeds-18-mrnmm"
SKU = "MRNMM"


def gql(query: str, variables: dict | None = None, store: str = "us"):
    headers = dict(UA)
    headers["Store"] = store
    body = json.dumps({"query": query, "variables": variables or {}}).encode()
    req = urllib.request.Request(
        "https://www.seedsman.com/graphql", data=body, headers=headers, method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=90, context=CTX) as r:
            return r.status, json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        raw = e.read().decode() if e.fp else ""
        try:
            return e.code, json.loads(raw)
        except json.JSONDecodeError:
            return e.code, raw[:800]


def main() -> None:
    # 1) introspect ProductInterface fields (names only)
    code, data = gql(
        """
        query {
          __type(name: "ProductInterface") {
            fields { name type { kind name ofType { kind name } } }
          }
        }
        """
    )
    fields = ((data.get("data") or {}).get("__type") or {}).get("fields") or []
    names = sorted(f["name"] for f in fields)
    print("ProductInterface fields", len(names))
    for n in names:
        print(" ", n)

    # 2) fetch by sku
    for label, filt, vars_ in [
        ("sku", "{ sku: { eq: $v } }", {"v": SKU}),
        ("url_key", "{ url_key: { eq: $v } }", {"v": SLUG}),
        ("entity_id", "{ entity_id: { eq: $v } }", {"v": "16439"}),
    ]:
        q = f"""
        query($v: String!) {{
          products(filter: {filt}) {{
            total_count
            items {{
              id sku name url_key type_id stock_status
              description {{ html }}
              short_description {{ html }}
              meta_title meta_keyword meta_description
              categories {{ name url_path }}
              media_gallery {{ url label disabled }}
              price_range {{
                minimum_price {{
                  regular_price {{ value currency }}
                  final_price {{ value currency }}
                }}
              }}
            }}
          }}
        }}
        """
        c, d = gql(q, vars_)
        items = (((d.get("data") or {}).get("products") or {}).get("items")) or []
        print(f"\n=== filter {label} http={c} total={((d.get('data') or {}).get('products') or {}).get('total_count')} n={len(items)}")
        if items:
            print(json.dumps(items[0], ensure_ascii=False)[:900])
        elif d.get("errors"):
            print(d["errors"])

    # 3) try attribute-like fields common on ScandiPWA
    attr_candidates = [
        "thc", "cbd", "flowering_time", "flowering", "yield", "yield_indoor",
        "breeder", "seed_bank", "genetics", "genotype", "indica", "sativa",
        "seed_type", "sex", "height", "grow_difficulty", "effect", "flavour",
        "flavor", "aroma", "medical", "cannabinoids", "attributes",
        "s_attributes", "amasty_custom_attributes", "customAttributeMetadata",
        "mpn", "gtin", "brand", "manufacturer", "country_of_manufacture",
        "rating_summary", "review_count", "options", "configurable_options",
    ]
    present = set(names)
    print("\nattr candidates present:", [a for a in attr_candidates if a in present])

    # 4) customAttributeMetadata query
    c, d = gql(
        """
        {
          customAttributeMetadata(attributes: [
            {attribute_code: "thc", entity_type: "catalog_product"},
            {attribute_code: "cbd", entity_type: "catalog_product"},
            {attribute_code: "flowering_time", entity_type: "catalog_product"},
            {attribute_code: "breeder", entity_type: "catalog_product"},
            {attribute_code: "genetics", entity_type: "catalog_product"},
            {attribute_code: "yield", entity_type: "catalog_product"},
            {attribute_code: "seed_type", entity_type: "catalog_product"},
            {attribute_code: "type", entity_type: "catalog_product"}
          ]) {
            items { attribute_code attribute_type attribute_options { label value } }
          }
        }
        """
    )
    print("\ncustomAttributeMetadata", json.dumps(d, ensure_ascii=False)[:1500])

    # 5) products query requesting every ProductInterface field that looks useful
    useful = [
        n for n in names
        if n not in {
            "canonical_url", "created_at", "updated_at", "uid", "url_rewrites",
            "staged", "only_x_left_in_stock", "new_from_date", "new_to_date",
            "gift_message_available", "special_from_date", "special_to_date",
            "special_price", "tier_price", "tier_prices", "price_tiers",
            "crosssell_products", "upsell_products", "related_products",
            "swatch_image",
        }
    ]
    # build a shallow selection — skip complex object fields first by testing batches
    scalarish = []
    complexish = []
    for f in fields:
        t = f["type"]
        while t.get("ofType"):
            t = t["ofType"]
        kind = t.get("kind")
        name = t.get("name") or ""
        if kind in ("SCALAR", "ENUM") or name in ("String", "Int", "Float", "Boolean", "ID"):
            scalarish.append(f["name"])
        else:
            complexish.append((f["name"], kind, name))
    print("\nscalars", scalarish)
    print("complex sample", complexish[:40])

    sel = "\n".join(scalarish)
    q = f"""
    query($v: String!) {{
      products(filter: {{ sku: {{ eq: $v }} }}) {{
        items {{
          {sel}
          description {{ html }}
          short_description {{ html }}
          categories {{ name url_path }}
          media_gallery {{ url label }}
          price_range {{
            minimum_price {{
              regular_price {{ value currency }}
              final_price {{ value currency }}
            }}
          }}
        }}
      }}
    }}
    """
    c, d = gql(q, {"v": SKU})
    print("\n=== full scalar product by sku")
    items = (((d.get("data") or {}).get("products") or {}).get("items")) or []
    if items:
        print(json.dumps(items[0], ensure_ascii=False, indent=1)[:4000])
        DATA.joinpath("_probe_seedsman_product.json").write_text(
            json.dumps(items[0], ensure_ascii=False, indent=1), encoding="utf-8"
        )
    else:
        print(json.dumps(d, ensure_ascii=False)[:2000])

    # 6) configurable options / attributes via fragments
    q2 = """
    query($v: String!) {
      products(filter: { sku: { eq: $v } }) {
        items {
          sku name url_key type_id
          ... on ConfigurableProduct {
            configurable_options {
              attribute_code label
              values { label value_index }
            }
            variants {
              product {
                sku name
                description { html }
              }
              attributes { code label value_index }
            }
          }
        }
      }
    }
    """
    c, d = gql(q2, {"v": SKU})
    print("\n=== configurable", json.dumps(d, ensure_ascii=False)[:2500])


if __name__ == "__main__":
    main()
