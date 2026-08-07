#!/usr/bin/env python3
import re
import ssl
import urllib.request

UA = {"User-Agent": "Mozilla/5.0"}
CTX = ssl.create_default_context()


def get(url: str) -> str:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, context=CTX, timeout=25) as r:
        return r.read(250000).decode("utf-8", "replace")


samples = {
    "raw": "https://rawgenetics.com/product-sitemap.xml",
    "sensi_idx": "https://sensiseeds.com/sitemap.xml",
    "sensi_idx2": "https://sensiseeds.com/sitemap_index.xml",
    "quebec": "https://quebeccannabisseeds.com/sitemap.xml",
    "soma": "https://somaseeds.nl/sitemap.xml",
    "sweet": "https://www.sweetseeds.com/sitemap.xml",
    "philosopher": "https://www.philosopherseeds.com/sitemap.xml",
    "oregon": "https://oregoneliteseeds.com/sitemap_index.xml",
    "solfire": "https://solfiregardens.com/sitemap_index.xml",
}

for k, u in samples.items():
    try:
        b = get(u)
        locs = re.findall(r"<loc>\s*(?:<!\[CDATA\[(.*?)\]\]>|([^<\s]+))\s*</loc>", b, re.I | re.S)
        urls = [(a or b2 or "").strip() for a, b2 in locs]
        print(k, "locs", len(urls))
        for x in urls[:6]:
            print("   ", x)
        nested = [x for x in urls if "sitemap" in x.lower()]
        if nested:
            print("  nested", len(nested), nested[:4])
            # peek first productish child
            for child in nested[:3]:
                try:
                    b2 = get(child)
                    locs2 = re.findall(r"<loc>\s*(?:<!\[CDATA\[(.*?)\]\]>|([^<\s]+))\s*</loc>", b2, re.I | re.S)
                    urls2 = [(a or b3 or "").strip() for a, b3 in locs2]
                    print("   child", child, "->", len(urls2), "eg", urls2[:3])
                except Exception as e:
                    print("   child FAIL", child, e)
    except Exception as e:
        print(k, "FAIL", type(e).__name__, e)
