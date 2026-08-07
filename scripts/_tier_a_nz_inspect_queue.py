import json
from pathlib import Path

q = json.loads(
    Path(r"y:\Digital Stealth Care\Projects\DSC-HUB\homeassistant\data\_breeder_scrape_queue_1482.json").read_text(
        encoding="utf-8"
    )
)
print("partial", q.get("partial"), "counts", q.get("counts"))
for r in q["tiers"]["A"]:
    n = r.get("name", "")
    print(f"A [{(n[:1] or '?').upper()}] {n} | {r.get('platform')} | {r.get('url')}")
nz = [
    r
    for r in q["tiers"]["A"]
    if (r.get("name") or " ")[0].isalpha() and (r.get("name") or " ")[0].upper() >= "N"
]
print("N-Z A", len(nz))
