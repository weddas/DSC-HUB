#!/usr/bin/env python3
"""Dump full s_attributes + option label maps for Seedsman grow fields."""

from __future__ import annotations

import json
import ssl
import urllib.request
from pathlib import Path

CTX = ssl.create_default_context()
DATA = Path(__file__).resolve().parents[1] / "homeassistant" / "data"
UA = {
    "User-Agent": "Mozilla/5.0",
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Origin": "https://www.seedsman.com",
    "Referer": "https://www.seedsman.com/us-en/",
    "Store": "us",
}


def gql(query: str, variables: dict | None = None) -> dict:
    body = json.dumps({"query": query, "variables": variables or {}}).encode()
    req = urllib.request.Request(
        "https://www.seedsman.com/graphql", data=body, headers=UA, method="POST"
    )
    with urllib.request.urlopen(req, timeout=90, context=CTX) as r:
        return json.loads(r.read().decode())


def main() -> None:
    q = """
    query($v: String!) {
      products(filter: { sku: { eq: $v } }) {
        items {
          id sku name url_key type_id stock_status
          brand
          meta_title meta_description
          description { html }
          short_description { html }
          categories { id name url_path }
          media_gallery { url label }
          image { url label }
          price_range {
            minimum_price {
              regular_price { value currency }
              final_price { value currency }
            }
          }
          genetic_description
          seeds_climate
          seeds_auto_harvest_time
          seeds_cbd_filter
          seeds_effect_filter
          seeds_feminised
          seeds_flowering_time
          seeds_flowering_type
          seeds_plant_height
          seeds_taste_filter
          seeds_thc_filter
          seeds_yield_filter
          seeds_yield_indoor_filter
          seeds_thc
          s_attributes {
            attribute_code
            attribute_label
            attribute_value
            attribute_type
            attribute_options { label value }
          }
          ... on ConfigurableProduct {
            configurable_options {
              attribute_code label
              values { label value_index }
            }
            variants {
              product { sku name stock_status }
              attributes { code label value_index }
            }
          }
        }
      }
    }
    """
    products = {}
    attr_codes: set[str] = set()
    for sku in ("MRNMM", "UMSC-COTH-FEM"):
        d = gql(q, {"v": sku})
        items = ((d.get("data") or {}).get("products") or {}).get("items") or []
        print(sku, "errors", d.get("errors"), "n", len(items))
        if items:
            products[sku] = items[0]
            for a in items[0].get("s_attributes") or []:
                if isinstance(a, dict) and a.get("attribute_code"):
                    attr_codes.add(a["attribute_code"])
                    # print non-empty
                    if a.get("attribute_value") not in (None, "", []):
                        print(
                            f"  {a.get('attribute_code')}: "
                            f"label={a.get('attribute_label')!r} "
                            f"val={a.get('attribute_value')!r} "
                            f"opts={a.get('attribute_options')}"
                        )

    # Fetch option maps for interesting attrs
    codes = sorted(
        {
            "brand",
            "seeds_feminised",
            "seeds_flowering_type",
            "seeds_flowering_time",
            "seeds_colour",
            "seeds_taste_filter",
            "seeds_thc_filter",
            "seeds_cbd_filter",
            "seeds_yield_filter",
            "seeds_yield_indoor_filter",
            "seeds_plant_height",
            "seeds_climate",
            "seeds_effect_filter",
            "seeds_auto_harvest_time",
            "product_tile_categories",
            "seeds_variety",
            "size",
        }
        | attr_codes
    )
    # Magento customAttributeMetadata often caps; batch
    option_maps: dict[str, dict[str, str]] = {}
    for i in range(0, len(codes), 8):
        batch = codes[i : i + 8]
        attrs = ", ".join(
            '{attribute_code:"%s", entity_type:"catalog_product"}' % c for c in batch
        )
        d = gql(
            "{ customAttributeMetadata(attributes: [%s]) { items { attribute_code attribute_options { label value } } } }"
            % attrs
        )
        for item in ((d.get("data") or {}).get("customAttributeMetadata") or {}).get("items") or []:
            code = item.get("attribute_code")
            opts = item.get("attribute_options") or []
            option_maps[code] = {str(o["value"]): o["label"] for o in opts if o.get("value") is not None}
            print(f"options {code}: {len(option_maps[code])}")

    out = {"products": products, "option_maps": option_maps}
    DATA.joinpath("_probe_seedsman_full.json").write_text(
        json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8"
    )
    print("wrote full probe")


if __name__ == "__main__":
    main()
