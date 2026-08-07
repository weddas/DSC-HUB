#!/usr/bin/env python3
"""Export Chrome cookies for a domain (Windows DPAPI / AES-GCM).

Reads Chrome's Cookies SQLite (Default / Profile N), copies to a temp file when
Chrome locks the live DB, decrypts values with CryptUnprotectData + AES-GCM,
and writes a jar JSON the strain-database scraper can load.

Never opens chrome:// URLs.

Usage:
  python scripts/chrome_cookies_for_domain.py
  python scripts/chrome_cookies_for_domain.py --domain strain-database.com
  python scripts/chrome_cookies_for_domain.py --cookies-db "D:\\copy\\Cookies"
"""

from __future__ import annotations

import argparse
import base64
import ctypes
import ctypes.wintypes as wintypes
import json
import os
import shutil
import sqlite3
import sys
import tempfile
import time
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "homeassistant" / "data"

DEFAULT_DOMAIN = "strain-database.com"
OUT_PRIMARY = DATA / "_strain_database_cookies.json"
OUT_SCRAPER = DATA / "dsc_strains_straindatabase.cookies.json"

try:
    from cryptography.hazmat.primitives.ciphers.aead import AESGCM
except ImportError as exc:  # pragma: no cover
    raise SystemExit("cryptography package required (pip install cryptography)") from exc


class DATA_BLOB(ctypes.Structure):
    _fields_ = [
        ("cbData", wintypes.DWORD),
        ("pbData", ctypes.POINTER(ctypes.c_char)),
    ]


def dpapi_unprotect(data: bytes) -> bytes:
    """Decrypt with Windows CryptUnprotectData (same user session)."""
    if not data:
        return b""
    buf = ctypes.create_string_buffer(data)
    blob_in = DATA_BLOB(len(data), ctypes.cast(buf, ctypes.POINTER(ctypes.c_char)))
    blob_out = DATA_BLOB()
    crypt32 = ctypes.windll.crypt32
    kernel32 = ctypes.windll.kernel32
    ok = crypt32.CryptUnprotectData(
        ctypes.byref(blob_in),
        None,
        None,
        None,
        None,
        0,
        ctypes.byref(blob_out),
    )
    if not ok:
        err = ctypes.get_last_error()
        raise OSError(f"CryptUnprotectData failed (winerr={err})")
    try:
        return ctypes.string_at(blob_out.pbData, blob_out.cbData)
    finally:
        kernel32.LocalFree(blob_out.pbData)


def chrome_user_data_dir() -> Path:
    local = os.environ.get("LOCALAPPDATA") or ""
    if not local:
        raise FileNotFoundError("LOCALAPPDATA not set")
    return Path(local) / "Google" / "Chrome" / "User Data"


def load_chrome_aes_key(user_data: Path) -> bytes:
    local_state_path = user_data / "Local State"
    if not local_state_path.is_file():
        raise FileNotFoundError(f"Chrome Local State missing: {local_state_path}")
    doc = json.loads(local_state_path.read_text(encoding="utf-8"))
    enc_b64 = (doc.get("os_crypt") or {}).get("encrypted_key")
    if not enc_b64:
        raise RuntimeError("Local State os_crypt.encrypted_key missing")
    enc = base64.b64decode(enc_b64)
    if not enc.startswith(b"DPAPI"):
        raise RuntimeError(f"Unexpected encrypted_key prefix: {enc[:8]!r}")
    return dpapi_unprotect(enc[5:])


def decrypt_cookie_value(encrypted_value: bytes, aes_key: bytes) -> str:
    raw = bytes(encrypted_value or b"")
    if not raw:
        return ""
    # Legacy: entire blob is DPAPI (pre-Chrome 80)
    if raw[:3] not in (b"v10", b"v11", b"v20"):
        return dpapi_unprotect(raw).decode("utf-8")
    # Chrome 80+: AES-GCM after 3-byte version prefix
    nonce, ciphertext = raw[3:15], raw[15:]
    plain = AESGCM(aes_key).decrypt(nonce, ciphertext, None)
    # Newer Chrome may prepend a 32-byte host/path hash
    if len(plain) > 32:
        try:
            return plain[32:].decode("utf-8")
        except UnicodeDecodeError:
            pass
    return plain.decode("utf-8", "replace")


