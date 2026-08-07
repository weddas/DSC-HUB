#!/usr/bin/env python3
"""Probe which Seedsman product attribute fields resolve via GraphQL."""

from __future__ import annotations

import json
import re
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
SKU2 = "UMSC-COTH-FEM"  # configurable in-stock for richer attrs


def gql(query: str, variables: dict | None = None) -> dict:
    body = json.dumps({"query": query, "variables": variables or {}}).encode()
    req = urllib.request.Request(
        "https://www.seedsman.com/graphql", data=body, headers=UA, method="POST"
    )
    with urllib.request.urlopen(req, timeout=60, context=CTX) as r:
        return json.loads(r.read().decode())


def main() -> None:
    attrs = [
        "thc",
        "cbd",
        "flowering_time",
        "breeder",
        "genetics",
        "yield",
        "seed_type",
        "type",
        "indica_sativa",
        "sativa",
        "indica",
        "height",
        "effect",
        "flavour",
        "flavor",
        "aroma",
        "yield_indoor",
        "yield_outdoor",
        "flowering",
        "sex",
        "seedbank",
        "seed_bank",
        "awards",
        "medical",
        "grow_area",
        "environment",
        "difficulty",
        "plant_height",
        "harvest_month",
        "thc_content",
        "cbd_content",
        "cannabinoid_content",
        "phenotype",
        "genotype",
        "parents",
        "cross",
        "lineage",
        "s_attributes",
        "attributes",
        "amasty_xsearch_boost",
        "brand",
        "manufacturer",
        "country_of_manufacture",
        "mpn",
        "rating_summary",
        "review_count",
        "options",
        "configurable_options",
        "canonical_url",
        "image",
        "small_image",
        "thumbnail",
        "url_suffix",
        "stock_status",
        "only_x_left_in_stock",
        "meta_title",
        "meta_keyword",
        "meta_description",
        "uid",
        "id",
        "sku",
        "name",
        "url_key",
        "type_id",
    ]
    ok: dict[str, object] = {}
    bad: list[str] = []
    for a in attrs:
        q = (
            "query($v:String!){ products(filter:{sku:{eq:$v}}){ items { %s } } }"
            % a
        )
        d = gql(q, {"v": SKU})
        if d.get("errors"):
            msg = d["errors"][0]["message"]
            if "Cannot query field" in msg:
                bad.append(a)
            else:
                print(f"{a}: ERR {msg[:140]}")
            continue
        items = ((d.get("data") or {}).get("products") or {}).get("items") or [{}]
        val = items[0].get(a)
        ok[a] = val
        print(f"{a} = {json.dumps(val, ensure_ascii=False)[:200]}")

    # Try AttributeInterface style / Scandi custom
    for qname, q in [
        (
            "attr_iface",
            """
            query($v:String!){
              products(filter:{sku:{eq:$v}}){
                items {
                  sku
                  ... on SimpleProduct {
                    thc cbd flowering_time breeder genetics
                  }
                }
              }
            }
            """,
        ),
        (
            "attr_any",
            """
            query($v:String!){
              products(filter:{sku:{eq:$v}}){
                items {
                  sku name
                  thc
                  cbd
                  flowering_time
                  breeder
                  genetics
                  yield
                  seed_type
                }
              }
            }
            """,
        ),
    ]:
        d = gql(q, {"v": SKU})
        print(f"\n{qname}:", json.dumps(d, ensure_ascii=False)[:1200])

    # Configurable rich product
    d = gql(
        """
        query($v:String!){
          products(filter:{sku:{eq:$v}}){
            items {
              id sku name url_key type_id stock_status
              meta_title meta_description
              description { html }
              short_description { html }
              categories { id name url_path }
              media_gallery { url label }
              price_range {
                minimum_price {
                  regular_price { value currency }
                  final_price { value currency }
                }
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
        """,
        {"v": SKU2},
    )
    print("\nconfigurable rich:", json.dumps(d, ensure_ascii=False)[:2500])
    DATA.joinpath("_probe_seedsman_attrs.json").write_text(
        json.dumps({"ok": ok, "bad": bad, "configurable": d}, ensure_ascii=False, indent=1),
        encoding="utf-8",
    )

    # Pull product chunk attribute-looking identifiers
    url = (
        "https://www.seedsman.com/static/frontend/scandipwa/seedsman/en_US/"
        "Magento_Theme/static/js/product.f71687d0.chunk.js"
    )
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=60, context=CTX) as r:
        js = r.read().decode("utf-8", "replace")
    codes = sorted(set(re.findall(r'["\']([a-z_]{3,40})["\']', js)))
    interesting = [
        c
        for c in codes
        if any(
            x in c
            for x in (
                "thc",
                "cbd",
                "flower",
                "breed",
                "yield",
                "genet",
                "indica",
                "sativa",
                "height",
                "effect",
                "flavour",
                "flavor",
                "aroma",
                "seed",
                "harvest",
                "medical",
                "cannab",
                "attr",
            )
        )
    ]
    print("\ninteresting identifiers from product chunk:", interesting[:80])
    print("ok_count", len(ok), "bad_count", len(bad))


if __name__ == "__main__":
    main()
