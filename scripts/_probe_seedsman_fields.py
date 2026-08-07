#!/usr/bin/env python3
"""Discover working Seedsman grow fields + s_attributes shape."""

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
SKU = "MRNMM"
SKU2 = "UMSC-COTH-FEM"

CANDIDATES = [
    "seeds_climate",
    "seeds_aroma",
    "seeds_aroma_filter",
    "seeds_auto_harvest_time",
    "seeds_cbd_filter",
    "seeds_effect",
    "seeds_effect_description",
    "seeds_effect_filter",
    "seeds_effects",
    "seeds_feminised",
    "seeds_flavor",
    "seeds_flavour_filter",
    "seeds_flowering_time",
    "seeds_flowering_type",
    "seeds_plant_height",
    "seeds_taste_filter",
    "seeds_thc_filter",
    "seeds_yield_filter",
    "seeds_yield_indoor_filter",
    "seeds_yield_outdoor_filter",
    "seeds_thc",
    "seeds_cbd",
    "seeds_yield",
    "seeds_yield_indoor",
    "seeds_yield_outdoor",
    "seeds_genetics",
    "seeds_breeder",
    "seeds_type",
    "seeds_sex",
    "genetic_description",
    "effect_description",
    "effects",
    "brand",
    "seeds",
]


def gql(query: str, variables: dict | None = None) -> dict:
    body = json.dumps({"query": query, "variables": variables or {}}).encode()
    req = urllib.request.Request(
        "https://www.seedsman.com/graphql", data=body, headers=UA, method="POST"
    )
    with urllib.request.urlopen(req, timeout=60, context=CTX) as r:
        return json.loads(r.read().decode())


def main() -> None:
    working: dict[str, object] = {}
    suggestions: dict[str, str] = {}
    for field in CANDIDATES:
        q = (
            "query($v:String!){ products(filter:{sku:{eq:$v}}){ items { sku %s } } }"
            % field
        )
        d = gql(q, {"v": SKU2})
        if d.get("errors"):
            msg = d["errors"][0]["message"]
            print(f"NO {field}: {msg[:160]}")
            if "Did you mean" in msg:
                suggestions[field] = msg
            continue
        items = ((d.get("data") or {}).get("products") or {}).get("items") or [{}]
        val = items[0].get(field)
        working[field] = val
        print(f"OK {field}={json.dumps(val, ensure_ascii=False)[:220]}")

    # s_attributes with subselection guesses
    for sel in [
        "attribute_code attribute_value",
        "attribute_code attribute_label attribute_value attribute_type",
        "attribute_code attribute_label attribute_value attribute_type attribute_options { label value }",
        "attribute_code label value",
        "code label value",
        "attribute_code attribute_value { ... on AttributeValue { value } }",
    ]:
        q = f"""
        query($v:String!){{
          products(filter:{{sku:{{eq:$v}}}}){{
            items {{
              sku
              s_attributes {{ {sel} }}
            }}
          }}
        }}
        """
        d = gql(q, {"v": SKU2})
        print("\ns_attr sel:", sel)
        print(json.dumps(d, ensure_ascii=False)[:1200])
        if not d.get("errors"):
            break

    # brand label via categories / customAttributeMetadata option lookup
    d = gql(
        """
        {
          customAttributeMetadata(attributes: [
            {attribute_code:"brand", entity_type:"catalog_product"}
          ]) {
            items {
              attribute_code
              attribute_options { label value }
            }
          }
        }
        """
    )
    print("\nbrand options sample", json.dumps(d, ensure_ascii=False)[:1500])

    DATA.joinpath("_probe_seedsman_fields.json").write_text(
        json.dumps(
            {"working": working, "suggestions": suggestions},
            ensure_ascii=False,
            indent=1,
            default=str,
        ),
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
