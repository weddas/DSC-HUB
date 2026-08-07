#!/usr/bin/env python3
"""One-shot probes: Greenhouse PDP fields, category crawl, MA CCC links, forum roots."""
from __future__ import annotations

import re
import ssl
import sys
import urllib.error
import urllib.request
from pathlib import Path
from urllib.parse import urljoin, urlparse

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from catalog_common import parse_grow_fields  # noqa: E402

CTX = ssl.create_default_context()
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36"


def fetch(url: str, timeout: int = 90) -> tuple[int, str]:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
    try:
        with urllib.request.urlopen(req, timeout=timeout, context=CTX) as resp:
            return resp.status, resp.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", "replace") if exc.fp else ""
        return exc.code, body


def clean(html: str) -> str:
    t = re.sub(r"(?is)<script.*?</script>", " ", html or "")
    t = re.sub(r"(?is)<style.*?</style>", " ", t)
    t = re.sub(r"(?is)<[^>]+>", " ", t)
    return re.sub(r"\s+", " ", t).strip()


def probe_greenhouse() -> None:
    print("=== GREENHOUSE PDP ===")
    url = "https://shop.greenhouseseeds.nl/feminised-cannabis-seeds/1-seed-pack/big-bang"
    status, html = fetch(url)
    text = clean(html)
    print("status", status, "html", len(html), "text", len(text))
    # Prefer product description block if present
    desc = ""
    for pat in (
        r'id=["\']content_description["\'][^>]*>(.*?)</div>',
        r'class=["\'][^"\']*product-description[^"\']*["\'][^>]*>(.*?)</div>',
        r'itemprop=["\']description["\'][^>]*>(.*?)</(?:div|p|span)>',
        r"<h2[^>]*>.*?Description.*?</h2>(.*?)(?:<h2|<div class=\"ty-product)",
    ):
        m = re.search(pat, html, re.I | re.S)
        if m:
            desc = clean(m.group(1))
            if len(desc) > 80:
                print("DESC_BLOCK", desc[:1200])
                break
    # Look for feature list near product
    for m in re.finditer(
        r"(?is)(?:Flowering|Height|Yield|Genetics|THC|CBD|Parents|Lineage).{0,200}",
        html,
    ):
        snippet = clean(m.group(0))
        if 10 < len(snippet) < 180 and "menu" not in snippet.lower():
            print("SNIP", snippet)
    body = desc or text
    # Find the actual product blurb by locating strain-specific phrases
    idx = body.lower().find("big bang")
    if idx >= 0:
        blurb = body[idx : idx + 1800]
        print("BLURB", blurb)
        print("GROW_BLURB", parse_grow_fields(blurb))
    print("GROW_FULL", parse_grow_fields(text))

    print("=== GREENHOUSE CATEGORY CRAWL ===")
    cats = [
        "https://shop.greenhouseseeds.nl/feminised-cannabis-seeds/",
        "https://shop.greenhouseseeds.nl/autoflowering-seeds/",
        "https://shop.greenhouseseeds.nl/regular-cannabis-seeds/",
        "https://shop.greenhouseseeds.nl/medicinal-seeds/",
        "https://shop.greenhouseseeds.nl/bestsellers/",
        "https://shop.greenhouseseeds.nl/usa/",
        "https://shop.greenhouseseeds.nl/feminised-cannabis-seeds/1-seed-pack/",
        "https://shop.greenhouseseeds.nl/medicinal-seeds/high-thc-seeds/",
    ]
    seed_re = re.compile(
        r"^https?://shop\.greenhouseseeds\.nl/"
        r"(?:medicinal-seeds|feminised-cannabis-seeds|autoflowering-seeds|"
        r"regular-cannabis-seeds)/(?:[a-z0-9.\-]+/)*"
        r"([a-z0-9][a-z0-9\-]{2,})/?$",
        re.I,
    )
    skip = re.compile(
        r"^(?:indoor|outdoor|tropical-and-mediterranean|moderate-and-continental|"
        r"hybrid-cannabis-seeds|mostly-sativa-seeds|mostly-indica-seeds|"
        r"white-family-seeds|arjans-haze-seeds|cbd-auto-flowering-seeds|"
        r"moderate-thc-seeds|high-thc-seeds|low-thc-seeds|medicinal-cbd-seeds|"
        r"climate-zones|families|types-of-seeds|cbd-seeds|usa-genetics|"
        r"usa-and-landrace-limited-edition|high-yield-seeds|1-seed-pack|"
        r"page-\d+|kush-strains|cold-and-northern)$",
        re.I,
    )
    href_re = re.compile(r"""href=["']([^"']+)["']""", re.I)
    allu: set[str] = set()
    for cat in cats:
        status, html = fetch(cat)
        found: set[str] = set()
        if status != 200:
            print(cat, "HTTP", status)
            continue
        for h in href_re.findall(html):
            u = urljoin(cat, h.split("#")[0].split("?")[0]).rstrip("/")
            m = seed_re.match(u)
            if not m:
                continue
            if skip.search(m.group(1)):
                continue
            # Prefer leaf depth >= 2
            parts = [p for p in urlparse(u).path.split("/") if p]
            if len(parts) < 2:
                continue
            found.add(u)
        print(cat, "links", len(found))
        allu |= found
    print("TOTAL unique category PDPs", len(allu))

    # Compare to sitemap accepted
    status, sm = fetch("https://shop.greenhouseseeds.nl/sitemap.xml")
    locs = re.findall(r"<loc>(.*?)</loc>", sm, re.I)
    product_re = re.compile(
        r"^https?://shop\.greenhouseseeds\.nl/"
        r"(?:medicinal-seeds|feminised-cannabis-seeds|autoflowering-seeds|"
        r"regular-cannabis-seeds)/(?:[a-z0-9\-]+/)?"
        r"([a-z0-9][a-z0-9\-]{2,})/?$",
        re.I,
    )
    sitemap_ok = {u.rstrip("/") for u in locs if product_re.match(u.rstrip("/")) and not skip.search(urlparse(u).path.rstrip("/").split("/")[-1])}
    print("sitemap_ok", len(sitemap_ok), "new_from_cats", len(allu - sitemap_ok))
    for u in sorted(allu - sitemap_ok)[:20]:
        print("  NEW", u)


