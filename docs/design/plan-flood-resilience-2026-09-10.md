# Plan — Brain flood / overload resilience

**Date:** 2026-09-10
**Status:** Design / not started — **reliability spine**
**Tracker rows:** "A browser tab left open on Alerts rebooted the hub"; "SPA flood reboots the hub"; "refreshComputed queues without coalescing (~17 req/s bursts)"; "/fleet has no polling fallback"
**Author:** live-8.2.0 walkthrough

---

## 1. Scope note — what's already done

The **SQLite durability** worry is largely resolved and is *not* this spec: `db.py` now provides one `open_db` (WAL + `busy_timeout` + Row) and `schema_once`, and direct `sqlite3.connect` sites are down to ~4 (from the tracked 16). The `db.py` docstring itself records that the 2026-09-09 outage "traced to **request flooding**, not to SQLite." So the remaining reliability spine is **overload resilience**, below. (Leftover: migrate the last 2 direct-connect stragglers — `factory_reset.py`, `integrations.py` — onto `open_db`; small, not part of this design.)

## 2. Problem

An open dashboard — or several, or one wedged/runaway tab, or the planned kiosk view — can flood the hot read endpoints until the brain saturates; the **firmware's ~300 s API-wedge watchdog then reboots the hub**. Verified today: `GET /fleet/computed` (`api.py:773`) has **no server-side cache or throttle** — every call recomputes, and the SPA polls it (root poll was moved to 30 s in `a782aa7`, but bursts and multiple tabs still stack). The operator shares this rig's IP, so a stray tab is a real, recurring outage cause.

**Design intent:** the brain must be *un-saturatable into the hub-reboot chain regardless of client behaviour* — the protection cannot depend on every client being well-behaved.

## 3. Design (server-side, client-independent)

### 3.1 Compute-once cache for the hot reads
- `/fleet/computed` (and `/fleet`, `/grow-log`) recompute **at most once per T** (e.g. 2–5 s) and serve the cached snapshot to every caller inside that window (single-flight / memoize). **N concurrent tabs cost one recompute, not N.** The snapshot already updates on the ingest/control tick, so serving cached is correct, not stale-in-a-bad-way.

### 3.2 No request handler may drive the hub or the control engine
- The control/ingest tick already runs on its own timer (control-plane review + the "automation engine only ticked while a browser watched" fix). **Assert** that no GET path triggers a hub round-trip or a control recompute — reads only read last-computed state. Add a test/guard so this can't regress.

### 3.3 Rate-limit + coalesce the hot endpoints
- Per-connection/IP token bucket on `/fleet/computed`, `/fleet`, `/grow-log`; beyond a sane rate, serve last-good (or 429) cheaply instead of recomputing. Coalesce client bursts (the tracked ~17 req/s `refreshComputed` storm).

### 3.4 One fan-out: prefer the WebSocket, make it O(1) per tick
- `/ws/fleet` already broadcasts the snapshot; the per-connection control-engine re-run was fixed. Keep WS the primary fan-out (one compute → many sockets), HTTP polling the fallback. Ensure broadcast cost is O(1) in connection count.

### 3.5 Protect the hub API path specifically
- Any brain→hub round-trip / control write goes through a rate-limited, single-writer queue (ties to the irrigation/appliance **arbiter**), so neither a read flood nor a write burst can block the firmware's API into its 300 s reboot.

## 4. Balance with the opposite failure

Don't over-correct into the tracked "**/fleet has no polling fallback — when the WebSocket drops the snapshot freezes**" bug. The design must: WS primary; on WS drop, HTTP polling resumes at a **sane, rate-limited** cadence (not a reconnect storm); and the UI must show data age so a frozen/last-good snapshot is never mistaken for live (the freshness/age chips already exist).

## 5. Observability (see it before it bites)

- A lightweight "brain load" signal: requests/s, recompute rate, hub round-trip latency, WS connection count — surfaced on Settings › System (or Alerts).
- An alert when approaching saturation (before the 300 s wedge), so a runaway tab is caught early rather than as a hub reboot.

## 6. Edge cases

| Case | Handling |
|---|---|
| Many legitimate tabs (kiosk + phone + desk) | cache + WS fan-out make this cheap; that's the point |
| Runaway/wedged tab hammering HTTP | rate-limit → last-good/429, no recompute, no hub impact |
| WS drop | HTTP fallback at a capped cadence; data-age chip visible |
| A script/integration polling fast | same server-side limits apply (protection is not client-trust) |
| Cache TTL vs live feel | TTL small enough (2–5 s) that the UI still feels live; WS pushes keep it fresh |
| Brain restart | caches cold, rebuild on first tick; no thundering herd (single-flight) |

## 7. Test plan

- Load test: simulate M tabs × high req/s on `/fleet/computed`; assert recompute count stays ≈ 1 per T (not per request), hub round-trip latency stays healthy, and **no 300 s wedge / reboot**.
- Guard test: no GET handler triggers a hub call or control recompute (static + runtime assertion).
- WS-drop test: dropping the socket resumes HTTP at the capped cadence without a storm; data-age chip reflects staleness.
- Regression: the Alerts-desk-left-open scenario that rebooted the hub no longer does.

## 8. Open questions (operator's call)

1. Cache TTL for `/fleet/computed` (2 s vs 5 s) — how live must the desks feel?
2. Rate-limit thresholds per endpoint, and 429 vs silently-serve-last-good?
3. Hard cap on concurrent WS/SSE connections?
4. Where to surface the "brain load" signal — System, Alerts, or a small always-visible chip?
