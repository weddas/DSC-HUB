"""Probe Anubis PoW pass then strain page (one-shot)."""
from __future__ import annotations

import hashlib
import json
import re
import time

from curl_cffi import requests

UA_IMPERSONATE = "chrome131"
BASE = "https://strain-database.com"
TARGET = f"{BASE}/strain/blue-dream"


def is_anubis(html: str) -> bool:
    return "anubis_challenge" in (html or "") and "Verifying you" in (html or "")


def is_cf(html: str, status: int) -> bool:
    low = (html or "").lower()
    if status == 403 and ("just a moment" in low or "cf-browser-verification" in low):
        return True
    if "just a moment..." in (html or "")[:900].lower():
        return True
    return False


def parse_challenge(html: str) -> dict:
    m = re.search(r'<script id="anubis_challenge"[^>]*>(.*?)</script>', html or "", re.S)
    if not m:
        raise RuntimeError("no anubis_challenge")
    return json.loads(m.group(1).strip())


def solve_fast(random_data: str, difficulty: int) -> tuple[int, str, float]:
    t0 = time.time()
    nonce = 0
    prefix = "0" * int(difficulty)
    while True:
        digest = hashlib.sha256(f"{random_data}{nonce}".encode()).hexdigest()
        if digest.startswith(prefix):
            return nonce, digest, time.time() - t0
        nonce += 1


def main() -> None:
    s = requests.Session()
    r = s.get(TARGET, impersonate=UA_IMPERSONATE, timeout=45)
    print(
        "initial",
        r.status_code,
        "len",
        len(r.text),
        "cf?",
        is_cf(r.text, r.status_code),
        "anubis?",
        is_anubis(r.text),
    )
    r0 = s.get(BASE + "/", impersonate=UA_IMPERSONATE, timeout=45)
    print(
        "home",
        r0.status_code,
        "anubis?",
        is_anubis(r0.text),
        "cf?",
        is_cf(r0.text, r0.status_code),
    )
    if not is_anubis(r0.text):
        print("home body head:", r0.text[:400])
        return
    doc = parse_challenge(r0.text)
    ch = doc.get("challenge") or doc
    rules = doc.get("rules") or {}
    difficulty = int(ch.get("difficulty") or rules.get("difficulty") or 2)
    random_data = ch["randomData"]
    cid = ch["id"]
    print("challenge id", cid, "diff", difficulty, "method", ch.get("method"))
    nonce, digest, elapsed = solve_fast(random_data, difficulty)
    print("solved nonce", nonce, "hash", digest[:20], "in", round(elapsed, 3), "s")
    elapsed_ms = max(1, int(elapsed * 1000))
    from urllib.parse import quote

    pass_url = (
        f"{BASE}/.within.website/x/cmd/anubis/api/pass-challenge"
        f"?id={quote(cid)}&response={digest}&nonce={nonce}"
        f"&redir={quote(TARGET, safe='')}&elapsedTime={elapsed_ms}"
    )
    rp = s.get(pass_url, impersonate=UA_IMPERSONATE, timeout=45, allow_redirects=True)
    print("pass status", rp.status_code, "final", rp.url, "len", len(rp.text))
    print("cookies", s.cookies.get_dict())
    print(
        "pass anubis?",
        is_anubis(rp.text),
        "pass cf?",
        is_cf(rp.text, rp.status_code),
    )
    print("pass title snip:", (rp.text[rp.text.find("<title>") : rp.text.find("</title>") + 8] if "<title>" in rp.text else "none"))
    r2 = s.get(TARGET, impersonate=UA_IMPERSONATE, timeout=45)
    print(
        "retry",
        r2.status_code,
        "len",
        len(r2.text),
        "anubis?",
        is_anubis(r2.text),
        "cf?",
        is_cf(r2.text, r2.status_code),
    )
    print(r2.text[:600])


if __name__ == "__main__":
    main()
