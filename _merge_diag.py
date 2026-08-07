from pathlib import Path
LOG = Path('_merge_diag.log')
LOG.write_text('boot\n', encoding='utf-8')
def w(m):
    LOG.open('a', encoding='utf-8').write(m + '\n')
    print(m, flush=True)
w('1 after boot')
import sys
sys.path.insert(0, '.')
sys.path.insert(0, 'scripts')
w('2 path ok')
from brain.dsc_brain.paths import DEFAULT_DB, STAGING_DIR
w(f'3 paths {DEFAULT_DB}')
from brain.dsc_brain.corpus import connect, corpus_stats, init_corpus
w('4 corpus ok')
from merge_staging_to_master import merge_one
w('5 merge_one ok')
init_corpus(DEFAULT_DB)
w('6 init ok')
m = connect(DEFAULT_DB, timeout=30.0)
w('7 connected')
m.execute('PRAGMA busy_timeout=60000')
try:
    m.execute('BEGIN IMMEDIATE')
    m.execute('COMMIT')
    w('8 write lock ok')
except Exception as e:
    w(f'8 lock fail: {e}')
    raise
st = merge_one(m, STAGING_DIR / 'forum_420mag.sqlite3', include_raw=False)
m.commit()
w('9 merged ' + str(st))
m.close()
w('DONE')
