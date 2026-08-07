import json, sys, time, traceback
from pathlib import Path

ROOT = Path('.').resolve()
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / 'scripts'))
LOG = ROOT / '_merge_forums_final.log'
LOG.write_text('', encoding='utf-8')

def log(m):
    line = m.rstrip() + '\n'
    print(line, end='', flush=True)
    LOG.open('a', encoding='utf-8').write(line)

FAMILIES = ['forum_420mag', 'forum_phenohunter', 'forum_mjpassion']

def competitors():
    # lightweight: look for lock via BEGIN IMMEDIATE only
    return None

def main():
    from brain.dsc_brain.corpus import connect, corpus_stats, init_corpus
    from brain.dsc_brain.paths import DEFAULT_DB, STAGING_DIR
    from merge_staging_to_master import merge_one

    log(f'START {time.strftime("%Y-%m-%dT%H:%M:%S")}')
    master = None
    for i in range(1, 241):  # ~2h @ 30s
        try:
            init_corpus(DEFAULT_DB)
            master = connect(DEFAULT_DB, timeout=20.0)
            master.execute('PRAGMA busy_timeout=120000')
            master.execute('BEGIN IMMEDIATE')
            master.execute('COMMIT')
            log(f'MASTER_OPEN attempt={i}')
            break
        except Exception as e:
            log(f'wait {i}: {e}')
            try:
                master.close()
            except Exception:
                pass
            master = None
            time.sleep(30)
    if master is None:
        log('GAVE_UP')
        return 2

    before = corpus_stats(master)
    log('BEFORE ' + json.dumps(before, default=str))
    results = []
    for fam in FAMILIES:
        path = STAGING_DIR / f'{fam}.sqlite3'
        for attempt in range(1, 21):
            try:
                st = merge_one(master, path, include_raw=False)
                master.commit()
                log(f'OK {fam} attempt={attempt} ' + json.dumps(st, default=str))
                results.append({'family': fam, 'status': 'ok', 'attempt': attempt, **st})
                break
            except Exception as e:
                try:
                    master.rollback()
                except Exception:
                    pass
                log(f'FAIL {fam} attempt={attempt}: {e}')
                if 'locked' in str(e).lower() or 'busy' in str(e).lower():
                    time.sleep(10 * attempt)
                    # reopen
                    try:
                        master.close()
                    except Exception:
                        pass
                    for j in range(40):
                        try:
                            master = connect(DEFAULT_DB, timeout=20.0)
                            master.execute('PRAGMA busy_timeout=120000')
                            master.execute('BEGIN IMMEDIATE')
                            master.execute('COMMIT')
                            log(f'REOPEN {j}')
                            break
                        except Exception as e2:
                            log(f'reopen wait {j}: {e2}')
                            time.sleep(15)
                    continue
                results.append({'family': fam, 'status': 'error', 'error': str(e)})
                break
        else:
            results.append({'family': fam, 'status': 'gave_up'})

    after = corpus_stats(master)
    # verify counts in master
    verify = {}
    for fam in FAMILIES:
        verify[fam] = {
            'source': master.execute('SELECT COUNT(*) FROM source_record WHERE id=?', (fam,)).fetchone()[0],
            'canonical_via_name': None,
            'grow': master.execute('SELECT COUNT(*) FROM grow_trait WHERE source_id=?', (fam,)).fetchone()[0],
            'variant': master.execute('SELECT COUNT(*) FROM strain_variant WHERE source_id=?', (fam,)).fetchone()[0],
        }
    master.close()
    summary = {'results': results, 'before': before, 'after': after, 'verify': verify, 'ha_indexes': 'skipped'}
    log('SUMMARY ' + json.dumps(summary, indent=2, default=str))
    ok = all(r.get('status') == 'ok' for r in results)
    log('DONE ok=' + str(ok))
    return 0 if ok else 1

raise SystemExit(main())
