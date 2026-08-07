#!/usr/bin/env python3
"""Post-process _breeder_scrape_queue_1482.json to demote false-positive domain guesses."""

from __future__ import annotations

import json
import re
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "homeassistant" / "data" / "_breeder_scrape_queue_1482.json"

STOP = {
    "www",
    "com",
    "net",
    "org",
    "eu",
    "nl",
    "co",
    "uk",
    "shop",
    "store",
    "the",
    "and",
    "of",
    "seeds",
    "seed",
    "bank",
    "seedbank",
    "genetics",
    "genetix",
    "company",
    "labs",
    "lab",
    "farm",
    "farms",
    "cannabis",
    "marijuana",
}


def tokens(s: str) -> set[str]:
    return {t for t in re.split(r"[^a-z0-9]+", (s or "").lower()) if len(t) >= 3 and t not in STOP}


def compact(s: str) -> str:
    return re.sub(r"[^a-z0-9]", "", (s or "").lower())


def name_variants(name: str) -> list[str]:
    base = compact(name)
    out = [base]
    for suf in (
        "seeds",
        "seed",
        "seedbank",
        "genetics",
        "genetix",
        "company",
        "labs",
        "lab",
        "farm",
        "farms",
        "co",
    ):
        if base.endswith(suf) and len(base) - len(suf) >= 4:
            out.append(base[: -len(suf)])
    # unique preserve order
    seen: set[str] = set()
    res: list[str] = []
    for x in out:
        if x and x not in seen:
            seen.add(x)
            res.append(x)
    return res


def host_compact(url: str | None) -> str:
    if not url:
        return ""
    host = (urlparse(url).hostname or "").lower()
    if host.startswith("www."):
        host = host[4:]
    parts = host.split(".")
    if len(parts) >= 2:
        host = ".".join(parts[:-1])
    return compact(host)


def host_tokens(url: str | None) -> set[str]:
    if not url:
        return set()
    host = (urlparse(url).hostname or "").lower()
    host = host[4:] if host.startswith("www.") else host
    parts = host.split(".")
    if len(parts) >= 2:
        host = ".".join(parts[:-1])
    return tokens(host.replace(".", " "))


def name_host_score(name: str, url: str | None) -> float:
    """Score name↔host match. Prefer contiguous compact match over single-token overlap."""
    hc = host_compact(url)
    if not hc:
        return 0.0
    variants = name_variants(name)
    for i, v in enumerate(variants):
        if len(v) < 5:
            continue
        if v == hc or v in hc:
            # Full name (index 0) is strong; stripped stem alone is weak
            if i == 0:
                return 1.0
            # Stem-only equality against short corporate hosts (olympic.com)
            if v == hc and len(v) <= 10:
                return 0.35
            if v in hc:
                return 0.55
    # Do NOT reward host contained in longer name (olympic ⊂ olympicsseeds)
    nt = tokens(name)
    ht = host_tokens(url)
    inter = nt & ht
    if len(inter) >= 2:
        return 0.75
    if len(inter) == 1:
        tok = next(iter(inter))
        # Single short token (olympic, archive, paradise) is weak alone
        if len(tok) <= 8 and tok not in hc[: len(tok) + 2]:
            return 0.2
        # tok must be a substantial share of hostname
        if len(tok) >= 6 and tok in hc:
            return 0.55
        return 0.25
    return 0.0


def has_strong_probe(row: dict) -> bool:
    for p in row.get("probes") or []:
        if not p.get("ok"):
            continue
        if p.get("hint") == "product_json":
            return True
        if p.get("hint") == "sitemap_xml" and (
            (p.get("productish_locs") or 0) > 0 or (p.get("loc_count") or 0) >= 5
        ):
            return True
    return False


def re_tier(row: dict) -> str:
    if row.get("tier") == "excluded" or row.get("excluded"):
        return "excluded"
    src = row.get("url_source")
    score = name_host_score(row.get("name") or "", row.get("url"))
    signals = set(row.get("signals") or [])
    platform = row.get("platform")
    status = row.get("status")
    err = row.get("error")

    if err in ("dns", "refused") or status is None:
        return "D"
    if "coming_soon" in signals or "parked" in signals:
        return "D"
    if status and status >= 400 and not has_strong_probe(row):
        return "D"

    # Domain guess needs solid name↔host match to be scrape-worthy
    if src == "domain_guess" and score < 0.5:
        if status and 200 <= status < 400:
            return "C"
        return "D"

    strong = has_strong_probe(row)
    trusted = src == "known_map" or score >= 0.5

    if not trusted:
        return "C" if status and 200 <= status < 400 else "D"

    if strong and platform in ("shopify", "woocommerce"):
        return "A"
    if strong and platform == "magento" and score >= 0.85:
        return "A"
    if strong and score >= 0.85:
        return "A"
    if strong:
        return "B"
    if platform in ("shopify", "woocommerce") and status and 200 <= status < 400:
        return "B"
    if "wordpress" in signals or "product_paths" in signals or "jsonld_product" in signals:
        return "B" if score >= 0.85 else "C"
    if status and 200 <= status < 400:
        return "C"
    return "D"


def main() -> int:
    data = json.loads(OUT.read_text(encoding="utf-8"))
    all_rows: list[dict] = []
    for tier in ("A", "B", "C", "D"):
        all_rows.extend(data.get("tiers", {}).get(tier) or [])

    by = {"A": [], "B": [], "C": [], "D": []}
    moved = Counter()
    for row in all_rows:
        old = row.get("tier") or "?"
        new = re_tier(row)
        row["tier"] = new
        row["name_host_score"] = round(
            name_host_score(row.get("name") or "", row.get("url")), 3
        )
        if old != new:
            moved[f"{old}->{new}"] += 1
        by[new].append(row)

    def sort_key(r: dict) -> tuple:
        probes = r.get("probes") or []
        prod = max((p.get("productish_locs") or 0) for p in probes) if probes else 0
        score = -(r.get("name_host_score") or 0)
        plat = 0 if r.get("platform") else 1
        return (plat, score, -prod, r.get("name_norm") or "")

    for t in by:
        by[t].sort(key=sort_key)

    data["tiers"] = by
    data["partial"] = False
    data["reclassified_at"] = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    data["reclassify_moves"] = dict(moved)
    data["counts"]["probed"] = sum(len(by[t]) for t in by)
    data["counts"]["tier_A"] = len(by["A"])
    data["counts"]["tier_B"] = len(by["B"])
    data["counts"]["tier_C"] = len(by["C"])
    data["counts"]["tier_D"] = len(by["D"])
    data["notes"] = list(data.get("notes") or []) + [
        "Reclassified: demote domain_guess with weak name↔host overlap; Magento HTML-only demoted.",
    ]
    OUT.write_text(json.dumps(data, indent=2), encoding="utf-8")
    print(json.dumps(data["counts"], indent=2))
    print("moves", dict(moved))
    print("A sample:")
    for x in by["A"][:10]:
        print(
            f"  {x['name']} | {x.get('url')} | {x.get('platform')} | score={x.get('name_host_score')}"
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
