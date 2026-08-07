import sqlite3, time
from pathlib import Path
log = Path(r"C:\Users\cmgwe\AppData\Local\Temp\_alc_verify.log")
def w(m):
    line=f"{time.strftime('%H:%M:%S')} {m}"
    print(line, flush=True)
    with log.open("a", encoding="utf-8") as f: f.write(line+"\n"); f.flush()
log.write_text("", encoding="utf-8")
p = Path(r"y:\Digital Stealth Care\Projects\DSC-HUB\brain\data\dsc_brain.sqlite3")
w("wait unlock for verify")
for i in range(1, 120):
    try:
        c = sqlite3.connect(str(p), timeout=3)
        c.execute("BEGIN IMMEDIATE"); c.rollback()
        w(f"unlocked {i}")
        break
    except Exception as e:
        if i==1 or i%5==0: w(f"locked {i} {e}")
        time.sleep(6)
else:
    w("timeout"); raise SystemExit(2)
c = sqlite3.connect(str(p), timeout=30)
c.row_factory = sqlite3.Row
sid="alchimia"
by={
 "source": list(c.execute("SELECT id,name FROM source_record WHERE id=?", (sid,)).fetchone() or []),
 "variant": c.execute("SELECT COUNT(*) FROM strain_variant WHERE source_id=?", (sid,)).fetchone()[0],
 "chem": c.execute("SELECT COUNT(*) FROM chemistry_profile WHERE source_id=?", (sid,)).fetchone()[0],
 "grow": c.execute("SELECT COUNT(*) FROM grow_trait WHERE source_id=?", (sid,)).fetchone()[0],
 "links": c.execute("SELECT COUNT(*) FROM entity_link WHERE source_id=?", (sid,)).fetchone()[0],
}
# also any id like
try:
  by["source_like"] = [dict(r) for r in c.execute("SELECT id,name FROM source_record WHERE lower(id) LIKE '%alchimia%' OR lower(COALESCE(name,'')) LIKE '%alchimia%'")]
except Exception as e:
  by["source_like_err"]=str(e)
c.close()
w("RESULT "+str(by))
Path(r"y:\Digital Stealth Care\Projects\DSC-HUB\brain\data\_alchimia_verify.json").write_text(__import__("json").dumps(by, indent=2), encoding="utf-8")
