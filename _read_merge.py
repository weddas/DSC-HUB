from pathlib import Path
print('go', flush=True)
p=Path('scripts/merge_staging_to_master.py')
print('size', p.stat().st_size, flush=True)
s=p.read_text(encoding='utf-8')
print('read', len(s), flush=True)
import ast
ast.parse(s)
print('ast ok', flush=True)
