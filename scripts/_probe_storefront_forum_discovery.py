#!/usr/bin/env python3
"""One-shot discovery probe: bank list/sitemap surfaces + forum public vs login.

Discovery only — no product fan-out scrape.
"""

from __future__ import annotations

import json
import re
import ssl
import time
import urllib.error
import urllib.request
from pathlib import Path
from urllib.parse import urljoin

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "homeassistant" / "data" / "_probe_discovery_2026-08-08.json"

UA = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}
CTX = ssl.create_default_context()

BANKS = [
    (
        "Alchimia",
        "https://www.alchimiaweb.com/",
        [
            "https://www.alchimiaweb.com/en/feminized-cannabis-seeds-tag-2/",
            "https://www.alchimiaweb.com/en/",
        ],
        re.compile(
            r"https?://(?:www\.)?alchimiaweb\.com/(?:en/)?[a-z0-9\-]+-\d+\.html",
            re.I,
        ),
    ),
    (
        "Attitude Seedbank",
        "https://www.attitudeseedbank.com/",
        [
            "https://www.attitudeseedbank.com/",
            "https://www.attitudeseedbank.com/feminized-cannabis-seeds",
        ],
        re.compile(r"https?://(?:www\.)?attitudeseedbank\.com/[a-z0-9\-]+", re.I),
    ),
    (
        "Beaver Seeds",
        "https://www.beaverseeds.com/",
        [
            "https://www.beaverseeds.com/collections/all",
            "https://www.beaverseeds.com/collections/feminized-seeds",
        ],
        re.compile(
            r"https?://(?:www\.)?beaverseeds\.com/products/[a-z0-9\-]+", re.I
        ),
    ),
    (
        "Crop King Seeds",
        "https://www.cropkingseeds.com/",
        [
            "https://www.cropkingseeds.com/feminized-seeds/",
            "https://www.cropkingseeds.com/collections/all",
            "https://www.cropkingseeds.com/",
        ],
        re.compile(
            r"https?://(?:www\.)?cropkingseeds\.com/(?:[a-z0-9\-]+/)+[a-z0-9\-]+-seeds?/",
            re.I,
        ),
    ),
    (
        "DC Seed Exchange",
        "https://dcseedexchange.com/",
        ["https://dcseedexchange.com/collections/all"],
        re.compile(
            r"https?://(?:www\.)?dcseedexchange\.com/products/[a-z0-9\-]+", re.I
        ),
    ),
    (
        "Great Lakes Genetics",
        "https://greatlakesgenetics.com/",
        ["https://greatlakesgenetics.com/collections/all"],
        re.compile(
            r"https?://(?:www\.)?greatlakesgenetics\.com/products/[a-z0-9\-]+",
            re.I,
        ),
    ),
    (
        "Greenhouse Seed Company",
        "https://www.greenhouseseeds.nl/",
        [
            "https://www.greenhouseseeds.nl/feminised-seeds",
            "https://www.greenhouseseeds.nl/seeds",
            "https://www.greenhouseseeds.nl/",
        ],
        re.compile(r"https?://(?:www\.)?greenhouseseeds\.nl/[a-z0-9\-]+", re.I),
    ),
    (
        "Growers Choice Seeds",
        "https://growerschoiceseeds.com/",
        ["https://growerschoiceseeds.com/collections/all"],
        re.compile(
            r"https?://(?:www\.)?growerschoiceseeds\.com/products/[a-z0-9\-]+",
            re.I,
        ),
    ),
    (
        "Herbies",
        "https://herbiesheadshop.com/",
        ["https://herbiesheadshop.com/us/feminized-cannabis-seeds"],
        re.compile(
            r"https?://(?:www\.)?herbiesheadshop\.com/(?:[a-z]{2}/)?cannabis-seeds/[a-z0-9\-]+",
            re.I,
        ),
    ),
    (
        "ILGM",
        "https://ilgm.com/",
        [
            "https://ilgm.com/collections/feminized-seeds",
            "https://ilgm.com/collections/all",
        ],
        re.compile(r"https?://(?:www\.)?ilgm\.com/products/[a-z0-9\-]+", re.I),
    ),
    (
        "Multiverse Beans",
        "https://www.multiversebeans.com/",
        ["https://www.multiversebeans.com/collections/all"],
        re.compile(
            r"https?://(?:www\.)?multiversebeans\.com/products/[a-z0-9\-]+", re.I
        ),
    ),
    (
        "Neptune Seed Bank",
        "https://neptuneseedbank.com/",
        ["https://neptuneseedbank.com/collections/all"],
        re.compile(
            r"https?://(?:www\.)?neptuneseedbank\.com/products/[a-z0-9\-]+", re.I
        ),
    ),
    (
        "North Atlantic Seed Co",
        "https://northatlanticseed.com/",
        [
            "https://northatlanticseed.com/collections/all",
            "https://northatlanticseed.com/",
        ],
        re.compile(
            r"https?://(?:www\.)?northatlanticseed\.com/products/[a-z0-9\-]+",
            re.I,
        ),
    ),
    (
        "Oregon Elite Seeds",
        "https://oregoneliteseeds.com/",
        ["https://oregoneliteseeds.com/collections/all"],
        re.compile(
            r"https?://(?:www\.)?oregoneliteseeds\.com/products/[a-z0-9\-]+",
            re.I,
        ),
    ),
    (
        "Organic Earth",
        "https://organicearthseeds.com/",
        [
            "https://organicearthseeds.com/collections/all",
            "https://organicearthseeds.com/",
        ],
        re.compile(
            r"https?://(?:www\.)?organicearthseeds\.com/products/[a-z0-9\-]+",
            re.I,
        ),
    ),
    (
        "Pacific Seed Bank",
        "https://pacificseedbank.com/",
        ["https://pacificseedbank.com/collections/all"],
        re.compile(
            r"https?://(?:www\.)?pacificseedbank\.com/products/[a-z0-9\-]+", re.I
        ),
    ),
    (
        "Quebec Cannabis Seeds",
        "https://quebeccannabisseeds.com/",
        ["https://quebeccannabisseeds.com/collections/all"],
        re.compile(
            r"https?://(?:www\.)?quebeccannabisseeds\.com/products/[a-z0-9\-]+",
            re.I,
        ),
    ),
    (
        "Seed City",
        "https://www.seed-city.com/",
        [
            "https://www.seed-city.com/",
            "https://www.seed-city.com/feminised-cannabis-seeds",
        ],
        re.compile(r"https?://(?:www\.)?seed-city\.com/[a-z0-9\-]+", re.I),
    ),
    (
        "Seedsman",
        "https://www.seedsman.com/",
        [
            "https://www.seedsman.com/us/feminized-seeds",
            "https://www.seedsman.com/us/cannabis-seeds",
            "https://www.seedsman.com/",
        ],
        re.compile(
            r"https?://(?:www\.)?seedsman\.com/(?:[a-z]{2}/)?[a-z0-9\-]+\.html",
            re.I,
        ),
    ),
    (
        "SeedSupreme",
        "https://seedsupreme.com/",
        [
            "https://seedsupreme.com/feminized-seeds.html",
            "https://seedsupreme.com/",
        ],
        re.compile(r"https?://(?:www\.)?seedsupreme\.com/[a-z0-9\-]+\.html", re.I),
    ),
    (
        "True North Seedbank",
        "https://truenorthseedbank.com/",
        ["https://truenorthseedbank.com/collections/all"],
        re.compile(
            r"https?://(?:www\.)?truenorthseedbank\.com/products/[a-z0-9\-]+",
            re.I,
        ),
    ),
    (
        "Weed Seeds Express",
        "https://weedseedsexpress.com/",
        ["https://weedseedsexpress.com/collections/all"],
        re.compile(
            r"https?://(?:www\.)?weedseedsexpress\.com/products/[a-z0-9\-]+",
            re.I,
        ),
    ),
    (
        "Zamnesia",
        "https://www.zamnesia.com/",
        [
            "https://www.zamnesia.com/35-cannabis-seeds",
            "https://www.zamnesia.com/",
        ],
        re.compile(
            r"https?://(?:www\.)?zamnesia\.com/\d+-[a-z0-9\-]+\.html", re.I
        ),
    ),
]

