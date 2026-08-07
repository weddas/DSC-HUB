#!/usr/bin/env python3
"""Deeper Hytiva pagination / API / detail field probe."""
from __future__ import annotations

import json
import re
import urllib.request
from pathlib import Path

UA = {"User-Agent": "DSC-HUB-catalog-research/0.1 (+local research corpus)"}
OUT = Path(__file__).resolve().parents[1] / "homeassistant" / "data" / "_probe_hytiva_deep.json"


def get(url: str) -> tuple[int, str]:
    req = urllib.request.Request(url, headers={**UA, "Accept": "text/html,application/json"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        return resp.status, resp.read().decode("utf-8", errors="replace")


def strain_paths(html: str) -> set[str]:
    return set(re.findall(r"/strains/(?:hybrid|indica|sativa)/[a-z0-9\-]+", html, re.I))


def main() -> None:
    out: dict = {}
    # Compare pages
    pages = {}
    all_links: set[str] = set()
    for p in range(1, 21):
        url = f"https://www.hytiva.com/strains?page={p}"
        try:
            status, html = get(url)
            links = strain_paths(html)
            pages[p] = {"n": len(links), "sample": sorted(links)[:3], "new": len(links - all_links)}
            all_links |= links
            print(f"page {p}: {len(links)} links, new={pages[p]['new']}, cumulative={len(all_links)}")
            if pages[p]["new"] == 0 and p > 3:
                break
        except Exception as exc:  # noqa: BLE001
            pages[p] = {"error": str(exc)}
            print("page", p, exc)
            break
    out["pages"] = pages
    out["cumulative_from_main"] = len(all_links)

    # type pages deeper
    for typ in ("hybrid", "indica", "sativa"):
        type_links: set[str] = set()
        for p in range(1, 31):
            url = f"https://www.hytiva.com/strains/{typ}?page={p}"
            try:
                _, html = get(url)
                links = strain_paths(html)
                new = links - type_links
                type_links |= links
                print(f"{typ} p{p}: {len(links)} new={len(new)} cum={len(type_links)}")
                if len(new) == 0 and p > 2:
                    break
            except Exception as exc:  # noqa: BLE001
                print(typ, p, exc)
                break
        out[f"type_{typ}"] = len(type_links)
        all_links |= type_links

    out["cumulative_with_types"] = len(all_links)

    # Filter fan-out (effects/flavors from probe)
    filters = [
        "effects=energetic",
        "effects=creative",
        "effects=happy",
        "effects=sleepy",
        "effects=relaxed",
        "effects=hungry",
        "flavors=earthy",
        "flavors=sweet",
        "flavors=citrus",
        "flavors=berry",
        "flavors=diesel",
        "pairsWellWith=sleeping",
        "pairsWellWith=watchingTV",
    ]
    for f in filters:
        url = f"https://www.hytiva.com/strains?{f}"
        try:
            _, html = get(url)
            links = strain_paths(html)
            new = links - all_links
            all_links |= links
            out[f"filter_{f}"] = {"n": len(links), "new": len(new)}
            print(f"filter {f}: {len(links)} new={len(new)} cum={len(all_links)}")
            # also page 2 of filter
            _, html2 = get(url + "&page=2")
            links2 = strain_paths(html2)
            new2 = links2 - all_links
            all_links |= links2
            out[f"filter_{f}_p2"] = {"n": len(links2), "new": len(new2)}
            print(f"  p2: {len(links2)} new={len(new2)} cum={len(all_links)}")
        except Exception as exc:  # noqa: BLE001
            out[f"filter_{f}"] = {"error": str(exc)}

    out["cumulative_after_filters"] = len(all_links)

    # Detail parse blue-dream
    _, detail = get("https://www.hytiva.com/strains/hybrid/blue-dream")
    # Save interesting HTML slices
    snippets = {}
    for label, pat in [
        ("meta_desc", r'<meta name="description" content="([^"]+)"'),
        ("og_title", r'<meta property="og:title" content="([^"]+)"'),
        ("ld_json", r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>'),
        ("h1", r"<h1[^>]*>(.*?)</h1>"),
        ("dt_dd", r"<dt[^>]*>(.*?)</dt>\s*<dd[^>]*>(.*?)</dd>"),
        ("data_attrs", r'data-[a-z-]+=["\'][^"\']{1,80}["\']'),
        ("api_paths", r'["\'](/api/[^"\']+)["\']'),
        ("json_blobs", r'\{"[a-zA-Z]+":[^}]{20,400}\}'),
    ]:
        ms = re.findall(pat, detail, re.I | re.S)
        snippets[label] = ms[:10] if isinstance(ms, list) else ms
    out["detail_snippets"] = {k: (v if not isinstance(v, list) or len(str(v)) < 2000 else str(v)[:2000]) for k, v in snippets.items()}

    # Look for total count text
    _, list_html = get("https://www.hytiva.com/strains")
    for pat in [r"(\d[\d,]*)\s*(?:strains|results|found)", r"Showing\s+\d+", r"of\s+(\d[\d,]*)", r"page\s+\d+\s+of\s+(\d+)"]:
        out[f"count_pat_{pat}"] = re.findall(pat, list_html, re.I)[:10]

    # pagination hrefs on list
    out["list_page_hrefs"] = sorted(set(re.findall(r'href=["\']([^"\']*page=\d+[^"\']*)["\']', list_html, re.I)))[:50]
    # max page number visible
    nums = [int(x) for x in re.findall(r"[?&]page=(\d+)", list_html)]
    out["max_page_in_list"] = max(nums) if nums else None
    out["page_nums_in_list"] = sorted(set(nums))[:40]

    # Try possible API endpoints
    apis = [
        "https://www.hytiva.com/api/strains",
        "https://www.hytiva.com/api/v1/strains",
        "https://www.hytiva.com/api/strains?page=1",
        "https://www.hytiva.com/strains.json",
        "https://www.hytiva.com/strains?format=json",
        "https://www.hytiva.com/strains?ajax=1",
        "https://www.hytiva.com/asset/files/hytiva-manifest.json",
    ]
    for u in apis:
        try:
            status, body = get(u)
            out[u] = {"status": status, "bytes": len(body), "preview": body[:300]}
            print("api", u, status, len(body))
        except Exception as exc:  # noqa: BLE001
            out[u] = {"error": str(exc)}
            print("api", u, exc)

    OUT.write_text(json.dumps(out, indent=2, default=str), encoding="utf-8")
    print("TOTAL unique", len(all_links))
    print("wrote", OUT)


if __name__ == "__main__":
    main()