def iter_profile_cookie_dbs(user_data: Path) -> list[Path]:
    out: list[Path] = []
    for name in ("Default", *[f"Profile {i}" for i in range(1, 16)]):
        prof = user_data / name
        if not prof.is_dir():
            continue
        for rel in ("Network/Cookies", "Cookies"):
            p = prof / rel
            if p.is_file():
                out.append(p)
                break
    return out


def _copy_via_createfile(src: Path, dst: Path) -> None:
    """Best-effort shared read via Win32 CreateFileW."""
    GENERIC_READ = 0x80000000
    FILE_SHARE_ALL = 0x00000007  # READ|WRITE|DELETE
    OPEN_EXISTING = 3
    FILE_ATTRIBUTE_NORMAL = 0x80
    INVALID = wintypes.HANDLE(-1).value

    kernel32 = ctypes.WinDLL("kernel32", use_last_error=True)
    CreateFileW = kernel32.CreateFileW
    CreateFileW.argtypes = [
        wintypes.LPCWSTR,
        wintypes.DWORD,
        wintypes.DWORD,
        wintypes.LPVOID,
        wintypes.DWORD,
        wintypes.DWORD,
        wintypes.HANDLE,
    ]
    CreateFileW.restype = wintypes.HANDLE

    h = CreateFileW(
        str(src),
        GENERIC_READ,
        FILE_SHARE_ALL,
        None,
        OPEN_EXISTING,
        FILE_ATTRIBUTE_NORMAL,
        None,
    )
    if h == INVALID or h is None:
        raise OSError(f"CreateFileW failed winerr={ctypes.get_last_error()}")
    try:
        size = wintypes.LARGE_INTEGER()
        if not kernel32.GetFileSizeEx(h, ctypes.byref(size)):
            raise OSError(f"GetFileSizeEx failed winerr={ctypes.get_last_error()}")
        n = int(size.value)
        buf = (ctypes.c_char * n)()
        read = wintypes.DWORD()
        if not kernel32.ReadFile(h, buf, n, ctypes.byref(read), None):
            raise OSError(f"ReadFile failed winerr={ctypes.get_last_error()}")
        dst.write_bytes(bytes(buf[: int(read.value)]))
    finally:
        kernel32.CloseHandle(h)


def copy_cookies_db(src: Path, dst: Path) -> str:
    """Copy Cookies DB to dst. Returns method name used."""
    errors: list[str] = []
    # 1) shutil (works when Chrome releases share)
    try:
        shutil.copy2(src, dst)
        return "shutil.copy2"
    except OSError as exc:
        errors.append(f"shutil:{exc}")

    # 2) binary open (Python share mode)
    try:
        data = src.read_bytes()
        dst.write_bytes(data)
        return "Path.read_bytes"
    except OSError as exc:
        errors.append(f"read_bytes:{exc}")

    # 3) CreateFile shared
    try:
        _copy_via_createfile(src, dst)
        return "CreateFileW"
    except OSError as exc:
        errors.append(f"CreateFileW:{exc}")

    # 4) cmd copy
    try:
        import subprocess

        r = subprocess.run(
            ["cmd", "/c", "copy", "/Y", str(src), str(dst)],
            capture_output=True,
            text=True,
            check=False,
        )
        if r.returncode == 0 and dst.is_file() and dst.stat().st_size > 0:
            return "cmd.copy"
        errors.append(f"cmd.copy:rc={r.returncode} {r.stderr.strip()}")
    except OSError as exc:
        errors.append(f"cmd.copy:{exc}")

    raise PermissionError(
        "Chrome Cookies DB is locked (Chrome has exclusive access). "
        "Close Chrome briefly, then re-run this script. "
        f"Attempts: {'; '.join(errors)}"
    )


def chrome_expires_to_unix(expires_utc: int) -> int | None:
    # Chrome stores microseconds since 1601-01-01.
    if not expires_utc or expires_utc <= 0:
        return None
    unix = int(expires_utc / 1_000_000) - 11_644_473_600
    return unix if unix > 0 else None


