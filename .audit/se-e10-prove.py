import json
import urllib.request

BASE = "http://127.0.0.1:8787"


def req(method, path, body=None):
    data = None
    headers = {}
    if body is not None:
        data = json.dumps(body).encode()
        headers["Content-Type"] = "application/json"
    r = urllib.request.Request(BASE + path, data=data, headers=headers, method=method)
    with urllib.request.urlopen(r, timeout=30) as resp:
        return resp.status, json.loads(resp.read().decode() or "{}")


st, before = req("GET", "/energy/tariff")
print("tariff_before", st, before)
st, put = req("PUT", "/energy/tariff", {"band_id": "peak", "rate_per_kwh": 0.45})
print("tariff_put", st, put)
st, learn = req("PATCH", "/energy/learning", {"enabled": True, "prefer_growth_outliers": True})
print("learning", st, learn)
st, after = req("GET", "/energy/learning")
print("learning_get", st, after)
st, t2 = req("GET", "/energy/tariff")
peak = next(b for b in t2["bands"] if b["band_id"] == "peak")
print("peak_rate", peak["rate_per_kwh"])