def probe_ma_ccc() -> None:
    print("=== MA CCC CATALOG ===")
    url = "https://masscannabiscontrol.com/open-data/data-catalog"
    status, html = fetch(url)
    print("status", status, "html", len(html))
    hrefs = re.findall(r"""href=["']([^"']+)["']""", html, re.I)
    cands = []
    for h in hrefs:
        full = urljoin(url, h)
        low = full.lower()
        if any(x in low for x in (".csv", ".json", "testing", "thc", "lab", "test", "wp-content", "download")):
            cands.append(full)
    # also bare URLs in text
    for m in re.findall(r"https?://[^\s\"'<>]+", html):
        low = m.lower()
        if any(x in low for x in (".csv", ".json", "testing", "thc")):
            cands.append(m)
    uniq = list(dict.fromkeys(cands))
    print("candidates", len(uniq))
    for u in uniq[:50]:
        print(" ", u)
    # Find Testing_Data mentions
    for m in re.finditer(r"(?is).{0,40}Testing.{0,80}", html):
        t = clean(m.group(0))
        if "csv" in t.lower() or "thc" in t.lower() or "test" in t.lower():
            print("CTX", t[:220])


def probe_forums() -> None:
    print("=== FORUM ROOTS ===")
    sites = [
        ("rollitup", "https://www.rollitup.org/"),
        ("sensi", "https://forum.sensiseeds.com/"),
        ("growery", "https://www.growery.org/"),
        ("ozstoners", "https://www.ozstoners.com/"),
        ("mendeley", "https://data.mendeley.com/datasets/6zwcgrttkp/1"),
    ]
    for name, url in sites:
        try:
            status, html = fetch(url, timeout=45)
        except Exception as exc:  # noqa: BLE001
            print(name, "ERR", exc)
            continue
        low = html.lower()
        wall = any(
            x in low
            for x in (
                "just a moment",
                "cf-browser-verification",
                "attention required | cloudflare",
                "verifying you're human",
            )
        )
        print(name, "status", status, "len", len(html), "wall", wall)
        if name != "mendeley":
            forums = re.findall(r'href=["\']([^"\']*?/forums/[^"\'?#]+)["\']', html, re.I)
            print("  forum_links", len(forums), "sample", forums[:8])
        else:
            # download buttons / files
            files = re.findall(r'href=["\']([^"\']+)["\']', html, re.I)
            interesting = [
                f
                for f in files
                if any(x in f.lower() for x in ("download", ".csv", ".xlsx", ".zip", "doi", "login"))
            ]
            print("  fileish", interesting[:15])
            if "sign in" in low or "login" in low:
                print("  has_login_ui", True)


if __name__ == "__main__":
    # Avoid Windows console encoding crashes on Greek/emoji product text.
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass
    probe_greenhouse()
    probe_ma_ccc()
    probe_forums()
