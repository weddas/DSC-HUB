#!/usr/bin/env python3
import re, ssl, urllib.request, urllib.error
UA={"User-Agent":"Mozilla/5.0"}
CTX=ssl.create_default_context()

def grab(url):
    req=urllib.request.Request(url, headers=UA)
    try:
        with urllib.request.urlopen(req, timeout=25, context=CTX) as r:
            return r.status, r.geturl(), r.read(400000).decode("utf-8","replace")
    except urllib.error.HTTPError as e:
        b=e.read(100000).decode("utf-8","replace") if e.fp else ""
        return e.code, url, b
    except Exception as e:
        return None, url, str(e)

for url in [
    "https://www.alchimiaweb.com/en/sitemap-products.xml",
    "https://shop.greenhouseseeds.nl/",
    "https://shop.greenhouseseeds.nl/robots.txt",
    "https://ilgm.com/sitemap_products_1.xml",
]:
    code, final, body = grab(url)
    locs=re.findall(r"<loc>([^<]+)</loc>", body or "")
    print(f"==== {url} http={code} locs={len(locs)} len={len(body or '')}")
    for u in locs[:10]:
        print(" ", u)
    if not locs:
        hrefs=re.findall(r'href=["\']([^"\']+)["\']', body or "", re.I)
        for h in [h for h in hrefs if re.search(r"product|seed|femin|auto|collection", h, re.I)][:12]:
            print(" ", h)
        if "Sitemap:" in (body or ""):
            for line in body.splitlines():
                if line.lower().startswith("sitemap:"):
                    print(" ", line.strip())
