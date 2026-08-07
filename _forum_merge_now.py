import json, sys
from pathlib import Path
sys.path.insert(0, '.')
sys.path.insert(0, 'scripts')
from brain.dsc_brain.corpus import connect, corpus_stats, init_corpus
from brain.dsc_brain.paths import DEFAULT_DB, STAGING_DIR
from merge_staging_to_master import merge_one

FAMILIES = ['forum_420mag', 'forum_phenohunter', 'forum_mjpassion']
print('START', flush=True)
init_corpus(DEFAULT_DB)
master = connect(DEFAULT_DB, timeout=120.0)
master.execute('PRAGMA busy_timeout=180000')
# clear any implicit txn from connect/init
try:
    master.commit()
except Exception:
    pass
before = corpus_stats(master)
print('BEFORE', json.dumps(before), flush=True)
results = []
for fam in FAMILIES:
    path = STAGING_DIR / f'{fam}.sqlite3'
    print('MERGE', fam, flush=True)
    attempt = 0
    while attempt < 12:
        attempt += 1
        try:
            st = merge_one(master, path, include_raw=False)
            master.commit()
            print('OK', fam, 'attempt', attempt, json.dumps(st, default=str), flush=True)
            results.append({'family': fam, 'status': 'ok', 'attempt': attempt, **st})
            break
        except Exception as e:
            print('FAIL', fam, 'attempt', attempt, e, flush=True)
            try:
                master.rollback()
            except Exception:
                pass
            if 'locked' in str(e).lower() or 'busy' in str(e).lower():
                import time
                time.sleep(min(40, 3 * attempt))
                continue
            results.append({'family': fam, 'status': 'error', 'error': str(e), 'attempt': attempt})
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
Path('_forum_merge_results.json').write_text(json.dumps(out, indent=2, default=str), encoding='utf-8')
print(json.dumps(out, indent=2, default=str), flush=True)
print('DONE', flush=True)
ok = all(r.get('status') == 'ok' for r in results)
raise SystemExit(0 if ok else 1)
