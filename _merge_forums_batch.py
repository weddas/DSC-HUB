import subprocess, sys, time, os
families = ["forum_420mag", "forum_phenohunter", "forum_mjpassion"]
results = []
for fam in families:
    ok = False
    for attempt in range(1, 13):
        print(f"\n===== MERGE {fam} attempt={attempt} =====", flush=True)
        t0 = time.time()
        # --no-search/--no-link: keep lock window short; HA indexes deferred per instructions
        proc = subprocess.run(
            [sys.executable, "-u", "scripts/merge_staging_to_master.py",
             "--only", fam, "--no-search", "--no-link"],
            capture_output=True, text=True
        )
        elapsed = round(time.time() - t0, 1)
        out = (proc.stdout or "") + (("\n" + proc.stderr) if proc.stderr else "")
        print(out, flush=True)
        print(f"exit={proc.returncode} elapsed={elapsed}s", flush=True)
        locked = ("locked" in out.lower()) or ("busy" in out.lower()) or proc.returncode not in (0,)
        # treat empty fail as likely lock/crash
        if proc.returncode == 0 and "ok " in out.lower():
            results.append({"family": fam, "ok": True, "attempt": attempt, "elapsed": elapsed, "output": out})
            ok = True
            break
        if "FAIL" in out and "locked" not in out.lower():
            results.append({"family": fam, "ok": False, "attempt": attempt, "elapsed": elapsed, "output": out})
            ok = True  # don't retry non-lock failures forever
            break
        print(f"retrying {fam} after lock/fail...", flush=True)
        time.sleep(min(45, 3 * attempt))
    if not ok:
        results.append({"family": fam, "ok": False, "attempt": 12, "elapsed": None, "output": "gave up"})

# summary
print("\n===== SUMMARY =====", flush=True)
for r in results:
    print(f"{r['family']}: ok={r['ok']} attempt={r['attempt']} elapsed={r['elapsed']}", flush=True)
all_ok = all(r.get("ok") for r in results)
sys.exit(0 if all_ok else 1)