FORUMS = [
    ("420 Magazine", "https://www.420magazine.com/community/"),
    ("Autoflower Network", "https://www.autoflower.org/"),
    ("Cannabis.com Forums", "https://forums.cannabis.com/"),
    ("CannabisCafe 2.0", "https://www.cannabiscafe.net/"),
    ("Cannabisanbauen.net", "https://www.cannabisanbauen.net/"),
    ("Cannaweed", "https://www.cannaweed.com/"),
    ("Chuckersparadise", "https://www.chuckersparadise.com/"),
    ("FCF", "https://forum.cannabisforum.nl/"),
    ("Grasscity", "https://forum.grasscity.com/"),
    ("GreenPassion", "https://www.greenpassion.org/"),
    ("GrowKind", "https://www.growkind.com/"),
    ("Grower.ch", "https://www.grower.ch/"),
    ("Grower.cz", "https://www.grower.cz/"),
    ("Growery", "https://www.growery.org/"),
    ("ICMag", "https://www.icmag.com/forums/"),
    ("Jointjedraaien.nl", "https://www.jointjedraaien.nl/"),
    ("Lamarihuana", "https://www.lamarihuana.com/foros/"),
    ("Marijuana Growing Forums", "https://www.marijuanagrowing.com/"),
    ("Marijuana Passion", "https://www.marijuanapassion.com/"),
    ("Mr.Nice", "https://www.mrnice.nl/forum/"),
    ("OZ Stoners", "https://www.ozstoners.com/"),
    ("Olkpeace", "https://olkpeace.org/"),
    ("OpenGrow", "https://www.opengrow.com/"),
    ("Overgrow", "https://www.overgrow.com/"),
    ("Phenohunter", "https://phenohunter.org/"),
    ("Reddit Cannabis", "https://www.reddit.com/r/cannabis/"),
    ("Rollitup", "https://www.rollitup.org/"),
    ("Sensi Seeds Forums", "https://forum.sensiseeds.com/"),
    ("Strain Hunters", "https://www.strainhunters.com/"),
    ("Swecan", "https://www.swecan.org/"),
    ("THCfarmer", "https://www.thcfarmer.com/"),
    ("THCtalk", "https://www.thctalk.com/"),
    ("The Green Circle", "https://www.thegreencircle.org/"),
    ("UK420", "https://www.uk420.com/"),
    ("Wiet Forum NL", "https://www.wietforum.nl/"),
]