def read_domain_cookies(
    cookies_db: Path,
    *,
    domain: str,
    aes_key: bytes,
) -> list[dict[str, Any]]:
    td = Path(tempfile.mkdtemp(prefix="chrome_cookies_"))
    try:
        local = td / "Cookies"
        method = copy_cookies_db(cookies_db, local)
        # Side files help SQLite recovery if WAL was mid-write (best-effort).
        for extra in ("Cookies-journal", "Cookies-wal", "Cookies-shm"):
            side = cookies_db.parent / extra
            if side.is_file() and side.stat().st_size > 0:
                try:
                    copy_cookies_db(side, td / extra)
                except PermissionError:
                    pass

        uri = f"file:{local.as_posix()}?mode=ro"
        con = sqlite3.connect(uri, uri=True)
        con.row_factory = sqlite3.Row
        like = f"%{domain}%"
        rows = con.execute(
            "SELECT host_key, name, encrypted_value, value, path, expires_utc, "
            "is_secure, is_httponly, samesite "
            "FROM cookies WHERE host_key LIKE ?",
            (like,),
        ).fetchall()
        con.close()

        out: list[dict[str, Any]] = []
        for r in rows:
            name = str(r["name"] or "")
            if not name:
                continue
            plain = (r["value"] or "") if r["value"] else ""
            if not plain:
                try:
                    plain = decrypt_cookie_value(bytes(r["encrypted_value"] or b""), aes_key)
                except Exception as exc:  # noqa: BLE001
                    plain = ""
                    out.append(
                        {
                            "name": name,
                            "value": "",
                            "domain": r["host_key"],
                            "path": r["path"] or "/",
                            "error": f"decrypt:{exc}",
                        }
                    )
                    continue
            out.append(
                {
                    "name": name,
                    "value": plain,
                    "domain": r["host_key"],
                    "path": r["path"] or "/",
                    "expires": chrome_expires_to_unix(int(r["expires_utc"] or 0)),
                    "secure": bool(r["is_secure"]),
                    "httpOnly": bool(r["is_httponly"]),
                    "sameSite": r["samesite"],
                    "_source_db": str(cookies_db),
                    "_copy_method": method,
                }
            )
        return out
    finally:
        shutil.rmtree(td, ignore_errors=True)


def try_browser_cookie3(domain: str) -> list[dict[str, Any]]:
    try:
        import browser_cookie3  # type: ignore
    except ImportError:
        return []
    try:
        jar = browser_cookie3.chrome(domain_name=domain)
    except Exception as exc:  # noqa: BLE001
        print(f"browser_cookie3 unavailable: {exc}", file=sys.stderr)
        return []
    out: list[dict[str, Any]] = []
    for c in jar:
        out.append(
            {
                "name": c.name,
                "value": c.value,
                "domain": c.domain,
                "path": c.path or "/",
                "expires": int(c.expires) if c.expires else None,
                "secure": bool(c.secure),
                "httpOnly": bool(getattr(c, "rest", {}).get("HttpOnly", False)),
                "_source_db": "browser_cookie3",
                "_copy_method": "browser_cookie3",
            }
        )
    return out


def cookies_to_name_map(cookies: list[dict[str, Any]]) -> dict[str, str]:
    """Last-write wins for duplicate names (prefer longest / most specific later)."""
    jar: dict[str, str] = {}
    for c in cookies:
        name = c.get("name") or ""
        val = c.get("value")
        if not name or val is None or val == "":
            continue
        if c.get("error"):
            continue
        jar[str(name)] = str(val)
    return jar


def write_jars(domain: str, cookies: list[dict[str, Any]], *, outs: list[Path]) -> dict[str, Any]:
    jar = cookies_to_name_map(cookies)
    payload = {
        "domain": domain,
        "saved_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "source": "chrome_cookies_for_domain.py",
        "cookie_count": len(jar),
        "cookies": jar,
        "cookies_detailed": [c for c in cookies if c.get("name")],
    }
    # detailed keeps values for debugging CF clearance; strip secrets from stdout only
    for path in outs:
        path.parent.mkdir(parents=True, exist_ok=True)
        # Scraper jar: name→value only (matches scrape_strain_database.Session)
        if path.name.startswith("dsc_strains_"):
            slim = {
                "domain": domain,
                "saved_at": payload["saved_at"],
                "source": payload["source"],
                "cookies": jar,
            }
            path.write_text(json.dumps(slim, indent=2), encoding="utf-8")
        else:
            path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    return payload


