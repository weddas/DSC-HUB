import subprocess, sys
from pathlib import Path
ROOT = Path(r"y:\Digital Stealth Care\Projects\DSC-HUB")
out = open(ROOT/"brain/data/staging/leafly_flat_enrich_apply_run.log","w",encoding="utf-8",buffering=1)
err = open(ROOT/"brain/data/staging/leafly_flat_enrich_apply_stderr.txt","w",encoding="utf-8",buffering=1)
done = ROOT/"brain/data/staging/leafly_flat_enrich_apply_result.txt"
p = subprocess.run(
    [r"C:\Program Files\Python314\python.exe","-u",str(ROOT/"scripts"/"enrich_leafly_flat.py"),"--apply-from-staging"],
    cwd=str(ROOT), stdout=out, stderr=err,
)
out.close(); err.close()
if p.returncode != 0:
    # fallback
    out = open(ROOT/"brain/data/staging/leafly_flat_enrich_apply_run.log","a",encoding="utf-8",buffering=1)
    err = open(ROOT/"brain/data/staging/leafly_flat_enrich_apply_stderr.txt","a",encoding="utf-8",buffering=1)
    out.write("\n===== FALLBACK merge_staging =====\n"); out.flush()
    p2 = subprocess.run(
        [r"C:\Program Files\Python314\python.exe","-u",str(ROOT/"scripts"/"merge_staging_to_master.py"),"--only","leafly_flat_enrich"],
        cwd=str(ROOT), stdout=out, stderr=err,
    )
    out.close(); err.close()
    done.write_text(f"fallback_rc={p2.returncode} enrich_rc={p.returncode}\n", encoding="utf-8")
    raise SystemExit(p2.returncode)
done.write_text(f"enrich_rc=0\n", encoding="utf-8")
raise SystemExit(0)