LOGIN_MARKERS = re.compile(
    r"(must\s+be\s+logged|please\s+log\s*in|login\s+required|"
    r"sign\s*in\s+to\s+(?:view|continue|read)|you\s+must\s+(?:register|log)|"
    r"members?\s+only|create\s+an\s+account\s+to\s+view)",
    re.I,
)
PUBLIC_MARKERS = re.compile(
    r"(thread|topic|forum|posts?|replies|strain|grow\s*log|journal|"
    r"viewforum|showthread|threads/|/t/)",
    re.I,
)
BOT_MARKERS = re.compile(
    r"(cf-browser-verification|just a moment|attention required|captcha|"
    r"access denied|cloudflare|datadome|perimeterx|akamai)",
    re.I,
)
PARK_MARKERS = re.compile(
    r"(hugedomains|godaddy|domain\s+for\s+sale|this\s+domain\s+is\s+for\s+sale|"
    r"parked\s+free|sedo\.com|dan\.com)",
    re.I,
)
SHOPIFY = re.compile(r"(cdn\.shopify\.com|Shopify\.theme|/products/)", re.I)
MUST_LOGIN = re.compile(
    r"(must\s+be\s+logged|login\s+required|please\s+log\s*in\s+to\s+view|"
    r"you\s+do\s+not\s+have\s+permission|register\s+to\s+read)",
    re.I,
)


def fetch(url: str, timeout: int = 25):
    req = urllib.request.Request(url, headers=UA)
    try:
        with urllib.request.urlopen(req, timeout=timeout, context=CTX) as resp:
            body = resp.read(350_000)
            return (
                resp.status,
                resp.geturl(),
                body.decode("utf-8", "replace"),
                resp.headers.get("Content-Type", ""),
                None,
            )
    except urllib.error.HTTPError as e:
        body = e.read(120_000).decode("utf-8", "replace") if e.fp else ""
        ctype = e.headers.get("Content-Type", "") if e.headers else ""
        return e.code, url, body, ctype, str(e)
    except Exception as e:  # noqa: BLE001
        return None, url, "", "", str(e)


def sitemap_urls(base: str) -> list[str]:
    out: list[str] = []
    for path in ("/robots.txt", "/sitemap.xml", "/sitemap_index.xml"):
        code, final, body, _, _err = fetch(urljoin(base, path))
        if code != 200 or not body:
            continue
        if path.endswith("robots.txt"):
            for m in re.finditer(r"(?im)^Sitemap:\s*(\S+)", body):
                out.append(m.group(1).strip())
        else:
            out.append(final)
            out.extend(re.findall(r"<loc>([^<]+)</loc>", body)[:8])
    seen: set[str] = set()
    uniq: list[str] = []
    for u in out:
        if u not in seen:
            seen.add(u)
            uniq.append(u)
    return uniq[:12]


