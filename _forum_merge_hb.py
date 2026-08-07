import json, sys, time, threading
from pathlib import Path
sys.path.insert(0, '.')
sys.path.insert(0, 'scripts')
HB = Path('_forum_hb.txt')
LOG = Path('_forum_merge_results.json')

def heartbeat():
    while True:
        HB.write_text(time.strftime('%H:%M:%S') + '\n', encoding='utf-8')
        time.sleep(5)

threading.Thread(target=heartbeat, daemon=True).start()

def p(msg):
    print(msg, flush=True)
    Path('_forum_progress.log').open('a', encoding='utf-8').write(msg + '\n')

Path('_forum_progress.log').write_text('', encoding='utf-8')
p('boot')

from brain.dsc_brain.corpus import connect, corpus_stats
from brain.dsc_brain.paths import DEFAULT_DB, STAGING_DIR
from merge_staging_to_master import merge_one
p('imports ok')

FAMILIES = ['forum_420mag', 'forum_phenohunter', 'forum_mjpassion']

# Wait until we can write
master = None
for i in range(1, 200):
    p(f'connect attempt {i}')
    try:
        master = connect(DEFAULT_DB, timeout=15.0)
        master.execute('PRAGMA busy_timeout=15000')
        try:
            master.commit()
        except Exception:
            pass
        # probe write
        master.execute("UPDATE meta SET value=value WHERE key='corpus_schema_version'")
        master.commit()
        p(f'write probe ok attempt={i}')
        break
    except Exception as e:
        p(f'connect/write wait {i}: {e}')
        try:
            if master is not None:
                master.close()
        except Exception:
            pass
        master = None
        time.sleep(20)

if master is None:
    p('GAVE_UP')
    raise SystemExit(2)

master.execute('PRAGMA busy_timeout=300000')
before = corpus_stats(master)
p('BEFORE ' + json.dumps(before))

results = []
for fam in FAMILIES:
    path = STAGING_DIR / f'{fam}.sqlite3'
    p(f'MERGE {fam}')
    for attempt in range(1, 16):
        try:
            st = merge_one(master, path, include_raw=False)
            master.commit()
            p(f'OK {fam} attempt={attempt} ' + json.dumps(st, default=str))
            results.append({'family': fam, 'status': 'ok', 'attempt': attempt, **st})
            break
        except Exception as e:
            p(f'FAIL {fam} attempt={attempt}: {e}')
            try:
                master.rollback()
            except Exception:
                pass
            if 'locked' in str(e).lower() or 'busy' in str(e).lower():
                time.sleep(min(45, 5 * attempt))
                continue
            results.append({'family': fam, 'status': 'error', 'error': str(e)})
            break
    else:
        results.append({'family': fam, 'status': 'gave_up'})

after = corpus_stats(master)
verify = {}
for fam in FAMILIES:
    verify[fam] = {
        'source_record': master.execute('SELECT COUNT(*) FROM source_record WHERE id=?', (fam,)).fetchone()[0],
        'grow_trait': master.execute('SELECT COUNT(*) FROM grow_trait WHERE source_id=?', (fam,)).fetchone()[0],
        'strain_variant': master.execute('SELECT COUNT(*) FROM strain_variant WHERE source_id=?', (fam,)).fetchone()[0],
        'chemistry_profile': master.execute('SELECT COUNT(*) FROM chemistry_profile WHERE source_id=?', (fam,)).fetchone()[0],
    }
master.close()
out = {'results': results, 'before': before, 'after': after, 'verify': verify, 'ha_indexes': 'skipped'}
LOG.write_text(json.dumps(out, indent=2, default=str), encoding='utf-8')
p('SUMMARY written')
p(json.dumps(out, indent=2, default=str))
ok = all(r.get('status') == 'ok' for r in results)
p('DONE ok=' + str(ok))
raise SystemExit(0 if ok else 1)
