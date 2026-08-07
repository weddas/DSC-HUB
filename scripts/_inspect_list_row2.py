#!/usr/bin/env python3
from pathlib import Path
import re

t = Path("homeassistant/data/_cache_cannareviews/product_list_full.html").read_text(
    encoding="utf-8", errors="replace"
)
i = t.find('<td class="truncate-brand">Beacon Medical</td>')
print(repr(t[i - 400 : i + 100]))

# simpler row parser: split on truncate-brand
chunks = re.split(r'<td class="truncate-brand">', t)[1:]
print("chunks", len(chunks))
chunk = chunks[0]
print(repr(chunk[:600]))
brand = re.match(r"([^<]*)</td>", chunk).group(1)
print("brand", brand)
am = re.search(
    r'<a href="(https://cannareviews\.health/product/([a-z0-9\-]+))"[^>]*>([^<]*)</a>',
    chunk,
)
print("a", am.groups() if am else None)
tds = re.findall(r"<td[^>]*>(.*?)</td>", chunk, re.S)
print("td count", len(tds))
for i, td in enumerate(tds[:10]):
    print(i, re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", td)).strip()[:80])
