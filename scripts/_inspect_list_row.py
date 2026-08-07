#!/usr/bin/env python3
from pathlib import Path
import re

t = Path("homeassistant/data/_cache_cannareviews/product_list_full.html").read_text(
    encoding="utf-8", errors="replace"
)
i = t.find('<td class="truncate-brand">')
print("td idx", i)
print(repr(t[i : i + 800]))
print("td brand count", len(re.findall(r'<td class="truncate-brand">', t)))
print("brands", re.findall(r'<td class="truncate-brand">([^<]*)</td>', t)[:15])
print("prices", re.findall(r'class="font-semibold text-right">([^<]+)</td>', t)[:10])
# show raw around first product href with wider window
j = t.find("product/antg-mariposa")
print("prod idx", j)
print(repr(t[j - 250 : j + 450]))