def count_products(html: str, page_url: str, cre: re.Pattern):
    found: set[str] = set()
    for m in cre.finditer(html):
        found.add(m.group(0).split("#")[0].split("?")[0])
    for m in re.finditer(r'href=["\']([^"\']+)["\']', html, re.I):
        abs_u = urljoin(page_url, m.group(1)).split("#")[0].split("?")[0]
        if cre.match(abs_u):
            found.add(abs_u)
    shop = set(re.findall(r"/products/[a-z0-9\-]+", html, re.I))
    return len(found), sorted(found)[:5], len(shop)


def probe_banks() -> list[dict]:
    results: list[dict] = []
    print("=== BANKS ===")
    for name, home, lists, cre in BANKS:
        row: dict = {
            "name": name,
            "home": home,
            "list_ok": [],
            "list_fail": [],
            "product_hits": 0,
            "sample": [],
            "shopify_paths": 0,
            "sitemaps": [],
            "flags": [],
            "platform": "unknown",
        }
        code, final, body, _ctype, err = fetch(home)
        row["home_status"] = code
        row["home_final"] = final
        if err and code is None:
            row["flags"].append(f"home_err:{err[:80]}")
        elif body:
            if PARK_MARKERS.search(body):
                row["flags"].append("parked")
            if BOT_MARKERS.search(body) and (
                code in (403, 503, 429) or "just a moment" in body.lower()
            ):
                row["flags"].append("bot_wall")
            if SHOPIFY.search(body):
                row["platform"] = "shopify"
                row["flags"].append("shopify")
            if "prestashop" in body.lower() or "PrestaShop" in body:
                row["platform"] = "prestashop"
            if "Magento" in body or "mage/" in body.lower():
                row["platform"] = "magento"
            if "/wp-content/" in body or "wordpress" in body.lower():
                if row["platform"] == "unknown":
                    row["platform"] = "wordpress"

        best_hits = 0
        best_sample: list[str] = []
        best_shop = 0
        for lp in lists:
            code, final, body, _ctype, err = fetch(lp)
            entry: dict = {"url": lp, "status": code, "final": final, "err": err}
            ok = (
                code == 200
                and body
                and not (
                    BOT_MARKERS.search(body) and "just a moment" in body.lower()
                )
            )
            if ok:
                hits, sample, shop = count_products(body, final or lp, cre)
                entry["hits"] = hits
                entry["shopify_paths"] = shop
                entry["sample"] = sample
                row["list_ok"].append(entry)
                if hits > best_hits:
                    best_hits, best_sample = hits, sample
                if shop > best_shop:
                    best_shop = shop
                if SHOPIFY.search(body):
                    row["platform"] = "shopify"
            else:
                if body and BOT_MARKERS.search(body):
                    entry["bot"] = True
                    row["flags"].append("list_bot_wall")
                if body and PARK_MARKERS.search(body):
                    row["flags"].append("parked")
                row["list_fail"].append(entry)
            time.sleep(0.35)

        row["product_hits"] = best_hits
        row["sample"] = best_sample
        row["shopify_paths"] = best_shop

        try:
            sms = sitemap_urls(home)
            row["sitemaps"] = sms
            for sm in sms:
                if "product" not in sm.lower() and "sitemap" not in sm.lower():
                    continue
                code, _final, body, _, _err = fetch(sm)
                if code == 200 and body:
                    locs = re.findall(r"<loc>([^<]+)</loc>", body)
                    prod = [
                        u
                        for u in locs
                        if "/products/" in u
                        or cre.search(u)
                        or u.endswith(".html")
                    ]
                    row["sitemap_loc_count"] = len(locs)
                    row["sitemap_productish"] = len(prod)
                    row["sitemap_sample"] = prod[:5] or locs[:5]
                    break
                time.sleep(0.2)
        except Exception as e:  # noqa: BLE001
            row["flags"].append(f"sitemap_err:{e}")

        score = 0
        if row["product_hits"] >= 20:
            score += 40
        elif row["product_hits"] >= 5:
            score += 25
        elif row["product_hits"] >= 1:
            score += 10
        if row.get("sitemap_productish", 0) >= 50:
            score += 30
        elif row.get("sitemap_productish", 0) >= 10:
            score += 20
        elif row.get("sitemap_loc_count", 0) >= 10:
            score += 10
        # Shopify path count is often stronger than absolute product_re hits
        if row["shopify_paths"] >= 20:
            score += 25
        elif row["shopify_paths"] >= 5:
            score += 15
        if row["platform"] == "shopify":
            score += 10
        if "parked" in row["flags"]:
            score -= 50
        if "bot_wall" in row["flags"] or "list_bot_wall" in row["flags"]:
            score -= 25
        if row["home_status"] in (403, 401, 503):
            score -= 20
        if not row["list_ok"] and row["list_fail"]:
            score -= 10
        row["score"] = score
        # de-dupe flags
        row["flags"] = sorted(set(row["flags"]))
        results.append(row)
        print(
            f"{name:28} score={score:3} home={row['home_status']} "
            f"plat={row['platform']:10} hits={best_hits:3} shop={best_shop:3} "
            f"sm_prod={row.get('sitemap_productish', '-')} flags={row['flags'][:5]}"
        )
        time.sleep(0.25)
    return results