def export_domain(
    *,
    domain: str = DEFAULT_DOMAIN,
    cookies_db: Path | None = None,
    outs: list[Path] | None = None,
) -> dict[str, Any]:
    outs = outs or [OUT_PRIMARY, OUT_SCRAPER]
    cookies: list[dict[str, Any]] = []
    errors: list[str] = []

    # Prefer direct SQLite + DPAPI (no admin). Fall back to browser_cookie3.
    if cookies_db is not None:
        user_data = chrome_user_data_dir()
        aes_key = load_chrome_aes_key(user_data)
        cookies = read_domain_cookies(cookies_db, domain=domain, aes_key=aes_key)
    else:
        user_data = chrome_user_data_dir()
        if not user_data.is_dir():
            raise FileNotFoundError(f"Chrome user data not found: {user_data}")
        aes_key = load_chrome_aes_key(user_data)
        dbs = iter_profile_cookie_dbs(user_data)
        if not dbs:
            errors.append("no Cookies DB under Chrome User Data")
        for db in dbs:
            try:
                cookies.extend(read_domain_cookies(db, domain=domain, aes_key=aes_key))
            except PermissionError as exc:
                errors.append(str(exc))
            except Exception as exc:  # noqa: BLE001
                errors.append(f"{db}: {exc}")

        if not cookies:
            bc3 = try_browser_cookie3(domain)
            if bc3:
                cookies = bc3
                errors.append("used browser_cookie3 fallback")

    if not cookies and any("locked" in e.lower() or "exclusive" in e.lower() for e in errors):
        raise PermissionError(
            errors[0] if errors else "Chrome Cookies DB is locked"
        )

    payload = write_jars(domain, cookies, outs=outs)
    payload["errors"] = errors
    payload["cookie_names"] = sorted((payload.get("cookies") or {}).keys())
    return payload


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description="Export Chrome cookies for a domain (Windows)")
    ap.add_argument("--domain", default=DEFAULT_DOMAIN)
    ap.add_argument(
        "--cookies-db",
        type=Path,
        default=None,
        help="Path to a Cookies SQLite copy (use when live Chrome DB is locked)",
    )
    ap.add_argument(
        "--out",
        type=Path,
        default=OUT_PRIMARY,
        help=f"Primary JSON jar (default: {OUT_PRIMARY})",
    )
    ap.add_argument(
        "--also-scraper-jar",
        type=Path,
        default=OUT_SCRAPER,
        help=f"Also write scraper jar (default: {OUT_SCRAPER})",
    )
    ap.add_argument("--no-scraper-jar", action="store_true")
    args = ap.parse_args(argv)

    outs = [args.out]
    if not args.no_scraper_jar:
        outs.append(args.also_scraper_jar)

    try:
        payload = export_domain(
            domain=args.domain,
            cookies_db=args.cookies_db,
            outs=outs,
        )
    except PermissionError as exc:
        print(f"LOCKED: {exc}", file=sys.stderr)
        print(
            "Close Chrome briefly (or pass --cookies-db after manual copy), "
            "complete the CF challenge in Chrome, then re-run this import.",
            file=sys.stderr,
        )
        return 2
    except Exception as exc:  # noqa: BLE001
        print(f"FAIL: {exc}", file=sys.stderr)
        return 1

    names = payload.get("cookie_names") or []
    print(
        json.dumps(
            {
                "ok": bool(names),
                "domain": payload.get("domain"),
                "cookie_count": payload.get("cookie_count"),
                "cookie_names": names,
                "outs": [str(p) for p in outs],
                "errors": payload.get("errors") or [],
            },
            indent=2,
        )
    )
    if not names:
        print(
            "No cookies found for domain. In Chrome: open https://strain-database.com/ "
            "and pass the Cloudflare check, then re-run (close Chrome if DB locked).",
            file=sys.stderr,
        )
        return 3
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
