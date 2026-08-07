#!/usr/bin/env python3
"""Pull Seedsman s_attributes + seeds_* grow fields for sample SKUs."""

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

FIELDS = [
    "seeds_aroma",
    "seeds_aroma_filter",
    "seeds_auto_harvest_time",
    "seeds_cbd_filter",
    "seeds_climate",
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
    "genetic_description",
    "effect_description",
    "effects",
    "brand",
]


def gql(query: str, variables: dict | None = None) -> dict:
    body = json.dumps({"query": query, "variables": variables or {}}).encode()
    req = urllib.request.Request(
        "https://www.seedsman.com/graphql", data=body, headers=UA, method="POST"
    )
    with urllib.request.urlopen(req, timeout=90, context=CTX) as r:
        return json.loads(r.read().decode())


def main() -> None:
    # Introspect AttributeWithValue
    d = gql(
        """
        {
          __type(name: "AttributeWithValue") {
            fields { name type { kind name ofType { kind name ofType { name } } } }
          }
        }
        """
    )
    print("AttributeWithValue", json.dumps(d, ensure_ascii=False)[:1500])

    sel = "\n".join(FIELDS)
    q = f"""
    query($v: String!) {{
      products(filter: {{ sku: {{ eq: $v }} }}) {{
        items {{
          id sku name url_key type_id stock_status
          brand
          meta_title meta_description
          description {{ html }}
          short_description {{ html }}
          categories {{ id name url_path }}
          media_gallery {{ url label }}
          image {{ url label }}
          price_range {{
            minimum_price {{
              regular_price {{ value currency }}
              final_price {{ value currency }}
            }}
          }}
          s_attributes {{
            attribute_code
            attribute_type
            attribute_label
            attribute_value
            attribute_options {{ label value }}
          }}
          {sel}
          ... on ConfigurableProduct {{
            configurable_options {{
              attribute_code label
              values {{ label value_index }}
            }}
            variants {{
              product {{ sku name stock_status }}
              attributes {{ code label value_index }}
            }}
          }}
        }}
      }}
    }}
    """
    out = {}
    for sku in ("MRNMM", "UMSC-COTH-FEM", "SRSAk"):  # AK47 etc
        # try a few known skus from sitemap samples
        pass
    for sku in ("MRNMM", "UMSC-COTH-FEM", "SRSAK"):
        d = gql(q, {"v": sku})
        items = ((d.get("data") or {}).get("products") or {}).get("items") or []
        print(f"\n=== {sku} errors={bool(d.get('errors'))} n={len(items)}")
        if d.get("errors"):
            print(json.dumps(d["errors"], ensure_ascii=False)[:800])
        if items:
            item = items[0]
            # summarize s_attributes
            attrs = item.get("s_attributes") or []
            print("s_attributes count", len(attrs))
            for a in attrs:
                if not isinstance(a, dict):
                    continue
                code = a.get("attribute_code")
                val = a.get("attribute_value")
                opts = a.get("attribute_options")
                if val not in (None, "", []) or opts:
                    print(f"  {code}: value={val!r} opts={opts}")
            for f in FIELDS:
                if item.get(f) not in (None, "", [], {}):
                    print(f"  FIELD {f}={json.dumps(item.get(f), ensure_ascii=False)[:200]}")
            out[sku] = item

    DATA.joinpath("_probe_seedsman_grow.json").write_text(
        json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8"
    )
    print("wrote grow probe")


if __name__ == "__main__":
    main()