def probe_forums() -> list[dict]:
    results: list[dict] = []
    print("\n=== FORUMS ===")
    for name, url in FORUMS:
        code, final, body, _ctype, err = fetch(url)
        flags: list[str] = []
        if err and code is None:
            flags.append(f"err:{err[:60]}")
        low = (body or "").lower()
        if body and PARK_MARKERS.search(body):
            flags.append("parked")
        if body and BOT_MARKERS.search(body) and (
            code in (403, 503, 429) or "just a moment" in low
        ):
            flags.append("bot_wall")
        loginish = bool(body and LOGIN_MARKERS.search(body))
        publicish = bool(body and PUBLIC_MARKERS.search(body))
        thread_links = len(
            re.findall(
                r"(?:threads?/|showthread\.php|viewtopic\.php|/t/[0-9]|/forum/|/forums/)",
                body or "",
                re.I,
            )
        )
        must_login = bool(body and MUST_LOGIN.search(body))
        platform = "unknown"
        if "data-xf-init" in (body or "") or "XenForo" in (body or ""):
            platform = "xenforo"
        elif "vbulletin" in low or "vBulletin" in (body or ""):
            platform = "vbulletin"
        elif "phpbb" in low or "phpBB" in (body or ""):
            platform = "phpbb"
        elif "discourse" in low:
            platform = "discourse"
        elif "reddit.com" in url:
            platform = "reddit"

        yield_score = 0
        if code == 200 and publicish and not must_login:
            yield_score += 40
        if thread_links >= 20:
            yield_score += 30
        elif thread_links >= 5:
            yield_score += 15
        if platform in ("xenforo", "vbulletin", "phpbb", "discourse"):
            yield_score += 10
        if platform == "reddit":
            yield_score += 20
        if must_login:
            yield_score -= 35
            flags.append("login_wall")
        elif loginish and thread_links < 3:
            yield_score -= 15
            flags.append("login_heavy")
        if "bot_wall" in flags:
            yield_score -= 25
        if "parked" in flags or code in (404, 410) or code is None:
            yield_score -= 40
            if code in (404, 410):
                flags.append("dead")
        if code in (403, 401):
            flags.append(f"http_{code}")
            yield_score -= 20
        strain_hits = len(
            re.findall(
                r"\b(strain|phenotype|phenohunt|grow\s*log|genetics|breeder)\b",
                body or "",
                re.I,
            )
        )
        if strain_hits >= 10:
            yield_score += 10
        row = {
            "name": name,
            "url": url,
            "status": code,
            "final": final,
            "platform": platform,
            "thread_links": thread_links,
            "strain_hits": strain_hits,
            "must_login": must_login,
            "flags": flags,
            "yield_score": yield_score,
        }
        results.append(row)
        print(
            f"{name:28} y={yield_score:3} http={code} plat={platform:10} "
            f"threads={thread_links:3} strain={strain_hits:3} flags={flags}"
        )
        time.sleep(0.3)
    return results


def main() -> int:
    banks = probe_banks()
    forums = probe_forums()
    out = {
        "built_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "note": "discovery-only probe; no product fan-out",
        "banks": sorted(banks, key=lambda r: -r["score"]),
        "forums": sorted(forums, key=lambda r: -r["yield_score"]),
    }
    OUT.write_text(json.dumps(out, indent=2), encoding="utf-8")
    print("\nWrote", OUT)
    print("\nTOP BANKS:")
    for r in out["banks"][:8]:
        print(
            " ",
            r["score"],
            r["name"],
            "hits",
            r["product_hits"],
            "shop",
            r["shopify_paths"],
            "sm",
            r.get("sitemap_productish"),
            r["flags"],
        )
    print("TOP FORUMS:")
    for r in out["forums"][:8]:
        print(
            " ",
            r["yield_score"],
            r["name"],
            r["flags"],
            "threads",
            r["thread_links"],
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
